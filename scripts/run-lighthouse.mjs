import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { get } from "node:http";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";

const appPort = process.env.PORT || "4173";
const chromePort = process.env.LIGHTHOUSE_CHROME_PORT || "9222";
const appUrl = `http://127.0.0.1:${appPort}/`;
const reportBase = resolve("lighthouse-report", "alif-ai");
const profileDir = resolve(".lighthouse-profile");
const lighthouseCli = fileURLToPath(import.meta.resolve("lighthouse/cli/index.js"));

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe"
  ].filter(Boolean);
  const found = candidates.find((candidate) => existsSync(candidate));
  if (!found) throw new Error("Chrome or Edge executable was not found.");
  return found;
}

function waitForUrl(targetUrl, timeoutMs = 15_000) {
  const startedAt = Date.now();
  return new Promise((resolveWait, reject) => {
    const check = () => {
      const request = get(targetUrl, (response) => {
        response.resume();
        resolveWait();
      });
      request.on("error", () => {
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error(`Timed out waiting for ${targetUrl}`));
          return;
        }
        setTimeout(check, 250);
      });
    };
    check();
  });
}

function run(command, args, options = {}) {
  return spawn(command, args, { stdio: "inherit", ...options });
}

await mkdir(resolve("lighthouse-report"), { recursive: true });
await mkdir(profileDir, { recursive: true });

const server = run(process.execPath, ["scripts/serve-static.mjs"], {
  env: { ...process.env, PORT: appPort },
  stdio: ["ignore", "pipe", "inherit"]
});
server.stdout?.on("data", (chunk) => process.stdout.write(chunk));

let chrome;
let exitCode;
try {
  await waitForUrl(appUrl);
  chrome = run(findChrome(), [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${chromePort}`,
    `--user-data-dir=${profileDir}`,
    "about:blank"
  ]);
  await waitForUrl(`http://127.0.0.1:${chromePort}/json/version`);

  const lighthouse = run(process.execPath, [
    lighthouseCli,
    appUrl,
    `--port=${chromePort}`,
    "--preset=desktop",
    "--output=html",
    "--output=json",
    `--output-path=${reportBase}`,
    "--only-categories=performance,accessibility,best-practices,seo"
  ]);
  const [code] = await once(lighthouse, "exit");
  exitCode = Number(code || 0);
} finally {
  if (chrome && !chrome.killed) chrome.kill();
  if (!server.killed) server.kill();
}

process.exit(exitCode);
