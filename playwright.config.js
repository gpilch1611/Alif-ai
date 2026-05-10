import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:4173",
    channel: process.env.PLAYWRIGHT_CHANNEL || "chrome",
    trace: "on-first-retry",
    screenshot: "only-on-failure"
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 842, height: 823 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } }
  ]
});
