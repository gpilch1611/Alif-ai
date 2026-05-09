import {
  halalHaramData,
  islamicFaq,
  islamicHadith
} from "../data.js";
import { readFile } from "node:fs/promises";

const sourceFields = ["source", "ref", "source_ref", "reference", "references"];
const contextWords = [
  "complex",
  "context",
  "context-dependent",
  "depends",
  "disputed",
  "gray",
  "ikhtilaf",
  "kwestia sporna",
  "makruh",
  "scholarly_disagreement",
  "zalezy",
  "zależy"
];
const highRiskWords = [
  "abuse",
  "beating",
  "extremism",
  "isis",
  "jihad",
  "killing",
  "polygamy",
  "suicide",
  "terrorism",
  "violence",
  "wife_beating",
  "zina"
];

const normalize = (value) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

const hasText = (value) => {
  if (Array.isArray(value)) return value.some(hasText);
  return typeof value === "string" && value.trim().length > 0;
};

const hasSource = (item) => sourceFields.some((field) => hasText(item[field]));

const itemText = (item) =>
  Object.values(item)
    .filter((value) => ["string", "number", "boolean"].includes(typeof value))
    .join(" ");

const hasAnyWord = (item, words) => {
  const haystack = normalize(itemText(item));
  return words.some((word) => haystack.includes(normalize(word)));
};

const isContextDependent = (item) =>
  item.context_dependent === true ||
  item.trust === "CONTEXT_DEPENDENT" ||
  item.verdict === "complex" ||
  item.status === "makruh" ||
  hasAnyWord(item, contextWords);

const isHighRisk = (item) =>
  item.high_risk === true ||
  item.risk === "high" ||
  item.trust === "HIGH_RISK" ||
  hasAnyWord(item, highRiskWords);

const countBy = (items, getKey) =>
  items.reduce((totals, item) => {
    const key = getKey(item) || "unknown";
    totals[key] = (totals[key] ?? 0) + 1;
    return totals;
  }, {});

const flattenHalalHaram = (data) =>
  Object.entries(data).flatMap(([category, items]) =>
    items.map((item) => ({ ...item, category }))
  );

const formatCounts = (counts) =>
  Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");

const printMetric = (label, value) => {
  console.log(`${label.padEnd(36, ".")} ${value}`);
};

const appJs = await readFile(new URL("../app.js", import.meta.url), "utf8");
const appExtraFaqIds = [...appJs.matchAll(/id:\s*"extra_[^"]+"/g)].map((match) => match[0].match(/"([^"]+)"/)[1]);
const appReferenceFixIds = new Set([...appJs.matchAll(/^\s*([a-z0-9_]+):\s*"[^"]+"/gm)].map((match) => match[1]));
const appExtraInlineSourceIds = new Set(
  appJs
    .split("\n")
    .filter((line) => /id:\s*"extra_[^"]+"/.test(line) && /ref:\s*"[^"]+"/.test(line) && !/ref:\s*""/.test(line))
    .map((line) => line.match(/id:\s*"([^"]+)"/)?.[1])
    .filter(Boolean)
);
const appExtraFaqSourced = appExtraFaqIds.filter((id) => appReferenceFixIds.has(id) || appExtraInlineSourceIds.has(id)).length;
const renderedFaqEstimate = islamicFaq.length + appExtraFaqIds.length;

const halalHaramItems = flattenHalalHaram(halalHaramData);
const religiousContent = [
  ...islamicFaq.map((item) => ({ ...item, contentType: "FAQ" })),
  ...islamicHadith.map((item) => ({ ...item, contentType: "Hadith" })),
  ...halalHaramItems.map((item) => ({ ...item, contentType: "Halal/Haram" }))
];

const sourced = religiousContent.filter(hasSource);
const missingSources = religiousContent.filter((item) => !hasSource(item));
const contextDependent = religiousContent.filter(isContextDependent);
const highRisk = religiousContent.filter(isHighRisk);

console.log("Content review report");
console.log("=====================");
printMetric("FAQ items in data.js", islamicFaq.length);
printMetric("Extra FAQ items in app.js", appExtraFaqIds.length);
printMetric("Rendered FAQ estimate", renderedFaqEstimate);
printMetric("Hadith items", islamicHadith.length);
printMetric("Halal/Haram items", halalHaramItems.length);
printMetric("All reviewed data items", religiousContent.length);
console.log("");

console.log("Halal/Haram breakdown");
console.log("---------------------");
printMetric("By status", formatCounts(countBy(halalHaramItems, (item) => item.status)));
printMetric("By category", formatCounts(countBy(halalHaramItems, (item) => item.category)));
console.log("");

console.log("Source coverage");
console.log("---------------");
printMetric("Items with sources", sourced.length);
printMetric("Items missing sources", missingSources.length);
printMetric("FAQ missing sources", islamicFaq.filter((item) => !hasSource(item)).length);
printMetric("Extra FAQ missing sources", appExtraFaqIds.length - appExtraFaqSourced);
printMetric("Hadith missing sources", islamicHadith.filter((item) => !hasSource(item)).length);
printMetric("Halal/Haram missing sources", halalHaramItems.filter((item) => !hasSource(item)).length);
console.log("");

console.log("Review risk flags");
console.log("-----------------");
printMetric("High-risk items", highRisk.length);
printMetric("Context-dependent items", contextDependent.length);
printMetric("High-risk/context-dependent", new Set([...highRisk, ...contextDependent]).size);
console.log("");

if (missingSources.length > 0) {
  console.log("Missing source IDs");
  console.log("------------------");
  for (const item of missingSources) {
    const name = item.id ?? item.namePl ?? item.questionPl ?? item.qPl ?? "untitled";
    console.log(`- ${item.contentType}: ${name}`);
  }
}
