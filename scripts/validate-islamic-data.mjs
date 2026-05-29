import { readFile } from "node:fs/promises";
import { asmaulHusna, islamicFaq, islamicHadith, islamicMonths, quranSurahs, words } from "../data.js";
import { historyContent } from "../data/history.js";
import { AQIDAH_BASICS, MUALLAF_GUIDANCE, RAMADAN_GUIDE, ZAKAT_BASICS } from "../data/islamic-core.js";
import {
  GHUSL_GUIDE,
  PRAYER_AFTER_SALAH_ADHKAR,
  PRAYER_GUIDE_CORE_STEPS,
  PRAYER_SUNNAH_TRAVEL,
  WUDU_INVALIDATORS
} from "../data/prayer-mode.js";
import { DUA_DATA } from "../data/quran-mode.js";

const appJs = await readFile(new URL("../app.js", import.meta.url), "utf8");

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const validConfidence = new Set(["VERIFIED", "CONTEXT_DEPENDENT", "SCHOLARLY_DISAGREEMENT", "HIGH_RISK", "UNVERIFIED"]);

const hasText = (value) => typeof value === "string" && value.trim().length > 0;
const isIsoDate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ""));

assert(quranSurahs.length === 114, `Expected 114 surahs, got ${quranSurahs.length}.`);
assert(asmaulHusna.length === 99, `Expected 99 Asmaul Husna names, got ${asmaulHusna.length}.`);
assert(islamicMonths.length === 12, `Expected 12 Islamic months, got ${islamicMonths.length}.`);
assert(
  islamicHadith.length === 40,
  `Expected the curated hadith list to contain 40 verified items, got ${islamicHadith.length}.`
);
assert(islamicFaq.length === 44, `Expected 44 FAQ items in data.js after migration, got ${islamicFaq.length}.`);
assert(DUA_DATA.length >= 30, `Expected at least 30 dua/adhkar items, got ${DUA_DATA.length}.`);
assert(
  historyContent.timeline.length >= 25,
  `Expected at least 25 history timeline events, got ${historyContent.timeline.length}.`
);
assert(
  historyContent.prophets.length >= 8,
  `Expected at least 8 prophet profiles, got ${historyContent.prophets.length}.`
);
assert(historyContent.angels.length >= 6, `Expected at least 6 angel entries, got ${historyContent.angels.length}.`);
assert(
  historyContent.stories.length >= 50,
  `Expected at least 50 history stories, got ${historyContent.stories.length}.`
);
assert(
  historyContent.insightBubbles?.length >= 50,
  `Expected at least 50 history insight bubbles, got ${historyContent.insightBubbles?.length || 0}.`
);
for (const localWordId of ["polska", "warsaw", "indonesia", "surabaya", "borze"]) {
  assert(!words.some((word) => word.id === localWordId), `Local vocabulary word should stay removed: ${localWordId}.`);
}

const surahNumbers = new Set(quranSurahs.map((surah) => surah.number));
for (let number = 1; number <= 114; number += 1) {
  assert(surahNumbers.has(number), `Missing surah number ${number}.`);
}

const faqIds = new Set();
for (const item of islamicFaq) {
  assert(!faqIds.has(item.id), `Duplicate FAQ id: ${item.id}.`);
  faqIds.add(item.id);
  assert(item.qPl && item.qEn && item.aPl && item.aEn, `FAQ ${item.id} is missing text.`);
  assert(hasText(item.ref), `FAQ ${item.id} is missing a source reference.`);
  assert(hasText(item.source_type), `FAQ ${item.id} is missing source_type.`);
  assert(validConfidence.has(item.confidence), `FAQ ${item.id} has invalid confidence: ${item.confidence}.`);
  assert(isIsoDate(item.reviewed_at), `FAQ ${item.id} reviewed_at must be YYYY-MM-DD.`);
  assert(!/\(\.\.\.\s*\d+\)/i.test(item.id), `FAQ ${item.id} looks artificially expanded.`);
}

for (const hadith of islamicHadith) {
  assert(hadith.ar && hadith.tr && hadith.pl && hadith.en, `Hadith ${hadith.id} is missing text.`);
  assert(hadith.source, `Hadith ${hadith.id} is missing source.`);
  assert(hadith.grade, `Hadith ${hadith.id} is missing grade.`);
}

const requiredDuaIds = [
  "morning",
  "evening",
  "after_salah_subhanallah",
  "after_salah_ayat_kursi",
  "ramadan_iftar",
  "ramadan_qadr",
  "travel",
  "sleeping",
  "parents",
  "knowledge"
];
const duaIds = new Set(DUA_DATA.map((dua) => dua.id));
for (const id of requiredDuaIds) assert(duaIds.has(id), `Required dua/adhkar item is missing: ${id}.`);
for (const dua of DUA_DATA) {
  assert(hasText(dua.id), "Dua item is missing id.");
  assert(hasText(dua.ar) && hasText(dua.tr) && hasText(dua.pl) && hasText(dua.en), `Dua ${dua.id} is missing text.`);
  assert(hasText(dua.source_ref), `Dua ${dua.id} is missing source_ref.`);
  assert(hasText(dua.source_type), `Dua ${dua.id} is missing source_type.`);
  assert(validConfidence.has(dua.confidence), `Dua ${dua.id} has invalid confidence: ${dua.confidence}.`);
  assert(isIsoDate(dua.reviewed_at), `Dua ${dua.id} reviewed_at must be YYYY-MM-DD.`);
}

const hasPrayerStep = (id) => PRAYER_GUIDE_CORE_STEPS.some((step) => step.id === id);
assert(hasPrayerStep("tashahhud"), "Prayer guide is missing full tashahhud step.");
assert(hasPrayerStep("salawat"), "Prayer guide is missing Salawat Ibrahimiyyah step.");
assert(PRAYER_AFTER_SALAH_ADHKAR.length >= 4, "Prayer after-salah adhkar should include at least four items.");
assert(WUDU_INVALIDATORS.length >= 4, "Wudu invalidators should include at least four items.");
assert(GHUSL_GUIDE.when.length >= 3, "Ghusl guide should explain at least three cases.");
assert(GHUSL_GUIDE.steps.length >= 4, "Ghusl guide should include practical steps.");
assert(
  hasText(GHUSL_GUIDE.practicalDifference.pl) && hasText(GHUSL_GUIDE.practicalDifference.en),
  "Ghusl guide should explain the practical difference from wudu."
);
assert(PRAYER_SUNNAH_TRAVEL.rawatib.length >= 4, "Sunnah rawatib guide is incomplete.");
assert(hasText(PRAYER_SUNNAH_TRAVEL.witr.pl) && hasText(PRAYER_SUNNAH_TRAVEL.witr.en), "Witr guide is missing.");
assert(PRAYER_SUNNAH_TRAVEL.travel.length >= 3, "Travel prayer guide is incomplete.");

const validateReligiousItems = (label, items) => {
  assert(Array.isArray(items) && items.length > 0, `${label} should not be empty.`);
  for (const item of items) {
    assert(hasText(item.id), `${label} item is missing id.`);
    assert(hasText(item.source_ref), `${label} ${item.id} is missing source_ref.`);
    assert(hasText(item.source_type), `${label} ${item.id} is missing source_type.`);
    assert(validConfidence.has(item.confidence), `${label} ${item.id} has invalid confidence: ${item.confidence}.`);
    assert(isIsoDate(item.reviewed_at), `${label} ${item.id} reviewed_at must be YYYY-MM-DD.`);
  }
};
validateReligiousItems("Aqidah section", AQIDAH_BASICS.sections);
validateReligiousItems("Aqidah ruling", AQIDAH_BASICS.rulings);
validateReligiousItems("Zakat overview", ZAKAT_BASICS.overview);
validateReligiousItems("Zakat asset", ZAKAT_BASICS.assets);
validateReligiousItems("Zakat recipient", ZAKAT_BASICS.recipients);
validateReligiousItems("Zakat caution", ZAKAT_BASICS.cautions);
validateReligiousItems("Ramadan essential", RAMADAN_GUIDE.essentials);
validateReligiousItems("Ramadan last-ten", RAMADAN_GUIDE.laylat);
validateReligiousItems("Ramadan dua", RAMADAN_GUIDE.duas);
validateReligiousItems("Muallaf guidance", MUALLAF_GUIDANCE);
validateReligiousItems("Wudu invalidator", WUDU_INVALIDATORS);
validateReligiousItems("Ghusl case", GHUSL_GUIDE.when);
validateReligiousItems("After-salah adhkar", PRAYER_AFTER_SALAH_ADHKAR);
validateReligiousItems("Sunnah rawatib", PRAYER_SUNNAH_TRAVEL.rawatib);
validateReligiousItems("Travel prayer", PRAYER_SUNNAH_TRAVEL.travel);
for (const field of ["source_ref", "source_type", "confidence", "reviewed_at"]) {
  assert(hasText(PRAYER_SUNNAH_TRAVEL.witr[field]), `Witr guide is missing ${field}.`);
}

for (const event of historyContent.timeline) {
  assert(hasText(event.id), "History timeline event is missing id.");
  assert(event.title?.pl && event.title?.en, `History timeline ${event.id} is missing bilingual title.`);
  assert(
    event.description?.pl && event.description?.en,
    `History timeline ${event.id} is missing bilingual description.`
  );
  assert(event.sources?.length, `History timeline ${event.id} is missing sources.`);
}

const historyStoryIds = new Set();
for (const story of historyContent.stories) {
  assert(hasText(story.id), "History story is missing id.");
  assert(!historyStoryIds.has(story.id), `Duplicate history story id: ${story.id}.`);
  historyStoryIds.add(story.id);
  assert(hasText(story.section), `History story ${story.id} is missing section.`);
  assert(story.title?.pl && story.title?.en, `History story ${story.id} is missing bilingual title.`);
  assert(story.body?.pl?.length && story.body?.en?.length, `History story ${story.id} is missing bilingual body.`);
}

const historyInsightIds = new Set();
for (const insight of historyContent.insightBubbles || []) {
  assert(hasText(insight.id), "History insight bubble is missing id.");
  assert(!historyInsightIds.has(insight.id), `Duplicate history insight id: ${insight.id}.`);
  historyInsightIds.add(insight.id);
  assert(insight.title?.pl && insight.title?.en, `History insight ${insight.id} is missing bilingual title.`);
  assert(insight.text?.pl && insight.text?.en, `History insight ${insight.id} is missing bilingual text.`);
}

assert(!appJs.includes("<<<<<<<") && !appJs.includes(">>>>>>>"), "app.js contains unresolved merge markers.");
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
assert(appJs.includes("CONTENT_TRUST"), "Content trust taxonomy is missing.");
assert(appJs.includes("SCHOLARLY_DISAGREEMENT"), "Scholarly disagreement trust level is missing.");
assert(appJs.includes("CONTEXT_DEPENDENT"), "Context-dependent trust level is missing.");
assert(appJs.includes("source_type"), "Religious content schema is missing source_type.");
assert(appJs.includes("source_ref"), "Religious content schema is missing source_ref.");
assert(appJs.includes("reviewed_at"), "Religious content schema is missing reviewed_at.");
assert(appJs.includes("HIGH_RISK_RELIGIOUS_NOTICE"), "High-risk religious notice is missing.");
assert(appJs.includes("HIGH_RISK_FAQ_IDS"), "High-risk FAQ registry is missing.");
assert(appJs.includes("high_risk"), "FAQ high-risk schema flag is missing.");
assert(appJs.includes("isHighRiskFaq"), "FAQ high-risk classifier is missing.");
assert(appJs.includes("hadith_collection"), "Hadith source type metadata is missing.");
assert(appJs.includes("parseHadithCollection"), "Hadith collection parser is missing.");
assert(appJs.includes("ISLAMIC_SOURCE_LIBRARY"), "AI source library is missing.");
assert(appJs.includes("hasRequiredIslamicSources"), "AI religious source guard is missing.");
assert(appJs.includes("DUA_SOURCE_MAP"), "Dua source map is missing.");
assert(appJs.includes("CONTENT_LAST_CHECKED_AT"), "Content quality metadata is missing.");
assert(appJs.includes("RELIGIOUS_NOTICE"), "Religious responsibility notice is missing.");

if (failures.length) {
  console.error("Islamic data validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Islamic data validation passed.");
console.log(
  `Surahs: ${quranSurahs.length}, Asmaul Husna: ${asmaulHusna.length}, months: ${islamicMonths.length}, FAQ: ${islamicFaq.length}, hadith: ${islamicHadith.length}`
);
