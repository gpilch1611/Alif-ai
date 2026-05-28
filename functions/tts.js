const MAX_TEXT_CHARS = 500;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS"
};

function textFromUrl(request) {
  const url = new URL(request.url);
  return (url.searchParams.get("text") || url.searchParams.get("q") || "").trim();
}

async function handleRequest(request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const text = textFromUrl(request);
  if (!text) {
    return new Response("Missing text", { status: 400, headers: corsHeaders });
  }

  if (text.length > MAX_TEXT_CHARS) {
    return new Response("Text too long", { status: 413, headers: corsHeaders });
  }

  const ttsUrl = `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=ar&ttsspeed=0.65&q=${encodeURIComponent(text)}`;
  const ttsResponse = await fetch(ttsUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 Alif-AI"
    }
  });

  if (!ttsResponse.ok) {
    return new Response("TTS unavailable", { status: 502, headers: corsHeaders });
  }

  const audio = await ttsResponse.arrayBuffer();
  return new Response(audio, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}

export default {
  fetch(request) {
    return handleRequest(request);
  }
};

export async function handler(event) {
  const query = event.rawQuery ? `?${event.rawQuery}` : "";
  const request = new Request(`https://local.netlify/tts${query}`, {
    method: event.httpMethod,
    headers: event.headers
  });
  const response = await handleRequest(request);
  const body = Buffer.from(await response.arrayBuffer()).toString("base64");
  return {
    statusCode: response.status,
    isBase64Encoded: response.headers.get("Content-Type") === "audio/mpeg",
    headers: Object.fromEntries(response.headers.entries()),
    body
  };
}
