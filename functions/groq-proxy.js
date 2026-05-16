const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MAX_BODY_CHARS = 8000;
const MAX_REQUESTS_PER_HOUR = 20;
const rateLimit = new Map();

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

function clientIpFromHeaders(headers) {
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-nf-client-connection-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function isRateLimited(ip) {
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;
  const current = (rateLimit.get(ip) || []).filter((timestamp) => timestamp > hourAgo);
  if (current.length >= MAX_REQUESTS_PER_HOUR) {
    rateLimit.set(ip, current);
    return true;
  }
  current.push(now);
  rateLimit.set(ip, current);
  return false;
}

async function handleRequest(request, env = {}) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const ip = clientIpFromHeaders(request.headers);
  if (isRateLimited(ip)) {
    return jsonResponse({ error: "Rate limit exceeded" }, 429);
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_CHARS) {
    return jsonResponse({ error: "Request too large" }, 413);
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return jsonResponse({ error: "Invalid JSON" }, 400);
  }

  const payload = {
    messages: Array.isArray(body.messages) ? body.messages : [],
    model: body.model || "llama-3.3-70b-versatile",
    max_tokens: Number(body.max_tokens) || 1100,
    temperature: typeof body.temperature === "number" ? body.temperature : 0.75
  };

  if (!payload.messages.length) {
    return jsonResponse({ error: "messages are required" }, 400);
  }

  if (JSON.stringify(payload).length > MAX_BODY_CHARS) {
    return jsonResponse({ error: "Request too large" }, 413);
  }

  const apiKey = env.GROQ_API_KEY || globalThis.process?.env?.GROQ_API_KEY;
  if (!apiKey) {
    return jsonResponse({ error: "GROQ_API_KEY is not configured" }, 500);
  }

  const groqResponse = await fetch(GROQ_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  const data = await groqResponse.json().catch(() => ({ error: "Invalid Groq response" }));
  return jsonResponse(data, groqResponse.status);
}

export default {
  fetch(request, env) {
    return handleRequest(request, env);
  }
};

export async function handler(event) {
  const request = new Request("https://local.netlify/groq-proxy", {
    method: event.httpMethod,
    headers: event.headers,
    body: event.body || null
  });
  const response = await handleRequest(request);
  return {
    statusCode: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body: await response.text()
  };
}
