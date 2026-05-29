import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import groqProxy from "../functions/groq-proxy.js";

const root = process.cwd();
const port = Number(process.env.PORT || 4173);
const types = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mp3": "audio/mpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

function readRequestBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    const chunks = [];
    request.on("data", (chunk) => chunks.push(chunk));
    request.on("end", () => resolveBody(Buffer.concat(chunks)));
    request.on("error", rejectBody);
  });
}

function headersFromNodeRequest(request) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers)) {
    if (Array.isArray(value)) {
      value.forEach((item) => headers.append(name, item));
    } else if (value) {
      headers.set(name, value);
    }
  }
  return headers;
}

async function sendFetchResponse(nodeResponse, fetchResponse) {
  const headers = Object.fromEntries(fetchResponse.headers.entries());
  const body = Buffer.from(await fetchResponse.arrayBuffer());
  nodeResponse.writeHead(fetchResponse.status, headers);
  nodeResponse.end(body);
}

createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", "http://127.0.0.1");
    if (url.pathname === "/api/groq-proxy" || url.pathname === "/.netlify/functions/groq-proxy") {
      const body = request.method === "GET" || request.method === "HEAD" ? null : await readRequestBody(request);
      const proxyRequest = new Request(`http://127.0.0.1:${port}${url.pathname}`, {
        method: request.method,
        headers: headersFromNodeRequest(request),
        body
      });
      const proxyResponse = await groqProxy.fetch(proxyRequest, process.env);
      await sendFetchResponse(response, proxyResponse);
      return;
    }

    if (url.pathname === "/api/tts" || url.pathname === "/.netlify/functions/tts") {
      const text = (url.searchParams.get("text") || url.searchParams.get("q") || "").trim();
      if (!text) {
        response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Missing text");
        return;
      }
      if (text.length > 500) {
        response.writeHead(413, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("Text too long");
        return;
      }
      const ttsUrl = `https://translate.googleapis.com/translate_tts?ie=UTF-8&client=gtx&tl=ar&ttsspeed=0.65&q=${encodeURIComponent(text)}`;
      const ttsResponse = await fetch(ttsUrl, { headers: { "User-Agent": "Mozilla/5.0 Alif-AI" } });
      if (!ttsResponse.ok) {
        response.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("TTS unavailable");
        return;
      }
      const audio = Buffer.from(await ttsResponse.arrayBuffer());
      response.writeHead(200, {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable"
      });
      response.end(audio);
      return;
    }

    const relativePath = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
    const filePath = resolve(root, relativePath);
    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    const body = await readFile(filePath);
    response.writeHead(200, { "Content-Type": types[extname(filePath)] || "application/octet-stream" });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`Alif AI test server: http://127.0.0.1:${port}`);
});
