import { arabicAlphabet, words, dailyTasks, asmaulHusna, islamicHadith, seerahTimeline, tajweedRules, pillarsOfIslam, pillarsOfIman, islamicMonths, newMuslimSteps, halalHaramData, islamicFaq } from "./data.js";
import {
  CONTENT_LAST_CHECKED_AT,
  CONTENT_TRUST,
  HIGH_RISK_FAQ_IDS,
  HIGH_RISK_RELIGIOUS_NOTICE,
  RELIGIOUS_NOTICE,
  TRUST_LEVEL
} from "./data/content-metadata.js";
import {
  OBLIGATORY_PRAYERS,
  OBLIGATORY_PRAYERS_PL,
  PRAYER_GUIDE_CORE_STEPS,
  PRAYER_GUIDE_PRAYERS,
  PRAYER_LOCATIONS,
  PRAYER_MODE_TABS,
  PRAYER_NAMES,
  PRAYER_NAMES_PL,
  WUDU_STEPS
} from "./data/prayer-mode.js";
import {
  DUA_SOURCE_MAP,
  ESSENTIAL_SURAHS,
  HIFZ_STATES,
  HIFZ_SURAHS,
  QURAN_RECITERS,
  SURAH_EXTRA,
  SURAH_LENGTH_GROUPS,
  SURAH_LIST
} from "./data/quran-mode.js";

const GROQ_MODEL = "llama-3.3-70b-versatile";
const APP_VERSION = "20260516-2";
window.__ALIF_APP_VERSION = APP_VERSION;
const AI_SYSTEM_PROMPT_PL = `Jesteś ekspertem od języka arabskiego, islamu i kultury muzułmańskiej w aplikacji 'Alif AI'. Pomagasz osobom uczącym się arabskiego i islamu — zwłaszcza konwertytom i nowicjuszom.
Zawsze odpowiadaj TYLKO w języku polskim. Bądź przyjacielski, ciepły i zachęcający.
NIGDY nie używaj surowych linków markdown ani nie generuj zbędnego kodu.

Zasady generowania treści:
FISZKI: Format WYŁĄCZNIE "arabskie_słowo — polskie_tłumaczenie", jedna para na linię, BEZ numerów, BEZ "Strona przednia/tylna", BEZ zdań.
Przykład poprawny: كِتَاب — książka
ISLAM/MODLITWA/KORAN: odpowiadaj merytorycznie, z szacunkiem i precyzją.
QUIZ: Format "PYTANIE: [tekst] | A: [opcja] | B: [opcja] | C: [opcja] | POPRAWNA: [A/B/C]", jedna linia to jedno pytanie.`;
const AI_SYSTEM_PROMPT_EN = `You are an expert in Arabic language, Islam and Muslim culture inside the app 'Alif AI'. You help people learning Arabic and Islam — especially converts and beginners.
Always reply ONLY in English. Be friendly, warm and encouraging.
NEVER use raw markdown links or generate unnecessary code.

Content generation rules:
FLASHCARDS: Format ONLY "arabic_word — english_translation", one pair per line, NO numbers, NO "Front/Back" labels, NO sentences.
Correct example: كِتَاب — book
ISLAM/PRAYER/QURAN: answer accurately, with respect and precision.
QUIZ: Format "QUESTION: [text] | A: [option] | B: [option] | C: [option] | CORRECT: [A/B/C]", each line one question.`;

const $ = (selector) => document.querySelector(selector);
const view = $("#view");
const nav = $("#bottomNav");
const modal = $("#letterModal");
const modalContent = $("#modalContent");
const STORAGE_KEY = "alif-ai-state";
let muteBadgeNotifications = false;
const THEMES = ["light", "dark"];
const THEME_COLOR = {
  light: "#f7f7f7",
  dark: "#071a24"
};

const navItems = [
  ["home",    "⌂",  "navHome"],
  ["islam",   "☪",  "navIslam"],
  ["lessons", "Aa", "navLessons"],
  ["culture", "✦",  "navCulture"],
  ["games",   "◎",  "navGames"],
  ["adventure", "✎", "navAdventure"]
];

const secondaryNavItems = [];

const ISLAM_ROUTES = ["islam","koran","asmaul","tajweed","seerah","pillars","muallaf","halalharam","islamfaq","glossary","prayer","prayerGuide"];
const APP_ROUTES = new Set([
  ...navItems.map(([id]) => id),
  ...secondaryNavItems.map(([id]) => id),
  ...ISLAM_ROUTES,
  "alphabet",
  "calendar",
  "dhikr",
  "review",
  "badges",
  "flashcards",
  "speech",
  "settings",
  "writing",
  "books"
]);
const CONTENT_VERSION = "2026.05";
const CONTENT_UPDATED_AT = "2026-05-08";

function trustForFaq(item) {
  if (item.confidence) return item.confidence;
  if (!item.ref) return CONTENT_TRUST.UNVERIFIED;
  if (item.verdict === "complex") return CONTENT_TRUST.SCHOLARLY_DISAGREEMENT;
  if (/job|health|holiday|family|touch|madhhab|doubts|citizenship/i.test(item.id)) return CONTENT_TRUST.CONTEXT_DEPENDENT;
  return CONTENT_TRUST.VERIFIED;
}

function trustLabel(confidence) {
  const trust = TRUST_LEVEL[confidence] || TRUST_LEVEL.UNVERIFIED;
  return tx(trust.pl, trust.en);
}

function trustClass(confidence) {
  return String(confidence || CONTENT_TRUST.UNVERIFIED).toLowerCase().replace(/_/g, "-");
}

function isHighRiskFaq(item) {
  const text = `${item.id} ${item.qPl || ""} ${item.qEn || ""} ${item.aPl || ""} ${item.aEn || ""}`;
  return HIGH_RISK_FAQ_IDS.has(item.id) || /(małżeń|malzen|marriage|divorce|rozwod|finans|finance|zdrow|health|praca|work|job|rodzin|family|therapy|terapia|riba|alcohol|alkohol)/i.test(text);
}

const islamicFaqExpanded = islamicFaq.map((item) => {
  const source = item.ref || "";
  const confidence = item.confidence || trustForFaq(item);
  const high_risk = typeof item.high_risk === "boolean" ? item.high_risk : isHighRiskFaq(item);
  const source_type = item.source_type || (source.includes("Scholarly disagreement") || confidence === CONTENT_TRUST.SCHOLARLY_DISAGREEMENT ? "fiqh_disagreement" : "quran_hadith");
  const reviewed_at = item.reviewed_at || CONTENT_LAST_CHECKED_AT;
  return {
    ...item,
    ref: source,
    verified: Boolean(source),
    confidence,
    high_risk,
    source_type,
    source_ref: source,
    source,
    reviewed_at,
    last_checked_at: item.last_checked_at || reviewed_at
  };
});

const ISLAMIC_SOURCE_LIBRARY = [
  ...islamicFaqExpanded.map((item) => ({
    id: `faq:${item.id}`,
    type: "faq",
    source: item.source,
    textPl: `${item.qPl} ${item.aPl}`,
    textEn: `${item.qEn} ${item.aEn}`
  })),
  ...islamicHadith.map((item) => ({
    id: `hadith:${item.id}`,
    type: "hadith",
    source: item.source,
    source_type: "hadith_collection",
    textPl: `${item.pl} ${item.tr}`,
    textEn: `${item.en} ${item.tr}`
  }))
].filter((item) => item.source);


const I18N = {
  pl: {
    navHome: "Start", navIslam: "Islam", navKoran: "Qur'an", navAlphabet: "Alfabet", navLessons: "Lekcje", navFlashcards: "Fiszki", navSpeech: "Wymowa", navWriting: "Pisanie", navAdventure: "Dziennik", navBooks: "Książki", navCulture: "Kultura", navGames: "Gry", navBadges: "Odznaki", navSettings: "Ustawienia", navDhikr: "Dhikr", navPrayer: "Modlitwy", navAsmaul: "99 Imion", navTajweed: "Tadżwid", navSeerah: "Seerah", navPillars: "Filary", navRoots: "Korzenie", navMuallaf: "Nowy muzułmanin", navHalalHaram: "Halal & Haram", navIslamFaq: "FAQ islamu",
    install: "Zainstaluj", settings: "Ustawienia", language: "Język", polish: "Polski", english: "Angielski", resetToday: "Reset dzisiejszego progresu", resetStreak: "Reset streak", exportProgress: "Eksport postępu", importProgress: "Import postępu", clearData: "Wyczyść wszystkie dane",
    exportHint: "Pobierz plik JSON z całym postępem.", importHint: "Wybierz wcześniej wyeksportowany plik JSON.", dangerZone: "Strefa ostrożności", saved: "Zapisano", imported: "Zaimportowano dane", cleared: "Dane wyczyszczone",
    welcome: "Witaj w ألف AI", homeTitle: "Islam — krok po kroku", homeLead: "Arabski jest narzędziem — bo czytanie Koranu w oryginale to obowiązek każdego muzułmanina. Ucz się liter, sur, dhikru, historii islamu i modlitw.",
    pillarsQuiz: "Quiz: Filary Islamu", pillarsQuizDesc: "5 Filarów i 6 Filarów Imanu",
    surahQuiz: "Quiz: Sury Koranu", surahQuizDesc: "Rozpoznaj arabskie nazwy sur 78-114",
    dhikrGame: "Szybki Dhikr", dhikrGameDesc: "33 razy — jak najszybciej!", dhikrGameStart: "Dotknij aby zacząć", dhikrGameResult: "Czas",
    streak: "Seria dni", level: "Poziom", alphabetProgress: "Alfabet", todayTask: "Dzisiejsze zadanie", start: "Zaczynam", progress: "Postęp", points: "pkt",
    aiAssistant: "AI Assistant", aiPlaceholder: "Poproś o fiszki, quiz albo zapytaj o coś...", send: "Wyślij", aiHello: "Cześć! Jestem Twoim Alif AI Assistantem. Mogę stworzyć dla Ciebie fiszki, mini-quiz albo odpowiedzieć na pytania o islamie i języku arabskim.",
    addFlashcards: "Dodaj do fiszek",
    aiGenerateFlashcards: "🗂️ Generuj fiszki", aiGenerateQuiz: "📝 Mini quiz", aiAskIslam: "🕌 Zapytaj o Islam",
    more: "Więcej", play: "Odtwórz", check: "Sprawdź", clear: "Wyczyść", next: "Następna", good: "dobrze", weak: "słabo", veryWeak: "bardzo słabo", attempts: "Historia prób",
    frontHint: "Dotknij karty, żeby ją odwrócić", hard: "Trudne", ok: "OK", easy: "Łatwe", noCards: "Nie ma kart w tym trybie",
    correct: "Dobrze", wrong: "Źle", history: "Historia", stop: "Stop", record: "Rekord", score: "Wynik",
    koranTitle: "Mój Qur'an", koranAdd: "Dodaj Surę", koranNumber: "Numer (1-114)", koranEmpty: "Nie dodano jeszcze żadnej Sury.", koranOrder: "Sortuj i filtruj sury według potrzeb.",
    lessonCategories: "Kategorie Lekcji", lessonSelect: "Wybierz kategorię"
  },
  en: {
    navHome: "Home", navIslam: "Islam", navKoran: "Qur'an", navAlphabet: "Alphabet", navLessons: "Lessons", navFlashcards: "Cards", navSpeech: "Speech", navWriting: "Writing", navAdventure: "Journal", navBooks: "Books", navCulture: "Culture", navGames: "Games", navBadges: "Badges", navSettings: "Settings", navDhikr: "Dhikr", navPrayer: "Prayers", navAsmaul: "99 Names", navTajweed: "Tajweed", navSeerah: "Seerah", navPillars: "Pillars", navRoots: "Roots", navMuallaf: "New Muslim", navHalalHaram: "Halal & Haram", navIslamFaq: "Islam FAQ",
    install: "Install", settings: "Settings", language: "Language", polish: "Polish", english: "English", resetToday: "Reset today's progress", resetStreak: "Reset streak", exportProgress: "Export progress", importProgress: "Import progress", clearData: "Clear all data",
    exportHint: "Download a JSON file with your full progress.", importHint: "Choose a previously exported JSON file.", dangerZone: "Careful zone", saved: "Saved", imported: "Data imported", cleared: "Data cleared",
    welcome: "Welcome to ألف AI", homeTitle: "Islam — step by step", homeLead: "Arabic is the key — reading the Quran in the original is every Muslim's obligation. Learn letters, surahs, dhikr, Islamic history and prayers.",
    pillarsQuiz: "Pillars Quiz", pillarsQuizDesc: "5 Pillars & 6 Pillars of Iman",
    surahQuiz: "Surah Quiz", surahQuizDesc: "Recognise Arabic surah names 78-114",
    dhikrGame: "Dhikr Speed", dhikrGameDesc: "33 taps — as fast as you can!", dhikrGameStart: "Tap to start", dhikrGameResult: "Time",
    streak: "Daily streak", level: "Level", alphabetProgress: "Alphabet", todayTask: "Today's task", start: "Start", progress: "Progress", points: "pts",
    aiAssistant: "AI Assistant", aiPlaceholder: "Ask for flashcards, a quiz, or anything else...", send: "Send", aiHello: "Hi! I am your Alif AI Assistant. I can create flashcards, a mini-quiz, or answer your questions about Islam and Arabic.",
    addFlashcards: "Add to flashcards",
    aiGenerateFlashcards: "🗂️ Generate cards", aiGenerateQuiz: "📝 Mini quiz", aiAskIslam: "🕌 Ask about Islam",
    more: "More", play: "Play", check: "Check", clear: "Clear", next: "Next", good: "good", weak: "weak", veryWeak: "very weak", attempts: "Attempt history",
    frontHint: "Tap the card to flip it", hard: "Hard", ok: "OK", easy: "Easy", noCards: "No cards in this mode",
    correct: "Correct", wrong: "Wrong", history: "History", stop: "Stop", record: "Best", score: "Score",
    koranTitle: "My Qur'an", koranAdd: "Add Surah", koranNumber: "Number (1-114)", koranEmpty: "No Surahs added yet.", koranOrder: "Sort and filter surahs as you need.",
    lessonCategories: "Lesson Categories", lessonSelect: "Choose a category"
  }
};

const DAILY_TASKS_EN = [
  "Learn 3 new letters and tap each one.",
  "Do 7 flashcards in review mode.",
  "Practice pronunciation of the word سلام.",
  "Trace the letter ب on the canvas.",
  "Play one round of Memory Match."
];

const LESSONS_DATA = {
  pl: [
    { id: "hello", category: "Podstawy", title: "As-salamu alejkum", ar: "السلام عليكم", tr: "as-salamu alejkum", meaning: "Pokój z Tobą (powitanie)", task: "Powiedz zwrot na głos i dodaj go do fiszek." },
    { id: "bismillah", category: "Podstawy", title: "Bismillah", ar: "بِسْمِ اللَّهِ", tr: "bismillah", meaning: "W imię Boga", task: "Powtórz przed każdym posiłkiem przez tydzień." },
    { id: "thanks", category: "Podstawy", title: "Dziękuję", ar: "شُكْرًا", tr: "szukran", meaning: "Dziękuję", task: "Użyj zwrotu w zdaniu po polsku, zamieniając 'dziękuję'." },
    { id: "sorry", category: "Podstawy", title: "Przepraszam", ar: "آسِف", tr: "asif", meaning: "Przepraszam", task: "Powiedz na głos trzy razy. Mężczyzna: آسِف (asif) • Kobieta: آسِفَة (asifa)." },
    { id: "yes", category: "Podstawy", title: "Tak / Nie", ar: "نَعَم / لا", tr: "na'am / la", meaning: "Tak / Nie", task: "Odpowiedz na 3 pytania używając tylko نعم lub لا." },
    { id: "howru", category: "Podstawy", title: "Jak się masz?", ar: "كَيْفَ حَالُكَ؟", tr: "kajfa haluk?", meaning: "Jak się masz?", task: "Naucz się też odpowiedzi: بِخَيْرٍ شُكْرًا (bikhajrin szukran) – Dobrze, dziękuję." },
    { id: "welcome", category: "Podstawy", title: "Witaj / Proszę", ar: "أَهْلًا وَسَهْلًا", tr: "ahlan wa sahlan", meaning: "Witaj, bądź jak u siebie", task: "Powiedz na głos i dodaj do fiszek." },
    { id: "mama", category: "Rodzina", title: "Mama", ar: "أُمّ", tr: "umm", meaning: "mama / matka", task: "Napisz literę أ na canvasie." },
    { id: "baba", category: "Rodzina", title: "Tata", ar: "أَبٌ", tr: "ab", meaning: "tata / ojciec", task: "Powiedz po arabsku: mój tata = أَبِي (abi)." },
    { id: "brother", category: "Rodzina", title: "Brat", ar: "أَخٌ", tr: "ach", meaning: "brat", task: "Jak powiedzieć 'mój brat'? Dodaj ي na końcu: أَخِي." },
    { id: "sister", category: "Rodzina", title: "Siostra", ar: "أُخْتٌ", tr: "ucht", meaning: "siostra", task: "Napisz słowo w transliteracji i naucz się go na pamięć." },
    { id: "husband", category: "Rodzina", title: "Mąż", ar: "زَوْجٌ", tr: "zawdż", meaning: "mąż / małżonek", task: "Powiedz zdanie: زَوْجِي طَيِّبٌ – Mój mąż jest dobry." },
    { id: "wife", category: "Rodzina", title: "Żona", ar: "زَوْجَةٌ", tr: "zawdża", meaning: "żona / małżonka", task: "Powtórz 3 razy i dodaj do fiszek." },
    { id: "child", category: "Rodzina", title: "Dziecko", ar: "طِفْلٌ", tr: "tifl", meaning: "dziecko", task: "Znajdź litery ط ف ل w alfabecie." },
    { id: "color_red", category: "Kolory", title: "Czerwony", ar: "أَحْمَر", tr: "ahmar", meaning: "czerwony", task: "Dotknij 3 czerwonych rzeczy w pokoju i powiedz 'ahmar'." },
    { id: "color_green", category: "Kolory", title: "Zielony", ar: "أَخْضَر", tr: "achdar", meaning: "zielony", task: "Symbol raju i islamu — Prorok ﷺ lubił zielony. Powtórz 5 razy." },
    { id: "color_white", category: "Kolory", title: "Biały", ar: "أَبْيَض", tr: "abjad", meaning: "biały", task: "Powiedz: koszula jest biała = القميص أبيض." },
    { id: "color_black", category: "Kolory", title: "Czarny", ar: "أَسْوَد", tr: "aswad", meaning: "czarny", task: "Dodaj do fiszek i naucz się na pamięć." },
    { id: "color_blue", category: "Kolory", title: "Niebieski", ar: "أَزْرَق", tr: "azrak", meaning: "niebieski", task: "Jak kolor nieba – powiedz patrząc w okno." },
    { id: "num1", category: "Liczby", title: "Jeden", ar: "وَاحِد", tr: "wahid", meaning: "jeden (1)", task: "Policz do 5 po arabsku razem z AI." },
    { id: "num2", category: "Liczby", title: "Dwa", ar: "اثْنَان", tr: "isnan", meaning: "dwa (2)", task: "Powiedz: mam dwa... = عِنْدِي اثْنَان..." },
    { id: "num3", category: "Liczby", title: "Trzy", ar: "ثَلَاثَة", tr: "salasa", meaning: "trzy (3)", task: "Napisz po arabsku i transliteruj." },
    { id: "num4", category: "Liczby", title: "Cztery", ar: "أَرْبَعَة", tr: "arba'a", meaning: "cztery (4)", task: "Ile rakat ma modlitwa Dhuhr? Cztery — arba'a! Zapamiętaj przez skojarzenie." },
    { id: "num5", category: "Liczby", title: "Pięć", ar: "خَمْسَة", tr: "chamsa", meaning: "pięć (5)", task: "Liczba modlitw w islamie – zapamiętaj przez skojarzenie." },
    { id: "bread", category: "Jedzenie", title: "Chleb", ar: "خُبْز", tr: "chubz", meaning: "chleb", task: "Znajdź literę خ i ب w alfabecie." },
    { id: "water", category: "Jedzenie", title: "Woda", ar: "مَاء", tr: "ma", meaning: "woda", task: "Powiedz 'ma' za każdym razem gdy pijesz wodę przez jeden dzień." },
    { id: "rice", category: "Jedzenie", title: "Ryż", ar: "أُرُز", tr: "aruzz", meaning: "ryż", task: "Proste codzienne slowo - naucz sie go." },
    { id: "fruit", category: "Jedzenie", title: "Owoce", ar: "فَاكِهَة", tr: "fakiha", meaning: "owoce", task: "Wymień 3 owoce po arabsku z pomocą AI." },
    { id: "day", category: "Czas", title: "Dzień", ar: "يَوْم", tr: "jawm", meaning: "dzień", task: "Powiedz: dzisiaj = اليوم (al-jawm)." },
    { id: "night", category: "Czas", title: "Noc", ar: "لَيْل", tr: "lajl", meaning: "noc", task: "Dobranoc po arabsku: تُصْبِح عَلَى خَيْر (tusbich 'ala khajr)." },
    { id: "morning", category: "Czas", title: "Rano", ar: "صَبَاح", tr: "sabah", meaning: "rano / poranek", task: "Powitanie poranne: صَبَاح الْخَيْر (sabah al-khajr)." },
    { id: "alhamdulillah", category: "Islam", title: "Alhamdulillah", ar: "الْحَمْدُ لِلَّه", tr: "alhamdu lillah", meaning: "Chwała Bogu / Dzięki Bogu", task: "Użyj zwrotu po każdej pomyślnej odpowiedzi w quizie." },
    { id: "inshallah", category: "Islam", title: "Inshallah", ar: "إِنْ شَاءَ اللَّه", tr: "in sza'a Allah", meaning: "Jeśli Bóg da / miejmy nadzieję", task: "Powiedz jutro rano planując swój dzień." },
    { id: "mashallah", category: "Islam", title: "Mashallah", ar: "مَا شَاءَ اللَّه", tr: "ma sza'a Allah", meaning: "Jak Bóg zechciał (zachwyt / podziw)", task: "Powiedz komuś coś miłego i dodaj Mashallah." },
    { id: "subhanallah", category: "Islam", title: "Subhanallah", ar: "سُبْحَانَ اللَّه", tr: "subhana Allah", meaning: "Chwała Bogu (zachwyt nad pięknem)", task: "Powtórz 33 razy jako formę medytacji." },
    { id: "shahada", category: "Islam – najważniejsze", title: "Szahada", ar: "لَا إِلَٰهَ إِلَّا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ", tr: "la ilaha illallah, Muhammadun rasulullah", meaning: "Nie ma boga prócz Allaha, Muhammad jest posłańcem Allaha", task: "Powtórz wolno i ze zrozumieniem każde słowo." },
    { id: "fatiha", category: "Islam – najważniejsze", title: "Al-Fatiha (wstęp)", ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", tr: "alhamdu lillahi rabbil alamin", meaning: "Chwała Bogu, Panu światów (Al-Fatiha 1:2)", task: "Zapamiętaj ten werset — jest recytowany w każdej rak'ah modlitwy." },
    { id: "ayat_kursi_intro", category: "Islam – najważniejsze", title: "Ajet al-Kursi (początek)", ar: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", tr: "Allahu la ilaha illa huwal hayyul qayyum", meaning: "Bóg — nie ma boga prócz Niego, Żyjącego, Samopodtrzymującego", task: "Ajet al-Kursi to najpotężniejszy werset Koranu (2:255). Zapamiętaj jego początek." },
    { id: "dua_eat", category: "Islam – codzienne", title: "Dua przed jedzeniem", ar: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ", tr: "bismillahi wa ala barakati Allah", meaning: "W imię Boga i z błogosławieństwem Boga", task: "Mów to przed każdym posiłkiem przez cały tydzień." },
    { id: "dua_after_eat", category: "Islam – codzienne", title: "Dua po jedzeniu", ar: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ", tr: "alhamdu lillahil ladhi at'amana wa saqana wa ja'alana muslimin", meaning: "Chwała Bogu, który nas nakarmił, napoił i uczynił muzułmanami", task: "Powiedz po zakończeniu posiłku." },
    { id: "dua_sleep", category: "Islam – codzienne", title: "Dua przed snem", ar: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", tr: "bismika Allahumma amutu wa ahya", meaning: "W Twoje imię, o Boże, umieram i żyję", task: "Powiedz przed zaśnięciem każdej nocy." },
    { id: "dua_wake", category: "Islam – codzienne", title: "Dua po przebudzeniu", ar: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", tr: "alhamdu lillahil ladhi ahyana ba'da ma amatana wa-ilayhin-nushur", meaning: "Chwała Bogu, który nas wskrzesił po tym, jak uśpił — i do Niego jest nasze zmartwychwstanie", task: "Mów po przebudzeniu zamiast sprawdzania telefonu." },
    { id: "dua_mirror", category: "Islam – codzienne", title: "Dua przy lustrze", ar: "اللَّهُمَّ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي", tr: "Allahumma hassanta khalqi fa hassin khuluqi", meaning: "Boże, upiększyłeś moje stworzenie, upiększy też mój charakter", task: "Powtarzaj patrząc w lustro rano." },
    { id: "salat_times", category: "Islam – najważniejsze", title: "Pięć modlitw", ar: "فَجْر / ظُهْر / عَصْر / مَغْرِب / عِشَاء", tr: "fadżr / zuhr / asr / maghrib / isza", meaning: "Świt / Południe / Popołudnie / Zachód słońca / Noc", task: "Zapamiętaj nazwy i kolejność 5 modlitw dziennych." },
    { id: "ramadan", category: "Islam – najważniejsze", title: "Ramadan", ar: "رَمَضَان مُبَارَك", tr: "ramadan mubarak", meaning: "Błogosławiony Ramadan", task: "Dowiedz się kiedy zaczyna się następny Ramadan i zaznacz w kalendarzu." },
    { id: "eid", category: "Islam – najważniejsze", title: "Eid Mubarak", ar: "عِيدٌ مُبَارَكٌ", tr: "eid mubarak", meaning: "Błogosławione Święto", task: "Naucz się też: كُلَّ عَام وَأَنْتُم بِخَيْر (kullu am wa antum bikhajr) – Niech każdy rok przynosi Wam dobro." },
    { id: "tawakkul", category: "Islam – wartości", title: "Tawakkul – zaufanie Bogu", ar: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", tr: "hasbunallahu wa ni'mal wakil", meaning: "Wystarczy nam Bóg – jakiż wspaniały opiekun", task: "Powiedz gdy czujesz stres lub niepewność." },
    { id: "sabr", category: "Islam – wartości", title: "Cierpliwość (Sabr)", ar: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", tr: "innallaha ma'as-sabirin", meaning: "Zaprawdę Bóg jest z cierpliwymi (Koran 2:153)", task: "Zapamiętaj werset i powiedz go gdy jesteś w trudnej chwili." },
    { id: "shukr", category: "Islam – wartości", title: "Wdzięczność (Shukr)", ar: "لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ", tr: "la in shakartum la azidannakum", meaning: "Jeśli będziecie wdzięczni, dam wam więcej (Koran 14:7)", task: "Wypisz 3 rzeczy za które jesteś wdzięczny/a dziś." },
    { id: "dua_stress", category: "Islam – codzienne", title: "Dua na trudne chwile", ar: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ", tr: "la ilaha illa anta subhanaka inni kuntu minaz-zalimin", meaning: "Nie ma boga prócz Ciebie, chwała Tobie, zaprawdę byłem z niesprawiedliwych (dua Jonasza)", task: "Powtórz 40 razy gdy czujesz się przytłoczony/a." }
  ],
  en: [
    { id: "hello", category: "Basics", title: "As-salamu alaikum", ar: "السلام عليكم", tr: "as-salamu alaikum", meaning: "Peace be upon you (greeting)", task: "Say this phrase aloud and add it to flashcards." },
    { id: "bismillah", category: "Basics", title: "Bismillah", ar: "بِسْمِ اللَّهِ", tr: "bismillah", meaning: "In the name of God", task: "Repeat before every meal for one week." },
    { id: "thanks", category: "Basics", title: "Thank you", ar: "شُكْرًا", tr: "shukran", meaning: "Thank you", task: "Use this phrase in one short sentence today." },
    { id: "sorry", category: "Basics", title: "Sorry", ar: "آسِف", tr: "asif", meaning: "Sorry / I apologize", task: "Say it out loud three times. Male: آسِف (asif) • Female: آسِفَة (asifa)." },
    { id: "yes", category: "Basics", title: "Yes / No", ar: "نَعَم / لا", tr: "na'am / la", meaning: "Yes / No", task: "Answer 3 questions using only نعم or لا." },
    { id: "howru", category: "Basics", title: "How are you?", ar: "كَيْفَ حَالُكَ؟", tr: "kayfa haluk?", meaning: "How are you?", task: "Learn the reply: بِخَيْرٍ شُكْرًا (bikhayrin shukran) – Fine, thank you." },
    { id: "welcome", category: "Basics", title: "Welcome", ar: "أَهْلًا وَسَهْلًا", tr: "ahlan wa sahlan", meaning: "Welcome, make yourself at home", task: "Say it aloud and add to flashcards." },
    { id: "mama", category: "Family", title: "Mom", ar: "أُمّ", tr: "umm", meaning: "mom / mother", task: "Write the letter أ on the canvas." },
    { id: "baba", category: "Family", title: "Dad", ar: "أَبٌ", tr: "ab", meaning: "dad / father", task: "In Arabic: my dad = أَبِي (abi)." },
    { id: "brother", category: "Family", title: "Brother", ar: "أَخٌ", tr: "akh", meaning: "brother", task: "Add ي to the end to say 'my brother': أَخِي." },
    { id: "sister", category: "Family", title: "Sister", ar: "أُخْتٌ", tr: "ukht", meaning: "sister", task: "Write the word in transliteration and memorize it." },
    { id: "husband", category: "Family", title: "Husband", ar: "زَوْجٌ", tr: "zawj", meaning: "husband / spouse", task: "Say: زَوْجِي طَيِّبٌ – My husband is good." },
    { id: "wife", category: "Family", title: "Wife", ar: "زَوْجَةٌ", tr: "zawja", meaning: "wife / spouse", task: "Repeat 3 times and add to flashcards." },
    { id: "child", category: "Family", title: "Child", ar: "طِفْلٌ", tr: "tifl", meaning: "child", task: "Find the letters ط ف ل in the alphabet." },
    { id: "color_red", category: "Colors", title: "Red", ar: "أَحْمَر", tr: "ahmar", meaning: "red", task: "Touch 3 red things and say 'ahmar'." },
    { id: "color_green", category: "Colors", title: "Green", ar: "أَخْضَر", tr: "akhdar", meaning: "green", task: "Symbol of paradise and Islam — the Prophet ﷺ favored green. Repeat 5 times." },
    { id: "color_white", category: "Colors", title: "White", ar: "أَبْيَض", tr: "abyad", meaning: "white", task: "Say: the shirt is white = القميص أبيض." },
    { id: "color_black", category: "Colors", title: "Black", ar: "أَسْوَد", tr: "aswad", meaning: "black", task: "Add to flashcards and memorize." },
    { id: "color_blue", category: "Colors", title: "Blue", ar: "أَزْرَق", tr: "azraq", meaning: "blue", task: "Color of the sky – say it looking out the window." },
    { id: "num1", category: "Numbers", title: "One", ar: "وَاحِد", tr: "wahid", meaning: "one (1)", task: "Count to 5 in Arabic with AI's help." },
    { id: "num2", category: "Numbers", title: "Two", ar: "اثْنَان", tr: "ithnan", meaning: "two (2)", task: "Say: I have two... = عِنْدِي اثْنَان..." },
    { id: "num3", category: "Numbers", title: "Three", ar: "ثَلَاثَة", tr: "thalatha", meaning: "three (3)", task: "Write it down and transliterate it." },
    { id: "num4", category: "Numbers", title: "Four", ar: "أَرْبَعَة", tr: "arba'a", meaning: "four (4)", task: "How many rak'ahs in Dhuhr prayer? Four — arba'a! Remember through association." },
    { id: "num5", category: "Numbers", title: "Five", ar: "خَمْسَة", tr: "khamsa", meaning: "five (5)", task: "Number of daily prayers in Islam – remember by association." },
    { id: "bread", category: "Food", title: "Bread", ar: "خُبْز", tr: "khubz", meaning: "bread", task: "Find the letters خ and ب in the alphabet." },
    { id: "water", category: "Food", title: "Water", ar: "مَاء", tr: "ma'", meaning: "water", task: "Say 'ma' every time you drink water today." },
    { id: "rice", category: "Food", title: "Rice", ar: "أُرُز", tr: "uruz", meaning: "rice", task: "A simple everyday food word - memorize it." },
    { id: "fruit", category: "Food", title: "Fruit", ar: "فَاكِهَة", tr: "fakiha", meaning: "fruit", task: "Name 3 fruits in Arabic with AI's help." },
    { id: "day", category: "Time", title: "Day", ar: "يَوْم", tr: "yawm", meaning: "day", task: "Say: today = اليوم (al-yawm)." },
    { id: "night", category: "Time", title: "Night", ar: "لَيْل", tr: "layl", meaning: "night", task: "Goodnight in Arabic: تُصْبِح عَلَى خَيْر (tusbih 'ala khayr)." },
    { id: "morning", category: "Time", title: "Morning", ar: "صَبَاح", tr: "sabah", meaning: "morning", task: "Morning greeting: صَبَاح الْخَيْر (sabah al-khayr)." },
    { id: "alhamdulillah", category: "Islam", title: "Alhamdulillah", ar: "الْحَمْدُ لِلَّه", tr: "alhamdulillah", meaning: "All praise to God / Thank God", task: "Use it after every correct quiz answer." },
    { id: "inshallah", category: "Islam", title: "Inshallah", ar: "إِنْ شَاءَ اللَّه", tr: "in sha'a Allah", meaning: "If God wills it", task: "Say it tomorrow morning while planning your day." },
    { id: "mashallah", category: "Islam", title: "Mashallah", ar: "مَا شَاءَ اللَّه", tr: "ma sha'a Allah", meaning: "What God has willed (admiration)", task: "Say something kind to someone and add Mashallah." },
    { id: "subhanallah", category: "Islam", title: "Subhanallah", ar: "سُبْحَانَ اللَّه", tr: "subhan Allah", meaning: "Glory to God (wonder at beauty)", task: "Repeat 33 times as a form of meditation." },
    { id: "shahada", category: "Islam – Essential", title: "Shahada", ar: "لَا إِلَٰهَ إِلَّا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ", tr: "la ilaha illallah, Muhammadun rasulullah", meaning: "There is no god but Allah, Muhammad is His messenger", task: "Repeat slowly understanding each word." },
    { id: "fatiha", category: "Islam – Essential", title: "Al-Fatiha (opening)", ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", tr: "alhamdulillahi rabbil alamin", meaning: "All praise to God, Lord of all worlds (Al-Fatiha 1:2)", task: "Memorize this verse — it is recited in every rak'ah of prayer." },
    { id: "ayat_kursi_intro", category: "Islam – Essential", title: "Ayat al-Kursi (opening)", ar: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", tr: "Allahu la ilaha illa huwal hayyul qayyum", meaning: "Allah — there is no god but Him, the Living, the Eternal", task: "Ayat al-Kursi is the greatest verse in the Quran (2:255). Memorize its opening." },
    { id: "dua_eat", category: "Islam – Daily", title: "Dua before eating", ar: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ", tr: "bismillahi wa ala barakati Allah", meaning: "In the name of Allah and with Allah's blessings", task: "Say this before every meal for a full week." },
    { id: "dua_after_eat", category: "Islam – Daily", title: "Dua after eating", ar: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ", tr: "alhamdulillahil ladhi at'amana wa saqana wa ja'alana muslimin", meaning: "Praise be to Allah who has fed us, given us drink, and made us Muslims", task: "Say this after finishing your meal." },
    { id: "dua_sleep", category: "Islam – Daily", title: "Dua before sleeping", ar: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", tr: "bismika Allahumma amutu wa ahya", meaning: "In Your name, O Allah, I die and I live", task: "Say this every night before sleeping." },
    { id: "dua_wake", category: "Islam – Daily", title: "Dua after waking", ar: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ", tr: "alhamdulillahil ladhi ahyana ba'da ma amatana wa-ilayhin-nushur", meaning: "Praise to Allah who revived us after He had put us to sleep — and to Him is the resurrection", task: "Say this after waking up instead of checking your phone." },
    { id: "dua_mirror", category: "Islam – Daily", title: "Dua at the mirror", ar: "اللَّهُمَّ حَسَّنْتَ خَلْقِي فَحَسِّنْ خُلُقِي", tr: "Allahumma hassanta khalqi fa hassin khuluqi", meaning: "O Allah, You beautified my creation — beautify my character too", task: "Repeat this looking in the mirror each morning." },
    { id: "salat_times", category: "Islam – Essential", title: "Five prayers", ar: "فَجْر / ظُهْر / عَصْر / مَغْرِب / عِشَاء", tr: "fajr / dhuhr / asr / maghrib / isha", meaning: "Dawn / Noon / Afternoon / Sunset / Night", task: "Memorize the names and order of the 5 daily prayers." },
    { id: "ramadan", category: "Islam – Essential", title: "Ramadan", ar: "رَمَضَان مُبَارَك", tr: "ramadan mubarak", meaning: "Blessed Ramadan", task: "Find out when the next Ramadan starts and mark it in your calendar." },
    { id: "eid", category: "Islam – Essential", title: "Eid Mubarak", ar: "عِيدٌ مُبَارَكٌ", tr: "eid mubarak", meaning: "Blessed celebration", task: "Learn also: كُلَّ عَام وَأَنْتُم بِخَيْر (kullu am wa antum bikhajr) – May you be well every year." },
    { id: "tawakkul", category: "Islam – Values", title: "Tawakkul – trust in God", ar: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", tr: "hasbunallahu wa ni'mal wakil", meaning: "Allah is sufficient for us and He is the best disposer of affairs", task: "Say this when you feel stressed or uncertain." },
    { id: "sabr", category: "Islam – Values", title: "Patience (Sabr)", ar: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", tr: "innallaha ma'as-sabirin", meaning: "Indeed Allah is with the patient (Quran 2:153)", task: "Memorize this verse and say it in difficult moments." },
    { id: "shukr", category: "Islam – Values", title: "Gratitude (Shukr)", ar: "لَئِنْ شَكَرْتُمْ لَأَزِيدَنَّكُمْ", tr: "la in shakartum la azidannakum", meaning: "If you are grateful, I will give you more (Quran 14:7)", task: "Write down 3 things you are grateful for today." },
    { id: "dua_stress", category: "Islam – Daily", title: "Dua in hard times", ar: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ", tr: "la ilaha illa anta subhanaka inni kuntu minaz-zalimin", meaning: "There is no god but You, glory be to You, I was among the wrongdoers (Dua of Yunus)", task: "Repeat 40 times when feeling overwhelmed." }
  ]
};

const LETTER_NAMES_EN = {
  alif: "Alif", ba: "Ba", ta: "Ta", tha: "Tha", jim: "Jim", ha: "Ha", kha: "Kha",
  dal: "Dal", dhal: "Dhal", ra: "Ra", zay: "Zay", sin: "Sin", shin: "Shin", sad: "Sad",
  dad: "Dad", ta_emph: "Ta (emphatic)", za_emph: "Za (emphatic)", ayn: "Ayn", ghayn: "Ghayn",
  fa: "Fa", qaf: "Qaf", kaf: "Kaf", lam: "Lam", mim: "Mim", nun: "Nun", ha2: "Ha", waw: "Waw", ya: "Ya"
};

const WORD_MEANINGS_EN = {
  mama: "mom",
  baba: "dad",
  kitab: "book",
  bait: "house",
  shams: "sun",
  qamar: "moon",
  salam: "peace / hello",
  islam: "Islam",
  quran: "Quran",
  masjid: "mosque",
  lublin: "Lublin",
  batik: "batik",
  borobudur: "Borobudur",
  orangutan: "orangutan",
  pierogi: "pierogi",
  zloty: "zloty",
  halal: "halal",
  rahma: "mercy",
  nur: "light",
  woda: "water",
  ryz: "rice"
};

let deferredInstall = null;
let route = location.hash.replace("#", "") || "home";
let flashDeck = [];
let flashIndex = 0;
let writingLetter = arabicAlphabet[0];
let recognition = null;
let mediaRecorder = null;
let audioChunks = [];
let currentSpeechSample = null;
let dhikrGameTimer = null;
let speechUnlocked = false;
let prayerGuidePrayer = "fajr";
let prayerGuideStep = 0;
const AI_LIMITS = {
  maxPromptLength: 420,
  maxMessages: 16,
  dailyRequests: 10,
  minSecondsBetweenRequests: 20,
  maxTokens: 550,
  maxGeneratedFlashcards: 6,
  maxGeneratedQuizQuestions: 5,
  maxStoredAiFlashcards: 80,
  maxStoredAiQuizzes: 25
};

const AI_TOPIC_SUGGESTIONS = {
  flashcards: [
    { pl: "Modlitwa: wudu i salat", en: "Prayer: wudu and salat" },
    { pl: "Arabskie powitania", en: "Arabic greetings" },
    { pl: "Rodzina i dom", en: "Family and home" },
    { pl: "Koran: krótkie sury", en: "Quran: short surahs" }
  ],
  quiz: [
    { pl: "Filary islamu", en: "Pillars of Islam" },
    { pl: "99 Imion Allaha", en: "99 Names of Allah" },
    { pl: "Wudu krok po kroku", en: "Wudu step by step" },
    { pl: "Podstawowe słowa arabskie", en: "Basic Arabic words" }
  ],
  islam: [
    { pl: "Jak zacząć regularną modlitwę?", en: "How to start praying regularly?" },
    { pl: "Czym jest sunnah?", en: "What is sunnah?" },
    { pl: "Jak uczyć się krótkich sur?", en: "How to learn short surahs?" }
  ]
};

const defaultState = {
  lang: "pl",
  theme: "light",
  points: 0,
  streak: 0,
  lastActive: "",
  learnedLetters: [],
  speechDone: [],
  writingDone: [],
  flashcards: {},
  customFlashcards: [],
  aiFlashcards: [],
  aiQuizzes: [],
  adventurePhotos: [],
  books: [],
  interactiveBooks: [],
  cultureFacts: [],
  aiMessages: [],
  aiUsage: { day: "", count: 0, lastRequestAt: 0 },
  miniLessonsDone: [],
  memoryBest: 0,
  recordings: {},
  writingAttempts: [],
  quizStats: { correct: 0, wrong: 0 },
  quizHistory: [],
  reviewMistakes: {},
  memoryStats: { correct: 0, wrong: 0 },
  pendingAdventurePhoto: null,
  quranSurahs: [],
  quranFavorites: [],
  quranDuaFavorites: [],
  quranAudioCache: {},
  quranReciter: "ar.alafasy",
  badges: [],
  adventureNotes: {},
  audioMemories: {},
  lastSpacedRep: {},
  focusMode: false,
  quranSurahFavorites: [],
  quranTab: "surahs",
  ayatCache: null,
  prayerTimesCache: {},
  learnedLettersLog: [],
  ttsWarningShown: false,
  hifzProgress: {},
  dhikrCounts: { subhana: 0, alhamdu: 0, allahu: 0 },
  groqApiKey: "",
  surahFilter: "all",
  surahSearchQuery: "",
  asmaulSearchQuery: "",
  pillarsQuizStats: { correct: 0, wrong: 0 },
  pillarsQuizHistory: [],
  surahQuizStats: { correct: 0, wrong: 0 },
  surahQuizHistory: [],
  surahQuizBest: 0,
  dhikrGameBest: null,
  dhikrGameHistory: [],
  gameHistory: [],
  activeGame: null,
  lessonsTab: "lessons",
  faqTab: "basics",
  muallafChecklist: [],
  prayerLog: {},
  prayerGuideSessions: 0,
  lastPrayerGuide: null,
  prayerLocations: null,
  prayerModeTab: "today",
  prayerGuideProgress: {},
  wuduChecklist: [],
  prayerLocationMode: "default",
  gpsPrayerLocation: null,
  prayerHistory: [],
  prayerFocusMode: false,
  asmaChallengeBest: 0,
  asmaChallengeHistory: [],
  badgeCategory: "learning",
  journalTab: "notes",
  onboardingComplete: false,
  onboardingLevel: "beginner",
  onboardingPrayerFocus: "yes",
  learningGoal: ""
};

let state = loadState();
let writingInk = 0;
let writingLastPoint = null;
let writingGuideMask = null;
let writingUserMask = null;

function t(key) {
  return I18N[state.lang]?.[key] || I18N.pl[key] || key;
}

function tx(pl, en) {
  return state.lang === "pl" ? pl : en;
}

function localeTag() {
  return state.lang === "pl" ? "pl-PL" : "en-US";
}

function letterName(letter) {
  let name = state.lang === "pl" ? letter.polishName : (LETTER_NAMES_EN[letter.id] || letter.transliteration || letter.id);
  return name
    .replace(" głębokie", "")
    .replace(" miękkie", "")
    .replace(" lekkie", "")
    .replace(" gardłowe", "")
    .replace(" (emphatic)", "");
}

function letterPronunciationText(letter) {
  if (state.lang === "pl") return letter.pronunciation;
  return `Pronunciation guide: ${letter.transliteration}.`;
}

function letterExampleMeaning(letter) {
  if (state.lang === "pl") return letter.example.pl;
  const byWordId = words.find((word) => word.ar === letter.example.ar);
  if (byWordId) return WORD_MEANINGS_EN[byWordId.id] || byWordId.tr || byWordId.pl;
  return letter.example.tr;
}

function wordMeaning(word) {
  return state.lang === "pl" ? word.pl : (WORD_MEANINGS_EN[word.id] || word.tr || word.pl);
}

function activeDailyTasks() {
  return state.lang === "pl" ? dailyTasks : DAILY_TASKS_EN;
}

function updateDocumentI18nMeta() {
  document.documentElement.lang = state.lang;
  document.title = tx("Alif AI - alfabet arabski", "Alif AI - Arabic alphabet");
  $("#homeLogo")?.setAttribute("aria-label", tx("Alif AI - przejdz na strone glowna", "Alif AI - go to home page"));
  $("#headerMenuBtn")?.setAttribute("aria-label", tx("Menu — język, motyw, ustawienia", "Menu — language, theme, settings"));
  $("#closeModal")?.setAttribute("aria-label", tx("Zamknij", "Close"));
  $("#aiFab")?.setAttribute("aria-label", tx("Otworz AI Assistant", "Open AI Assistant"));
  $("#closeAi")?.setAttribute("aria-label", tx("Zamknij", "Close"));
  const menuLang = $("#menuLangLabel");
  if (menuLang) menuLang.textContent = tx("Język", "Language");
  const menuTheme = $("#menuThemeLabel");
  if (menuTheme) menuTheme.textContent = tx("Motyw", "Theme");
  const menuSet = $("#openSettingsBtn");
  if (menuSet) menuSet.textContent = "⚙️ " + tx("Ustawienia", "Settings");
}

function themeMeta(theme) {
  if (theme === "dark") return { icon: "☾", title: "Dark" };
  return { icon: "☀", title: "Light" };
}

function nextTheme(theme) {
  const currentIndex = Math.max(0, THEMES.indexOf(theme));
  return THEMES[(currentIndex + 1) % THEMES.length];
}

function aiSystemPrompt() {
  const sourceRule = state.lang === "en"
    ? `\n\nRELIGIOUS SAFETY: For Islam/prayer/Quran/dua/hadith/halal answers, use only the verified Alif AI source context. Every religious answer must include a "Sources:" section with concrete citations. If no verified source is available, say that the Alif AI database has no verified source for that answer.`
    : `\n\nBEZPIECZENSTWO RELIGIJNE: Dla odpowiedzi o islamie, modlitwie, Quranie, dua, hadith, halal/haram uzywaj tylko zweryfikowanego kontekstu zrodlowego Alif AI. Kazda odpowiedz religijna musi zawierac sekcje "Zrodla:" z konkretnymi cytatami. Jesli nie ma zweryfikowanego zrodla, powiedz, ze baza Alif AI nie ma zweryfikowanego zrodla dla tej odpowiedzi.`;
  const economyRule = state.lang === "en"
    ? `\n\nTOKEN ECONOMY: Be concise. For generated flashcards return at most 6 pairs. For quizzes return at most 5 questions. Do not repeat examples already listed in the app context.`
    : `\n\nOSZCZEDZANIE TOKENOW: Odpowiadaj zwiezle. Dla fiszek zwracaj maksymalnie 6 par. Dla quizow zwracaj maksymalnie 5 pytan. Nie powtarzaj przykladow wymienionych w kontekscie aplikacji.`;
  return (state.lang === "en" ? AI_SYSTEM_PROMPT_EN : AI_SYSTEM_PROMPT_PL) + sourceRule + economyRule;
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const next = { ...defaultState, ...parsed };
    if (!THEMES.includes(next.theme)) next.theme = "light";
    next.learnedLetters = [...new Set(next.learnedLetters || [])].filter((id) => arabicAlphabet.some((letter) => letter.id === id));
    if (!next.quranSurahFavorites) next.quranSurahFavorites = [];
    if (!next.prayerModeTab) next.prayerModeTab = "today";
    if (!next.prayerGuideProgress) next.prayerGuideProgress = {};
    if (!next.wuduChecklist) next.wuduChecklist = [];
    if (!next.prayerHistory) next.prayerHistory = [];
    if (!next.prayerTimesCache) next.prayerTimesCache = {};
    next.reviewMistakes = sanitizeReviewMistakes(next.reviewMistakes);
    return next;
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch(e) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      showToast(tx("⚠️ Pamięć urządzenia jest pełna. Usuń stare zdjęcia lub PDF-y w Ustawieniach.", "⚠️ Device storage is full. Remove old photos or PDFs in Settings."));
    }
  }
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

/**
 * BOLT OPTIMIZATION: Debounce utility to prevent excessive execution of expensive functions
 * during rapid events like typing. Reduces re-renders and CPU usage by ~80% during search.
 */
function debounce(fn, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn.apply(this, args), delay);
  };
}

// Persistent debounced functions to avoid duplicated listeners and closure recreation during view re-renders
const debouncedRenderSurahList = debounce(() => {
  state.surahSearchQuery = $("#surahSearch")?.value || "";
  renderSurahList();
}, 200);

const debouncedAsmaSearch = debounce(() => {
  state.asmaulSearchQuery = $("#asmaSearch")?.value || "";
  const grid = $("#asmaGrid");
  if (grid) grid.innerHTML = renderAsmaulList();
}, 200);

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[char]));
}

function setTrustedHtml(target, html) {
  const el = typeof target === "string" ? $(target) : target;
  if (!el) return;
  el.innerHTML = html;
}

function appendTextBlock(target, tagName, className, text) {
  const el = document.createElement(tagName);
  if (className) el.className = className;
  el.textContent = text;
  target.appendChild(el);
  return el;
}

function markActiveDay() {
  const now = today();
  if (state.lastActive === now) return;
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  state.streak = state.lastActive === yesterday ? state.streak + 1 : 1;
  state.lastActive = now;
  saveState();
}

function addPoints(amount, rerender = true) {
  state.points += amount;
  saveState();
  if (rerender) render();
}

function level() {
  return Math.max(1, Math.floor(state.points / 120) + 1);
}

function levelProgress() {
  const currentLevel = level();
  const currentStart = (currentLevel - 1) * 120;
  const nextAt = currentLevel * 120;
  const earned = Math.max(0, state.points - currentStart);
  const needed = Math.max(1, nextAt - currentStart);
  return {
    currentLevel,
    currentStart,
    nextAt,
    earned,
    needed,
    remaining: Math.max(0, nextAt - state.points),
    percent: Math.min(100, Math.round((earned / needed) * 100))
  };
}

function progressPercent() {
  const learned = new Set(state.learnedLetters).size;
  return Math.max(0, Math.min(100, Math.round((learned / arabicAlphabet.length) * 100)));
}

function formatDateOffset(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function isFreshCache(entry, maxAgeDays = 7) {
  if (!entry?.cachedAt) return false;
  return Date.now() - Date.parse(entry.cachedAt) < maxAgeDays * 86400000;
}

function sanitizeReviewMistakes(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const clean = {};
  Object.entries(input).forEach(([rawKey, rawValue]) => {
    const key = String(rawKey).slice(0, 80);
    const value = Math.max(0, Math.min(99, Math.floor(Number(rawValue) || 0)));
    if (/^(quiz|memory|surah|pillars):[a-z0-9:_ -]+$/i.test(key) && value > 0) clean[key] = value;
  });
  return clean;
}

function activeMistakeTotal() {
  return Object.values(state.reviewMistakes || {}).reduce((sum, value) => sum + Math.max(0, Number(value) || 0), 0);
}

function aiUsageToday() {
  const day = today();
  if (!state.aiUsage || state.aiUsage.day !== day) {
    state.aiUsage = { day, count: 0, lastRequestAt: 0 };
  }
  return state.aiUsage;
}

function canUseAi() {
  const usage = aiUsageToday();
  if (usage.count >= AI_LIMITS.dailyRequests) {
    return { ok: false, reason: tx("Dzisiejszy limit AI został wykorzystany. Wróć jutro albo korzystaj z lekcji offline.", "Today's AI limit is used. Come back tomorrow or use offline lessons.") };
  }
  const waitMs = AI_LIMITS.minSecondsBetweenRequests * 1000 - (Date.now() - (usage.lastRequestAt || 0));
  if (waitMs > 0) {
    return { ok: false, reason: tx(`Poczekaj ${Math.ceil(waitMs / 1000)} s przed kolejną prośbą do AI.`, `Wait ${Math.ceil(waitMs / 1000)}s before the next AI request.`) };
  }
  return { ok: true };
}

function recordAiUse() {
  const usage = aiUsageToday();
  usage.count += 1;
  usage.lastRequestAt = Date.now();
  saveState();
}

function isAiCreationRequest(content = "") {
  return /(fisz|flashcard|cards?|quiz|test|pytan|question)/i.test(content);
}

function existingAiCreationContext() {
  const cardTerms = [
    ...(state.aiFlashcards || []),
    ...(state.customFlashcards || []),
    ...words.slice(0, 80).map(word => ({ front: word.ar, back: wordMeaning(word), hint: word.tr }))
  ].map(card => `${card.front || card.ar || ""} -> ${card.back || card.translation || card.pl || ""}`.trim()).filter(Boolean).slice(0, 80);
  const quizTopics = (state.aiQuizzes || []).map(quiz => quiz.title).slice(0, 20);
  return tx(
    `Unikaj duplikatów. W aplikacji są już fiszki/słowa: ${cardTerms.join("; ") || "brak danych"}. Istniejące quizy AI: ${quizTopics.join("; ") || "brak"}. Twórz nowe, inne przykłady i tematy.`,
    `Avoid duplicates. Existing app cards/words: ${cardTerms.join("; ") || "none"}. Existing AI quizzes: ${quizTopics.join("; ") || "none"}. Create new examples and topics.`
  );
}

function updateReviewMistake(key, isCorrect) {
  state.reviewMistakes = state.reviewMistakes || {};
  const current = Math.max(0, Number(state.reviewMistakes[key]) || 0);
  const next = isCorrect ? Math.max(0, current - 1) : current + 1;
  if (next > 0) state.reviewMistakes[key] = next;
  else delete state.reviewMistakes[key];
}

function shuffledForHome(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function setRoute(next) {
  route = APP_ROUTES.has(next) ? next : "home";
  location.hash = route;
  render();
}

function normalizeRoute() {
  if (APP_ROUTES.has(route)) return;
  route = "home";
  if (location.hash && location.hash !== "#home") {
    history.replaceState(null, "", "#home");
  }
}

function applyThemeMeta() {
  const color = THEME_COLOR[state.theme] || THEME_COLOR.light;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
}

function unlockSpeech() {
  if (speechUnlocked || !("speechSynthesis" in window)) return;
  speechUnlocked = true;
  try {
    speechSynthesis.getVoices();
    speechSynthesis.resume();
  } catch {}
}

function init() {
  markActiveDay();
  muteBadgeNotifications = true;
  checkBadges();
  muteBadgeNotifications = false;
  document.documentElement.dataset.theme = state.theme;
  applyThemeMeta();
  updateDocumentI18nMeta();
  registerPwa();
  watchAppVersion();
  renderNav();
  bindGlobalEvents();
  mountAiAssistant();
  initSearch();
  window.addEventListener("hashchange", () => {
    route = location.hash.replace("#", "") || "home";
    normalizeRoute();
    render();
  });
  normalizeRoute();
  render();
}

function bindGlobalEvents() {
  window.addEventListener("pointerdown", unlockSpeech, { once: true, passive: true });
  window.addEventListener("keydown", unlockSpeech, { once: true });
  $("#homeLogo").addEventListener("click", () => setRoute("home"));
  view.addEventListener("click", (event) => {
    if (event.target.closest("[data-stat-action='level']")) {
      $("#levelDetails")?.classList.toggle("hidden");
    }
  });

  // Header Menu Dropdown
  const headerMenuBtn = $("#headerMenuBtn");
  const headerMenuDropdown = $("#headerMenuDropdown");

  if (headerMenuBtn && headerMenuDropdown) {
    headerMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isHidden = headerMenuDropdown.classList.contains("hidden");
      headerMenuDropdown.classList.toggle("hidden");
      headerMenuBtn.setAttribute("aria-expanded", isHidden ? "true" : "false");
    });

    document.addEventListener("click", (e) => {
      if (!headerMenuDropdown.classList.contains("hidden") && !headerMenuDropdown.contains(e.target)) {
        headerMenuDropdown.classList.add("hidden");
        headerMenuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  document.querySelectorAll(".header-menu-option[data-lang]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.lang = btn.dataset.lang;
      saveState();
      render();
      headerMenuDropdown?.classList.add("hidden");
      headerMenuBtn?.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll(".header-menu-option[data-theme]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.theme = btn.dataset.theme;
      document.documentElement.dataset.theme = state.theme;
      saveState();
      render();
      headerMenuDropdown?.classList.add("hidden");
      headerMenuBtn?.setAttribute("aria-expanded", "false");
    });
  });

  $("#openSettingsBtn")?.addEventListener("click", () => {
    setRoute("settings");
    headerMenuDropdown?.classList.add("hidden");
    headerMenuBtn?.setAttribute("aria-expanded", "false");
  });

  $("#closeModal").addEventListener("click", () => modal.close());
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstall = event;
    $("#installBtn").classList.remove("hidden");
    updateInstallButtons();
  });
  $("#installBtn").addEventListener("click", promptInstall);
  $("#installBtn").textContent = t("install");
  $("#sheetOverlay")?.addEventListener("click", closeBottomSheet);
  $("#exitFocus")?.addEventListener("click", () => toggleFocusMode());
}

function isStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

async function promptInstall() {
  if (isStandalone()) {
    alert(state.lang === "pl" ? "Alif AI jest już zainstalowana." : "Alif AI is already installed.");
    return;
  }
  if (deferredInstall) {
    deferredInstall.prompt();
    await deferredInstall.userChoice;
    deferredInstall = null;
    $("#installBtn").classList.add("hidden");
    updateInstallButtons();
    return;
  }
  alert(state.lang === "pl"
    ? "Aby zainstalować: Android Chrome → menu ⋮ → Zainstaluj aplikację. iPhone Safari → Udostępnij → Do ekranu początkowego."
    : "To install: Android Chrome → menu ⋮ → Install app. iPhone Safari → Share → Add to Home Screen.");
}

function installButtonHtml(extraClass = "") {
  if (isStandalone()) {
    return `<div class="soft-panel ${extraClass} p-4 text-sm font-bold text-[var(--muted)]">${state.lang === "pl" ? "Aplikacja jest zainstalowana na tym urządzeniu." : "The app is installed on this device."}</div>`;
  }
  return `<button class="big-action install-cta ${extraClass} w-full" data-install-app>✦ ${state.lang === "pl" ? "Zainstaluj aplikację" : "Install app"}</button>`;
}

function bindInstallButtons(root = view) {
  root.querySelectorAll("[data-install-app]").forEach((button) => button.addEventListener("click", promptInstall));
}

function updateInstallButtons() {
  document.querySelectorAll("[data-install-app]").forEach((button) => {
    button.classList.toggle("hidden", isStandalone());
  });
}

function showToast(message = tx("Zapisano", "Saved")) {
  const old = document.querySelector(".app-toast");
  if (old) old.remove();
  const toast = document.createElement("div");
  toast.className = "app-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5800);
}

async function clearAppCaches() {
  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith("alif-ai-")).map((key) => caches.delete(key)));
  }
}

async function activateFreshAppVersion(reason = "version") {
  if (window.__alifReloading) return;
  window.__alifReloading = true;
  try {
    localStorage.setItem("alif-app-version", APP_VERSION);
    showToast(tx("Aktualizuje aplikacje do najnowszej wersji...", "Updating the app to the newest version..."));
    if ("serviceWorker" in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(async (registration) => {
        await registration.update().catch(() => {});
        const worker = registration.waiting || registration.installing;
        worker?.postMessage({ type: "SKIP_WAITING", reason });
      }));
    }
    await clearAppCaches();
  } catch {
    // Reload even if cache cleanup failed; the next boot will try again.
  } finally {
    window.location.reload();
  }
}

async function checkAppVersion() {
  if (location.protocol === "file:") return;
  try {
    const response = await fetch(`./version.json?ts=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return;
    const remote = await response.json();
    const remoteVersion = String(remote.version || "").trim();
    if (!remoteVersion) return;
    const storedVersion = localStorage.getItem("alif-app-version");
    if (!storedVersion) {
      localStorage.setItem("alif-app-version", remoteVersion);
      return;
    }
    if (remoteVersion !== storedVersion || remoteVersion !== APP_VERSION) {
      await activateFreshAppVersion("remote-version");
    }
  } catch {
    // Offline use stays available; update check resumes on the next connection.
  }
}

function watchAppVersion() {
  localStorage.setItem("alif-app-version", localStorage.getItem("alif-app-version") || APP_VERSION);
  checkAppVersion();
  window.addEventListener("focus", checkAppVersion);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) checkAppVersion();
  });
  setInterval(checkAppVersion, 5 * 60 * 1000);
}


function openMiniLesson(lessonId) {
  state.lessonsTab = "lessons";
  saveState();
  setRoute("lessons");
  setTimeout(() => {
    const lessonButton = view.querySelector(`[data-lesson="${CSS.escape(lessonId)}"]`);
    lessonButton?.closest("article")?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, 650);
}

function registerPwa() {
  if (!("serviceWorker" in navigator) || location.protocol === "file:") return;

  const isLocalHost = ["localhost", "127.0.0.1"].includes(location.hostname);
  if (isLocalHost) {
    navigator.serviceWorker.getRegistrations()
      .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
      .then(() => ("caches" in window ? caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))) : null))
      .catch(() => {});
    return;
  }

  navigator.serviceWorker.register("./service-worker.js", { updateViaCache: "none" })
    .then((registration) => {
      registration.update().catch(() => {});

      registration.addEventListener("updatefound", () => {
        const installing = registration.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (installing.state === "installed" && navigator.serviceWorker.controller) {
            installing.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });

      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (window.__alifReloading) return;
        window.__alifReloading = true;
        window.location.reload();
      });
    })
    .catch(() => {});
}

function renderNav() {
  const moreActive = secondaryNavItems.some(([id]) => id === route);
  const moreHtml = secondaryNavItems.length ? `
    <button id="moreNavBtn" class="nav-btn haptic-feedback ${moreActive ? "active" : ""} nav-more">
      <span class="text-xl">⋯</span><span class="nav-label">${t("more")}</span>
    </button>` : "";

  nav.innerHTML =
    navItems.map(([id, icon, labelKey]) => `
      <button class="nav-btn haptic-feedback ${route === id || (id === "islam" && ISLAM_ROUTES.includes(route)) ? "active" : ""}" data-route="${id}">
        <span class="text-xl">${icon}</span><span class="nav-label">${t(labelKey)}</span>
      </button>
    `).join("") + moreHtml;

  nav.querySelectorAll("[data-route]").forEach((btn) => {
    btn.addEventListener("click", () => {
      triggerHaptic();
      if (btn.dataset.route === "games") {
        state.activeGame = null;
        saveState();
      }
      setRoute(btn.dataset.route);
    });
  });

  $("#moreNavBtn")?.addEventListener("click", () => {
    if (!secondaryNavItems.length) return;
    triggerHaptic();
    const content = `
      <div class="mb-6"><h2 class="text-2xl font-black text-center">${t("more")}</h2></div>
      <div class="grid grid-cols-3 gap-4 pb-8">
        ${secondaryNavItems.map(([id, icon, labelKey]) => `
          <button class="flex flex-col items-center gap-2 p-4 panel haptic-feedback ${route === id ? "active" : ""}" data-sheet-route="${id}">
            <span class="text-3xl">${icon}</span>
            <span class="text-[10px] font-black uppercase tracking-wider">${t(labelKey)}</span>
          </button>
        `).join("")}
      </div>
    `;
    openBottomSheet(content);
    $("#bottomSheet").querySelectorAll("[data-sheet-route]").forEach(btn => btn.addEventListener("click", () => {
      setRoute(btn.dataset.sheetRoute);
      closeBottomSheet();
    }));
  });
}

function render() {
  if (window._writingResizeHandler) {
    window.removeEventListener("resize", window._writingResizeHandler);
    window._writingResizeHandler = null;
  }
  if (dhikrGameTimer) {
    clearInterval(dhikrGameTimer);
    dhikrGameTimer = null;
  }
  renderNav();
  applyThemeMeta();
  updateDocumentI18nMeta();
  $("#installBtn").textContent = t("install");

  // Update active states in header menu
  document.querySelectorAll(".header-menu-option[data-lang]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.lang === state.lang);
  });
  document.querySelectorAll(".header-menu-option[data-theme]").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.theme === state.theme);
  });

  $("#profileBadge").textContent = "ألف AI";
  const aiFabLabel = $("#aiFab .hidden");
  if (aiFabLabel) aiFabLabel.textContent = t("aiAssistant");
  const aiInput = $("#aiInput");
  if (aiInput) aiInput.placeholder = t("aiPlaceholder");
  // flashcards/speech/writing/alphabet redirect into their hub
  const alphabet = () => { state.lessonsTab = "alphabet"; lessons(); };
  const flashcards = () => { state.activeGame = "flashcards"; games(); };
  const speech = () => { state.activeGame = "speech"; games(); };
  const writing = () => { state.activeGame = "writing"; games(); };
  const books = () => setRoute("culture");
  const views = { home, islam, koran, alphabet, calendar: islamicCalendar, review: reviewCenter, lessons, flashcards, speech, writing, books, culture, games, badges, settings, dhikr, prayer, prayerGuide, asmaul, tajweed, seerah, pillars, muallaf, halalharam, islamfaq, glossary, adventure: learningJournal };
  (views[route] || home)();
}

const MUALLAF_CHECKLIST_GROUPS = [
  {
    id: "7",
    icon: "7",
    titlePl: "Pierwsze 7 dni: spokojny start",
    titleEn: "First 7 days: calm start",
    leadPl: "Tylko fundament: szahada, modlitwa krok po kroku i jedna mala rutyna dziennie.",
    leadEn: "Only the foundation: shahada, step-by-step prayer and one small daily routine.",
    items: [
      { id: "7_shahada", pl: "Powtorz szahade z tlumaczeniem i zapisz pytania do dziennika.", en: "Repeat the shahada with translation and write questions in the journal." },
      { id: "7_fatiha", pl: "Sluchaj Al-Fatihy codziennie przez 3-5 minut.", en: "Listen to Al-Fatiha daily for 3-5 minutes." },
      { id: "7_prayer", pl: "Otworz Prayer Mode i przejdz jedna modlitwe bez presji perfekcji.", en: "Open Prayer Mode and walk through one prayer without pressure to be perfect." },
      { id: "7_wudu", pl: "Naucz sie kolejnosci wudu i przejdz ja powoli raz dziennie.", en: "Learn the order of wudu and practice it slowly once a day." },
      { id: "7_support", pl: "Wybierz jedna zaufana osobe albo meczet do przyszlych pytan.", en: "Choose one trusted person or mosque for future questions." }
    ]
  },
  {
    id: "30",
    icon: "30",
    titlePl: "Pierwsze 30 dni po szahadzie",
    titleEn: "First 30 days after shahada",
    leadPl: "Najpierw rytm, modlitwa i spokojne podstawy. Jedna rzecz naraz.",
    leadEn: "Start with rhythm, prayer and calm basics. One thing at a time.",
    items: [
      { id: "30_shahada", pl: "Zapisz tekst szahady i jej znaczenie własnymi słowami.", en: "Write down the shahada and its meaning in your own words." },
      { id: "30_fatiha", pl: "Ucz się Al-Fatihy po krótkim fragmencie dziennie.", en: "Learn Al-Fatiha in small daily parts." },
      { id: "30_prayer", pl: "Przećwicz ruchy salat z przewodnikiem, nawet jeśli recytacja jest jeszcze prosta.", en: "Practice salat movements with a guide, even while recitation is still simple." },
      { id: "30_mosque", pl: "Znajdź lokalny meczet lub jedną zaufaną osobę do pytań.", en: "Find a local mosque or one trusted person for questions." },
      { id: "30_halal", pl: "Zacznij od najłatwiejszych zmian halal w jedzeniu i codziennych nawykach.", en: "Begin with the easiest halal changes in food and daily habits." }
    ]
  },
  {
    id: "90",
    icon: "90",
    titlePl: "Do 90 dni: stabilny fundament",
    titleEn: "By 90 days: a steady foundation",
    leadPl: "Po trzech miesiącach celem jest stabilność, nie perfekcja.",
    leadEn: "After three months the goal is steadiness, not perfection.",
    items: [
      { id: "90_prayers", pl: "Ułóż realistyczny plan pięciu modlitw wokół pracy, szkoły lub domu.", en: "Build a realistic five-prayer schedule around work, school or home." },
      { id: "90_surahs", pl: "Dodaj 2-3 krótkie sury do recytacji, np. Al-Ikhlas, Al-Falaq, An-Nas.", en: "Add 2-3 short surahs for recitation, such as Al-Ikhlas, Al-Falaq and An-Nas." },
      { id: "90_community", pl: "Odwiedź lekcję, khutbę albo spotkanie dla początkujących.", en: "Attend a lesson, khutbah or beginner-friendly gathering." },
      { id: "90_family", pl: "Przygotuj łagodne odpowiedzi dla rodziny i znajomych, bez presji na spory.", en: "Prepare gentle answers for family and friends without pressure to debate." },
      { id: "90_questions", pl: "Zapisuj pytania fiqh i finansowe do omówienia z lokalnym imamem lub uczonym.", en: "Save fiqh and finance questions for a local imam or qualified scholar." }
    ]
  }
];

function muallafChecklistTotal() {
  return MUALLAF_CHECKLIST_GROUPS.reduce((sum, group) => sum + group.items.length, 0);
}

function muallafChecklistDoneCount() {
  const completed = new Set(state.muallafChecklist || []);
  return MUALLAF_CHECKLIST_GROUPS.reduce((sum, group) => sum + group.items.filter(item => completed.has(item.id)).length, 0);
}

function muallafChecklistPercent() {
  const total = muallafChecklistTotal() || 1;
  return Math.round((muallafChecklistDoneCount() / total) * 100);
}

function isMuallafChecklistDone(id) {
  return (state.muallafChecklist || []).includes(id);
}

function muallaf() {
  const easeHadiths = [
    { ar: "إِنَّ الدِّينَ يُسْرٌ", tr: "Inna-d-Dīna yusrun", source: "Bukhari 39", pl: "«Zaprawdę, religia jest łatwa.» Islam nie jest karą — jest drogą. Każdy krok liczy się.", en: "«Verily, the religion is ease.» Islam is not a punishment — it is a path. Every step counts." },
    { ar: "يَسِّرُوا وَلَا تُعَسِّرُوا", tr: "Yassirū wa-lā tuʿassirū", source: "Bukhari 69", pl: "«Ułatwiajcie, a nie utrudniajcie.» Prorok ﷺ uczył stopniowo — nie dawał wszystkiego naraz.", en: "«Make things easy, not difficult.» The Prophet ﷺ taught gradually — he didn't give everything at once." },
    { ar: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ", tr: "Innamā al-aʿmālu bi-n-niyyāt", source: "Bukhari 1", pl: "«Czyny są oceniane według intencji.» Twój wysiłek i szczerość liczy się bardziej niż perfekcja.", en: "«Actions are judged by intentions.» Your effort and sincerity count more than perfection." },
  ];

  view.innerHTML = `
    <div class="panel p-5 mb-5" style="background:linear-gradient(135deg,var(--panel) 0%,rgba(16,185,129,0.08) 100%);border:1px solid rgba(16,185,129,0.25)">
      <h1 class="text-3xl font-black mb-1">🌱 ${tx("Nowy muzułmanin", "New Muslim")}</h1>
      <p class="text-[var(--muted)]">${tx("Zaczynasz od zera? Doskonale. Islam jest religią łatwości, nie perfekcji.", "Starting from scratch? Perfect. Islam is a religion of ease, not perfection.")}</p>
    </div>

    <h2 class="text-xl font-black mb-3">${tx("7 kroków — po kolei, bez pośpiechu", "7 steps — one at a time, no rush")}</h2>
    <div class="mb-6">
      ${newMuslimSteps.map(s => `
        <div class="muallaf-step">
          <div class="muallaf-step-num">${s.n}</div>
          <div class="muallaf-step-icon">${s.icon}</div>
          <div style="flex:1;min-width:0">
            <p class="font-black text-base mb-1">${state.lang === "pl" ? s.titlePl : s.titleEn}</p>
            <p class="muallaf-step-ar">${s.ar}</p>
            <p class="text-xs text-[var(--muted)] mb-1 font-mono">${s.tr}</p>
            <p class="text-sm text-[var(--muted)] mb-2">${state.lang === "pl" ? s.descPl : s.descEn}</p>
            <div class="muallaf-tip">💡 ${state.lang === "pl" ? s.tipPl : s.tipEn}</div>
          </div>
        </div>
      `).join("")}
    </div>

    <section class="muallaf-checklist panel p-5 mb-6">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-xl font-black">${tx("Plan 30/90 dni po szahadzie", "30/90 day plan after shahada")}</h2>
          <p class="text-sm text-[var(--muted)]">${tx("Checklistę możesz odhaczać we własnym tempie. Aplikacja zapamięta postęp na tym urządzeniu.", "Tick items at your own pace. The app saves progress on this device.")}</p>
        </div>
        <div class="muallaf-progress" aria-label="${tx("Postęp checklisty", "Checklist progress")}">
          <span>${muallafChecklistDoneCount()}/${muallafChecklistTotal()}</span>
          <div><i style="width:${muallafChecklistPercent()}%"></i></div>
        </div>
      </div>
      <div class="muallaf-checklist-grid">
        ${MUALLAF_CHECKLIST_GROUPS.map(group => `
          <div class="muallaf-checklist-group">
            <div class="muallaf-checklist-head">
              <span>${group.icon}</span>
              <div>
                <h3>${state.lang === "pl" ? group.titlePl : group.titleEn}</h3>
                <p>${state.lang === "pl" ? group.leadPl : group.leadEn}</p>
              </div>
            </div>
            <div class="muallaf-checklist-items">
              ${group.items.map(item => `
                <label class="muallaf-check-item">
                  <input type="checkbox" data-muallaf-check="${item.id}" ${isMuallafChecklistDone(item.id) ? "checked" : ""}>
                  <span>${state.lang === "pl" ? item.pl : item.en}</span>
                </label>
              `).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </section>

    <h2 class="text-xl font-black mb-3">${tx("Nie musisz być perfekcyjny", "You don't need to be perfect")}</h2>
    <div class="grid gap-3 mb-6">
      ${easeHadiths.map(h => `
        <div class="panel p-4">
          <p class="arabic text-xl text-[var(--accent)] mb-1" style="direction:rtl">${h.ar}</p>
          <p class="text-xs font-mono text-[var(--muted)] mb-2">${h.tr}</p>
          <p class="text-sm">${state.lang === "pl" ? h.pl : h.en}</p>
          <p class="text-xs text-[var(--muted)] mt-2 italic">${h.source}</p>
          <p class="quality-meta">${hadithQuality(h).source_type} · ${hadithQuality(h).collection} · ${hadithQuality(h).verified ? trustLabel(CONTENT_TRUST.VERIFIED) : trustLabel(CONTENT_TRUST.UNVERIFIED)} · ${tx("Sprawdzone:", "Checked:")} ${hadithQuality(h).reviewed_at}</p>
        </div>
      `).join("")}
    </div>

    <h2 class="text-xl font-black mb-3">${tx("Praktyczne wskazówki dla konwertytów", "Practical tips for converts")}</h2>
    <div class="grid gap-3 sm:grid-cols-2">
      ${[
        { icon: "🕌", pl: "Znajdź lokalny meczet — imam pomoże Ci z podstawami bezpłatnie.", en: "Find a local mosque — the imam will help you with the basics free of charge." },
        { icon: "🤝", pl: "Nie musisz ogłaszać swojej konwersji — to między tobą a Allahem.", en: "You don't need to announce your conversion — it is between you and Allah." },
        { icon: "📖", pl: "Zacznij od krótkiej sury Al-Ikhlas (112) — 4 wersety, serce teologii islamu.", en: "Start with the short surah Al-Ikhlas (112) — 4 verses, the heart of Islamic theology." },
        { icon: "💚", pl: "Błędy w wymowie są wybaczalne — Allah wie, co jest w sercu.", en: "Pronunciation mistakes are forgivable — Allah knows what is in the heart." },
        { icon: "🌍", pl: "Rozne kraje i kultury — muzułmanie są wszędzie. Nie jesteś sam.", en: "Many countries and cultures — Muslims are everywhere. You are not alone." },
        { icon: "🤲", pl: "Modlitwa (salat) może być uczona stopniowo — ważna jest intencja, nie perfekcja.", en: "Prayer (salat) can be learned gradually — what matters is intention, not perfection." },
      ].map(tip => `
        <div class="panel p-4 flex gap-3 items-start">
          <span class="text-2xl">${tip.icon}</span>
          <p class="text-sm text-[var(--muted)]">${state.lang === "pl" ? tip.pl : tip.en}</p>
        </div>
      `).join("")}
    </div>
  `;

  view.querySelectorAll("[data-muallaf-check]").forEach((input) => {
    input.addEventListener("change", () => {
      const current = new Set(state.muallafChecklist || []);
      if (input.checked) current.add(input.dataset.muallafCheck);
      else current.delete(input.dataset.muallafCheck);
      state.muallafChecklist = [...current];
      saveState();
      muallaf();
    });
  });
}

function halalharam() {
  const tabs = [
    { id: "food",     labelPl: "🥩 Jedzenie",   labelEn: "🥩 Food" },
    { id: "drinks",   labelPl: "🍷 Napoje",      labelEn: "🍷 Drinks" },
    { id: "behavior", labelPl: "⚖ Zachowanie",  labelEn: "⚖ Behaviour" },
    { id: "gray",     labelPl: "❓ Szare strefy", labelEn: "❓ Gray areas" },
  ];
  const activeTab = state.halalTab || "food";

  function renderItems() {
    if (activeTab === "gray") {
      return halalHaramData.gray.map(item => `
        <div class="panel p-4 mb-3">
          <p class="font-black text-sm mb-2">${item.icon} ${state.lang === "pl" ? item.questionPl : item.questionEn}</p>
          <p class="text-sm text-[var(--muted)]">${state.lang === "pl" ? item.answerPl : item.answerEn}</p>
          <p class="quality-meta">${trustLabel(CONTENT_TRUST.CONTEXT_DEPENDENT)} · ${tx("Skonsultuj uczonego przy decyzjach osobistych.", "Consult a scholar for personal decisions.")}</p>
        </div>
      `).join("");
    }
    return halalHaramData[activeTab].map(item => `
      <div class="halalharam-card ${item.status}">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-2xl">${item.icon}</span>
          <span class="halalharam-name">${item.namePl && state.lang === "pl" ? item.namePl : item.nameEn}</span>
          <span class="verdict-badge ${item.status}" style="margin-left:auto">${item.status === "halal" ? "✓ HALAL" : item.status === "haram" ? "✗ HARAM" : "~ MAKRUH"}</span>
        </div>
        ${item.ar ? `<p class="halalharam-ar">${item.ar} <span style="font-size:11px;direction:ltr;display:inline-block">${item.tr}</span></p>` : ""}
        <p class="text-sm text-[var(--muted)] mt-1">${state.lang === "pl" ? item.reasonPl : item.reasonEn}</p>
        ${item.ref ? `<p class="text-xs text-[var(--muted)] mt-2 italic">${item.ref}</p>` : ""}
      </div>
    `).join("");
  }

  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">⚖ ${tx("Halal & Haram", "Halal & Haram")}</h1>
      <p class="text-[var(--muted)] mt-1 text-sm">${tx("Zasada islamu: wszystko jest halal, chyba że dowód mówi inaczej.", "Islamic principle: everything is halal unless evidence says otherwise.")}</p>
    </div>
    <div class="flex gap-1 mb-4 overflow-x-auto pb-1">
      ${tabs.map(tab => `
        <button class="px-3 py-2 text-sm font-black rounded-full whitespace-nowrap border ${activeTab === tab.id ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "border-[var(--border)] text-[var(--muted)]"}" data-halalTab="${tab.id}">
          ${state.lang === "pl" ? tab.labelPl : tab.labelEn}
        </button>
      `).join("")}
    </div>
    <div id="halalContent">${renderItems()}</div>
    <div class="panel p-3 mt-4 text-xs text-[var(--muted)]">
      ${tx(RELIGIOUS_NOTICE.pl, RELIGIOUS_NOTICE.en)}
    </div>
  `;

  view.querySelectorAll("[data-halalTab]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.halalTab = btn.dataset.halaltab;
      saveState();
      halalharam();
    });
  });
}

function islamfaq() {
  const tabs = [
    { id: "basics",    labelPl: "📚 Podstawy",       labelEn: "📚 Basics" },
    { id: "daily",     labelPl: "🧭 Codzienność",    labelEn: "🧭 Daily life" },
    { id: "converts",  labelPl: "🌱 Konwersja",      labelEn: "🌱 Converts" },
    { id: "myths",     labelPl: "🔍 Mity i fakty",   labelEn: "🔍 Myths & facts" },
    { id: "women",     labelPl: "👩 Kobiety",         labelEn: "👩 Women" },
    { id: "religions", labelPl: "🕊 Religie",         labelEn: "🕊 Religions" },
    { id: "terrorism", labelPl: "⚠ Terroryzm",       labelEn: "⚠ Terrorism" },
  ];
  const activeTab = state.faqTab || "basics";
  const verdictLabel = { false: tx("MIT", "MYTH"), complex: tx("ZŁOŻONE", "COMPLEX"), info: tx("FAKT", "FACT") };

  const filtered = islamicFaqExpanded.filter(q => q.tab === activeTab);
  const verifiedCount = islamicFaqExpanded.filter(q => q.verified).length;

  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">❓ ${tx("FAQ islamu", "Islam FAQ")}</h1>
      <p class="text-[var(--muted)] mt-1 text-sm">${tx("Pytania, które zadają wszyscy — uczciwe odpowiedzi.", "Questions everyone asks — honest answers.")}</p>
      <p class="text-xs text-[var(--muted)] mt-2">${tx("Curated content: bez sztucznego powielania. Widoczne sa unikalne odpowiedzi z metadanymi zrodel.", "Curated content: no artificial duplication. Unique answers include source metadata.")} ${verifiedCount}/${islamicFaqExpanded.length}</p>
      <p class="text-[var(--muted)] mt-1 text-xs">${tx("Wersja treści", "Content version")}: <strong>${CONTENT_VERSION}</strong> · ${tx("Aktualizacja", "Updated")}: <strong>${CONTENT_UPDATED_AT}</strong></p>
    </div>
    <div class="flex gap-1 mb-4 overflow-x-auto pb-1">
      ${tabs.map(tab => `
        <button class="px-3 py-2 text-sm font-black rounded-full whitespace-nowrap border ${activeTab === tab.id ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "border-[var(--border)] text-[var(--muted)]"}" data-faqTab="${tab.id}">
          ${state.lang === "pl" ? tab.labelPl : tab.labelEn}
        </button>
      `).join("")}
    </div>
    <div>
      ${filtered.map(q => `
        <div class="faq-card" data-open="false" data-faqid="${q.id}">
          <button class="faq-question">
            <span>${state.lang === "pl" ? q.qPl : q.qEn}</span>
            <span class="faq-arrow">▾</span>
          </button>
          <div class="faq-answer hidden">
            ${q.verdict ? `<span class="verdict-badge ${q.verdict}">${verdictLabel[q.verdict] || q.verdict}</span>` : ""}
            <span class="trust-badge ${trustClass(q.confidence)}">${trustLabel(q.confidence)}</span>
            ${q.high_risk ? `<span class="trust-badge high-risk">${tx("SKONSULTUJ UCZONEGO", "CONSULT A SCHOLAR")}</span>` : ""}
            <p>${state.lang === "pl" ? q.aPl : q.aEn}</p>
            ${q.high_risk ? `<p class="religious-risk-note">${tx(HIGH_RISK_RELIGIOUS_NOTICE.pl, HIGH_RISK_RELIGIOUS_NOTICE.en)}</p>` : ""}
            <p class="faq-ref">Source: ${escapeHtml(q.source || q.ref || tx("Brak zweryfikowanego zrodla", "No verified source"))}</p>
            <p class="quality-meta">${escapeHtml(q.source_type)} · ${tx("Sprawdzone:", "Checked:")} ${escapeHtml(q.reviewed_at)}</p>
          </div>
        </div>
      `).join("")}
    </div>
    <div class="panel p-3 mt-4 text-xs text-[var(--muted)]">
      ${tx(RELIGIOUS_NOTICE.pl, RELIGIOUS_NOTICE.en)}
    </div>
  `;

  view.querySelectorAll("[data-faqTab]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.faqTab = btn.dataset.faqtab;
      saveState();
      islamfaq();
    });
  });

  view.querySelectorAll(".faq-card").forEach(card => {
    card.querySelector(".faq-question").addEventListener("click", () => {
      const isOpen = card.dataset.open === "true";
      card.dataset.open = isOpen ? "false" : "true";
      card.querySelector(".faq-answer").classList.toggle("hidden", isOpen);
    });
  });
}

function islam() {
  const tiles = [
    { route: "koran",   icon: "📖", titlePl: "Qur'an",           titleEn: "Qur'an",          descPl: "Czytaj, słuchaj i zapisuj sury",                        descEn: "Read, listen and save surahs" },
    { route: "pillars", icon: "⭐", titlePl: "Filary Islamu",     titleEn: "Pillars of Islam", descPl: "5 Filarów Islamu + 6 Filarów Imanu",                    descEn: "5 Pillars of Islam + 6 Pillars of Iman" },
    { route: "prayerGuide", icon: "🧎", titlePl: "Prayer Mode",   titleEn: "Prayer Mode",      descPl: "Przewodnik salat krok po kroku dla początkujących",       descEn: "Step-by-step salat guide for beginners" },
    { route: "prayer",  icon: "🕌", titlePl: "Czasy modlitw",     titleEn: "Prayer times",     descPl: "Makkah + Madinah + Qibla",                     descEn: "Makkah + Madinah + Qibla" },
    { route: "asmaul",  icon: "☪",  titlePl: "99 Imion Allaha",  titleEn: "99 Names of Allah",descPl: "Asma ul-Husna — piękne imiona Boga",                    descEn: "Asma ul-Husna — beautiful Names of God" },
    { route: "seerah",  icon: "🌙", titlePl: "Seerah",            titleEn: "Seerah",           descPl: "Życie Proroka Muhammada ﷺ",                             descEn: "Life of Prophet Muhammad ﷺ" },
    { route: "tajweed", icon: "🔤", titlePl: "Tadżwid",           titleEn: "Tajweed",          descPl: "8 zasad prawidłowej recytacji",                         descEn: "8 rules for correct Quran recitation" },
    { route: "muallaf",    icon: "🌱", titlePl: "Nowy muzułmanin",  titleEn: "New Muslim",       descPl: "Pierwsze kroki, szahada i nie musisz być perfekcyjny",        descEn: "First steps, shahada and you don't need to be perfect" },
    { route: "halalharam", icon: "⚖",  titlePl: "Halal & Haram",   titleEn: "Halal & Haram",   descPl: "Jedzenie, napoje, zachowanie — co wolno, czego nie",          descEn: "Food, drinks, behaviour — what is and isn't allowed" },
    { route: "dhikr",      icon: "📿", titlePl: "Dhikr",            titleEn: "Dhikr",           descPl: "Licznik subhanallah, alhamdulillah, allahu akbar",            descEn: "Subhanallah, alhamdulillah, allahu akbar counter" },
    { route: "islamfaq",   icon: "❓", titlePl: "FAQ islamu",       titleEn: "Islam FAQ",        descPl: "Mity, islamofobia, kobiety, terroryzm, inne religie",         descEn: "Myths, Islamophobia, women, terrorism, other religions" },
    { route: "glossary",   icon: "Aa", titlePl: "Słownik pojęć",    titleEn: "Glossary",         descPl: "Najważniejsze słowa: wudu, sunnah, fiqh, aqidah",             descEn: "Key terms: wudu, sunnah, fiqh, aqidah" }
  ];
  view.innerHTML = `
    <div class="mb-5">
      <h1 class="text-3xl font-black">☪ ${tx("Islam", "Islam")}</h1>
      <p class="text-[var(--muted)] mt-1">${tx("Wiedza islamska od podstaw — wybierz temat", "Islamic knowledge from the basics — choose a topic")}</p>
    </div>
    <div class="grid gap-3 sm:grid-cols-2">
      ${tiles.map(t => `
        <button class="islam-tile text-left" data-route="${t.route}">
          <span class="islam-tile-icon">${t.icon}</span>
          <div>
            <p class="islam-tile-title">${state.lang === "pl" ? t.titlePl : t.titleEn}</p>
            <p class="islam-tile-desc">${state.lang === "pl" ? t.descPl : t.descEn}</p>
          </div>
        </button>
      `).join("")}
    </div>
  `;
  view.querySelectorAll("[data-route]").forEach(btn =>
    btn.addEventListener("click", () => setRoute(btn.dataset.route))
  );
}

function glossary() {
  const terms = [
    { ar: "الوضوء", tr: "wudu", pl: "Obmycie przed modlitwą.", en: "Ritual washing before prayer." },
    { ar: "الغسل", tr: "ghusl", pl: "Pełne obmycie rytualne.", en: "Full ritual washing." },
    { ar: "السنة", tr: "sunnah", pl: "Praktyka i nauczanie Proroka Muhammada ﷺ.", en: "The practice and teaching of Prophet Muhammad ﷺ." },
    { ar: "الفقه", tr: "fiqh", pl: "Rozumienie prawa islamskiego w praktyce.", en: "Practical understanding of Islamic law." },
    { ar: "العقيدة", tr: "aqidah", pl: "Podstawy wiary i przekonań muzułmanina.", en: "Core beliefs of a Muslim." },
    { ar: "الدعاء", tr: "dua", pl: "Osobista prośba i modlitwa do Allaha.", en: "Personal supplication to Allah." },
    { ar: "الذكر", tr: "dhikr", pl: "Wspominanie Allaha słowami i sercem.", en: "Remembrance of Allah by words and heart." },
    { ar: "الحلال", tr: "halal", pl: "To, co jest dozwolone.", en: "What is permissible." },
    { ar: "الحرام", tr: "haram", pl: "To, co jest zakazane.", en: "What is forbidden." },
    { ar: "النية", tr: "niyyah", pl: "Intencja stojąca za czynem.", en: "The intention behind an action." }
  ];

  view.innerHTML = `
    <div class="mb-5">
      <p class="font-bold text-emerald-600">${tx("Islam", "Islam")}</p>
      <h1 class="text-3xl font-black">${tx("Słownik pojęć", "Glossary")}</h1>
      <p class="text-[var(--muted)] mt-1">${tx("Krótka mapa podstawowych słów, które często wracają w nauce.", "A short map of key words that often return while learning.")}</p>
    </div>
    <div class="grid gap-3 sm:grid-cols-2">
      ${terms.map(term => `
        <article class="panel p-4">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h2 class="text-xl font-black">${escapeHtml(term.tr)}</h2>
              <p class="text-sm text-[var(--muted)]">${state.lang === "pl" ? escapeHtml(term.pl) : escapeHtml(term.en)}</p>
            </div>
            <p class="arabic text-3xl leading-none" style="direction:rtl">${escapeHtml(term.ar)}</p>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}


function homeFavoriteGroups() {
  const favoriteLimit = 24;
  const surahs = shuffledForHome((state.quranSurahFavorites || []).slice(0, favoriteLimit))
    .map(num => {
      const surah = SURAH_LIST.find(item => item.number === num);
      return surah
        ? {
            type: "surah",
            title: `${surah.number}. ${surah.enName}`,
            sub: `${surah.meaning} · ${surah.numberOfAyahs} ${tx("wersetow", "ayahs")}`,
            target: "koran",
            quranTab: "surahs",
            openSurah: surah.number
          }
        : null;
    })
    .filter(Boolean);
  const duas = shuffledForHome((state.quranDuaFavorites || []).slice(0, favoriteLimit))
    .map(id => {
      const dua = DUA_DATA.find(item => item.id === id);
      return dua
        ? {
            type: "dua",
            title: state.lang === "pl" ? dua.pl : dua.en,
            sub: dua.tr,
            target: "koran",
            quranTab: "dua"
          }
        : null;
    })
    .filter(Boolean);
  const ayahs = shuffledForHome((state.quranFavorites || []).slice(0, favoriteLimit)).map(entry => {
    const isObj = typeof entry === "object";
    const num = isObj ? entry.num : entry;
    const surah = isObj ? entry.surahName || "" : "";
    const trans = isObj ? entry.trans || "" : "";
    const ar = isObj ? entry.ar || "" : "";
    return {
      type: "ayah",
      title: `${surah ? `${surah} · ` : ""}${tx("Werset", "Ayah")} ${num}`,
      sub: trans || tx("Ulubiony werset", "Favorite ayah"),
      ar,
      target: "koran",
      quranTab: "favayahs"
    };
  });
  return { surahs, duas, ayahs };
}

function homeFavoritesCarousel(title, items, emptyText, emptyRoute, emptyTab = "") {
  return `
    <section class="home-favorites-carousel">
      <div class="mb-2 flex items-center justify-between gap-3">
        <h3 class="text-sm font-black uppercase tracking-wide text-[var(--muted)]">${title}</h3>
        <span class="text-xs font-black text-[var(--muted)]">${items.length}</span>
      </div>
      ${
        items.length
          ? `<div class="home-carousel-track">
              ${items
                .map(
                  item => `
                <button class="home-carousel-card soft-panel text-left" data-home-fav="${item.target}" ${item.quranTab ? `data-quran-tab="${item.quranTab}"` : ""} ${item.openSurah ? `data-home-surah="${item.openSurah}"` : ""}>
                  <p class="text-sm font-black">${escapeHtml(item.title)}</p>
                  ${item.ar ? `<p class="arabic mt-3 text-right text-2xl leading-loose">${escapeHtml(item.ar)}</p>` : ""}
                  <p class="mt-2 text-xs text-[var(--muted)]">${escapeHtml(item.sub)}</p>
                </button>
              `
                )
                .join("")}
            </div>`
          : `<button class="home-carousel-empty soft-panel text-left" data-route="${emptyRoute}" ${emptyTab ? `data-quran-tab="${emptyTab}"` : ""}>
              ${emptyText}
            </button>`
      }
    </section>
  `;
}

function nextStepSuggestion() {
  if (state.learningGoal === "letters") {
    return {
      route: "lessons",
      title: tx("Dzisiejsza lekcja", "Today's lesson"),
      text: tx("Zrob jedna spokojna lekcje i potem mala powtorke.", "Do one calm lesson and then a small review."),
      action: tx("Otworz lekcje", "Open lessons")
    };
  }
  if (state.learningGoal === "prayer" || state.onboardingPrayerFocus === "yes") {
    return {
      route: "prayer",
      title: tx("Modlitwa krok po kroku", "Prayer step by step"),
      text: tx("Otworz Prayer Mode: dziennik, wudu, qibla i przewodnik salat.", "Open Prayer Mode: journal, wudu, qibla and salat guide."),
      action: tx("Otworz Prayer Mode", "Open Prayer Mode")
    };
  }
  if (state.learningGoal === "quran") {
    return {
      route: "koran",
      quranTab: "hifz",
      title: tx("Quran i krotkie sury", "Quran and short surahs"),
      text: tx("Zacznij od Al-Ikhlas, potem Al-Falaq i An-Nas.", "Start with Al-Ikhlas, then Al-Falaq and An-Nas."),
      action: tx("Otworz Quran", "Open Quran")
    };
  }
  if (state.learningGoal === "basics") {
    return {
      route: "islam",
      title: tx("Podstawy islamu", "Islam basics"),
      text: tx("Przejdz przez filary, FAQ i slownik pojec bez presji.", "Go through pillars, FAQ and glossary without pressure."),
      action: tx("Otworz Islam", "Open Islam")
    };
  }
  if ((state.muallafChecklist || []).length < 3) {
    return {
      route: "muallaf",
      title: tx("Nastepny krok", "Next step"),
      text: tx("Zrob pierwszy tydzien planu po szahadzie: szahada, Al-Fatiha i jedna modlitwa z przewodnikiem.", "Start the first week plan after shahada: shahada, Al-Fatiha and one guided prayer."),
      action: tx("Otworz plan", "Open plan")
    };
  }
  const todayLog = state.prayerLog?.[today()] || {};
  if (OBLIGATORY_PRAYERS.filter(name => todayLog[name]).length < 5) {
    return {
      route: "prayer",
      title: tx("Dziennik modlitw", "Prayer journal"),
      text: tx("Zaznacz dzisiejsze modlitwy i sprawdz najblizszy czas salat.", "Tick today's prayers and check the next salat time."),
      action: tx("Zaznacz modlitwy", "Track prayers")
    };
  }
  if (!state.hifzProgress?.[112] || state.hifzProgress[112] !== "memorized") {
    return {
      route: "koran",
      quranTab: "hifz",
      title: tx("Nauka krotkich sur", "Short surah practice"),
      text: tx("Zacznij od Al-Ikhlas: 4 wersety i bardzo mocny fundament aqidah.", "Start with Al-Ikhlas: 4 verses and a strong aqidah foundation."),
      action: tx("Otworz nauke sur", "Open surah practice")
    };
  }
  return {
    route: "glossary",
    title: tx("Slownik pojec", "Glossary"),
    text: tx("Utrwal podstawowe pojecia: wudu, ghusl, sunnah, fiqh, aqidah.", "Review key terms: wudu, ghusl, sunnah, fiqh, aqidah."),
    action: tx("Otworz slownik", "Open glossary")
  };
}

function nextStepCard() {
  const next = nextStepSuggestion();
  return `
    <button class="panel p-4 text-left w-full flex items-center justify-between gap-3 active:scale-95 transition-transform" data-route="${next.route}" ${next.quranTab ? `data-quran-tab="${next.quranTab}"` : ""}>
      <div>
        <h2 class="text-base font-black">${next.title}</h2>
        <p class="text-xs text-[var(--muted)] mt-0.5">${next.text}</p>
        <p class="mt-2 text-xs font-black text-emerald-600">${next.action}</p>
      </div>
      <span class="text-xl">&gt;</span>
    </button>
  `;
}

function reviewBuckets() {
  const now = Date.now();
  const tomorrow = now + 86400000;
  const later = tomorrow + 86400000;
  return Object.values(state.flashcards || {}).reduce((acc, meta) => {
    if (!meta?.due) return acc;
    if (meta.due <= now) acc.today += 1;
    else if (meta.due <= tomorrow) acc.tomorrow += 1;
    else if (meta.due <= later) acc.later += 1;
    return acc;
  }, { today: 0, tomorrow: 0, later: 0 });
}

function reviewCalendarHtml() {
  const buckets = reviewBuckets();
  const items = [
    { label: tx("Dzis", "Today"), value: buckets.today, date: today() },
    { label: tx("Jutro", "Tomorrow"), value: buckets.tomorrow, date: formatDateOffset(1) },
    { label: tx("Pozniej", "Later"), value: buckets.later, date: formatDateOffset(2) }
  ];
  return `
    <div class="learning-mini-grid mt-4">
      ${items.map(item => `
        <button class="learning-mini-card" data-route="flashcards">
          <strong>${item.value}</strong>
          <span>${item.label}</span>
          <small>${item.date}</small>
        </button>
      `).join("")}
    </div>
  `;
}

function reviewMistakeDetail(key, count) {
  const [type, rawId = ""] = String(key).split(":");
  const amount = Math.max(0, Number(count) || 0);
  if (!amount) return null;
  if (type === "quiz" || type === "memory") {
    const letter = arabicAlphabet.find(item => item.id === rawId);
    return {
      key,
      count: amount,
      title: letter ? letterName(letter) : rawId,
      sub: type === "quiz" ? tx("Quiz liter", "Letter quiz") : tx("Memory Match", "Memory Match"),
      route: "games",
      game: type === "quiz" ? "quiz" : "memory"
    };
  }
  if (type === "surah") {
    const surah = SURAH_LIST.find(item => String(item.number) === rawId);
    return {
      key,
      count: amount,
      title: surah ? `${surah.number}. ${surah.enName}` : tx("Sura", "Surah"),
      sub: tx("Quiz sur Koranu", "Quran surah quiz"),
      route: "games",
      game: "surahQuiz"
    };
  }
  if (type === "pillars") {
    const allPillars = [
      ...pillarsOfIslam.map(item => ({ ...item, kind: "islam", category: tx("Filary Islamu", "Pillars of Islam") })),
      ...pillarsOfIman.map(item => ({ ...item, kind: "iman", category: tx("Filary Imanu", "Pillars of Iman") }))
    ];
    const pillar = allPillars.find(item => `${item.kind}-${item.n}` === rawId || `${item.n}-${item.category}` === rawId);
    return {
      key,
      count: amount,
      title: pillar ? (state.lang === "pl" ? pillar.pl : pillar.en) : tx("Filary", "Pillars"),
      sub: tx("Quiz filarow", "Pillars quiz"),
      route: "games",
      game: "pillarsQuiz"
    };
  }
  return {
    key,
    count: amount,
    title: rawId || key,
    sub: tx("Powtorka", "Review"),
    route: "games",
    game: "quiz"
  };
}

function reviewMistakeItems() {
  return Object.entries(state.reviewMistakes || {})
    .map(([key, count]) => reviewMistakeDetail(key, count))
    .filter(Boolean)
    .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title, localeTag()));
}

function reviewCenter() {
  const items = reviewMistakeItems();
  const total = activeMistakeTotal();
  view.innerHTML = `
    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="font-bold text-emerald-600">${tx("Centrum nauki", "Learning center")}</p>
        <h1 class="text-3xl font-black">${tx("Do poprawy", "To improve")}</h1>
        <p class="mt-2 text-sm text-[var(--muted)]">${tx("Aktywne zaleglosci maleja, gdy odpowiesz poprawnie w danym trybie.", "Active items decrease when you answer correctly in that mode.")}</p>
      </div>
      <button class="big-action border border-[var(--line)] bg-[var(--surface)]" data-route="home">${tx("Wroc", "Back")}</button>
    </div>
    <section class="panel p-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-black uppercase tracking-wide text-[var(--muted)]">${tx("Aktywne bledy", "Active mistakes")}</p>
          <p class="mt-1 text-4xl font-black text-[var(--accent)]">${total}</p>
        </div>
        <button id="clearReviewMistakes" class="big-action border border-[var(--line)] bg-[var(--surface)] ${total ? "" : "opacity-50"}" ${total ? "" : "disabled"}>${tx("Wyczysc liste", "Clear list")}</button>
      </div>
    </section>
    <section class="review-grid mt-4">
      ${
        items.length
          ? items
              .map(
                item => `
          <article class="review-card">
            <div>
              <p class="text-xs font-black uppercase tracking-wide text-[var(--muted)]">${escapeHtml(item.sub)}</p>
              <h2 class="mt-1 text-lg font-black">${escapeHtml(item.title)}</h2>
              <p class="mt-2 text-sm text-[var(--muted)]">${tx("Zaleglosci:", "Due:")} ${item.count}</p>
            </div>
            <button class="big-action bg-emerald-500 text-white" data-review-game="${item.game}" data-route="${item.route}">${tx("Cwicz", "Practice")}</button>
          </article>
        `
              )
              .join("")
          : `<div class="panel p-6 text-center">
              <h2 class="text-xl font-black">${tx("Czysto", "All clear")}</h2>
              <p class="mt-2 text-sm text-[var(--muted)]">${tx("Nie masz teraz aktywnych bledow. Zrob krotki quiz albo fiszki.", "You have no active mistakes right now. Do a short quiz or flashcards.")}</p>
              <button class="big-action mt-4 bg-emerald-500 text-white" data-route="games">${tx("Otworz gry", "Open games")}</button>
            </div>`
      }
    </section>
  `;
  $("#clearReviewMistakes")?.addEventListener("click", () => {
    state.reviewMistakes = {};
    saveState();
    reviewCenter();
  });
  view.querySelectorAll("[data-route]").forEach(button => {
    button.addEventListener("click", () => {
      if (button.dataset.reviewGame) {
        state.activeGame = button.dataset.reviewGame;
        saveState();
      }
      setRoute(button.dataset.route);
    });
  });
}

function learningCenter() {
  const dueNow = Date.now();
  const dueCards = Object.values(state.flashcards || {}).filter((meta) => meta?.due && meta.due <= dueNow).length;
  const wrongAnswers = activeMistakeTotal();
  const latestWriting = (state.writingAttempts || [])[0];
  const lastMistake = latestWriting && latestWriting.score < 70
    ? tx(`Pisanie litery: ${latestWriting.letter}`, `Writing letter: ${latestWriting.letter}`)
    : wrongAnswers > 0
      ? tx(`${wrongAnswers} odpowiedzi do poprawy`, `${wrongAnswers} answers to revisit`)
      : tx("Brak zapisanych bledow", "No saved mistakes");
  const reviewText = dueCards > 0
    ? tx(`${dueCards} fiszek czeka`, `${dueCards} flashcards due`)
    : tx("Zrob 3 spokojne fiszki", "Do 3 calm flashcards");
  const next = nextStepSuggestion();
  const prayerDone = Object.values(state.prayerLog?.[today()] || {}).filter(Boolean).length;

  return `
    <section class="learning-center panel p-5 sm:p-6 mb-4" aria-label="${tx("Centrum nauki", "Learning center")}">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p class="text-xs font-black uppercase tracking-wide text-emerald-600">${tx("Centrum nauki", "Learning center")}</p>
          <h2 class="mt-1 text-2xl font-black">${tx("Co robimy teraz?", "What now?")}</h2>
        </div>
        <button class="big-action bg-emerald-500 text-white" data-route="${next.route}" ${next.quranTab ? `data-quran-tab="${next.quranTab}"` : ""}>${next.action}</button>
      </div>
      <div class="learning-center-grid mt-4">
        <button class="learning-center-card" data-route="${next.route}" ${next.quranTab ? `data-quran-tab="${next.quranTab}"` : ""}>
          <span>01</span>
          <strong>${tx("Dzisiejsza lekcja", "Today's lesson")}</strong>
          <small>${next.text}</small>
        </button>
        <button class="learning-center-card" data-route="flashcards">
          <span>02</span>
          <strong>${tx("Nastepna powtorka", "Next review")}</strong>
          <small>${reviewText}</small>
        </button>
        <button class="learning-center-card" data-route="${wrongAnswers > 0 ? "review" : latestWriting?.score < 70 ? "writing" : "games"}">
          <span>03</span>
          <strong>${tx("Ostatni blad", "Last mistake")}</strong>
          <small>${lastMistake}</small>
        </button>
        <button class="learning-center-card" data-route="prayer">
          <span>${prayerDone}/5</span>
          <strong>${tx("Modlitwy dzisiaj", "Prayers today")}</strong>
          <small>${tx("Lokalny dziennik bez wysylania danych", "Local journal, no data sent")}</small>
        </button>
      </div>
      ${reviewCalendarHtml()}
    </section>
  `;
}

const ONBOARDING_GOALS = [
  { id: "letters", route: "alphabet", icon: "Aa", pl: "Chcę zacząć od liter", en: "Start with letters" },
  { id: "muallaf", route: "muallaf", icon: "01", pl: "Jestem nowym muzułmaninem", en: "I am a new Muslim" },
  { id: "prayer", route: "prayerGuide", icon: "5x", pl: "Chcę nauczyć się modlitwy", en: "Learn prayer" },
  { id: "quran", route: "koran", icon: "Q", pl: "Chcę czytać Quran", en: "Read Quran" },
  { id: "basics", route: "islam", icon: "?", pl: "Chcę podstaw islamu", en: "Learn Islam basics" }
];

const ONBOARDING_LEVELS = [
  { id: "beginner", pl: "Zaczynam od zera", en: "Starting from zero" },
  { id: "some", pl: "Coś już umiem", en: "I know a little" },
  { id: "returning", pl: "Wracam do nauki", en: "Returning to practice" }
];

const ONBOARDING_PRAYER_FOCUS = [
  { id: "yes", pl: "Tak, modlitwa jest priorytetem", en: "Yes, prayer is a priority" },
  { id: "later", pl: "Później, najpierw podstawy", en: "Later, basics first" }
];

function onboardingPanel() {
  if (state.onboardingComplete) return "";
  return `
    <section class="onboarding-panel panel p-5 sm:p-6 mb-4">
      <div>
        <p class="text-xs font-black uppercase tracking-wide text-emerald-600">${tx("Spokojny start", "Calm start")}</p>
        <h2 class="mt-1 text-2xl font-black">${tx("Ustaw pierwszą ścieżkę w 3 krokach", "Set your first path in 3 steps")}</h2>
        <p class="mt-2 text-sm text-[var(--muted)]">${tx("Wybierz cel, poziom i priorytet modlitwy. Centrum nauki dopasuje kolejny krok.", "Choose a goal, level, and prayer priority. The learning center will shape the next step.")}</p>
      </div>
      <p class="mt-4 text-xs font-black uppercase tracking-wide text-[var(--muted)]">${tx("1. Cel", "1. Goal")}</p>
      <div class="onboarding-grid mt-4">
        ${ONBOARDING_GOALS.map(goal => `
          <button class="onboarding-choice soft-panel" data-onboarding-goal="${goal.id}" data-route="${goal.route}">
            <span>${goal.icon}</span>
            <strong>${state.lang === "pl" ? goal.pl : goal.en}</strong>
          </button>
        `).join("")}
      </div>
      <p class="mt-4 text-xs font-black uppercase tracking-wide text-[var(--muted)]">${tx("2. Poziom", "2. Level")}</p>
      <div class="onboarding-segments mt-2">
        ${ONBOARDING_LEVELS.map(level => `<button class="${state.onboardingLevel === level.id ? "active" : ""}" data-onboarding-level="${level.id}">${state.lang === "pl" ? level.pl : level.en}</button>`).join("")}
      </div>
      <p class="mt-4 text-xs font-black uppercase tracking-wide text-[var(--muted)]">${tx("3. Modlitwa", "3. Prayer")}</p>
      <div class="onboarding-segments mt-2">
        ${ONBOARDING_PRAYER_FOCUS.map(item => `<button class="${state.onboardingPrayerFocus === item.id ? "active" : ""}" data-onboarding-prayer="${item.id}">${state.lang === "pl" ? item.pl : item.en}</button>`).join("")}
      </div>
      <button class="mt-3 text-xs font-black text-[var(--muted)]" data-onboarding-skip>${tx("Pomiń na razie", "Skip for now")}</button>
    </section>
  `;
}

function renderOnboardingFullScreen() {
  view.innerHTML = `
    <section class="min-h-[68vh] grid place-items-center py-8">
      <div class="w-full max-w-[480px] text-center">
        <p class="text-xs font-black uppercase tracking-wide text-emerald-600">${tx("Spokojny start", "Calm start")}</p>
        <h1 class="mt-2 text-3xl font-black">${tx("Wybierz pierwsza sciezke", "Choose your first path")}</h1>
        <p class="mt-3 text-sm text-[var(--muted)]">${tx("Alif AI dopasuje pierwszy ekran do tego, czego chcesz nauczyc sie najpierw.", "Alif AI will open the first path around what you want to learn first.")}</p>
        <div class="mt-6 grid gap-3 text-left">
          ${ONBOARDING_GOALS.map(goal => `
            <button class="onboarding-choice soft-panel min-h-16 w-full" data-onboarding-goal="${goal.id}" data-route="${goal.route}">
              <span>${goal.icon}</span>
              <strong>${state.lang === "pl" ? goal.pl : goal.en}</strong>
            </button>
          `).join("")}
        </div>
        <button class="mt-5 text-sm font-black text-[var(--muted)]" data-onboarding-skip>${tx("Pomin ->", "Skip ->")}</button>
      </div>
    </section>
  `;
  view.querySelectorAll("[data-onboarding-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      state.learningGoal = button.dataset.onboardingGoal;
      state.onboardingComplete = true;
      saveState();
      setRoute(button.dataset.route);
    });
  });
  view.querySelector("[data-onboarding-skip]")?.addEventListener("click", () => {
    state.onboardingComplete = true;
    saveState();
    home();
  });
}

function home() {
  if (!state.onboardingComplete) {
    renderOnboardingFullScreen();
    return;
  }
  const tasks = activeDailyTasks();
  const task = tasks[new Date().getDate() % tasks.length];
  let taskRoute = "lessons";
  if (/liter|letter|alfabet/i.test(task)) taskRoute = "alphabet";
  else if (/fisz|flash/i.test(task)) taskRoute = "flashcards";
  else if (/wymow|speech|pronunc/i.test(task)) taskRoute = "speech";
  else if (/narys|trace|write/i.test(task)) taskRoute = "writing";
  else if (/memory|zagraj|play|quiz|game/i.test(task)) taskRoute = "games";
  else if (/dhikr/i.test(task)) taskRoute = "dhikr";

  const badgeTotal = BADGES_CATALOG.length || 1;
  const badgeProgress = Math.round((state.badges.length / badgeTotal) * 100);

  const learnedSurahs = (state.quranSurahFavorites || []).length;
  const favAyahs = (state.quranFavorites || []).length;
  const favDua = (state.quranDuaFavorites || []).length;
  const favoriteGroups = homeFavoriteGroups();
  const lp = levelProgress();

  view.innerHTML = `
    ${onboardingPanel()}
    <div class="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
      <section class="panel min-w-0 p-5 sm:p-7">
        <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="font-bold text-emerald-600">${t("welcome")}</p>
            <h1 class="mt-2 text-3xl font-black sm:text-4xl">${t("homeTitle")} ☪️</h1>
            <p class="mt-3 max-w-2xl text-sm text-[var(--muted)]">${t("homeLead")}</p>
          </div>
          <div class="grid h-28 w-28 shrink-0 place-items-center rounded-lg bg-emerald-500 text-5xl text-white shadow-sm">☪</div>
        </div>
        <div class="home-stat-grid mt-7">
          ${statCard(t("streak"), `${state.streak} ${tx("dni", "days")}`, tx("Codzienna obecnosc", "Daily presence"))}
          ${statCard(t("level"), `${level()}`, `${state.points} ${t("points")}`, "level")}
          ${statCard(t("alphabetProgress"), `${progressPercent()}%`, `${state.learnedLetters.length}/28`)}
          ${statCard(tx("Poznane sury", "Learned surahs"), `${learnedSurahs}`, tx("Ulubione / monitorowane", "Favorited / tracked"))}
          ${statCard(tx("Ulubione ayaty", "Favorite ayahs"), `${favAyahs}`, tx("Do szybkich powtórek", "For quick revision"))}
          ${statCard(tx("Ulubione dua", "Favorite duas"), `${favDua}`, tx("Najczęściej czytane", "Most revisited"))}
        </div>
        <div id="levelDetails" class="level-details panel mt-4 p-4 hidden">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h2 class="text-lg font-black">${tx(`Poziom ${lp.currentLevel}`, `Level ${lp.currentLevel}`)}</h2>
              <p class="text-sm text-[var(--muted)]">${tx(`${lp.remaining} pkt do kolejnego poziomu`, `${lp.remaining} points to next level`)}</p>
            </div>
            <span class="text-sm font-black text-emerald-600">${lp.percent}%</span>
          </div>
          <div class="mt-3 h-2 overflow-hidden rounded-full bg-[var(--line)]">
            <div class="h-full bg-emerald-500" style="width:${lp.percent}%"></div>
          </div>
          <div class="mt-4 grid gap-2 sm:grid-cols-2">
            ${levelActivityList().map(item => `
              <button class="level-activity text-left" data-route="${item.route}">
                <strong>${item.title}</strong>
                <small>${item.points}</small>
              </button>
            `).join("")}
          </div>
        </div>
        <div class="home-favorites mt-5">
          ${homeFavoritesCarousel(tx("Ulubione sury", "Favorite surahs"), favoriteGroups.surahs, tx("Dodaj ulubione sury w Quran.", "Add favorite surahs in Quran."), "koran", "surahs")}
          ${homeFavoritesCarousel(tx("Ulubione dua", "Favorite duas"), favoriteGroups.duas, tx("Dodaj ulubione dua w Quran.", "Add favorite duas in Quran."), "koran", "dua")}
          ${homeFavoritesCarousel(tx("Ulubione wersety", "Favorite ayahs"), favoriteGroups.ayahs, tx("Dodaj ulubione wersety podczas czytania sur.", "Add favorite ayahs while reading surahs."), "koran", "favayahs")}
        </div>
      </section>
      <aside class="grid min-w-0 gap-4">
        <div class="soft-panel p-5">
          <h2 class="text-xl font-black">${t("todayTask")}</h2>
          <p class="mt-2 text-[var(--muted)]">${task}</p>
          <button class="big-action mt-4 w-full bg-emerald-500 text-white" data-route="${taskRoute}">${t("start")}</button>
        </div>
        ${nextStepCard()}
        ${hijriWidget()}
        <div id="ayatOfDay" class="panel p-5">
           <h2 class="text-xl font-black mb-3">✨ ${tx("Ayat Dnia", "Ayat of the Day")}</h2>
           <div class="skeleton h-20 w-full mb-2"></div>
        </div>
        ${hadithOfDayWidget()}
        <button class="panel p-4 text-left w-full flex items-center justify-between gap-3 active:scale-95 transition-transform" data-route="badges">
          <div>
            <h2 class="text-base font-black">${tx("Odznaki", "Badges")}</h2>
            <p class="text-xs text-[var(--muted)] mt-0.5">${tx("Twoje osiągnięcia i cele", "Your achievements and goals")}</p>
            <div class="mt-3 h-2 overflow-hidden rounded-full bg-amber-100">
              <div class="h-full bg-amber-400 transition-all" style="width:${badgeProgress}%"></div>
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <div class="flex gap-0.5">
              ${BADGES_CATALOG.slice(0, 6).map(b => `<span class="text-lg ${state.badges.includes(b.id) ? "" : "grayscale opacity-25"}">${b.icon}</span>`).join("")}
            </div>
            <span class="text-sm font-black text-amber-500">${state.badges.length}/${BADGES_CATALOG.length}</span>
          </div>
        </button>
      </aside>
    </div>
  `;

  scheduleAyatOfDay();
  view.querySelectorAll("[data-onboarding-level]").forEach((button) => {
    button.addEventListener("click", () => {
      state.onboardingLevel = button.dataset.onboardingLevel;
      saveState();
      render();
    });
  });
  view.querySelectorAll("[data-onboarding-prayer]").forEach((button) => {
    button.addEventListener("click", () => {
      state.onboardingPrayerFocus = button.dataset.onboardingPrayer;
      saveState();
      render();
    });
  });
  view.querySelectorAll("[data-onboarding-goal]").forEach((button) => {
    button.addEventListener("click", () => {
      state.learningGoal = button.dataset.onboardingGoal;
      state.onboardingComplete = true;
      saveState();
      setRoute(button.dataset.route);
    });
  });
  view.querySelector("[data-onboarding-skip]")?.addEventListener("click", () => {
    state.onboardingComplete = true;
    saveState();
    render();
  });
  view.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.quranTab) state.quranTab = button.dataset.quranTab;
      if (button.dataset.route === "ai") openAiChat();
      else setRoute(button.dataset.route);
    });
  });
  view.querySelectorAll("[data-open-badge-lesson]").forEach((button) => {
    button.addEventListener("click", () => openMiniLesson(button.dataset.openBadgeLesson));
  });
  view.querySelectorAll("[data-home-fav]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.quranTab) state.quranTab = button.dataset.quranTab;
      setRoute(button.dataset.homeFav);
      const num = Number(button.dataset.homeSurah || 0);
      if (num) setTimeout(() => openSurah(num, { focusReader: true }), 150);
    });
  });
}

function scheduleAyatOfDay() {
  const run = () => loadAyatOfDay();
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(run, { timeout: 2000 });
    return;
  }
  setTimeout(run, 800);
}

async function loadAyatOfDay() {
  const container = $("#ayatOfDay");
  const todayDate = today();

  function renderAyatCache(c) {
    const translation = state.lang === "pl" ? c.pl : c.en;
    container.innerHTML = `
      <h2 class="text-xl font-black mb-3">✨ ${tx("Ayat Dnia", "Ayat of the Day")}</h2>
      <p class="arabic text-right text-lg mb-2">${escapeHtml(c.ar)}</p>
      <p class="text-sm text-[var(--muted)] mb-2 italic">${escapeHtml(translation)}</p>
      <p class="text-xs text-[var(--muted)]">Sura ${c.surah}, Ayat ${c.numberInSurah}</p>
    `;
  }

  if (state.ayatCache?.date === todayDate || isFreshCache(state.ayatCache)) {
    renderAyatCache(state.ayatCache);
    if (state.ayatCache?.date === todayDate) return;
  }

  try {
    const randomAyah = Math.floor(Math.random() * 6236) + 1;
    const [resAr, resPl, resEn] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/ayah/${randomAyah}`),
      fetch(`https://api.alquran.cloud/v1/ayah/${randomAyah}/pl.bielawskiego`),
      fetch(`https://api.alquran.cloud/v1/ayah/${randomAyah}/en.asad`)
    ]);
    const [dataAr, dataPl, dataEn] = await Promise.all([resAr.json(), resPl.json(), resEn.json()]);
    if (dataPl.code === 200) {
      const cache = {
        date: todayDate,
        cachedAt: new Date().toISOString(),
        ar: dataAr.data.text,
        pl: dataPl.data.text,
        en: dataEn.code === 200 ? dataEn.data.text : dataPl.data.text,
        surah: dataPl.data.surah.number,
        numberInSurah: dataPl.data.numberInSurah
      };
      state.ayatCache = cache;
      saveState();
      renderAyatCache(cache);
    }
  } catch {
    if (isFreshCache(state.ayatCache)) {
      renderAyatCache(state.ayatCache);
      return;
    }
    container.innerHTML = `<p class="text-xs text-[var(--muted)]">${tx("Nie udało się pobrać wersetu.", "Could not load ayah.")}</p>`;
  }
}

function levelActivityList() {
  return [
    { title: tx("Ukończ lekcję", "Complete a lesson"), points: "+18 pkt", route: "lessons" },
    { title: tx("Quiz liter", "Letter quiz"), points: "+10 pkt", route: "games" },
    { title: tx("Quiz sur", "Surah quiz"), points: "+20 pkt", route: "games" },
    { title: tx("Prayer Mode", "Prayer Mode"), points: "+35 pkt", route: "prayerGuide" }
  ];
}

function statCard(title, value, hint, action = "") {
  const attrs = action ? `button type="button" data-stat-action="${action}"` : "div";
  const close = action ? "button" : "div";
  return `<${attrs} class="home-stat-card soft-panel ${action ? "is-clickable" : ""}"><p>${title}</p><strong>${value}</strong><small>${hint}</small></${close}>`;
}

const DUA_DATA = [
  {
    id: "bismillah", category: tx("Jedzenie", "Food"),
    ar: "بِسْمِ اللَّهِ", tr: "Bismillāh",
    pl: "Przed jedzeniem i piciem", en: "Before eating or drinking"
  },
  {
    id: "after_eating", category: tx("Jedzenie", "Food"),
    ar: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ",
    tr: "Alḥamdu lillāhi l-ladhī aṭ'amanā wa-saqānā wa-ja'alanā muslimīn",
    pl: "Po jedzeniu — Chwała Bogu, który nas nakarmił, napoił i uczynił muzułmanami", en: "After eating"
  },
  {
    id: "leaving_home", category: tx("Dom", "Home"),
    ar: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    tr: "Bismillāh, tawakkaltu 'alā Allāh, wa-lā ḥawla wa-lā quwwata illā billāh",
    pl: "Wychodząc z domu — W imię Boga, polegam na Bogu, nie ma mocy ani siły oprócz Boga", en: "When leaving home"
  },
  {
    id: "entering_home", category: tx("Dom", "Home"),
    ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلِجِ وَخَيْرَ الْمَخْرَجِ، بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا",
    tr: "Allāhumma innī as'aluka khayra l-mawlaji wa-khayra l-makhraji, bismillāhi walajna wa-bismillāhi kharajnā wa-'alā Allāhi rabbanā tawakkalnā",
    pl: "Wchodząc do domu", en: "When entering home"
  },
  {
    id: "morning", category: tx("Dzień", "Day"),
    ar: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    tr: "Aṣbaḥnā wa-aṣbaḥa l-mulku lillāh, wa-l-ḥamdu lillāh, lā ilāha illā Allāhu waḥdahu lā sharīka lah",
    pl: "Dua poranna — Nastał ranek i królestwo należy do Boga", en: "Morning dhikr"
  },
  {
    id: "evening", category: tx("Dzień", "Day"),
    ar: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    tr: "Amsaynā wa-amsa l-mulku lillāh, wa-l-ḥamdu lillāh, lā ilāha illā Allāhu waḥdahu lā sharīka lah",
    pl: "Dua wieczorna — Nastał wieczór i królestwo należy do Boga", en: "Evening dhikr"
  },
  {
    id: "sleeping", category: tx("Sen", "Sleep"),
    ar: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    tr: "Bismika Allāhumma amūtu wa-aḥyā",
    pl: "Przed snem — W Twe imię, o Boże, umieram i żyję", en: "Before sleeping"
  },
  {
    id: "waking", category: tx("Sen", "Sleep"),
    ar: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    tr: "Alḥamdu lillāhi l-ladhī aḥyānā ba'da mā amātanā wa-ilayhi n-nushūr",
    pl: "Po przebudzeniu — Chwała Bogu, który nas ożywił po uśpieniu i do Niego jest zmartwychwstanie", en: "Upon waking"
  },
  {
    id: "travel", category: tx("Podróż", "Travel"),
    ar: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    tr: "Subḥāna l-ladhī sakhkhara lanā hādhā wa-mā kunnā lahu muqrinīn, wa-innā ilā rabbinā la-munqalibūn",
    pl: "Dua w podróży — Chwała Temu, który podporządkował nam to i do naszego Pana powrócimy", en: "Travel dua (Quran 43:13-14)"
  },
  {
    id: "forgiveness", category: tx("Istighfar", "Forgiveness"),
    ar: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    tr: "Astaghfiru Allāha l-'aẓīma l-ladhī lā ilāha illā huwa l-ḥayyu l-qayyūmu wa-atūbu ilayh",
    pl: "Sejmul istighfar — najlepsza prośba o przebaczenie", en: "Sayyid al-Istighfar — master supplication for forgiveness"
  },
  {
    id: "anxiety", category: tx("Smetek i troska", "Hardship"),
    ar: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
    tr: "Allāhumma innī a'ūdhu bika mina l-hammi wa-l-ḥazan, wa-l-'ajzi wa-l-kasal, wa-l-bukhli wa-l-jubn, wa-ḍala'i d-dayni wa-ghalabati r-rijāl",
    pl: "Dua przy smutku, trosce i trudnościach — szukanie schronienia u Boga", en: "Dua for anxiety, grief and hardship"
  },
  {
    id: "parents", category: tx("Rodzina", "Family"),
    ar: "رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    tr: "Rabbi rḥamhumā kamā rabbayānī ṣaghīrā",
    pl: "Dua za rodziców — Panie, okaż im miłosierdzie, jak oni mnie wychowali w dzieciństwie (Koran 17:24)", en: "Dua for parents (Quran 17:24)"
  },
  {
    id: "knowledge", category: tx("Wiedza", "Knowledge"),
    ar: "رَّبِّ زِدْنِي عِلْمًا",
    tr: "Rabbi zidnī 'ilmā",
    pl: "Panie, pomnóż moją wiedzę (Koran 20:114)", en: "O Lord, increase me in knowledge (Quran 20:114)"
  },
  {
    id: "good_end", category: tx("Codzienne", "Daily"),
    ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    tr: "Rabbanā ātinā fi d-dunyā ḥasanatan wa-fi l-ākhirati ḥasanatan wa-qinā 'adhāba n-nār",
    pl: "Panie, daj nam dobro na tym świecie i dobro w życiu wiecznym, i ochroń nas od kary ognia (Koran 2:201)", en: "Our Lord, give us good in this world and good in the hereafter (Quran 2:201)"
  },
  {
    id: "heart", category: tx("Serce", "Heart"),
    ar: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً",
    tr: "Rabbanā lā tuzigh qulūbanā ba'da idh hadaytanā wa-hab lanā min ladunka raḥmah",
    pl: "Panie, nie odwracaj naszych serc po tym, jak nas prowadziłeś, i obdarz nas miłosierdziem (Koran 3:8)", en: "Our Lord, do not let our hearts deviate after You have guided us (Quran 3:8)"
  },
];

function duaQuality(dua) {
  return {
    source: DUA_SOURCE_MAP[dua.id] || "",
    verified: Boolean(DUA_SOURCE_MAP[dua.id]),
    source_type: "dua_collection",
    source_ref: DUA_SOURCE_MAP[dua.id] || "",
    confidence: DUA_SOURCE_MAP[dua.id] ? CONTENT_TRUST.VERIFIED : CONTENT_TRUST.UNVERIFIED,
    reviewed_at: CONTENT_LAST_CHECKED_AT,
    last_checked_at: CONTENT_LAST_CHECKED_AT
  };
}

function parseHadithCollection(source = "") {
  const collection = String(source).split(/\s+/)[0] || "";
  return collection.replace(/[^A-Za-z]/g, "") || "Hadith";
}

function hadithQuality(hadith) {
  return {
    source: hadith.source || "",
    grade: hadith.grade || "ungraded",
    verified: Boolean(hadith.source),
    source_type: "hadith_collection",
    source_ref: hadith.source || "",
    collection: parseHadithCollection(hadith.source),
    confidence: hadith.source ? CONTENT_TRUST.VERIFIED : CONTENT_TRUST.UNVERIFIED,
    reviewed_at: CONTENT_LAST_CHECKED_AT,
    last_checked_at: CONTENT_LAST_CHECKED_AT
  };
}

function surahCard(surah) {
  const isFav = (state.quranSurahFavorites || []).includes(surah.number);
  const extra = SURAH_EXTRA[surah.number];
  const revIcon = surah.revelationType === "Meccan" ? "🕋" : "🕌";
  return `
    <article class="panel p-3 flex flex-col gap-1.5 relative">
      <div class="flex items-start justify-between">
        <span class="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-black text-emerald-700">${surah.number}</span>
        <button class="text-base leading-none ${isFav ? "" : "opacity-30"} transition-opacity" data-fav-surah="${surah.number}">❤️</button>
      </div>
      <button class="arabic text-xl leading-snug text-right block w-full" data-say-ar="${escapeHtml(surah.arName)}">${escapeHtml(surah.arName)}</button>
      <p class="text-xs font-black leading-none">${escapeHtml(surah.enName)}</p>
      <p class="text-[11px] text-[var(--muted)] leading-none">${escapeHtml(surah.meaning)}</p>
      <div class="flex flex-wrap gap-1 mt-0.5">
        <span class="surah-badge" style="background:var(--bg)">${surah.numberOfAyahs} ${tx("w.", "ay.")}</span>
        <span class="surah-badge" style="background:var(--bg)">${revIcon}</span>
        ${extra ? `<span class="surah-badge surah-badge--islamic">${state.lang === "pl" ? extra.badge_pl : extra.badge_en}</span>` : ""}
      </div>
      ${extra ? `<p class="text-[10px] text-[var(--muted)] italic leading-tight">${state.lang === "pl" ? extra.tip_pl : extra.tip_en}</p>` : ""}
      <button class="big-action w-full text-sm border border-[var(--line)] mt-0.5" data-read-surah="${surah.number}">▶ ${tx("Czytaj", "Read")}</button>
    </article>
  `;
}

function renderSurahFilterDropdown(activeFilter) {
  const options = [
    { key: "all",      labelPl: "Wszystkie",    labelEn: "All"          },
    { key: "essential",labelPl: "Esencjalne ⭐", labelEn: "Essential ⭐"  },
    { key: "meccan",   labelPl: "Mekka 🕋",     labelEn: "Meccan 🕋"    },
    { key: "medinan",  labelPl: "Medyna 🕌",    labelEn: "Medinan 🕌"   },
    { key: "favfirst", labelPl: "Ulubione ❤️",  labelEn: "Favorites ❤️" },
    ...SURAH_LENGTH_GROUPS.map(g => ({ key: g.key, labelPl: g.labelPl, labelEn: g.labelEn })),
    { key: "alpha",    labelPl: "A→Z",           labelEn: "A→Z"          },
  ];
  return `<select id="surahFilterSelect" class="h-10 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm">
    ${options.map(o => `<option value="${o.key}" ${activeFilter === o.key ? "selected" : ""}>${state.lang === "pl" ? o.labelPl : o.labelEn}</option>`).join("")}
  </select>`;
}

function bindSurahListEvents() {
  const listEl = $("#surahList");
  if (!listEl) return;
  listEl.querySelectorAll("[data-say-ar]").forEach(btn => btn.addEventListener("click", e => {
    e.stopPropagation();
    speakArabic(btn.dataset.sayAr);
  }));
  listEl.querySelectorAll("[data-fav-surah]").forEach(btn => btn.addEventListener("click", () => {
    const num = Number(btn.dataset.favSurah);
    if (!state.quranSurahFavorites) state.quranSurahFavorites = [];
    const idx = state.quranSurahFavorites.indexOf(num);
    if (idx === -1) { state.quranSurahFavorites.push(num); showToast(tx("Dodano do ulubionych", "Added to favorites")); }
    else state.quranSurahFavorites.splice(idx, 1);
    saveState();
    renderSurahList();
  }));
  listEl.querySelectorAll("[data-read-surah]").forEach(btn => btn.addEventListener("click", () => openSurah(Number(btn.dataset.readSurah))));
}

function renderSurahList() {
  if (!state.quranSurahFavorites) state.quranSurahFavorites = [];
  const filter = state.surahFilter || "all";
  const searchVal = (state.surahSearchQuery || "").toLowerCase().trim();
  const favNums = state.quranSurahFavorites;
  let surahs = [...SURAH_LIST];
  const listEl = $("#surahList");
  if (!listEl) return;

  // Search overrides grouping — show flat results
  if (searchVal) {
    surahs = surahs.filter(s =>
      s.enName.toLowerCase().includes(searchVal) ||
      s.meaning.toLowerCase().includes(searchVal) ||
      String(s.number).includes(searchVal) ||
      s.arName.includes(searchVal)
    );
    listEl.innerHTML = surahs.length
      ? surahs.map(surahCard).join("")
      : `<div class="soft-panel col-span-full p-6 text-center text-[var(--muted)]">${tx("Brak wyników. Zmień wyszukiwanie.", "No results. Try a different search.")}</div>`;
    bindSurahListEvents();
    return;
  }

  // Apply chip filter
  if      (filter === "essential") surahs = surahs.filter(s => ESSENTIAL_SURAHS.includes(s.number));
  else if (filter === "meccan")    surahs = surahs.filter(s => s.revelationType === "Meccan");
  else if (filter === "medinan")   surahs = surahs.filter(s => s.revelationType === "Medinan");
  else if (filter === "favfirst")  surahs = surahs.sort((a, b) => (favNums.includes(a.number) ? 0 : 1) - (favNums.includes(b.number) ? 0 : 1) || a.number - b.number);
  else if (filter === "alpha")     surahs = surahs.sort((a, b) => a.enName.localeCompare(b.enName));
  else {
    const grp = SURAH_LENGTH_GROUPS.find(g => g.key === filter);
    if (grp) surahs = surahs.filter(s => s.numberOfAyahs >= grp.min && s.numberOfAyahs <= grp.max);
  }

  if (filter === "all") {
    // Grouped display by length category
    let html = "";
    for (const grp of SURAH_LENGTH_GROUPS) {
      const grpSurahs = surahs.filter(s => s.numberOfAyahs >= grp.min && s.numberOfAyahs <= grp.max);
      if (!grpSurahs.length) continue;
      html += `<div class="col-span-full">
        <div class="surah-group-header">${state.lang === "pl" ? grp.labelPl : grp.labelEn} <span style="font-weight:400;opacity:0.6">(${grpSurahs.length})</span></div>
        <div class="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">${grpSurahs.map(surahCard).join("")}</div>
      </div>`;
    }
    listEl.innerHTML = html;
  } else {
    listEl.innerHTML = surahs.length
      ? surahs.map(surahCard).join("")
      : `<div class="soft-panel col-span-full p-6 text-center text-[var(--muted)]">${tx("Brak wyników. Zmień filtr.", "No results. Change the filter.")}</div>`;
  }
  bindSurahListEvents();
}

function hifzStateLabel(status) {
  if (status === "memorized") return tx("Zapamietana", "Memorized");
  if (status === "in-progress") return tx("W trakcie", "In progress");
  return tx("Nie zaczeta", "Not started");
}

function hifzNextStatus(current) {
  const index = Math.max(0, HIFZ_STATES.indexOf(current));
  return HIFZ_STATES[(index + 1) % HIFZ_STATES.length];
}

function renderHifzTab() {
  const memorized = HIFZ_SURAHS.filter(num => state.hifzProgress?.[num] === "memorized").length;
  return `
    <div class="panel p-4 mb-4">
      <h2 class="text-xl font-black">${tx("Tryb nauki krotkich sur", "Short Surah Learning")}</h2>
      <p class="text-sm text-[var(--muted)] mt-1">${tx("Najpierw Al-Fatiha, potem Al-Ikhlas, Al-Falaq i An-Nas. Odhaczaj postep bez presji.", "Start with Al-Fatiha, then Al-Ikhlas, Al-Falaq and An-Nas. Track progress without pressure.")}</p>
      <p class="mt-3 text-sm font-black text-emerald-600">${memorized}/${HIFZ_SURAHS.length} ${tx("zapamietane", "memorized")}</p>
    </div>
    <div class="grid gap-3 sm:grid-cols-2">
      ${HIFZ_SURAHS.map(num => {
        const surah = SURAH_LIST.find(s => s.number === num);
        const status = state.hifzProgress?.[num] || "not-started";
        return `
          <article class="hifz-surah ${status} panel p-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-xs font-black text-[var(--muted)]">${tx("Sura", "Surah")} ${num}</p>
                <h3 class="text-lg font-black">${escapeHtml(surah?.enName || String(num))}</h3>
                <p class="text-sm text-[var(--muted)]">${escapeHtml(surah?.meaning || "")} · ${surah?.numberOfAyahs || "?"} ${tx("wersetow", "ayahs")}</p>
              </div>
              <span class="trust-badge ${status === "memorized" ? "verified" : status === "in-progress" ? "context-dependent" : "unverified"}">${hifzStateLabel(status)}</span>
            </div>
            <div class="mt-4 grid gap-2 sm:grid-cols-2">
              <button class="big-action border border-[var(--line)]" data-read-surah="${num}">${tx("Czytaj", "Read")}</button>
              <button class="big-action bg-emerald-500 text-white" data-hifz-toggle="${num}">${tx("Zmien status", "Change status")}</button>
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function koran() {
  const activeTab = state.quranTab || "surahs";
  const favCount = (state.quranSurahFavorites || []).length;
  view.innerHTML = `
    <div class="sticky top-0 z-10 bg-[var(--bg)]">
      <h1 class="text-2xl font-black px-4 pt-4">${t("koranTitle")}</h1>
      <div class="flex border-b border-[var(--line)] mt-3 px-2 gap-0 overflow-x-auto">
        <button class="px-4 py-2.5 text-sm font-black border-b-2 shrink-0 ${activeTab === "surahs" ? "border-emerald-500 text-emerald-600" : "border-transparent text-[var(--muted)]"}" data-tab="surahs">${tx("Sury", "Surahs")}</button>
        <button class="px-4 py-2.5 text-sm font-black border-b-2 shrink-0 ${activeTab === "hifz" ? "border-emerald-500 text-emerald-600" : "border-transparent text-[var(--muted)]"}" data-tab="hifz">${tx("Nauka sur", "Surah learning")}</button>
        <button class="px-4 py-2.5 text-sm font-black border-b-2 shrink-0 ${activeTab === "dua" ? "border-emerald-500 text-emerald-600" : "border-transparent text-[var(--muted)]"}" data-tab="dua">${tx("Dua", "Dua")}</button>
        <button class="px-4 py-2.5 text-sm font-black border-b-2 shrink-0 ${activeTab === "favayahs" ? "border-emerald-500 text-emerald-600" : "border-transparent text-[var(--muted)]"}" data-tab="favayahs">${tx("Ulubione", "Favorites")} ${favCount > 0 ? `<span class="ml-1 rounded-full bg-emerald-100 text-emerald-700 text-xs px-1.5">${favCount}</span>` : ""}</button>
      </div>
    </div>

    <div class="p-4 pb-28">
      <!-- SURAHS TAB -->
      <div id="tabSurahs" class="${activeTab !== "surahs" ? "hidden" : ""}">
        <div class="mb-3">
          <input id="surahSearch" type="search" class="h-10 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm mb-2" placeholder="${tx("Szukaj sury...", "Search surah...")}" value="${escapeHtml(state.surahSearchQuery || "")}">
          ${renderSurahFilterDropdown(state.surahFilter || "all")}
          <div class="mt-2 flex items-center justify-end gap-2">
            <span class="text-xs text-[var(--muted)] font-black">${tx("Recytator:", "Reciter:")}</span>
            <select id="reciterSelect" class="h-9 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-xs">
              ${QURAN_RECITERS.map(r => `<option value="${r.id}" ${state.quranReciter === r.id ? "selected" : ""}>${r.name}</option>`).join("")}
            </select>
          </div>
        </div>
        <div id="surahList" class="grid gap-2 sm:grid-cols-3 lg:grid-cols-4"></div>
        <div id="surahContent" class="mt-6"></div>
      </div>

      <div id="tabHifz" class="${activeTab !== "hifz" ? "hidden" : ""}">
        ${renderHifzTab()}
      </div>

      <!-- DUA TAB -->
      <div id="tabDua" class="${activeTab !== "dua" ? "hidden" : ""}">
        <p class="text-sm text-[var(--muted)] mb-4">${tx("Codzienne modlitwy i suplikacje — naucz się ich na pamięć.", "Daily supplications — memorize them.")}</p>
        ${(() => {
          const categories = [...new Set(DUA_DATA.map(d => d.category))];
          return categories.map(cat => `
            <div class="mb-4">
              <h3 class="font-black text-sm text-emerald-600 mb-2 uppercase tracking-wide">${cat}</h3>
              <div class="grid gap-3">
                ${DUA_DATA.filter(d => d.category === cat).map(dua => `
                  <div class="panel p-4">
                    <p class="text-sm font-black mb-2">${state.lang === "pl" ? dua.pl : dua.en}</p>
                    <p class="arabic text-right text-xl leading-loose mb-1">${escapeHtml(dua.ar)}</p>
                    <p class="text-xs text-amber-600 font-mono mb-3" dir="ltr">${escapeHtml(dua.tr)}</p>
                    <p class="faq-ref">Source: ${escapeHtml(duaQuality(dua).source || tx("Brak zweryfikowanego zrodla", "No verified source"))}</p>
                    <p class="quality-meta">${duaQuality(dua).source_type} · ${duaQuality(dua).verified ? trustLabel(CONTENT_TRUST.VERIFIED) : trustLabel(CONTENT_TRUST.UNVERIFIED)} · ${tx("Sprawdzone:", "Checked:")} ${duaQuality(dua).reviewed_at}</p>
                    <div class="flex items-center gap-2">
                      <button class="speaker-btn text-sm" data-say-ar="${escapeHtml(dua.ar)}">🔊 ${tx("Odsłuchaj", "Listen")}</button>
                      <button class="speaker-btn text-sm ${state.quranDuaFavorites?.includes(dua.id) ? "" : "opacity-50"}" data-fav-dua="${dua.id}">❤️ ${tx("Ulubione", "Favorite")}</button>
                    </div>
                  </div>
                `).join("")}
              </div>
            </div>
          `).join("");
        })()}
      </div>

      <!-- FAVORITES TAB -->
      <div id="tabFavayahs" class="${activeTab !== "favayahs" ? "hidden" : ""}">
        <h3 class="font-black mb-3">${tx("Ulubione sury", "Favorite surahs")}</h3>
        ${(state.quranSurahFavorites || []).length === 0
          ? `<div class="soft-panel p-8 text-center text-[var(--muted)]">${tx("Brak ulubionych sur. Kliknij ❤️ przy surze.", "No favorites yet. Tap ❤️ on any surah.")}</div>`
          : `<div class="grid gap-3 sm:grid-cols-2">${(state.quranSurahFavorites || []).map(num => {
              const s = SURAH_LIST.find(x => x.number === num);
              if (!s) return "";
              return `<div class="panel p-4 flex items-center gap-3">
                <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">${s.number}</span>
                <div class="flex-1 min-w-0">
                  <p class="font-black">${s.enName}</p>
                  <p class="text-xs text-[var(--muted)]">${s.meaning}</p>
                </div>
                <button class="big-action text-sm border border-[var(--line)] shrink-0" data-read-surah="${s.number}">${tx("Czytaj", "Read")}</button>
              </div>`;
            }).join("")}</div>`
        }
        <h3 class="font-black mb-3 mt-6">${tx("Ulubione wersety", "Favorite ayahs")}</h3>
        ${(state.quranFavorites || []).length === 0
          ? `<div class="soft-panel p-6 text-center text-[var(--muted)]">${tx("Brak ulubionych wersetów. Czytaj sury i klikaj ❤️.", "No favorite ayahs. Read surahs and tap ❤️.")}</div>`
          : `<div class="grid gap-3">${(state.quranFavorites || []).map(entry => {
              const isObj = typeof entry === "object";
              const num = isObj ? entry.num : entry;
              const ar = isObj ? (entry.ar || "") : "";
              const tr = isObj ? (entry.tr || "") : "";
              const trans = isObj ? (entry.trans || "") : "";
              const surahName = isObj ? (entry.surahName || "") : "";
              return `<div class="panel p-4">
                <div class="flex items-start justify-between gap-2 mb-2">
                  <p class="text-xs font-black text-emerald-600">${surahName ? `${surahName} · ` : ""}${tx("werset", "ayah")} ${num}</p>
                  <button class="text-red-400 text-sm font-black shrink-0" data-remove-fav-ayah="${num}">✕</button>
                </div>
                ${ar ? `<p class="arabic text-right text-xl leading-loose mb-1">${escapeHtml(ar)}</p>` : ""}
                ${tr ? `<p class="text-xs text-amber-600 font-mono mb-1" dir="ltr">${escapeHtml(tr)}</p>` : ""}
                ${trans ? `<p class="text-sm text-[var(--muted)] italic" dir="ltr">${escapeHtml(trans)}</p>` : ""}
              </div>`;
            }).join("")}</div>`
        }
      </div>
    </div>
  `;

  view.querySelectorAll("[data-tab]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.quranTab = btn.dataset.tab;
      saveState();
      koran();
    });
  });

  if (activeTab === "surahs") {
    renderSurahList();
    // BOLT OPTIMIZATION: Debounce surah search to prevent CPU churn and lag during typing
    $("#surahSearch").addEventListener("input", debouncedRenderSurahList);
    $("#reciterSelect").addEventListener("change", e => { state.quranReciter = e.target.value; saveState(); });
    $("#surahFilterSelect")?.addEventListener("change", (e) => {
      state.surahFilter = e.target.value;
      saveState();
      renderSurahList();
    });
  }

  if (activeTab === "hifz") {
    view.querySelectorAll("[data-read-surah]").forEach(btn => btn.addEventListener("click", () => {
      state.quranTab = "surahs";
      saveState();
      koran();
      setTimeout(() => openSurah(Number(btn.dataset.readSurah)), 100);
    }));
    view.querySelectorAll("[data-hifz-toggle]").forEach(btn => btn.addEventListener("click", () => {
      const num = Number(btn.dataset.hifzToggle);
      state.hifzProgress = { ...(state.hifzProgress || {}), [num]: hifzNextStatus(state.hifzProgress?.[num] || "not-started") };
      saveState();
      koran();
    }));
  }

  if (activeTab === "dua") {
    view.querySelectorAll("[data-say-ar]").forEach(btn => btn.addEventListener("click", () => speakArabic(btn.dataset.sayAr)));
    view.querySelectorAll("[data-fav-dua]").forEach(btn => btn.addEventListener("click", () => {
      if (!state.quranDuaFavorites) state.quranDuaFavorites = [];
      const id = btn.dataset.favDua;
      const idx = state.quranDuaFavorites.indexOf(id);
      if (idx === -1) state.quranDuaFavorites.push(id);
      else state.quranDuaFavorites.splice(idx, 1);
      saveState();
      koran();
    }));
  }

  if (activeTab === "favayahs") {
    view.querySelectorAll("[data-read-surah]").forEach(btn => btn.addEventListener("click", () => {
      state.quranTab = "surahs";
      saveState();
      koran();
      setTimeout(() => openSurah(Number(btn.dataset.readSurah)), 100);
    }));
    view.querySelectorAll("[data-remove-fav-ayah]").forEach(btn => btn.addEventListener("click", () => {
      const num = btn.dataset.removeFavAyah;
      state.quranFavorites = (state.quranFavorites || []).filter(f => (typeof f === "object" ? f.num : f) !== num);
      saveState();
      koran();
    }));
  }
}


async function openSurah(num, options = {}) {
  const container = $("#surahContent");
  container.innerHTML = `<div class="panel p-8 text-center">${tx("Ładowanie treści...", "Loading content...")}</div>`;
  try {
    const reciter = state.quranReciter || "ar.alafasy";
    const transEdition = state.lang === "pl" ? "pl.bielawskiego" : "en.asad";
    // BOLT OPTIMIZATION: Batch multiple API calls into a single request to reduce latency and server load.
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${num}/editions/${reciter},${transEdition},en.transliteration`);
    const result = await res.json();
    if (result.code === 200 && Array.isArray(result.data)) {
      const [dataAudio, dataTrans, dataTr] = result.data;
      const s = dataAudio;
      const transAyahs = dataTrans?.ayahs || [];
      const trAyahs = dataTr?.ayahs || [];
      const transMap = {};
      const trMap = {};
      transAyahs.forEach(a => { transMap[a.numberInSurah] = a.text; });
      trAyahs.forEach(a => { trMap[a.numberInSurah] = a.text; });

      container.innerHTML = `
        <div class="panel surah-reader p-5 sm:p-8" data-open-surah="${s.number}">
          <div class="mb-6 text-center">
            <h2 class="arabic text-5xl">${escapeHtml(s.name)}</h2>
            <p class="mt-2 font-black">${escapeHtml(s.englishName)} · ${escapeHtml(s.englishNameTranslation)}</p>
            <div class="mt-4 flex justify-center gap-2">
               <button id="playFullSurah" class="big-action bg-emerald-500 text-white">${tx("Odtwórz całość", "Play all")}</button>
            </div>
          </div>
          <div class="grid gap-4">
            ${s.ayahs.map(ayah => `
              <div class="soft-panel p-4 ayah-card" data-ayah-num="${ayah.number}" data-ayah-text="${escapeHtml(ayah.text)}" data-ayah-tr="${escapeHtml(trMap[ayah.numberInSurah] || "")}" data-ayah-trans="${escapeHtml(transMap[ayah.numberInSurah] || "")}">
                <div class="flex items-start justify-between gap-4 mb-2">
                  <span class="text-xs font-black text-emerald-600 mt-1 shrink-0">${ayah.numberInSurah}</span>
                  <p class="arabic text-right text-2xl sm:text-3xl leading-loose">${escapeHtml(ayah.text)}</p>
                </div>
                ${trMap[ayah.numberInSurah] ? `<p class="text-xs text-amber-600 font-mono leading-relaxed mb-1" dir="ltr">${escapeHtml(trMap[ayah.numberInSurah])}</p>` : ""}
                ${transMap[ayah.numberInSurah] ? `<p class="text-sm text-[var(--muted)] italic" dir="ltr">${escapeHtml(transMap[ayah.numberInSurah])}</p>` : ""}
                <p class="faq-ref">Source: Quran ${s.number}:${ayah.numberInSurah} · alquran.cloud (${escapeHtml(reciter)}, ${escapeHtml(transEdition)})</p>
                <p class="quality-meta">${trustLabel(CONTENT_TRUST.VERIFIED)} · ${tx("Sprawdzone:", "Checked:")} ${CONTENT_LAST_CHECKED_AT}</p>
                <div class="mt-3 flex justify-end gap-2">
                  <button class="speaker-btn haptic-feedback" data-play-audio="${ayah.audio}" title="${tx("Odtwórz", "Play")}">▶️</button>
                  <button class="speaker-btn haptic-feedback" data-fav-ayah="${ayah.number}" title="${tx("Ulubiony werset", "Favorite ayah")}">❤️</button>
                  <button class="speaker-btn haptic-feedback" data-copy-ayah="${ayah.number}" data-copy-text="${escapeHtml(ayah.text)}" title="${tx("Kopiuj", "Copy")}">📋</button>
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      `;

      container.querySelectorAll("[data-play-audio]").forEach(btn => btn.addEventListener("click", () => {
        const audio = new Audio(btn.dataset.playAudio);
        audio.play();
        triggerHaptic();
      }));

      container.querySelectorAll("[data-fav-ayah]").forEach(btn => btn.addEventListener("click", () => {
        const ayahNum = String(btn.dataset.favAyah);
        const card = btn.closest(".ayah-card");
        const ar = card?.dataset.ayahText || "";
        const tr = card?.dataset.ayahTr || "";
        const trans = card?.dataset.ayahTrans || "";
        const surahName = s.englishName || "";
        const surahNum = s.number;
        if (!state.quranFavorites.some(f => (typeof f === "object" ? f.num : f) === ayahNum)) {
          state.quranFavorites.push({ num: ayahNum, ar, tr, trans, surahName, surahNum });
        }
        saveState();
        showToast(tx("Dodano werset do ulubionych", "Ayah added to favorites"));
      }));

      container.querySelectorAll("[data-copy-ayah]").forEach(btn => btn.addEventListener("click", () => {
        const text = btn.dataset.copyText;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => showToast(tx("Skopiowano werset", "Ayah copied")));
        }
      }));

      const ayahAudios = s.ayahs.map(a => a.audio);
      let playIndex = 0;
      $("#playFullSurah").addEventListener("click", () => {
        if (!ayahAudios.length) return;
        playIndex = 0;
        const playNext = () => {
          if (playIndex >= ayahAudios.length) return;
          const audio = new Audio(ayahAudios[playIndex++]);
          audio.onended = playNext;
          audio.play();
        };
        playNext();
      });
      const reader = container.querySelector(".surah-reader");
      if (options.focusReader) {
        requestAnimationFrame(() => reader?.scrollIntoView({ behavior: "smooth", block: "start" }));
      } else {
        reader?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  } catch {
    container.innerHTML = `<div class="panel p-8 text-center text-red-500">${tx("Nie udało się pobrać treści sury.", "Failed to fetch surah content.")}</div>`;
  }
}

function badges() {
  const unlocked = state.badges.length;
  const total = BADGES_CATALOG.length;
  state.badgeCategory = state.badgeCategory || "learning";
  const visibleBadges = BADGES_CATALOG.filter(b => badgeCategory(b.id) === state.badgeCategory);
  view.innerHTML = `
    <div class="page-header sticky top-0 z-10 flex items-center gap-3 p-4 bg-[var(--bg)]">
      <h1 class="text-2xl font-black">${tx("Odznaki", "Badges")}</h1>
      <span class="ml-auto text-sm font-black text-amber-500">${unlocked}/${total}</span>
    </div>
    <div class="p-4 pb-28">
      <div class="w-full bg-[var(--line)] rounded-full h-2 mb-6">
        <div class="bg-amber-400 h-2 rounded-full transition-all" style="width:${Math.round(unlocked/total*100)}%"></div>
      </div>
      <div class="badge-category-tabs mb-4">
        ${BADGE_CATEGORIES.map(cat => `<button class="tab-btn ${state.badgeCategory === cat.id ? "active" : ""}" data-badge-category="${cat.id}">${state.lang === "pl" ? cat.pl : cat.en}</button>`).join("")}
      </div>
      <div class="badge-grid">
        ${visibleBadges.map(b => {
          const isUnlocked = state.badges.includes(b.id);
          const label = state.lang === "pl" ? b.pl : b.en;
          const criterion = state.lang === "pl" ? b.criterionPl : b.criterionEn;
          return `<button class="badge-card panel p-4 flex items-center gap-4 ${isUnlocked ? "" : "is-locked"}" data-badge-id="${b.id}">
            <span class="text-4xl shrink-0 ${isUnlocked ? "" : "grayscale"}">${b.icon}</span>
            <div class="min-w-0 flex-1">
              <p class="font-black leading-tight">${label}</p>
              <p class="text-xs text-[var(--muted)] leading-tight mt-0.5">${criterion}</p>
            </div>
            ${isUnlocked ? `<span class="text-emerald-500 text-lg shrink-0">✓</span>` : `<span class="text-[var(--muted)] text-lg shrink-0">🔒</span>`}
          </button>`;
        }).join("")}
      </div>
    </div>
  `;
  view.querySelectorAll("[data-badge-category]").forEach(button => {
    button.addEventListener("click", () => {
      state.badgeCategory = button.dataset.badgeCategory;
      saveState();
      badges();
    });
  });
  view.querySelectorAll("[data-badge-id]").forEach(button => {
    button.addEventListener("click", () => {
      const target = badgeTarget(button.dataset.badgeId);
      if (target.activeGame) state.activeGame = target.activeGame;
      saveState();
      setRoute(target.route);
    });
  });
}

function settings() {
  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${t("settings")}</h1>
      <p class="text-[var(--muted)]">${tx("Jezyk, dane lokalne, import i eksport postepu.", "Language, local data, import and export.")}</p>
    </div>
    <div class="grid gap-4 lg:grid-cols-2">
      <section class="panel p-5">
        <h2 class="text-xl font-black">${t("language")}</h2>
        <div class="mt-4 grid grid-cols-2 gap-2">
          <button class="big-action ${state.lang === "pl" ? "bg-emerald-500 text-white" : "border border-[var(--line)] bg-[var(--surface)]"}" data-lang="pl">${t("polish")}</button>
          <button class="big-action ${state.lang === "en" ? "bg-emerald-500 text-white" : "border border-[var(--line)] bg-[var(--surface)]"}" data-lang="en">${t("english")}</button>
        </div>
      </section>
      <section class="panel p-5">
        <h2 class="text-xl font-black">${tx("Motyw", "Theme")}</h2>
        <p class="mt-2 text-[var(--muted)]">${tx("Wybierz jasny albo ciemny motyw.", "Choose light or dark theme.")}</p>
        <div class="mt-4 grid grid-cols-2 gap-2">
          <button class="big-action ${state.theme === "light" ? "bg-amber-100 text-amber-950 border-amber-300" : "bg-white text-[#1f2937] border border-[var(--line)]"}" data-theme-set="light">☀ Light</button>
          <button class="big-action ${state.theme === "dark" ? "bg-emerald-900 text-white border-emerald-700" : "bg-[#0e2533] text-[#f1fbff] border border-[var(--line)]"}" data-theme-set="dark">☾ Dark</button>
        </div>
      </section>
      <section class="panel p-5">
        <h2 class="text-xl font-black">${tx("Instalacja PWA", "PWA installation")}</h2>
        <p class="mt-2 text-[var(--muted)]">${tx("Dodaj Alif AI do ekranu glownego telefonu.", "Add Alif AI to your phone home screen.")}</p>
        <div class="mt-4">${installButtonHtml("")}</div>
      </section>
      <section class="panel p-5">
        <h2 class="text-xl font-black">${tx("Prywatnosc danych", "Data privacy")}</h2>
        <div class="mt-3 grid gap-2 text-sm text-[var(--muted)]">
          <p>${tx("Postep, dziennik, ustawienia i klucz Groq sa zapisywane lokalnie w tej przegladarce.", "Progress, journal, settings and the Groq key are saved locally in this browser.")}</p>
          <p>${tx("Eksport tworzy plik JSON z Twoimi danymi. Import nadpisuje lokalny stan aplikacji.", "Export creates a JSON file with your data. Import replaces the local app state.")}</p>
          <p>${tx("Gdy korzystasz z AI, tresc rozmowy jest wysylana do uslugi Groq, zeby wygenerowac odpowiedz.", "When you use AI, the conversation content is sent to Groq to generate a reply.")}</p>
        </div>
      </section>
      <section class="panel p-5 lg:col-span-2">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 class="text-xl font-black">${tx("Backup i przenoszenie danych", "Backup and data transfer")}</h2>
            <p class="mt-2 text-[var(--muted)]">${tx("Eksport zapisuje caly lokalny postep do pliku JSON. Import wczytuje backup na tym urzadzeniu.", "Export saves all local progress to a JSON file. Import restores a backup on this device.")}</p>
          </div>
          <span class="trust-badge verified">${CONTENT_VERSION}</span>
        </div>
        <div class="mt-4 grid gap-3 sm:grid-cols-2">
          <div class="soft-panel p-4">
            <h3 class="font-black">${t("exportProgress")}</h3>
            <p class="mt-1 text-sm text-[var(--muted)]">${t("exportHint")}</p>
            <button id="exportStateBtn" class="big-action mt-4 w-full bg-emerald-500 text-white">${t("exportProgress")}</button>
          </div>
          <div class="soft-panel p-4">
            <h3 class="font-black">${t("importProgress")}</h3>
            <p class="mt-1 text-sm text-[var(--muted)]">${t("importHint")}</p>
            <input id="importStateFile" class="mt-4 block w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4" type="file" accept="application/json" />
          </div>
        </div>
      </section>
      <section class="panel p-5">
        <h2 class="text-xl font-black">${tx("Pierwsza sciezka", "First path")}</h2>
        <p class="mt-2 text-[var(--muted)]">${tx("Pokaz ponownie wybor spokojnego startu na stronie glownej.", "Show the calm-start choice again on the home screen.")}</p>
        <button id="restartOnboardingBtn" class="big-action mt-4 w-full border border-[var(--line)] bg-[var(--surface)]">${tx("Pokaz onboarding", "Show onboarding")}</button>
      </section>
      <section class="panel p-5">
        <h2 class="text-xl font-black">${t("dangerZone")}</h2>
        <div class="mt-4 grid gap-2">
          <button id="resetTodayBtn" class="big-action border border-[var(--line)] bg-[var(--surface)]">${t("resetToday")}</button>
          <button id="resetProgressBtn" class="big-action border border-[var(--line)] bg-[var(--surface)]">${tx("Reset progresu nauki", "Reset learning progress")}</button>
          <button id="resetStreakBtn" class="big-action border border-[var(--line)] bg-[var(--surface)]">${t("resetStreak")}</button>
          <button id="clearAllBtn" class="big-action bg-red-600 text-white">${t("clearData")}</button>
        </div>
      </section>
      <section class="panel p-5 lg:col-span-2">
        <h2 class="text-xl font-black">${tx("Historia AI", "AI history")}</h2>
        <div class="mt-3 grid gap-2">
          ${state.aiMessages.slice(-25).reverse().map((message) => `
            <article class="soft-panel p-3">
              <strong>${message.role === "user" ? tx("Ja", "Me") : "Alif AI"}</strong>
              <p class="mt-1 line-clamp-3 text-sm text-[var(--muted)]">${escapeHtml(message.content)}</p>
            </article>
          `).join("") || `<p class="text-[var(--muted)]">${tx("Brak historii AI.", "No AI history yet.")}</p>`}
        </div>
      </section>
    </div>
  `;
  view.querySelectorAll("[data-lang]").forEach((button) => button.addEventListener("click", () => {
    state.lang = button.dataset.lang;
    saveState();
    render();
  }));
  bindInstallButtons();
  view.querySelectorAll("[data-theme-set]").forEach((button) => button.addEventListener("click", () => {
    state.theme = button.dataset.themeSet;
    document.documentElement.dataset.theme = state.theme;
    saveState();
    render();
  }));
  $("#exportStateBtn").addEventListener("click", exportState);
  $("#importStateFile").addEventListener("change", importState);
  $("#restartOnboardingBtn")?.addEventListener("click", () => {
    state.onboardingComplete = false;
    state.onboardingLevel = state.onboardingLevel || "beginner";
    state.onboardingPrayerFocus = state.onboardingPrayerFocus || "yes";
    saveState();
    setRoute("home");
  });

  $("#resetTodayBtn").addEventListener("click", () => {
    state.lastActive = "";
    saveState();
    markActiveDay();
    render();
  });
  $("#resetStreakBtn").addEventListener("click", () => {
    state.streak = 0;
    state.lastActive = "";
    saveState();
    render();
  });
  $("#resetProgressBtn").addEventListener("click", () => {
    state.points = 0;
    state.learnedLetters = [];
    state.speechDone = [];
    state.writingDone = [];
    state.flashcards = {};
    state.customFlashcards = [];
    state.aiFlashcards = [];
    state.aiQuizzes = [];
    state.miniLessonsDone = [];
    state.quizStats = { correct: 0, wrong: 0 };
    state.quizHistory = [];
    state.memoryStats = { correct: 0, wrong: 0 };
    state.writingAttempts = [];
    state.reviewMistakes = {};
    state.recordings = {};
    state.prayerLog = {};
    state.prayerGuideProgress = {};
    state.wuduChecklist = [];
    state.prayerHistory = [];
    state.hifzProgress = {};
    saveState();
    render();
  });
  $("#clearAllBtn").addEventListener("click", () => {
    if (!confirm(state.lang === "pl" ? "Wyczyścić wszystkie dane Alif AI?" : "Clear all Alif AI data?")) return;
    localStorage.removeItem(STORAGE_KEY);
    state = loadState();
    document.documentElement.dataset.theme = state.theme;
    render();
  });
}

function exportState() {
  const backup = {
    app: "Alif AI",
    version: CONTENT_VERSION,
    exportedAt: new Date().toISOString(),
    state
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `alif-ai-backup-${today()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function readImportedState(imported) {
  const candidate = imported?.state && typeof imported.state === "object" ? imported.state : imported;
  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw new Error("Invalid backup");
  }
  if (candidate.lang && !["pl", "en"].includes(candidate.lang)) {
    throw new Error("Invalid language");
  }
  return { ...defaultState, ...candidate, reviewMistakes: sanitizeReviewMistakes(candidate.reviewMistakes) };
}

function importState(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(String(reader.result || "{}"));
      state = readImportedState(imported);
      saveState();
      render();
      showToast(t("imported"));
    } catch {
      alert(state.lang === "pl" ? "Nieprawidłowy plik JSON." : "Invalid JSON file.");
    }
    event.target.value = "";
  };
  reader.readAsText(file);
}

function alphabet() {
  view.innerHTML = `
    <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div><h1 class="text-3xl font-black">${tx("Alfabet arabski", "Arabic alphabet")}</h1><p class="text-[var(--muted)]">${tx("Kliknij litere, aby uslyszec wymowe. Uzyj 'i', aby zobaczyc formy i przyklad.", "Tap a letter to hear it. Use 'i' to see forms and examples.")}</p></div>
      <span id="alphabetLearnedCount" class="font-bold text-emerald-600">${state.learnedLetters.length}/28 ${tx("poznane", "learned")}</span>
    </div>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      ${arabicAlphabet.map((letter) => {
        const isLearned = state.learnedLetters.includes(letter.id);
        return `
        <article class="letter-tile relative overflow-hidden flex flex-col items-center justify-center p-2">
          <input type="checkbox" class="absolute left-2 top-2 z-10 w-5 h-5 accent-emerald-500 cursor-pointer" data-letter-check="${letter.id}" ${isLearned ? "checked" : ""} aria-label="${tx("Poznana litera", "Learned letter")}">
          <button class="absolute right-1 top-1 z-10 grid h-6 w-6 place-items-center rounded-md border border-[var(--line)] bg-[var(--surface)] text-[9px] font-black shadow-sm" data-letter-info="${letter.id}" aria-label="${t("more")}">i</button>
          <button class="flex flex-col items-center justify-center w-full h-full pt-4 gap-1" data-letter-say="${letter.id}">
            <span class="arabic text-4xl leading-tight">${escapeHtml(letter.forms.isolated)}</span>
            <span class="font-black text-[11px] text-center leading-tight w-full truncate px-1 mt-1">${escapeHtml(letterName(letter))}</span>
            <span class="text-[10px] text-[var(--muted)] font-mono leading-none">${escapeHtml(letter.transliteration)}</span>
          </button>
        </article>
      `}).join("")}
    </div>
  `;
  view.querySelectorAll("[data-letter-say]").forEach((button) => {
    button.addEventListener("click", () => {
      const letter = arabicAlphabet.find((item) => item.id === button.dataset.letterSay);
      speakArabic(letter.forms.isolated);
      button.closest("article").classList.add("ring-2", "ring-emerald-400");
      setTimeout(() => button.closest("article").classList.remove("ring-2", "ring-emerald-400"), 700);
    });
  });
  view.querySelectorAll("[data-letter-info]").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      openLetter(button.dataset.letterInfo);
    });
  });
  view.querySelectorAll("[data-say]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      speakArabic(button.dataset.say);
    });
  });
  view.querySelectorAll("[data-letter-check]").forEach((checkbox) => {
    checkbox.addEventListener("change", (e) => {
      e.stopPropagation();
      const id = checkbox.dataset.letterCheck;
      if (checkbox.checked) {
        markLetterLearned(id);
        showToast(tx("Litera poznana!", "Letter learned!"));
      } else {
        state.learnedLetters = state.learnedLetters.filter(x => x !== id);
        if (state.learnedLettersLog) state.learnedLettersLog = state.learnedLettersLog.filter(x => x.id !== id);
        saveState();
        showToast(tx("Cofnięto literę", "Letter unmarked"));
      }
      checkBadges();
      const counter = $("#alphabetLearnedCount");
      if (counter) counter.textContent = `${state.learnedLetters.length}/28 ${tx("poznane", "learned")}`;
    });
  });
}

function openLetter(id) {
  const letter = arabicAlphabet.find((item) => item.id === id);
  const isLearned = state.learnedLetters.includes(id);
  modalContent.innerHTML = `
    <div class="pr-12">
      <p class="text-sm font-bold text-emerald-600">${escapeHtml(letter.arabicName)}</p>
      <h2 class="text-3xl font-black">${escapeHtml(letterName(letter))}</h2>
    </div>
    <div class="my-5 grid place-items-center rounded-lg bg-emerald-500 py-7 text-white">
      <span class="arabic text-8xl">${escapeHtml(letter.forms.isolated)}</span>
      <span class="mt-2 font-bold">${escapeHtml(letter.transliteration)}</span>
    </div>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      ${formBox(tx("Izolowana", "Isolated"), letter.forms.isolated)}
      ${formBox(tx("Poczatkowa", "Initial"), letter.forms.initial)}
      ${formBox(tx("Srodkowa", "Medial"), letter.forms.medial)}
      ${formBox(tx("Koncowa", "Final"), letter.forms.final)}
    </div>
    <p class="mt-5 text-[var(--muted)]">${escapeHtml(letterPronunciationText(letter))}</p>
    <div class="soft-panel mt-5 p-4">
      <p class="text-sm font-bold text-[var(--muted)]">${tx("Przyklad", "Example")}</p>
      <p class="arabic mt-1 text-5xl">${escapeHtml(letter.example.ar)}</p>
      <p class="mt-2 font-bold">${escapeHtml(letterExampleMeaning(letter))} <span class="text-[var(--muted)]">(${escapeHtml(letter.example.tr)})</span></p>
    </div>
    <div class="mt-5 grid gap-2 sm:grid-cols-2">
      <button id="playLetterBtn" class="big-action bg-amber-500 text-white">🔊 ${tx("Odtwórz", "Play")}</button>
      <button id="markLearnedBtn" class="big-action ${isLearned ? "bg-emerald-100 text-emerald-700 border border-emerald-300" : "bg-emerald-500 text-white"}">
        ${isLearned ? tx("✓ Poznana — cofnij", "✓ Learned — undo") : tx("Oznacz jako poznaną", "Mark as learned")}
      </button>
    </div>
  `;
  modal.showModal();
  speakArabic(letter.forms.isolated);
  modalContent.querySelector("#playLetterBtn").addEventListener("click", () => speakArabic(letter.forms.isolated));
  modalContent.querySelector("#markLearnedBtn").addEventListener("click", (e) => {
    if (state.learnedLetters.includes(id)) {
      state.learnedLetters = state.learnedLetters.filter(x => x !== id);
      if (state.learnedLettersLog) state.learnedLettersLog = state.learnedLettersLog.filter(x => x.id !== id);
      saveState();
      updateAlphabetCounter();
      e.target.textContent = tx("Oznacz jako poznaną", "Mark as learned");
      e.target.className = "big-action bg-emerald-500 text-white";
      showToast(tx(`Cofnięto: litera ${letterName(letter)}`, `Unmarked: letter ${letterName(letter)}`));
    } else {
      markLetterLearned(id);
      checkBadges();
      updateAlphabetCounter();
      e.target.textContent = tx("✓ Poznana — cofnij", "✓ Learned — undo");
      e.target.className = "big-action bg-emerald-100 text-emerald-700 border border-emerald-300";
      showToast(tx(`Litera ${letterName(letter)} poznana!`, `Letter ${letterName(letter)} learned!`));
    }
  });
}

function markLetterLearned(id) {
  if (!state.learnedLetters.includes(id)) {
    state.learnedLetters.push(id);
    state.learnedLetters = [...new Set(state.learnedLetters)];
    state.points += 5;
    if (!state.learnedLettersLog) state.learnedLettersLog = [];
    state.learnedLettersLog.push({ id, date: today() });
    saveState();
  }
}

function updateAlphabetCounter() {
  const counter = $("#alphabetLearnedCount");
  if (counter) counter.textContent = `${state.learnedLetters.length}/28 ${tx("poznane", "learned")}`;
}

function formBox(label, value) {
  return `<div class="soft-panel p-3 text-center"><p class="text-xs font-bold text-[var(--muted)]">${label}</p><p class="arabic mt-2 text-4xl">${value}</p></div>`;
}

function isIslamLessonCategory(cat = "") {
  return /^Islam\b/i.test(cat);
}

function lessons() {
  const activeTab = state.lessonsTab || "alphabet";

  if (activeTab === "alphabet") {
    alphabet();
    const tabBar = document.createElement("div");
    tabBar.className = "flex gap-1 mb-5";
    tabBar.innerHTML = `
      <button class="px-3 py-2 text-sm font-black rounded-full border bg-[var(--accent)] text-white border-[var(--accent)]" data-lessons-tab="alphabet">${tx("Alfabet", "Alphabet")}</button>
      <button class="px-3 py-2 text-sm font-black rounded-full border border-[var(--border)] text-[var(--muted)]" data-lessons-tab="lessons">${tx("Lekcje", "Lessons")}</button>
    `;
    view.insertBefore(tabBar, view.firstChild);
    view.querySelectorAll("[data-lessons-tab]").forEach(btn => btn.addEventListener("click", () => {
      state.lessonsTab = btn.dataset.lessonsTab;
      saveState();
      lessons();
    }));
    return;
  }

  const allData = LESSONS_DATA[state.lang] || LESSONS_DATA.pl;
  const lessonsData = allData.filter(l => !isIslamLessonCategory(l.category));
  const categories = [...new Set(lessonsData.map(l => l.category))];
  const unlocked = true;

  view.innerHTML = `
    <div class="flex gap-1 mb-4">
      <button class="px-3 py-2 text-sm font-black rounded-full border border-[var(--border)] text-[var(--muted)]" data-lessons-tab="alphabet">${tx("Alfabet", "Alphabet")}</button>
      <button class="px-3 py-2 text-sm font-black rounded-full border bg-[var(--accent)] text-white border-[var(--accent)]" data-lessons-tab="lessons">${tx("Lekcje", "Lessons")}</button>
    </div>
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Lekcje arabskiego", "Arabic lessons")}</h1>
      <p class="text-[var(--muted)]">${tx("Tutaj zostają tylko język, alfabet, zwroty i słownictwo. Wiedza o islamie jest w sekcji Islam.", "This section keeps language, alphabet, phrases and vocabulary only. Islamic learning lives in the Islam section.")}</p>
    </div>

    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-6">
      ${categories.map(cat => `
        <button class="panel p-4 text-left hover:border-emerald-500 transition-colors" data-lesson-cat="${cat}">
          <strong class="block text-lg">${escapeHtml(cat)}</strong>
          <span class="text-sm text-[var(--muted)]">${lessonsData.filter(l => l.category === cat).length} ${tx("lekcje", "lessons")}</span>
        </button>
      `).join("")}
    </div>

    <div id="lessonsArea" class="grid gap-3 sm:grid-cols-2">
       ${unlocked ? skeleton(4, "180px") : ""}
    </div>
  `;

  view.querySelectorAll("[data-lessons-tab]").forEach(btn => btn.addEventListener("click", () => {
    state.lessonsTab = btn.dataset.lessonsTab;
    saveState();
    lessons();
  }));

  view.querySelectorAll("[data-lesson-cat]").forEach(btn => btn.addEventListener("click", () => {
    triggerHaptic();
    view.querySelectorAll("[data-lesson-cat]").forEach(b => b.classList.toggle("border-emerald-500", b === btn));
    const area = $("#lessonsArea");
    area.innerHTML = skeleton(2, "180px");
    setTimeout(() => renderLessonCategory(btn.dataset.lessonCat, lessonsData, unlocked), 400);
  }));

  if (categories.length > 0 && unlocked) {
    setTimeout(() => renderLessonCategory(categories[0], lessonsData, unlocked), 300);
  }
}

function renderLessonCategory(cat, allLessons, unlocked) {
  const filtered = allLessons.filter(l => l.category === cat);
  const area = $("#lessonsArea");
  area.innerHTML = filtered.map((lesson) => `
    <article class="panel p-5 ${unlocked ? "" : "opacity-55"}">
      <h2 class="text-xl font-black">${escapeHtml(lesson.title)}</h2>
      <p class="arabic mt-4 text-5xl leading-tight">${escapeHtml(lesson.ar)}</p>
      <p class="mt-2 font-bold">${escapeHtml(lesson.meaning)}</p>
      <p class="text-sm text-[var(--muted)]">${escapeHtml(lesson.tr)}</p>
      <p class="mt-4 text-[var(--muted)]">${escapeHtml(lesson.task)}</p>
      <div class="mt-4 grid gap-2 sm:grid-cols-2">
        <button class="big-action bg-emerald-500 text-white" data-say="${escapeHtml(lesson.ar)}" ${unlocked ? "" : "disabled"}>${t("play")}</button>
        <button class="big-action bg-amber-500 text-white" data-lesson="${lesson.id}" ${unlocked ? "" : "disabled"}>${state.miniLessonsDone.includes(lesson.id) ? "✓" : tx("Zaliczone", "Completed")}</button>
      </div>
    </article>
  `).join("");

  area.querySelectorAll("[data-say]").forEach((button) => button.addEventListener("click", () => speakArabic(button.dataset.say)));
  area.querySelectorAll("[data-lesson]").forEach((button) => button.addEventListener("click", () => {
    if (!state.miniLessonsDone.includes(button.dataset.lesson)) state.miniLessonsDone.push(button.dataset.lesson);
    addPoints(18, false);
    saveState();
    checkBadges();
    confetti();
    renderLessonCategory(cat, allLessons, unlocked);
  }));
}

function flashcards() {
  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Fiszki", "Flashcards")}</h1>
      <p class="text-[var(--muted)]">${tx("Prosty SM-2: łatwe karty wracają później, trudne szybciej.", "Simple SM-2: easy cards return later, difficult ones sooner.")}</p>
    </div>
    <div class="mb-3 flex flex-wrap gap-2">
      <button class="tab-btn active" data-tab="letters">${tx("Litery", "Letters")}</button>
      <button class="tab-btn" data-tab="words">${tx("Słowa", "Words")}</button>
      <button class="tab-btn" data-tab="ai">${tx("Fiszki AI", "AI Cards")}</button>
    </div>
    <div class="mb-4 flex flex-wrap gap-2">
      <button class="mode-btn active" data-mode="random">${tx("Losowo", "Random")}</button>
      <button class="mode-btn" data-mode="unknown">${tx("Nieznane", "Unknown")}</button>
      <button class="mode-btn" data-mode="review">${tx("Powtorki", "Reviews")}</button>
    </div>
    <div id="flashArea"></div>
  `;
  let tab = "letters";
  let mode = "random";
  const rebuild = () => buildFlashDeck(tab, mode);
  view.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => {
    tab = button.dataset.tab;
    view.querySelectorAll("[data-tab]").forEach((b) => b.classList.toggle("active", b === button));
    rebuild();
  }));
  view.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => {
    mode = button.dataset.mode;
    view.querySelectorAll("[data-mode]").forEach((b) => b.classList.toggle("active", b === button));
    rebuild();
  }));
  rebuild();
}

function buildFlashDeck(tab, mode) {
  let source = [];
  if (tab === "letters") {
    source = arabicAlphabet.map((letter) => ({ id: `letter-${letter.id}`, front: letter.forms.isolated, translation: letterName(letter), transliteration: letter.transliteration, back: `${letterName(letter)} · ${letter.transliteration}`, hint: letterPronunciationText(letter) }));
  } else if (tab === "words") {
    source = words.map((word) => ({ id: `word-${word.id}`, front: word.ar, translation: wordMeaning(word), transliteration: word.tr, back: `${wordMeaning(word)} · ${word.tr}`, hint: tx("slowo", "word") }));
  } else if (tab === "ai") {
    source = (state.aiFlashcards || []).concat(state.customFlashcards || []).map((card) => {
      const parsed = parseBack(card.back);
      return {
        id: card.id || `ai-${crypto.randomUUID()}`,
        front: card.front || card.ar || "سلام",
        translation: card.translation || parsed.translation || card.pl || (state.lang === "pl" ? "Karta AI" : "AI card"),
        transliteration: card.transliteration || parsed.transliteration || card.tr || card.hint || "AI",
        back: card.back || parsed.translation || card.pl || "AI",
        hint: card.hint || "AI"
      };
    });
  }
  const dueNow = Date.now();
  flashDeck = source.filter((card) => {
    const meta = state.flashcards[card.id];
    if (mode === "unknown") return !meta;
    if (mode === "review") return meta && meta.due <= dueNow;
    return true;
  }).sort(() => Math.random() - 0.5);
  flashIndex = 0;
  renderFlashCard();
}

function renderFlashCard() {
  const area = $("#flashArea");
  if (!flashDeck.length) {
    area.innerHTML = `<div class="panel p-6 text-center"><h2 class="text-2xl font-black">${t("noCards")}</h2><p class="mt-2 text-[var(--muted)]">${tx("Wróć do trybu losowego lub wybierz inny zestaw.", "Go back to random mode or choose a different set.")}</p></div>`;
    $("#openAiFromFlash")?.addEventListener("click", openAiChat);
    return;
  }
  const card = flashDeck[flashIndex % flashDeck.length];
  const back = parseBack(card.back);
  const translation = card.translation || back.translation || (state.lang === "pl" ? "Fiszka Alif AI" : "Alif AI card");
  const transliteration = card.transliteration || back.transliteration || card.hint || "";
  area.innerHTML = `
    <div id="flipCard" class="flashcard block w-full text-left" role="button" tabindex="0" aria-label="${tx("Odwroc fiszke", "Flip flashcard")}">
      <div class="flashcard-inner">
        <div class="flash-face flash-front">
          <div class="text-center">
            <p class="arabic text-8xl">${escapeHtml(card.front)}</p>
            <button type="button" class="speaker-btn mt-4" data-say-card="${escapeHtml(card.front)}">🔊</button>
            <p class="mt-3 text-sm font-bold text-[var(--muted)]">${escapeHtml(card.hint)}</p>
            <p class="mt-2 text-xs text-[var(--muted)]">${t("frontHint")}</p>
          </div>
        </div>
        <div class="flash-face flash-back">
          <div class="text-center">
            <p class="text-3xl font-black leading-snug">${escapeHtml(translation)}</p>
            <p class="mt-3 rounded-lg bg-[var(--surface-soft)] px-4 py-2 text-lg font-bold text-[var(--muted)]">${escapeHtml(transliteration)}</p>
            <p class="mt-3 text-[var(--muted)]">${tx("Jak poszlo?", "How did it go?")}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4 grid grid-cols-3 gap-2">
      <button class="big-action bg-red-500 text-white" data-grade="1">${t("hard")}</button>
      <button class="big-action bg-amber-500 text-white" data-grade="3">${t("ok")}</button>
      <button class="big-action bg-emerald-500 text-white" data-grade="5">${t("easy")}</button>
    </div>
  `;
  $("#flipCard").addEventListener("click", (event) => event.currentTarget.classList.toggle("flipped"));
  $("#flipCard").addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    event.currentTarget.classList.toggle("flipped");
  });
  area.querySelector("[data-say-card]").addEventListener("click", (event) => {
    event.stopPropagation();
    speakArabic(event.currentTarget.dataset.sayCard);
  });
  area.querySelectorAll("[data-grade]").forEach((button) => button.addEventListener("click", () => {
    gradeCard(card.id, Number(button.dataset.grade));
    flashIndex += 1;
    renderFlashCard();
  }));
}

function parseBack(back = "") {
  const clean = String(back || "").trim();
  if (!clean) return { translation: "", transliteration: "" };
  const parts = clean.split(/\s*(?:[-·|–—:]| \u00b7 )\s*/).map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) return { translation: parts[0], transliteration: parts.slice(1).join(" · ") };
  return { translation: clean, transliteration: "" };
}

function gradeCard(id, quality) {
  const old = state.flashcards[id] || { interval: 0, repetitions: 0, ef: 2.5 };
  let { interval, repetitions, ef } = old;
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    interval = repetitions === 1 ? 1 : repetitions === 2 ? 6 : Math.round(interval * ef);
    ef = Math.max(1.3, ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
    state.points += quality;
  }
  state.flashcards[id] = { interval, repetitions, ef, due: Date.now() + interval * 86400000 };
  saveState();
}

function speech() {
  currentSpeechSample = words[Math.floor(Math.random() * words.length)];
  const saved = state.recordings[currentSpeechSample.id];
  view.innerHTML = `
    <div class="panel p-5 sm:p-7">
      <h1 class="text-3xl font-black">${tx("Zaawansowana wymowa", "Advanced pronunciation")}</h1>
      <p class="mt-2 text-[var(--muted)]">${tx("Rozpoznawanie mowy, nagrywanie wlasnej proby i odtwarzanie obok wzorca.", "Speech recognition, recording your own attempt, and playback next to the model.")}</p>
      <div class="my-6 grid place-items-center rounded-lg bg-emerald-500 py-8 text-white">
        <p id="speechTarget" class="arabic text-7xl">${currentSpeechSample.ar}</p>
        <p class="mt-2 font-bold">${wordMeaning(currentSpeechSample)} (${currentSpeechSample.tr})</p>
      </div>
      <div class="grid gap-3 sm:grid-cols-5">
        <button id="listenBtn" class="big-action bg-emerald-500 text-white">${tx("Rozpoznaj", "Recognize")}</button>
        <button id="recordBtn" class="big-action bg-amber-500 text-white">${tx("Nagraj", "Record")}</button>
        <button id="playModelBtn" class="big-action border border-[var(--line)] bg-[var(--surface)]">${tx("Wzorzec", "Model")}</button>
        <button id="newSpeechBtn" class="big-action border border-[var(--line)] bg-[var(--surface)]">${tx("Nastepne", "Next")}</button>
        <button id="manualPassBtn" class="big-action bg-emerald-700 text-white">${tx("Zalicz", "Mark done")}</button>
      </div>
      <div class="mt-5 grid gap-3 lg:grid-cols-2">
        <div class="soft-panel p-4">
          <p class="text-sm font-bold text-[var(--muted)]">${tx("Transkrypcja", "Transcript")}</p>
          <p id="speechText" class="mt-2 min-h-8 text-xl font-bold">${tx("Jeszcze nic nie nagrano.", "Nothing recorded yet.")}</p>
          <p id="speechConfidence" class="mt-1 text-[var(--muted)]">${tx("Pewnosc", "Confidence")}: 0%</p>
        </div>
        <div class="soft-panel p-4">
          <p class="text-sm font-bold text-[var(--muted)]">${tx("Twoje nagranie", "Your recording")}</p>
          <audio id="userAudio" class="mt-3 w-full" controls src="${saved || ""}"></audio>
        </div>
      </div>
    </div>
  `;
  $("#newSpeechBtn").addEventListener("click", speech);
  $("#manualPassBtn").addEventListener("click", () => completeSpeech(currentSpeechSample.id));
  $("#listenBtn").addEventListener("click", () => startSpeech(currentSpeechSample));
  $("#playModelBtn").addEventListener("click", () => speakArabic(currentSpeechSample.ar));
  $("#recordBtn").addEventListener("click", toggleRecording);
}

function speakArabicGoogleTTS(text) {
  const url = `https://translate.googleapis.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=ar&client=gtx&ttsspeed=0.6`;
  const audio = new Audio(url);
  audio.play().catch(() => {
    if (!state.ttsWarningShown) {
      state.ttsWarningShown = true;
      saveState();
      showToast(tx("Brak arabskiego TTS. Zainstaluj język arabski w systemie lub użyj Chrome.", "No Arabic TTS. Install Arabic language pack or use Chrome."));
    }
  });
}

function speakArabic(text) {
  const clean = String(text || "").trim();
  if (!clean) return;

  // Always try Web Speech API first - even without a specific Arabic voice,
  // setting lang="ar-SA" lets the browser use built-in TTS
  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = "ar-SA";
    u.rate = 0.75;
    u.pitch = 1;
    u.volume = 1;

    // Try to find an Arabic voice to improve quality
    const voices = speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang === "ar-SA")
      || voices.find(v => v.lang === "ar-AE")
      || voices.find(v => v.lang === "ar-EG")
      || voices.find(v => /^ar\b/i.test(v.lang))
      || voices.find(v => /arab/i.test(v.name));
    if (arabicVoice) u.voice = arabicVoice;

    u.onerror = () => speakArabicGoogleTTS(clean);
    speechSynthesis.resume();
    speechSynthesis.speak(u);

    // If voices not loaded yet, try again after they load
    if (!voices.length) {
      speechSynthesis.onvoiceschanged = () => {
        speechSynthesis.onvoiceschanged = null;
        speakArabic(clean);
      };
    }
    return;
  }

  speakArabicGoogleTTS(clean);
}

function startSpeech(sample) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    $("#speechText").textContent = tx("Ta przegladarka nie obsluguje SpeechRecognition.", "This browser does not support SpeechRecognition.");
    return;
  }
  recognition = new SpeechRecognition();
  recognition.lang = "ar-SA";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  $("#speechText").textContent = tx("Slucham...", "Listening...");
  recognition.onresult = (event) => {
    const result = event.results[0][0];
    const confidence = Math.round((result.confidence || 0.75) * 100);
    $("#speechText").textContent = result.transcript;
    $("#speechConfidence").textContent = `${tx("Pewnosc", "Confidence")}: ${confidence}%`;
    if (confidence >= 80) completeSpeech(sample.id);
  };
  recognition.onerror = () => {
    $("#speechText").textContent = tx("Nie udalo sie rozpoznac mowy. Sprobuj jeszcze raz.", "Could not recognize speech. Please try again.");
  };
  recognition.start();
}

async function toggleRecording() {
  const button = $("#recordBtn");
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
    button.textContent = tx("Nagraj", "Record");
    return;
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    $("#speechText").textContent = tx("Ta przegladarka nie obsluguje nagrywania audio.", "This browser does not support audio recording.");
    return;
  }
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  audioChunks = [];
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
  mediaRecorder.onstop = () => {
    const blob = new Blob(audioChunks, { type: "audio/webm" });
    const reader = new FileReader();
    reader.onload = () => {
      state.recordings[currentSpeechSample.id] = reader.result;
      saveState();
      $("#userAudio").src = reader.result;
    };
    reader.readAsDataURL(blob);
    stream.getTracks().forEach((track) => track.stop());
  };
  mediaRecorder.start();
  button.textContent = "Stop";
}

function completeSpeech(id) {
  if (!state.speechDone.includes(id)) state.speechDone.push(id);
  state.points += 15;
  saveState();
  confetti();
}

function writing() {
  writingLetter = arabicAlphabet[Math.floor(Math.random() * arabicAlphabet.length)];
  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Cwicz pisanie", "Practice writing")}</h1>
      <p class="text-[var(--muted)]">${tx("Przerysuj litere po sladzie palcem, myszka albo rysikiem.", "Trace the letter with your finger, mouse or stylus.")}</p>
    </div>
    <div class="grid gap-4 lg:grid-cols-[1fr_0.7fr]">
      <div class="panel p-3">
        <canvas id="writingCanvas" class="writing-canvas"></canvas>
      </div>
      <div class="grid gap-3">
        <div class="soft-panel p-5 text-center">
          <p class="text-sm font-bold text-[var(--muted)]">${tx("Litera", "Letter")}</p>
          <p class="arabic text-7xl">${writingLetter.forms.isolated}</p>
          <p class="font-black">${letterName(writingLetter)}</p>
          <button id="sayWritingLetter" class="big-action mt-3 w-full bg-amber-500 text-white">🔊 ${t("play")}</button>
        </div>
        <button id="checkWriting" class="big-action bg-emerald-500 text-white">${t("check")}</button>
        <button id="clearWriting" class="big-action border border-[var(--line)] bg-[var(--surface)]">${t("clear")}</button>
        <button id="nextWriting" class="big-action bg-amber-500 text-white">${t("next")}</button>
      </div>
    </div>
    <section class="panel mt-4 p-5">
      <h2 class="text-xl font-black">${t("attempts")}</h2>
      <div class="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        ${state.writingAttempts.slice(0, 10).map((attempt) => `
          <article class="soft-panel overflow-hidden">
            <img src="${attempt.preview}" alt="${attempt.result}" class="h-28 w-full bg-white object-contain" />
            <div class="p-3">
              <strong>${attempt.result} · ${attempt.score ?? 0}%</strong>
              <p class="text-xs text-[var(--muted)]">${escapeHtml(attempt.message || "")}</p>
              <p class="text-xs text-[var(--muted)]">${new Date(attempt.date).toLocaleString(localeTag())}</p>
            </div>
          </article>
        `).join("") || `<p class="text-[var(--muted)]">${tx("Brak prob.", "No attempts yet.")}</p>`}
      </div>
    </section>
  `;
  setupCanvas();
  const _resizeHandler = () => { if (route === "writing") setupCanvas(); };
  window._writingResizeHandler = _resizeHandler;
  window.addEventListener("resize", _resizeHandler, { passive: true });
  $("#sayWritingLetter").addEventListener("click", () => speakArabic(writingLetter.forms.isolated));
  $("#clearWriting").addEventListener("click", setupCanvas);
  $("#nextWriting").addEventListener("click", writing);
  $("#checkWriting").addEventListener("click", () => {
    const canvas = $("#writingCanvas");
    const score = writingScore();
    const result = writingResultLabel(score);
    const message = writingMessage(score);
    state.writingAttempts.unshift({ id: crypto.randomUUID(), letter: writingLetter.id, date: new Date().toISOString(), result, score, message, ink: Math.round(writingInk), preview: canvas.toDataURL("image/png") });
    state.writingAttempts = state.writingAttempts.slice(0, 10);
    if (score >= 68) {
      if (!state.writingDone.includes(writingLetter.id)) state.writingDone.push(writingLetter.id);
      state.points += 12;
      confetti();
    }
    saveState();
    writing();
  });
}

function writingScore() {
  if (writingInk < 30 || !writingGuideMask || !writingUserMask) return 0;

  const guideCtx = writingGuideMask.getContext("2d", { willReadFrequently: true });
  const userCtx = writingUserMask.getContext("2d", { willReadFrequently: true });
  const guidePixels = guideCtx.getImageData(0, 0, writingGuideMask.width, writingGuideMask.height).data;
  const userPixels = userCtx.getImageData(0, 0, writingUserMask.width, writingUserMask.height).data;

  let guideCount = 0;
  let userCount = 0;
  let overlapCount = 0;

  for (let i = 3; i < guidePixels.length; i += 4) {
    const guideOn = guidePixels[i] > 24;
    const userOn = userPixels[i] > 24;
    if (guideOn) guideCount += 1;
    if (userOn) userCount += 1;
    if (guideOn && userOn) overlapCount += 1;
  }

  if (!guideCount || !userCount) return 0;

  const coverage = overlapCount / guideCount;
  const precision = overlapCount / userCount;
  const strokeLengthFit = Math.min(1, writingInk / 280);
  const softCoverage = Math.sqrt(Math.max(0, coverage));
  const softPrecision = Math.sqrt(Math.max(0, precision));
  const balanceBonus = coverage > 0.5 && precision > 0.4 ? 0.1 : 0;

  const score = (softCoverage * 0.62 + softPrecision * 0.24 + strokeLengthFit * 0.14 + balanceBonus) * 100;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function writingResultLabel(score) {
  if (score >= 88) return tx("bardzo dobrze", "very good");
  if (score >= 68) return t("good");
  if (score >= 38) return t("weak");
  return t("veryWeak");
}

function writingMessage(score) {
  if (score >= 92) return `${score}% - ${tx("prawie idealnie!", "almost perfect!")}`;
  if (score >= 68) return `${score}% - ${tx("piękny postęp.", "beautiful progress.")}`;
  if (score >= 38) return `${score}% - ${tx("jeszcze odrobina spokoju i bedzie lepiej.", "a little more calm and it will improve.")}`;
  return `${score}% - ${tx("sprobuj narysowac wiecej po sladzie.", "try tracing more of the guide.")}`;
}

function setupCanvas() {
  const canvas = $("#writingCanvas");
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  writingInk = 0;
  writingLastPoint = null;
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.width * ratio);
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, rect.width, rect.width);
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--surface").trim() || "#ffffff";
  ctx.fillRect(0, 0, rect.width, rect.width);
  ctx.globalAlpha = 0.24;
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--emerald").trim() || "#047857";
  ctx.font = `${rect.width * 0.68}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(writingLetter.forms.isolated, rect.width / 2, rect.width / 2);
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--gold").trim() || "#EAB308";
  ctx.lineWidth = Math.max(2, rect.width * 0.008);
  ctx.strokeText(writingLetter.forms.isolated, rect.width / 2, rect.width / 2);
  ctx.globalAlpha = 1;
  ctx.lineWidth = Math.max(8, rect.width * 0.025);
  ctx.lineCap = "round";
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--gold").trim() || "#EAB308";

  writingGuideMask = document.createElement("canvas");
  writingGuideMask.width = Math.max(160, Math.floor(rect.width));
  writingGuideMask.height = Math.max(160, Math.floor(rect.width));
  const guideMaskCtx = writingGuideMask.getContext("2d");
  guideMaskCtx.clearRect(0, 0, writingGuideMask.width, writingGuideMask.height);
  guideMaskCtx.fillStyle = "#000";
  guideMaskCtx.strokeStyle = "#000";
  guideMaskCtx.lineWidth = Math.max(18, writingGuideMask.width * 0.085);
  guideMaskCtx.lineJoin = "round";
  guideMaskCtx.lineCap = "round";
  guideMaskCtx.font = `${writingGuideMask.width * 0.68}px serif`;
  guideMaskCtx.textAlign = "center";
  guideMaskCtx.textBaseline = "middle";
  guideMaskCtx.globalAlpha = 0.92;
  guideMaskCtx.fillText(writingLetter.forms.isolated, writingGuideMask.width / 2, writingGuideMask.height / 2);
  guideMaskCtx.strokeText(writingLetter.forms.isolated, writingGuideMask.width / 2, writingGuideMask.height / 2);

  writingUserMask = document.createElement("canvas");
  writingUserMask.width = writingGuideMask.width;
  writingUserMask.height = writingGuideMask.height;
  const userMaskCtx = writingUserMask.getContext("2d");
  userMaskCtx.clearRect(0, 0, writingUserMask.width, writingUserMask.height);
  userMaskCtx.strokeStyle = "#000";
  userMaskCtx.lineWidth = Math.max(16, writingUserMask.width * 0.078);
  userMaskCtx.lineCap = "round";
  userMaskCtx.lineJoin = "round";

  const toMaskPoint = (p) => ({
    x: (p.x / rect.width) * writingUserMask.width,
    y: (p.y / rect.width) * writingUserMask.height
  });

  let drawing = false;
  const point = (event) => {
    const r = canvas.getBoundingClientRect();
    const touch = event.touches?.[0] || event;
    return { x: touch.clientX - r.left, y: touch.clientY - r.top };
  };
  canvas.onpointerdown = (event) => {
    drawing = true;
    const p = point(event);
    writingLastPoint = p;
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    const mp = toMaskPoint(p);
    userMaskCtx.beginPath();
    userMaskCtx.moveTo(mp.x, mp.y);
  };
  canvas.onpointermove = (event) => {
    if (!drawing) return;
    const p = point(event);
    if (writingLastPoint) {
      writingInk += Math.hypot(p.x - writingLastPoint.x, p.y - writingLastPoint.y);
    }
    writingLastPoint = p;
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    const mp = toMaskPoint(p);
    userMaskCtx.lineTo(mp.x, mp.y);
    userMaskCtx.stroke();
  };
  canvas.onpointerup = () => {
    drawing = false;
    writingLastPoint = null;
  };
  canvas.onpointerleave = () => {
    drawing = false;
    writingLastPoint = null;
  };
}

function learningJournalStats() {
  const todayLog = state.prayerLog?.[today()] || {};
  const prayersDone = OBLIGATORY_PRAYERS.filter(name => todayLog[name]).length;
  const memorized = HIFZ_SURAHS.filter(num => state.hifzProgress?.[num] === "memorized").length;
  const noteCount = Object.values(state.adventureNotes || {}).filter(Boolean).length;
  const lettersDone = state.learnedLetters?.length || 0;
  return [
    { value: `${lettersDone}/28`, label: tx("Litery", "Letters"), route: "alphabet" },
    { value: `${prayersDone}/5`, label: tx("Modlitwy dzisiaj", "Prayers today"), route: "prayer" },
    { value: `${memorized}/${HIFZ_SURAHS.length}`, label: tx("Krotkie sury", "Short surahs"), route: "koran", quranTab: "hifz" },
    { value: String(noteCount), label: tx("Wpisy", "Entries"), route: "adventure" }
  ].map(item => `
    <button class="panel p-4 text-left active:scale-95 transition-transform" data-journal-route="${item.route}" ${item.quranTab ? `data-quran-tab="${item.quranTab}"` : ""}>
      <p class="text-2xl font-black text-[var(--accent)]">${item.value}</p>
      <p class="text-xs font-bold text-[var(--muted)] mt-1">${item.label}</p>
    </button>
  `).join("");
}

function learningJournal() {
  if (!state.learnedLettersLog) state.learnedLettersLog = [];
  if (!state.adventureNotes) state.adventureNotes = {};
  state.journalTab = state.journalTab || "notes";

  const events = [];
  const notes = Object.entries(state.adventureNotes || {})
    .filter(([, text]) => text)
    .map(([date, text]) => ({ date, text: escapeHtml(text) }))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  (state.learnedLettersLog || []).forEach(entry => {
    const letter = arabicAlphabet.find(l => l.id === entry.id);
    if (letter) events.push({ date: entry.date, icon: escapeHtml(letter.forms.isolated), text: tx(`Poznałeś/aś literę ${letterName(letter)} (${letter.transliteration})`, `Learned the letter ${letterName(letter)} (${letter.transliteration})`), type: "letter" });
  });

  if (state.learnedLetters.length >= 28) events.push({ date: today(), icon: "🏆", text: tx("Poznałeś/aś cały alfabet arabski!", "You learned the full Arabic alphabet!"), type: "milestone" });
  else if (state.learnedLetters.length >= 14) events.push({ date: today(), icon: "⭐", text: tx(`Połowa alfabetu! ${state.learnedLetters.length}/28 liter poznanych.`, `Halfway! ${state.learnedLetters.length}/28 letters learned.`), type: "milestone" });

  if ((state.quranSurahFavorites || []).length > 0) {
    state.quranSurahFavorites.forEach(num => {
      const s = SURAH_LIST.find(x => x.number === num);
      if (s) events.push({ date: today(), icon: "📖", text: tx(`Ulubiona sura ${s.number}: ${s.enName}`, `Favorite Surah ${s.number}: ${s.enName}`), type: "quran" });
    });
  }

  if (state.streak >= 7) events.push({ date: today(), icon: "🔥", text: tx(`Seria ${state.streak} dni nauki z rzędu!`, `${state.streak}-day learning streak!`), type: "milestone" });

  events.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  const next = nextStepSuggestion();

  const timelineHtml = events.length ? events.map(ev => `
    <div class="flex gap-4 items-start">
      <div class="flex flex-col items-center">
        <div class="grid h-11 w-11 place-items-center rounded-full ${ev.type === "letter" ? "bg-emerald-100 arabic text-2xl" : ev.type === "quran" ? "bg-amber-100 text-xl" : ev.type === "milestone" ? "bg-yellow-100 text-xl" : "bg-blue-100 text-xl"}">${ev.icon}</div>
        <div class="flex-1 w-0.5 bg-[var(--line)] my-1 min-h-4"></div>
      </div>
      <div class="pb-4 flex-1 min-w-0">
        <p class="font-black leading-snug">${ev.text}</p>
        <p class="text-xs text-[var(--muted)] mt-1">${ev.date}</p>
      </div>
    </div>
  `).join("") : `<p class="text-[var(--muted)] text-center py-8">${tx("Brak zdarzeń. Zacznij uczyć się liter i dodawaj sury, by tu coś zobaczyć.", "No events yet. Start learning letters and add surahs to see your timeline.")}</p>`;

  const notesHtml = notes.length ? notes.map(note => `
    <article class="panel p-4">
      <p class="font-bold leading-relaxed">${note.text}</p>
      <p class="text-xs text-[var(--muted)] mt-2">${new Date(note.date).toLocaleString(localeTag())}</p>
    </article>
  `).join("") : `<p class="text-[var(--muted)] text-center py-8">${tx("Brak własnych wpisów.", "No personal entries yet.")}</p>`;

  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Dziennik nauki", "Learning Journal")}</h1>
      <p class="text-[var(--muted)]">${tx("Twoje notatki, postepy, modlitwy, sury i kamienie milowe.", "Your notes, progress, prayers, surahs and milestones.")}</p>
    </div>
    <div class="grid gap-3 sm:grid-cols-4 mb-4">
      ${learningJournalStats()}
    </div>
    <button class="panel p-4 mb-4 text-left w-full flex items-center justify-between gap-3 active:scale-95 transition-transform" data-journal-route="${next.route}" ${next.quranTab ? `data-quran-tab="${next.quranTab}"` : ""}>
      <div>
        <p class="text-xs font-black uppercase tracking-wide text-[var(--muted)]">${tx("Nastepny maly krok", "Next small step")}</p>
        <h2 class="text-lg font-black mt-1">${next.title}</h2>
        <p class="text-sm text-[var(--muted)] mt-1">${next.text}</p>
        <p class="mt-2 text-xs font-black text-emerald-600">${next.action}</p>
      </div>
      <span class="text-xl">&gt;</span>
    </button>
    <div class="panel mb-4 p-5">
      <h2 class="text-lg font-black mb-3">${tx("Dodaj wpis do dziennika", "Add journal entry")}</h2>
      <textarea id="adventureNoteInput" class="min-h-20 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3" placeholder="${tx("Napisz coś, co chcesz zapamiętać... (np. dzisiaj nauczyłem się...)", "Write something to remember... (e.g. today I learned...)")}"></textarea>
      <button id="addAdventureNoteBtn" class="big-action mt-3 w-full bg-emerald-500 text-white">${tx("Dodaj wpis", "Add entry")}</button>
    </div>
    <div class="mb-3 flex flex-wrap gap-2">
      <button class="tab-btn ${state.journalTab === "notes" ? "active" : ""}" data-journal-tab="notes">${tx("Moje wpisy", "My entries")}</button>
      <button class="tab-btn ${state.journalTab === "events" ? "active" : ""}" data-journal-tab="events">${tx("Zdarzenia systemowe", "System events")}</button>
    </div>
    <div class="panel p-5 mb-4">
      <h2 class="text-lg font-black mb-4">${state.journalTab === "notes" ? tx("Moje wpisy", "My entries") : tx("Zdarzenia systemowe", "System events")} · ${state.journalTab === "notes" ? notes.length : events.length}</h2>
      <div class="mt-2 grid gap-3">${state.journalTab === "notes" ? notesHtml : timelineHtml}</div>
    </div>
  `;

  $("#addAdventureNoteBtn").addEventListener("click", () => {
    const text = $("#adventureNoteInput").value.trim();
    if (!text) return;
    if (!state.adventureNotes) state.adventureNotes = {};
    const key = new Date().toISOString();
    state.adventureNotes[key] = text;
    state.journalTab = "notes";
    saveState();
    learningJournal();
  });
  view.querySelectorAll("[data-journal-tab]").forEach(btn => btn.addEventListener("click", () => {
    state.journalTab = btn.dataset.journalTab;
    saveState();
    learningJournal();
  }));
  view.querySelectorAll("[data-journal-route]").forEach(btn => btn.addEventListener("click", () => {
    if (btn.dataset.quranTab) state.quranTab = btn.dataset.quranTab;
    setRoute(btn.dataset.journalRoute);
  }));
}

function books() {
  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Moje ksiazeczki", "My books")}</h1>
      <p class="text-[var(--muted)]">${tx("AI bajki po arabsku z tłumaczeniem, PDF i interaktywne karty.", "AI stories in Arabic with translation, PDFs and interactive cards.")}</p>
    </div>
    <div class="panel mb-4 p-5">
      <h2 class="text-lg font-black mb-3">${tx("Wygeneruj bajkę arabską z AI", "Generate Arabic story with AI")}</h2>
      <textarea id="aiStoryPrompt" class="min-h-20 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3 mb-3" placeholder="${tx("Temat bajki (np. podroz, dobre uczynki, nauka liter...)", "Story theme (e.g. travel, good deeds, learning letters...)")}"></textarea>
      <button id="generateAiBookBtn" class="big-action w-full bg-emerald-500 text-white">${tx("Wygeneruj bajkę", "Generate story")}</button>
    </div>
    <details class="panel mb-4 p-5">
      <summary class="font-black cursor-pointer">${tx("Dodaj PDF / link", "Add PDF / link")}</summary>
      <div class="grid gap-3 mt-4">
        <input id="bookTitle" class="min-h-12 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4" placeholder="${tx("Tytul ksiazeczki", "Book title")}" />
        <input id="bookFile" class="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4" type="file" accept="application/pdf" />
        <input id="bookLink" class="min-h-12 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4" placeholder="${tx("Albo link do PDF", "Or a PDF link")}" />
        <div class="grid gap-2 sm:grid-cols-2">
          <button id="addBook" class="big-action bg-emerald-500 text-white">${tx("Dodaj PDF", "Add PDF")}</button>
          <button id="extractBook" class="big-action bg-amber-500 text-white">${tx("Wyciagnij tekst i zrob karty", "Extract text and make cards")}</button>
        </div>
      </div>
    </details>
    <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      ${state.interactiveBooks.map((book) => `
        <button class="panel p-4 text-left" data-interactive-book="${book.id}">
          <div class="book-cover grid place-items-center text-4xl">AI</div>
          <!-- SECURITY: escaped AI output -->
          <strong class="mt-3 block">${escapeHtml(book.title)}</strong>
          <span class="text-sm text-[var(--muted)]">${book.cards.length} ${tx("stron / kart", "pages / cards")}</span>
        </button>
      `).join("")}
      ${state.books.map((book) => `
        <button class="panel p-4 text-left" data-book="${book.id}">
          <div class="book-cover grid place-items-center text-5xl">PDF</div>
          <strong class="mt-3 block">${escapeHtml(book.title)}</strong>
          <span class="text-sm text-[var(--muted)]">${book.sourceType === "file" ? tx("plik lokalny", "local file") : tx("link", "link")}</span>
        </button>
      `).join("") || (state.interactiveBooks.length ? "" : `<div class="soft-panel p-6 text-center text-[var(--muted)] sm:col-span-2 lg:col-span-3">${tx("Brak ksiazeczek. Wygeneruj pierwsza bajke!", "No books yet. Generate your first story!")}</div>`)}
    </div>
    <div id="pdfViewer" class="mt-4"></div>
  `;
  $("#generateAiBookBtn").addEventListener("click", generateAiBook);
  $("#addBook").addEventListener("click", addBook);
  $("#extractBook").addEventListener("click", extractBook);
  view.querySelectorAll("[data-book]").forEach((button) => button.addEventListener("click", () => openBook(button.dataset.book)));
  view.querySelectorAll("[data-interactive-book]").forEach((button) => button.addEventListener("click", () => openInteractiveBook(button.dataset.interactiveBook)));
}

async function generateAiBook() {
  const btn = $("#generateAiBookBtn");
  const promptText = $("#aiStoryPrompt").value.trim();
  btn.textContent = tx("Generuję...", "Generating...");
  btn.disabled = true;
  try {
    const systemPrompt = tx(
      `Napisz KRÓTKĄ bajkę (5-8 par zdań) po arabsku dla osoby uczącej się (poziom A1-A2).
Temat: "${promptText || "Bajka o przyjaźni i nauce arabskiego"}"
Format BEZWZGLĘDNIE:
arabskie zdanie
polskie tłumaczenie

(pusta linia)
następna para

Na końcu: SŁOWNICZEK z 5 trudniejszych słów w formacie: عربي — polskie.
NIE używaj: nagłówków, markdown, numerów, "Strona przednia/tylna".`,
      `Write a SHORT story (5-8 sentence pairs) in Arabic for a beginner (A1-A2 level).
Topic: "${promptText || "A story about friendship and learning Arabic"}"
Format STRICTLY:
Arabic sentence
English translation

(blank line)
next pair

At the end: GLOSSARY of 5 harder words in format: عربي — english.
Do NOT use: headers, markdown, numbers, "Front/Back" labels.`
    );
    const text = await askGroq([{ role: "user", content: systemPrompt }]);
    const title = tx(`Bajka ${new Date().toLocaleDateString(localeTag())}`, `Story ${new Date().toLocaleDateString(localeTag())}`);
    saveInteractiveBook(title, text);
    openInteractiveBook(state.interactiveBooks[0].id);
    confetti();
  } catch {
    btn.textContent = tx("Błąd AI", "AI error");
    btn.disabled = false;
  }
}

function addBook() {
  const title = $("#bookTitle").value.trim() || tx("Ksiazeczka z Gemini", "Gemini booklet");
  const file = $("#bookFile").files[0];
  const link = $("#bookLink").value.trim();
  if (file) {
    readFileAsDataUrl(file, (url) => {
      state.books.unshift({ id: crypto.randomUUID(), title, url, sourceType: "file" });
      saveState();
      books();
    });
    return;
  }
  if (link) {
    state.books.unshift({ id: crypto.randomUUID(), title, url: link, sourceType: "link" });
    saveState();
    books();
  }
}

async function extractBook() {
  const title = $("#bookTitle").value.trim() || tx("Interaktywna ksiazeczka", "Interactive booklet");
  const file = $("#bookFile").files[0];
  const link = $("#bookLink").value.trim();
  const button = $("#extractBook");
  button.textContent = tx("Czytam PDF...", "Reading PDF...");
  try {
    const source = file ? new Uint8Array(await file.arrayBuffer()) : link;
    if (!source) return;
    const text = await extractPdfText(source);
    const cards = makeBookCards(text);
    state.interactiveBooks.unshift({ id: crypto.randomUUID(), title, rawText: text.slice(0, 12000), cards });
    saveState();
    books();
  } catch {
    button.textContent = tx("Nie udalo sie odczytac", "Could not read");
  }
}

async function extractPdfText(source) {
  // @ts-ignore CDN ESM import is loaded by the browser at runtime.
  const pdfjs = await import("https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";
  const loadingTask = typeof source === "string" ? pdfjs.getDocument(source) : pdfjs.getDocument({ data: source });
  const pdf = await loadingTask.promise;
  const chunks = [];
  for (let pageNumber = 1; pageNumber <= Math.min(pdf.numPages, 12); pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    chunks.push(content.items.map((item) => item.str).join(" "));
  }
  return chunks.join("\n");
}

function makeBookCards(text) {
  const tokens = text
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1)
    .slice(0, 36);
  if (!tokens.length) {
    return words.slice(0, 8).map((word) => ({ ar: word.ar, pl: wordMeaning(word), tr: word.tr }));
  }
  return tokens.map((token, index) => ({
    ar: /[\u0600-\u06FF]/.test(token) ? token : words[index % words.length].ar,
    pl: token,
    tr: words[index % words.length].tr
  }));
}

function openBook(id) {
  const book = state.books.find((item) => item.id === id);
  $("#pdfViewer").innerHTML = `
    <div class="panel p-4">
      <div class="mb-3 flex items-center justify-between gap-3">
        <h2 class="text-xl font-black">${escapeHtml(book.title)}</h2>
        <a class="font-bold text-emerald-600" href="${book.url}" target="_blank" rel="noopener">${tx("Otworz", "Open")}</a>
      </div>
      <iframe title="${book.title}" src="${book.url}" class="h-[70vh] w-full rounded-lg border border-[var(--line)] bg-white"></iframe>
    </div>
  `;
}

function openInteractiveBook(id) {
  const book = state.interactiveBooks.find((item) => item.id === id);
  const pages = [];
  for (let i = 0; i < book.cards.length; i += 4) pages.push(book.cards.slice(i, i + 4));
  $("#pdfViewer").innerHTML = `
    <div class="panel p-4" data-flipbook="${book.id}">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <!-- SECURITY: escaped AI output -->
        <h2 class="text-xl font-black">${escapeHtml(book.title)}</h2>
        <div class="flex gap-2">
          <button class="rounded-lg border border-[var(--line)] px-4 py-2 font-bold" data-page-prev>‹</button>
          <span class="rounded-lg bg-emerald-500 px-4 py-2 font-bold text-white"><span data-page-current>1</span>/${Math.max(1, pages.length)}</span>
          <button class="rounded-lg border border-[var(--line)] px-4 py-2 font-bold" data-page-next>›</button>
        </div>
      </div>
      <div class="flipbook mt-4">
        ${pages.map((page, pageIndex) => `
          <section class="flip-page ${pageIndex === 0 ? "active" : ""}" data-page="${pageIndex}">
            ${page.map((card) => `
              <article class="soft-panel p-4">
                <div class="flex items-start justify-between gap-2">
                  <button class="arabic text-5xl" data-say="${escapeHtml(card.ar)}">${escapeHtml(card.ar)}</button>
                  <button class="speaker-btn" data-say="${escapeHtml(card.ar)}">🔊</button>
                </div>
                <p class="mt-2 font-bold">${escapeHtml(card.pl)}</p>
                <p class="text-sm text-[var(--muted)]">${escapeHtml(card.tr)}</p>
                <button class="mt-3 rounded-lg bg-amber-500 px-3 py-2 text-sm font-black text-white" data-add-word="${escapeHtml(card.ar)}" data-back="${escapeHtml(`${card.pl} - ${card.tr}`)}">${tx("Dodaj do fiszek", "Add to flashcards")}</button>
              </article>
            `).join("")}
          </section>
        `).join("")}
      </div>
    </div>
  `;
  $("#pdfViewer").querySelectorAll("[data-say]").forEach((button) => button.addEventListener("click", () => speakArabic(button.dataset.say)));
  $("#pdfViewer").querySelectorAll("[data-add-word]").forEach((button) => button.addEventListener("click", () => {
    addSingleFlashcard(button.dataset.addWord, button.dataset.back, "PDF");
    confetti();
  }));
  bindFlipbook(pages.length);
}

function bindFlipbook(totalPages) {
  let current = 0;
  const root = $("#pdfViewer");
  const show = () => {
    root.querySelectorAll(".flip-page").forEach((page) => page.classList.toggle("active", Number(page.dataset.page) === current));
    root.querySelector("[data-page-current]").textContent = current + 1;
  };
  root.querySelector("[data-page-prev]").addEventListener("click", () => {
    current = Math.max(0, current - 1);
    show();
  });
  root.querySelector("[data-page-next]").addEventListener("click", () => {
    current = Math.min(Math.max(0, totalPages - 1), current + 1);
    show();
  });
}

function addSingleFlashcard(front, back, hint = "AI") {
  state.customFlashcards.unshift({ id: `custom-${crypto.randomUUID()}`, front, back, hint });
  saveState();
}

function saveInteractiveBook(title, text) {
  const cards = [];
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  for (let i = 0; i < lines.length - 1; i++) {
    const isAr = /[؀-ۿ]/.test(lines[i]);
    const nextNoAr = !/[؀-ۿ]/.test(lines[i + 1]) && lines[i + 1].length > 2;
    if (isAr && nextNoAr) {
      cards.push({ ar: lines[i], pl: lines[i + 1], tr: "" });
      i++;
    }
  }

  if (cards.length < 3) {
    lines.filter(l => /[؀-ۿ]/.test(l)).slice(0, 16).forEach((arLine, idx) => {
      const plLine = lines.find(l => !(/[؀-ۿ]/.test(l)) && l.length > 5) || `${tx("Strona", "Page")} ${idx + 1}`;
      cards.push({ ar: arLine, pl: plLine, tr: "" });
    });
  }

  if (cards.length < 1) {
    text.split(/[.!?\n]+/).filter(Boolean).slice(0, 10).forEach((line, idx) => {
      cards.push({ ar: words[idx % words.length].ar, pl: line.trim(), tr: words[idx % words.length].tr });
    });
  }

  state.interactiveBooks.unshift({ id: crypto.randomUUID(), title, rawText: text, cards });
  saveState();
}

function readFileAsDataUrl(file, callback) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

function culture() {
  const todayFact = state.cultureFacts.find((item) => item.date === today());
  const hasToday = !!todayFact;
  const btnClass = hasToday
    ? "big-action border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] cursor-not-allowed"
    : "big-action bg-emerald-500 text-white";
  const btnLabel = hasToday ? tx("✓ Wygenerowano dziś", "✓ Generated today") : tx("Generuj AI", "Generate AI");
  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Kultura i ciekawostki", "Culture and facts")}</h1>
      <p class="text-[var(--muted)]">${tx("Ciekawostki dnia o arabskim, islamie i codziennych zwyczajach.", "Daily facts about Arabic, Islam and everyday customs.")}</p>
    </div>
    <section class="panel p-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm font-bold text-emerald-600">${tx("Ciekawostka dnia", "Fact of the day")}</p>
          <!-- SECURITY: escaped AI output -->
          <h2 class="text-2xl font-black">${todayFact ? escapeHtml(todayFact.title) : tx("Brak ciekawostki na dzis", "No fact for today yet")}</h2>
        </div>
        <button id="generateCultureBtn" class="${btnClass}" ${hasToday ? "disabled" : ""}>${btnLabel}</button>
      </div>
      <!-- SECURITY: escaped AI output -->
      <p class="mt-4 whitespace-pre-wrap text-[var(--muted)]">${todayFact ? escapeHtml(todayFact.text) : tx("AI przygotuje krótką ciekawostkę z mini-słówkiem arabskim. Jedna ciekawostka na dzień.", "AI will prepare a short fact with an Arabic mini-word. One fact per day.")}</p>
    </section>
    <div class="mt-4 grid gap-3 sm:grid-cols-2">
      ${state.cultureFacts.slice(0, 10).map((item) => `
        <article class="soft-panel p-4">
          <p class="text-xs font-bold text-[var(--muted)]">${item.date}</p>
          <!-- SECURITY: escaped AI output -->
          <h3 class="mt-1 font-black">${escapeHtml(item.title)}</h3>
          <!-- SECURITY: escaped AI output -->
          <p class="mt-2 text-sm text-[var(--muted)]">${escapeHtml(item.text)}</p>
        </article>
      `).join("")}
    </div>
  `;
  if (!hasToday) {
    $("#generateCultureBtn").addEventListener("click", generateCultureFact);
  }
}

async function generateCultureFact() {
  const button = $("#generateCultureBtn");
  if (!button || button.disabled) return;
  button.textContent = tx("Myślę...", "Thinking...");
  button.disabled = true;
  try {
    const prevTitles = state.cultureFacts.slice(0, 15).map(f => f.title).filter(Boolean);
    const avoidNote = prevTitles.length
      ? tx(
          `NIE powtarzaj tematów: ${prevTitles.join(', ')}. Wybierz zupełnie inny temat.`,
          `Do NOT repeat these topics: ${prevTitles.join(', ')}. Choose a completely different topic.`
        )
      : '';
    const prompt = tx(
      `Napisz JEDNĄ krótką ciekawostkę (2-4 zdania) o kulturze arabskiej, islamie lub Indonezji. NIE generuj listy fiszek. NIE używaj nagłówków. ${avoidNote}
Format odpowiedzi:
TYTUŁ: [krótki tytuł 3-5 słów]
FAKT: [2-4 zdania ciekawostki]
SŁOWO: [jedno arabskie słowo]
WYMOWA: [transliteracja]
ZNACZENIE: [polskie tłumaczenie]`,
      `Write ONE short culture fact (2-4 sentences) about Arabic culture or Islam. Do NOT generate flashcard lists. Do NOT use headers. ${avoidNote}
Response format:
TITLE: [short title 3-5 words]
FACT: [2-4 sentences]
WORD: [one Arabic word]
PRONUNCIATION: [transliteration]
MEANING: [English translation]`
    );
    const text = await askGroq([{ role: "user", content: prompt }]);
    const titleMatch = text.match(/(?:TYTUŁ|TITLE):\s*(.+)/i);
    const factMatch = text.match(/(?:FAKT|FACT):\s*([\s\S]+?)(?:\n(?:SŁOWO|WORD):|\n\n|$)/i);
    const wordMatch = text.match(/(?:SŁOWO|WORD):\s*(.+)/i);
    const pronMatch = text.match(/(?:WYMOWA|PRONUNCIATION):\s*(.+)/i);
    const meaningMatch = text.match(/(?:ZNACZENIE|MEANING):\s*(.+)/i);
    const title = titleMatch?.[1]?.trim() || tx(`Ciekawostka ${new Date().toLocaleDateString(localeTag())}`, `Fact ${new Date().toLocaleDateString(localeTag())}`);
    const fact = factMatch?.[1]?.trim() || text.slice(0, 400);
    const word = wordMatch?.[1]?.trim() || "";
    const pron = pronMatch?.[1]?.trim() || "";
    const meaning = meaningMatch?.[1]?.trim() || "";
    const formatted = fact + (word ? `

🔤 ${word} (${pron}) — ${meaning}` : "");
    state.cultureFacts.unshift({ id: crypto.randomUUID(), date: today(), title, text: formatted });
    saveState();
    culture();
  } catch {
    button.textContent = tx("Błąd AI", "AI error");
  }
}

function games() {
  if (state.activeGame) {
    const containerMap = {
      quiz:        '<div id="quizBox" class="panel p-5"></div>',
      memory:      '<div id="memoryBox" class="panel p-5"></div>',
      dhikrGame:   '<div id="dhikrGameBox" class="panel p-5"></div>',
      surahQuiz:   '<div id="surahQuizBox" class="panel p-5"></div>',
      pillarsQuiz: '<div id="pillarsQuizBox" class="panel p-5"></div>',
      asmaChallenge: '<div id="asmaChallengeBox" class="panel p-5"></div>',
      aiQuiz:      '<div id="aiQuizBox" class="panel p-5"></div>',
      quizHub:     '<div id="quizHubBox"></div>',
    };
    const directMap = {
      flashcards: flashcardsView,
      speech:     speechView,
      writing:    writingView,
    };
    if (containerMap[state.activeGame]) {
      view.innerHTML = containerMap[state.activeGame];
      const renderers = { quiz: renderQuiz, memory: renderMemory, dhikrGame: renderDhikrGame, surahQuiz: renderSurahQuiz, pillarsQuiz: renderPillarsQuiz, asmaChallenge: renderAsmaChallenge, aiQuiz: renderAiQuiz, quizHub: renderQuizHub };
      (renderers[state.activeGame] || (() => {}))();
    } else if (directMap[state.activeGame]) {
      directMap[state.activeGame]();
    } else {
      state.activeGame = null;
      saveState();
      games();
      return;
    }
    const backBtn = document.createElement("button");
    backBtn.className = "flex items-center gap-2 text-[var(--muted)] mb-4 text-sm font-bold active:scale-95 transition-transform";
    backBtn.innerHTML = `← ${tx("Powrót do gier", "Back to games")}`;
    backBtn.addEventListener("click", () => {
      state.activeGame = null;
      saveState();
      games();
    });
    view.insertBefore(backBtn, view.firstChild);
    return;
  }

  const tiles = [
    { id: "quizHub",     icon: "🎯", titlePl: "Quizy",         titleEn: "Quizzes",          descPl: "Wszystkie quizy w jednym miejscu", descEn: "All quizzes in one place" },
    { id: "memory",      icon: "🃏", titlePl: "Memory Match",  titleEn: "Memory Match",     descPl: "Dopasuj pary liter i nazw", descEn: "Match letter pairs" },
    { id: "dhikrGame",   icon: "📿", titlePl: "Szybki Dhikr",  titleEn: "Dhikr Speed",      descPl: "Liczymy razem — subhanallah", descEn: "Speed dhikr counting" },
    { id: "asmaChallenge", icon: "🕋", titlePl: "99 Imion Challenge", titleEn: "99 Names Challenge", descPl: "20 min: wpisz jak najwięcej imion Allaha", descEn: "20 min: type as many Names of Allah as possible" },
    { id: "flashcards",  icon: "▣",  titlePl: "Fiszki",        titleEn: "Flashcards",       descPl: "Powtórki metodą SM-2", descEn: "SM-2 spaced repetition" },
    { id: "speech",      icon: "🗣", titlePl: "Wymowa",        titleEn: "Pronunciation",    descPl: "Ćwicz wymowę arabską", descEn: "Practice Arabic pronunciation" },
    { id: "writing",     icon: "✎",  titlePl: "Pisanie",       titleEn: "Writing",          descPl: "Pisz arabskie litery", descEn: "Write Arabic letters" },
  ];

  const recentHistory = (state.gameHistory || []).slice(0, 5);

  view.innerHTML = `
    <div class="mb-5">
      <h1 class="text-3xl font-black">◎ ${tx("Gry i ćwiczenia", "Games & Practice")}</h1>
      <p class="text-[var(--muted)] mt-1">${tx("Wybierz aktywność", "Choose an activity")}</p>
    </div>
    <div class="grid gap-3 sm:grid-cols-2">
      ${tiles.map(tile => `
        <button class="islam-tile text-left" data-game="${tile.id}">
          <span class="islam-tile-icon">${tile.icon}</span>
          <div>
            <p class="islam-tile-title">${state.lang === "pl" ? tile.titlePl : tile.titleEn}</p>
            <p class="islam-tile-desc">${state.lang === "pl" ? tile.descPl : tile.descEn}</p>
          </div>
        </button>
      `).join("")}
    </div>
    ${recentHistory.length ? `
      <div class="mt-6">
        <h2 class="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-2">${tx("Ostatnie wyniki", "Recent results")}</h2>
        <div class="grid gap-1">
          ${recentHistory.map(h => `
            <div class="flex items-center justify-between text-sm text-[var(--muted)] px-1">
              <span>${h.game}</span>
              <span class="font-bold">${h.score !== undefined ? h.score + "/" + h.total : "✓"}</span>
              <span class="text-xs">${new Date(h.ts).toLocaleDateString(localeTag())}</span>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}
  `;

  view.querySelectorAll("[data-game]").forEach(btn => {
    btn.addEventListener("click", () => {
      state.activeGame = btn.dataset.game;
      saveState();
      games();
    });
  });
}

function flashcardsView() {
  flashcards();
}

function speechView() {
  speech();
}

function writingView() {
  writing();
}

function renderQuizHub() {
  const quizTiles = [
    { id: "quiz", icon: "Aa", titlePl: "Quiz liter", titleEn: "Letter Quiz", descPl: "Rozpoznaj arabską literę", descEn: "Identify the Arabic letter" },
    { id: "surahQuiz", icon: "📖", titlePl: "Quiz Surah", titleEn: "Surah Quiz", descPl: "Rozpoznaj krótkie sury", descEn: "Identify short surahs" },
    { id: "pillarsQuiz", icon: "⭐", titlePl: "Quiz Filarów", titleEn: "Pillars Quiz", descPl: "Filary islamu i imanu", descEn: "Pillars of Islam and Iman" },
    { id: "aiQuiz", icon: "AI", titlePl: "Quizy AI", titleEn: "AI Quizzes", descPl: "Generuj i rozwiązuj własne quizy", descEn: "Generate and play custom quizzes" }
  ];
  $("#quizHubBox").innerHTML = `
    <div class="mb-5">
      <h1 class="text-3xl font-black">${tx("Quizy", "Quizzes")}</h1>
      <p class="text-[var(--muted)] mt-1">${tx("Wybierz typ quizu. Quizy AI możesz tworzyć od razu w środku.", "Choose a quiz type. You can create AI quizzes inside.")}</p>
    </div>
    <div class="grid gap-3 sm:grid-cols-2">
      ${quizTiles.map(tile => `
        <button class="islam-tile text-left" data-quiz-game="${tile.id}">
          <span class="islam-tile-icon">${tile.icon}</span>
          <div>
            <p class="islam-tile-title">${state.lang === "pl" ? tile.titlePl : tile.titleEn}</p>
            <p class="islam-tile-desc">${state.lang === "pl" ? tile.descPl : tile.descEn}</p>
          </div>
        </button>
      `).join("")}
    </div>
  `;
  $("#quizHubBox").querySelectorAll("[data-quiz-game]").forEach(button => {
    button.addEventListener("click", () => {
      state.activeGame = button.dataset.quizGame;
      saveState();
      games();
    });
  });
}

function renderQuiz() {
  const correct = arabicAlphabet[Math.floor(Math.random() * arabicAlphabet.length)];
  const choices = [correct, ...arabicAlphabet.filter((letter) => letter.id !== correct.id).sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
  $("#quizBox").innerHTML = `
    <h2 class="text-2xl font-black">Quiz</h2>
    <p class="mt-2 text-[var(--muted)]">${tx("Ktora to litera?", "Which letter is this?")}</p>
    <p class="mt-2 text-sm font-bold text-[var(--muted)]">${t("correct")}: ${state.quizStats.correct} · ${t("wrong")}: ${state.quizStats.wrong}</p>
    <p class="arabic my-4 text-center text-7xl">${escapeHtml(correct.forms.isolated)}</p>
    <button class="big-action mb-4 w-full bg-amber-500 text-white" data-say="${escapeHtml(correct.forms.isolated)}">🔊 ${t("play")}</button>
    <div class="grid gap-2">
      ${choices.map((choice) => `<button class="big-action border border-[var(--line)] bg-[var(--surface)]" data-answer="${choice.id}">${escapeHtml(letterName(choice))}</button>`).join("")}
    </div>
    <div class="mt-4">
      <h3 class="font-black">${t("history")}</h3>
      <div class="mt-2 grid gap-1 text-sm text-[var(--muted)]">
        ${state.quizHistory.slice(0, 5).map((item) => `<p>${item.ok ? t("correct") : t("wrong")} · ${escapeHtml(item.letter)} · ${new Date(item.date).toLocaleTimeString(localeTag())}</p>`).join("") || `<p>${tx("Brak prob.", "No attempts yet.")}</p>`}
      </div>
    </div>
  `;
  $("#quizBox").querySelector("[data-say]").addEventListener("click", () => speakArabic(correct.forms.isolated));
  $("#quizBox").querySelectorAll("[data-answer]").forEach((button) => button.addEventListener("click", () => {
    if (button.dataset.answer === correct.id) {
      button.className = "big-action bg-emerald-500 text-white";
      state.quizStats.correct += 1;
      updateReviewMistake(`quiz:${correct.id}`, true);
      state.quizHistory.unshift({ ok: true, letter: correct.forms.isolated, date: new Date().toISOString() });
      state.quizHistory = state.quizHistory.slice(0, 20);
      state.points += 10;
      saveState();
      checkBadges();
      confetti();
      setTimeout(renderQuiz, 650);
    } else {
      button.className = "big-action bg-red-500 text-white";
      state.quizStats.wrong += 1;
      updateReviewMistake(`quiz:${correct.id}`, false);
      state.quizHistory.unshift({ ok: false, letter: correct.forms.isolated, date: new Date().toISOString() });
      state.quizHistory = state.quizHistory.slice(0, 20);
      saveState();
    }
  }));
}

function renderMemory() {
  const letters = [...arabicAlphabet].sort(() => Math.random() - 0.5).slice(0, 12);
  const cards = letters.flatMap((letter) => [
    { key: letter.id, label: letter.forms.isolated, sound: letter.forms.isolated, type: "ar", matched: false },
    { key: letter.id, label: letterName(letter), sound: letter.forms.isolated, type: "pl", matched: false }
  ]);
  cards.push({ key: "bonus", label: "★", sound: "سلام", type: "bonus", matched: true });
  cards.sort(() => Math.random() - 0.5);
  let first = null;
  let locked = false;
  let matched = 0;
  $("#memoryBox").innerHTML = `
    <div class="flex items-center justify-between gap-3">
      <h2 class="text-2xl font-black">Memory Match</h2>
      <button id="restartMemory" class="rounded-lg border border-[var(--line)] px-3 py-2 font-bold">${tx("Od nowa", "Restart")}</button>
    </div>
    <p class="mt-2 text-[var(--muted)]">${tx("Polacz litere z nazwa.", "Match the letter with its name.")} ${t("record")}: ${state.memoryBest}</p>
    <p class="mt-1 text-sm font-bold text-[var(--muted)]">${t("correct")}: ${state.memoryStats.correct} · ${t("wrong")}: ${state.memoryStats.wrong}</p>
    <div class="mt-4 grid grid-cols-4 sm:grid-cols-5 gap-2">
      ${cards.map((card, index) => `<button class="memory-card text-sm sm:text-base ${card.key === "bonus" ? "matched" : ""}" data-index="${index}" data-key="${card.key}" data-label="${card.label}" data-sound="${card.sound}">${card.key === "bonus" ? "★" : "?"}</button>`).join("")}
    </div>
  `;
  $("#restartMemory").addEventListener("click", renderMemory);
  $("#memoryBox").querySelectorAll(".memory-card").forEach((button) => button.addEventListener("click", () => {
    if (locked || button.classList.contains("matched") || button.textContent !== "?") return;
    button.textContent = button.dataset.label;
    speakArabic(button.dataset.sound);
    button.classList.toggle("arabic", /[\u0600-\u06FF]/.test(button.dataset.label));
    if (!first) {
      first = button;
      return;
    }
    if (first.dataset.key === button.dataset.key && first !== button) {
      first.classList.add("matched");
      button.classList.add("matched");
      state.memoryStats.correct += 1;
      updateReviewMistake(`memory:${button.dataset.key}`, true);
      saveState();
      matched += 1;
      first = null;
      if (matched === letters.length) {
        state.points += 25;
        state.memoryBest = Math.max(state.memoryBest, state.points);
        saveState();
        confetti();
      }
      return;
    }
    state.memoryStats.wrong += 1;
    updateReviewMistake(`memory:${first.dataset.key}`, false);
    saveState();
    locked = true;
    setTimeout(() => {
      first.textContent = "?";
      button.textContent = "?";
      first.classList.remove("arabic");
      button.classList.remove("arabic");
      first = null;
      locked = false;
    }, 800);
  }));
}

function renderPillarsQuiz() {
  const allPillars = [
    ...pillarsOfIslam.map(p => ({ ...p, kind: "islam", category: tx("Filary Islamu", "Pillars of Islam") })),
    ...pillarsOfIman.map(p => ({ ...p, kind: "iman", category: tx("Filary Imanu", "Pillars of Iman") }))
  ];
  const correct = allPillars[Math.floor(Math.random() * allPillars.length)];
  const others = allPillars.filter(p => !(p.n === correct.n && p.kind === correct.kind));
  const choices = [correct, ...others.sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
  const correctLabel = state.lang === "pl" ? correct.pl : correct.en;

  $("#pillarsQuizBox").innerHTML = `
    <h2 class="text-2xl font-black">${t("pillarsQuiz")}</h2>
    <p class="mt-1 text-[var(--muted)] text-sm">${t("pillarsQuizDesc")}</p>
    <p class="mt-2 text-sm font-bold text-[var(--muted)]">${t("correct")}: ${state.pillarsQuizStats.correct} · ${t("wrong")}: ${state.pillarsQuizStats.wrong}</p>
    <div class="my-5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 p-4 text-center">
      <p class="arabic text-3xl text-amber-700 mb-1">${escapeHtml(correct.ar)}</p>
      <p class="text-xs text-[var(--muted)]">${escapeHtml(correct.tr)} · ${correct.category}</p>
    </div>
    <div class="grid gap-2">
      ${choices.map(c => `<button class="big-action border border-[var(--line)] bg-[var(--surface)]" data-pillar-id="${c.kind}-${c.n}">${escapeHtml(state.lang === "pl" ? c.pl : c.en)}</button>`).join("")}
    </div>
    <div class="mt-4">
      <h3 class="font-black text-sm">${t("history")}</h3>
      <div class="mt-2 grid gap-1 text-sm text-[var(--muted)]">
        ${state.pillarsQuizHistory.slice(0, 5).map(item => `<p>${item.ok ? t("correct") : t("wrong")} · ${escapeHtml(item.name)} · ${new Date(item.date).toLocaleTimeString(localeTag())}</p>`).join("") || `<p>${tx("Brak prób.", "No attempts yet.")}</p>`}
      </div>
    </div>
  `;

  const correctKey = `${correct.kind}-${correct.n}`;
  $("#pillarsQuizBox").querySelectorAll("[data-pillar-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.pillarId === correctKey) {
        btn.className = "big-action bg-emerald-500 text-white";
        state.pillarsQuizStats.correct += 1;
        updateReviewMistake(`pillars:${correctKey}`, true);
        state.pillarsQuizHistory.unshift({ ok: true, name: correctLabel, date: new Date().toISOString() });
        state.pillarsQuizHistory = state.pillarsQuizHistory.slice(0, 20);
        state.points += 15;
        saveState();
        checkBadges();
        confetti();
        setTimeout(renderPillarsQuiz, 650);
      } else {
        btn.className = "big-action bg-red-500 text-white";
        state.pillarsQuizStats.wrong += 1;
        updateReviewMistake(`pillars:${correctKey}`, false);
        state.pillarsQuizHistory.unshift({ ok: false, name: correctLabel, date: new Date().toISOString() });
        state.pillarsQuizHistory = state.pillarsQuizHistory.slice(0, 20);
        saveState();
      }
    });
  });
}

function renderSurahQuiz() {
  const pool = SURAH_LIST.filter(s => s.number >= 78);
  const correct = pool[Math.floor(Math.random() * pool.length)];
  const others = SURAH_LIST.filter(s => s.number !== correct.number);
  const choices = [correct, ...others.sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
  const streak = state.surahQuizBest;

  const poolStart = 78;
  const poolEnd = 114;
  const scopeDesc = `${tx("Rozpoznaj arabskie nazwy sur", "Identify Arabic surah names")} ${poolStart}-${poolEnd} (${pool.length} ${tx("sur", "surahs")})`;

  $("#surahQuizBox").innerHTML = `
    <div class="flex flex-wrap items-center gap-2">
      <h2 class="text-2xl font-black">${t("surahQuiz")}</h2>
      <span class="trust-badge verified">${tx("Sury", "Surahs")} ${poolStart}-${poolEnd}</span>
    </div>
    <p class="mt-1 text-[var(--muted)] text-sm">${scopeDesc}</p>
    <p class="mt-2 text-sm font-bold text-[var(--muted)]">${t("correct")}: ${state.surahQuizStats.correct} · ${t("wrong")}: ${state.surahQuizStats.wrong} · ${t("record")}: ${streak}</p>
    <p class="surah-quiz-name">${escapeHtml(correct.arName)}</p>
    <p class="text-center text-xs text-[var(--muted)] -mt-2 mb-4">${tx("Sura", "Surah")} ${correct.number}</p>
    <div class="grid gap-2">
      ${choices.map(c => `<button class="big-action border border-[var(--line)] bg-[var(--surface)]" data-surah-num="${c.number}">${escapeHtml(c.meaning)} (${escapeHtml(c.enName)})</button>`).join("")}
    </div>
    <div class="mt-4">
      <h3 class="font-black text-sm">${t("history")}</h3>
      <div class="mt-2 grid gap-1 text-sm text-[var(--muted)]">
        ${state.surahQuizHistory.slice(0, 5).map(item => `<p>${item.ok ? t("correct") : t("wrong")} · ${escapeHtml(item.name)} · ${new Date(item.date).toLocaleTimeString(localeTag())}</p>`).join("") || `<p>${tx("Brak prób.", "No attempts yet.")}</p>`}
      </div>
    </div>
  `;

  let currentStreak = 0;
  $("#surahQuizBox").querySelectorAll("[data-surah-num]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (parseInt(btn.dataset.surahNum) === correct.number) {
        btn.className = "big-action bg-emerald-500 text-white";
        state.surahQuizStats.correct += 1;
        updateReviewMistake(`surah:${correct.number}`, true);
        currentStreak += 1;
        if (currentStreak > state.surahQuizBest) { state.surahQuizBest = currentStreak; }
        state.surahQuizHistory.unshift({ ok: true, name: correct.arName, date: new Date().toISOString() });
        state.surahQuizHistory = state.surahQuizHistory.slice(0, 20);
        state.points += 20;
        saveState();
        checkBadges();
        confetti();
        setTimeout(renderSurahQuiz, 650);
      } else {
        btn.className = "big-action bg-red-500 text-white";
        state.surahQuizStats.wrong += 1;
        updateReviewMistake(`surah:${correct.number}`, false);
        currentStreak = 0;
        state.surahQuizHistory.unshift({ ok: false, name: correct.arName, date: new Date().toISOString() });
        state.surahQuizHistory = state.surahQuizHistory.slice(0, 20);
        saveState();
      }
    });
  });
}

const DHIKR_PHRASES = [
  { ar: "سُبْحَانَ اللَّهِ", tr: "Subhanallah", pl: "Chwała Allahowi", en: "Glory be to Allah" },
  { ar: "الْحَمْدُ لِلَّهِ", tr: "Alhamdulillah", pl: "Chwała Allahowi (dziękczynienie)", en: "All praise to Allah" },
  { ar: "اللَّهُ أَكْبَر", tr: "Allahu Akbar", pl: "Allah jest Największy", en: "Allah is the Greatest" }
];

function renderDhikrGame() {
  const phrase = DHIKR_PHRASES[Math.floor(Math.random() * DHIKR_PHRASES.length)];
  let count = 0;
  let startTime = null;
  let elapsed = 0;
  const TARGET = 33;

  const bestText = state.dhikrGameBest !== null
    ? `${t("record")}: ${state.dhikrGameBest.toFixed(1)}s`
    : tx("Brak rekordu", "No record yet");

  $("#dhikrGameBox").innerHTML = `
    <h2 class="text-2xl font-black">${t("dhikrGame")}</h2>
    <p class="mt-1 text-[var(--muted)] text-sm">${t("dhikrGameDesc")}</p>
    <p class="mt-2 text-sm font-bold text-[var(--muted)]">${bestText}</p>
    <div class="mt-5 flex flex-col items-center gap-4">
      <div class="dhikr-ring" id="dhikrRing">
        <div class="dhikr-ring-inner" id="dhikrCount">0</div>
      </div>
      <button class="dhikr-game-btn" id="dhikrBtn">
        <span class="arabic text-2xl">${escapeHtml(phrase.ar)}</span>
        <span class="text-xs mt-1 opacity-80">${escapeHtml(phrase.tr)}</span>
      </button>
      <p class="text-sm text-[var(--muted)]">${state.lang === "pl" ? phrase.pl : phrase.en}</p>
      <p id="dhikrTimer" class="text-2xl font-black tabular-nums">0.0s</p>
    </div>
    <div class="mt-4">
      <h3 class="font-black text-sm">${t("history")}</h3>
      <div class="mt-2 grid gap-1 text-sm text-[var(--muted)]" id="dhikrHistory">
        ${state.dhikrGameHistory.slice(0, 5).map(item => `<p>${escapeHtml(item.phrase)} · ${item.seconds.toFixed(1)}s · ${new Date(item.date).toLocaleTimeString(localeTag())}</p>`).join("") || `<p>${tx("Brak prób.", "No attempts yet.")}</p>`}
      </div>
    </div>
  `;

  const btn = $("#dhikrGameBox #dhikrBtn");
  const countEl = $("#dhikrGameBox #dhikrCount");
  const ringEl = $("#dhikrGameBox #dhikrRing");
  const timerEl = $("#dhikrGameBox #dhikrTimer");

  btn.addEventListener("click", () => {
    if (count === 0) {
      startTime = Date.now();
      if (dhikrGameTimer) clearInterval(dhikrGameTimer);
      dhikrGameTimer = setInterval(() => {
        elapsed = (Date.now() - startTime) / 1000;
        if (timerEl) timerEl.textContent = elapsed.toFixed(1) + "s";
      }, 100);
    }
    if (count >= TARGET) return;
    count += 1;
    countEl.textContent = count;
    const pct = (count / TARGET) * 100;
    ringEl.style.background = `conic-gradient(var(--accent) ${pct}%, var(--line) ${pct}%)`;

    if (count >= TARGET) {
      clearInterval(dhikrGameTimer);
      dhikrGameTimer = null;
      const seconds = (Date.now() - startTime) / 1000;
      const pts = Math.max(5, Math.round(100 / seconds * TARGET));
      if (state.dhikrGameBest === null || seconds < state.dhikrGameBest) {
        state.dhikrGameBest = seconds;
      }
      state.dhikrGameHistory.unshift({ phrase: phrase.tr, seconds, date: new Date().toISOString() });
      state.dhikrGameHistory = state.dhikrGameHistory.slice(0, 20);
      state.points += pts;
      saveState();
      confetti();
      btn.textContent = `${seconds.toFixed(1)}s — +${pts} ${t("points")}`;
      btn.disabled = true;
      setTimeout(renderDhikrGame, 2000);
    }
  });
}

function normalizeNameInput(s) {
  const cleaned = (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ł/g, "l")
    .replace(/[^a-z0-9]/g, "");
  return cleaned.replace(/^(allah|ash|adh|ath|al|ar|as|at|ad|an|az)/, "");
}

function normalizeCardKey(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f\u064B-\u0652]/g, "")
    .replace(/\s+/g, "")
    .trim();
}

function editDistanceWithin(input, target, maxEdits) {
  if (Math.abs(input.length - target.length) > maxEdits) return false;
  const row = Array.from({ length: target.length + 1 }, (_, index) => index);
  for (let i = 1; i <= input.length; i += 1) {
    let diagonal = row[0];
    row[0] = i;
    let rowMin = row[0];
    for (let j = 1; j <= target.length; j += 1) {
      const old = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (input[i - 1] === target[j - 1] ? 0 : 1));
      diagonal = old;
      rowMin = Math.min(rowMin, row[j]);
    }
    if (rowMin > maxEdits) return false;
  }
  return row[target.length] <= maxEdits;
}

function isCloseEnoughName(input, target) {
  if (!input || !target) return false;
  if (input === target) return true;
  return editDistanceWithin(input, target, target.length >= 7 ? 2 : 1);
}

function asmaChallengeAliases(name) {
  const meaningParts = [...String(name.en || "").split("/"), ...String(name.pl || "").split("/")];
  const meaningWords = meaningParts.flatMap(part => String(part).split(/[\s,;()]+/));
  return [...new Set([name.tr, name.en, name.pl, ...meaningParts, ...meaningWords].map(normalizeNameInput).filter(Boolean))];
}

let currentAiQuiz = null;
let currentAiQuestionIndex = 0;
let aiQuizScore = 0;

function renderAiQuiz() {
  const box = $("#aiQuizBox");
  if (!box) return;
  const quizzes = state.aiQuizzes || [];
  const suggestions = AI_TOPIC_SUGGESTIONS.quiz.map(topic => state.lang === "pl" ? topic.pl : topic.en);

  if (!quizzes.length) {
    box.innerHTML = `
      <div class="text-center py-8">
        <h2 class="text-2xl font-black mb-2">${tx("Brak Quizów AI", "No AI Quizzes")}</h2>
        <p class="text-[var(--muted)] mb-4">${tx("Wygeneruj krótki quiz tutaj albo zapisz quiz z AI Assistant.", "Generate a short quiz here or save one from AI Assistant.")}</p>
        ${aiQuizGeneratorHtml(suggestions)}
      </div>
    `;
    bindAiQuizGenerator(box);
    return;
  }

  if (!currentAiQuiz) {
    box.innerHTML = `
      <h2 class="text-2xl font-black mb-4">${tx("Twoje Quizy AI", "Your AI Quizzes")}</h2>
      ${aiQuizGeneratorHtml(suggestions)}
      <div class="grid gap-3">
        ${quizzes.map((quiz, index) => `
          <button class="panel p-4 text-left flex items-center justify-between gap-3" data-ai-quiz-index="${index}">
            <div>
              <p class="font-black">${escapeHtml(quiz.title)}</p>
              <p class="text-xs text-[var(--muted)]">${quiz.questions.length} ${tx("pytań", "questions")}</p>
            </div>
            <span class="text-xl">&gt;</span>
          </button>
        `).join("")}
      </div>
    `;
    bindAiQuizGenerator(box);
    box.querySelectorAll("[data-ai-quiz-index]").forEach(button => {
      button.addEventListener("click", () => startAiQuiz(Number(button.dataset.aiQuizIndex)));
    });
    return;
  }

  const question = currentAiQuiz.questions[currentAiQuestionIndex];
  box.innerHTML = `
    <div class="flex items-center justify-between gap-3 mb-4">
      <h2 class="text-xl font-black">${escapeHtml(currentAiQuiz.title)}</h2>
      <span class="font-bold">${currentAiQuestionIndex + 1} / ${currentAiQuiz.questions.length}</span>
    </div>
    <div class="panel p-6 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 mb-4">
      <p class="text-lg font-bold text-center">${escapeHtml(question.question)}</p>
    </div>
    <div class="grid gap-2">
      ${question.options.map((option, index) => `
        <button class="big-action border border-[var(--line)] bg-[var(--surface)] text-left px-4" data-ai-answer="${index}">
          ${escapeHtml(option)}
        </button>
      `).join("")}
    </div>
  `;
  box.querySelectorAll("[data-ai-answer]").forEach(button => {
    button.addEventListener("click", () => checkAiQuizAnswer(Number(button.dataset.aiAnswer)));
  });
}

function aiQuizGeneratorHtml(suggestions) {
  return `
    <div class="panel p-4 mb-4 text-left">
      <label class="text-xs font-black uppercase text-[var(--muted)]" for="aiQuizTopic">${tx("Temat quizu", "Quiz topic")}</label>
      <div class="mt-2 flex flex-col gap-2 sm:flex-row">
        <input id="aiQuizTopic" class="min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 h-11" maxlength="80" placeholder="${tx("np. wudu, filary islamu, alfabet", "e.g. wudu, pillars, alphabet")}" />
        <button class="big-action bg-emerald-500 text-white" data-generate-ai-quiz>${tx("Generuj quiz", "Generate quiz")}</button>
      </div>
      <div class="mt-3 flex flex-wrap gap-2">
        ${suggestions.map(topic => `<button class="ai-topic-chip" data-fill-ai-quiz-topic="${escapeHtml(topic)}">${escapeHtml(topic)}</button>`).join("")}
      </div>
    </div>
  `;
}

function bindAiQuizGenerator(root) {
  root.querySelectorAll("[data-fill-ai-quiz-topic]").forEach(button => {
    button.addEventListener("click", () => {
      root.querySelector("#aiQuizTopic").value = button.dataset.fillAiQuizTopic;
    });
  });
  root.querySelector("[data-generate-ai-quiz]")?.addEventListener("click", () => generateAiQuizFromTopic(root));
}

async function generateAiQuizFromTopic(root) {
  const topic = root.querySelector("#aiQuizTopic")?.value.trim();
  if (!topic) {
    showToast(tx("Wpisz temat quizu.", "Enter a quiz topic."));
    return;
  }
  const aiCheck = canUseAi();
  if (!aiCheck.ok) {
    showToast(aiCheck.reason);
    return;
  }
  const button = root.querySelector("[data-generate-ai-quiz]");
  button.disabled = true;
  button.textContent = tx("Generuję...", "Generating...");
  recordAiUse();
  try {
    const prompt = aiPromptForTopic("quiz", topic);
    const text = await askGroq([
      { role: "system", content: existingAiCreationContext() },
      { role: "user", content: prompt }
    ]);
    if (addAiQuiz(text, topic)) renderAiQuiz();
  } catch {
    showToast(tx("Nie udało się wygenerować quizu.", "Could not generate quiz."));
  } finally {
    button.disabled = false;
    button.textContent = tx("Generuj quiz", "Generate quiz");
  }
}

function startAiQuiz(index) {
  currentAiQuiz = state.aiQuizzes[index];
  currentAiQuestionIndex = 0;
  aiQuizScore = 0;
  renderAiQuiz();
}

function checkAiQuizAnswer(index) {
  const question = currentAiQuiz?.questions?.[currentAiQuestionIndex];
  if (!question) return;
  const buttons = $("#aiQuizBox").querySelectorAll("[data-ai-answer]");
  buttons.forEach(button => { button.disabled = true; });

  if (index === question.correctIndex) {
    buttons[index].className = "big-action bg-emerald-500 text-white text-left px-4";
    aiQuizScore += 1;
    confetti();
  } else {
    buttons[index].className = "big-action bg-red-500 text-white text-left px-4";
    buttons[question.correctIndex].className = "big-action bg-emerald-500 text-white text-left px-4";
  }

  setTimeout(() => {
    currentAiQuestionIndex += 1;
    if (currentAiQuestionIndex < currentAiQuiz.questions.length) renderAiQuiz();
    else finishAiQuiz();
  }, 900);
}

function finishAiQuiz() {
  const box = $("#aiQuizBox");
  const finalScore = aiQuizScore;
  const total = currentAiQuiz.questions.length;
  const title = currentAiQuiz.title;

  state.points += finalScore * 5;
  if (!state.gameHistory) state.gameHistory = [];
  state.gameHistory.unshift({ game: `AI Quiz: ${title}`, score: finalScore, total, ts: Date.now() });
  saveState();
  currentAiQuiz = null;

  box.innerHTML = `
    <div class="text-center py-8">
      <h2 class="text-3xl font-black mb-2">${tx("Koniec Quizu!", "Quiz Finished!")}</h2>
      <p class="text-xl mb-4">${tx("Twój wynik", "Your score")}: <span class="font-black text-emerald-600">${finalScore} / ${total}</span></p>
      <p class="text-[var(--muted)] mb-6">+${finalScore * 5} ${t("points")}</p>
      <button class="big-action bg-emerald-500 text-white w-full" data-reset-ai-quiz>${tx("Wróć do listy", "Back to list")}</button>
    </div>
  `;
  box.querySelector("[data-reset-ai-quiz]").addEventListener("click", renderAiQuiz);
}

function renderAsmaChallenge() {
  const DURATION = 20 * 60;
  const pool = asmaulHusna.map(name => ({
    id: normalizeNameInput(name.tr),
    label: name.tr,
    aliases: asmaChallengeAliases(name)
  }));
  const found = new Set();
  let secondsLeft = DURATION;
  let timer = null;

  $("#asmaChallengeBox").innerHTML = `
    <h2 class="text-2xl font-black">${tx("99 Imion Allaha — Challenge", "99 Names of Allah — Challenge")}</h2>
    <p class="text-sm text-[var(--muted)] mt-1">${tx("Masz 20 minut. Wpisuj transliteracje albo znaczenia po polsku/angielsku. Prefixy typu al-/ar- i drobne literówki są akceptowane.", "You have 20 minutes. Type transliterations or meanings in English/Polish. Prefixes like al-/ar- and small typos are accepted.")}</p>
    <p class="mt-2 font-black">${tx("Rekord", "Best")}: ${state.asmaChallengeBest || 0} / 99</p>
    <div class="mt-4 flex gap-2">
      <input id="asmaInput" class="flex-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 h-11" placeholder="${tx("rahman / miłosierny", "rahman / merciful")}" />
      <button id="asmaAdd" class="big-action bg-emerald-500 text-white">${tx("Dodaj", "Add")}</button>
    </div>
    <div class="mt-3 flex items-center justify-between">
      <p id="asmaTimer" class="font-mono text-lg font-black">20:00</p>
      <p id="asmaScore" class="font-black">0 / 99</p>
    </div>
    <div id="asmaFound" class="mt-3 text-xs text-[var(--muted)]"></div>
  `;
  const input = $("#asmaInput");
  const scoreEl = $("#asmaScore");
  const timerEl = $("#asmaTimer");
  const foundEl = $("#asmaFound");
  const finish = () => {
    if (timer) clearInterval(timer);
    const score = found.size;
    if (score > (state.asmaChallengeBest || 0)) state.asmaChallengeBest = score;
    state.asmaChallengeHistory.unshift({ score, date: new Date().toISOString() });
    state.asmaChallengeHistory = state.asmaChallengeHistory.slice(0, 20);
    saveState();
    showToast(`${tx("Wynik", "Score")}: ${score}/99`);
  };
  timer = setInterval(() => {
    secondsLeft -= 1;
    const m = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    const s = String(secondsLeft % 60).padStart(2, "0");
    timerEl.textContent = `${m}:${s}`;
    if (secondsLeft <= 0) finish();
  }, 1000);
  $("#asmaAdd").addEventListener("click", () => {
    const raw = input.value.trim();
    const q = normalizeNameInput(raw);
    if (!q) return;
    const match = pool.find(name => name.aliases.some(alias => isCloseEnoughName(q, alias)));
    if (match && !found.has(match.id)) {
      found.add(match.id);
      scoreEl.textContent = `${found.size} / 99`;
      foundEl.textContent = pool
        .filter(name => found.has(name.id))
        .slice(-12)
        .map(name => name.label)
        .join(", ");
      input.value = "";
    }
  });
}

function mountAiAssistant() {
  document.body.insertAdjacentHTML("beforeend", `
    <button id="aiFab" class="ai-fab" aria-label="Otwórz AI Assistant">
      <span class="text-2xl">✦</span>
      <span class="hidden font-black sm:inline">${t("aiAssistant")}</span>
    </button>
    <dialog id="aiDialog" class="ai-dialog">
      <div class="ai-card">
        <header class="ai-header">
          <div>
            <p class="text-xs font-bold text-amber-300">Alif AI <span id="aiStatus" class="ml-2 text-[10px] font-black uppercase"></span></p>
            <h2 class="text-xl font-black">${t("aiAssistant")}</h2>
          </div>
          <button id="closeAi" class="ai-close" aria-label="Zamknij">×</button>
        </header>
        <div id="aiMessages" class="ai-messages"></div>
        <div class="ai-quick-actions">
          <button class="ai-action-btn" data-ai-preset="flashcards">
            ${t("aiGenerateFlashcards")}
          </button>
          <button class="ai-action-btn" data-ai-preset="quiz">
            ${t("aiGenerateQuiz")}
          </button>
          <button class="ai-action-btn" data-ai-preset="islam">
            ${t("aiAskIslam")}
          </button>
        </div>
        <div id="aiTopicPanel" class="ai-topic-panel hidden"></div>
        <form id="aiForm" class="ai-form">
          <input id="aiInput" class="ai-input" maxlength="${AI_LIMITS.maxPromptLength}" placeholder="${t("aiPlaceholder")}" autocomplete="off" />
          <button class="ai-send" type="submit">${t("send")}</button>
        </form>
      </div>
    </dialog>
  `);
  const updateAiAvailability = () => {
    const fab = document.getElementById("aiFab");
    const status = document.getElementById("aiStatus");
    if (fab) {
      fab.style.opacity = navigator.onLine ? "1" : "0.5";
      fab.title = navigator.onLine ? "" : "AI wymaga połączenia z internetem";
    }
    if (status) {
      status.textContent = navigator.onLine ? tx("Online", "Online") : tx("Offline", "Offline");
      status.className = navigator.onLine ? "ml-2 text-[10px] font-black uppercase text-emerald-200" : "ml-2 text-[10px] font-black uppercase text-amber-200";
    }
  };
  window.addEventListener("online", updateAiAvailability);
  window.addEventListener("offline", updateAiAvailability);
  updateAiAvailability();
  $("#aiFab").addEventListener("click", openAiChat);
  $("#closeAi").addEventListener("click", () => $("#aiDialog").close());
  $("#aiForm").addEventListener("submit", sendAiMessage);
  document.querySelectorAll(".ai-action-btn").forEach(btn => {
    btn.addEventListener("click", () => renderAiTopicPanel(btn.dataset.aiPreset));
  });
}

function renderAiTopicPanel(kind) {
  const panel = $("#aiTopicPanel");
  const topics = AI_TOPIC_SUGGESTIONS[kind] || [];
  panel.classList.remove("hidden");
  panel.innerHTML = `
    <p class="ai-topic-title">${tx("Wybierz temat albo wpisz własny", "Choose a topic or type your own")}</p>
    <div class="ai-topic-list">
      ${topics.map(topic => `<button class="ai-topic-chip" data-ai-topic="${escapeHtml(state.lang === "pl" ? topic.pl : topic.en)}" data-ai-kind="${kind}">${escapeHtml(state.lang === "pl" ? topic.pl : topic.en)}</button>`).join("")}
    </div>
  `;
  panel.querySelectorAll("[data-ai-topic]").forEach(button => {
    button.addEventListener("click", () => {
      $("#aiInput").value = aiPromptForTopic(button.dataset.aiKind, button.dataset.aiTopic);
      $("#aiInput").focus();
    });
  });
}

function aiPromptForTopic(kind, topic) {
  if (kind === "flashcards") return tx(`Wygeneruj 5 nowych fiszek na temat: ${topic}. Nie powtarzaj fiszek, które już są w aplikacji.`, `Generate 5 new flashcards about: ${topic}. Do not repeat cards already in the app.`);
  if (kind === "quiz") return tx(`Zrób 4-pytaniowy quiz na temat: ${topic}. Użyj formatu QUIZ i nie powtarzaj istniejących quizów.`, `Create a 4-question quiz about: ${topic}. Use QUIZ format and do not repeat existing quizzes.`);
  return topic;
}

function openAiChat() {
  const dialog = $("#aiDialog");
  if (!state.aiMessages.length) {
    state.aiMessages.push({
      role: "assistant",
      content: t("aiHello")
    });
    saveState();
  }
  renderAiMessages();
  dialog.showModal();
  setTimeout(() => $("#aiInput")?.focus(), 80);
}

function renderAiMessages() {
  const box = $("#aiMessages");
  if (!box) return;
  box.textContent = "";
  state.aiMessages.forEach((message, index) => {
    const article = document.createElement("article");
    article.className = `ai-message ${message.role === "user" ? "user" : "assistant"}`;
    appendTextBlock(article, "p", "whitespace-pre-wrap", message.content);
    if (message.role === "assistant") {
      const actions = aiActionButtons(index);
      if (actions) article.insertAdjacentHTML("beforeend", actions);
    }
    box.appendChild(article);
  });
  box.querySelectorAll("[data-ai-action]").forEach((button) => button.addEventListener("click", () => handleAiAction(button.dataset.aiAction, Number(button.dataset.messageIndex))));
  requestAnimationFrame(() => {
    box.scrollTop = box.scrollHeight;
  });
}

function aiActionButtons(index) {
  const msg = state.aiMessages[index];
  if (!msg || msg.role !== "assistant" || msg.content.includes("...")) return '';
  let html = '<div class="flex flex-wrap gap-2 mt-3">';
  if (/[\u0600-\u06FF].*[—\-–:=].+/.test(msg.content)) {
    html += `<button class="ai-chip" data-ai-action="flashcards" data-message-index="${index}">🗂️ ${t("addFlashcards")}</button>`;
  }
  if (/(?:PYTANIE|QUESTION):/i.test(msg.content)) {
    html += `<button class="ai-chip" data-ai-action="quiz" data-message-index="${index}">+ ${tx("Zapisz jako Quiz", "Save as Quiz")}</button>`;
  }
  html += '</div>';
  return html.includes('data-ai-action') ? html : '';
}

function isIslamicQuery(content = "") {
  return /\b(islam|allah|quran|koran|surah|sura|ayah|ajat|dua|du'a|hadith|hadis|salat|modlitw|halal|haram|ramadan|wudu|meczet|prorok|muhammad|muzu|shahada|szahada|jihad|dĹĽihad)\b/i.test(content);
}

function buildIslamicSourceContext(content = "") {
  const terms = content.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((term) => term.length > 2);
  const scored = ISLAMIC_SOURCE_LIBRARY.map((item) => {
    const haystack = `${item.textPl} ${item.textEn} ${item.source}`.toLowerCase();
    const score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);
    return { ...item, score };
  })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  if (!scored.length) return "";
  return scored.map((item, index) => {
    const text = state.lang === "pl" ? item.textPl : item.textEn;
    return `${index + 1}. [${item.source}] ${text}`;
  }).join("\n");
}

function hasRequiredIslamicSources(answer = "") {
  return /(Zrodla|Źrodla|Źródła|Sources)\s*:/i.test(answer) && /(Quran|Koran|Bukhari|Muslim|Tirmidhi|Abu Dawud|Nasai|Ibn Majah|Tabarani)\s*\d*/i.test(answer);
}

async function sendAiMessage(event) {
  event.preventDefault();
  if (!navigator.onLine) {
    showToast(tx("AI wymaga połączenia z internetem.", "AI requires an internet connection."));
    return;
  }
  const input = $("#aiInput");
  let content = input.value.trim();
  if (!content) return;
  if (content.length > AI_LIMITS.maxPromptLength) {
    showToast(tx(`Wiadomość jest za długa. Limit: ${AI_LIMITS.maxPromptLength} znaków.`, `Message is too long. Limit: ${AI_LIMITS.maxPromptLength} characters.`));
    return;
  }
  const aiCheck = canUseAi();
  if (!aiCheck.ok) {
    showToast(aiCheck.reason);
    return;
  }
  recordAiUse();
  state.aiMessages.push({ role: "user", content });
  state.aiMessages = state.aiMessages.slice(-AI_LIMITS.maxMessages);
  input.value = "";
  renderAiMessages();
  const aiThinking = tx("Pisze odpowiedz...", "Writing response...");
  state.aiMessages.push({ role: "assistant", content: aiThinking });
  renderAiMessages();
  try {
    const appContext = tx(
      `Kontekst aplikacji: uzytkownik ma ${state.points} punktow, poziom ${level()}, zna ${state.learnedLetters.length}/28 liter. Sekcje: Alfabet, Lekcje, Fiszki, Wymowa, Pisanie, O? czasu nauki, Kultura, Gry, Qur'an, Islam.`,
      `App context: user has ${state.points} points, level ${level()}, knows ${state.learnedLetters.length}/28 letters. Sections: Alphabet, Lessons, Flashcards, Speech, Writing, Learning Timeline, Culture, Games, Qur'an, Islam.`
    );
    const creationContext = isAiCreationRequest(content) ? existingAiCreationContext() : "";
    const islamicSourceContext = isIslamicQuery(content) ? buildIslamicSourceContext(content) : "";
    const recent = state.aiMessages.filter((message) => message.content !== aiThinking).slice(-8);
    const answer = await askGroq([
      { role: "system", content: appContext },
      ...(creationContext ? [{ role: "system", content: creationContext }] : []),
      ...(islamicSourceContext ? [{ role: "system", content: `Verified Alif AI Islamic source context:\n${islamicSourceContext}\nAnswer religious questions only from this context and include Sources.` }] : []),
      ...recent
    ]);
    const guardedAnswer = isIslamicQuery(content) && !hasRequiredIslamicSources(answer)
      ? tx(
          "Nie mam zweryfikowanego zrodla w bazie Alif AI dla tej odpowiedzi.\n\nZrodla: brak dopasowanego zrodla w lokalnej bazie",
          "I do not have a verified source in the Alif AI database for this answer.\n\nSources: no matching source in the local database"
        )
      : answer;
    state.aiMessages[state.aiMessages.length - 1] = { role: "assistant", content: guardedAnswer };
  } catch {
    state.aiMessages[state.aiMessages.length - 1] = { role: "assistant", content: tx("Nie udalo mi sie polaczyc z Groq. Sprawdz internet, CORS albo limit API i sprobuj ponownie.", "I could not connect to Groq. Check internet, CORS, or API limits and try again.") };
  }
  state.aiMessages = state.aiMessages.slice(-AI_LIMITS.maxMessages);
  saveState();
  renderAiMessages();
}

async function askGroq(messages, model = GROQ_MODEL, imageData = null) {
  const payload = {
    model: model,
    messages: [
      { role: "system", content: aiSystemPrompt() },
      ...messages
    ],
    temperature: 0.75,
    max_tokens: AI_LIMITS.maxTokens
  };

  if (imageData && model.includes("vision")) {
    const lastIdx = payload.messages.length - 1;
    const userContent = payload.messages[lastIdx].content;
    payload.messages[lastIdx].content = [
      { type: "text", text: userContent },
      { type: "image_url", image_url: { url: imageData } }
    ];
  }

  const response = await fetch("/api/groq-proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    throw new Error(`Groq error ${response.status}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || tx("Nie dostalem tresci odpowiedzi.", "I did not receive response content.");
}

function skeleton(count = 3, height = "120px") {
  return Array.from({ length: count }, () => `<div class="skeleton w-full mb-3" style="height:${height}"></div>`).join("");
}

function showSearchSuggestions() {
  const suggestions = ["سلام", "alif", "ba", "Al-Fatiha", "Al-Baqara", "salam", "islam", "pokój", "liczby", "kolory", "rodzina", "powitania"];
  const cats = [
    { label: tx("Alfabet", "Alphabet"), route: "alphabet" },
    { label: tx("Koran", "Quran"), route: "koran" },
    { label: tx("Lekcje", "Lessons"), route: "lessons" },
    { label: tx("Fiszki", "Flashcards"), route: "flashcards" }
  ];
  view.innerHTML = `
    <div class="mb-4"><h1 class="text-3xl font-black">${tx("Szukaj", "Search")}</h1></div>
    <div class="panel p-5 mb-4">
      <p class="font-black mb-3">${tx("Szybkie kategorie", "Quick categories")}</p>
      <div class="flex flex-wrap gap-2">${cats.map(c => `<button class="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-2 font-bold" data-route="${c.route}">${c.label}</button>`).join("")}</div>
    </div>
    <div class="panel p-5">
      <p class="font-black mb-3">${tx("Spróbuj wyszukać", "Try searching")}</p>
      <div class="flex flex-wrap gap-2">${suggestions.map(s => `<button class="rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm font-bold search-suggestion" data-suggestion="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join("")}</div>
    </div>
  `;
  view.querySelectorAll("[data-route]").forEach(btn => btn.addEventListener("click", () => setRoute(btn.dataset.route)));
  view.querySelectorAll(".search-suggestion").forEach(btn => btn.addEventListener("click", () => {
    const input = $("#globalSearch");
    if (input) { input.value = btn.dataset.suggestion; input.dispatchEvent(new Event("input")); }
  }));
}

function runSearch(q) {
  const alphabetMatches = arabicAlphabet.filter(l => l.id.includes(q) || l.polishName.toLowerCase().includes(q) || l.transliteration.includes(q) || l.forms.isolated.includes(q));
  const wordMatches = words.filter(w => w.pl.toLowerCase().includes(q) || w.tr.toLowerCase().includes(q) || w.ar.includes(q));
  const surahMatches = SURAH_LIST.filter(s => s.enName.toLowerCase().includes(q) || s.arName.includes(q) || String(s.number) === q);
  const lessonMatches = (LESSONS_DATA[state.lang] || [])
    .filter(l => !isIslamLessonCategory(l.category))
    .filter(l => l.title.toLowerCase().includes(q) || l.meaning.toLowerCase().includes(q) || l.ar.includes(q) || l.tr.toLowerCase().includes(q));

  view.innerHTML = `
    <div class="mb-4"><h1 class="text-3xl font-black">${tx("Wyniki", "Results")}: "${escapeHtml(q)}"</h1></div>
    <div class="grid gap-6">
      ${alphabetMatches.length ? `<section><h2 class="font-black mb-3">${tx("Alfabet", "Alphabet")}</h2><div class="grid grid-cols-2 sm:grid-cols-4 gap-2">${alphabetMatches.map(l => `<button class="panel p-4" data-letter-info="${l.id}"><span class="arabic text-3xl block">${escapeHtml(l.forms.isolated)}</span><span class="text-sm font-bold">${escapeHtml(l.polishName)}</span></button>`).join("")}</div></section>` : ""}
      ${wordMatches.length ? `<section><h2 class="font-black mb-3">${tx("Słowniczek", "Words")}</h2><div class="grid grid-cols-2 gap-2">${wordMatches.map(w => `<div class="panel p-4 text-left"><span class="arabic text-2xl block">${escapeHtml(w.ar)}</span><span class="font-bold">${escapeHtml(w.pl)}</span></div>`).join("")}</div></section>` : ""}
      ${surahMatches.length ? `<section><h2 class="font-black mb-3">${tx("Koran", "Quran")}</h2><div class="grid grid-cols-2 gap-2">${surahMatches.map(s => `<button class="panel p-4 text-left" data-read-surah="${s.number}">${s.number}. ${escapeHtml(s.enName)}</button>`).join("")}</div></section>` : ""}
      ${lessonMatches.length ? `<section><h2 class="font-black mb-3">${tx("Lekcje", "Lessons")}</h2><div class="grid grid-cols-2 gap-2">${lessonMatches.map(l => `<div class="panel p-4 text-left"><span class="arabic text-2xl block">${escapeHtml(l.ar)}</span><span class="font-bold text-sm">${escapeHtml(l.title)}</span><span class="block text-xs text-[var(--muted)]">${escapeHtml(l.meaning)}</span></div>`).join("")}</div></section>` : ""}
      ${!alphabetMatches.length && !wordMatches.length && !surahMatches.length && !lessonMatches.length ? `<p class="text-[var(--muted)]">${tx("Brak wyników.", "No results.")}</p>` : ""}
    </div>
  `;
  view.querySelectorAll("[data-letter-info]").forEach(btn => btn.addEventListener("click", () => openLetter(btn.dataset.letterInfo)));
  view.querySelectorAll("[data-read-surah]").forEach(btn => btn.addEventListener("click", () => {
    setRoute("koran");
    setTimeout(() => openSurah(Number(btn.dataset.readSurah)), 100);
  }));
}

function initSearch() {
  const input = $("#globalSearch");
  if (!input) return;
  input.addEventListener("focus", () => {
    if (!input.value.trim()) showSearchSuggestions();
  });
  const debouncedSearch = debounce((q) => runSearch(q), 250);
  input.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) {
      render();
      return;
    }
    // BOLT OPTIMIZATION: Use debounced search to avoid expensive DOM re-renders on every keystroke
    debouncedSearch(q);
  });
}

function handleAiAction(action, messageIndex) {
  const message = state.aiMessages[messageIndex];
  if (!message) return;
  if (action === "flashcards") {
    addAiFlashcards(message.content);
    setRoute("flashcards");
  }
  if (action === "quiz") {
    if (!addAiQuiz(message.content)) return;
    state.activeGame = "aiQuiz";
    setRoute("games");
    saveState();
  }
  $("#aiDialog").close();
  confetti();
}

function addAiQuiz(text, topic = "") {
  const lines = text.split("\n").map(line => line.trim()).filter(line => /(?:PYTANIE|QUESTION):/i.test(line));
  if (!lines.length) {
    showToast(tx("Nie znaleziono pytań do quizu.", "No quiz questions found."));
    return false;
  }

  const questions = lines.map(line => {
    const questionMatch = line.match(/(?:PYTANIE|QUESTION):\s*(.*?)\s*\|/i);
    const optionAMatch = line.match(/A:\s*(.*?)\s*\|/i);
    const optionBMatch = line.match(/B:\s*(.*?)\s*\|/i);
    const optionCMatch = line.match(/C:\s*(.*?)\s*\|/i);
    const correctMatch = line.match(/(?:POPRAWNA|CORRECT):\s*([A-C])/i);
    if (!questionMatch || !optionAMatch || !optionBMatch || !optionCMatch || !correctMatch) return null;
    return {
      question: questionMatch[1].trim(),
      options: [optionAMatch[1].trim(), optionBMatch[1].trim(), optionCMatch[1].trim()],
      correctIndex: correctMatch[1].toUpperCase().charCodeAt(0) - 65
    };
  }).filter(Boolean).slice(0, AI_LIMITS.maxGeneratedQuizQuestions);

  if (!questions.length) {
    showToast(tx("Nie udało się odczytać pytań. Poproś AI o format QUIZ.", "Could not parse questions. Ask AI for QUIZ format."));
    return false;
  }

  if (!state.aiQuizzes) state.aiQuizzes = [];
  const title = topic ? `${tx("Quiz AI", "AI Quiz")}: ${topic}` : `${tx("Quiz AI", "AI Quiz")} ${new Date().toLocaleString(localeTag(), { dateStyle: "short", timeStyle: "short" })}`;
  if (state.aiQuizzes.some(quiz => normalizeCardKey(quiz.title) === normalizeCardKey(title))) {
    showToast(tx("Taki quiz AI już istnieje. Wybierz inny temat.", "This AI quiz already exists. Choose another topic."));
    return false;
  }
  state.aiQuizzes.unshift({ id: crypto.randomUUID(), title, questions });
  state.aiQuizzes = state.aiQuizzes.slice(0, AI_LIMITS.maxStoredAiQuizzes);
  saveState();
  showToast(tx("Quiz został zapisany.", "Quiz saved."));
  return true;
}

function addAiFlashcards(text) {
  const created = [];
  const lines = text.split(String.fromCharCode(10)).map(l => l.trim()).filter(Boolean);
  const existingFronts = new Set([...(state.aiFlashcards || []), ...(state.customFlashcards || []), ...words].map(card => normalizeCardKey(card.front || card.ar || "")));
  const canAddMore = () => created.length < AI_LIMITS.maxGeneratedFlashcards;
  const hasArabic = (value = "") => Array.from(value).some((char) => {
    const code = char.charCodeAt(0);
    return code >= 0x0600 && code <= 0x06ff;
  });
  const addCard = (front, back) => {
    const cleanFront = String(front || "").trim();
    const cleanBack = String(back || "").trim().slice(0, 180);
    const key = normalizeCardKey(cleanFront);
    if (!canAddMore() || cleanFront.length < 2 || cleanBack.length < 2 || !hasArabic(cleanFront) || hasArabic(cleanBack) || existingFronts.has(key)) return;
    created.push({ id: `ai-${crypto.randomUUID()}`, front: cleanFront, back: cleanBack, hint: "AI" });
    existingFronts.add(key);
  };
  const splitPair = (line) => {
    const emDash = String.fromCharCode(0x2014);
    const enDash = String.fromCharCode(0x2013);
    const separators = [` ${emDash} `, ` ${enDash} `, " - ", " = ", " : ", emDash, enDash, "-", "=", ":"];
    const separator = separators.find((item) => line.includes(item));
    if (!separator) return null;
    const index = line.indexOf(separator);
    return [line.slice(0, index), line.slice(index + separator.length)];
  };

  for (const line of lines) {
    if (!canAddMore()) break;
    const pair = splitPair(line);
    if (pair) addCard(pair[0], pair[1]);
  }

  if (!created.length) {
    for (let i = 0; i < lines.length - 1; i++) {
      if (!canAddMore()) break;
      const frontLine = lines[i].toLowerCase();
      const backLine = lines[i + 1].toLowerCase();
      if ((!frontLine.includes("strona przednia") && !frontLine.includes("front")) || (!backLine.includes("strona tylna") && !backLine.includes("back"))) continue;
      const front = lines[i].slice(lines[i].indexOf(":") + 1);
      const back = lines[i + 1].slice(lines[i + 1].indexOf(":") + 1);
      addCard(front, back);
      i++;
    }
  }

  if (!created.length) {
    for (const line of lines) {
      if (!canAddMore()) break;
      const withoutNumber = line.replace(/^\s*[0-9]+[.)]?\s*/, "");
      const pair = splitPair(withoutNumber);
      if (pair) addCard(pair[0], pair[1]);
    }
  }

  if (!created.length) {
    showToast(tx("Nie znaleziono par slowo-tlumaczenie. Popros AI o format: arabskie - polskie.", "No word-translation pairs found. Ask AI for format: arabic - translation."));
    return;
  }
  if (!state.aiFlashcards) state.aiFlashcards = [];
  state.aiFlashcards.unshift(...created);
  state.aiFlashcards = state.aiFlashcards.slice(0, AI_LIMITS.maxStoredAiFlashcards);
  saveState();
  showToast(tx(`Dodano ${created.length} fiszek. Limit jednego zapisu: ${AI_LIMITS.maxGeneratedFlashcards}.`, `Added ${created.length} flashcards. Per-save limit: ${AI_LIMITS.maxGeneratedFlashcards}.`));
}
function confetti() {
  const canvas = $("#confettiCanvas");
  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  canvas.width = innerWidth * ratio;
  canvas.height = innerHeight * ratio;
  ctx.scale(ratio, ratio);
  canvas.classList.remove("hidden");
  const pieces = Array.from({ length: 90 }, () => ({
    x: Math.random() * innerWidth,
    y: -20 - Math.random() * 120,
    s: 5 + Math.random() * 8,
    v: 2 + Math.random() * 4,
    r: Math.random() * Math.PI,
    c: Math.random() > 0.5 ? "#10B981" : "#EAB308"
  }));
  let frame = 0;
  const draw = () => {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    pieces.forEach((piece) => {
      piece.y += piece.v;
      piece.x += Math.sin(frame / 12 + piece.r) * 1.8;
      ctx.fillStyle = piece.c;
      ctx.fillRect(piece.x, piece.y, piece.s, piece.s * 0.55);
    });
    frame += 1;
    if (frame < 150) requestAnimationFrame(draw);
    else canvas.classList.add("hidden");
  };
  draw();
}

function triggerHaptic() {
  if ("vibrate" in navigator) {
    navigator.vibrate(10);
  }
}

function openBottomSheet(content) {
  const sheet = $("#bottomSheet");
  const overlay = $("#sheetOverlay");
  const container = $("#bottomSheetContent");
  setTrustedHtml(container, content);
  sheet.classList.add("active");
  overlay.classList.add("active");
  triggerHaptic();
}

function closeBottomSheet() {
  $("#bottomSheet").classList.remove("active");
  $("#sheetOverlay").classList.remove("active");
}

function toggleFocusMode(content = "") {
  state.focusMode = !state.focusMode;
  const overlay = $("#focusOverlay");
  const container = $("#focusContent");
  if (state.focusMode) {
    setTrustedHtml(container, content || view.innerHTML);
    overlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  } else {
    overlay.classList.add("hidden");
    document.body.style.overflow = "";
  }
  saveState();
}

const BADGES_CATALOG = [
  { id: "first_letter",   icon: "🅰️", pl: "Pierwsza litera",     en: "First letter",       criterionPl: "Poznaj 1 literę arabską",           criterionEn: "Learn 1 Arabic letter" },
  { id: "ten_letters",    icon: "✋",  pl: "Dziesięć liter",      en: "Ten letters",        criterionPl: "Poznaj 10 liter",                   criterionEn: "Learn 10 letters" },
  { id: "half_alphabet",  icon: "⭐",  pl: "Połowa alfabetu",     en: "Half alphabet",      criterionPl: "Poznaj 14 z 28 liter",              criterionEn: "Learn 14 of 28 letters" },
  { id: "full_alphabet",  icon: "🏆",  pl: "Mistrz alfabetu",     en: "Alphabet master",    criterionPl: "Poznaj wszystkie 28 liter",         criterionEn: "Learn all 28 letters" },
  { id: "first_surah",    icon: "📖",  pl: "Pierwsza sura",       en: "First surah",        criterionPl: "Dodaj 1 surę do ulubionych ❤️",     criterionEn: "Add 1 surah to favorites ❤️" },
  { id: "surahs5",        icon: "📗",  pl: "5 sur",               en: "5 surahs",           criterionPl: "Dodaj 5 sur do ulubionych",         criterionEn: "Add 5 surahs to favorites" },
  { id: "ten_surahs",     icon: "📚",  pl: "Dziesięć sur",        en: "Ten surahs",         criterionPl: "Dodaj 10 sur do ulubionych ❤️",     criterionEn: "Add 10 surahs to favorites ❤️" },
  { id: "streak3",        icon: "🔥",  pl: "3 dni z rzędu",       en: "3-day streak",       criterionPl: "Ucz się 3 dni pod rząd",            criterionEn: "Learn 3 days in a row" },
  { id: "streak7",        icon: "🔥🔥", pl: "Tydzień nauki",      en: "Week streak",        criterionPl: "Ucz się 7 dni pod rząd",            criterionEn: "Learn 7 days in a row" },
  { id: "streak30",       icon: "💫",  pl: "Miesiąc nauki",       en: "Month streak",       criterionPl: "Ucz się 30 dni pod rząd",           criterionEn: "Learn 30 days in a row" },
  { id: "pts500",         icon: "💯",  pl: "500 punktów",         en: "500 points",         criterionPl: "Zdobądź 500 punktów",               criterionEn: "Earn 500 points" },
  { id: "pts2000",        icon: "💎",  pl: "2000 punktów",        en: "2000 points",        criterionPl: "Zdobądź 2000 punktów",              criterionEn: "Earn 2000 points" },
  { id: "quiz10",         icon: "🧠",  pl: "10 poprawnych",       en: "10 correct",         criterionPl: "Odpowiedz poprawnie 10 razy w quizie", criterionEn: "Answer correctly 10 times in quiz" },
  { id: "quiz25",         icon: "🎓",  pl: "25 poprawnych",       en: "25 correct",         criterionPl: "Odpowiedz poprawnie 25 razy w quizie", criterionEn: "Answer correctly 25 times in quiz" },
  { id: "flashcard_first", icon: "🔖", pl: "Pierwsza fiszka",      en: "First flashcard",    criterionPl: "Dodaj lub rozpocznij 1 fiszkę",      criterionEn: "Add or start 1 flashcard" },
  { id: "flashcards25",   icon: "🃏",  pl: "25 fiszek",           en: "25 flashcards",      criterionPl: "Miej 25 fiszek w kolekcji",         criterionEn: "Have 25 flashcards in collection" },
  { id: "lessons3",       icon: "🌱",  pl: "3 lekcje",            en: "3 lessons",          criterionPl: "Zalicz 3 lekcje",                   criterionEn: "Complete 3 lessons" },
  { id: "lessons10",      icon: "📝",  pl: "10 lekcji",           en: "10 lessons",         criterionPl: "Zalicz 10 lekcji",                  criterionEn: "Complete 10 lessons" },
  { id: "lessons25",      icon: "📒",  pl: "25 lekcji",           en: "25 lessons",         criterionPl: "Zalicz 25 lekcji",                  criterionEn: "Complete 25 lessons" },
  { id: "bismillah",      icon: "🌙",  pl: "Bismillah",           en: "Bismillah",          criterionPl: "Zalicz lekcję Bismillah",           criterionEn: "Complete the Bismillah lesson" },
  { id: "shahada_badge",  icon: "☪️",  pl: "Szahada",            en: "Shahada",            criterionPl: "Zalicz lekcję Szahada",             criterionEn: "Complete the Shahada lesson" },
  { id: "fatiha_lesson",  icon: "🕋",  pl: "Al-Fatiha",           en: "Al-Fatiha",          criterionPl: "Zalicz lekcję Al-Fatiha",           criterionEn: "Complete the Al-Fatiha lesson" },
  { id: "salat_names",    icon: "🕌",  pl: "5 modlitw",           en: "5 prayers",          criterionPl: "Zalicz lekcję o pięciu modlitwach", criterionEn: "Complete the five prayers lesson" },
  { id: "salat_rakat",    icon: "🧭",  pl: "Raka'at",             en: "Raka'at",            criterionPl: "Zalicz lekcję o raka'at",           criterionEn: "Complete the raka'at lesson" },
  { id: "salat_positions", icon: "🧎", pl: "Ruchy salat",         en: "Salat moves",        criterionPl: "Zalicz lekcję o ruku lub sujud",    criterionEn: "Complete a ruku or sujud lesson" },
  { id: "prayer_mode_first", icon: "🤲", pl: "Pierwszy Prayer Mode", en: "First Prayer Mode", criterionPl: "Ukończ 1 sesję Prayer Mode",         criterionEn: "Complete 1 Prayer Mode session" },
  { id: "prayer_mode_3",  icon: "🌟",  pl: "3 sesje modlitwy",    en: "3 prayer sessions",  criterionPl: "Ukończ 3 sesje Prayer Mode",         criterionEn: "Complete 3 Prayer Mode sessions" },
  { id: "dhikr33",        icon: "📿",  pl: "33 dhikr",            en: "33 dhikr",           criterionPl: "Wykonaj 33 kliknięcia dhikru",       criterionEn: "Complete 33 dhikr taps" },
  { id: "dhikr100",       icon: "💚",  pl: "100 dhikr",           en: "100 dhikr",          criterionPl: "Wykonaj 100 kliknięć dhikru",       criterionEn: "Complete 100 dhikr taps" },
  { id: "pillars_quiz10", icon: "⭐",  pl: "Filary quiz",         en: "Pillars quiz",       criterionPl: "Zdobądź 10 poprawnych w quizie filarów", criterionEn: "Get 10 correct in the pillars quiz" },
  { id: "surah_quiz10",   icon: "📜",  pl: "Quiz sur",            en: "Surah quiz",         criterionPl: "Zdobądź 10 poprawnych w quizie sur", criterionEn: "Get 10 correct in the surah quiz" },
  { id: "games3",         icon: "🎮",  pl: "3 gry",               en: "3 games",            criterionPl: "Zagraj 3 razy w gry",                criterionEn: "Play games 3 times" },
  { id: "ai_quiz_first",  icon: "AI",  pl: "Pierwszy quiz AI",    en: "First AI quiz",      criterionPl: "Zapisz lub wygeneruj 1 quiz AI",     criterionEn: "Save or generate 1 AI quiz" },
  { id: "ai_cards10",     icon: "▣",   pl: "10 fiszek AI",        en: "10 AI cards",        criterionPl: "Dodaj 10 fiszek z AI",              criterionEn: "Add 10 AI cards" },
  { id: "dua_fav3",       icon: "☾",   pl: "3 ulubione dua",      en: "3 favorite duas",    criterionPl: "Dodaj 3 dua do ulubionych",         criterionEn: "Favorite 3 duas" },
  { id: "review_clean",   icon: "✓",   pl: "Czysta powtórka",     en: "Clean review",       criterionPl: "Nie miej aktywnych błędów",          criterionEn: "Have no active mistakes" },
  { id: "asma_challenge20", icon: "99", pl: "20 Imion",           en: "20 Names",           criterionPl: "Wpisz 20 imion w challenge",         criterionEn: "Enter 20 names in challenge" },
];

const BADGE_CATEGORIES = [
  { id: "learning", pl: "Nauka", en: "Learning" },
  { id: "quran", pl: "Quran", en: "Quran" },
  { id: "streaks", pl: "Serie", en: "Streaks" },
  { id: "practice", pl: "Ćwiczenia", en: "Practice" },
  { id: "prayer", pl: "Modlitwa", en: "Prayer" }
];

function badgeCategory(id) {
  if (/streak/.test(id)) return "streaks";
  if (/surah|fatiha|dua|quran/.test(id)) return "quran";
  if (/quiz|game|flash|review|asma/.test(id)) return "practice";
  if (/salat|prayer|dhikr|wudu/.test(id)) return "prayer";
  return "learning";
}

function badgeTarget(id) {
  if (/letter/.test(id)) return { route: "alphabet" };
  if (/surah|fatiha|dua/.test(id)) return { route: "koran" };
  if (/quiz|game|asma/.test(id)) return { route: "games", activeGame: /ai_quiz/.test(id) ? "aiQuiz" : "quizHub" };
  if (/flash/.test(id)) return { route: "flashcards" };
  if (/lesson|bismillah|shahada/.test(id)) return { route: "lessons" };
  if (/salat|prayer/.test(id)) return { route: "prayerGuide" };
  if (/dhikr/.test(id)) return { route: "dhikr" };
  if (/review/.test(id)) return { route: "review" };
  return { route: "home" };
}

function checkBadges() {
  const ll = state.learnedLetters.length;
  const sq = (state.quranSurahFavorites || []).length;
  const pts = state.points;
  const fc = (state.customFlashcards || []).length + (state.aiFlashcards || []).length + Object.keys(state.flashcards || {}).length;
  const ld = (state.miniLessonsDone || []).length;
  const dhikrTotal = Object.values(state.dhikrCounts || {}).reduce((sum, count) => sum + (Number(count) || 0), 0);
  const prayerSessions = state.prayerGuideSessions || 0;
  const gamesPlayed =
    (state.quizHistory || []).length +
    (state.dhikrGameHistory || []).length +
    (state.pillarsQuizHistory || []).length +
    (state.surahQuizHistory || []).length +
    (state.gameHistory || []).filter(item => String(item.game || "").startsWith("AI Quiz")).length +
    (state.memoryStats?.correct || 0) +
    (state.memoryStats?.wrong || 0);

  if (ll >= 1)  unlockBadge("first_letter",  tx("Pierwsza litera", "First letter"));
  if (ll >= 10) unlockBadge("ten_letters",   tx("Dziesięć liter", "Ten letters"));
  if (ll >= 14) unlockBadge("half_alphabet", tx("Połowa alfabetu", "Half alphabet"));
  if (ll >= 28) unlockBadge("full_alphabet", tx("Mistrz alfabetu", "Alphabet master"));
  if (sq >= 1)  unlockBadge("first_surah",   tx("Pierwsza sura", "First surah"));
  if (sq >= 5)  unlockBadge("surahs5",       tx("5 sur", "5 surahs"));
  if (sq >= 10) unlockBadge("ten_surahs",    tx("Dziesięć sur", "Ten surahs"));
  if (state.streak >= 3)  unlockBadge("streak3",  tx("3 dni z rzędu", "3-day streak"));
  if (state.streak >= 7)  unlockBadge("streak7",  tx("Tydzień nauki", "Week streak"));
  if (state.streak >= 30) unlockBadge("streak30", tx("Miesiąc nauki", "Month streak"));
  if (pts >= 500)  unlockBadge("pts500",  tx("500 punktów", "500 points"));
  if (pts >= 2000) unlockBadge("pts2000", tx("2000 punktów", "2000 points"));
  if (state.quizStats.correct >= 10) unlockBadge("quiz10", tx("10 poprawnych", "10 correct"));
  if (state.quizStats.correct >= 25) unlockBadge("quiz25", tx("25 poprawnych", "25 correct"));
  if (fc >= 1) unlockBadge("flashcard_first", tx("Pierwsza fiszka", "First flashcard"));
  if (fc >= 25) unlockBadge("flashcards25", tx("25 fiszek", "25 flashcards"));
  if (ld >= 3)  unlockBadge("lessons3",    tx("3 lekcje", "3 lessons"));
  if (ld >= 10) unlockBadge("lessons10",   tx("10 lekcji", "10 lessons"));
  if (ld >= 25) unlockBadge("lessons25",   tx("25 lekcji", "25 lessons"));
  if ((state.miniLessonsDone || []).includes("bismillah"))    unlockBadge("bismillah",     "Bismillah");
  if ((state.miniLessonsDone || []).includes("shahada"))      unlockBadge("shahada_badge", tx("Szahada", "Shahada"));
  if ((state.miniLessonsDone || []).includes("fatiha"))       unlockBadge("fatiha_lesson", "Al-Fatiha");
  if ((state.miniLessonsDone || []).includes("salat_times"))  unlockBadge("salat_names",   tx("5 modlitw", "5 prayers"));
  if ((state.miniLessonsDone || []).includes("salat_rakat"))  unlockBadge("salat_rakat",   "Raka'at");
  if ((state.miniLessonsDone || []).some(id => ["salat_ruku", "salat_sujud"].includes(id))) unlockBadge("salat_positions", tx("Ruchy salat", "Salat moves"));
  if (prayerSessions >= 1) unlockBadge("prayer_mode_first", tx("Pierwszy Prayer Mode", "First Prayer Mode"));
  if (prayerSessions >= 3) unlockBadge("prayer_mode_3", tx("3 sesje modlitwy", "3 prayer sessions"));
  if (dhikrTotal >= 33) unlockBadge("dhikr33", tx("33 dhikr", "33 dhikr"));
  if (dhikrTotal >= 100) unlockBadge("dhikr100", tx("100 dhikr", "100 dhikr"));
  if ((state.pillarsQuizStats?.correct || 0) >= 10) unlockBadge("pillars_quiz10", tx("Filary quiz", "Pillars quiz"));
  if ((state.surahQuizStats?.correct || 0) >= 10) unlockBadge("surah_quiz10", tx("Quiz sur", "Surah quiz"));
  if (gamesPlayed >= 3) unlockBadge("games3", tx("3 gry", "3 games"));
  if ((state.aiQuizzes || []).length >= 1) unlockBadge("ai_quiz_first", tx("Pierwszy quiz AI", "First AI quiz"));
  if ((state.aiFlashcards || []).length >= 10) unlockBadge("ai_cards10", tx("10 fiszek AI", "10 AI cards"));
  if ((state.quranDuaFavorites || []).length >= 3) unlockBadge("dua_fav3", tx("3 ulubione dua", "3 favorite duas"));
  if (activeMistakeTotal() === 0 && gamesPlayed > 0) unlockBadge("review_clean", tx("Czysta powtórka", "Clean review"));
  if ((state.asmaChallengeBest || 0) >= 20) unlockBadge("asma_challenge20", tx("20 Imion", "20 Names"));
}

function unlockBadge(id, name) {
  if (state.badges.includes(id)) return;
  state.badges.push(id);
  saveState();
  if (muteBadgeNotifications) return;
  showToast(`🏆 ${name}!`);
  confetti();
  triggerHaptic();
}

// ============================================================
// HIJRI CALENDAR (local algorithm — Umm al-Qura approximation)
// ============================================================
function gregorianToHijri(gDate) {
  const JD = Math.floor((gDate / 86400000) + 2440587.5);
  let l = JD - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) + Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
  const month = Math.floor((24 * l) / 709);
  const day = l - Math.floor((709 * month) / 24);
  const year = 30 * n + j - 30;
  return { year, month, day };
}

function hijriWidget() {
  const h = gregorianToHijri(Date.now());
  const monthNames = islamicMonths[h.month - 1];
  const monthName = monthNames ? (state.lang === 'pl' ? monthNames.pl : monthNames.en) : '';
  const gregStr = new Date().toLocaleDateString(state.lang === 'pl' ? 'pl-PL' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  return `<button class="hijri-widget w-full text-left" data-route="calendar">
    <div class="hijri-label">${tx("Kalendarz islamski (Hidżra)", "Islamic Calendar (Hijri)")}</div>
    <div class="hijri-date">${h.day} ${monthName} ${h.year} H</div>
    <div class="hijri-month" style="direction:rtl">${monthNames?.ar || ''} — ${monthNames?.tr || ''}</div>
    <div class="hijri-gregorian">${gregStr}</div>
  </button>`;
}

function islamicMonthHighlights(monthNumber) {
  const highlights = {
    1: [tx("10 Muharram: Ashura, dzień postu i refleksji.", "10 Muharram: Ashura, a day of fasting and reflection.")],
    7: [tx("Rajab: jeden z czterech świętych miesięcy.", "Rajab: one of the four sacred months."), tx("27 Rajab: Isra wal-Mi'raj według wielu kalendarzy.", "27 Rajab: Isra wal-Mi'raj in many calendars.")],
    8: [tx("Sha'ban: przygotowanie do Ramadanu.", "Sha'ban: preparation for Ramadan.")],
    9: [tx("Ramadan: miesiąc postu i Koranu.", "Ramadan: month of fasting and Quran."), tx("Ostatnie 10 nocy: szczególna modlitwa i poszukiwanie Laylat al-Qadr.", "Last 10 nights: special worship and seeking Laylat al-Qadr.")],
    10: [tx("1 Shawwal: Eid al-Fitr.", "1 Shawwal: Eid al-Fitr."), tx("Sześć dni postu w Shawwal jako zalecana praktyka.", "Six days of fasting in Shawwal as a recommended practice.")],
    11: [tx("Dhu al-Qi'dah: jeden z czterech świętych miesięcy.", "Dhu al-Qi'dah: one of the four sacred months.")],
    12: [tx("8-13 Dhu al-Hijjah: dni Hajj.", "8-13 Dhu al-Hijjah: days of Hajj."), tx("9 Dhu al-Hijjah: dzień Arafah.", "9 Dhu al-Hijjah: day of Arafah."), tx("10 Dhu al-Hijjah: Eid al-Adha.", "10 Dhu al-Hijjah: Eid al-Adha.")]
  };
  return highlights[monthNumber] || [];
}

function islamicCalendar() {
  const today = gregorianToHijri(Date.now());
  const todayMonth = islamicMonths[today.month - 1];
  const todayMonthName = todayMonth ? (state.lang === "pl" ? todayMonth.pl : todayMonth.en) : "";
  const gregStr = new Date().toLocaleDateString(state.lang === "pl" ? "pl-PL" : "en-US", { day: "numeric", month: "long", year: "numeric" });
  view.innerHTML = `
    <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p class="font-bold text-emerald-600">${tx("Kalendarz Hijri", "Hijri Calendar")}</p>
        <h1 class="text-3xl font-black">${tx("Kalendarz islamski", "Islamic calendar")}</h1>
        <p class="mt-2 text-sm text-[var(--muted)]">${tx("Dzisiaj:", "Today:")} ${today.day} ${todayMonthName} ${today.year} H · ${gregStr}</p>
      </div>
      <button class="big-action border border-[var(--line)] bg-[var(--surface)]" data-route="home">${tx("Wróć", "Back")}</button>
    </div>
    <section class="panel p-4">
      <p class="text-sm text-[var(--muted)]">${tx("Daty islamskie mogą różnić się zależnie od obserwacji księżyca i lokalnej wspólnoty. Ten widok jest edukacyjny i nie zastępuje ogłoszeń meczetu ani lokalnych uczonych.", "Islamic dates can differ depending on moon sighting and the local community. This view is educational and does not replace mosque announcements or local scholars.")}</p>
    </section>
    <section class="calendar-month-grid mt-4">
      ${islamicMonths.map(month => {
        const active = month.n === today.month;
        const highlights = islamicMonthHighlights(month.n);
        return `<article class="calendar-month-card ${active ? "is-current" : ""}">
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs font-black text-[var(--muted)]">${tx("Miesiąc", "Month")} ${month.n}</p>
              <h2 class="mt-1 text-xl font-black">${state.lang === "pl" ? month.pl : month.en}</h2>
              <p class="text-sm font-bold text-[var(--accent)]">${month.tr}</p>
            </div>
            <p class="arabic text-2xl leading-none" style="direction:rtl">${month.ar}</p>
          </div>
          ${active ? `<p class="mt-3 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-black text-white">${tx("Aktualny miesiąc", "Current month")} · ${today.day}</p>` : ""}
          <p class="mt-3 text-sm text-[var(--muted)]">${state.lang === "pl" ? month.note_pl : month.note_en}</p>
          ${highlights.length ? `<ul class="mt-3 grid gap-2">${highlights.map(item => `<li class="calendar-highlight">${item}</li>`).join("")}</ul>` : ""}
        </article>`;
      }).join("")}
    </section>
  `;
  view.querySelectorAll("[data-route]").forEach(button => {
    button.addEventListener("click", () => setRoute(button.dataset.route));
  });
}

function hadithOfDayWidget() {
  const daysSinceEpoch = Math.floor(Date.now() / 86400000);
  const idx = daysSinceEpoch % islamicHadith.length;
  const h = islamicHadith[idx];
  if (!h) return '';
  return `<div class="panel p-4 cursor-pointer" data-route="seerah">
    <h3 class="text-sm font-black text-[var(--accent)] mb-1">📜 ${tx("Hadis Dnia", "Hadith of the Day")}</h3>
    <p class="text-base font-bold arabic text-right leading-relaxed mb-1">${h.ar}</p>
    <p class="text-xs text-[var(--muted)] italic">${state.lang === 'pl' ? h.pl : h.en}</p>
    <p class="text-xs text-[var(--muted)] mt-1 font-bold">${h.source} <span class="trust-badge verified">${h.grade?.toUpperCase() || "UNGRADED"}</span></p>
    <p class="quality-meta">${hadithQuality(h).source_type} · ${hadithQuality(h).collection} · ${hadithQuality(h).verified ? trustLabel(CONTENT_TRUST.VERIFIED) : trustLabel(CONTENT_TRUST.UNVERIFIED)} · ${tx("Sprawdzone:", "Checked:")} ${hadithQuality(h).reviewed_at}</p>
  </div>`;
}

// ============================================================
// DHIKR COUNTER
// ============================================================
function dhikr() {
  const counts = state.dhikrCounts || { subhana: 0, alhamdu: 0, allahu: 0 };
  const items = [
    { key: 'subhana', ar: 'سُبْحَانَ اللَّهِ', tr: 'Subhanallah', pl: 'Chwała Bogu', en: 'Glory be to God', target: 33, color: '#10b981' },
    { key: 'alhamdu', ar: 'الْحَمْدُ لِلَّهِ', tr: 'Alhamdulillah', pl: 'Chwała Bogu (dzięki)', en: 'All praise to God', target: 33, color: '#3b82f6' },
    { key: 'allahu', ar: 'اللَّهُ أَكْبَرُ', tr: 'Allahu Akbar', pl: 'Bóg jest Największy', en: 'God is the Greatest', target: 34, color: '#8b5cf6' }
  ];
  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Licznik Dhikr", "Dhikr Counter")} 📿</h1>
      <p class="text-[var(--muted)]">${tx("Subhanallah (33) · Alhamdulillah (33) · Allahu Akbar (34) = 100", "Subhanallah (33) · Alhamdulillah (33) · Allahu Akbar (34) = 100")}</p>
    </div>
    <div class="dhikr-grid">
      ${items.map(item => {
        const count = counts[item.key] || 0;
        const done = count >= item.target;
        return `<div class="panel p-5 text-center">
          <p class="text-3xl arabic font-bold mb-2" style="direction:rtl">${item.ar}</p>
          <p class="text-sm font-bold text-[var(--accent)] mb-1">${item.tr}</p>
          <p class="text-xs text-[var(--muted)] mb-4">${state.lang === 'pl' ? item.pl : item.en}</p>
          <button class="dhikr-btn ${done ? 'opacity-50' : ''}" style="background:${item.color}" data-dhikr="${item.key}">
            <span class="dhikr-count">${count}</span>
            <span style="font-size:12px;opacity:0.8">/ ${item.target}</span>
          </button>
          ${done ? `<p class="mt-3 text-emerald-500 font-black">${tx("✅ Ukończono!", "✅ Done!")}</p>` : ''}
        </div>`;
      }).join('')}
    </div>
    <div class="mt-6 flex gap-3">
      <button id="resetDhikrBtn" class="big-action flex-1 border border-[var(--line)] bg-[var(--surface)]">${tx("Resetuj licznik", "Reset counter")}</button>
    </div>
    <div class="panel p-5 mt-4">
      <h2 class="text-lg font-black mb-3">${tx("Łączny dhikr", "Total dhikr")}</h2>
      <div class="text-4xl font-black text-center text-[var(--accent)]">${(counts.subhana || 0) + (counts.alhamdu || 0) + (counts.allahu || 0)}</div>
      <p class="text-center text-[var(--muted)] text-sm mt-1">${tx("Stuknięcia w tej sesji", "Taps this session")}</p>
    </div>
  `;
  view.querySelectorAll("[data-dhikr]").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.dhikr;
      const target = items.find(i => i.key === key)?.target || 33;
      if (!state.dhikrCounts) state.dhikrCounts = { subhana: 0, alhamdu: 0, allahu: 0 };
      state.dhikrCounts[key] = (state.dhikrCounts[key] || 0) + 1;
      if (state.dhikrCounts[key] === target) {
        showToast(tx(`🤲 ${items.find(i=>i.key===key).tr} ukończony!`, `🤲 ${items.find(i=>i.key===key).tr} complete!`));
        triggerHaptic();
      }
      triggerHaptic();
      saveState();
      checkBadges();
      dhikr();
    });
  });
  $("#resetDhikrBtn")?.addEventListener("click", () => {
    state.dhikrCounts = { subhana: 0, alhamdu: 0, allahu: 0 };
    saveState();
    dhikr();
  });
}

// ============================================================
// PRAYER MODE — beginner salat guide
// ============================================================
function prayerGuideStepsFor(prayer) {
  const repeated = [];
  const rakatCount = prayer?.rakat || 2;
  PRAYER_GUIDE_CORE_STEPS.forEach((step) => {
    if (step.id === "next-rakah") {
      for (let i = 2; i <= rakatCount; i += 1) {
        repeated.push({
          ...step,
          titlePl: `Raka'at ${i} z ${rakatCount}`,
          titleEn: `Raka'ah ${i} of ${rakatCount}`,
          bodyPl: i === rakatCount
            ? "To ostatnia raka'at tej modlitwy. Powtórz ruchy spokojnie, potem przejdziesz do tashahhud."
            : "Wstań i powtórz pełną raka'at. Aplikacja prowadzi Cię dalej bez presji na perfekcję.",
          bodyEn: i === rakatCount
            ? "This is the final raka'ah of this prayer. Repeat the movements calmly, then you will continue to tashahhud."
            : "Stand and repeat a full raka'ah. The app guides you forward without pressure for perfection."
        });
      }
      return;
    }
    repeated.push(step);
  });
  return repeated;
}

function prayerGuide() {
  state.prayerModeTab = "guide";
  saveState();
  prayer();
}

// ============================================================
// PRAYER TIMES - configurable locations
// ============================================================
function getPrayerLocations() {
  return state.prayerLocations?.length ? state.prayerLocations : PRAYER_LOCATIONS;
}

async function fetchPrayerTimes(loc) {
  const cacheKey = `${today()}-${loc.id}-${loc.lat}-${loc.lng}-${loc.method}`;
  const cached = state.prayerTimesCache?.[cacheKey];
  if (isFreshCache(cached)) return cached.timings;
  const now = new Date();
  const d = now.getDate(), m = now.getMonth() + 1, y = now.getFullYear();
  const url = `https://api.aladhan.com/v1/timings/${d}-${m}-${y}?latitude=${loc.lat}&longitude=${loc.lng}&method=${loc.method}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    const data = await res.json();
    const timings = data.data?.timings || null;
    if (timings) {
      state.prayerTimesCache = {
        ...(state.prayerTimesCache || {}),
        [cacheKey]: { cachedAt: new Date().toISOString(), timings }
      };
      saveState();
    }
    return timings;
  } catch (error) {
    if (cached?.timings) return cached.timings;
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchQibla(loc) {
  const url = `https://api.aladhan.com/v1/qibla/${loc.lat}/${loc.lng}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.data?.direction || null;
}

function formatLocalTime(tz) {
  try {
    return new Intl.DateTimeFormat(state.lang === 'pl' ? 'pl-PL' : 'en-GB', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    }).format(new Date());
  } catch { return '--:--:--'; }
}

function prayerTimesCard(label, timings, qibla, nextKey, tz, locId) {
  const names = PRAYER_NAMES;
  const namesPL = PRAYER_NAMES_PL;
  const prayerRows = names.map((name, i) => {
    const time = timings?.[name] || '--:--';
    const isNext = name === nextKey;
    return `<div class="prayer-row ${isNext ? 'next-prayer' : ''}">
      <span class="prayer-name">${state.lang === 'pl' ? namesPL[i] : name}${isNext ? ' ⟵' : ''}</span>
      <span class="prayer-time">${time}</span>
    </div>`;
  }).join('');

  const qiblaHtml = qibla !== null ? `
    <div class="mt-4 flex items-center gap-4">
      <div class="qibla-compass" id="compass-${locId}">
        <div class="qibla-compass-inner">
          <div class="qibla-needle" id="needle-${locId}" style="transform:rotate(${qibla}deg)"></div>
          <div class="qibla-compass-n">N</div>
        </div>
      </div>
      <div>
        <p class="font-bold">${tx("Kierunek Qibla", "Qibla Direction")}</p>
        <p class="text-[var(--muted)] text-sm">${Math.round(qibla)}° ${tx("od północy", "from north")}</p>
        <p class="text-xs text-[var(--muted)] mt-1" id="compass-status-${locId}">${tx("Obróć urządzenie ku Mekce", "Point device toward Mecca")}</p>
      </div>
    </div>` : '';

  return `<div class="prayer-widget">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-xl font-black">${label}</h2>
      <div class="text-right">
        <div id="clock-${locId}" class="text-2xl font-black font-mono text-[var(--accent)]">${formatLocalTime(tz)}</div>
        <div class="text-xs text-[var(--muted)]">${tz.replace('_', ' ')}</div>
      </div>
    </div>
    ${prayerRows}
    ${qiblaHtml}
  </div>`;
}

function getNextPrayer(timings) {
  if (!timings) return null;
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  for (const name of PRAYER_NAMES) {
    const t = timings[name];
    if (!t) continue;
    const [h, m] = t.split(':').map(Number);
    if (h * 60 + m > nowMins) return name;
  }
  return 'Fajr';
}

function prayerLogForToday() {
  const key = today();
  if (!state.prayerLog) state.prayerLog = {};
  if (!state.prayerLog[key]) state.prayerLog[key] = {};
  return state.prayerLog[key];
}

function prayerJournalHtml() {
  const log = prayerLogForToday();
  const done = OBLIGATORY_PRAYERS.filter(name => log[name]).length;
  return `
    <section class="panel p-5 mb-4">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-xl font-black">${tx("Dziennik modlitw", "Prayer journal")}</h2>
          <p class="text-sm text-[var(--muted)]">${tx("Zaznacz dzisiejsze modlitwy. To lokalny dziennik na tym urzadzeniu.", "Tick today's prayers. This is a local journal on this device.")}</p>
        </div>
        <span class="trust-badge verified">${done}/5</span>
      </div>
      <div class="mt-4 grid gap-2 sm:grid-cols-5">
        ${OBLIGATORY_PRAYERS.map((name, index) => `
          <label class="muallaf-check-item">
            <input type="checkbox" data-prayer-log="${name}" ${log[name] ? "checked" : ""}>
            <span>${state.lang === "pl" ? OBLIGATORY_PRAYERS_PL[index] : name}</span>
          </label>
        `).join("")}
      </div>
    </section>
  `;
}

function prayerModeTabsHtml() {
  return `
    <div class="prayer-mode-tabs" role="tablist" aria-label="${tx("Zakładki Prayer Mode", "Prayer Mode tabs")}">
      ${PRAYER_MODE_TABS.map(tab => `<button class="${state.prayerModeTab === tab.id ? "active" : ""}" data-prayer-tab="${tab.id}" role="tab">${state.lang === "pl" ? tab.pl : tab.en}</button>`).join("")}
    </div>
  `;
}

function prayerTodayPanel() {
  const log = prayerLogForToday();
  const done = OBLIGATORY_PRAYERS.filter(name => log[name]).length;
  return `
    <section class="prayer-mode-grid">
      <article class="panel p-5">
        <p class="text-xs font-black uppercase tracking-wide text-emerald-600">${tx("Dzisiaj", "Today")}</p>
        <h2 class="mt-1 text-2xl font-black">${tx("Modlitwa i spokojny rytm", "Prayer and calm rhythm")}</h2>
        <p class="mt-2 text-sm text-[var(--muted)]">${tx("Zaznacz modlitwy, sprawdź czas i przejdź do przewodnika bez szukania po aplikacji.", "Track prayers, check time, and open the guide without hunting through the app.")}</p>
        <div class="mt-4 text-4xl font-black text-[var(--accent)]">${done}/5</div>
        <button class="big-action mt-4 w-full bg-emerald-500 text-white" data-prayer-tab="guide">${tx("Rozpocznij przewodnik", "Start guide")}</button>
      </article>
      <div>
        ${prayerJournalHtml()}
        <article id="todayPrayerPreview" class="panel p-5"><div class="skeleton h-32 w-full"></div></article>
      </div>
    </section>
  `;
}

function prayerGuidePanel() {
  const selected = PRAYER_GUIDE_PRAYERS.find(p => p.id === prayerGuidePrayer) || PRAYER_GUIDE_PRAYERS[0];
  prayerGuidePrayer = selected.id;
  const saved = state.prayerGuideProgress?.[selected.id];
  if (Number.isInteger(saved) && saved !== prayerGuideStep) prayerGuideStep = saved;
  const steps = prayerGuideStepsFor(selected);
  prayerGuideStep = Math.max(0, Math.min(prayerGuideStep, steps.length - 1));
  const step = steps[prayerGuideStep];
  const progress = Math.round(((prayerGuideStep + 1) / steps.length) * 100);

  return `
    <section class="prayer-guide-shell ${state.prayerFocusMode ? "prayer-focus-mode" : ""}">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="prayer-guide-selector">
        ${PRAYER_GUIDE_PRAYERS.map(p => `
          <button class="mode-btn ${p.id === selected.id ? "active" : ""}" data-prayer-guide="${p.id}">
            ${state.lang === "pl" ? p.pl : p.en}
            <span>${p.rakat} raka'at</span>
          </button>
        `).join("")}
        </div>
        <button id="togglePrayerFocus" class="big-action border border-[var(--line)] bg-[var(--surface)]">${state.prayerFocusMode ? tx("Wyjdź z pełnego ekranu", "Exit focus") : tx("Pełny ekran", "Focus view")}</button>
      </div>
      <article class="prayer-guide-card ${state.prayerFocusMode ? "prayer-guide-card-focus" : ""}">
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-xs font-black uppercase text-[var(--muted)]">${state.lang === "pl" ? selected.pl : selected.en} · ${selected.rakat} raka'at</p>
            <h2 class="mt-1 text-2xl font-black">${state.lang === "pl" ? step.titlePl : step.titleEn}</h2>
          </div>
          <span class="prayer-guide-count">${prayerGuideStep + 1}/${steps.length}</span>
        </div>
        <div class="mt-4 h-2 overflow-hidden rounded-full bg-emerald-100">
          <div class="h-full bg-emerald-500 transition-all" style="width:${progress}%"></div>
        </div>
        <p class="mt-5 text-[var(--muted)]">${state.lang === "pl" ? step.bodyPl : step.bodyEn}</p>
        ${step.ar ? `<div class="prayer-guide-arabic arabic">${step.ar.replace(/\n/g, "<br>")}</div>` : ""}
        ${step.tr ? `<p class="mt-3 text-lg font-black text-[var(--accent)]">${step.tr}</p>` : ""}
        <p class="mt-2 text-sm text-[var(--muted)]">${state.lang === "pl" ? step.meaningPl : step.meaningEn}</p>
        <div class="mt-6 grid gap-2 sm:grid-cols-3">
          <button class="big-action border border-[var(--line)] bg-[var(--surface)]" id="prayerPrev" ${prayerGuideStep === 0 ? "disabled" : ""}>${tx("Wstecz", "Back")}</button>
          <button class="big-action border border-[var(--line)] bg-[var(--surface)]" id="prayerSpeak" ${step.ar ? "" : "disabled"}>${t("play")}</button>
          <button class="big-action bg-emerald-500 text-white" id="prayerNext">${prayerGuideStep === steps.length - 1 ? tx("Zakończ", "Finish") : tx("Dalej", "Next")}</button>
        </div>
      </article>
    </section>
  `;
}

function wuduPanel() {
  const done = new Set(state.wuduChecklist || []);
  return `
    <section class="panel p-5">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 class="text-2xl font-black">${tx("Wudu przed modlitwą", "Wudu before prayer")}</h2>
          <p class="mt-2 text-sm text-[var(--muted)]">${tx("Edukacyjna checklista dla początkującego. W szczegółach szkoły prawne mogą się różnić.", "Educational beginner checklist. Legal-school details can differ.")}</p>
        </div>
        <span class="trust-badge context-dependent">${done.size}/${WUDU_STEPS.length}</span>
      </div>
      <div class="mt-4 grid gap-2">
        ${WUDU_STEPS.map((step, index) => `
          <label class="muallaf-check-item">
            <input type="checkbox" data-wudu-step="${step.id}" ${done.has(step.id) ? "checked" : ""}>
            <span><strong>${index + 1}.</strong> ${state.lang === "pl" ? step.pl : step.en}</span>
          </label>
        `).join("")}
      </div>
      <div class="religious-risk-note">${tx(RELIGIOUS_NOTICE.pl, RELIGIOUS_NOTICE.en)}</div>
    </section>
  `;
}

function qiblaPanel() {
  return `
    <section class="grid gap-4">
      <article class="panel p-5">
        <h2 class="text-2xl font-black">${tx("Qibla i czasy modlitw", "Qibla and prayer times")}</h2>
        <p class="mt-2 text-sm text-[var(--muted)]">${tx("GPS jest opcjonalny i uruchamia sie dopiero po kliknieciu. Domyslnie uzywamy neutralnie Makkah i Madinah.", "GPS is optional and starts only after a click. By default, Makkah and Madinah are used neutrally.")}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <button id="useGpsPrayerLocation" class="big-action bg-emerald-500 text-white">${tx("Użyj GPS", "Use GPS")}</button>
          <button id="manualPrayerLocation" class="big-action border border-[var(--line)] bg-[var(--surface)]">${tx("Wpisz ręcznie", "Enter manually")}</button>
        </div>
        <p id="gpsPrayerStatus" class="mt-3 text-sm text-[var(--muted)]">${state.gpsPrayerLocation ? tx("GPS zapisany lokalnie.", "GPS saved locally.") : tx("GPS nieaktywny. Mozesz zostac przy Makkah/Madinah.", "GPS inactive. You can stay with Makkah/Madinah.")}</p>
      </article>
      <div class="grid gap-4 lg:grid-cols-2" id="prayerTimesGrid">
        ${getPrayerLocations().map(loc => `<div id="prayer-${loc.id}" class="panel p-5">
          <div class="grid gap-3">
            <div class="skeleton h-6 w-2/3"></div>
            <div class="skeleton h-28 w-full"></div>
            <p class="text-sm font-bold text-[var(--muted)]">${tx("Pobieranie czasow modlitw z aladhan.com...", "Loading prayer times from aladhan.com...")}</p>
          </div>
        </div>`).join("")}
      </div>
    </section>
  `;
}

function prayerHistoryPanel() {
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = formatDateOffset(-index);
    const log = state.prayerLog?.[date] || {};
    const done = OBLIGATORY_PRAYERS.filter(name => log[name]).length;
    return { date, done };
  });
  return `
    <section class="panel p-5">
      <h2 class="text-2xl font-black">${tx("Ostatnie 7 dni", "Last 7 days")}</h2>
      <p class="mt-2 text-sm text-[var(--muted)]">${tx("Lokalna historia modlitw i ukończonych sesji przewodnika.", "Local history of prayers and completed guide sessions.")}</p>
      <div class="mt-4 grid gap-2">
        ${days.map(day => `
          <div class="prayer-history-row">
            <span>${day.date}</span>
            <strong>${day.done}/5</strong>
          </div>
        `).join("")}
      </div>
      <div class="mt-4 soft-panel p-4">
        <p class="text-sm font-black">${tx("Sesje przewodnika", "Guide sessions")}</p>
        <p class="mt-1 text-3xl font-black text-[var(--accent)]">${state.prayerGuideSessions || 0}</p>
      </div>
    </section>
  `;
}

function prayerModePanel() {
  if (state.prayerModeTab === "guide") return prayerGuidePanel();
  if (state.prayerModeTab === "wudu") return wuduPanel();
  if (state.prayerModeTab === "qibla") return qiblaPanel();
  if (state.prayerModeTab === "history") return prayerHistoryPanel();
  return prayerTodayPanel();
}

function bindPrayerModeEvents() {
  view.querySelectorAll("[data-prayer-tab]").forEach(btn => btn.addEventListener("click", () => {
    state.prayerModeTab = btn.dataset.prayerTab;
    saveState();
    prayer();
  }));
  view.querySelectorAll("[data-prayer-log]").forEach(input => input.addEventListener("change", () => {
    const log = prayerLogForToday();
    log[input.dataset.prayerLog] = input.checked;
    state.prayerHistory = [{ date: today(), done: OBLIGATORY_PRAYERS.filter(name => log[name]).length }, ...(state.prayerHistory || [])].slice(0, 30);
    saveState();
    prayer();
  }));
  view.querySelectorAll("[data-wudu-step]").forEach(input => input.addEventListener("change", () => {
    const done = new Set(state.wuduChecklist || []);
    if (input.checked) done.add(input.dataset.wuduStep);
    else done.delete(input.dataset.wuduStep);
    state.wuduChecklist = [...done];
    saveState();
    prayer();
  }));
  view.querySelectorAll("[data-prayer-guide]").forEach(btn => btn.addEventListener("click", () => {
    prayerGuidePrayer = btn.dataset.prayerGuide;
    prayerGuideStep = state.prayerGuideProgress?.[prayerGuidePrayer] || 0;
    state.lastPrayerGuide = prayerGuidePrayer;
    saveState();
    prayer();
  }));
  $("#prayerPrev")?.addEventListener("click", () => {
    prayerGuideStep = Math.max(0, prayerGuideStep - 1);
    state.prayerGuideProgress = { ...(state.prayerGuideProgress || {}), [prayerGuidePrayer]: prayerGuideStep };
    saveState();
    prayer();
  });
  $("#prayerSpeak")?.addEventListener("click", () => {
    const selected = PRAYER_GUIDE_PRAYERS.find(p => p.id === prayerGuidePrayer) || PRAYER_GUIDE_PRAYERS[0];
    const steps = prayerGuideStepsFor(selected);
    const step = steps[prayerGuideStep];
    if (step?.ar) {
      showToast(tx("Odtwarzanie...", "Playing..."));
      speakArabic(step.ar.replace(/<[^>]*>?/gm, ' ').replace(/\n/g, " "));
    }
  });
  $("#prayerNext")?.addEventListener("click", () => {
    const selected = PRAYER_GUIDE_PRAYERS.find(p => p.id === prayerGuidePrayer) || PRAYER_GUIDE_PRAYERS[0];
    const steps = prayerGuideStepsFor(selected);
    if (prayerGuideStep < steps.length - 1) {
      prayerGuideStep += 1;
      state.prayerGuideProgress = { ...(state.prayerGuideProgress || {}), [selected.id]: prayerGuideStep };
      saveState();
      prayer();
      return;
    }
    state.prayerGuideSessions = (state.prayerGuideSessions || 0) + 1;
    state.lastPrayerGuide = selected.id;
    state.prayerGuideProgress = { ...(state.prayerGuideProgress || {}), [selected.id]: 0 };
    addPoints(35, false);
    checkBadges();
    saveState();
    showToast(tx("Modlitwa ukończona krok po kroku", "Prayer completed step by step"));
    confetti();
    prayerGuideStep = 0;
    prayer();
  });
  $("#togglePrayerFocus")?.addEventListener("click", () => {
    state.prayerFocusMode = !state.prayerFocusMode;
    saveState();
    prayer();
  });
  $("#useGpsPrayerLocation")?.addEventListener("click", requestPrayerGps);
  $("#manualPrayerLocation")?.addEventListener("click", () => {
    const status = $("#gpsPrayerStatus");
    if (status) status.textContent = tx("Tryb ręczny: używamy zapisanych lokalizacji Makkah i Madinah.", "Manual mode: using saved Makkah and Madinah locations.");
  });
}

async function requestPrayerGps() {
  const status = $("#gpsPrayerStatus");
  if (!navigator.geolocation) {
    if (status) status.textContent = tx("Ta przeglądarka nie obsługuje GPS. Użyj wpisania ręcznego.", "This browser does not support GPS. Use manual entry.");
    return;
  }
  if (status) status.textContent = tx("Pytam przeglądarkę o lokalizację...", "Asking the browser for location...");
  navigator.geolocation.getCurrentPosition((position) => {
    const loc = {
      id: "gps",
      label: tx("Moja lokalizacja", "My location"),
      city: tx("Moja lokalizacja", "My location"),
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      lat: String(position.coords.latitude),
      lng: String(position.coords.longitude),
      method: 2
    };
    state.prayerLocationMode = "gps";
    state.gpsPrayerLocation = loc;
    state.prayerLocations = [loc, ...PRAYER_LOCATIONS];
    saveState();
    prayer();
  }, () => {
    if (status) status.textContent = tx("Nie udało się pobrać GPS. Zostaje ręczny fallback.", "Could not get GPS. Manual fallback remains available.");
  }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 });
}

async function hydratePrayerTimesPreview() {
  if (state.prayerModeTab !== "today" && state.prayerModeTab !== "qibla") return;
  const activeLocations = getPrayerLocations();
  for (const loc of activeLocations) {
    try {
      const [timings, qibla] = await Promise.all([fetchPrayerTimes(loc), fetchQibla(loc)]);
      const nextKey = getNextPrayer(timings);
      const target = state.prayerModeTab === "today" ? $("#todayPrayerPreview") : $(`#prayer-${loc.id}`);
      if (target) target.innerHTML = prayerTimesCard(loc.label, timings, qibla, nextKey, loc.tz, loc.id);
    } catch {
      const target = state.prayerModeTab === "today" ? $("#todayPrayerPreview") : $(`#prayer-${loc.id}`);
      if (target) {
        target.innerHTML = `
          <div class="grid gap-3 text-center">
            <p class="text-[var(--muted)]">${tx("Nie udalo sie pobrac czasow. Sprawdz polaczenie z internetem.", "Could not load prayer times. Check your internet connection.")}</p>
            <button class="big-action bg-emerald-500 text-white" data-prayer-retry>${tx("Sprobuj ponownie", "Try again")}</button>
          </div>
        `;
        target.querySelector("[data-prayer-retry]")?.addEventListener("click", prayer);
      }
    }
    if (state.prayerModeTab === "today") break;
  }
}

async function prayerMode() {
  if (!PRAYER_MODE_TABS.some(tab => tab.id === state.prayerModeTab)) state.prayerModeTab = "today";

  view.innerHTML = `
    <div class="mb-4">
      <p class="text-xs font-black uppercase tracking-wide text-emerald-600">${tx("Centrum modlitwy", "Prayer center")}</p>
      <h1 class="text-3xl font-black">${tx("Prayer Mode", "Prayer Mode")}</h1>
      <p class="text-[var(--muted)]">${tx("Dziennik, wudu, qibla, czasy i przewodnik salat w jednym miejscu.", "Journal, wudu, qibla, times and salat guide in one place.")}</p>
      <p class="text-xs text-[var(--muted)] mt-2">${tx(RELIGIOUS_NOTICE.pl, RELIGIOUS_NOTICE.en)}</p>
    </div>
    ${prayerModeTabsHtml()}
    <div class="mt-4">${prayerModePanel()}</div>
  `;
  bindPrayerModeEvents();
  await hydratePrayerTimesPreview();
}

async function prayer() {
  return prayerMode();
}

// ============================================================
// 99 NAMES OF ALLAH — Asma ul-Husna
// ============================================================
function renderAsmaulList() {
  const search = (state.asmaulSearchQuery || "").toLowerCase();
  const filtered = asmaulHusna.filter(
    (n) =>
      !search ||
      n.tr.toLowerCase().includes(search) ||
      (state.lang === "pl" ? n.pl : n.en).toLowerCase().includes(search)
  );
  return filtered
    .map(
      (n) => `
      <div class="asma-card">
        <div class="asma-number">${n.n}</div>
        <div class="asma-arabic">${n.ar}</div>
        <div class="asma-name">${n.tr}</div>
        <div class="asma-meaning">${state.lang === "pl" ? n.pl : n.en}</div>
        <div class="text-xs text-[var(--muted)] mt-1 italic">${state.lang === "pl" ? n.tafsir_pl || "" : n.tafsir_en || ""}</div>
      </div>
    `
    )
    .join("");
}

function asmaul() {
  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">☪ ${tx("99 Imion Allaha", "99 Names of Allah")}</h1>
      <p class="text-[var(--muted)]">${tx("أَسْمَاءُ اللَّهِ الْحُسْنَى — Asma ul-Husna", "أَسْمَاءُ اللَّهِ الْحُSنَى — Asma ul-Husna")}</p>
    </div>
    <input id="asmaSearch" type="search" class="w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3 mb-4" placeholder="${tx("Szukaj imienia...", "Search name...")}" value="${escapeHtml(state.asmaulSearchQuery || "")}" />
      <p class="mt-2 text-xs text-[var(--muted)]">${tx("Tekst arabski zawiera harakat (znaki wymowy) dla pierwszych 10 imion. Pozostale w toku weryfikacji.", "Arabic text includes harakat (pronunciation marks) for the first 10 names. The rest are being verified.")}</p>
    <div id="asmaGrid" class="asma-grid">${renderAsmaulList()}</div>
  `;

  $("#asmaSearch")?.addEventListener("input", (e) => {
    // BOLT OPTIMIZATION: Debounce the list filtering to improve UI responsiveness during typing
    debouncedAsmaSearch();
  });
}

// ============================================================
// TAJWEED — Rules of Quran Recitation
// ============================================================
function tajweed() {
  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Zasady Tadżwid", "Tajweed Rules")} 🔤</h1>
      <p class="text-[var(--muted)]">${tx("تَجْوِيد — Reguły prawidłowej recytacji Koranu", "تَجْوِيد — Rules for correct Quran recitation")}</p>
    </div>
    <div class="panel p-5 mb-5">
      <h2 class="text-lg font-black mb-2">${tx("Czym jest Tadżwid?", "What is Tajweed?")}</h2>
      <p class="text-sm text-[var(--muted)] mb-3">${tx(
        "Tadżwid (تَجْوِيد) to zbiór zasad poprawnej recytacji Koranu. Słowo dosłownie oznacza \"ulepszanie\" lub \"robienie czegoś dobrze\". Dzięki tadżwidowi każda litera arabska wymawiana jest dokładnie tak, jak za czasów Proroka ﷺ, z właściwą długością samogłosek, akcentem i właściwościami głosek.",
        "Tajweed (تَجْوِيد) is the set of rules for correct Quran recitation. The word literally means \"to improve\" or \"to do something well.\" Through tajweed, every Arabic letter is pronounced exactly as in the time of the Prophet ﷺ, with the right vowel lengths, emphasis, and phonetic properties."
      )}</p>
      <p class="text-sm text-[var(--muted)] mb-3">${tx(
        "Dla amatora: nie musisz znać wszystkich zasad naraz. Zacznij od słuchania recytatorów (np. Mishary Rashida al-Afasy) i stopniowo ucz się reguł. Każdy błąd popełniony w dobrej wierze jest wybaczalny — ważna jest intencja uczenia się.",
        "For a beginner: you don't need to know all the rules at once. Start by listening to reciters (e.g., Mishary Rashid al-Afasy) and gradually learn the rules. Every mistake made in good faith is forgivable — what matters is the intention to learn."
      )}</p>
      <div class="grid gap-2 sm:grid-cols-3 text-center text-sm">
        <div class="soft-panel p-3"><p class="font-black text-[var(--accent)]">${tx("1. Makharaj", "1. Makhraj")}</p><p class="text-[var(--muted)] text-xs">${tx("Miejsce wymowy litery", "Place of articulation")}</p></div>
        <div class="soft-panel p-3"><p class="font-black text-[var(--accent)]">${tx("2. Sifat", "2. Sifaat")}</p><p class="text-[var(--muted)] text-xs">${tx("Właściwości głoski", "Phonetic properties")}</p></div>
        <div class="soft-panel p-3"><p class="font-black text-[var(--accent)]">${tx("3. Madda", "3. Madd")}</p><p class="text-[var(--muted)] text-xs">${tx("Przedłużenie samogłoski", "Vowel elongation")}</p></div>
      </div>
    </div>
    ${tajweedRules.map(rule => `
      <div class="tajweed-card" style="border-left: 4px solid ${rule.color || 'var(--accent)'}">
        <div class="tajweed-rule-name" style="color:${rule.color || 'var(--accent)'}">${state.lang === 'pl' ? rule.name_pl : rule.name_en}</div>
        <p class="text-[var(--muted)] text-sm mb-3">${state.lang === 'pl' ? rule.desc_pl : rule.desc_en}</p>
        ${rule.example_ar ? `<div class="tajweed-arabic-example">${rule.example_ar}
          <div class="text-sm text-[var(--muted)] mt-1 text-left" style="direction:ltr">${rule.example_tr || ''}</div>
        </div>` : ''}
        ${rule.letters ? `<p class="text-xs text-[var(--muted)] mt-2"><strong>${tx("Litery:", "Letters:")}</strong> ${rule.letters}</p>` : ''}
      </div>
    `).join('')}
  `;
}

// ============================================================
// SEERAH — Life of the Prophet ﷺ
// ============================================================
function seerah() {
  const dayIndex = Math.floor(Date.now() / 86400000);
  const dailyHadiths = Array.from({length: 5}, (_, i) => islamicHadith[(dayIndex * 5 + i) % islamicHadith.length]).filter(Boolean);

  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Seerah — Życie Proroka ﷺ", "Seerah — Life of the Prophet ﷺ")} 🌙</h1>
      <p class="text-[var(--muted)]">${tx("Kluczowe wydarzenia z życia Proroka Muhammada ﷺ", "Key events from the life of Prophet Muhammad ﷺ")}</p>
    </div>
    <div class="panel p-5 mb-5">
      <h2 class="text-lg font-black mb-2">${tx("Czym jest Seerah?", "What is Seerah?")}</h2>
      <p class="text-sm text-[var(--muted)] mb-3">${tx(
        "Seerah (سِيرَة) to biografia Proroka Muhammada ﷺ. Słowo oznacza dosłownie \"droga\" lub \"sposób życia\". Seerah obejmuje jego narodziny (~570 n.e.), dzieciństwo, wiek dorosły, objawienie Koranu, emigrację do Medyny i budowę pierwszej wspólnoty muzułmańskiej.",
        "Seerah (سِيرَة) is the biography of Prophet Muhammad ﷺ. The word literally means \"path\" or \"way of life.\" Seerah covers his birth (~570 CE), childhood, adulthood, the revelation of the Quran, the migration to Medina, and the building of the first Muslim community."
      )}</p>
      <p class="text-sm text-[var(--muted)] mb-3">${tx(
        "Dlaczego Seerah jest ważna? Poznanie życia Proroka ﷺ pomaga zrozumieć Koran w kontekście, uczyć się od jego przykładu (sunna) i umacniać wiarę. Jego życie to praktyczny przewodnik islamu — jak się modlić, jak traktować innych, jak zachować się w trudnościach.",
        "Why does Seerah matter? Knowing the life of the Prophet ﷺ helps understand the Quran in context, learn from his example (sunnah), and strengthen faith. His life is a practical guide to Islam — how to pray, how to treat others, how to behave in hardship."
      )}</p>
      <div class="grid gap-2 sm:grid-cols-2 text-sm">
        <div class="soft-panel p-3"><p class="font-black">🕌 ${tx("Mekka → Medyna", "Mecca → Medina")}</p><p class="text-[var(--muted)] text-xs">${tx("Hidżra (622 n.e.) — punkt zwrotny islamu", "Hijra (622 CE) — turning point of Islam")}</p></div>
        <div class="soft-panel p-3"><p class="font-black">📖 ${tx("Pierwsze objawienie", "First Revelation")}</p><p class="text-[var(--muted)] text-xs">${tx("610 n.e., jaskinia Hira — Iqra! (Czytaj!)", "610 CE, Cave of Hira — Iqra! (Read!)")}</p></div>
        <div class="soft-panel p-3"><p class="font-black">⚔️ ${tx("Bitwy islamu", "Battles of Islam")}</p><p class="text-[var(--muted)] text-xs">${tx("Badr, Uhud, Khandaq — obrona wspólnoty", "Badr, Uhud, Khandaq — defense of the community")}</p></div>
        <div class="soft-panel p-3"><p class="font-black">🌙 ${tx("Śmierć Proroka ﷺ", "Death of the Prophet ﷺ")}</p><p class="text-[var(--muted)] text-xs">${tx("632 n.e. — Medyna, po ostatniej pielgrzymce", "632 CE — Medina, after the Farewell Pilgrimage")}</p></div>
      </div>
    </div>
    <h2 class="text-xl font-black mb-3">${tx("Kalendarium", "Timeline")}</h2>
    <div class="seerah-timeline">
      ${seerahTimeline.map(ev => `
        <div class="seerah-event">
          <div class="seerah-year">${ev.year}${ev.hijri ? ` / ${ev.hijri} H` : ''}</div>
          <div class="seerah-title">${state.lang === 'pl' ? ev.pl : ev.en}</div>
          <div class="seerah-desc">${state.lang === 'pl' ? (ev.desc_pl || '') : (ev.desc_en || '')}</div>
        </div>
      `).join('')}
    </div>
    <div class="panel p-5 mt-6">
      <h2 class="text-xl font-black mb-4">${tx("Hadisy Dnia", "Daily Hadiths")}</h2>
      <p class="text-xs text-[var(--muted)] mb-4">${tx("Zweryfikowana lista wybranych hadisow. To nie jest pelny kanoniczny korpus hadisow.", "Verified curated hadith list. This is not a complete canonical hadith corpus.")}</p>
      ${dailyHadiths.map(h => `
        <div class="mb-4 pb-4 border-b border-[var(--border)]">
          <p class="text-base font-bold arabic text-right leading-relaxed" style="direction:rtl">${h.ar}</p>
          <p class="text-sm text-[var(--muted)] mt-1 italic">${state.lang === 'pl' ? h.pl : h.en}</p>
          <p class="text-xs font-bold text-[var(--accent)] mt-1">${h.source} <span class="trust-badge verified">${h.grade?.toUpperCase() || "UNGRADED"}</span></p>
          <p class="quality-meta">${hadithQuality(h).source_type} · ${hadithQuality(h).collection} · ${hadithQuality(h).verified ? trustLabel(CONTENT_TRUST.VERIFIED) : trustLabel(CONTENT_TRUST.UNVERIFIED)} · ${tx("Sprawdzone:", "Checked:")} ${hadithQuality(h).reviewed_at}</p>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================
// PILLARS OF ISLAM & IMAN
// ============================================================
function pillars() {
  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Filary Islamu i Imanu", "Pillars of Islam & Iman")} ⭐</h1>
      <p class="text-[var(--muted)]">${tx("5 Filarów Islamu + 6 Filarów Wiary", "5 Pillars of Islam + 6 Pillars of Faith")}</p>
    </div>
    <h2 class="text-xl font-black mb-4">${tx("5 Filarów Islamu", "5 Pillars of Islam")}</h2>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-8">
      ${pillarsOfIslam.map(p => `
        <div class="pillar-card">
          <div class="pillar-number">${p.n}</div>
          <div class="pillar-arabic">${p.ar}</div>
          <div class="pillar-name">${p.tr}</div>
          <div class="pillar-name text-[var(--muted)]">${state.lang === 'pl' ? p.pl : p.en}</div>
          <div class="pillar-desc">${state.lang === 'pl' ? p.desc_pl : p.desc_en}</div>
        </div>
      `).join('')}
    </div>
    <h2 class="text-xl font-black mb-4">${tx("6 Filarów Imanu (Wiary)", "6 Pillars of Iman (Faith)")}</h2>
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      ${pillarsOfIman.map(p => `
        <div class="pillar-card">
          <div class="pillar-number">${p.n}</div>
          <div class="pillar-arabic">${p.ar}</div>
          <div class="pillar-name">${p.tr}</div>
          <div class="pillar-name text-[var(--muted)]">${state.lang === 'pl' ? p.pl : p.en}</div>
          <div class="pillar-desc">${state.lang === 'pl' ? p.desc_pl : p.desc_en}</div>
        </div>
      `).join('')}
    </div>
  `;
}



init();
