import { readFile } from "node:fs/promises";

const appJs = await readFile(new URL("../app.js", import.meta.url), "utf8");
const swJs = await readFile(new URL("../service-worker.js", import.meta.url), "utf8");

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const count = (text, pattern) => (text.match(pattern) || []).length;

assert(count(appJs, /const learnedSurahs =/g) === 1, "home() has duplicated learnedSurahs declarations.");
assert(count(appJs, /const homeFavItems =/g) === 1, "home() has duplicated homeFavItems declarations.");
assert(appJs.includes("function homeFavoriteItems()"), "home favorites helper is missing.");
assert(appJs.includes("function setTrustedHtml("), "central trusted HTML helper is missing.");
assert(appJs.includes("function appendTextBlock("), "safe text DOM helper is missing.");
assert(appJs.includes("box.textContent = \"\";"), "AI message list should clear via textContent, not user/API HTML.");
assert(appJs.includes("appendTextBlock(article, \"p\", \"whitespace-pre-wrap\", message.content)"), "AI messages should render user/API text via textContent.");
assert(!appJs.includes("box.innerHTML = state.aiMessages.map"), "AI messages still render through innerHTML mapping.");
assert(appJs.includes("religious-risk-note"), "High-risk religious note UI is missing.");
assert(appJs.includes("trust-badge high-risk"), "High-risk religious badge is missing.");
assert(appJs.includes("function zakat()"), "Zakat calculator view is missing.");
assert(appJs.includes("muallafChecklist"), "Muallaf 30/90 checklist state is missing.");
assert(appJs.includes("Plan 30/90 dni po szahadzie"), "Muallaf 30/90 checklist UI is missing.");
assert(appJs.includes('"zakat"'), "Zakat route is missing.");
assert(swJs.includes("Response.error()"), "service worker should not fallback to index.html for failed asset requests.");

if (failures.length) {
  console.error("Code health validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Code health validation passed.");
