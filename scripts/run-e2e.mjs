import { spawn } from "node:child_process";
import { once } from "node:events";
import { get } from "node:http";
import { setTimeout as delay } from "node:timers/promises";

const port = process.env.PORT || "4173";
const url = `http://127.0.0.1:${port}`;
const args = process.argv.slice(2);
const playwrightCli = "node_modules/playwright/cli.js";

function waitForServer(targetUrl, timeoutMs = 15_000) {
  const startedAt = Date.now();
  return new Promise((resolve, reject) => {
    const check = () => {
      const request = get(targetUrl, (response) => {
        response.resume();
        resolve();
      });
      request.on("error", () => {
        if (Date.now() - startedAt > timeoutMs) {
          reject(new Error(`Server did not start at ${targetUrl}`));
          return;
        }
        setTimeout(check, 250);
      });
    };
    check();
  });
}

function run(command, commandArgs, options = {}) {
  const child = spawn(command, commandArgs, {
    stdio: "inherit",
    ...options
  });
  return child;
}

const server = run(process.execPath, ["scripts/serve-static.mjs"], {
  env: { ...process.env, PORT: port },
  stdio: ["ignore", "pipe", "inherit"]
});
server.stdout?.on("data", (chunk) => process.stdout.write(chunk));

let exitCode;
try {
  await waitForServer(url);
  const testArgs = ["test", ...args];
  const tests = run(process.execPath, [playwrightCli, ...testArgs]);
  const [code] = await once(tests, "exit");
  exitCode = Number(code || 0);
  await delay(100);
} finally {
  if (!server.killed) server.kill();
}

process.exit(exitCode ?? 1);
