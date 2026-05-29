export const CONTENT_LAST_CHECKED_AT = "2026-05-29";

export const TRUST_LEVEL = {
  VERIFIED: { pl: "ZWERYFIKOWANE", en: "VERIFIED" },
  SCHOLARLY_DISAGREEMENT: { pl: "SPORNE U UCZONYCH", en: "SCHOLARLY DISAGREEMENT" },
  CONTEXT_DEPENDENT: { pl: "ZALEZY OD KONTEKSTU", en: "CONTEXT DEPENDENT" },
  UNVERIFIED: { pl: "NIEZWERYFIKOWANE", en: "UNVERIFIED" }
};

export const CONTENT_TRUST = {
  VERIFIED: "VERIFIED",
  SCHOLARLY_DISAGREEMENT: "SCHOLARLY_DISAGREEMENT",
  CONTEXT_DEPENDENT: "CONTEXT_DEPENDENT",
  UNVERIFIED: "UNVERIFIED"
};

export const RELIGIOUS_NOTICE = {
  pl: "Tresci edukacyjne: to nie jest indywidualna fatwa. W sprawach spornych (fiqh, finanse, malzenstwo, rozwod, zdrowie) skonsultuj lokalnego, zaufanego imama lub uczonego.",
  en: "Educational content: this is not a personal fatwa. For disputed issues (fiqh, finance, marriage, divorce, health), consult a trusted local imam or qualified scholar."
};

export const HIGH_RISK_RELIGIOUS_NOTICE = {
  pl: "Temat wysokiego ryzyka: nie podejmuj decyzji osobistej tylko na podstawie aplikacji. Skonsultuj lokalnego imama, uczonego albo specjaliste, jesli dotyczy zdrowia lub prawa.",
  en: "High-risk topic: do not make a personal decision based only on the app. Consult a local imam, qualified scholar, or a relevant professional for health or legal matters."
};

export const HIGH_RISK_FAQ_IDS = new Set([
  "christmas",
  "polygamy",
  "hijab",
  "extra_halal_job",
  "extra_family_pushback"
]);
