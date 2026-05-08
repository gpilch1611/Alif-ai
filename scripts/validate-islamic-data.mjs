import { readFile } from "node:fs/promises";
import {
  asmaulHusna,
  islamicFaq,
  islamicHadith,
  islamicMonths,
  quranSurahs
} from "../data.js";

const appJs = await readFile(new URL("../app.js", import.meta.url), "utf8");

const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const faqReferenceFixes = {
  salam: "Abu Dawud 5193; Tirmidhi 2689",
  ramadan_respect: "Quran 2:183-185",
  mosque_visit: "Quran 9:18; general adab of masjid",
  convert_steps: "Muslim 21; Bukhari 8",
  arabs: "Quran 49:13",
  music: "Scholarly disagreement; no explicit Quranic prohibition"
};

assert(quranSurahs.length === 114, `Expected 114 surahs, got ${quranSurahs.length}.`);
assert(asmaulHusna.length === 99, `Expected 99 Asmaul Husna names, got ${asmaulHusna.length}.`);
assert(islamicMonths.length === 12, `Expected 12 Islamic months, got ${islamicMonths.length}.`);
assert(islamicHadith.length === 30, `Expected the curated hadith list to stay at 30 verified items, got ${islamicHadith.length}.`);

const surahNumbers = new Set(quranSurahs.map((surah) => surah.number));
for (let number = 1; number <= 114; number += 1) {
  assert(surahNumbers.has(number), `Missing surah number ${number}.`);
}

const faqIds = new Set();
for (const item of islamicFaq) {
  assert(!faqIds.has(item.id), `Duplicate FAQ id: ${item.id}.`);
  faqIds.add(item.id);
  assert(item.qPl && item.qEn && item.aPl && item.aEn, `FAQ ${item.id} is missing text.`);
  assert(item.ref || faqReferenceFixes[item.id], `FAQ ${item.id} is missing a source reference.`);
  assert(!/\(\.\.\.\s*\d+\)|extra_/i.test(item.id), `FAQ ${item.id} looks artificially expanded.`);
}

for (const hadith of islamicHadith) {
  assert(hadith.ar && hadith.tr && hadith.pl && hadith.en, `Hadith ${hadith.id} is missing text.`);
  assert(hadith.source, `Hadith ${hadith.id} is missing source.`);
}

assert(!appJs.includes("<<<<<<<") && !appJs.includes(">>>>>>>"), "app.js contains unresolved merge markers.");
assert(!appJs.includes("[...islamicFaq, ...faqExtraUnique]"), "app.js still expands FAQ with artificial extra items.");
assert(appJs.includes("ISLAMIC_SOURCE_LIBRARY"), "AI source library is missing.");
assert(appJs.includes("hasRequiredIslamicSources"), "AI religious source guard is missing.");
assert(appJs.includes("DUA_SOURCE_MAP"), "Dua source map is missing.");
assert(appJs.includes("CONTENT_LAST_CHECKED_AT"), "Content quality metadata is missing.");

if (failures.length) {
  console.error("Islamic data validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Islamic data validation passed.");
console.log(`Surahs: ${quranSurahs.length}, Asmaul Husna: ${asmaulHusna.length}, months: ${islamicMonths.length}, FAQ: ${islamicFaq.length}, hadith: ${islamicHadith.length}`);
