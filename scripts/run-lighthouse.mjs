import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { spawn } from "node:child_process";
import { once } from "node:events";

const tmpDir = resolve(".lighthouse-tmp");
await mkdir(tmpDir, { recursive: true });

const lhciCli = "node_modules/@lhci/cli/src/cli.js";
const child = spawn(process.execPath, [lhciCli, "autorun", ...process.argv.slice(2)], {
  stdio: "inherit",
  env: {
    ...process.env,
    TEMP: tmpDir,
    TMP: tmpDir
  }
});

const [code] = await once(child, "exit");
process.exit(Number(code || 0));
