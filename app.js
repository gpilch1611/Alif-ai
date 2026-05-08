import { arabicAlphabet, words, dailyTasks, asmaulHusna, islamicHadith, seerahTimeline, tajweedRules, pillarsOfIslam, pillarsOfIman, islamicMonths, newMuslimSteps, halalHaramData, islamicFaq } from "./data.js";

const GROQ_API_KEY = "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";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const AI_SYSTEM_PROMPT_PL = `Jesteś ekspertem od języka arabskiego, islamu i kultury muzułmańskiej w aplikacji 'Alif AI'. Pomagasz osobom uczącym się arabskiego i islamu — zwłaszcza konwertytom i nowicjuszom.
Zawsze odpowiadaj TYLKO w języku polskim. Bądź przyjacielski, ciepły i zachęcający.
NIGDY nie używaj surowych linków markdown ani nie generuj zbędnego kodu.

Zasady generowania treści:
FISZKI: Format WYŁĄCZNIE "arabskie_słowo — polskie_tłumaczenie", jedna para na linię, BEZ numerów, BEZ "Strona przednia/tylna", BEZ zdań.
Przykład poprawny: كِتَاب — książka
BAJKA/HISTORIA: każda arabska linia, BEZPOŚREDNIO pod nią polskie tłumaczenie, pusta linia między parami. Na końcu słowniczek.
CIEKAWOSTKA: jeden krótki fakt (2-4 zdania), NIE lista fiszek.
ISLAM/MODLITWA/KORAN: odpowiadaj merytorycznie, z szacunkiem i precyzją.`;
const AI_SYSTEM_PROMPT_EN = `You are an expert in Arabic language, Islam and Muslim culture inside the app 'Alif AI'. You help people learning Arabic and Islam — especially converts and beginners.
Always reply ONLY in English. Be friendly, warm and encouraging.
NEVER use raw markdown links or generate unnecessary code.

Content generation rules:
FLASHCARDS: Format ONLY "arabic_word — english_translation", one pair per line, NO numbers, NO "Front/Back" labels, NO sentences.
Correct example: كِتَاب — book
STORY/BOOK: each Arabic line, IMMEDIATELY followed by English translation on next line, blank line between pairs. Mini glossary at end.
CULTURE FACT: one short fact (2-4 sentences), NOT a list of flashcards.
ISLAM/PRAYER/QURAN: answer accurately, with respect and precision.`;

const $ = (selector) => document.querySelector(selector);
const view = $("#view");
const nav = $("#bottomNav");
const modal = $("#letterModal");
const modalContent = $("#modalContent");
const STORAGE_KEY = "alif-ai-state";
const THEMES = ["light", "dark", "romantic"];
const THEME_COLOR = {
  light: "#f7f7f7",
  dark: "#071a24",
  romantic: "#ffd4e5"
};

const navItems = [
  ["home",    "⌂",  "navHome"],
  ["islam",   "☪",  "navIslam"],
  ["lessons", "Aa", "navLessons"],
  ["culture", "✦",  "navCulture"],
  ["games",   "◎",  "navGames"]
];

const secondaryNavItems = [];

const ISLAM_ROUTES = ["islam","koran","dhikr","asmaul","tajweed","seerah","pillars","muallaf","halalharam","islamfaq","prayer","prayerGuide"];

const ROMANTIC_LINES = [
  // short
  "Miss you 💕",
  "Habibi ❤️",
  "Thinking of you 🌸",
  "Sayang 🌺",
  "I miss you so much 💙",
  "You are my calm 🌿",
  "Rindu 💕",
  "Always you ❤️",
  "My favourite person 🌸",
  "Can't wait 🛫",
  "Counting the days 📅",
  "Forever and always 💕",
  "You, always 🌺",
  "Home is you 🏡❤️",
  "Miss your smile 🌸",
  "Near or far ❤️",
  "All of you 💕",
  "Just you 🌟",
  "Worth every mile 💙",
  "Cinta ❤️",
  "My heart, your home 🏡",
  "Still you 💕",
  "Every single day 🌸",
  "You first 🌺",
  "Always on my mind 💭❤️",
  // long
  "Distance means nothing when someone means everything — 10 700 km feels like nothing, habibi ❤️",
  "Somewhere across the ocean, someone is thinking of you right now 🌊💕",
  "Two cities, one heart. Borzęta and Surabaya are closer than the world thinks 🌸",
  "Learning Arabic so our words can travel further than miles ever could 📖❤️",
  "Rindu itu berat, tapi cinta lebih kuat — missing you is heavy, but love is stronger 🌺",
  "Every letter of the Arabic alphabet learned is a step closer to you, sayang 💐",
  "The distance between Poland and Indonesia is just a number — love has no coordinates 🌍",
  "Alhamdulillah for the technology that lets hearts stay close across continents 🤍",
  "Borzęta to Surabaya: two dots on a map, one unbreakable thread between them 💕",
  "You make every timezone worth living in ❤️",
  "I carry you with me in every surah I read and every letter I trace, habibi 📿",
  "10 700 km apart — yet you are the first thought every morning 🌅",
  "The stars above Surabaya are the same ones shining over Poland tonight, sayang 🌟",
  "Love that crosses oceans doesn't need a passport 🛫💕",
  "In sha'a Allah, soon the countdown reaches zero and the distance becomes a memory 🌸",
  "Every day of learning is a love letter written in Arabic script ✍️❤️",
  "Missing you tastes like Indonesian rain and Polish autumn — both beautiful, both yours 🌧️🍂",
  "The longest journey is from the mind to the heart — you made mine effortless, habibi 💕",
  "Aku rindu kamu more than words in any language can say 🌺",
  "Two time zones, one dream: the moment the distance disappears 🕐🕖",
  "Every Arabic word I learn feels like a new way to say I love you ❤️",
  "Surabaya sunsets and Borzęta mornings — I carry both in my heart 🌅",
  "Love is the only thing that gets stronger the further it travels 💪❤️",
  "Masya Allah — what a blessing to love someone this deeply across this much distance 🤲",
  "Some things are worth every kilometer of waiting, habibi 🌸",
  "The plane ticket is just a formality — my heart is already there 🛫",
  "Rindu itu nyata — missing you is real, vivid, and makes me learn faster 📖💕",
  "They say love conquers all — apparently that includes 10 700 km ❤️",
  "Every time I learn a new Arabic word I wonder if you'd smile hearing me say it 🌸",
  "Somewhere there's a window where someone is looking at the same moon as me tonight 🌙💕",
  "The best thing about learning Arabic is imagining the day I use it with you 💙",
  "Timezone difference: huge. Love: bigger 🌍❤️",
  "11.06.2026 — just a date on a calendar that holds a whole universe of feeling 🗓️🌸",
  "I'd cross 10 700 km again and again without hesitation, habibi 💕",
  "Some loves are big enough to fill the space between continents ❤️",
  "Counting hours, not because I'm impatient, but because every hour matters 🕰️💕",
  "This distance is just a story we'll laugh about one day, sayang 🌺",
  "If missing you were an Arabic word, it would be the most beautiful one in the alphabet 📖❤️"
];

const I18N = {
  pl: {
    navHome: "Start", navIslam: "Islam", navKoran: "Qur'an", navAlphabet: "Alfabet", navLessons: "Lekcje", navFlashcards: "Fiszki", navSpeech: "Wymowa", navWriting: "Pisanie", navAdventure: "Przygoda", navBooks: "Książki", navCulture: "Kultura", navGames: "Gry", navBadges: "Odznaki", navSettings: "Ustawienia", navDhikr: "Dhikr", navPrayer: "Modlitwy", navAsmaul: "99 Imion", navTajweed: "Tadżwid", navSeerah: "Seerah", navPillars: "Filary", navRoots: "Korzenie", navMuallaf: "Nowy muzułmanin", navHalalHaram: "Halal & Haram", navIslamFaq: "FAQ islamu",
    install: "Zainstaluj", settings: "Ustawienia", language: "Język", polish: "Polski", english: "Angielski", resetToday: "Reset dzisiejszego progresu", resetStreak: "Reset streak", exportProgress: "Eksport postępu", importProgress: "Import postępu", clearData: "Wyczyść wszystkie dane",
    exportHint: "Pobierz plik JSON z całym postępem.", importHint: "Wybierz wcześniej wyeksportowany plik JSON.", dangerZone: "Strefa ostrożności", saved: "Zapisano", imported: "Zaimportowano dane", cleared: "Dane wyczyszczone",
    welcome: "Witaj w ألف AI", homeTitle: "Islam — krok po kroku", homeLead: "Arabski jest narzędziem — bo czytanie Koranu w oryginale to obowiązek każdego muzułmanina. Ucz się liter, sur, dhikru, historii islamu i modlitw.",
    pillarsQuiz: "Quiz: Filary Islamu", pillarsQuizDesc: "5 Filarów i 6 Filarów Imanu",
    surahQuiz: "Quiz: Sury Koranu", surahQuizDesc: "Rozpoznaj arabskie nazwy sur",
    dhikrGame: "Szybki Dhikr", dhikrGameDesc: "33 razy — jak najszybciej!", dhikrGameStart: "Dotknij aby zacząć", dhikrGameResult: "Czas",
    streak: "Seria dni", level: "Poziom", alphabetProgress: "Alfabet", todayTask: "Dzisiejsze zadanie", start: "Zaczynam", progress: "Postęp", points: "pkt",
    aiAssistant: "AI Assistant", aiPlaceholder: "Poproś o fiszki, quiz, historyjkę albo ciekawostkę...", send: "Wyślij", aiHello: "Cześć! Jestem Twoim Alif AI Assistantem. Mogę stworzyć fiszki, mini-lekcję, quiz, historyjkę albo ciekawostkę dnia.",
    addFlashcards: "Dodaj do fiszek", saveBook: "Zapisz jako nową książeczkę", addAdventure: "Dodaj do Naszej Przygody", addCulture: "Dodaj jako ciekawostkę",
    more: "Więcej", play: "Odtwórz", check: "Sprawdź", clear: "Wyczyść", next: "Następna", good: "dobrze", weak: "słabo", veryWeak: "bardzo słabo", attempts: "Historia prób",
    frontHint: "Dotknij karty, żeby ją odwrócić", hard: "Trudne", ok: "OK", easy: "Łatwe", noCards: "Nie ma kart w tym trybie",
    correct: "Dobrze", wrong: "Źle", history: "Historia", stop: "Stop", record: "Rekord", score: "Wynik",
    koranTitle: "Mój Qur'an", koranAdd: "Dodaj Surę", koranNumber: "Numer (1-114)", koranEmpty: "Nie dodano jeszcze żadnej Sury.", koranOrder: "Sortuj i filtruj sury według potrzeb.",
    lessonCategories: "Kategorie Lekcji", lessonSelect: "Wybierz kategorię"
  },
  en: {
    navHome: "Home", navIslam: "Islam", navKoran: "Qur'an", navAlphabet: "Alphabet", navLessons: "Lessons", navFlashcards: "Cards", navSpeech: "Speech", navWriting: "Writing", navAdventure: "Adventure", navBooks: "Books", navCulture: "Culture", navGames: "Games", navBadges: "Badges", navSettings: "Settings", navDhikr: "Dhikr", navPrayer: "Prayers", navAsmaul: "99 Names", navTajweed: "Tajweed", navSeerah: "Seerah", navPillars: "Pillars", navRoots: "Roots", navMuallaf: "New Muslim", navHalalHaram: "Halal & Haram", navIslamFaq: "Islam FAQ",
    install: "Install", settings: "Settings", language: "Language", polish: "Polish", english: "English", resetToday: "Reset today's progress", resetStreak: "Reset streak", exportProgress: "Export progress", importProgress: "Import progress", clearData: "Clear all data",
    exportHint: "Download a JSON file with your full progress.", importHint: "Choose a previously exported JSON file.", dangerZone: "Careful zone", saved: "Saved", imported: "Data imported", cleared: "Data cleared",
    welcome: "Welcome to ألف AI", homeTitle: "Islam — step by step", homeLead: "Arabic is the key — reading the Quran in the original is every Muslim's obligation. Learn letters, surahs, dhikr, Islamic history and prayers.",
    pillarsQuiz: "Pillars Quiz", pillarsQuizDesc: "5 Pillars & 6 Pillars of Iman",
    surahQuiz: "Surah Quiz", surahQuizDesc: "Recognise Arabic surah names",
    dhikrGame: "Dhikr Speed", dhikrGameDesc: "33 taps — as fast as you can!", dhikrGameStart: "Tap to start", dhikrGameResult: "Time",
    streak: "Daily streak", level: "Level", alphabetProgress: "Alphabet", todayTask: "Today's task", start: "Start", progress: "Progress", points: "pts",
    aiAssistant: "AI Assistant", aiPlaceholder: "Ask for flashcards, a quiz, a story or a culture fact...", send: "Send", aiHello: "Hi! I am your Alif AI Assistant. I can create flashcards, mini-lessons, quizzes, stories, or a daily culture fact.",
    addFlashcards: "Add to flashcards", saveBook: "Save as new book", addAdventure: "Add to Our Adventure", addCulture: "Add as culture fact",
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
    { id: "rice", category: "Jedzenie", title: "Ryż", ar: "أُرُز", tr: "aruzz", meaning: "ryż", task: "Podstawa kuchni indonezyjskiej – naucz się tego słowa." },
    { id: "fruit", category: "Jedzenie", title: "Owoce", ar: "فَاكِهَة", tr: "fakiha", meaning: "owoce", task: "Wymień 3 owoce po arabsku z pomocą AI." },
    { id: "day", category: "Czas", title: "Dzień", ar: "يَوْم", tr: "jawm", meaning: "dzień", task: "Powiedz: dzisiaj = اليوم (al-jawm)." },
    { id: "night", category: "Czas", title: "Noc", ar: "لَيْل", tr: "lajl", meaning: "noc", task: "Dobranoc po arabsku: تُصْبِح عَلَى خَيْر (tusbich 'ala khajr)." },
    { id: "morning", category: "Czas", title: "Rano", ar: "صَبَاح", tr: "sabah", meaning: "rano / poranek", task: "Powitanie poranne: صَبَاح الْخَيْر (sabah al-khajr)." },
    { id: "alhamdulillah", category: "Islam", title: "Alhamdulillah", ar: "الْحَمْدُ لِلَّه", tr: "alhamdu lillah", meaning: "Chwała Bogu / Dzięki Bogu", task: "Użyj zwrotu po każdej pomyślnej odpowiedzi w quizie." },
    { id: "inshallah", category: "Islam", title: "Inshallah", ar: "إِنْ شَاءَ اللَّه", tr: "in sza'a Allah", meaning: "Jeśli Bóg da / miejmy nadzieję", task: "Powiedz jutro rano planując swój dzień." },
    { id: "mashallah", category: "Islam", title: "Mashallah", ar: "مَا شَاءَ اللَّه", tr: "ma sza'a Allah", meaning: "Jak Bóg zechciał (zachwyt / podziw)", task: "Powiedz komuś coś miłego i dodaj Mashallah." },
    { id: "subhanallah", category: "Islam", title: "Subhanallah", ar: "سُبْحَانَ اللَّه", tr: "subhana Allah", meaning: "Chwała Bogu (zachwyt nad pięknem)", task: "Powtórz 33 razy jako formę medytacji." },
    { id: "poland_ar", category: "Polska i Indonezja", title: "Polska", ar: "بُولَنْدَا", tr: "bulanda", meaning: "Polska", task: "Napisz słowo po arabsku z pamięci." },
    { id: "warsaw_ar", category: "Polska i Indonezja", title: "Warszawa", ar: "وَارْسُو", tr: "warsaw", meaning: "Warszawa", task: "Znajdź literę و w alfabecie." },
    { id: "borze_ar", category: "Polska i Indonezja", title: "Borzęta", ar: "بُورْزِينْتَا", tr: "borzenta", meaning: "Borzęta (miasteczko w Polsce)", task: "Naucz się pisać i powiedzieć nazwę swojego miasta po arabsku." },
    { id: "indonesia_ar", category: "Polska i Indonezja", title: "Indonezja", ar: "إِنْدُونِيسِيَا", tr: "indunisia", meaning: "Indonezja", task: "Kraj kochany od zawsze – powiedz na głos 5 razy." },
    { id: "surabaya_ar", category: "Polska i Indonezja", title: "Surabaya", ar: "سُورَابَايَا", tr: "surabaja", meaning: "Surabaya (miasto w Indonezji)", task: "Napisz na canvasie litery س ر ب." },
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
    { id: "rice", category: "Food", title: "Rice", ar: "أُرُز", tr: "uruz", meaning: "rice", task: "Staple of Indonesian cuisine – memorize this word." },
    { id: "fruit", category: "Food", title: "Fruit", ar: "فَاكِهَة", tr: "fakiha", meaning: "fruit", task: "Name 3 fruits in Arabic with AI's help." },
    { id: "day", category: "Time", title: "Day", ar: "يَوْم", tr: "yawm", meaning: "day", task: "Say: today = اليوم (al-yawm)." },
    { id: "night", category: "Time", title: "Night", ar: "لَيْل", tr: "layl", meaning: "night", task: "Goodnight in Arabic: تُصْبِح عَلَى خَيْر (tusbih 'ala khayr)." },
    { id: "morning", category: "Time", title: "Morning", ar: "صَبَاح", tr: "sabah", meaning: "morning", task: "Morning greeting: صَبَاح الْخَيْر (sabah al-khayr)." },
    { id: "alhamdulillah", category: "Islam", title: "Alhamdulillah", ar: "الْحَمْدُ لِلَّه", tr: "alhamdulillah", meaning: "All praise to God / Thank God", task: "Use it after every correct quiz answer." },
    { id: "inshallah", category: "Islam", title: "Inshallah", ar: "إِنْ شَاءَ اللَّه", tr: "in sha'a Allah", meaning: "If God wills it", task: "Say it tomorrow morning while planning your day." },
    { id: "mashallah", category: "Islam", title: "Mashallah", ar: "مَا شَاءَ اللَّه", tr: "ma sha'a Allah", meaning: "What God has willed (admiration)", task: "Say something kind to someone and add Mashallah." },
    { id: "subhanallah", category: "Islam", title: "Subhanallah", ar: "سُبْحَانَ اللَّه", tr: "subhan Allah", meaning: "Glory to God (wonder at beauty)", task: "Repeat 33 times as a form of meditation." },
    { id: "poland_ar", category: "Poland & Indonesia", title: "Poland", ar: "بُولَنْدَا", tr: "bulanda", meaning: "Poland", task: "Write the word from memory." },
    { id: "warsaw_ar", category: "Poland & Indonesia", title: "Warsaw", ar: "وَارْسُو", tr: "warsaw", meaning: "Warsaw", task: "Find the letter و in the alphabet." },
    { id: "indonesia_ar", category: "Poland & Indonesia", title: "Indonesia", ar: "إِنْدُونِيسِيَا", tr: "indunisia", meaning: "Indonesia", task: "Say it 5 times aloud." },
    { id: "surabaya_ar", category: "Poland & Indonesia", title: "Surabaya", ar: "سُورَابَايَا", tr: "surabaya", meaning: "Surabaya (city in Indonesia)", task: "Write the letters س ر ب on the canvas." },
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
  polska: "Poland",
  warsaw: "Warsaw",
  lublin: "Lublin",
  indonesia: "Indonesia",
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
let catchTimer = null;
let dhikrGameTimer = null;
let catchScore = 0;
let catchMisses = 0;
let speechUnlocked = false;
let prayerClockInterval = null;
let compassWatchId = null;
let prayerGuidePrayer = "fajr";
let prayerGuideStep = 0;

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
  adventurePhotos: [],
  adventureStories: [],
  books: [],
  interactiveBooks: [],
  cultureFacts: [],
  aiMessages: [],
  miniLessonsDone: [],
  memoryBest: 0,
  catchBest: 0,
  recordings: {},
  writingAttempts: [],
  quizStats: { correct: 0, wrong: 0 },
  quizHistory: [],
  memoryStats: { correct: 0, wrong: 0 },
  catchHistory: [],
  pendingAdventurePhoto: null,
  quranSurahs: [],
  quranFavorites: [],
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
  learnedLettersLog: [],
  ttsWarningShown: false,
  hifzProgress: {},
  dhikrCounts: { subhana: 0, alhamdu: 0, allahu: 0 },
  groqApiKey: "",
  surahFilter: "all",
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
  prayerGuideSessions: 0,
  lastPrayerGuide: null
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
  $("#homeLogo")?.setAttribute("aria-label", tx("Przejdz na strone glowna", "Go to home page"));
  $("#quickLangBtn")?.setAttribute("aria-label", tx("Zmien jezyk", "Change language"));
  $("#themeBtn")?.setAttribute("aria-label", tx("Zmien motyw", "Change theme"));
  $("#closeModal")?.setAttribute("aria-label", tx("Zamknij", "Close"));
  $("#aiFab")?.setAttribute("aria-label", tx("Otworz AI Assistant", "Open AI Assistant"));
  $("#closeAi")?.setAttribute("aria-label", tx("Zamknij", "Close"));
}

function themeMeta(theme) {
  if (theme === "dark") return { icon: "☾", title: "Dark" };
  if (theme === "romantic") return { icon: "🌸", title: "Romantic" };
  return { icon: "☀", title: "Light" };
}

function nextTheme(theme) {
  const currentIndex = Math.max(0, THEMES.indexOf(theme));
  return THEMES[(currentIndex + 1) % THEMES.length];
}

function aiSystemPrompt() {
  return state.lang === "en" ? AI_SYSTEM_PROMPT_EN : AI_SYSTEM_PROMPT_PL;
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const next = { ...defaultState, ...parsed };
    if (!THEMES.includes(next.theme)) next.theme = "light";
    next.learnedLetters = [...new Set(next.learnedLetters || [])].filter((id) => arabicAlphabet.some((letter) => letter.id === id));
    if (!next.quranSurahFavorites) next.quranSurahFavorites = [];
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
      showLoveToast(tx("⚠️ Pamięć urządzenia jest pełna. Usuń stare zdjęcia lub PDF-y w Ustawieniach.", "⚠️ Device storage is full. Remove old photos or PDFs in Settings."));
    }
  }
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[char]));
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

function progressPercent() {
  const learned = new Set(state.learnedLetters).size;
  return Math.max(0, Math.min(100, Math.round((learned / arabicAlphabet.length) * 100)));
}

function setRoute(next) {
  route = next;
  location.hash = next;
  render();
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
  checkBadges();
  document.documentElement.dataset.theme = state.theme;
  applyThemeMeta();
  updateDocumentI18nMeta();
  registerPwa();
  renderNav();
  bindGlobalEvents();
  mountAiAssistant();
  scheduleRomanticToast();
  initSearch();
  window.addEventListener("hashchange", () => {
    route = location.hash.replace("#", "") || "home";
    render();
  });
  render();
}

function bindGlobalEvents() {
  window.addEventListener("pointerdown", unlockSpeech, { once: true, passive: true });
  window.addEventListener("keydown", unlockSpeech, { once: true });
  $("#homeLogo").addEventListener("click", () => setRoute("home"));
  $("#quickLangBtn").addEventListener("click", () => {
    state.lang = state.lang === "pl" ? "en" : "pl";
    saveState();
    render();
  });
  $("#themeBtn").addEventListener("click", () => {
    state.theme = nextTheme(state.theme);
    document.documentElement.dataset.theme = state.theme;
    saveState();
    render();
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

function romanticLine() {
  return ROMANTIC_LINES[Math.floor(Math.random() * ROMANTIC_LINES.length)];
}

function showLoveToast(message = romanticLine()) {
  const old = document.querySelector(".love-toast");
  if (old) old.remove();
  const toast = document.createElement("div");
  toast.className = "love-toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 5800);
}

function scheduleRomanticToast() {
  const delay = (2 + Math.random() * 1) * 60 * 1000;
  setTimeout(() => {
    showLoveToast();
    scheduleRomanticToast();
  }, delay);
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
  const secondaryHtml = secondaryNavItems.map(([id, icon, labelKey]) => `
      <button class="nav-btn haptic-feedback ${route === id ? "active" : ""} nav-secondary" data-route="${id}">
        <span class="text-xl">${icon}</span><span class="nav-label">${t(labelKey)}</span>
      </button>
    `).join("");
  const moreHtml = secondaryNavItems.length ? `
    <button id="moreNavBtn" class="nav-btn haptic-feedback ${moreActive ? "active" : ""} nav-more">
      <span class="text-xl">⋯</span><span class="nav-label">${t("more")}</span>
    </button>` : "";

  nav.innerHTML =
    navItems.map(([id, icon, labelKey]) => `
      <button class="nav-btn haptic-feedback ${route === id || (id === "islam" && ISLAM_ROUTES.includes(route)) ? "active" : ""}" data-route="${id}">
        <span class="text-xl">${icon}</span><span class="nav-label">${t(labelKey)}</span>
      </button>
    `).join("") + secondaryHtml + moreHtml;

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
  if (catchTimer) {
    clearInterval(catchTimer);
    catchTimer = null;
  }
  if (dhikrGameTimer) {
    clearInterval(dhikrGameTimer);
    dhikrGameTimer = null;
  }
  if (prayerClockInterval) {
    clearInterval(prayerClockInterval);
    prayerClockInterval = null;
  }
  if (compassWatchId !== null) {
    try { window.removeEventListener('deviceorientationabsolute', compassWatchId); window.removeEventListener('deviceorientation', compassWatchId); } catch {}
    compassWatchId = null;
  }
  renderNav();
  const currentThemeMeta = themeMeta(state.theme);
  $("#themeBtn").textContent = currentThemeMeta.icon;
  $("#themeBtn").title = currentThemeMeta.title;
  applyThemeMeta();
  updateDocumentI18nMeta();
  $("#installBtn").textContent = t("install");
  $("#quickLangBtn").textContent = state.lang === "pl" ? "PL" : "EN";
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
  const views = { home, islam, koran, alphabet, lessons, flashcards, speech, writing, books, culture, games, badges, settings, dhikr, prayer, prayerGuide, asmaul, tajweed, seerah, pillars, muallaf, halalharam, islamfaq };
  (views[route] || home)();
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

    <h2 class="text-xl font-black mb-3">${tx("Nie musisz być perfekcyjny", "You don't need to be perfect")}</h2>
    <div class="grid gap-3 mb-6">
      ${easeHadiths.map(h => `
        <div class="panel p-4">
          <p class="arabic text-xl text-[var(--accent)] mb-1" style="direction:rtl">${h.ar}</p>
          <p class="text-xs font-mono text-[var(--muted)] mb-2">${h.tr}</p>
          <p class="text-sm">${state.lang === "pl" ? h.pl : h.en}</p>
          <p class="text-xs text-[var(--muted)] mt-2 italic">${h.source}</p>
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
        { icon: "🌍", pl: "Indonesia, Pakistan, Nigeria, Turcja — muzułmanie są wszędzie. Nie jesteś sam.", en: "Indonesia, Pakistan, Nigeria, Turkey — Muslims are everywhere. You are not alone." },
        { icon: "🤲", pl: "Modlitwa (salat) może być uczona stopniowo — ważna jest intencja, nie perfekcja.", en: "Prayer (salat) can be learned gradually — what matters is intention, not perfection." },
      ].map(tip => `
        <div class="panel p-4 flex gap-3 items-start">
          <span class="text-2xl">${tip.icon}</span>
          <p class="text-sm text-[var(--muted)]">${state.lang === "pl" ? tip.pl : tip.en}</p>
        </div>
      `).join("")}
    </div>
  `;
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
    { id: "myths",     labelPl: "🔍 Mity i fakty",   labelEn: "🔍 Myths & facts" },
    { id: "women",     labelPl: "👩 Kobiety",         labelEn: "👩 Women" },
    { id: "religions", labelPl: "🕊 Religie",         labelEn: "🕊 Religions" },
    { id: "terrorism", labelPl: "⚠ Terroryzm",       labelEn: "⚠ Terrorism" },
  ];
  const activeTab = state.faqTab || "basics";
  const verdictLabel = { false: tx("MIT", "MYTH"), complex: tx("ZŁOŻONE", "COMPLEX"), info: tx("FAKT", "FACT") };

  const filtered = islamicFaq.filter(q => q.tab === activeTab);

  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">❓ ${tx("FAQ islamu", "Islam FAQ")}</h1>
      <p class="text-[var(--muted)] mt-1 text-sm">${tx("Pytania, które zadają wszyscy — uczciwe odpowiedzi.", "Questions everyone asks — honest answers.")}</p>
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
            <p>${state.lang === "pl" ? q.aPl : q.aEn}</p>
            ${q.ref ? `<p class="faq-ref">📚 ${q.ref}</p>` : ""}
          </div>
        </div>
      `).join("")}
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
    { route: "dhikr",   icon: "📿", titlePl: "Dhikr",             titleEn: "Dhikr",            descPl: "Licznik Subhanallah · Alhamdulillah · Allahu Akbar",     descEn: "Subhanallah · Alhamdulillah · Allahu Akbar counter" },
    { route: "pillars", icon: "⭐", titlePl: "Filary Islamu",     titleEn: "Pillars of Islam", descPl: "5 Filarów Islamu + 6 Filarów Imanu",                    descEn: "5 Pillars of Islam + 6 Pillars of Iman" },
    { route: "prayerGuide", icon: "🧎", titlePl: "Prayer Mode",   titleEn: "Prayer Mode",      descPl: "Przewodnik salat krok po kroku dla początkujących",       descEn: "Step-by-step salat guide for beginners" },
    { route: "prayer",  icon: "🕌", titlePl: "Czasy modlitw",     titleEn: "Prayer times",     descPl: "Borzęta 🇵🇱 + Surabaya 🇮🇩 + Qibla",                     descEn: "Borzęta 🇵🇱 + Surabaya 🇮🇩 + Qibla" },
    { route: "asmaul",  icon: "☪",  titlePl: "99 Imion Allaha",  titleEn: "99 Names of Allah",descPl: "Asma ul-Husna — piękne imiona Boga",                    descEn: "Asma ul-Husna — beautiful Names of God" },
    { route: "seerah",  icon: "🌙", titlePl: "Seerah",            titleEn: "Seerah",           descPl: "Życie Proroka Muhammada ﷺ",                             descEn: "Life of Prophet Muhammad ﷺ" },
    { route: "tajweed", icon: "🔤", titlePl: "Tadżwid",           titleEn: "Tajweed",          descPl: "8 zasad prawidłowej recytacji",                         descEn: "8 rules for correct Quran recitation" },
    { route: "muallaf",    icon: "🌱", titlePl: "Nowy muzułmanin",  titleEn: "New Muslim",       descPl: "Pierwsze kroki, szahada i nie musisz być perfekcyjny",        descEn: "First steps, shahada and you don't need to be perfect" },
    { route: "halalharam", icon: "⚖",  titlePl: "Halal & Haram",   titleEn: "Halal & Haram",   descPl: "Jedzenie, napoje, zachowanie — co wolno, czego nie",          descEn: "Food, drinks, behaviour — what is and isn't allowed" },
    { route: "islamfaq",   icon: "❓", titlePl: "FAQ islamu",       titleEn: "Islam FAQ",        descPl: "Mity, islamofobia, kobiety, terroryzm, inne religie",         descEn: "Myths, Islamophobia, women, terrorism, other religions" },
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

function home() {
  const tasks = activeDailyTasks();
  const task = tasks[new Date().getDate() % tasks.length];
  const taskRoute = /liter|trace|narys|write|letter|alfabet/i.test(task) ? "alphabet" : "lessons";
  const badgeTotal = BADGES_CATALOG.length || 1;
  const badgeProgress = Math.round((state.badges.length / badgeTotal) * 100);

  view.innerHTML = `
    <div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <section class="panel romantic-hero p-5 sm:p-7">
        <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="font-bold text-emerald-600">${t("welcome")}</p>
            <h1 class="mt-2 text-3xl font-black sm:text-4xl">${t("homeTitle")} ☪️</h1>
            <p class="mt-3 max-w-2xl text-sm text-[var(--muted)]">${t("homeLead")}</p>
          </div>
          <div class="grid h-28 w-28 shrink-0 place-items-center rounded-lg bg-emerald-500 text-5xl text-white shadow-sm">☪</div>
        </div>
        <div class="mt-7 grid gap-3 sm:grid-cols-3">
          ${statCard(t("streak"), `${state.streak} ${tx("dni", "days")}`, tx("Codzienna obecnosc", "Daily presence"))}
          ${statCard(t("level"), `${t("level")} ${level()}`, `${state.points} ${t("points")}`)}
          ${statCard(t("alphabetProgress"), `${progressPercent()}%`, `${state.learnedLetters.length}/28`)}
        </div>
      </section>
      <aside class="grid gap-4">
        <div class="soft-panel p-5">
          <h2 class="text-xl font-black">${t("todayTask")}</h2>
          <p class="mt-2 text-[var(--muted)]">${task}</p>
          <button class="big-action mt-4 w-full bg-emerald-500 text-white" data-route="${taskRoute}">${t("start")}</button>
        </div>
        <button class="panel p-4 text-left w-full flex items-center justify-between gap-3 active:scale-95 transition-transform" data-route="settings">
          <div>
            <h2 class="text-base font-black">${tx("Ustawienia", "Settings")}</h2>
            <p class="text-xs text-[var(--muted)] mt-0.5">${tx("Personalizacja, język, eksport i import", "Personalization, language, export and import")}</p>
          </div>
          <span class="text-xl">⚙️</span>
        </button>
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

    ${journeyWidget()}
  `;

  loadAyatOfDay();
  view.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.route === "ai") openAiChat();
      else setRoute(button.dataset.route);
    });
  });
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

  if (state.ayatCache?.date === todayDate) {
    renderAyatCache(state.ayatCache);
    return;
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
  } catch (e) {
    container.innerHTML = `<p class="text-xs text-[var(--muted)]">${tx("Nie udało się pobrać wersetu.", "Could not load ayah.")}</p>`;
  }
}

function journeyWidget() {
  const target = new Date("2026-06-11T00:00:00+07:00");
  const diff = target - new Date();
  const days = Math.max(0, Math.floor(diff / 86400000));
  const hours = Math.max(0, Math.floor((diff % 86400000) / 3600000));
  const myslenice = new Intl.DateTimeFormat(localeTag(), { timeZone: "Europe/Warsaw", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date());
  const surabaya = new Intl.DateTimeFormat(localeTag(), { timeZone: "Asia/Jakarta", hour: "numeric", minute: "2-digit", hour12: true }).format(new Date());
  return `
    <section class="panel romantic-hero mt-4 p-5 sm:p-6">
      <div class="relative z-10 grid gap-5 lg:grid-cols-[1fr_1.3fr_1fr] lg:items-center">
        <div>
          <p class="text-sm font-black text-emerald-700">${tx("Dwa miasta, jedno serce", "Two cities, one heart")}</p>
          <h2 class="mt-1 text-2xl font-black">Borzęta - Surabaya</h2>
        </div>
        <div>
          <div class="mb-3 flex justify-between gap-3 text-sm font-black">
            <span>Borzęta ${myslenice}</span>
            <span>Surabaya ${surabaya}</span>
          </div>
          <div class="journey-line"></div>
          <p class="mt-3 text-center text-sm text-[var(--muted)]">~10 700 km · PL ↔ ID</p>
        </div>
        <div class="soft-panel p-4 text-center">
          <p class="text-sm font-black text-amber-600">${tx("Do wylotu do Surabayi", "Until Surabaya flight")}</p>
          <p class="mt-1 text-3xl font-black">${days}d ${hours}h</p>
          <p class="text-xs text-[var(--muted)]">11.06.2026</p>
        </div>
      </div>
    </section>
  `;
}

function statCard(title, value, hint) {
  return `<div class="soft-panel p-4"><p class="text-sm font-bold text-[var(--muted)]">${title}</p><p class="mt-1 text-2xl font-black">${value}</p><p class="text-xs text-[var(--muted)]">${hint}</p></div>`;
}

function quickLink(title, text, routeName) {
  return `<button class="panel min-h-28 p-4 text-left" data-route="${routeName}"><strong class="block text-lg">${title}</strong><span class="text-sm text-[var(--muted)]">${text}</span></button>`;
}



const QURAN_RECITERS = [
  { id: "ar.alafasy", name: "Mishary Rashid Alafasy" },
  { id: "ar.abdulsamad", name: "Abdul Basit Abdus Samad" },
  { id: "ar.minshawi", name: "Mohamed Siddiq al-Minshawi" }
];

const SURAH_LIST = [
  {number:1,  arName:"الفاتحة",   enName:"Al-Fatiha",     meaning:"The Opening",              numberOfAyahs:7,   revelationType:"Meccan"},
  {number:2,  arName:"البقرة",    enName:"Al-Baqarah",    meaning:"The Cow",                  numberOfAyahs:286, revelationType:"Medinan"},
  {number:3,  arName:"آل عمران", enName:"Al-Imran",      meaning:"Family of Imran",           numberOfAyahs:200, revelationType:"Medinan"},
  {number:4,  arName:"النساء",   enName:"An-Nisa",       meaning:"The Women",                numberOfAyahs:176, revelationType:"Medinan"},
  {number:5,  arName:"المائدة",  enName:"Al-Maidah",     meaning:"The Table Spread",         numberOfAyahs:120, revelationType:"Medinan"},
  {number:6,  arName:"الأنعام",  enName:"Al-Anam",       meaning:"The Cattle",               numberOfAyahs:165, revelationType:"Meccan"},
  {number:7,  arName:"الأعراف",  enName:"Al-Araf",       meaning:"The Heights",              numberOfAyahs:206, revelationType:"Meccan"},
  {number:8,  arName:"الأنفال",  enName:"Al-Anfal",      meaning:"The Spoils of War",        numberOfAyahs:75,  revelationType:"Medinan"},
  {number:9,  arName:"التوبة",   enName:"At-Tawbah",     meaning:"The Repentance",           numberOfAyahs:129, revelationType:"Medinan"},
  {number:10, arName:"يونس",     enName:"Yunus",         meaning:"Jonah",                    numberOfAyahs:109, revelationType:"Meccan"},
  {number:11, arName:"هود",      enName:"Hud",           meaning:"Hud",                      numberOfAyahs:123, revelationType:"Meccan"},
  {number:12, arName:"يوسف",     enName:"Yusuf",         meaning:"Joseph",                   numberOfAyahs:111, revelationType:"Meccan"},
  {number:13, arName:"الرعد",    enName:"Ar-Rad",        meaning:"The Thunder",              numberOfAyahs:43,  revelationType:"Medinan"},
  {number:14, arName:"إبراهيم",  enName:"Ibrahim",       meaning:"Abraham",                  numberOfAyahs:52,  revelationType:"Meccan"},
  {number:15, arName:"الحجر",    enName:"Al-Hijr",       meaning:"The Rocky Tract",          numberOfAyahs:99,  revelationType:"Meccan"},
  {number:16, arName:"النحل",    enName:"An-Nahl",       meaning:"The Bee",                  numberOfAyahs:128, revelationType:"Meccan"},
  {number:17, arName:"الإسراء",  enName:"Al-Isra",       meaning:"The Night Journey",        numberOfAyahs:111, revelationType:"Meccan"},
  {number:18, arName:"الكهف",    enName:"Al-Kahf",       meaning:"The Cave",                 numberOfAyahs:110, revelationType:"Meccan"},
  {number:19, arName:"مريم",     enName:"Maryam",        meaning:"Mary",                     numberOfAyahs:98,  revelationType:"Meccan"},
  {number:20, arName:"طه",       enName:"Ta-Ha",         meaning:"Ta-Ha",                    numberOfAyahs:135, revelationType:"Meccan"},
  {number:21, arName:"الأنبياء", enName:"Al-Anbiya",     meaning:"The Prophets",             numberOfAyahs:112, revelationType:"Meccan"},
  {number:22, arName:"الحج",     enName:"Al-Hajj",       meaning:"The Pilgrimage",           numberOfAyahs:78,  revelationType:"Medinan"},
  {number:23, arName:"المؤمنون", enName:"Al-Muminun",    meaning:"The Believers",            numberOfAyahs:118, revelationType:"Meccan"},
  {number:24, arName:"النور",    enName:"An-Nur",        meaning:"The Light",                numberOfAyahs:64,  revelationType:"Medinan"},
  {number:25, arName:"الفرقان",  enName:"Al-Furqan",     meaning:"The Criterion",            numberOfAyahs:77,  revelationType:"Meccan"},
  {number:26, arName:"الشعراء",  enName:"Ash-Shuara",    meaning:"The Poets",                numberOfAyahs:227, revelationType:"Meccan"},
  {number:27, arName:"النمل",    enName:"An-Naml",       meaning:"The Ant",                  numberOfAyahs:93,  revelationType:"Meccan"},
  {number:28, arName:"القصص",    enName:"Al-Qasas",      meaning:"The Stories",              numberOfAyahs:88,  revelationType:"Meccan"},
  {number:29, arName:"العنكبوت", enName:"Al-Ankabut",    meaning:"The Spider",               numberOfAyahs:69,  revelationType:"Meccan"},
  {number:30, arName:"الروم",    enName:"Ar-Rum",        meaning:"The Romans",               numberOfAyahs:60,  revelationType:"Meccan"},
  {number:31, arName:"لقمان",    enName:"Luqman",        meaning:"Luqman",                   numberOfAyahs:34,  revelationType:"Meccan"},
  {number:32, arName:"السجدة",   enName:"As-Sajdah",     meaning:"The Prostration",          numberOfAyahs:30,  revelationType:"Meccan"},
  {number:33, arName:"الأحزاب",  enName:"Al-Ahzab",      meaning:"The Combined Forces",      numberOfAyahs:73,  revelationType:"Medinan"},
  {number:34, arName:"سبأ",      enName:"Saba",          meaning:"Sheba",                    numberOfAyahs:54,  revelationType:"Meccan"},
  {number:35, arName:"فاطر",     enName:"Fatir",         meaning:"Originator",               numberOfAyahs:45,  revelationType:"Meccan"},
  {number:36, arName:"يس",       enName:"Ya-Sin",        meaning:"Ya Sin",                   numberOfAyahs:83,  revelationType:"Meccan"},
  {number:37, arName:"الصافات",  enName:"As-Saffat",     meaning:"Those Ranged in Ranks",    numberOfAyahs:182, revelationType:"Meccan"},
  {number:38, arName:"ص",        enName:"Sad",           meaning:"Sad",                      numberOfAyahs:88,  revelationType:"Meccan"},
  {number:39, arName:"الزمر",    enName:"Az-Zumar",      meaning:"The Groups",               numberOfAyahs:75,  revelationType:"Meccan"},
  {number:40, arName:"غافر",     enName:"Ghafir",        meaning:"The Forgiver",             numberOfAyahs:85,  revelationType:"Meccan"},
  {number:41, arName:"فصلت",     enName:"Fussilat",      meaning:"Explained in Detail",      numberOfAyahs:54,  revelationType:"Meccan"},
  {number:42, arName:"الشورى",   enName:"Ash-Shura",     meaning:"The Consultation",         numberOfAyahs:53,  revelationType:"Meccan"},
  {number:43, arName:"الزخرف",   enName:"Az-Zukhruf",    meaning:"The Gold Adornments",      numberOfAyahs:89,  revelationType:"Meccan"},
  {number:44, arName:"الدخان",   enName:"Ad-Dukhan",     meaning:"The Smoke",                numberOfAyahs:59,  revelationType:"Meccan"},
  {number:45, arName:"الجاثية",  enName:"Al-Jathiyah",   meaning:"The Crouching",            numberOfAyahs:37,  revelationType:"Meccan"},
  {number:46, arName:"الأحقاف",  enName:"Al-Ahqaf",      meaning:"The Wind-Curved Sandhills",numberOfAyahs:35,  revelationType:"Meccan"},
  {number:47, arName:"محمد",     enName:"Muhammad",      meaning:"Muhammad",                 numberOfAyahs:38,  revelationType:"Medinan"},
  {number:48, arName:"الفتح",    enName:"Al-Fath",       meaning:"The Victory",              numberOfAyahs:29,  revelationType:"Medinan"},
  {number:49, arName:"الحجرات",  enName:"Al-Hujurat",    meaning:"The Rooms",                numberOfAyahs:18,  revelationType:"Medinan"},
  {number:50, arName:"ق",        enName:"Qaf",           meaning:"Qaf",                      numberOfAyahs:45,  revelationType:"Meccan"},
  {number:51, arName:"الذاريات", enName:"Adh-Dhariyat",  meaning:"The Winnowing Winds",      numberOfAyahs:60,  revelationType:"Meccan"},
  {number:52, arName:"الطور",    enName:"At-Tur",        meaning:"The Mount",                numberOfAyahs:49,  revelationType:"Meccan"},
  {number:53, arName:"النجم",    enName:"An-Najm",       meaning:"The Star",                 numberOfAyahs:62,  revelationType:"Meccan"},
  {number:54, arName:"القمر",    enName:"Al-Qamar",      meaning:"The Moon",                 numberOfAyahs:55,  revelationType:"Meccan"},
  {number:55, arName:"الرحمن",   enName:"Ar-Rahman",     meaning:"The Most Gracious",        numberOfAyahs:78,  revelationType:"Medinan"},
  {number:56, arName:"الواقعة",  enName:"Al-Waqiah",     meaning:"The Inevitable",           numberOfAyahs:96,  revelationType:"Meccan"},
  {number:57, arName:"الحديد",   enName:"Al-Hadid",      meaning:"The Iron",                 numberOfAyahs:29,  revelationType:"Medinan"},
  {number:58, arName:"المجادلة", enName:"Al-Mujadila",   meaning:"The Pleading Woman",       numberOfAyahs:22,  revelationType:"Medinan"},
  {number:59, arName:"الحشر",    enName:"Al-Hashr",      meaning:"The Exile",                numberOfAyahs:24,  revelationType:"Medinan"},
  {number:60, arName:"الممتحنة", enName:"Al-Mumtahanah", meaning:"She That is to be Examined",numberOfAyahs:13, revelationType:"Medinan"},
  {number:61, arName:"الصف",     enName:"As-Saf",        meaning:"The Ranks",                numberOfAyahs:14,  revelationType:"Medinan"},
  {number:62, arName:"الجمعة",   enName:"Al-Jumuah",     meaning:"Friday",                   numberOfAyahs:11,  revelationType:"Medinan"},
  {number:63, arName:"المنافقون",enName:"Al-Munafiqun",  meaning:"The Hypocrites",           numberOfAyahs:11,  revelationType:"Medinan"},
  {number:64, arName:"التغابن",  enName:"At-Taghabun",   meaning:"The Mutual Disillusion",   numberOfAyahs:18,  revelationType:"Medinan"},
  {number:65, arName:"الطلاق",   enName:"At-Talaq",      meaning:"The Divorce",              numberOfAyahs:12,  revelationType:"Medinan"},
  {number:66, arName:"التحريم",  enName:"At-Tahrim",     meaning:"The Prohibition",          numberOfAyahs:12,  revelationType:"Medinan"},
  {number:67, arName:"الملك",    enName:"Al-Mulk",       meaning:"The Sovereignty",          numberOfAyahs:30,  revelationType:"Meccan"},
  {number:68, arName:"القلم",    enName:"Al-Qalam",      meaning:"The Pen",                  numberOfAyahs:52,  revelationType:"Meccan"},
  {number:69, arName:"الحاقة",   enName:"Al-Haqqah",     meaning:"The Reality",              numberOfAyahs:52,  revelationType:"Meccan"},
  {number:70, arName:"المعارج",  enName:"Al-Maarij",     meaning:"The Ascending Stairways",  numberOfAyahs:44,  revelationType:"Meccan"},
  {number:71, arName:"نوح",      enName:"Nuh",           meaning:"Noah",                     numberOfAyahs:28,  revelationType:"Meccan"},
  {number:72, arName:"الجن",     enName:"Al-Jinn",       meaning:"The Jinn",                 numberOfAyahs:28,  revelationType:"Meccan"},
  {number:73, arName:"المزمل",   enName:"Al-Muzzammil",  meaning:"The Enshrouded One",       numberOfAyahs:20,  revelationType:"Meccan"},
  {number:74, arName:"المدثر",   enName:"Al-Muddaththir",meaning:"The Cloaked One",          numberOfAyahs:56,  revelationType:"Meccan"},
  {number:75, arName:"القيامة",  enName:"Al-Qiyamah",    meaning:"The Resurrection",         numberOfAyahs:40,  revelationType:"Meccan"},
  {number:76, arName:"الإنسان",  enName:"Al-Insan",      meaning:"The Man",                  numberOfAyahs:31,  revelationType:"Medinan"},
  {number:77, arName:"المرسلات", enName:"Al-Mursalat",   meaning:"The Emissaries",           numberOfAyahs:50,  revelationType:"Meccan"},
  {number:78, arName:"النبأ",    enName:"An-Naba",       meaning:"The Tidings",              numberOfAyahs:40,  revelationType:"Meccan"},
  {number:79, arName:"النازعات", enName:"An-Naziat",     meaning:"Those Who Drag Forth",     numberOfAyahs:46,  revelationType:"Meccan"},
  {number:80, arName:"عبس",      enName:"Abasa",         meaning:"He Frowned",               numberOfAyahs:42,  revelationType:"Meccan"},
  {number:81, arName:"التكوير",  enName:"At-Takwir",     meaning:"The Overthrowing",         numberOfAyahs:29,  revelationType:"Meccan"},
  {number:82, arName:"الانفطار", enName:"Al-Infitar",    meaning:"The Cleaving",             numberOfAyahs:19,  revelationType:"Meccan"},
  {number:83, arName:"المطففين", enName:"Al-Mutaffifin", meaning:"The Defrauding",           numberOfAyahs:36,  revelationType:"Meccan"},
  {number:84, arName:"الانشقاق", enName:"Al-Inshiqaq",   meaning:"The Sundering",            numberOfAyahs:25,  revelationType:"Meccan"},
  {number:85, arName:"البروج",   enName:"Al-Buruj",      meaning:"The Mansions of the Stars",numberOfAyahs:22,  revelationType:"Meccan"},
  {number:86, arName:"الطارق",   enName:"At-Tariq",      meaning:"The Night-Comer",          numberOfAyahs:17,  revelationType:"Meccan"},
  {number:87, arName:"الأعلى",   enName:"Al-Ala",        meaning:"The Most High",            numberOfAyahs:19,  revelationType:"Meccan"},
  {number:88, arName:"الغاشية",  enName:"Al-Ghashiyah",  meaning:"The Overwhelming",         numberOfAyahs:26,  revelationType:"Meccan"},
  {number:89, arName:"الفجر",    enName:"Al-Fajr",       meaning:"The Dawn",                 numberOfAyahs:30,  revelationType:"Meccan"},
  {number:90, arName:"البلد",    enName:"Al-Balad",      meaning:"The City",                 numberOfAyahs:20,  revelationType:"Meccan"},
  {number:91, arName:"الشمس",    enName:"Ash-Shams",     meaning:"The Sun",                  numberOfAyahs:15,  revelationType:"Meccan"},
  {number:92, arName:"الليل",    enName:"Al-Layl",       meaning:"The Night",                numberOfAyahs:21,  revelationType:"Meccan"},
  {number:93, arName:"الضحى",    enName:"Ad-Duha",       meaning:"The Morning Hours",        numberOfAyahs:11,  revelationType:"Meccan"},
  {number:94, arName:"الشرح",    enName:"Ash-Sharh",     meaning:"The Relief",               numberOfAyahs:8,   revelationType:"Meccan"},
  {number:95, arName:"التين",    enName:"At-Tin",        meaning:"The Fig",                  numberOfAyahs:8,   revelationType:"Meccan"},
  {number:96, arName:"العلق",    enName:"Al-Alaq",       meaning:"The Clot",                 numberOfAyahs:19,  revelationType:"Meccan"},
  {number:97, arName:"القدر",    enName:"Al-Qadr",       meaning:"The Power",                numberOfAyahs:5,   revelationType:"Meccan"},
  {number:98, arName:"البينة",   enName:"Al-Bayyinah",   meaning:"The Clear Proof",          numberOfAyahs:8,   revelationType:"Medinan"},
  {number:99, arName:"الزلزلة",  enName:"Az-Zalzalah",   meaning:"The Earthquake",           numberOfAyahs:8,   revelationType:"Medinan"},
  {number:100,arName:"العاديات", enName:"Al-Adiyat",     meaning:"The Courser",              numberOfAyahs:11,  revelationType:"Meccan"},
  {number:101,arName:"القارعة",  enName:"Al-Qariah",     meaning:"The Calamity",             numberOfAyahs:11,  revelationType:"Meccan"},
  {number:102,arName:"التكاثر",  enName:"At-Takathur",   meaning:"The Rivalry in World Increase",numberOfAyahs:8,revelationType:"Meccan"},
  {number:103,arName:"العصر",    enName:"Al-Asr",        meaning:"The Declining Day",        numberOfAyahs:3,   revelationType:"Meccan"},
  {number:104,arName:"الهمزة",   enName:"Al-Humazah",    meaning:"The Traducer",             numberOfAyahs:9,   revelationType:"Meccan"},
  {number:105,arName:"الفيل",    enName:"Al-Fil",        meaning:"The Elephant",             numberOfAyahs:5,   revelationType:"Meccan"},
  {number:106,arName:"قريش",     enName:"Quraysh",       meaning:"Quraysh",                  numberOfAyahs:4,   revelationType:"Meccan"},
  {number:107,arName:"الماعون",  enName:"Al-Maun",       meaning:"The Small Kindnesses",     numberOfAyahs:7,   revelationType:"Meccan"},
  {number:108,arName:"الكوثر",   enName:"Al-Kawthar",    meaning:"The Abundance",            numberOfAyahs:3,   revelationType:"Meccan"},
  {number:109,arName:"الكافرون", enName:"Al-Kafirun",    meaning:"The Disbelievers",         numberOfAyahs:6,   revelationType:"Meccan"},
  {number:110,arName:"النصر",    enName:"An-Nasr",       meaning:"The Divine Support",       numberOfAyahs:3,   revelationType:"Medinan"},
  {number:111,arName:"المسد",    enName:"Al-Masad",      meaning:"The Palm Fibre",           numberOfAyahs:5,   revelationType:"Meccan"},
  {number:112,arName:"الإخلاص",  enName:"Al-Ikhlas",     meaning:"The Sincerity",            numberOfAyahs:4,   revelationType:"Meccan"},
  {number:113,arName:"الفلق",    enName:"Al-Falaq",      meaning:"The Daybreak",             numberOfAyahs:5,   revelationType:"Meccan"},
  {number:114,arName:"الناس",    enName:"An-Nas",        meaning:"The Mankind",              numberOfAyahs:6,   revelationType:"Meccan"},
];

const SURAH_EXTRA = {
  1:   { badge_pl: "Fard ✓",       badge_en: "Obligatory ✓", tip_pl: "Recytowana w każdej rak'ah — bez niej modlitwa nieważna", tip_en: "Recited in every rak'ah — prayer invalid without it" },
  2:   { badge_pl: "Ayat al-Kursi",badge_en: "Ayat al-Kursi",tip_pl: "Zawiera Ayat al-Kursi (2:255) — recytuj po każdej modlitwie", tip_en: "Contains Ayat al-Kursi (2:255) — recite after every prayer" },
  18:  { badge_pl: "Piątek 🌙",    badge_en: "Friday 🌙",    tip_pl: "Recytuj co piątek — ochrona przed Dajjalem (Muslim 809)", tip_en: "Recite every Friday — protection from Dajjal (Muslim 809)" },
  36:  { badge_pl: "Serce ♥",      badge_en: "Heart ♥",      tip_pl: "Ya-Sin — Serce Koranu (at-Tirmidhi 2812)", tip_en: "Ya-Sin — Heart of the Quran (at-Tirmidhi 2812)" },
  44:  { badge_pl: "Noc piątku",   badge_en: "Friday night", tip_pl: "Recytuj w nocy czwartku/piątku — wielka nagroda", tip_en: "Recite on Thursday/Friday night — great reward" },
  55:  { badge_pl: "Oblubienica",  badge_en: "Bride",        tip_pl: "Az-Zahra — Oblubienica Koranu, 31× 'Które łaski Pana swego odrzucicie?'", tip_en: "Az-Zahra — Bride of the Quran, 31× 'Which favors of your Lord will you deny?'" },
  56:  { badge_pl: "Bogactwo",     badge_en: "Wealth",       tip_pl: "Recytuj każdej nocy — chroni przed ubóstwem (Ibn Masud)", tip_en: "Recite every night — protects from poverty (Ibn Masud)" },
  67:  { badge_pl: "Tarcza 🛡",    badge_en: "Shield 🛡",    tip_pl: "Al-Mulk — chroni przed karą grobu, recytuj przed snem (Abu Dawud 1400)", tip_en: "Al-Mulk — protects from grave punishment, recite before sleep (Abu Dawud 1400)" },
  110: { badge_pl: "Pożegnanie",   badge_en: "Farewell",     tip_pl: "Jedna z ostatnich objawień — Prorok ﷺ wiedział, że czas mu się kończy", tip_en: "One of the last revelations — the Prophet ﷺ knew his time was near" },
  112: { badge_pl: "1/3 Koranu",   badge_en: "1/3 Quran",   tip_pl: "Równoważna 1/3 Koranu w nagrodzie — recytuj 3× = cały Koran (Bukhari 5013)", tip_en: "Equivalent to 1/3 of the Quran in reward — recite 3× = whole Quran (Bukhari 5013)" },
  113: { badge_pl: "Schronienie",  badge_en: "Refuge",       tip_pl: "Al-Mu'awwidhatain — recytuj rano ×3, wieczorem ×3 (Abu Dawud 5082)", tip_en: "Al-Mu'awwidhatain — recite ×3 morning and evening (Abu Dawud 5082)" },
  114: { badge_pl: "Schronienie",  badge_en: "Refuge",       tip_pl: "Recytuj razem z Al-Falaq rano i wieczorem ×3", tip_en: "Recite together with Al-Falaq morning and evening ×3" },
};

const ESSENTIAL_SURAHS = [1, 112, 113, 114, 67, 36, 55, 18, 2, 56];

const SURAH_LENGTH_GROUPS = [
  { key: "xs",      labelPl: "Bardzo krótkie (≤6)",    labelEn: "Very short (≤6)",      min: 1,   max: 6   },
  { key: "short",   labelPl: "Krótkie (7–12)",          labelEn: "Short (7–12)",         min: 7,   max: 12  },
  { key: "smed",    labelPl: "Krótko-średnie (13–20)",  labelEn: "Short-medium (13–20)", min: 13,  max: 20  },
  { key: "med",     labelPl: "Średnie (21–50)",         labelEn: "Medium (21–50)",       min: 21,  max: 50  },
  { key: "medlong", labelPl: "Średnio-długie (51–100)", labelEn: "Medium-long (51–100)", min: 51,  max: 100 },
  { key: "long",    labelPl: "Długie (>100)",           labelEn: "Long (>100)",          min: 101, max: 999 },
];

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

function renderSurahFilterChips(activeFilter) {
  const chips = [
    { key: "all",      labelPl: "Wszystkie",    labelEn: "All"          },
    { key: "essential",labelPl: "Esencjalne ⭐", labelEn: "Essential ⭐"  },
    { key: "meccan",   labelPl: "Mekka 🕋",     labelEn: "Meccan 🕋"    },
    { key: "medinan",  labelPl: "Medyna 🕌",    labelEn: "Medinan 🕌"   },
    { key: "favfirst", labelPl: "Ulubione ❤️",  labelEn: "Favorites ❤️" },
    ...SURAH_LENGTH_GROUPS.map(g => ({ key: g.key, labelPl: g.labelPl, labelEn: g.labelEn })),
    { key: "alpha",    labelPl: "A→Z",           labelEn: "A→Z"          },
  ];
  return `<div class="surah-chips-bar" id="surahChipsBar">${chips.map(c =>
    `<button class="surah-chip${activeFilter === c.key ? " active" : ""}" data-chip="${c.key}">${state.lang === "pl" ? c.labelPl : c.labelEn}</button>`
  ).join("")}</div>`;
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
    if (idx === -1) { state.quranSurahFavorites.push(num); showLoveToast(tx("Dodano do ulubionych", "Added to favorites")); }
    else state.quranSurahFavorites.splice(idx, 1);
    saveState();
    renderSurahList();
  }));
  listEl.querySelectorAll("[data-read-surah]").forEach(btn => btn.addEventListener("click", () => openSurah(Number(btn.dataset.readSurah))));
}

function renderSurahList() {
  if (!state.quranSurahFavorites) state.quranSurahFavorites = [];
  const filter = state.surahFilter || "all";
  const searchVal = ($("#surahSearch")?.value || "").toLowerCase().trim();
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

function koran() {
  const activeTab = state.quranTab || "surahs";
  const favCount = (state.quranSurahFavorites || []).length;
  view.innerHTML = `
    <div class="sticky top-0 z-10 bg-[var(--bg)]">
      <h1 class="text-2xl font-black px-4 pt-4">${t("koranTitle")}</h1>
      <div class="flex border-b border-[var(--line)] mt-3 px-2 gap-0 overflow-x-auto">
        <button class="px-4 py-2.5 text-sm font-black border-b-2 shrink-0 ${activeTab === "surahs" ? "border-emerald-500 text-emerald-600" : "border-transparent text-[var(--muted)]"}" data-tab="surahs">${tx("Sury", "Surahs")}</button>
        <button class="px-4 py-2.5 text-sm font-black border-b-2 shrink-0 ${activeTab === "dua" ? "border-emerald-500 text-emerald-600" : "border-transparent text-[var(--muted)]"}" data-tab="dua">${tx("Dua", "Dua")}</button>
        <button class="px-4 py-2.5 text-sm font-black border-b-2 shrink-0 ${activeTab === "favayahs" ? "border-emerald-500 text-emerald-600" : "border-transparent text-[var(--muted)]"}" data-tab="favayahs">${tx("Ulubione", "Favorites")} ${favCount > 0 ? `<span class="ml-1 rounded-full bg-emerald-100 text-emerald-700 text-xs px-1.5">${favCount}</span>` : ""}</button>
      </div>
    </div>

    <div class="p-4 pb-28">
      <!-- SURAHS TAB -->
      <div id="tabSurahs" class="${activeTab !== "surahs" ? "hidden" : ""}">
        <div class="mb-3">
          <input id="surahSearch" type="search" class="h-10 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm mb-2" placeholder="${tx("Szukaj sury...", "Search surah...")}">
          ${renderSurahFilterChips(state.surahFilter || "all")}
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
                    <button class="speaker-btn text-sm" data-say-ar="${escapeHtml(dua.ar)}">🔊 ${tx("Odsłuchaj", "Listen")}</button>
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
    $("#surahSearch").addEventListener("input", renderSurahList);
    $("#reciterSelect").addEventListener("change", e => { state.quranReciter = e.target.value; saveState(); });
    view.querySelectorAll("[data-chip]").forEach(btn => btn.addEventListener("click", () => {
      state.surahFilter = btn.dataset.chip;
      saveState();
      // Update active chip visually
      view.querySelectorAll("[data-chip]").forEach(b => b.classList.toggle("active", b.dataset.chip === state.surahFilter));
      renderSurahList();
    }));
  }

  if (activeTab === "dua") {
    view.querySelectorAll("[data-say-ar]").forEach(btn => btn.addEventListener("click", () => speakArabic(btn.dataset.sayAr)));
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


async function openSurah(num) {
  const container = $("#surahContent");
  container.innerHTML = `<div class="panel p-8 text-center">${tx("Ładowanie treści...", "Loading content...")}</div>`;
  container.scrollIntoView({ behavior: "smooth" });
  try {
    const reciter = state.quranReciter || "ar.alafasy";
    const transEdition = state.lang === "pl" ? "pl.bielawskiego" : "en.asad";
    const [resAudio, resTrans, resTr] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${num}/${reciter}`),
      fetch(`https://api.alquran.cloud/v1/surah/${num}/${transEdition}`),
      fetch(`https://api.alquran.cloud/v1/surah/${num}/en.transliteration`)
    ]);
    const [dataAudio, dataTrans, dataTr] = await Promise.all([resAudio.json(), resTrans.json(), resTr.json()]);
    if (dataAudio.code === 200) {
      const s = dataAudio.data;
      const transAyahs = dataTrans.code === 200 ? dataTrans.data.ayahs : [];
      const trAyahs = dataTr.code === 200 ? dataTr.data.ayahs : [];
      const transMap = {};
      const trMap = {};
      transAyahs.forEach(a => { transMap[a.numberInSurah] = a.text; });
      trAyahs.forEach(a => { trMap[a.numberInSurah] = a.text; });

      container.innerHTML = `
        <div class="panel p-5 sm:p-8">
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
        showLoveToast(tx("Dodano werset do ulubionych", "Ayah added to favorites"));
      }));

      container.querySelectorAll("[data-copy-ayah]").forEach(btn => btn.addEventListener("click", () => {
        const text = btn.dataset.copyText;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => showLoveToast(tx("Skopiowano werset", "Ayah copied")));
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
    }
  } catch (e) {
    container.innerHTML = `<div class="panel p-8 text-center text-red-500">${tx("Nie udało się pobrać treści sury.", "Failed to fetch surah content.")}</div>`;
  }
}

function badges() {
  const unlocked = state.badges.length;
  const total = BADGES_CATALOG.length;
  view.innerHTML = `
    <div class="page-header sticky top-0 z-10 flex items-center gap-3 p-4 bg-[var(--bg)]">
      <h1 class="text-2xl font-black">${tx("Odznaki", "Badges")}</h1>
      <span class="ml-auto text-sm font-black text-amber-500">${unlocked}/${total}</span>
    </div>
    <div class="p-4 pb-28">
      <div class="w-full bg-[var(--line)] rounded-full h-2 mb-6">
        <div class="bg-amber-400 h-2 rounded-full transition-all" style="width:${Math.round(unlocked/total*100)}%"></div>
      </div>
      <div class="grid gap-3">
        ${BADGES_CATALOG.map(b => {
          const isUnlocked = state.badges.includes(b.id);
          const label = state.lang === "pl" ? b.pl : b.en;
          const criterion = state.lang === "pl" ? b.criterionPl : b.criterionEn;
          return `<div class="panel p-4 flex items-center gap-4 ${isUnlocked ? "" : "opacity-50"}">
            <span class="text-4xl shrink-0 ${isUnlocked ? "" : "grayscale"}">${b.icon}</span>
            <div class="min-w-0 flex-1">
              <p class="font-black leading-tight">${label}</p>
              <p class="text-xs text-[var(--muted)] leading-tight mt-0.5">${criterion}</p>
            </div>
            ${isUnlocked ? `<span class="text-emerald-500 text-lg shrink-0">✓</span>` : `<span class="text-[var(--muted)] text-lg shrink-0">🔒</span>`}
          </div>`;
        }).join("")}
      </div>
    </div>
  `;
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
        <p class="mt-2 text-[var(--muted)]">${tx("Wybierz klasyczny light, dark albo rozowo-bezowy romantic.", "Choose classic light, dark, or pink-beige romantic.")}</p>
        <div class="mt-4 grid grid-cols-3 gap-2">
          <button class="big-action ${state.theme === "light" ? "bg-amber-100 border border-amber-300" : "border border-[var(--line)] bg-[var(--surface)]"}" data-theme-set="light">☀ Light</button>
          <button class="big-action ${state.theme === "dark" ? "bg-emerald-900 text-white" : "border border-[var(--line)] bg-[var(--surface)]"}" data-theme-set="dark">☾ Dark</button>
          <button class="big-action ${state.theme === "romantic" ? "gold-btn" : "border border-[var(--line)] bg-[var(--surface)]"}" data-theme-set="romantic">🌸 Romantic</button>
        </div>
      </section>
      <section class="panel p-5">
        <h2 class="text-xl font-black">${tx("Instalacja PWA", "PWA installation")}</h2>
        <p class="mt-2 text-[var(--muted)]">${tx("Dodaj Alif AI do ekranu glownego telefonu.", "Add Alif AI to your phone home screen.")}</p>
        <div class="mt-4">${installButtonHtml("")}</div>
      </section>
      <section class="panel p-5">
        <h2 class="text-xl font-black">${t("exportProgress")}</h2>
        <p class="mt-2 text-[var(--muted)]">${t("exportHint")}</p>
        <button id="exportStateBtn" class="big-action mt-4 w-full bg-emerald-500 text-white">${t("exportProgress")}</button>
      </section>
      <section class="panel p-5">
        <h2 class="text-xl font-black">${t("importProgress")}</h2>
        <p class="mt-2 text-[var(--muted)]">${t("importHint")}</p>
        <input id="importStateFile" class="mt-4 block w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4" type="file" accept="application/json" />
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
      <section class="panel p-5">
        <h2 class="text-xl font-black">${tx("Klucz API Groq", "Groq API Key")}</h2>
        <p class="mt-2 text-[var(--muted)] text-sm">${tx("Opcjonalnie — wklej własny klucz z groq.com. Klucz jest przechowywany tylko na Twoim urządzeniu.", "Optional — paste your own key from groq.com. The key is stored only on your device.")}</p>
        <input id="groqApiKeyInput" type="password" class="mt-3 block w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3 text-sm" placeholder="gsk_..." value="${escapeHtml(state.groqApiKey || '')}" />
        <button id="saveGroqKeyBtn" class="big-action mt-3 w-full bg-emerald-500 text-white">${tx("Zapisz klucz", "Save key")}</button>
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
  $("#saveGroqKeyBtn")?.addEventListener("click", () => {
    state.groqApiKey = $("#groqApiKeyInput").value.trim();
    saveState();
    showLoveToast(tx("✅ Klucz Groq zapisany", "✅ Groq key saved"));
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
    state.miniLessonsDone = [];
    state.quizStats = { correct: 0, wrong: 0 };
    state.quizHistory = [];
    state.memoryStats = { correct: 0, wrong: 0 };
    state.catchHistory = [];
    state.writingAttempts = [];
    state.recordings = {};
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
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `alif-ai-backup-${today()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importState(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(reader.result);
      state = { ...defaultState, ...imported };
      saveState();
      render();
    } catch {
      alert(state.lang === "pl" ? "Nieprawidłowy plik JSON." : "Invalid JSON file.");
    }
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
      ${arabicAlphabet.map((letter) => `
        <article class="letter-tile relative overflow-hidden flex flex-col items-center justify-center p-2">
          <button class="absolute right-1 top-1 z-10 grid h-6 w-6 place-items-center rounded-md border border-[var(--line)] bg-[var(--surface)] text-[9px] font-black shadow-sm" data-letter-info="${letter.id}" aria-label="${t("more")}">i</button>
          <button class="flex flex-col items-center justify-center w-full h-full pt-4 gap-1" data-letter-say="${letter.id}">
            <span class="arabic text-4xl leading-tight">${escapeHtml(letter.forms.isolated)}</span>
            <span class="font-black text-[11px] text-center leading-tight w-full truncate px-1 mt-1">${escapeHtml(letterName(letter))}</span>
            <span class="text-[10px] text-[var(--muted)] font-mono leading-none">${escapeHtml(letter.transliteration)}</span>
          </button>
        </article>
      `).join("")}
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
      showLoveToast(tx(`Cofnięto: litera ${letterName(letter)}`, `Unmarked: letter ${letterName(letter)}`));
    } else {
      markLetterLearned(id);
      checkBadges();
      updateAlphabetCounter();
      e.target.textContent = tx("✓ Poznana — cofnij", "✓ Learned — undo");
      e.target.className = "big-action bg-emerald-100 text-emerald-700 border border-emerald-300";
      showLoveToast(tx(`Litera ${letterName(letter)} poznana!`, `Letter ${letterName(letter)} learned!`));
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
  const source = tab === "letters"
    ? arabicAlphabet.map((letter) => ({ id: `letter-${letter.id}`, front: letter.forms.isolated, translation: letterName(letter), transliteration: letter.transliteration, back: `${letterName(letter)} · ${letter.transliteration}`, hint: letterPronunciationText(letter) }))
    : tab === "words"
      ? words.map((word) => ({ id: `word-${word.id}`, front: word.ar, translation: wordMeaning(word), transliteration: word.tr, back: `${wordMeaning(word)} · ${word.tr}`, hint: tx("slowo", "word") }))
      : state.customFlashcards.map((card) => {
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
      showLoveToast(tx("Brak arabskiego TTS. Zainstaluj język arabski w systemie lub użyj Chrome.", "No Arabic TTS. Install Arabic language pack or use Chrome."));
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

function adventure() {
  if (!state.learnedLettersLog) state.learnedLettersLog = [];
  if (!state.adventureNotes) state.adventureNotes = {};

  const events = [];

  (state.learnedLettersLog || []).forEach(entry => {
    const letter = arabicAlphabet.find(l => l.id === entry.id);
    if (letter) events.push({ date: entry.date, icon: escapeHtml(letter.forms.isolated), text: tx(`Poznałeś/aś literę ${letterName(letter)} (${letter.transliteration})`, `Learned the letter ${letterName(letter)} (${letter.transliteration})`), type: "letter" });
  });

  Object.entries(state.adventureNotes || {}).forEach(([date, text]) => {
    if (text) events.push({ date, icon: "📝", text: escapeHtml(text), type: "note" });
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

  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Oś Czasu Nauki", "Learning Timeline")}</h1>
      <p class="text-[var(--muted)]">${tx("Automatyczny dziennik Twoich postępów. Każda litera, sura i kamień milowy.", "Automatic log of your progress. Every letter, surah and milestone.")}</p>
    </div>
    <div class="panel mb-4 p-5">
      <h2 class="text-lg font-black mb-3">${tx("Dodaj wpis do osi czasu", "Add timeline entry")}</h2>
      <textarea id="adventureNoteInput" class="min-h-20 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3" placeholder="${tx("Napisz coś, co chcesz zapamiętać... (np. dzisiaj nauczyłem się...)", "Write something to remember... (e.g. today I learned...)")}"></textarea>
      <button id="addAdventureNoteBtn" class="big-action mt-3 w-full bg-emerald-500 text-white">${tx("Dodaj wpis", "Add entry")}</button>
    </div>
    <div class="panel p-5">
      <h2 class="text-lg font-black mb-4">${tx("Twoja oś czasu", "Your timeline")} · ${events.length} ${tx("zdarzeń", "events")}</h2>
      <div class="mt-2">${timelineHtml}</div>
    </div>
  `;

  $("#addAdventureNoteBtn").addEventListener("click", () => {
    const text = $("#adventureNoteInput").value.trim();
    if (!text) return;
    if (!state.adventureNotes) state.adventureNotes = {};
    const key = new Date().toISOString();
    state.adventureNotes[key] = text;
    saveState();
    adventure();
  });
}

async function generateAdventureStory() {
  const promptValue = $("#storyPrompt").value.trim() || tx("Napisz krótką, ciepłą historyjkę o dwóch miastach: Borzęcie i Surabayi, z trzema prostymi arabskimi słowami.", "Write a short warm story about two cities — Borzęta and Surabaya — using three simple Arabic words.");
  $("#generateStoryBtn").textContent = tx("Analizuję zdjęcie...", "Analyzing photo...");
  
  const hasPhoto = !!state.pendingAdventurePhoto;
  const model = hasPhoto ? "llama-3.2-11b-vision-preview" : GROQ_MODEL;
  
  try {
    const aiPrompt = tx(
      `Stworz czysta, romantyczna, ciepla historyjke do sekcji Nasza Przygoda. ${hasPhoto ? "OPISZ DOKŁADNIE CO WIDZISZ NA ZAŁĄCZONYM ZDJĘCIU i wpleć to w historię." : ""} Nie dodawaj surowych linkow markdown ani listy przyciskow. Dodaj 3 proste arabskie slowa z naturalnym objasnieniem w tekscie. ${promptValue}`,
      `Create a clean, romantic, warm story for the Our Adventure section. ${hasPhoto ? "DESCRIBE EXACTLY WHAT YOU SEE IN THE ATTACHED PHOTO and weave it into the story." : ""} Do not add raw markdown links or button lists. Add 3 simple Arabic words with natural explanation inside the story. ${promptValue}`
    );
    
    const text = cleanAiText(await askGroq([{ role: "user", content: aiPrompt }], model, state.pendingAdventurePhoto));
    const story = { id: crypto.randomUUID(), title: tx(`Przygoda ${new Date().toLocaleDateString(localeTag())}`, `Adventure ${new Date().toLocaleDateString(localeTag())}`), text, photo: state.pendingAdventurePhoto };
    state.adventureStories.unshift(story);
    if (state.pendingAdventurePhoto) state.adventurePhotos.unshift(state.pendingAdventurePhoto);
    state.pendingAdventurePhoto = null;
    saveState();
    adventure();
    confetti();
  } catch (error) {
    $("#generateStoryBtn").textContent = tx("Blad AI", "AI error");
  }
}

function cleanAiText(text) {
  return text.replace(/\[(Dodaj|Add|Zapisz|Save)[^\]]*\]\([^)]+\)/gi, "").replace(/```/g, "").trim();
}

function books() {
  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Moje ksiazeczki", "My books")}</h1>
      <p class="text-[var(--muted)]">${tx("AI bajki po arabsku z tłumaczeniem, PDF i interaktywne karty.", "AI stories in Arabic with translation, PDFs and interactive cards.")}</p>
    </div>
    <div class="panel mb-4 p-5">
      <h2 class="text-lg font-black mb-3">${tx("Wygeneruj bajkę arabską z AI", "Generate Arabic story with AI")}</h2>
      <textarea id="aiStoryPrompt" class="min-h-20 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3 mb-3" placeholder="${tx("Temat bajki (np. przygoda w Indonezji, kolorowe ptaki, księżyc nad Surabayą...)", "Story theme (e.g. adventure in Indonesia, colorful birds, the moon over Surabaya...)")}"></textarea>
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
          <strong class="mt-3 block">${book.title}</strong>
          <span class="text-sm text-[var(--muted)]">${book.cards.length} ${tx("stron / kart", "pages / cards")}</span>
        </button>
      `).join("")}
      ${state.books.map((book) => `
        <button class="panel p-4 text-left" data-book="${book.id}">
          <div class="book-cover grid place-items-center text-5xl">PDF</div>
          <strong class="mt-3 block">${book.title}</strong>
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
  } catch (e) {
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
  } catch (error) {
    button.textContent = tx("Nie udalo sie odczytac", "Could not read");
  }
}

async function extractPdfText(source) {
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
        <h2 class="text-xl font-black">${book.title}</h2>
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
        <h2 class="text-xl font-black">${book.title}</h2>
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
                  <button class="arabic text-5xl" data-say="${escapeHtml(card.ar)}">${card.ar}</button>
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
      <p class="text-[var(--muted)]">${tx("Ciekawostki dnia o arabskim, islamie, Indonezji i codziennych zwyczajach.", "Daily facts about Arabic, Islam, Indonesia and everyday customs.")}</p>
    </div>
    <section class="panel p-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm font-bold text-emerald-600">${tx("Ciekawostka dnia", "Fact of the day")}</p>
          <h2 class="text-2xl font-black">${todayFact ? todayFact.title : tx("Brak ciekawostki na dziś", "No fact for today yet")}</h2>
        </div>
        <button id="generateCultureBtn" class="${btnClass}" ${hasToday ? "disabled" : ""}>${btnLabel}</button>
      </div>
      <p class="mt-4 whitespace-pre-wrap text-[var(--muted)]">${todayFact ? escapeHtml(todayFact.text) : tx("AI przygotuje krótką ciekawostkę z mini-słówkiem arabskim. Jedna ciekawostka na dzień.", "AI will prepare a short fact with an Arabic mini-word. One fact per day.")}</p>
    </section>
    <div class="mt-4 grid gap-3 sm:grid-cols-2">
      ${state.cultureFacts.slice(0, 10).map((item) => `
        <article class="soft-panel p-4">
          <p class="text-xs font-bold text-[var(--muted)]">${item.date}</p>
          <h3 class="mt-1 font-black">${item.title}</h3>
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
      `Write ONE short culture fact (2-4 sentences) about Arabic culture, Islam or Indonesia. Do NOT generate flashcard lists. Do NOT use headers. ${avoidNote}
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
      catch:       '<div id="catchBox" class="panel p-5"></div>',
      dhikrGame:   '<div id="dhikrGameBox" class="panel p-5"></div>',
      surahQuiz:   '<div id="surahQuizBox" class="panel p-5"></div>',
      pillarsQuiz: '<div id="pillarsQuizBox" class="panel p-5"></div>',
    };
    const directMap = {
      flashcards: flashcardsView,
      speech:     speechView,
      writing:    writingView,
    };
    if (containerMap[state.activeGame]) {
      view.innerHTML = containerMap[state.activeGame];
      const renderers = { quiz: renderQuiz, memory: renderMemory, catch: renderCatchGame, dhikrGame: renderDhikrGame, surahQuiz: renderSurahQuiz, pillarsQuiz: renderPillarsQuiz };
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
    { id: "quiz",        icon: "🎯", titlePl: "Quiz liter",    titleEn: "Letter Quiz",      descPl: "Rozpoznaj arabską literę", descEn: "Identify the Arabic letter" },
    { id: "memory",      icon: "🃏", titlePl: "Memory Match",  titleEn: "Memory Match",     descPl: "Dopasuj pary liter i nazw", descEn: "Match letter pairs" },
    { id: "catch",       icon: "🕐", titlePl: "Łap literę",    titleEn: "Catch the Letter", descPl: "Złap spadającą literę", descEn: "Catch the falling letter" },
    { id: "dhikrGame",   icon: "📿", titlePl: "Szybki Dhikr",  titleEn: "Dhikr Speed",      descPl: "Liczymy razem — subhanallah", descEn: "Speed dhikr counting" },
    { id: "surahQuiz",   icon: "📖", titlePl: "Quiz Surah",    titleEn: "Surah Quiz",       descPl: "Rozpoznaj surę Koranu", descEn: "Identify Quran surahs" },
    { id: "pillarsQuiz", icon: "⭐", titlePl: "Quiz Filarów",  titleEn: "Pillars Quiz",     descPl: "Test wiedzy o filarach islamu", descEn: "Islamic pillars knowledge test" },
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
      state.quizHistory.unshift({ ok: false, letter: correct.forms.isolated, date: new Date().toISOString() });
      state.quizHistory = state.quizHistory.slice(0, 20);
      saveState();
    }
  }));
}

function renderMemory() {
  const letters = [...arabicAlphabet].sort(() => Math.random() - 0.5).slice(0, 12);
  const cards = letters.flatMap((letter) => [
    { key: letter.id, label: letter.forms.isolated, sound: letter.forms.isolated, type: "ar" },
    { key: letter.id, label: letterName(letter), sound: letter.forms.isolated, type: "pl" }
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
    <div class="mt-4 grid grid-cols-5 gap-2">
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

function renderCatchGame() {
  $("#catchBox").innerHTML = `
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 class="text-2xl font-black">${tx("Lap litere", "Catch the Letter")}</h2>
        <p class="text-[var(--muted)]">${tx("Klikaj spadajace litery. Trzy pudla koncza runde.", "Tap falling letters. Three misses end the round.")}</p>
        <p class="mt-1 text-sm font-bold text-[var(--muted)]">${t("record")}: ${state.catchBest}</p>
      </div>
      <div class="flex gap-2">
        <span id="catchScore" class="rounded-lg bg-emerald-500 px-3 py-2 font-bold text-white">0 ${t("points")}</span>
        <button id="startCatch" class="rounded-lg bg-amber-500 px-4 py-2 font-bold text-white">Start</button>
        <button id="stopCatch" class="rounded-lg border border-[var(--line)] px-4 py-2 font-bold">${t("stop")}</button>
      </div>
    </div>
    <div id="catchArena" class="catch-arena mt-4"></div>
    <div class="mt-4">
      <h3 class="font-black">${t("history")}</h3>
      <div class="mt-2 grid gap-1 text-sm text-[var(--muted)]">
        ${state.catchHistory.slice(0, 6).map((item) => `<p>${t("score")}: ${item.score} · ${new Date(item.date).toLocaleString(localeTag())}</p>`).join("") || `<p>${tx("Brak prob.", "No attempts yet.")}</p>`}
      </div>
    </div>
  `;
  $("#startCatch").addEventListener("click", startCatchGame);
  $("#stopCatch").addEventListener("click", stopCatchGame);
}

function startCatchGame() {
  const arena = $("#catchArena");
  catchScore = 0;
  catchMisses = 0;
  arena.innerHTML = "";
  $("#catchScore").textContent = `0 ${t("points")}`;
  if (catchTimer) clearInterval(catchTimer);
  catchTimer = setInterval(() => {
    if (catchMisses >= 3) {
      finishCatchGame();
      return;
    }
    spawnFallingLetter(arena);
  }, 780);
}

function stopCatchGame() {
  if (!catchTimer) return;
  finishCatchGame();
}

function finishCatchGame() {
  clearInterval(catchTimer);
  catchTimer = null;
  state.catchBest = Math.max(state.catchBest, catchScore);
  state.points += catchScore;
  state.catchHistory.unshift({ score: catchScore, date: new Date().toISOString() });
  state.catchHistory = state.catchHistory.slice(0, 20);
  saveState();
  $("#catchArena")?.insertAdjacentHTML("beforeend", `<div class="catch-end">${tx("Koniec rundy", "Round over")}. ${t("score")}: ${catchScore}</div>`);
}

function spawnFallingLetter(arena) {
  const letter = arabicAlphabet[Math.floor(Math.random() * arabicAlphabet.length)];
  const button = document.createElement("button");
  button.className = "falling-letter arabic";
  button.textContent = letter.forms.isolated;
  button.style.left = `${Math.random() * 78 + 4}%`;
  button.addEventListener("click", () => {
    speakArabic(letter.forms.isolated);
    catchScore += 1;
    $("#catchScore").textContent = `${catchScore} ${t("points")}`;
    button.remove();
  });
  button.addEventListener("animationend", () => {
    if (button.isConnected) {
      catchMisses += 1;
      button.remove();
    }
  });
  arena.appendChild(button);
}

function renderPillarsQuiz() {
  const allPillars = [
    ...pillarsOfIslam.map(p => ({ ...p, category: tx("Filary Islamu", "Pillars of Islam") })),
    ...pillarsOfIman.map(p => ({ ...p, category: tx("Filary Imanu", "Pillars of Iman") }))
  ];
  const correct = allPillars[Math.floor(Math.random() * allPillars.length)];
  const others = allPillars.filter(p => !(p.n === correct.n && p.category === correct.category));
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
      ${choices.map(c => `<button class="big-action border border-[var(--line)] bg-[var(--surface)]" data-pillar-id="${c.n}-${c.category}">${escapeHtml(state.lang === "pl" ? c.pl : c.en)}</button>`).join("")}
    </div>
    <div class="mt-4">
      <h3 class="font-black text-sm">${t("history")}</h3>
      <div class="mt-2 grid gap-1 text-sm text-[var(--muted)]">
        ${state.pillarsQuizHistory.slice(0, 5).map(item => `<p>${item.ok ? t("correct") : t("wrong")} · ${escapeHtml(item.name)} · ${new Date(item.date).toLocaleTimeString(localeTag())}</p>`).join("") || `<p>${tx("Brak prób.", "No attempts yet.")}</p>`}
      </div>
    </div>
  `;

  const correctKey = `${correct.n}-${correct.category}`;
  $("#pillarsQuizBox").querySelectorAll("[data-pillar-id]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.dataset.pillarId === correctKey) {
        btn.className = "big-action bg-emerald-500 text-white";
        state.pillarsQuizStats.correct += 1;
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

  $("#surahQuizBox").innerHTML = `
    <h2 class="text-2xl font-black">${t("surahQuiz")}</h2>
    <p class="mt-1 text-[var(--muted)] text-sm">${t("surahQuizDesc")}</p>
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
            <p class="text-xs font-bold text-amber-300">Alif AI</p>
            <h2 class="text-xl font-black">${t("aiAssistant")}</h2>
          </div>
          <button id="closeAi" class="ai-close" aria-label="Zamknij">×</button>
        </header>
        <div id="aiMessages" class="ai-messages"></div>
        <form id="aiForm" class="ai-form">
          <input id="aiInput" class="ai-input" placeholder="${t("aiPlaceholder")}" autocomplete="off" />
          <button class="ai-send" type="submit">${t("send")}</button>
        </form>
      </div>
    </dialog>
  `);
  $("#aiFab").addEventListener("click", openAiChat);
  $("#closeAi").addEventListener("click", () => $("#aiDialog").close());
  $("#aiForm").addEventListener("submit", sendAiMessage);
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
  box.innerHTML = state.aiMessages.map((message, index) => `
    <article class="ai-message ${message.role === "user" ? "user" : "assistant"}">
      <p class="whitespace-pre-wrap">${escapeHtml(message.content)}</p>
      ${message.role === "assistant" ? aiActionButtons(index) : ""}
    </article>
  `).join("");
  box.querySelectorAll("[data-ai-action]").forEach((button) => button.addEventListener("click", () => handleAiAction(button.dataset.aiAction, Number(button.dataset.messageIndex))));
  requestAnimationFrame(() => {
    box.scrollTop = box.scrollHeight;
  });
}

function aiActionButtons(_index) {
  return '';
}

async function sendAiMessage(event) {
  event.preventDefault();
  const input = $("#aiInput");
  const content = input.value.trim();
  if (!content) return;
  state.aiMessages.push({ role: "user", content });
  state.aiMessages = state.aiMessages.slice(-25);
  input.value = "";
  renderAiMessages();
  const aiThinking = tx("Pisze odpowiedz...", "Writing response...");
  state.aiMessages.push({ role: "assistant", content: aiThinking });
  renderAiMessages();
  try {
    const appContext = tx(
      `Kontekst aplikacji: uzytkownik ma ${state.points} punktow, poziom ${level()}, zna ${state.learnedLetters.length}/28 liter. Sekcje: Alfabet, Lekcje, Fiszki, Wymowa, Pisanie, Nasza Przygoda, Kultura, Gry, Qur'an, Islam.`,
      `App context: user has ${state.points} points, level ${level()}, knows ${state.learnedLetters.length}/28 letters. Sections: Alphabet, Lessons, Flashcards, Speech, Writing, Our Adventure, Culture, Games, Qur'an, Islam.`
    );
    const recent = state.aiMessages.filter((message) => message.content !== aiThinking).slice(-8);
    const answer = await askGroq([
      { role: "system", content: appContext },
      ...recent
    ]);
    state.aiMessages[state.aiMessages.length - 1] = { role: "assistant", content: answer };
    if (Math.random() < 0.35) showLoveToast(romanticLine());
  } catch (error) {
    state.aiMessages[state.aiMessages.length - 1] = { role: "assistant", content: tx("Nie udalo mi sie polaczyc z Groq. Sprawdz internet, CORS albo limit API i sprobuj ponownie.", "I could not connect to Groq. Check internet, CORS, or API limits and try again.") };
  }
  state.aiMessages = state.aiMessages.slice(-25);
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
    max_tokens: 1100
  };

  if (imageData && model.includes("vision")) {
    const lastIdx = payload.messages.length - 1;
    const userContent = payload.messages[lastIdx].content;
    payload.messages[lastIdx].content = [
      { type: "text", text: userContent },
      { type: "image_url", image_url: { url: imageData } }
    ];
  }

  const response = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
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
  input.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase().trim();
    if (!q) { render(); return; }
    runSearch(q);
  });
}

function handleAiAction(action, messageIndex) {
  const message = state.aiMessages[messageIndex];
  if (!message) return;
  if (action === "flashcards") {
    addAiFlashcards(message.content);
    setRoute("flashcards");
  }
  if (action === "book") {
    saveInteractiveBook(tx(`Ksiazeczka AI ${new Date().toLocaleDateString(localeTag())}`, `AI Book ${new Date().toLocaleDateString(localeTag())}`), message.content);
    setRoute("books");
  }
  if (action === "adventure") {
    state.adventureStories.unshift({ id: crypto.randomUUID(), title: tx(`Historia AI ${new Date().toLocaleDateString(localeTag())}`, `AI Story ${new Date().toLocaleDateString(localeTag())}`), text: message.content });
    saveState();
    setRoute("adventure");
  }
  if (action === "culture") {
    state.cultureFacts.unshift({ id: crypto.randomUUID(), date: today(), title: tx("Ciekawostka AI", "AI fact"), text: message.content });
    saveState();
    setRoute("culture");
  }
  $("#aiDialog").close();
  confetti();
}

function addAiFlashcards(text) {
  const created = [];
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

  // Pattern 1: Arabic — Translation (primary expected format)
  for (const line of lines) {
    const m = line.match(/^([\u0600-\u06FF][\u0600-\u06FF\s\u064B-\u0652\u0600-\u06FF]*?)\s*[—\-–:=]+\s*(.+)$/);
    if (m) {
      const front = m[1].trim();
      const back = m[2].trim().slice(0, 180);
      if (front.length >= 2 && back.length >= 2 && !/[\u0600-\u06FF]{3,}/.test(back)) {
        created.push({ id: `ai-${crypto.randomUUID()}`, front, back, hint: "AI" });
      }
    }
  }

  // Pattern 2: "Strona przednia: X" / "Strona tylna: Y" (AI old format)
  if (!created.length) {
    for (let i = 0; i < lines.length - 1; i++) {
      const fM = lines[i].match(/(?:strona\s+przednia|front)[:\s]+(.+)/i);
      const bM = lines[i + 1].match(/(?:strona\s+tylna|back)[:\s]+(.+)/i);
      if (fM && bM) {
        created.push({ id: `ai-${crypto.randomUUID()}`, front: fM[1].trim(), back: bM[1].trim().slice(0, 180), hint: "AI" });
        i++;
      }
    }
  }

  // Pattern 3: "1. arabic - polish" numbered format
  if (!created.length) {
    for (const line of lines) {
      const m = line.match(/^\d+[.)\s]+([\u0600-\u06FF][^—\-:=]*?)\s*[-—:]+\s*(.+)$/);
      if (m) {
        const front = m[1].trim();
        const back = m[2].trim().slice(0, 180);
        if (front.length >= 2 && back.length >= 2) {
          created.push({ id: `ai-${crypto.randomUUID()}`, front, back, hint: "AI" });
        }
      }
    }
  }

  if (!created.length) {
    showToast(tx("Nie znaleziono par słowo–tłumaczenie. Poproś AI o format: arabskie — polskie.", "No word-translation pairs found. Ask AI for format: arabic — translation."));
    return;
  }
  state.customFlashcards.unshift(...created);
  saveState();
  showToast(tx(`Dodano ${created.length} fiszek ✓`, `Added ${created.length} flashcards ✓`));
}

function extractNearbyLine(text, needle) {
  return text.split("\n").find((line) => line.includes(needle))?.replace(needle, "").replace(/[-–—:|]/g, " ").trim().slice(0, 180);
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
  container.innerHTML = content;
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
    container.innerHTML = content || view.innerHTML;
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
];

function checkBadges() {
  const ll = state.learnedLetters.length;
  const sq = (state.quranSurahFavorites || []).length;
  const pts = state.points;
  const fc = (state.customFlashcards || []).length + Object.keys(state.flashcards || {}).length;
  const ld = (state.miniLessonsDone || []).length;
  const dhikrTotal = Object.values(state.dhikrCounts || {}).reduce((sum, count) => sum + (Number(count) || 0), 0);
  const prayerSessions = state.prayerGuideSessions || 0;
  const gamesPlayed =
    (state.quizHistory || []).length +
    (state.catchHistory || []).length +
    (state.dhikrGameHistory || []).length +
    (state.pillarsQuizHistory || []).length +
    (state.surahQuizHistory || []).length +
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
}

function unlockBadge(id, name) {
  if (state.badges.includes(id)) return;
  state.badges.push(id);
  saveState();
  showLoveToast(`🏆 ${name}!`);
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
  return `<div class="hijri-widget">
    <div class="hijri-label">${tx("Kalendarz islamski (Hidżra)", "Islamic Calendar (Hijri)")}</div>
    <div class="hijri-date">${h.day} ${monthName} ${h.year} H</div>
    <div class="hijri-month" style="direction:rtl">${monthNames?.ar || ''} — ${monthNames?.tr || ''}</div>
    <div class="hijri-gregorian">${gregStr}</div>
  </div>`;
}

function hadithOfDayWidget() {
  const idx = new Date().getDate() % islamicHadith.length;
  const h = islamicHadith[idx];
  if (!h) return '';
  return `<div class="panel p-4 cursor-pointer" data-route="seerah">
    <h3 class="text-sm font-black text-[var(--accent)] mb-1">📜 ${tx("Hadis Dnia", "Hadith of the Day")}</h3>
    <p class="text-base font-bold arabic text-right leading-relaxed mb-1">${h.ar}</p>
    <p class="text-xs text-[var(--muted)] italic">${state.lang === 'pl' ? h.pl : h.en}</p>
    <p class="text-xs text-[var(--muted)] mt-1 font-bold">${h.source}</p>
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
        showLoveToast(tx(`🤲 ${items.find(i=>i.key===key).tr} ukończony!`, `🤲 ${items.find(i=>i.key===key).tr} complete!`));
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
const PRAYER_GUIDE_PRAYERS = [
  { id: "fajr", pl: "Fadżr", en: "Fajr", rakat: 2 },
  { id: "dhuhr", pl: "Dhuhr", en: "Dhuhr", rakat: 4 },
  { id: "asr", pl: "Asr", en: "Asr", rakat: 4 },
  { id: "maghrib", pl: "Maghrib", en: "Maghrib", rakat: 3 },
  { id: "isha", pl: "Isza", en: "Isha", rakat: 4 }
];

const PRAYER_GUIDE_CORE_STEPS = [
  {
    id: "intro",
    titlePl: "Start i intencja",
    titleEn: "Start and intention",
    bodyPl: "Stań spokojnie twarzą w stronę Qibla. W sercu wiesz, którą modlitwę wykonujesz. Nie musisz wypowiadać intencji na głos.",
    bodyEn: "Stand calmly facing the Qibla. In your heart, know which prayer you are praying. You do not need to say the intention out loud.",
    ar: "",
    tr: "",
    meaningPl: "Ten tryb zaczyna od samej modlitwy, bez instrukcji wudu.",
    meaningEn: "This mode starts with the prayer itself, without wudu instructions."
  },
  {
    id: "qiyam",
    titlePl: "Qiyam — stanie",
    titleEn: "Qiyam — standing",
    bodyPl: "Stań prosto. Wzrok skieruj w miejsce sujud. Ręce przygotuj do pierwszego takbiru.",
    bodyEn: "Stand upright. Look toward the place of sujud. Prepare your hands for the opening takbir.",
    ar: "",
    tr: "qiyam",
    meaningPl: "Pozycja stojąca na początku raka'at.",
    meaningEn: "Standing position at the beginning of the raka'ah."
  },
  {
    id: "takbir",
    titlePl: "Takbir otwierający",
    titleEn: "Opening takbir",
    bodyPl: "Podnieś dłonie przy uszach lub ramionach i powiedz Allahu Akbar. Potem połóż prawą dłoń na lewej.",
    bodyEn: "Raise your hands near your ears or shoulders and say Allahu Akbar. Then place your right hand over your left.",
    ar: "الله أكبر",
    tr: "Allahu Akbar",
    meaningPl: "Allah jest Największy.",
    meaningEn: "Allah is the Greatest."
  },
  {
    id: "fatiha",
    titlePl: "Al-Fatiha",
    titleEn: "Al-Fatiha",
    bodyPl: "Recytuj Al-Fatihę spokojnie. Na początku możesz czytać z ekranu, żeby uczyć się poprawnej kolejności.",
    bodyEn: "Recite Al-Fatiha calmly. At the beginning, you may read from the screen to learn the correct order.",
    ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    tr: "Alhamdu lillahi rabbil alamin",
    meaningPl: "Chwała Allahowi, Panu światów.",
    meaningEn: "All praise is for Allah, Lord of all worlds."
  },
  {
    id: "short-surah",
    titlePl: "Krótka sura",
    titleEn: "Short surah",
    bodyPl: "Po Al-Fatiha recytuj krótką surę. Dla początkującego najlepsza jest Al-Ikhlas.",
    bodyEn: "After Al-Fatiha, recite a short surah. For beginners, Al-Ikhlas is a good start.",
    ar: "قُلْ هُوَ اللَّهُ أَحَدٌ",
    tr: "Qul huwa Allahu ahad",
    meaningPl: "Powiedz: On, Allah, jest Jeden.",
    meaningEn: "Say: He is Allah, One."
  },
  {
    id: "ruku",
    titlePl: "Ruku — skłon",
    titleEn: "Ruku — bowing",
    bodyPl: "Powiedz Allahu Akbar i pochyl się, opierając dłonie na kolanach. Plecy trzymaj możliwie prosto.",
    bodyEn: "Say Allahu Akbar and bow, placing your hands on your knees. Keep your back as straight as you can.",
    ar: "سُبْحَانَ رَبِّيَ الْعَظِيم",
    tr: "Subhana rabbiyal azim",
    meaningPl: "Chwała mojemu Panu, Najwspanialszemu.",
    meaningEn: "Glory be to my Lord, the Magnificent."
  },
  {
    id: "rise",
    titlePl: "Powrót ze skłonu",
    titleEn: "Rise from bowing",
    bodyPl: "Podnieś się z ruku do stania. Najpierw wypowiedz odpowiedź podczas podnoszenia, potem krótką pochwałę.",
    bodyEn: "Rise from ruku back to standing. Say the response while rising, then the short praise.",
    ar: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ\nرَبَّنَا وَلَكَ الْحَمْد",
    tr: "Sami Allahu liman hamidah. Rabbana wa laka al-hamd",
    meaningPl: "Allah słyszy tego, kto Go chwali. Panie nasz, Tobie należy się chwała.",
    meaningEn: "Allah hears the one who praises Him. Our Lord, to You belongs praise."
  },
  {
    id: "sujud1",
    titlePl: "Pierwszy sujud",
    titleEn: "First sujud",
    bodyPl: "Powiedz Allahu Akbar i przejdź do pokłonu: czoło, nos, dłonie, kolana i palce stóp dotykają ziemi.",
    bodyEn: "Say Allahu Akbar and go down: forehead, nose, hands, knees and toes touch the ground.",
    ar: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
    tr: "Subhana rabbiyal a'la",
    meaningPl: "Chwała mojemu Panu, Najwyższemu.",
    meaningEn: "Glory be to my Lord, the Most High."
  },
  {
    id: "sit",
    titlePl: "Siedzenie między sujud",
    titleEn: "Sitting between sujud",
    bodyPl: "Usiądź spokojnie między dwoma pokłonami. To krótka pauza i prośba o przebaczenie.",
    bodyEn: "Sit calmly between the two prostrations. This is a short pause and a request for forgiveness.",
    ar: "رَبِّ اغْفِرْ لِي",
    tr: "Rabbi ghfir li",
    meaningPl: "Panie mój, przebacz mi.",
    meaningEn: "My Lord, forgive me."
  },
  {
    id: "sujud2",
    titlePl: "Drugi sujud",
    titleEn: "Second sujud",
    bodyPl: "Powiedz Allahu Akbar i wykonaj drugi sujud tak samo jak pierwszy.",
    bodyEn: "Say Allahu Akbar and perform the second sujud the same way as the first.",
    ar: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
    tr: "Subhana rabbiyal a'la",
    meaningPl: "Chwała mojemu Panu, Najwyższemu.",
    meaningEn: "Glory be to my Lord, the Most High."
  },
  {
    id: "next-rakah",
    titlePl: "Kolejna raka'at",
    titleEn: "Next raka'ah",
    bodyPl: "Wstań do kolejnej raka'at i powtórz: Al-Fatiha, krótka sura, ruku, powrót, dwa sujud.",
    bodyEn: "Stand for the next raka'ah and repeat: Al-Fatiha, short surah, ruku, rising, and two sujud.",
    ar: "الله أكبر",
    tr: "Allahu Akbar",
    meaningPl: "Przechodzisz do następnej jednostki modlitwy.",
    meaningEn: "You are moving into the next prayer unit."
  },
  {
    id: "tashahhud",
    titlePl: "Tashahhud",
    titleEn: "Tashahhud",
    bodyPl: "Po ostatniej raka'at usiądź. Na początku ucz się tej formuły powoli, fragment po fragmencie.",
    bodyEn: "After the final raka'ah, sit. At first, learn this formula slowly, piece by piece.",
    ar: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَات",
    tr: "At-tahiyyatu lillahi was-salawatu wat-tayyibat",
    meaningPl: "Pozdrowienia, modlitwy i dobre rzeczy należą do Allaha.",
    meaningEn: "Greetings, prayers and good things belong to Allah."
  },
  {
    id: "salam",
    titlePl: "Salam — zakończenie",
    titleEn: "Salam — closing",
    bodyPl: "Obróć głowę w prawo i wypowiedz salam, potem w lewo. To kończy modlitwę.",
    bodyEn: "Turn your head to the right and say salam, then to the left. This completes the prayer.",
    ar: "السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّه",
    tr: "As-salamu alaykum wa rahmatullah",
    meaningPl: "Pokój z wami i miłosierdzie Allaha.",
    meaningEn: "Peace be upon you and the mercy of Allah."
  }
];

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
  const selected = PRAYER_GUIDE_PRAYERS.find(p => p.id === prayerGuidePrayer) || PRAYER_GUIDE_PRAYERS[0];
  prayerGuidePrayer = selected.id;
  const steps = prayerGuideStepsFor(selected);
  prayerGuideStep = Math.max(0, Math.min(prayerGuideStep, steps.length - 1));
  const step = steps[prayerGuideStep];
  const progress = Math.round(((prayerGuideStep + 1) / steps.length) * 100);

  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Prayer Mode", "Prayer Mode")} 🧎</h1>
      <p class="text-[var(--muted)]">${tx("Przewodnik salat od pierwszego ruchu. Bez sekcji wudu — tylko sama modlitwa krok po kroku.", "A salat guide from the first movement. No wudu section — only the prayer itself, step by step.")}</p>
    </div>

    <div class="prayer-guide-shell">
      <div class="prayer-guide-selector">
        ${PRAYER_GUIDE_PRAYERS.map(p => `
          <button class="mode-btn ${p.id === selected.id ? "active" : ""}" data-prayer-guide="${p.id}">
            ${state.lang === "pl" ? p.pl : p.en}
            <span>${p.rakat} raka'at</span>
          </button>
        `).join("")}
      </div>

      <article class="prayer-guide-card">
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
    </div>
  `;

  view.querySelectorAll("[data-prayer-guide]").forEach(btn => btn.addEventListener("click", () => {
    prayerGuidePrayer = btn.dataset.prayerGuide;
    prayerGuideStep = 0;
    state.lastPrayerGuide = prayerGuidePrayer;
    saveState();
    prayerGuide();
  }));
  $("#prayerPrev")?.addEventListener("click", () => {
    prayerGuideStep = Math.max(0, prayerGuideStep - 1);
    prayerGuide();
  });
  $("#prayerSpeak")?.addEventListener("click", () => {
    if (step.ar) speakArabic(step.ar.replace(/\n/g, " "));
  });
  $("#prayerNext")?.addEventListener("click", () => {
    if (prayerGuideStep < steps.length - 1) {
      prayerGuideStep += 1;
      prayerGuide();
      return;
    }
    state.prayerGuideSessions = (state.prayerGuideSessions || 0) + 1;
    state.lastPrayerGuide = selected.id;
    addPoints(35, false);
    checkBadges();
    saveState();
    showLoveToast(tx("Modlitwa ukończona krok po kroku", "Prayer completed step by step"));
    confetti();
    prayerGuideStep = 0;
    prayerGuide();
  });
}

// ============================================================
// PRAYER TIMES — Borzęta (Poland) + Surabaya (Indonesia)
// ============================================================
const PRAYER_LOCATIONS = [
  { id: 'polska', label: 'Polska 🇵🇱', city: 'Poland', tz: 'Europe/Warsaw', lat: '52.2297', lng: '21.0122', method: 3 },
  { id: 'surabaya', label: 'Surabaya 🇮🇩', city: 'Surabaya', tz: 'Asia/Jakarta', lat: '-7.2575', lng: '112.7521', method: 3 }
];
const PRAYER_NAMES = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const PRAYER_NAMES_PL = ['Fadżr', 'Wschód', 'Dhuhr', 'Asr', 'Maghrib', 'Isza'];

async function fetchPrayerTimes(loc) {
  const today = new Date();
  const d = today.getDate(), m = today.getMonth() + 1, y = today.getFullYear();
  const url = `https://api.aladhan.com/v1/timings/${d}-${m}-${y}?latitude=${loc.lat}&longitude=${loc.lng}&method=${loc.method}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.data?.timings || null;
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

async function prayer() {
  if (prayerClockInterval) { clearInterval(prayerClockInterval); prayerClockInterval = null; }
  if (compassWatchId !== null) { try { window.removeEventListener('deviceorientationabsolute', compassWatchId); window.removeEventListener('deviceorientation', compassWatchId); } catch {} compassWatchId = null; }

  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Czasy Modlitw", "Prayer Times")} 🕌</h1>
      <p class="text-[var(--muted)]">${tx("Dwie lokalizacje na żywo — Polska i Surabaya", "Two live locations — Poland and Surabaya")}</p>
    </div>
    <div class="grid gap-4 lg:grid-cols-2">
      <div id="prayerPolska" class="panel p-5"><div class="skeleton h-40 w-full"></div></div>
      <div id="prayerSurabaya" class="panel p-5"><div class="skeleton h-40 w-full"></div></div>
    </div>
  `;

  const results = {};
  for (const loc of PRAYER_LOCATIONS) {
    try {
      const [timings, qibla] = await Promise.all([fetchPrayerTimes(loc), fetchQibla(loc)]);
      const nextKey = getNextPrayer(timings);
      const elId = `prayer${loc.id.charAt(0).toUpperCase() + loc.id.slice(1)}`;
      const el = $(`#${elId}`);
      if (el) el.innerHTML = prayerTimesCard(loc.label, timings, qibla, nextKey, loc.tz, loc.id);
      results[loc.id] = { qibla };
    } catch {
      const elId = `prayer${loc.id.charAt(0).toUpperCase() + loc.id.slice(1)}`;
      const el = $(`#${elId}`);
      if (el) el.innerHTML = `<p class="text-[var(--muted)]">${tx("Błąd ładowania. Sprawdź połączenie.", "Load error. Check your connection.")}</p>`;
    }
  }

  // Live clocks — update every second
  prayerClockInterval = setInterval(() => {
    for (const loc of PRAYER_LOCATIONS) {
      const clockEl = $(`#clock-${loc.id}`);
      if (clockEl) clockEl.textContent = formatLocalTime(loc.tz);
    }
  }, 1000);

  // Live compass using device orientation
  const orientationHandler = (e) => {
    let heading = null;
    if (e.webkitCompassHeading !== undefined) {
      heading = e.webkitCompassHeading;
    } else if (e.absolute && e.alpha !== null) {
      heading = 360 - e.alpha;
    } else if (e.alpha !== null) {
      heading = 360 - e.alpha;
    }
    if (heading === null) return;
    for (const loc of PRAYER_LOCATIONS) {
      const qiblaDir = results[loc.id]?.qibla;
      if (qiblaDir === undefined || qiblaDir === null) continue;
      const needle = $(`#needle-${loc.id}`);
      const statusEl = $(`#compass-status-${loc.id}`);
      if (needle) {
        const angle = qiblaDir - heading;
        needle.style.transform = `rotate(${angle}deg)`;
      }
      if (statusEl) statusEl.textContent = tx("Kompas na żywo ✓", "Live compass ✓");
    }
  };
  compassWatchId = orientationHandler;

  if (typeof DeviceOrientationEvent !== 'undefined') {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS 13+ requires permission
      const permBtn = document.createElement('button');
      permBtn.className = 'big-action bg-emerald-500 text-white mt-4 w-full';
      permBtn.textContent = tx('Włącz kompas live (wymagane uprawnienie)', 'Enable live compass (permission required)');
      permBtn.addEventListener('click', async () => {
        try {
          const perm = await DeviceOrientationEvent.requestPermission();
          if (perm === 'granted') {
            window.addEventListener('deviceorientation', orientationHandler);
            permBtn.remove();
          }
        } catch {}
      });
      view.appendChild(permBtn);
    } else {
      window.addEventListener('deviceorientationabsolute', orientationHandler, true);
      window.addEventListener('deviceorientation', orientationHandler, true);
    }
  }
}

// ============================================================
// 99 NAMES OF ALLAH — Asma ul-Husna
// ============================================================
function asmaul() {
  let search = '';
  function renderList() {
    const filtered = asmaulHusna.filter(n =>
      !search || n.tr.toLowerCase().includes(search) ||
      (state.lang === 'pl' ? n.pl : n.en).toLowerCase().includes(search)
    );
    return filtered.map(n => `
      <div class="asma-card">
        <div class="asma-number">${n.n}</div>
        <div class="asma-arabic">${n.ar}</div>
        <div class="asma-name">${n.tr}</div>
        <div class="asma-meaning">${state.lang === 'pl' ? n.pl : n.en}</div>
        <div class="text-xs text-[var(--muted)] mt-1 italic">${state.lang === 'pl' ? (n.tafsir_pl || '') : (n.tafsir_en || '')}</div>
      </div>
    `).join('');
  }
  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">☪ ${tx("99 Imion Allaha", "99 Names of Allah")}</h1>
      <p class="text-[var(--muted)]">${tx("أَسْمَاءُ اللَّهِ الْحُسْنَى — Asma ul-Husna", "أَسْمَاءُ اللَّهِ الْحُسْنَى — Asma ul-Husna")}</p>
    </div>
    <input id="asmaSearch" type="search" class="w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3 mb-4" placeholder="${tx("Szukaj imienia...", "Search name...")}" />
    <div id="asmaGrid" class="asma-grid">${renderList()}</div>
  `;
  $("#asmaSearch")?.addEventListener("input", e => {
    search = e.target.value.toLowerCase();
    $("#asmaGrid").innerHTML = renderList();
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
      ${islamicHadith.slice(0, 5).map(h => `
        <div class="mb-4 pb-4 border-b border-[var(--border)]">
          <p class="text-base font-bold arabic text-right leading-relaxed" style="direction:rtl">${h.ar}</p>
          <p class="text-sm text-[var(--muted)] mt-1 italic">${state.lang === 'pl' ? h.pl : h.en}</p>
          <p class="text-xs font-bold text-[var(--accent)] mt-1">${h.source}</p>
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
