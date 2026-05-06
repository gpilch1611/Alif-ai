import { arabicAlphabet, words, dailyTasks, surahs, dailyTasksEn } from "./data.js";

const GROQ_API_KEY = "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";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const AI_SYSTEM_PROMPT_PL = `Jesteś ciepłym, motywującym osobistym asystentem nauki arabskiego w aplikacji 'Alif AI'.
Użytkownik to Abang. Jego żona to Princess. Używaj TYLKO tych dwóch imion.
Odpowiadaj WYŁĄCZNIE po polsku. Bądź przyjazny, zachęcający, bezpośredni i osobisty.
Gdy tworzysz fiszki – pisz je w formacie: słowo arabskie, myślnik, tłumaczenie po polsku, myślnik, transliteracja. Np: سلام - pokój/cześć - salam
Gdy tworzysz lekcję – podaj arabski zwrot, jego transliterację i znaczenie, plus krótkie wyjaśnienie.
Gdy tworzysz historyjkę – pisz krótko (3-5 zdań), prosto, z 1-2 arabskimi słowami wytłumaczonymi w nawiasach.
Gdy piszesz ciekawostkę – pisz krótko (2-4 zdania), z jednym arabskim słowem i jego wymową.
NIE dodawaj opisów przycisków ani instrukcji. Tylko treść.`;
const AI_SYSTEM_PROMPT_EN = `You are a warm, motivating personal Arabic learning assistant inside the app 'Alif AI'.
The user is Abang. His wife is Princess. Use ONLY these two names.
Always reply ONLY in English. Be friendly, encouraging, direct and personal.
When creating flashcards – write them as: Arabic word, dash, English meaning, dash, transliteration. E.g.: سلام - peace/hello - salam
When creating a lesson – provide the Arabic phrase, its transliteration and meaning, plus a brief explanation.
When creating a story – write briefly (3-5 sentences), simply, with 1-2 Arabic words explained in brackets.
When writing a culture fact – write briefly (2-4 sentences), with one Arabic word and its pronunciation.
Do NOT add button descriptions or instructions. Just the content.`;

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
  ["home", "⌂", "navHome"],
  ["quran", "☽", "navQuran"],
  ["alphabet", "ا", "navAlphabet"],
  ["lessons", "Aa", "navLessons"],
  ["flashcards", "▣", "navFlashcards"],
  ["speech", "◉", "navSpeech"],
  ["writing", "✎", "navWriting"],
  ["adventure", "☆", "navAdventure"],
  ["books", "▤", "navBooks"],
  ["culture", "✦", "navCulture"],
  ["games", "◎", "navGames"],
  ["settings", "⚙", "navSettings"]
];

const ROMANTIC_LINES = [
  "I love you, Princess 🌸",
  "Missing you every moment, Princess 💕",
  "You are my everything 💐",
  "My heart is learning Arabic with you 🌸",
  "Abang misses you so much 🌺",
  "Together we learn, together we grow 💕",
  "You make my heart smile, Princess 🥰",
  "Abang, you are my hero 💪❤️",
  "Distance means nothing when someone means everything ❤️",
  "Every day I fall in love with you more, Princess 🌸",
  "You are the reason I smile 💕",
  "Can't wait to hold you again, Princess 🌺",
  "Learning Arabic just to say I love you better 💞",
  "You are home to me, wherever you are ❤️",
  "My favorite person in the world 🌸",
  "Thinking of you, always 💕"
];

const I18N = {
  pl: {
    navHome: "Start", navAlphabet: "Alfabet", navLessons: "Lekcje", navFlashcards: "Fiszki", navSpeech: "Wymowa", navWriting: "Pisanie", navAdventure: "Przygoda", navBooks: "Książki", navCulture: "Kultura", navQuran: "Koran", navGames: "Gry", navSettings: "Ustawienia",
    install: "Zainstaluj", settings: "Ustawienia", language: "Język", polish: "Polski", english: "Angielski", resetToday: "Reset dzisiejszego progresu", resetStreak: "Reset streak", exportProgress: "Eksport postępu", importProgress: "Import postępu", clearData: "Wyczyść wszystkie dane",
    exportHint: "Pobierz plik JSON z całym postępem.", importHint: "Wybierz wcześniej wyeksportowany plik JSON.", dangerZone: "Strefa ostrożności", saved: "Zapisano", imported: "Zaimportowano dane", cleared: "Dane wyczyszczone",
    welcome: "Witaj w ألف AI", homeTitle: "Uczymy się arabskiego krok po kroku", homeLead: "Duże litery, spokojne powtórki, wymowa, pisanie i osobisty AI Assistant.",
    streak: "Seria dni", level: "Poziom", alphabetProgress: "Alfabet", todayTask: "Dzisiejsze zadanie", start: "Zaczynam", progress: "Postęp", points: "pkt",
    aiAssistant: "AI Assistant", aiPlaceholder: "Poproś o fiszki, quiz, historyjkę albo ciekawostkę...", send: "Wyślij", aiHello: "Cześć! Jestem Twoim Alif AI Assistantem. Mogę stworzyć fiszki, mini-lekcję, quiz, historyjkę dla Ciebie i Princess albo ciekawostkę dnia.",
    addFlashcards: "Dodaj do fiszek", saveBook: "Zapisz jako nową książeczkę", addAdventure: "Dodaj do Naszej Przygody", addCulture: "Dodaj jako ciekawostkę",
    addLesson: "Stwórz lekcję AI",
    more: "Więcej", play: "Odtwórz", check: "Sprawdź", clear: "Wyczyść", next: "Następna", good: "dobrze", weak: "słabo", veryWeak: "bardzo słabo", attempts: "Historia prób",
    frontHint: "Dotknij karty, żeby ją odwrócić", hard: "Trudne", ok: "OK", easy: "Łatwe", noCards: "Nie ma kart w tym trybie",
    correct: "Dobrze", wrong: "Źle", history: "Historia", stop: "Stop", record: "Rekord", score: "Wynik",
    quranTitle: "Nauka sur Koranu", quranLead: "Ucz się 10 najkrótszych sur z wymową i transliteracją. Dodaj własne.", quranFact: "Ciekawostka", quranListen: "Odsłuchaj surę", quranLearn: "Uczę się tej sury", quranLearned: "Sura zaliczona", quranAddMore: "Dodaj surę po numerze",
    learnedPct: "opanowane"
  },
  en: {
    navHome: "Home", navAlphabet: "Alphabet", navLessons: "Lessons", navFlashcards: "Cards", navSpeech: "Speech", navWriting: "Writing", navAdventure: "Adventure", navBooks: "Books", navCulture: "Culture", navQuran: "Quran", navGames: "Games", navSettings: "Settings",
    install: "Install", settings: "Settings", language: "Language", polish: "Polish", english: "English", resetToday: "Reset today's progress", resetStreak: "Reset streak", exportProgress: "Export progress", importProgress: "Import progress", clearData: "Clear all data",
    exportHint: "Download a JSON file with your full progress.", importHint: "Choose a previously exported JSON file.", dangerZone: "Careful zone", saved: "Saved", imported: "Data imported", cleared: "Data cleared",
    welcome: "Welcome to ألف AI", homeTitle: "We learn Arabic step by step", homeLead: "Big letters, calm reviews, pronunciation, writing and a personal AI Assistant.",
    streak: "Daily streak", level: "Level", alphabetProgress: "Alphabet", todayTask: "Today's task", start: "Start", progress: "Progress", points: "pts",
    aiAssistant: "AI Assistant", aiPlaceholder: "Ask for flashcards, a quiz, a story or a culture fact...", send: "Send", aiHello: "Hi! I am your Alif AI Assistant. I can create flashcards, mini-lessons, quizzes, stories for you and Princess, or a daily culture fact.",
    addFlashcards: "Add to flashcards", saveBook: "Save as new book", addAdventure: "Add to Our Adventure", addCulture: "Add as culture fact",
    addLesson: "Create AI lesson",
    more: "More", play: "Play", check: "Check", clear: "Clear", next: "Next", good: "good", weak: "weak", veryWeak: "very weak", attempts: "Attempt history",
    frontHint: "Tap the card to flip it", hard: "Hard", ok: "OK", easy: "Easy", noCards: "No cards in this mode",
    correct: "Correct", wrong: "Wrong", history: "History", stop: "Stop", record: "Best", score: "Score",
    quranTitle: "Learning Quran Surahs", quranLead: "Learn 10 short surahs with pronunciation and transliteration. Add your own.", quranFact: "Did you know", quranListen: "Listen to surah", quranLearn: "I am learning this surah", quranLearned: "Surah completed", quranAddMore: "Add surah by number",
    learnedPct: "learned"
  }
};

const DAILY_TASKS_EN = dailyTasksEn;

const LESSONS_DATA = {
  pl: [
    { id: "hello", cat: "Powitania", title: "As-salamu alejkum", ar: "السَّلَامُ عَلَيْكُمْ", tr: "as-salamu alejkum", meaning: "Pokój z Tobą", task: "Powiedz ten zwrot na głos. Używaj go na powitanie." },
    { id: "hello2", cat: "Powitania", title: "Marhaba", ar: "مَرْحَبًا", tr: "marhaba", meaning: "Cześć / Witaj", task: "To nieformalne 'cześć'. Powiedz do kogoś dziś 'marhaba'." },
    { id: "sabah", cat: "Powitania", title: "Sabah al-chajr", ar: "صَبَاحُ الْخَيْرِ", tr: "sabah al-chajr", meaning: "Dzień dobry (rano)", task: "Odpowiedź brzmi: صباح النور (sabah an-nur) – 'poranek światła'. Powiedz obydwa." },
    { id: "masa", cat: "Powitania", title: "Masa al-chajr", ar: "مَسَاءُ الْخَيْرِ", tr: "masa al-chajr", meaning: "Dobry wieczór", task: "Używaj tego wieczorem. Odpowiedź: مساء النور (masa an-nur)." },
    { id: "shukran", cat: "Grzeczność", title: "Szukran", ar: "شُكْرًا", tr: "szukran", meaning: "Dziękuję", task: "Powiedz 'szukran' za coś małego dziś. Odpowiedź: عفوا (afwan) – proszę bardzo." },
    { id: "afwan", cat: "Grzeczność", title: "Afwan", ar: "عَفْوًا", tr: "afwan", meaning: "Proszę bardzo / Przepraszam", task: "Użyj 'afwan' jako odpowiedź na 'szukran'." },
    { id: "minfadlak", cat: "Grzeczność", title: "Min fadlak", ar: "مِنْ فَضْلِكَ", tr: "min fadlak", meaning: "Proszę (gdy o coś prosisz)", task: "Powiedz pełne zdanie: 'Min fadlak, ma ismak?' – Jak masz na imię, proszę?" },
    { id: "ahlan", cat: "Grzeczność", title: "Ahlan wa sahlan", ar: "أَهْلاً وَسَهْلاً", tr: "ahlan wa sahlan", meaning: "Witaj serdecznie!", task: "To cieplejsze powitanie. Powiedz je do kogoś bliskiego." },
    { id: "kayf", cat: "Rozmowa", title: "Kayfa haluk", ar: "كَيْفَ حَالُكَ؟", tr: "kayfa haluk?", meaning: "Jak się masz?", task: "Odpowiedź: بخير (bi-chajr) – dobrze. Poćwicz dialog." },
    { id: "bikhair", cat: "Rozmowa", title: "Bi-chajr", ar: "بِخَيْرٍ", tr: "bi-chajr", meaning: "Dobrze (odpowiedź na 'jak się masz')", task: "Powiedz: بخير، شكرا (bi-chajr, szukran) – Dobrze, dziękuję." },
    { id: "naam", cat: "Rozmowa", title: "Na'am / La", ar: "نَعَمْ / لَا", tr: "na'am / la", meaning: "Tak / Nie", task: "Najprostsze słowa! Powiedz na'am i la na głos 3 razy każde." },
    { id: "ismi", cat: "Rozmowa", title: "Ismi...", ar: "اِسْمِي...", tr: "ismi...", meaning: "Mam na imię...", task: "Powiedz: اسمي Abang (ismi Abang). Podaj swoje imię." },
    { id: "numbers1", cat: "Liczby", title: "Wahid, Ithnan, Thalatha", ar: "وَاحِد، اثْنَان، ثَلَاثَة", tr: "wahid, itnan, talata", meaning: "Jeden, dwa, trzy", task: "Policz po arabsku od 1 do 3 na głos." },
    { id: "numbers2", cat: "Liczby", title: "Arba, Chamsa, Sitta", ar: "أَرْبَعَة، خَمْسَة، سِتَّة", tr: "arba'a, chamsa, sitta", meaning: "Cztery, pięć, sześć", task: "Kontynuuj liczenie od 4 do 6 po arabsku." },
    { id: "numbers3", cat: "Liczby", title: "Sab'a, Thamanya, Tis'a, Aszara", ar: "سَبْعَة، ثَمَانِية، تِسْعَة، عَشَرَة", tr: "sab'a, tamania, tis'a, aszara", meaning: "Siedem, osiem, dziewięć, dziesięć", task: "Policz od 7 do 10. Teraz policz od 1 do 10!" },
    { id: "colors1", cat: "Kolory", title: "Ahmar, Azrak", ar: "أَحْمَر، أَزْرَق", tr: "ahmar, azrak", meaning: "Czerwony, niebieski", task: "Wskaż coś czerwonego i powiedz 'ahmar'. Wskaż coś niebieskiego i powiedz 'azrak'." },
    { id: "colors2", cat: "Kolory", title: "Achdar, Asfar, Abjad", ar: "أَخْضَر، أَصْفَر، أَبْيَض", tr: "achdar, asfar, abjad", meaning: "Zielony, żółty, biały", task: "Używaj kolorów, żeby opisywać rzeczy wokół siebie." },
    { id: "family1", cat: "Rodzina", title: "Ab, Umm, Achu, Ucht", ar: "أَب، أُمّ، أَخ، أُخْت", tr: "ab, umm, ach, ucht", meaning: "Ojciec, matka, brat, siostra", task: "Powiedz imiona swoich bliskich po arabsku." },
    { id: "family2", cat: "Rodzina", title: "Zawdż, Zawdża", ar: "زَوْج، زَوْجَة", tr: "zawdż, zawdża", meaning: "Mąż, żona", task: "Powiedz: زوجتي Princess (zawdżati Princess) – moja żona Princess." },
    { id: "food1", cat: "Jedzenie", title: "Chubz, Ma, Lahm, Fawakiha", ar: "خُبْز، مَاء، لَحْم، فَوَاكِه", tr: "chubz, ma, lahm, fawakiha", meaning: "Chleb, woda, mięso, owoce", task: "Wskaż każdy z tych produktów i powiedz jego arabską nazwę." },
    { id: "food2", cat: "Jedzenie", title: "Aruzz, Samak, Chudra", ar: "أَرُزّ، سَمَك، خُضَار", tr: "aruzz, samak, chudra", meaning: "Ryż, ryba, warzywa", task: "Arabska kuchnia jest bogata w ryż i ryby. Powiedz te słowa 3 razy." },
    { id: "places1", cat: "Miejsca", title: "Manzil, Masdżid, Madrasah", ar: "مَنْزِل، مَسْجِد، مَدْرَسَة", tr: "manzil, masdżid, madrasa", meaning: "Dom, meczet, szkoła", task: "Wskaż kierunek każdego miejsca w swoim otoczeniu." },
    { id: "places2", cat: "Miejsca", title: "Suq, Shira, Maktaba", ar: "سُوق، شَارِع، مَكْتَبَة", tr: "suq, szari', maktaba", meaning: "Rynek, ulica, biblioteka", task: "Powiedz zdanie: أنا في السوق (ana fi as-suq) – jestem na rynku." },
    { id: "time1", cat: "Czas", title: "Yawm, Usbu, Szahr", ar: "يَوْم، أُسْبُوع، شَهْر", tr: "jawm, usbu', szahr", meaning: "Dzień, tydzień, miesiąc", task: "Powiedz: كل يوم (kull jawm) – każdego dnia. Mów to jako motywację!" },
    { id: "time2", cat: "Czas", title: "Al-yawm, Ams, Ghadan", ar: "الْيَوْم، أَمْس، غَدًا", tr: "al-jawm, ams, ghadan", meaning: "Dzisiaj, wczoraj, jutro", task: "Powiedz: غداً سأتعلم المزيد (ghadan sa'ata'allam al-mazid) – jutro nauczę się więcej." },
    { id: "emotions1", cat: "Emocje", title: "Fariha, Hazin, Mutafail", ar: "فَرِح، حَزِين، مُتَفَائِل", tr: "farih, hazin, mutafa'il", meaning: "Szczęśliwy, smutny, optymistyczny", task: "Jak się dziś czujesz? Powiedz to po arabsku!" },
    { id: "love1", cat: "Uczucia", title: "Uhibbuka", ar: "أُحِبُّكَ", tr: "uhibbuka (do mężczyzny) / uhibbuki (do kobiety)", meaning: "Kocham cię", task: "Powiedz 'uhibbuki ya Princess' – kocham cię, Princess. 💕" },
    { id: "love2", cat: "Uczucia", title: "Wahashtani / Asztaqtu ilayk", ar: "وَحَشْتَنِي / اشْتَقْتُ إِلَيْكَ", tr: "wahashtani / asztaqtu ilayk", meaning: "Tęskniłam za tobą / Stęskniłem się za tobą", task: "To piękne zdanie na powitanie po długiej rozłące. Poćwicz je." },
    { id: "islam1", cat: "Islam", title: "Bismillah", ar: "بِسْمِ اللَّهِ", tr: "bismillah", meaning: "W imię Allaha (zacznij każde działanie)", task: "Powiedz bismillah przed jedzeniem lub rozpoczęciem nauki." },
    { id: "islam2", cat: "Islam", title: "Alhamdulillah", ar: "الْحَمْدُ لِلَّهِ", tr: "alhamdulillah", meaning: "Chwała Allahowi (dziękczynienie)", task: "Powiedz alhamdulillah za coś dobrego, co się dziś zdarzyło." },
    { id: "islam3", cat: "Islam", title: "Inszallah", ar: "إِنْ شَاءَ اللَّهُ", tr: "insza'allah", meaning: "Jeśli Allah zechce (o planach w przyszłości)", task: "Powiedz: غداً، إن شاء الله – jutro, insza'allah." }
  ],
  en: [
    { id: "hello", cat: "Greetings", title: "As-salamu alaykum", ar: "السَّلَامُ عَلَيْكُمْ", tr: "as-salamu alaykum", meaning: "Peace be upon you", task: "Say this greeting out loud. Use it as a hello." },
    { id: "hello2", cat: "Greetings", title: "Marhaba", ar: "مَرْحَبًا", tr: "marhaba", meaning: "Hello / Welcome", task: "This is an informal hello. Say 'marhaba' to someone today." },
    { id: "sabah", cat: "Greetings", title: "Sabah al-khayr", ar: "صَبَاحُ الْخَيْرِ", tr: "sabah al-khayr", meaning: "Good morning", task: "The reply is: صباح النور (sabah an-nur) – morning of light. Practice both." },
    { id: "masa", cat: "Greetings", title: "Masa al-khayr", ar: "مَسَاءُ الْخَيْرِ", tr: "masa al-khayr", meaning: "Good evening", task: "Use this in the evening. Reply: مساء النور (masa an-nur)." },
    { id: "shukran", cat: "Politeness", title: "Shukran", ar: "شُكْرًا", tr: "shukran", meaning: "Thank you", task: "Say 'shukran' for something small today. Reply: عفوا (afwan) – you're welcome." },
    { id: "afwan", cat: "Politeness", title: "Afwan", ar: "عَفْوًا", tr: "afwan", meaning: "You're welcome / Sorry", task: "Use 'afwan' as a response to 'shukran'." },
    { id: "minfadlak", cat: "Politeness", title: "Min fadlak", ar: "مِنْ فَضْلِكَ", tr: "min fadlak", meaning: "Please (when asking for something)", task: "Say a full sentence: 'Min fadlak, ma ismak?' – What is your name, please?" },
    { id: "ahlan", cat: "Politeness", title: "Ahlan wa sahlan", ar: "أَهْلاً وَسَهْلاً", tr: "ahlan wa sahlan", meaning: "Welcome! (warm)", task: "This is a warmer welcome. Say it to someone close to you." },
    { id: "kayf", cat: "Conversation", title: "Kayfa haluk", ar: "كَيْفَ حَالُكَ؟", tr: "kayfa haluk?", meaning: "How are you?", task: "Reply: بخير (bi-khayr) – fine. Practice the dialogue." },
    { id: "bikhair", cat: "Conversation", title: "Bi-khayr", ar: "بِخَيْرٍ", tr: "bi-khayr", meaning: "Fine (reply to 'how are you')", task: "Say: بخير، شكرا (bi-khayr, shukran) – Fine, thank you." },
    { id: "naam", cat: "Conversation", title: "Na'am / La", ar: "نَعَمْ / لَا", tr: "na'am / la", meaning: "Yes / No", task: "The simplest words! Say na'am and la out loud 3 times each." },
    { id: "ismi", cat: "Conversation", title: "Ismi...", ar: "اِسْمِي...", tr: "ismi...", meaning: "My name is...", task: "Say: اسمي Abang (ismi Abang). Add your name." },
    { id: "numbers1", cat: "Numbers", title: "Wahid, Ithnan, Thalatha", ar: "وَاحِد، اثْنَان، ثَلَاثَة", tr: "wahid, ithnan, thalatha", meaning: "One, two, three", task: "Count from 1 to 3 in Arabic out loud." },
    { id: "numbers2", cat: "Numbers", title: "Arba, Khamsa, Sitta", ar: "أَرْبَعَة، خَمْسَة، سِتَّة", tr: "arba'a, khamsa, sitta", meaning: "Four, five, six", task: "Continue counting from 4 to 6 in Arabic." },
    { id: "numbers3", cat: "Numbers", title: "Sab'a, Thamanya, Tis'a, Ashara", ar: "سَبْعَة، ثَمَانِية، تِسْعَة، عَشَرَة", tr: "sab'a, thamanya, tis'a, ashara", meaning: "Seven, eight, nine, ten", task: "Count from 7 to 10. Now count from 1 to 10!" },
    { id: "colors1", cat: "Colors", title: "Ahmar, Azraq", ar: "أَحْمَر، أَزْرَق", tr: "ahmar, azraq", meaning: "Red, blue", task: "Point to something red and say 'ahmar'. Point to something blue and say 'azraq'." },
    { id: "colors2", cat: "Colors", title: "Akhdar, Asfar, Abyad", ar: "أَخْضَر، أَصْفَر، أَبْيَض", tr: "akhdar, asfar, abyad", meaning: "Green, yellow, white", task: "Use colors to describe things around you." },
    { id: "family1", cat: "Family", title: "Ab, Umm, Akh, Ukht", ar: "أَب، أُمّ، أَخ، أُخْت", tr: "ab, umm, akh, ukht", meaning: "Father, mother, brother, sister", task: "Say the names of your family members in Arabic." },
    { id: "family2", cat: "Family", title: "Zawj, Zawja", ar: "زَوْج، زَوْجَة", tr: "zawj, zawja", meaning: "Husband, wife", task: "Say: زوجتي Princess (zawjati Princess) – my wife Princess." },
    { id: "food1", cat: "Food", title: "Khubz, Ma, Lahm, Fawakiha", ar: "خُبْز، مَاء، لَحْم، فَوَاكِه", tr: "khubz, ma, lahm, fawakiha", meaning: "Bread, water, meat, fruits", task: "Point to each of these items and say its Arabic name." },
    { id: "food2", cat: "Food", title: "Ruzz, Samak, Khudar", ar: "أَرُزّ، سَمَك، خُضَار", tr: "ruzz, samak, khudar", meaning: "Rice, fish, vegetables", task: "Arabic cuisine is rich in rice and fish. Say these words 3 times." },
    { id: "places1", cat: "Places", title: "Manzil, Masjid, Madrasa", ar: "مَنْزِل، مَسْجِد، مَدْرَسَة", tr: "manzil, masjid, madrasa", meaning: "Home, mosque, school", task: "Point in the direction of each place in your surroundings." },
    { id: "places2", cat: "Places", title: "Suq, Shari, Maktaba", ar: "سُوق، شَارِع، مَكْتَبَة", tr: "suq, shari', maktaba", meaning: "Market, street, library", task: "Say: أنا في السوق (ana fi as-suq) – I am at the market." },
    { id: "time1", cat: "Time", title: "Yawm, Usbu, Shahr", ar: "يَوْم، أُسْبُوع، شَهْر", tr: "yawm, usbu', shahr", meaning: "Day, week, month", task: "Say: كل يوم (kull yawm) – every day. Use it as motivation!" },
    { id: "time2", cat: "Time", title: "Al-yawm, Ams, Ghadan", ar: "الْيَوْم، أَمْس، غَدًا", tr: "al-yawm, ams, ghadan", meaning: "Today, yesterday, tomorrow", task: "Say: غداً سأتعلم المزيد (ghadan sa'ata'allam al-mazid) – tomorrow I will learn more." },
    { id: "emotions1", cat: "Emotions", title: "Farih, Hazin, Mutafa'il", ar: "فَرِح، حَزِين، مُتَفَائِل", tr: "farih, hazin, mutafa'il", meaning: "Happy, sad, optimistic", task: "How do you feel today? Say it in Arabic!" },
    { id: "love1", cat: "Feelings", title: "Uhibbuka / Uhibbuki", ar: "أُحِبُّكَ / أُحِبُّكِ", tr: "uhibbuka (to a man) / uhibbuki (to a woman)", meaning: "I love you", task: "Say 'uhibbuki ya Princess' – I love you, Princess. 💕" },
    { id: "love2", cat: "Feelings", title: "Wahashtani / Ishtaqtu ilayk", ar: "وَحَشْتَنِي / اشْتَقْتُ إِلَيْكَ", tr: "wahashtani / ishtaqtu ilayk", meaning: "I missed you", task: "This is a beautiful phrase for reunion. Practice it." },
    { id: "islam1", cat: "Islam", title: "Bismillah", ar: "بِسْمِ اللَّهِ", tr: "bismillah", meaning: "In the name of Allah (start any action)", task: "Say bismillah before eating or starting your study." },
    { id: "islam2", cat: "Islam", title: "Alhamdulillah", ar: "الْحَمْدُ لِلَّهِ", tr: "alhamdulillah", meaning: "Praise be to Allah (gratitude)", task: "Say alhamdulillah for something good that happened today." },
    { id: "islam3", cat: "Islam", title: "Insha'Allah", ar: "إِنْ شَاءَ اللَّهُ", tr: "insha'allah", meaning: "If Allah wills (for future plans)", task: "Say: غداً، إن شاء الله – tomorrow, insha'allah." }
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
let catchScore = 0;
let catchMisses = 0;
let speechUnlocked = false;

const defaultState = {
  lang: "pl",
  profile: "",
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
  surahProgress: {},
  learnedSurahs: {},
  customSurahs: []
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
  return state.lang === "pl" ? letter.polishName : (LETTER_NAMES_EN[letter.id] || letter.transliteration || letter.id);
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
  return state.lang === "pl" ? dailyTasks : DAILY_TASKS_EN || dailyTasks;
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

function activeProfile() {
  return state.profile === "Princess" ? "Princess" : "Abang";
}

function activeProfileLabel() {
  return activeProfile();
}

function partnerLabel() {
  return activeProfile() === "Princess" ? "Abang" : "Princess";
}

function nicknameForFeedback() {
  return activeProfile();
}

function homeLeadText() {
  if (state.lang === "pl") {
    return `Duże litery, spokojne powtórki, wymowa, pisanie i osobisty AI Assistant dla ${activeProfileLabel()}.`;
  }
  return `Big letters, calm reviews, pronunciation, writing, and a personal AI Assistant for ${activeProfileLabel()}.`;
}

function aiHelloText() {
  if (state.lang === "pl") {
    return `Cześć ${activeProfileLabel()}! Jestem Twoim Alif AI Assistantem. Mogę stworzyć fiszki, lekcję, quiz, historyjkę dla Ciebie i ${partnerLabel()}, ciekawostkę dnia lub pomóc z surami Koranu. O co chcesz poprosić?`;
  }
  return `Hi ${activeProfileLabel()}! I am your Alif AI Assistant. I can create flashcards, lessons, quizzes, stories for you and ${partnerLabel()}, culture facts, or help with Quran surahs. What would you like to ask?`;
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
  const profileContext = state.lang === "pl"
    ? `Aktywny profil: ${activeProfileLabel()}. Partner/partnerka: ${partnerLabel()}.`
    : `Active profile: ${activeProfileLabel()}. Partner: ${partnerLabel()}.`;
  return `${state.lang === "en" ? AI_SYSTEM_PROMPT_EN : AI_SYSTEM_PROMPT_PL}\n${profileContext}`;
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const next = { ...defaultState, ...parsed };
    if (!THEMES.includes(next.theme)) next.theme = "light";
    next.learnedLetters = [...new Set(next.learnedLetters || [])].filter((id) => arabicAlphabet.some((letter) => letter.id === id));
    return next;
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    if (e.name === "QuotaExceededError" || e.code === 22 || e.code === 1014) {
      state.recordings = {};
      state.adventurePhotos = state.adventurePhotos.slice(0, 3);
      state.writingAttempts = state.writingAttempts.slice(0, 5);
      state.aiMessages = state.aiMessages.slice(-10);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
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
  document.documentElement.dataset.theme = state.theme;
  applyThemeMeta();
  updateDocumentI18nMeta();
  registerPwa();
  renderNav();
  bindGlobalEvents();
  mountAiAssistant();
  mountProfileGate();
  scheduleRomanticToast();
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
  const delay = (1.5 + Math.random() * 2.5) * 60 * 1000;
  setTimeout(() => {
    showLoveToast();
    scheduleRomanticToast();
  }, delay);
}

function mountProfileGate() {
  if (state.profile) return;
  document.body.insertAdjacentHTML("beforeend", `
    <div id="profileGate" class="profile-gate">
      <section class="w-full max-w-3xl">
        <div class="mb-5 text-center">
          <img src="assets/icon.svg" alt="Alif AI" class="mx-auto h-20 w-20 rounded-lg shadow-sm" />
          <h1 class="mt-4 text-4xl font-black">Alif AI</h1>
          <p class="mt-2 text-[var(--muted)]">${state.lang === "pl" ? "Kto dziś uczy się arabskiego?" : "Who is learning Arabic today?"}</p>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <button class="profile-card" data-profile="Abang">
            <strong class="mt-2 block text-4xl">Abang</strong>
            <span class="mt-3 block text-[var(--muted)]">${state.lang === "pl" ? "Witaj, Abang 💪" : "Welcome, Abang 💪"}</span>
          </button>
          <button class="profile-card" data-profile="Princess">
            <strong class="mt-2 block text-4xl">Princess</strong>
            <span class="mt-3 block text-[var(--muted)]">${state.lang === "pl" ? "Witaj, Princess 🌸" : "Welcome, Princess 🌸"}</span>
          </button>
        </div>
      </section>
    </div>
  `);
  document.querySelectorAll("[data-profile]").forEach((button) => button.addEventListener("click", () => {
    state.profile = button.dataset.profile;
    saveState();
    $("#profileGate")?.remove();
    render();
  }));
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
    .then((reg) => {
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") reg.update();
      });
      setInterval(() => reg.update(), 5 * 60 * 1000);
      reg.addEventListener("updatefound", () => {
        const sw = reg.installing;
        sw.addEventListener("statechange", () => {
          if (sw.state === "installed" && navigator.serviceWorker.controller) {
            sw.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });
    })
    .catch(() => {});

  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (!reloading) { reloading = true; window.location.reload(); }
  });
}

function renderNav() {
  nav.innerHTML = navItems.map(([id, icon, labelKey]) => `
    <button class="nav-btn ${route === id ? "active" : ""}" data-route="${id}">
      <span class="text-xl">${icon}</span><span>${t(labelKey)}</span>
    </button>
  `).join("");
  nav.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => setRoute(button.dataset.route));
  });
}

function render() {
  if (catchTimer) {
    clearInterval(catchTimer);
    catchTimer = null;
  }
  renderNav();
  const currentThemeMeta = themeMeta(state.theme);
  $("#themeBtn").textContent = currentThemeMeta.icon;
  $("#themeBtn").title = currentThemeMeta.title;
  applyThemeMeta();
  updateDocumentI18nMeta();
  $("#installBtn").textContent = t("install");
  $("#quickLangBtn").textContent = state.lang === "pl" ? "PL" : "EN";
  $("#profileBadge").textContent = state.profile ? `${activeProfileLabel()} · ألف AI` : "ألف AI";
  const aiFabLabel = $("#aiFab .hidden");
  if (aiFabLabel) aiFabLabel.textContent = t("aiAssistant");
  const aiInput = $("#aiInput");
  if (aiInput) aiInput.placeholder = t("aiPlaceholder");
  const views = { home, alphabet, lessons, flashcards, speech, writing, adventure, books, culture, quran, games, settings };
  (views[route] || home)();
}

function home() {
  const tasks = activeDailyTasks();
  const task = tasks[new Date().getDate() % tasks.length];
  view.innerHTML = `
    <div class="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      <section class="panel romantic-hero p-5 sm:p-7">
        <div class="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="font-bold text-emerald-600">${t("welcome")}</p>
            <h1 class="mt-2 text-3xl font-black sm:text-5xl">${t("homeTitle")} 🌸</h1>
            <p class="mt-3 max-w-2xl text-[var(--muted)]">${homeLeadText()} 💕</p>
          </div>
          <div class="grid h-28 w-28 shrink-0 place-items-center rounded-lg bg-emerald-500 text-7xl text-white shadow-sm arabic">ا</div>
        </div>
        <div class="mt-7 grid gap-3 sm:grid-cols-4">
          ${statCard(t("streak"), `${state.streak} ${tx("dni", "days")}`, tx("Codzienna obecność", "Daily presence"))}
          ${statCard(t("level"), `${t("level")} ${level()}`, `${state.points} ${t("points")}`)}
          ${statCard(t("alphabetProgress"), `${progressPercent()}%`, `${state.learnedLetters.length}/28`)}
          ${statCard(t("navQuran"), `${Object.keys(state.surahProgress || {}).filter((id) => state.surahProgress[id]?.length > 0).length}/${surahs.length}`, tx("sur", "surahs"))}
        </div>
      </section>
      <aside class="grid gap-4">
        <div class="soft-panel p-5">
          <h2 class="text-xl font-black">${t("todayTask")}</h2>
          <p class="mt-2 text-[var(--muted)]">${task}</p>
          <button class="big-action mt-4 w-full bg-emerald-500 text-white" data-route="alphabet">${t("start")}</button>
        </div>
        <div class="panel p-5">
          <div class="flex items-center justify-between gap-3">
            <h2 class="text-xl font-black">${t("progress")}</h2>
            <span class="font-bold text-amber-500">${state.points} ${t("points")}</span>
          </div>
          <div class="mt-4 h-4 overflow-hidden rounded-full bg-emerald-100">
            <div class="h-full rounded-full bg-emerald-500" style="width:${progressPercent()}%"></div>
          </div>
        </div>
        ${installButtonHtml("shadow-sm")}
      </aside>
    </div>
    ${journeyWidget()}
    <div class="mt-4 grid gap-3 sm:grid-cols-6">
      ${quickLink(t("aiAssistant"), tx("Twórz fiszki, quizy i historie", "Create cards, quizzes and stories"), "ai")}
      ${quickLink(t("navLessons"), tx("Słowa i zwroty", "Words and phrases"), "lessons")}
      ${quickLink(t("navQuran"), tx("Ucz się sur Koranu", "Learn Quran surahs"), "quran")}
      ${quickLink(t("navCulture"), tx("Ciekawostka dnia", "Daily culture fact"), "culture")}
      ${quickLink(t("navAdventure"), tx("Zdjęcia i historie AI", "Photos and AI stories"), "adventure")}
      ${quickLink(t("navGames"), tx("Quiz, memory i łapanie liter", "Quiz, memory and catch game"), "games")}
    </div>
  `;
  view.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.route === "ai") openAiChat();
      else setRoute(button.dataset.route);
    });
  });
  bindInstallButtons();
  $("#switchProfileBtn")?.addEventListener("click", () => {
    state.profile = state.profile === "Princess" ? "Abang" : "Princess";
    saveState();
    render();
  });
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
          <h2 class="mt-1 text-2xl font-black">Myslenice - Surabaya</h2>
          <button id="switchProfileBtn" class="mt-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm font-black">${tx("Profil", "Profile")}: ${activeProfileLabel()}</button>
        </div>
        <div>
          <div class="mb-3 flex justify-between gap-3 text-sm font-black">
            <span>Myslenice ${myslenice}</span>
            <span>Surabaya ${surabaya}</span>
          </div>
          <div class="journey-line"></div>
          <p class="mt-3 text-center text-sm text-[var(--muted)]">~10 700 km · PL ↔ ID</p>
        </div>
        <div class="soft-panel p-4 text-center">
          <p class="text-sm font-black text-amber-600">${state.lang === "pl" ? `Do wylotu do Surabayi / spotkania z ${partnerLabel()}` : `Until Surabaya flight / meeting ${partnerLabel()}`}</p>
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
        <h2 class="text-xl font-black">${tx("Profil", "Profile")}</h2>
        <p class="mt-2 text-sm text-[var(--muted)]">${tx("Aktywny profil:", "Active profile:")} <strong>${activeProfileLabel()}</strong></p>
        <div class="mt-4 grid grid-cols-2 gap-2">
          <button class="big-action ${state.profile === "Abang" ? "bg-emerald-500 text-white" : "border border-[var(--line)] bg-[var(--surface)]"}" data-profile-set="Abang">💪 Abang</button>
          <button class="big-action ${state.profile === "Princess" ? "bg-emerald-500 text-white" : "border border-[var(--line)] bg-[var(--surface)]"}" data-profile-set="Princess">🌸 Princess</button>
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
      <section class="panel p-5 lg:col-span-2">
        <h2 class="text-xl font-black">${tx("Historia AI", "AI history")}</h2>
        <div class="mt-3 grid gap-2">
          ${state.aiMessages.slice(-25).reverse().map((message) => `
            <article class="soft-panel p-3">
              <strong>${message.role === "user" ? activeProfileLabel() : "Alif AI"}</strong>
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
  view.querySelectorAll("[data-profile-set]").forEach((button) => button.addEventListener("click", () => {
    state.profile = button.dataset.profileSet;
    saveState();
    render();
  }));
  view.querySelectorAll("[data-theme-set]").forEach((button) => button.addEventListener("click", () => {
    state.theme = button.dataset.themeSet;
    document.documentElement.dataset.theme = state.theme;
    saveState();
    render();
  }));
  $("#exportStateBtn").addEventListener("click", exportState);
  $("#importStateFile").addEventListener("change", importState);
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
    state.surahProgress = {};
    state.learnedSurahs = {};
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
  link.download = `alif-ai-progress-${today()}.json`;
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
      <div><h1 class="text-3xl font-black">${tx("Alfabet arabski", "Arabic alphabet")}</h1><p class="text-[var(--muted)]">${tx("Kliknij litere, aby uslyszec wymowe. Uzyj 'Wiecej', aby zobaczyc formy i przyklad.", "Tap a letter to hear it. Use More to see forms and examples.")}</p></div>
      <span id="alphabetLearnedCount" class="font-bold text-emerald-600">${state.learnedLetters.length}/28 ${tx("poznane", "learned")}</span>
    </div>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      ${arabicAlphabet.map((letter) => `
        <article class="letter-tile relative">
          <button class="absolute right-2 top-2 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-2 py-1 text-xs font-black" data-letter-info="${letter.id}" aria-label="${t("more")}">i</button>
          <button class="speaker-btn absolute left-2 top-2" data-say="${letter.forms.isolated}" aria-label="${t("play")}">🔊</button>
          <button class="grid w-full place-items-center pt-4" data-letter-say="${letter.id}">
            <span class="arabic text-6xl">${letter.forms.isolated}</span>
            <span class="font-black">${letterName(letter)}</span>
            <span class="text-xs text-[var(--muted)]">${letter.transliteration}</span>
          </button>
        </article>
      `).join("")}
    </div>
  `;
  view.querySelectorAll("[data-letter-say]").forEach((button) => {
    button.addEventListener("click", () => {
      const letter = arabicAlphabet.find((item) => item.id === button.dataset.letterSay);
      speakArabic(letter.forms.isolated);
    });
  });
  view.querySelectorAll("[data-letter-info]").forEach((button) => {
    button.addEventListener("click", () => openLetter(button.dataset.letterInfo));
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
  markLetterLearned(id);
  updateAlphabetCounter();
  modalContent.innerHTML = `
    <div class="pr-12">
      <p class="text-sm font-bold text-emerald-600">${letter.arabicName}</p>
      <h2 class="text-3xl font-black">${letterName(letter)}</h2>
    </div>
    <div class="my-5 grid place-items-center rounded-lg bg-emerald-500 py-7 text-white">
      <span class="arabic text-8xl">${letter.forms.isolated}</span>
      <span class="mt-2 font-bold">${letter.transliteration}</span>
    </div>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      ${formBox(tx("Izolowana", "Isolated"), letter.forms.isolated)}
      ${formBox(tx("Poczatkowa", "Initial"), letter.forms.initial)}
      ${formBox(tx("Srodkowa", "Medial"), letter.forms.medial)}
      ${formBox(tx("Koncowa", "Final"), letter.forms.final)}
    </div>
    <p class="mt-5 text-[var(--muted)]">${letterPronunciationText(letter)}</p>
    <div class="soft-panel mt-5 p-4">
      <p class="text-sm font-bold text-[var(--muted)]">${tx("Przyklad", "Example")}</p>
      <p class="arabic mt-1 text-5xl">${letter.example.ar}</p>
      <p class="mt-2 font-bold">${letterExampleMeaning(letter)} <span class="text-[var(--muted)]">(${letter.example.tr})</span></p>
    </div>
  `;
  modal.showModal();
}

function markLetterLearned(id) {
  if (!state.learnedLetters.includes(id)) {
    state.learnedLetters.push(id);
    state.learnedLetters = [...new Set(state.learnedLetters)];
    state.points += 5;
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

function lessons() {
  const lessonsData = LESSONS_DATA[state.lang] || LESSONS_DATA.pl;
  const cats = [...new Set(lessonsData.map((l) => l.cat))];
  const done = new Set(state.miniLessonsDone);
  const totalDone = lessonsData.filter((l) => done.has(l.id)).length;

  view.innerHTML = `
    <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-3xl font-black">${tx("Słowa i zwroty", "Words and Phrases")}</h1>
        <p class="text-[var(--muted)]">${tx("Kliknij literę, żeby usłyszeć. Zalicz lekcję, żeby zdobyć punkty.", "Tap to hear. Complete lessons to earn points.")}</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="font-bold text-emerald-600">${totalDone}/${lessonsData.length} ${tx("zaliczone", "done")}</span>
        <button id="aiLessonBtn" class="big-action bg-amber-500 text-white px-4">${t("addLesson")}</button>
      </div>
    </div>
    <div class="mb-4 h-3 overflow-hidden rounded-full bg-emerald-100">
      <div class="h-full rounded-full bg-emerald-500 transition-all" style="width:${Math.round((totalDone / lessonsData.length) * 100)}%"></div>
    </div>
    ${cats.map((cat) => `
      <section class="mb-6">
        <h2 class="mb-3 text-lg font-black text-[var(--muted)]">${cat}</h2>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          ${lessonsData.filter((l) => l.cat === cat).map((lesson) => `
            <article class="lesson-card ${done.has(lesson.id) ? "done" : ""}">
              <div class="flex items-start justify-between gap-2">
                <h3 class="font-black">${lesson.title}</h3>
                ${done.has(lesson.id) ? `<span class="text-emerald-500 text-xl">✓</span>` : ""}
              </div>
              <p class="arabic text-4xl leading-relaxed">${lesson.ar}</p>
              <p class="text-sm font-bold">${lesson.meaning}</p>
              <p class="text-xs text-[var(--muted)]">${lesson.tr}</p>
              <p class="text-xs text-[var(--muted)] border-t border-[var(--line)] pt-2">${lesson.task}</p>
              <div class="flex gap-2 pt-1">
                <button class="big-action flex-1 bg-emerald-500 text-white text-sm" data-say="${escapeHtml(lesson.ar)}">🔊 ${t("play")}</button>
                <button class="big-action flex-1 ${done.has(lesson.id) ? "border border-[var(--line)] bg-[var(--surface)]" : "bg-amber-500 text-white"} text-sm" data-lesson="${lesson.id}">${done.has(lesson.id) ? tx("Zaliczone ✓", "Done ✓") : tx("Zalicz", "Complete")}</button>
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    `).join("")}
    <div id="aiLessonResult"></div>
  `;
  view.querySelectorAll("[data-say]").forEach((button) => button.addEventListener("click", () => speakArabic(button.dataset.say)));
  view.querySelectorAll("[data-lesson]").forEach((button) => button.addEventListener("click", () => {
    const id = button.dataset.lesson;
    if (!done.has(id)) {
      state.miniLessonsDone.push(id);
      done.add(id);
      addPoints(18, false);
      saveState();
      confetti();
      button.textContent = tx("Zaliczone ✓", "Done ✓");
      button.className = "big-action flex-1 border border-[var(--line)] bg-[var(--surface)] text-sm";
      button.closest("article")?.classList.add("done");
    }
  }));
  $("#aiLessonBtn").addEventListener("click", generateAiLesson);
}

async function generateAiLesson() {
  const resultArea = $("#aiLessonResult");
  const btn = $("#aiLessonBtn");
  btn.textContent = tx("Tworzę...", "Creating...");
  btn.disabled = true;
  try {
    const prompt = tx(
      "Stwórz jedną prostą lekcję arabskiego dla początkującego. Format: tytuł po polsku, arabski zwrot w piśmie arabskim, transliteracja fonetyczna, tłumaczenie po polsku, krótkie zadanie (1 zdanie). Pisz prosto i przyjaźnie.",
      "Create one simple Arabic lesson for a beginner. Format: English title, Arabic phrase in Arabic script, phonetic transliteration, English translation, short task (1 sentence). Write simply and friendly."
    );
    const text = await askGroq([{ role: "user", content: prompt }]);
    resultArea.innerHTML = `
      <div class="panel p-5 mt-4">
        <div class="flex items-center justify-between gap-3 mb-3">
          <h2 class="text-xl font-black">${tx("Nowa lekcja AI", "New AI Lesson")}</h2>
          <button id="addLessonToFlash" class="big-action bg-emerald-500 text-white">${t("addFlashcards")}</button>
        </div>
        <p class="whitespace-pre-wrap text-[var(--muted)]">${escapeHtml(text)}</p>
      </div>
    `;
    $("#addLessonToFlash").addEventListener("click", () => {
      addAiFlashcards(text);
      confetti();
    });
  } catch {
    resultArea.innerHTML = `<p class="mt-4 text-red-500">${tx("Błąd AI. Sprawdź internet.", "AI error. Check internet.")}</p>`;
  }
  btn.textContent = t("addLesson");
  btn.disabled = false;
}

function flashcards() {
  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Fiszki", "Flashcards")}</h1>
      <p class="text-[var(--muted)]">${tx("Prosty SM-2: latwe karty wracaja pozniej, trudne szybciej. AI moze dopisywac wlasne fiszki.", "Simple SM-2: easy cards return later, difficult cards return sooner. AI can add custom cards.")}</p>
    </div>
    <div class="mb-3 flex flex-wrap gap-2">
      <button class="tab-btn active" data-tab="letters">${tx("Litery", "Letters")}</button>
      <button class="tab-btn" data-tab="words">${tx("Slowa", "Words")}</button>
      <button class="tab-btn" data-tab="ai">AI</button>
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
    ? arabicAlphabet.map((letter) => ({
        id: `letter-${letter.id}`,
        front: letter.forms.isolated,
        translation: letterName(letter),
        transliteration: letter.transliteration,
        back: `${letterName(letter)} · ${letter.transliteration}`,
        hint: letter.transliteration,
        exampleWord: {
          ar: letter.example.ar,
          pl: letterExampleMeaning(letter),
          tr: letter.example.tr
        }
      }))
    : tab === "words"
      ? words.map((word) => ({
          id: `word-${word.id}`,
          front: word.ar,
          translation: wordMeaning(word),
          transliteration: word.tr,
          back: `${wordMeaning(word)} · ${word.tr}`,
          hint: tx("słowo", "word")
        }))
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

function flashCardStats() {
  const total = arabicAlphabet.length + words.length + state.customFlashcards.length;
  const learned = Object.values(state.flashcards).filter((m) => m && m.repetitions >= 2).length;
  const pct = total ? Math.round((learned / total) * 100) : 0;
  return `<div class="flash-stats-bar mb-3">
    <span class="flash-stat">📊 ${pct}% ${t("learnedPct")}</span>
    <span class="flash-stat">${learned}/${total} ${tx("kart", "cards")}</span>
    <span class="flash-stat">${flashIndex}/${flashDeck.length}</span>
  </div>`;
}

function renderFlashCard() {
  const area = $("#flashArea");
  if (!flashDeck.length) {
    area.innerHTML = `<div class="panel p-6 text-center"><h2 class="text-2xl font-black">${t("noCards")}</h2><p class="mt-2 text-[var(--muted)]">${tx("Wróć do losowych albo poproś AI Assistanta o nowe fiszki.", "Go back to random mode or ask the AI Assistant for new cards.")}</p><button id="openAiFromFlash" class="big-action mt-4 bg-emerald-500 text-white">${tx("Poproś AI", "Ask AI")}</button></div>`;
    $("#openAiFromFlash")?.addEventListener("click", openAiChat);
    return;
  }
  const card = flashDeck[flashIndex % flashDeck.length];
  const back = parseBack(card.back);
  const translation = card.translation || back.translation || (state.lang === "pl" ? "Fiszka Alif AI" : "Alif AI card");
  const transliteration = card.transliteration || back.transliteration || card.hint || "";
  const meta = state.flashcards[card.id];
  const historyTag = meta
    ? `<span class="flash-stat">${tx("powtórzenia", "reps")}: ${meta.repetitions} · ${tx("EF", "EF")}: ${meta.ef?.toFixed(1) ?? "2.5"}</span>`
    : `<span class="flash-stat text-amber-600">${tx("nowa karta", "new card")}</span>`;

  const exampleWord = card.exampleWord;
  const backContent = exampleWord
    ? `<p class="arabic text-5xl leading-relaxed">${exampleWord.ar}</p>
       <p class="mt-2 font-black text-xl">${escapeHtml(exampleWord.pl)}</p>
       <p class="text-sm text-[var(--muted)]">${escapeHtml(exampleWord.tr)}</p>
       <button type="button" class="speaker-btn mt-2" data-say-back="${escapeHtml(exampleWord.ar)}">🔊</button>`
    : `<p class="text-3xl font-black leading-snug">${escapeHtml(translation)}</p>
       <p class="mt-3 rounded-lg bg-[var(--surface-soft)] px-4 py-2 text-lg font-bold text-[var(--muted)]">${escapeHtml(transliteration)}</p>`;

  area.innerHTML = `
    ${flashCardStats()}
    <div id="flipCard" class="flashcard block w-full text-left" role="button" tabindex="0" aria-label="${tx("Odwróć fiszkę", "Flip flashcard")}">
      <div class="flashcard-inner">
        <div class="flash-face flash-front">
          <div class="text-center">
            <p class="arabic text-8xl leading-normal">${card.front}</p>
            <button type="button" class="speaker-btn mt-4" data-say-card="${escapeHtml(card.front)}">🔊</button>
            <p class="mt-3 text-sm font-bold text-[var(--muted)]">${card.hint || ""}</p>
            <p class="mt-2 text-xs text-[var(--muted)]">${t("frontHint")}</p>
          </div>
        </div>
        <div class="flash-face flash-back">
          <div class="text-center w-full">
            <p class="mb-3 text-sm font-bold text-[var(--muted)]">${escapeHtml(translation)} · ${escapeHtml(transliteration)}</p>
            ${backContent}
            <p class="mt-4 text-sm text-[var(--muted)]">${tx("Jak poszło?", "How did it go?")}</p>
            <div class="flash-stats-bar mt-2 justify-center">${historyTag}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4 grid grid-cols-3 gap-2">
      <button class="big-action bg-red-500 text-white" data-grade="1">${t("hard")} ↩</button>
      <button class="big-action bg-amber-500 text-white" data-grade="3">${t("ok")} →</button>
      <button class="big-action bg-emerald-500 text-white" data-grade="5">${t("easy")} ↑</button>
    </div>
    <p class="mt-2 text-center text-xs text-[var(--muted)]">${tx("Trudne: wraca jutro · OK: za kilka dni · Łatwe: za długo", "Hard: returns tomorrow · OK: in a few days · Easy: much later")}</p>
  `;
  $("#flipCard").addEventListener("click", (event) => event.currentTarget.classList.toggle("flipped"));
  $("#flipCard").addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    event.currentTarget.classList.toggle("flipped");
  });
  area.querySelector("[data-say-card]")?.addEventListener("click", (event) => {
    event.stopPropagation();
    speakArabic(event.currentTarget.dataset.sayCard);
  });
  area.querySelector("[data-say-back]")?.addEventListener("click", (event) => {
    event.stopPropagation();
    speakArabic(event.currentTarget.dataset.sayBack);
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

function speakArabic(text) {
  const clean = String(text || "").trim();
  if (!clean || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();

  const pickArabicVoice = () => {
    const voices = speechSynthesis.getVoices();
    return voices.find((voice) => /^ar\b/i.test(voice.lang || ""))
      || voices.find((voice) => (voice.name || "").toLowerCase().includes("arab"))
      || null;
  };

  const speakNow = () => {
    const primaryVoice = pickArabicVoice();
    const buildUtterance = (lang, voice = null, rate = 0.78) => {
      const utterance = new SpeechSynthesisUtterance(clean);
      utterance.lang = lang;
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.volume = 1;
      if (voice) utterance.voice = voice;
      return utterance;
    };

    let triedFallback = false;
    const utterance = buildUtterance(primaryVoice?.lang || "ar", primaryVoice);
    utterance.onerror = () => {
      if (triedFallback) return;
      triedFallback = true;
      speechSynthesis.cancel();
      const fallback = buildUtterance("ar", null, 0.85);
      fallback.onerror = () => {
        const lastFallback = buildUtterance("", null, 0.9);
        speechSynthesis.speak(lastFallback);
      };
      speechSynthesis.speak(fallback);
    };
    speechSynthesis.resume();
    speechSynthesis.speak(utterance);
  };
  if (!speechSynthesis.getVoices().length) {
    speechSynthesis.onvoiceschanged = () => {
      speechSynthesis.onvoiceschanged = null;
      speakNow();
    };
    setTimeout(speakNow, 120);
  } else {
    speakNow();
  }
}

function startSpeech(sample) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    $("#speechText").textContent = tx("Ta przegladarka nie obsluguje SpeechRecognition.", "This browser does not support SpeechRecognition.");
    return;
  }
  if (recognition) { try { recognition.abort(); } catch {} recognition = null; }
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
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    try { mediaRecorder.stop(); } catch {}
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
  const name = nicknameForFeedback();
  if (score >= 92) return `${score}% - ${tx(`prawie idealnie, ${name}!`, `almost perfect, ${name}!`)}`;
  if (score >= 68) return `${score}% - ${tx(`piekny postep, ${name}.`, `beautiful progress, ${name}.`)}`;
  if (score >= 38) return `${score}% - ${tx("jeszcze odrobina spokoju i bedzie lepiej.", "a little more calm and it will improve.")}`;
  return `${score}% - ${tx("sprobuj narysowac wiecej po sladzie.", "try tracing more of the guide.")}`;
}

function setupCanvas() {
  const canvas = $("#writingCanvas");
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  if (rect.width < 10) { requestAnimationFrame(setupCanvas); return; }
  const ctx = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  writingInk = 0;
  writingLastPoint = null;
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.width * ratio);
  ctx.scale(ratio, ratio);
  ctx.clearRect(0, 0, rect.width, rect.width);
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--surface");
  ctx.fillRect(0, 0, rect.width, rect.width);
  ctx.globalAlpha = 0.24;
  ctx.fillStyle = "#047857";
  ctx.font = `${rect.width * 0.68}px serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(writingLetter.forms.isolated, rect.width / 2, rect.width / 2);
  ctx.globalAlpha = 0.18;
  ctx.strokeStyle = "#EAB308";
  ctx.lineWidth = Math.max(2, rect.width * 0.008);
  ctx.strokeText(writingLetter.forms.isolated, rect.width / 2, rect.width / 2);
  ctx.globalAlpha = 1;
  ctx.lineWidth = Math.max(8, rect.width * 0.025);
  ctx.lineCap = "round";
  ctx.strokeStyle = "#EAB308";

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
  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Nasza Przygoda 2.0", "Our Adventure 2.0")}</h1>
      <p class="text-[var(--muted)]">${tx("Dodawaj wiele zdjec i generuj czyste historyjki bez surowych linkow markdown.", "Add multiple photos and generate clean stories without raw markdown links.")}</p>
    </div>
    <div class="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <section class="panel p-5">
        <label class="block">
          <span class="font-bold">${tx("Wspolne zdjecia", "Shared photos")}</span>
          <input id="photoInput" class="mt-3 block w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4" type="file" accept="image/*" multiple />
        </label>
        ${state.pendingAdventurePhoto ? `
          <div class="soft-panel mt-4 p-4">
            <img src="${state.pendingAdventurePhoto}" alt="${tx("Nowe zdjecie", "New photo")}" class="h-48 w-full rounded-lg object-cover" />
            <h2 class="mt-3 text-xl font-black">${tx("Czy wygenerowac historyjke na podstawie tego zdjecia?", "Generate a story based on this photo?")}</h2>
            <textarea id="storyPrompt" class="mt-3 min-h-28 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4" placeholder="${tx("Dopisz kierunek lub temat...", "Add a direction or theme...")}"></textarea>
            <div class="mt-3 grid gap-2 sm:grid-cols-2">
              <button id="generateStoryBtn" class="big-action bg-emerald-500 text-white">${tx("Tak, generuj", "Yes, generate")}</button>
              <button id="savePhotoOnlyBtn" class="big-action border border-[var(--line)] bg-[var(--surface)]">${tx("Tylko zapisz zdjecie", "Save photo only")}</button>
            </div>
          </div>
        ` : `
          <textarea id="storyPrompt" class="mt-4 min-h-28 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] p-4" placeholder="${tx("Np. Napisz ciepla historyjke o naszej podrozy do Indonezji i nauce slowa ????", "Example: Write a warm story about our trip to Indonesia and learning ????")}"></textarea>
          <button id="generateStoryBtn" class="big-action mt-3 w-full bg-emerald-500 text-white">${tx("Generuj historyjke AI", "Generate AI story")}</button>
        `}
      </section>
      <section class="grid gap-3">
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
          ${state.adventurePhotos.map((src, index) => `
            <figure class="panel overflow-hidden">
              <img src="${src}" alt="${tx("Wspolne zdjecie", "Shared photo")} ${index + 1}" class="h-36 w-full object-cover" />
              <figcaption class="p-3 text-sm font-bold">${tx("Wspomnienie", "Memory")} ${index + 1}</figcaption>
            </figure>
          `).join("") || `<div class="soft-panel col-span-full p-6 text-center text-[var(--muted)]">${tx("Galeria czeka na pierwsze zdjecia.", "Gallery is waiting for first photos.")}</div>`}
        </div>
        ${state.adventureStories.map((story) => `
          <article class="panel p-4">
            ${story.photo ? `<img src="${story.photo}" alt="${escapeHtml(story.title)}" class="mb-3 h-44 w-full rounded-lg object-cover" />` : ""}
            <div class="mb-2 flex items-center justify-between gap-3">
              <strong>${story.title}</strong>
              <button class="rounded-lg bg-amber-500 px-3 py-2 font-bold text-white" data-regenerate-story="${story.id}">${tx("Nowa wersja", "New version")}</button>
            </div>
            <p class="whitespace-pre-wrap text-[var(--muted)]">${escapeHtml(story.text)}</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <button class="rounded-lg bg-emerald-500 px-3 py-2 font-bold text-white" data-save-story-book="${story.id}">${tx("Zapisz jako nowa ksiazeczke", "Save as new book")}</button>
              <button class="rounded-lg bg-amber-500 px-3 py-2 font-bold text-white" data-story-flashcards="${story.id}">${tx("Dodaj wszystkie slowa do fiszek", "Add all words to flashcards")}</button>
              <button class="rounded-lg border border-[var(--line)] px-3 py-2 font-bold" data-save-story-gallery="${story.id}">${tx("Zapisz do galerii", "Save to gallery")}</button>
            </div>
          </article>
        `).join("")}
      </section>
    </div>
  `;
  $("#photoInput").addEventListener("change", (event) => {
    [...event.target.files].forEach((file) => readFileAsDataUrl(file, (url) => {
      state.pendingAdventurePhoto = url;
      saveState();
      adventure();
    }));
  });
  $("#generateStoryBtn").addEventListener("click", generateAdventureStory);
  $("#savePhotoOnlyBtn")?.addEventListener("click", () => {
    state.adventurePhotos.unshift(state.pendingAdventurePhoto);
    state.pendingAdventurePhoto = null;
    saveState();
    adventure();
  });
  view.querySelectorAll("[data-save-story-book]").forEach((button) => button.addEventListener("click", () => {
    const story = state.adventureStories.find((item) => item.id === button.dataset.saveStoryBook);
    saveInteractiveBook(story.title, story.text);
    setRoute("books");
  }));
  view.querySelectorAll("[data-story-flashcards]").forEach((button) => button.addEventListener("click", () => {
    const story = state.adventureStories.find((item) => item.id === button.dataset.storyFlashcards);
    addAiFlashcards(story.text);
    setRoute("flashcards");
  }));
  view.querySelectorAll("[data-save-story-gallery]").forEach((button) => button.addEventListener("click", () => {
    const story = state.adventureStories.find((item) => item.id === button.dataset.saveStoryGallery);
    const fallback = tx("Romantyczny zachod slonca", "Romantic sunset");
    const name = prompt(tx("Nazwa wspomnienia w galerii:", "Gallery memory name:"), story?.title || fallback) || fallback;
    if (story) story.galleryName = name;
    if (story?.photo && !state.adventurePhotos.includes(story.photo)) state.adventurePhotos.unshift(story.photo);
    if (state.pendingAdventurePhoto) state.adventurePhotos.unshift(state.pendingAdventurePhoto);
    state.pendingAdventurePhoto = null;
    saveState();
    confetti();
    adventure();
  }));
  view.querySelectorAll("[data-regenerate-story]").forEach((button) => button.addEventListener("click", async () => {
    const story = state.adventureStories.find((item) => item.id === button.dataset.regenerateStory);
    $("#storyPrompt").value = `${tx("Napisz nowa wersje tej historyjki, czysto i bez markdownowych linkow:", "Write a new clean version of this story without markdown links:")}\n${story.text}`;
    await generateAdventureStory();
  }));
}

async function generateAdventureStory() {
  const userPrompt = $("#storyPrompt").value.trim();
  $("#generateStoryBtn").textContent = tx("Piszę...", "Writing...");
  try {
    const basePrompt = tx(
      `Napisz KRÓTKĄ historyjkę (3-4 zdania) o Abangu i Princess. Użyj 1-2 arabskich słów i w nawiasach podaj ich znaczenie po polsku. Pisz prosto, ciepło. Bez markdown, bez listy przycisków. ${userPrompt}`,
      `Write a SHORT story (3-4 sentences) about Abang and Princess. Use 1-2 Arabic words and put their English meaning in brackets. Write simply and warmly. No markdown, no button lists. ${userPrompt}`
    );
    const text = cleanAiText(await askGroq([{ role: "user", content: basePrompt }]));
    const story = { id: crypto.randomUUID(), title: tx(`Historia ${new Date().toLocaleDateString(localeTag())}`, `Story ${new Date().toLocaleDateString(localeTag())}`), text, photo: state.pendingAdventurePhoto };
    state.adventureStories.unshift(story);
    if (state.pendingAdventurePhoto) state.adventurePhotos.unshift(state.pendingAdventurePhoto);
    state.pendingAdventurePhoto = null;
    saveState();
    adventure();
  } catch (error) {
    const btn = $("#generateStoryBtn");
    if (btn) btn.textContent = tx("Błąd AI", "AI error");
  }
}

function cleanAiText(text) {
  return text.replace(/\[(Dodaj|Add|Zapisz|Save)[^\]]*\]\([^)]+\)/gi, "").replace(/```/g, "").trim();
}

function books() {
  const hasBooks = state.interactiveBooks.length + state.books.length > 0;
  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Moje książeczki", "My Books")}</h1>
      <p class="text-[var(--muted)]">${tx("Dodaj PDF lub link, żeby tworzyć interaktywne karty z wymową.", "Add a PDF or link to create interactive pronunciation cards.")}</p>
    </div>
    <div class="panel grid gap-3 p-5 mb-4">
      <div class="grid gap-2 sm:grid-cols-2">
        <input id="bookTitle" class="min-h-12 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4" placeholder="${tx("Tytuł książeczki (opcjonalnie)", "Book title (optional)")}" />
        <input id="bookLink" class="min-h-12 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4" placeholder="${tx("Link do PDF (opcjonalnie)", "PDF link (optional)")}" />
      </div>
      <input id="bookFile" class="rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3 text-sm" type="file" accept="application/pdf" />
      <div class="grid gap-2 sm:grid-cols-2">
        <button id="addBook" class="big-action bg-emerald-500 text-white">${tx("Dodaj PDF", "Add PDF")}</button>
        <button id="extractBook" class="big-action bg-amber-500 text-white">${tx("Wyciągnij karty z PDF", "Extract cards from PDF")}</button>
      </div>
    </div>
    ${!hasBooks ? `<div class="soft-panel p-8 text-center text-[var(--muted)]"><p class="text-4xl mb-3">📚</p><p>${tx("Nie dodano jeszcze żadnych książeczek. Dodaj PDF lub link powyżej.", "No books added yet. Add a PDF or link above.")}</p></div>` : ""}
    ${state.interactiveBooks.length ? `
      <h2 class="text-xl font-black mb-3">${tx("Interaktywne", "Interactive")}</h2>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        ${state.interactiveBooks.map((book) => `
          <button class="panel p-4 text-left group" data-interactive-book="${book.id}">
            <div class="book-cover grid place-items-center text-3xl font-black mb-3">✦ AI</div>
            <strong class="block leading-snug">${escapeHtml(book.title)}</strong>
            <span class="text-sm text-[var(--muted)]">${book.cards.length} ${tx("kart interaktywnych", "interactive cards")}</span>
          </button>
        `).join("")}
      </div>
    ` : ""}
    ${state.books.length ? `
      <h2 class="text-xl font-black mb-3">PDF</h2>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        ${state.books.map((book) => `
          <button class="panel p-4 text-left" data-book="${book.id}">
            <div class="book-cover grid place-items-center text-3xl font-black mb-3">PDF</div>
            <strong class="block leading-snug">${escapeHtml(book.title)}</strong>
            <span class="text-sm text-[var(--muted)]">${book.sourceType === "file" ? tx("plik lokalny", "local file") : tx("link", "link")}</span>
          </button>
        `).join("")}
      </div>
    ` : ""}
    <div id="pdfViewer" class="mt-4"></div>
  `;
  $("#addBook").addEventListener("click", addBook);
  $("#extractBook").addEventListener("click", extractBook);
  view.querySelectorAll("[data-book]").forEach((button) => button.addEventListener("click", () => openBook(button.dataset.book)));
  view.querySelectorAll("[data-interactive-book]").forEach((button) => button.addEventListener("click", () => openInteractiveBook(button.dataset.interactiveBook)));
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
  const title = $("#bookTitle").value.trim() || tx("Interaktywna książeczka", "Interactive booklet");
  const file = $("#bookFile").files[0];
  const link = $("#bookLink").value.trim();
  const button = $("#extractBook");
  if (!file && !link) {
    alert(tx("Wybierz plik PDF lub podaj link.", "Choose a PDF file or enter a link."));
    return;
  }
  button.textContent = tx("Czytam PDF...", "Reading PDF...");
  try {
    const source = file ? new Uint8Array(await file.arrayBuffer()) : link;
    const text = await extractPdfText(source);
    const cards = makeBookCards(text);
    state.interactiveBooks.unshift({ id: crypto.randomUUID(), title, rawText: text.slice(0, 12000), cards });
    saveState();
    books();
  } catch (error) {
    button.textContent = tx("Nie udało się odczytać", "Could not read PDF");
    setTimeout(() => { button.textContent = tx("Wyciągnij karty z PDF", "Extract cards from PDF"); }, 3000);
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
  const arabicTokens = (text.match(/[\u0600-\u06FF][\u0600-\u06FF\s\u064B-\u0652\uFE70-\uFEFF]*/g) || [])
    .map((t) => t.trim())
    .filter((t) => t.length > 1)
    .slice(0, 36);

  if (arabicTokens.length >= 4) {
    return arabicTokens.map((ar) => {
      const foundWord = words.find((w) => w.ar === ar);
      return {
        ar,
        pl: foundWord ? wordMeaning(foundWord) : extractNearbyLine(text, ar) || ar,
        tr: foundWord ? foundWord.tr : ar
      };
    });
  }

  const shuffledWords = [...words].sort(() => Math.random() - 0.5).slice(0, 8);
  return shuffledWords.map((word) => ({ ar: word.ar, pl: wordMeaning(word), tr: word.tr }));
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
  const arabicMatches = text.match(/[؀-ۿ][؀-ۿ\sً-ْـ]*/g) || [];
  let cards;
  if (arabicMatches.length >= 2) {
    cards = arabicMatches.slice(0, 12).map((ar, index) => {
      const trimmed = ar.trim();
      const foundWord = words.find((w) => w.ar === trimmed);
      const nearbyLine = extractNearbyLine(text, trimmed);
      return {
        ar: trimmed,
        pl: foundWord ? wordMeaning(foundWord) : (nearbyLine || trimmed),
        tr: foundWord ? foundWord.tr : trimmed
      };
    });
  } else {
    const lines = text.split(/[.!?\n]+/).map((l) => l.trim()).filter(Boolean).slice(0, 12);
    const allWords = [...words].sort(() => Math.random() - 0.5);
    cards = lines.map((line, index) => ({
      ar: allWords[index % allWords.length].ar,
      pl: line,
      tr: allWords[index % allWords.length].tr
    }));
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
  const todayFacts = state.cultureFacts.filter((item) => item.date === today());
  const latestFact = todayFacts[0];
  const pastFacts = state.cultureFacts.filter((item) => item.date !== today()).slice(0, 8);

  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Kultura i ciekawostki", "Culture & Facts")}</h1>
      <p class="text-[var(--muted)]">${tx("Ciekawostki o arabskim, islamie, Indonezji i kulturze.", "Facts about Arabic, Islam, Indonesia and culture.")}</p>
    </div>
    <section class="panel p-5 mb-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div class="flex-1">
          <p class="text-sm font-bold text-emerald-600">${tx("Ciekawostka dnia", "Fact of the day")} · ${today()}</p>
          <h2 class="text-xl font-black mt-1">${latestFact ? escapeHtml(latestFact.title) : tx("Wygeneruj dzisiejszą ciekawostkę", "Generate today's fact")}</h2>
          ${latestFact ? `<p class="mt-3 text-[var(--muted)] leading-relaxed">${escapeHtml(latestFact.text)}</p>` : `<p class="mt-3 text-sm text-[var(--muted)]">${tx("Kliknij przycisk, żeby AI napisał krótką ciekawostkę.", "Click the button for AI to write a short fact.")}</p>`}
        </div>
        <button id="generateCultureBtn" class="big-action bg-emerald-500 text-white shrink-0">${latestFact ? tx("Nowa AI", "New AI") : tx("Generuj AI", "Generate AI")}</button>
      </div>
    </section>
    ${pastFacts.length ? `
      <h2 class="text-xl font-black mb-3">${tx("Poprzednie ciekawostki", "Previous facts")}</h2>
      <div class="grid gap-3 sm:grid-cols-2">
        ${pastFacts.map((item) => `
          <article class="soft-panel p-4">
            <p class="text-xs font-bold text-[var(--muted)] mb-1">${item.date}</p>
            <h3 class="font-black text-sm">${escapeHtml(item.title)}</h3>
            <p class="mt-2 text-sm text-[var(--muted)] leading-relaxed">${escapeHtml(item.text)}</p>
          </article>
        `).join("")}
      </div>
    ` : ""}
  `;
  $("#generateCultureBtn").addEventListener("click", generateCultureFact);
}

async function generateCultureFact() {
  const button = $("#generateCultureBtn");
  button.textContent = tx("Myślę...", "Thinking...");
  try {
    const promptText = tx(
      "Napisz jedną krótką ciekawostkę o arabskiej kulturze, islamie lub Indonezji. Max 3 zdania. Podaj jedno arabskie słowo i jego wymowę w nawiasach. Tylko treść, żadnych przycisków ani instrukcji.",
      "Write one short culture fact about Arabic culture, Islam, or Indonesia. Max 3 sentences. Include one Arabic word and its pronunciation in brackets. Only content, no buttons or instructions."
    );
    const text = await askGroq([{ role: "user", content: promptText }]);
    const cleanText = cleanAiText(text);
    const dateStr = new Date().toLocaleDateString(localeTag());
    state.cultureFacts.unshift({
      id: crypto.randomUUID(),
      date: today(),
      title: tx(`Ciekawostka ${dateStr}`, `Fact ${dateStr}`),
      text: cleanText
    });
    saveState();
    culture();
  } catch {
    const btn = $("#generateCultureBtn");
    if (btn) btn.textContent = tx("Błąd AI", "AI error");
  }
}

function quran() {
  if (!state.learnedSurahs) state.learnedSurahs = {};
  if (!state.surahProgress) state.surahProgress = {};
  const customSurahs = state.customSurahs || [];
  const allSurahs = [...surahs, ...customSurahs];
  const totalAyat = allSurahs.reduce((sum, s) => sum + s.ayat.length, 0);
  const learnedAyat = Object.values(state.surahProgress).reduce((sum, arr) => sum + (Array.isArray(arr) ? arr.length : 0), 0);
  const pct = totalAyat ? Math.round((learnedAyat / totalAyat) * 100) : 0;

  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${t("quranTitle")}</h1>
      <p class="text-[var(--muted)]">${t("quranLead")}</p>
    </div>
    <div class="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-3">
        <div class="h-3 flex-1 min-w-48 overflow-hidden rounded-full bg-emerald-100">
          <div class="h-full rounded-full bg-emerald-500 transition-all" style="width:${pct}%"></div>
        </div>
        <span class="font-bold text-emerald-600">${pct}% ${t("learnedPct")}</span>
      </div>
      <button id="addCustomSurah" class="big-action bg-amber-500 text-white">${t("quranAddMore")}</button>
    </div>
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-4">
      ${allSurahs.map((surah) => {
        const learned = state.surahProgress[surah.id] || [];
        const surahPct = Math.round((learned.length / surah.ayat.length) * 100);
        return `
          <button class="surah-card text-left ${learned.length === surah.ayat.length ? "surah-card active" : ""}" data-surah="${surah.id}">
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-xs font-bold text-[var(--muted)]">${tx("Sura", "Surah")} ${surah.number}</span>
              <span class="text-xs font-bold ${learned.length === surah.ayat.length ? "text-emerald-500" : "text-[var(--muted)]"}">${surahPct}%</span>
            </div>
            <p class="arabic text-2xl leading-relaxed">${surah.name}</p>
            <p class="font-black mt-1">${state.lang === "pl" ? surah.namePl : surah.nameEn}</p>
            <p class="text-sm text-[var(--muted)]">${state.lang === "pl" ? surah.meaningPl : surah.meaningEn} · ${surah.ayat.length} ${tx("ajatów", "ayat")}</p>
            <div class="mt-3 h-2 overflow-hidden rounded-full bg-emerald-100">
              <div class="h-full rounded-full bg-emerald-500" style="width:${surahPct}%"></div>
            </div>
          </button>
        `;
      }).join("")}
    </div>
    <div id="surahDetail"></div>
  `;

  view.querySelectorAll("[data-surah]").forEach((btn) => {
    btn.addEventListener("click", () => openSurah(btn.dataset.surah, allSurahs));
  });

  $("#addCustomSurah").addEventListener("click", () => addCustomSurahByNumber(allSurahs));
}

function openSurah(id, allSurahs) {
  const surah = allSurahs.find((s) => s.id === id);
  if (!surah) return;
  if (!state.surahProgress) state.surahProgress = {};
  const learned = new Set(state.surahProgress[surah.id] || []);
  const detail = $("#surahDetail");

  detail.innerHTML = `
    <div class="panel p-5">
      <div class="flex items-start justify-between gap-3 mb-4">
        <div>
          <p class="text-sm font-bold text-[var(--muted)]">${tx("Sura", "Surah")} ${surah.number}</p>
          <h2 class="text-2xl font-black">${state.lang === "pl" ? surah.namePl : surah.nameEn}</h2>
          <p class="text-[var(--muted)]">${state.lang === "pl" ? surah.meaningPl : surah.meaningEn}</p>
        </div>
        <div class="arabic text-4xl leading-normal">${surah.name}</div>
      </div>
      <div class="soft-panel p-4 mb-4">
        <p class="text-sm font-bold text-emerald-600 mb-1">${t("quranFact")}</p>
        <p class="text-sm text-[var(--muted)]">${state.lang === "pl" ? surah.factPl : surah.factEn}</p>
        <button class="mt-3 big-action bg-emerald-500 text-white w-full" data-say-surah="${escapeHtml(surah.ayat.map((a) => a.ar).join(" "))}">🔊 ${t("quranListen")}</button>
      </div>
      <div class="grid gap-0">
        ${surah.ayat.map((ayah) => `
          <div class="ayah-row" data-ayah-id="${surah.id}-${ayah.n}">
            <div class="ayah-num ${learned.has(ayah.n) ? "ayah-learned" : ""}" data-ayah-num="${ayah.n}">${ayah.n}</div>
            <div>
              <p class="arabic text-2xl leading-relaxed mb-2">${ayah.ar}</p>
              <p class="text-sm font-bold text-emerald-700">${ayah.tr}</p>
              <p class="text-sm text-[var(--muted)] mt-1">${state.lang === "pl" ? ayah.pl : ayah.en}</p>
            </div>
            <button class="speaker-btn" data-say="${escapeHtml(ayah.ar)}" aria-label="${t("play")}">🔊</button>
          </div>
        `).join("")}
      </div>
      <div class="mt-5 grid gap-2 sm:grid-cols-2">
        <button id="learnSurahBtn" class="big-action bg-emerald-500 text-white">${t("quranLearn")}</button>
        <button id="surahAiBtn" class="big-action bg-amber-500 text-white">✦ ${tx("Ciekawostka AI", "AI Insight")}</button>
      </div>
      <div id="surahAiResult"></div>
    </div>
  `;

  detail.querySelectorAll("[data-say]").forEach((btn) => {
    btn.addEventListener("click", (e) => { e.stopPropagation(); speakArabic(btn.dataset.say); });
  });
  detail.querySelector("[data-say-surah]")?.addEventListener("click", (e) => {
    e.stopPropagation();
    speakArabic(e.currentTarget.dataset.saySurah);
  });

  detail.querySelector("[data-ayah-num]") && detail.querySelectorAll("[data-ayah-row], .ayah-row").forEach((row) => {
    row.addEventListener("click", () => {
      const numEl = row.querySelector("[data-ayah-num]");
      if (!numEl) return;
      const n = Number(numEl.dataset.ayahNum);
      if (learned.has(n)) {
        learned.delete(n);
        numEl.classList.remove("ayah-learned");
      } else {
        learned.add(n);
        numEl.classList.add("ayah-learned");
      }
      state.surahProgress[surah.id] = [...learned];
      saveState();
    });
  });

  $("#learnSurahBtn").addEventListener("click", () => {
    surah.ayat.forEach((a) => learned.add(a.n));
    state.surahProgress[surah.id] = [...learned];
    addPoints(surah.ayat.length * 5, false);
    saveState();
    confetti();
    detail.querySelectorAll("[data-ayah-num]").forEach((el) => el.classList.add("ayah-learned"));
    $("#learnSurahBtn").textContent = t("quranLearned");
    $("#learnSurahBtn").className = "big-action border border-[var(--line)] bg-[var(--surface)]";
  });

  $("#surahAiBtn").addEventListener("click", () => generateSurahFact(surah));
  detail.scrollIntoView({ behavior: "smooth" });
}

async function generateSurahFact(surah) {
  const btn = $("#surahAiBtn");
  const result = $("#surahAiResult");
  btn.textContent = tx("Myślę...", "Thinking...");
  btn.disabled = true;
  try {
    const prompt = tx(
      `Powiedz jedno krótkie (2-3 zdania) ciekawe fakty o surze ${surah.namePl} (${surah.nameEn}) z Koranu. Pisz po polsku, przyjaźnie. Bez markdown.`,
      `Tell one short (2-3 sentences) interesting fact about Surah ${surah.nameEn} from the Quran. Write in English, friendly. No markdown.`
    );
    const text = await askGroq([{ role: "user", content: prompt }]);
    result.innerHTML = `<div class="soft-panel p-4 mt-3"><p class="text-sm font-bold text-amber-600 mb-1">✦ AI</p><p class="text-sm">${escapeHtml(text)}</p></div>`;
  } catch {
    result.innerHTML = `<p class="mt-3 text-sm text-red-500">${tx("Błąd AI", "AI error")}</p>`;
  }
  btn.textContent = `✦ ${tx("Ciekawostka AI", "AI Insight")}`;
  btn.disabled = false;
}

async function addCustomSurahByNumber(allSurahs) {
  const input = prompt(
    tx("Podaj numer sury (1-114) lub jej angielską nazwę:", "Enter surah number (1-114) or its English name:")
  );
  if (!input) return;
  const btn = $("#addCustomSurah");
  btn.textContent = tx("Pobieram...", "Fetching...");
  btn.disabled = true;
  try {
    const promptText = tx(
      `Podaj informacje o surze Koranu numer ${input} lub o nazwie "${input}". Odpowiedz w JSON z polami: id (unikalny string), number (int), name (arabski), nameEn, namePl, meaningEn, meaningPl, factPl (2 zdania), factEn (2 zdania), ayat (tablica obiektów: n, ar, tr (transliteracja), pl, en). Podaj kompletne ajaty.`,
      `Provide information about Quran surah number ${input} or named "${input}". Reply in JSON with fields: id (unique string), number (int), name (Arabic), nameEn, namePl, meaningEn, meaningPl, factPl (2 sentences), factEn (2 sentences), ayat (array of objects: n, ar, tr (transliteration), pl, en). Include all complete ayat.`
    );
    const text = await askGroq([{ role: "user", content: promptText }]);
    const jsonMatch = text.match(/\{[\s\S]+\}/);
    if (!jsonMatch) throw new Error("No JSON");
    const surahData = JSON.parse(jsonMatch[0]);
    if (!surahData.id || !surahData.ayat?.length) throw new Error("Invalid data");
    if (allSurahs.find((s) => s.id === surahData.id || s.number === surahData.number)) {
      alert(tx("Ta sura jest już dostępna.", "This surah is already available."));
      btn.textContent = t("quranAddMore");
      btn.disabled = false;
      return;
    }
    if (!state.customSurahs) state.customSurahs = [];
    state.customSurahs.push(surahData);
    saveState();
    confetti();
    quran();
  } catch {
    alert(tx("Nie udało się pobrać sury. Spróbuj ponownie.", "Could not fetch surah. Please try again."));
    btn.textContent = t("quranAddMore");
    btn.disabled = false;
  }
}

function games() {
  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Quizy i Gry", "Quizzes and Games")}</h1>
      <p class="text-[var(--muted)]">${tx("Szybki quiz, Memory Match i prosta gra Lap litere.", "Quick quiz, Memory Match and a simple Catch the Letter game.")}</p>
    </div>
    <div class="grid gap-4 lg:grid-cols-2">
      <section class="panel p-5" id="quizBox"></section>
      <section class="panel p-5" id="memoryBox"></section>
      <section class="panel p-5 lg:col-span-2" id="catchBox"></section>
    </div>
  `;
  renderQuiz();
  renderMemory();
  renderCatchGame();
}

function renderQuiz() {
  const correct = arabicAlphabet[Math.floor(Math.random() * arabicAlphabet.length)];
  const choices = [correct, ...arabicAlphabet.filter((letter) => letter.id !== correct.id).sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5);
  $("#quizBox").innerHTML = `
    <h2 class="text-2xl font-black">Quiz</h2>
    <p class="mt-2 text-[var(--muted)]">${tx("Ktora to litera?", "Which letter is this?")}</p>
    <p class="mt-2 text-sm font-bold text-[var(--muted)]">${t("correct")}: ${state.quizStats.correct} · ${t("wrong")}: ${state.quizStats.wrong}</p>
    <p class="arabic my-6 text-center text-8xl">${correct.forms.isolated}</p>
    <button class="big-action mb-4 w-full bg-amber-500 text-white" data-say="${correct.forms.isolated}">🔊 ${t("play")}</button>
    <div class="grid gap-2">
      ${choices.map((choice) => `<button class="big-action border border-[var(--line)] bg-[var(--surface)]" data-answer="${choice.id}">${letterName(choice)}</button>`).join("")}
    </div>
    <div class="mt-4">
      <h3 class="font-black">${t("history")}</h3>
      <div class="mt-2 grid gap-1 text-sm text-[var(--muted)]">
        ${state.quizHistory.slice(0, 5).map((item) => `<p>${item.ok ? t("correct") : t("wrong")} · ${item.letter} · ${new Date(item.date).toLocaleTimeString(localeTag())}</p>`).join("") || `<p>${tx("Brak prob.", "No attempts yet.")}</p>`}
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
        state.memoryBest = (state.memoryBest || 0) + 1;
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
      content: aiHelloText()
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
  box.scrollTop = box.scrollHeight;
}

function aiActionButtons(index) {
  return `
    <div class="mt-3 flex flex-wrap gap-2">
      <button class="ai-chip" data-ai-action="flashcards" data-message-index="${index}">${t("addFlashcards")}</button>
      <button class="ai-chip" data-ai-action="book" data-message-index="${index}">${t("saveBook")}</button>
      <button class="ai-chip" data-ai-action="adventure" data-message-index="${index}">${t("addAdventure")}</button>
      <button class="ai-chip" data-ai-action="culture" data-message-index="${index}">${t("addCulture")}</button>
      <button class="ai-chip" data-ai-action="lesson" data-message-index="${index}">${t("addLesson")}</button>
    </div>
  `;
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
      `Kontekst aplikacji: uzytkownik ma ${state.points} punktow, poziom ${level()}, zna ${state.learnedLetters.length}/28 liter. Sekcje: Alfabet, Lekcje, Fiszki, Wymowa, Pisanie, Nasza Przygoda, Ksiazeczki, Kultura, Gry.`,
      `App context: user has ${state.points} points, level ${level()}, knows ${state.learnedLetters.length}/28 letters. Sections: Alphabet, Lessons, Flashcards, Speech, Writing, Our Adventure, Books, Culture, Games.`
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

async function askGroq(messages) {
  const response = await fetch(GROQ_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: aiSystemPrompt() },
        ...messages
      ],
      temperature: 0.75,
      max_tokens: 1100
    })
  });
  if (!response.ok) {
    throw new Error(`Groq error ${response.status}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || tx("Nie dostalem tresci odpowiedzi.", "I did not receive response content.");
}

function handleAiAction(action, messageIndex) {
  const message = state.aiMessages[messageIndex];
  if (!message) return;
  if (action === "flashcards") {
    addAiFlashcards(message.content);
    setRoute("flashcards");
  } else if (action === "book") {
    saveInteractiveBook(tx(`Książeczka AI ${new Date().toLocaleDateString(localeTag())}`, `AI Book ${new Date().toLocaleDateString(localeTag())}`), message.content);
    setRoute("books");
  } else if (action === "adventure") {
    state.adventureStories.unshift({ id: crypto.randomUUID(), title: tx(`Historia AI ${new Date().toLocaleDateString(localeTag())}`, `AI Story ${new Date().toLocaleDateString(localeTag())}`), text: message.content });
    saveState();
    setRoute("adventure");
  } else if (action === "culture") {
    state.cultureFacts.unshift({ id: crypto.randomUUID(), date: today(), title: tx("Ciekawostka AI", "AI fact"), text: cleanAiText(message.content) });
    saveState();
    setRoute("culture");
  } else if (action === "lesson") {
    addAiFlashcards(message.content);
    setRoute("lessons");
  }
  $("#aiDialog").close();
  confetti();
}

function addAiFlashcards(text) {
  const created = [];
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);

  for (const line of lines) {
    const arabicMatch = line.match(/[\u0600-\u06FF][\u0600-\u06FF\u064B-\u0652\u0670\uFB50-\uFDFF\s]*/);
    if (!arabicMatch) continue;
    const front = arabicMatch[0].trim();
    if (front.length < 2) continue;
    const rest = line.replace(arabicMatch[0], "").replace(/^[-\u2013\u2014:|\u060C,\s]+/, "").trim();
    const parts = rest.split(/\s*[-\u2013\u2014\u00B7|]\s*/);
    const translation = parts[0]?.trim() || tx(`Fiszka AI ${created.length + 1}`, `AI card ${created.length + 1}`);
    const transliteration = parts[1]?.trim() || "";
    created.push({
      id: `ai-${crypto.randomUUID()}`,
      front,
      back: transliteration ? `${translation} \u00B7 ${transliteration}` : translation,
      translation,
      transliteration,
      hint: "AI"
    });
    if (created.length >= 12) break;
  }

  if (!created.length) {
    const arabicMatches = (text.match(/[\u0600-\u06FF][\u0600-\u06FF\u064B-\u0652\s]*/g) || []).filter((m) => m.trim().length > 1);
    for (const front of arabicMatches.slice(0, 12)) {
      const nearbyLine = extractNearbyLine(text, front.trim()) || front.trim();
      created.push({ id: `ai-${crypto.randomUUID()}`, front: front.trim(), back: nearbyLine, hint: "AI" });
    }
  }

  if (!created.length) {
    created.push({ id: `ai-${crypto.randomUUID()}`, front: "\u0633\u0644\u0627\u0645", back: text.slice(0, 180), hint: "AI" });
  }

  state.customFlashcards.unshift(...created);
  saveState();
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

init();
