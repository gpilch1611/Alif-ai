import { readFile } from "node:fs/promises";

const appJs = await readFile(new URL("../app.js", import.meta.url), "utf8");
const swJs = await readFile(new URL("../service-worker.js", import.meta.url), "utf8");
const stylesCss = await readFile(new URL("../styles.css", import.meta.url), "utf8");

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const count = (text, pattern) => (text.match(pattern) || []).length;

assert(count(appJs, /const learnedSurahs =/g) === 1, "home() has duplicated learnedSurahs declarations.");
assert(count(appJs, /const favoriteGroups = homeFavoriteGroups/g) === 1, "home() should build favorite groups once.");
assert(appJs.includes("function homeFavoriteGroups()"), "home favorites grouped helper is missing.");
assert(appJs.includes("function homeFavoritesCarousel("), "home favorites carousel helper is missing.");
assert(appJs.includes("function setTrustedHtml("), "central trusted HTML helper is missing.");
assert(appJs.includes("function appendTextBlock("), "safe text DOM helper is missing.");
assert(appJs.includes('box.textContent = "";'), "AI message list should clear via textContent, not user/API HTML.");
assert(
  appJs.includes('appendTextBlock(article, "p", "whitespace-pre-wrap", message.content)'),
  "AI messages should render user/API text via textContent."
);
assert(!appJs.includes("box.innerHTML = state.aiMessages.map"), "AI messages still render through innerHTML mapping.");
assert(appJs.includes("religious-risk-note"), "High-risk religious note UI is missing.");
assert(appJs.includes("trust-badge high-risk"), "High-risk religious badge is missing.");
assert(
  !appJs.includes("FAQ_REFERENCE_FIXES"),
  "app.js should not keep FAQ_REFERENCE_FIXES after FAQ metadata migration to data.js."
);
assert(
  !appJs.includes("faqExtraUnique"),
  "app.js should not define or render faqExtraUnique after FAQ migration to data.js."
);
assert(
  !/extra\s+FAQ/i.test(appJs),
  "app.js should not keep extra FAQ migration-era wording after FAQ migration to data.js."
);
assert(!/romantic|romance|ROMANTIC|love-toast/i.test(appJs), "Personal romantic UI should not return to app.js.");
assert(!appJs.includes("showLoveToast"), "Toast helper should keep neutral product naming.");
assert(!/romantic|romance|love-toast/i.test(stylesCss), "Personal romantic styles should not return to styles.css.");
assert(
  !/poland_ar|warsaw_ar|indonesia_ar|surabaya_ar|borze_ar/.test(appJs),
  "Local place vocabulary lessons should stay removed."
);
assert(!/zakat|Zakat/.test(appJs), "Zakat calculator should stay removed from app.js.");
assert(!/zakat|Zakat/.test(stylesCss), "Zakat calculator styles should stay removed from styles.css.");
assert(appJs.includes("muallafChecklist"), "Muallaf 30/90 checklist state is missing.");
assert(appJs.includes("Plan 30/90 dni po szahadzie"), "Muallaf 30/90 checklist UI is missing.");
assert(appJs.includes("Pierwsze 7 dni: spokojny start"), "Muallaf 7-day starter plan is missing.");
assert(!appJs.includes("adventure: learningJournal"), "Public learning journal route should stay removed.");
assert(appJs.includes("function systemActivityEvents()"), "Settings system activity events helper is missing.");
assert(appJs.includes("Dane i historia aktywnosci"), "Settings activity history panel is missing.");
assert(!appJs.includes("Dziennik nauki"), "Public learning journal label should stay removed.");
assert(appJs.includes("function renderHifzTab()"), "Short surah learning mode is missing.");
assert(appJs.includes("function prayerJournalHtml()"), "Prayer journal UI is missing.");
assert(
  appJs.includes('from "./data/prayer-mode.js"'),
  "Prayer Mode static data should be imported from data/prayer-mode.js."
);
assert(!appJs.includes("const PRAYER_GUIDE_CORE_STEPS ="), "Prayer guide steps should stay out of app.js.");
assert(!appJs.includes("const WUDU_STEPS ="), "Wudu static steps should stay out of app.js.");
assert(appJs.includes('from "./data/quran-mode.js"'), "Quran static data should be imported from data/quran-mode.js.");
assert(!appJs.includes("const SURAH_LIST ="), "Quran surah list should stay out of app.js.");
assert(!appJs.includes("const DUA_SOURCE_MAP ="), "Dua source map should stay out of app.js.");
assert(!appJs.includes("_legacyPrayer"), "Legacy Prayer Mode implementations should stay removed.");
assert(!appJs.includes("prayerClockInterval"), "Removed live-clock timer code should not return.");
assert(!appJs.includes("compassWatchId"), "Removed device-orientation compass code should not return.");
assert(appJs.includes("function glossary()"), "Islamic glossary route is missing.");
assert(appJs.includes("function history()"), "History route is missing.");
assert(appJs.includes('from "./data/history.js"'), "History static data should be imported from data/history.js.");
assert(!appJs.includes('"seerah"'), "Public Seerah route should stay removed.");
assert(!appJs.includes("function seerah()"), "Standalone Seerah view should stay removed.");
assert(appJs.includes("function renderHistoryQuiz()"), "History quiz renderer is missing.");
assert(appJs.includes("historyQuizStats"), "History quiz state is missing.");
assert(appJs.includes("function nextStepSuggestion()"), "Home next-step recommendation is missing.");
assert(appJs.includes("Prywatnosc danych"), "Settings privacy section is missing.");
assert(appJs.includes("function normalizeRoute()"), "Unknown route normalization is missing.");
assert(appJs.includes("function readImportedState("), "Import validation helper is missing.");
assert(appJs.includes('app: "Alif AI"'), "Progress export metadata is missing.");
assert(appJs.includes("function onboardingPanel()"), "Home onboarding panel is missing.");
assert(appJs.includes("restartOnboardingBtn"), "Settings should allow restarting onboarding.");
assert(appJs.includes("Backup i przenoszenie danych"), "Backup/privacy settings panel is missing.");
assert(!appJs.includes("home-quick-card"), "Home quick cards should stay removed.");
assert(!stylesCss.includes(".home-quick-card"), "Home quick card styles should stay removed.");
assert(stylesCss.includes(".home-carousel-track"), "Home favorites carousel track styles are missing.");
assert(stylesCss.includes(".home-carousel-card"), "Home favorites carousel card styles are missing.");
assert(stylesCss.includes(".home-stat-card"), "Home stat card overflow-safe styles are missing.");
assert(stylesCss.includes(".onboarding-choice"), "Onboarding responsive styles are missing.");
assert(appJs.includes("calendar: islamicCalendar"), "Islamic calendar route is missing.");
assert(appJs.includes("function islamicCalendar()"), "Islamic calendar view is missing.");
assert(stylesCss.includes(".calendar-month-card"), "Islamic calendar month card styles are missing.");
assert(stylesCss.includes(".hijri-widget"), "Hijri widget styles are missing.");
assert(appJs.includes("review: reviewCenter"), "Active mistakes review route is missing.");
assert(appJs.includes("function reviewCenter()"), "Active mistakes review center is missing.");
assert(stylesCss.includes(".review-card"), "Active mistakes review card styles are missing.");
assert(!appJs.includes('["adventure"'), "Learning journal should stay out of main navigation.");
assert(appJs.includes("reviewMistakes"), "Active review mistakes state is missing.");
assert(appJs.includes("function renderAsmaChallenge()"), "Asma challenge renderer is missing.");
assert(appJs.includes("function asmaChallengeAliases("), "Asma challenge alias matching is missing.");
assert(appJs.includes('quranTab: "surahs"'), "Home favorite surahs should switch Quran to the Surahs tab.");
assert(
  swJs.includes("Response.error()"),
  "service worker should not fallback to index.html for failed asset requests."
);
for (const path of [
  "./data/content-metadata.js",
  "./data/history.js",
  "./data/halal-haram.js",
  "./data/islamic-faq.js",
  "./data/islamic-hadith.js",
  "./data/prayer-mode.js",
  "./data/quran-mode.js",
  "./data/quran-surahs.js"
]) {
  assert(swJs.includes(path), `service worker should precache ${path}.`);
}

if (failures.length) {
  console.error("Code health validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Code health validation passed.");
