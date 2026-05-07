import { arabicAlphabet, words, dailyTasks, quranSurahs as QURAN_SURAHS_LOCAL } from "./data.js";

const GROQ_API_KEY = "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";
const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.3-70b-versatile";
const AI_SYSTEM_PROMPT_PL = `Jesteś ciepłym, motywującym i osobistym asystentem do nauki arabskiego w aplikacji 'Alif AI'. 
Użytkownik to Abang / Gantengku / Hubby. Jego żona to Baby / babe / wifey / princess / anioł stróż.
Zawsze odpowiadaj TYLKO w języku polskim. Bądź przyjacielski, zabawny i bardzo osobisty. 
NIGDY nie używaj surowych linków markdown ani nie generuj zbędnego kodu. 
Twórz wysokiej jakości materiały edukacyjne (fiszki, quizy, historie). 
Po wygenerowaniu treści, użytkownik będzie mógł ją dodać do sekcji Fiszki, Książeczki, Nasza Przygoda lub Kultura za pomocą przycisków w aplikacji.`;
const AI_SYSTEM_PROMPT_EN = `You are a warm, motivating and personal Arabic learning assistant inside the app 'Alif AI'.
The user is Abang / Gantengku / Hubby. His wife is Baby / babe / wifey / princess / guardian angel.
Always reply ONLY in English language. Be friendly, encouraging, playful and personal.
NEVER use raw markdown links or generate unnecessary code.
Provide high-quality Arabic learning material (flashcards, quizzes, stories).
After generating content, the user will be able to add it to Flashcards, Books, Our Adventure, or Culture sections using app buttons.`;

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
  ["koran", "📖", "navKoran"],
  ["alphabet", "ا", "navAlphabet"],
  ["lessons", "Aa", "navLessons"],
  ["culture", "✦", "navCulture"]
];

const secondaryNavItems = [
  ["flashcards", "▣", "navFlashcards"],
  ["speech", "◉", "navSpeech"],
  ["writing", "✎", "navWriting"],
  ["adventure", "☆", "navAdventure"],
  ["books", "▤", "navBooks"],
  ["games", "◎", "navGames"],
  ["badges", "🏆", "navBadges"],
  ["settings", "⚙", "navSettings"]
];

const ROMANTIC_LINES = [
  "Kocham Cię, Baby 🌸",
  "Tęsknię za Tobą, Princess 💕",
  "Habibi ❤️",
  "You are my everything, Abang 💐",
  "Aku sayang kamu 🌺",
  "Selalu rindu kamu, sayang ❤️",
  "Jesteś moim domem, gdziekolwiek jesteś 💕",
  "My heart is learning Arabic with you 🌸"
];

const I18N = {
  pl: {
    navHome: "Start", navKoran: "Qur'an", navAlphabet: "Alfabet", navLessons: "Lekcje", navFlashcards: "Fiszki", navSpeech: "Wymowa", navWriting: "Pisanie", navAdventure: "Przygoda", navBooks: "Książki", navCulture: "Kultura", navGames: "Gry", navBadges: "Odznaki", navSettings: "Ustawienia",
    install: "Zainstaluj", settings: "Ustawienia", language: "Język", polish: "Polski", english: "Angielski", resetToday: "Reset dzisiejszego progresu", resetStreak: "Reset streak", exportProgress: "Eksport postępu", importProgress: "Import postępu", clearData: "Wyczyść wszystkie dane",
    exportHint: "Pobierz plik JSON z całym postępem.", importHint: "Wybierz wcześniej wyeksportowany plik JSON.", dangerZone: "Strefa ostrożności", saved: "Zapisano", imported: "Zaimportowano dane", cleared: "Dane wyczyszczone",
    welcome: "Witaj w ألف AI", homeTitle: "Uczymy się arabskiego krok po kroku", homeLead: "Duże litery, spokojne powtórki, wymowa, pisanie i osobisty AI Assistant dla Abanga.",
    streak: "Seria dni", level: "Poziom", alphabetProgress: "Alfabet", todayTask: "Dzisiejsze zadanie", start: "Zaczynam", progress: "Postęp", points: "pkt",
    aiAssistant: "AI Assistant", aiPlaceholder: "Poproś o fiszki, quiz, historyjkę albo ciekawostkę...", send: "Wyślij", aiHello: "Cześć Abang. Jestem Twoim Alif AI Assistantem. Mogę stworzyć fiszki, mini-lekcję, quiz, historyjkę dla Ciebie i Baby albo ciekawostkę dnia.",
    addFlashcards: "Dodaj do fiszek", saveBook: "Zapisz jako nową książeczkę", addAdventure: "Dodaj do Naszej Przygody", addCulture: "Dodaj jako ciekawostkę",
    more: "Więcej", play: "Odtwórz", check: "Sprawdź", clear: "Wyczyść", next: "Następna", good: "dobrze", weak: "słabo", veryWeak: "bardzo słabo", attempts: "Historia prób",
    frontHint: "Dotknij karty, żeby ją odwrócić", hard: "Trudne", ok: "OK", easy: "Łatwe", noCards: "Nie ma kart w tym trybie",
    correct: "Dobrze", wrong: "Źle", history: "Historia", stop: "Stop", record: "Rekord", score: "Wynik",
    koranTitle: "Mój Qur'an", koranAdd: "Dodaj Surę", koranNumber: "Numer (1-114)", koranEmpty: "Nie dodano jeszcze żadnej Sury.", koranOrder: "Sortuj i filtruj sury według potrzeb.",
    lessonCategories: "Kategorie Lekcji", lessonSelect: "Wybierz kategorię"
  },
  en: {
    navHome: "Home", navKoran: "Qur'an", navAlphabet: "Alphabet", navLessons: "Lessons", navFlashcards: "Cards", navSpeech: "Speech", navWriting: "Writing", navAdventure: "Adventure", navBooks: "Books", navCulture: "Culture", navGames: "Games", navBadges: "Badges", navSettings: "Settings",
    install: "Install", settings: "Settings", language: "Language", polish: "Polish", english: "English", resetToday: "Reset today's progress", resetStreak: "Reset streak", exportProgress: "Export progress", importProgress: "Import progress", clearData: "Clear all data",
    exportHint: "Download a JSON file with your full progress.", importHint: "Choose a previously exported JSON file.", dangerZone: "Careful zone", saved: "Saved", imported: "Data imported", cleared: "Data cleared",
    welcome: "Welcome to ألف AI", homeTitle: "We learn Arabic step by step", homeLead: "Big letters, calm reviews, pronunciation, writing and a personal AI Assistant for Abang.",
    streak: "Daily streak", level: "Level", alphabetProgress: "Alphabet", todayTask: "Today's task", start: "Start", progress: "Progress", points: "pts",
    aiAssistant: "AI Assistant", aiPlaceholder: "Ask for flashcards, a quiz, a story or a culture fact...", send: "Send", aiHello: "Hi Abang. I am your Alif AI Assistant. I can create flashcards, mini-lessons, quizzes, stories for you and Baby, or a daily culture fact.",
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
    { id: "sorry", category: "Podstawy", title: "Przepraszam", ar: "آسِف", tr: "asif", meaning: "Przepraszam", task: "Powiedz na głos trzy razy." },
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
    { id: "color_green", category: "Kolory", title: "Zielony", ar: "أَخْضَر", tr: "achdar", meaning: "zielony", task: "Kolor islamu – powtórz 5 razy." },
    { id: "color_white", category: "Kolory", title: "Biały", ar: "أَبْيَض", tr: "abjad", meaning: "biały", task: "Powiedz: koszula jest biała = القميص أبيض." },
    { id: "color_black", category: "Kolory", title: "Czarny", ar: "أَسْوَد", tr: "aswad", meaning: "czarny", task: "Dodaj do fiszek i naucz się na pamięć." },
    { id: "color_blue", category: "Kolory", title: "Niebieski", ar: "أَزْرَق", tr: "azrak", meaning: "niebieski", task: "Jak kolor nieba – powiedz patrząc w okno." },
    { id: "num1", category: "Liczby", title: "Jeden", ar: "وَاحِد", tr: "wahid", meaning: "jeden (1)", task: "Policz do 5 po arabsku razem z AI." },
    { id: "num2", category: "Liczby", title: "Dwa", ar: "اثْنَان", tr: "isnan", meaning: "dwa (2)", task: "Powiedz: mam dwa... = عِنْدِي اثْنَان..." },
    { id: "num3", category: "Liczby", title: "Trzy", ar: "ثَلَاثَة", tr: "salasa", meaning: "trzy (3)", task: "Napisz po arabsku i transliteruj." },
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
    { id: "fatiha", category: "Islam – najważniejsze", title: "Al-Fatiha (wstęp)", ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", tr: "alhamdu lillahi rabbil alamin", meaning: "Chwała Bogu, Panu światów (werset 2 Al-Fatiha)", task: "Naucz się tego wersetu na pamięć – to pierwszy werset modlitwy." },
    { id: "ayat_kursi_intro", category: "Islam – najważniejsze", title: "Ajet al-Kursi (początek)", ar: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", tr: "Allahu la ilaha illa huwal hayyul qayyum", meaning: "Bóg — nie ma boga prócz Niego, Żyjącego, Samopodtrzymującego", task: "Ajet al-Kursi to najpotężniejszy werset Koranu (2:255). Zapamiętaj jego początek." },
    { id: "dua_eat", category: "Islam – codzienne", title: "Dua przed jedzeniem", ar: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ", tr: "bismillahi wa ala barakati Allah", meaning: "W imię Boga i z błogosławieństwem Boga", task: "Mów to przed każdym posiłkiem przez cały tydzień." },
    { id: "dua_after_eat", category: "Islam – codzienne", title: "Dua po jedzeniu", ar: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا", tr: "alhamdu lillahil ladhi at'amana", meaning: "Chwała Bogu, który nas nakarmił", task: "Powiedz po zakończeniu posiłku." },
    { id: "dua_sleep", category: "Islam – codzienne", title: "Dua przed snem", ar: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", tr: "bismika Allahumma amutu wa ahya", meaning: "W Twoje imię, o Boże, umieram i żyję", task: "Powiedz przed zaśnięciem każdej nocy." },
    { id: "dua_wake", category: "Islam – codzienne", title: "Dua po przebudzeniu", ar: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا", tr: "alhamdu lillahil ladhi ahyana ba'da ma amatana", meaning: "Chwała Bogu, który nas wskrzesił po tym, jak uśpił", task: "Mów po przebudzeniu zamiast sprawdzania telefonu." },
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
    { id: "sorry", category: "Basics", title: "Sorry", ar: "آسِف", tr: "asif", meaning: "Sorry / I apologize", task: "Say it out loud three times." },
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
    { id: "color_green", category: "Colors", title: "Green", ar: "أَخْضَر", tr: "akhdar", meaning: "green", task: "Color of Islam – repeat 5 times." },
    { id: "color_white", category: "Colors", title: "White", ar: "أَبْيَض", tr: "abyad", meaning: "white", task: "Say: the shirt is white = القميص أبيض." },
    { id: "color_black", category: "Colors", title: "Black", ar: "أَسْوَد", tr: "aswad", meaning: "black", task: "Add to flashcards and memorize." },
    { id: "color_blue", category: "Colors", title: "Blue", ar: "أَزْرَق", tr: "azraq", meaning: "blue", task: "Color of the sky – say it looking out the window." },
    { id: "num1", category: "Numbers", title: "One", ar: "وَاحِد", tr: "wahid", meaning: "one (1)", task: "Count to 5 in Arabic with AI's help." },
    { id: "num2", category: "Numbers", title: "Two", ar: "اثْنَان", tr: "ithnan", meaning: "two (2)", task: "Say: I have two... = عِنْدِي اثْنَان..." },
    { id: "num3", category: "Numbers", title: "Three", ar: "ثَلَاثَة", tr: "thalatha", meaning: "three (3)", task: "Write it down and transliterate it." },
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
    { id: "fatiha", category: "Islam – Essential", title: "Al-Fatiha (opening)", ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", tr: "alhamdulillahi rabbil alamin", meaning: "All praise to God, Lord of all worlds (Al-Fatiha 1:2)", task: "Memorize this verse — it opens every prayer." },
    { id: "ayat_kursi_intro", category: "Islam – Essential", title: "Ayat al-Kursi (opening)", ar: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ", tr: "Allahu la ilaha illa huwal hayyul qayyum", meaning: "Allah — there is no god but Him, the Living, the Eternal", task: "Ayat al-Kursi is the greatest verse in the Quran (2:255). Memorize its opening." },
    { id: "dua_eat", category: "Islam – Daily", title: "Dua before eating", ar: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ", tr: "bismillahi wa ala barakati Allah", meaning: "In the name of Allah and with Allah's blessings", task: "Say this before every meal for a full week." },
    { id: "dua_after_eat", category: "Islam – Daily", title: "Dua after eating", ar: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا", tr: "alhamdulillahil ladhi at'amana", meaning: "Praise be to Allah who has fed us", task: "Say this after finishing your meal." },
    { id: "dua_sleep", category: "Islam – Daily", title: "Dua before sleeping", ar: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", tr: "bismika Allahumma amutu wa ahya", meaning: "In Your name, O Allah, I die and I live", task: "Say this every night before sleeping." },
    { id: "dua_wake", category: "Islam – Daily", title: "Dua after waking", ar: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا", tr: "alhamdulillahil ladhi ahyana ba'da ma amatana", meaning: "Praise to Allah who revived us after He had put us to sleep", task: "Say this after waking up instead of checking your phone." },
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
  ttsWarningShown: false
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

function activeProfile() {
  return state.profile === "Princess" ? "Princess" : "Abang";
}

function activeProfileLabel() {
  return activeProfile();
}

function partnerLabel() {
  return activeProfile() === "Princess" ? "Abang" : "Baby";
}

function nicknameForFeedback() {
  return activeProfile() === "Princess" ? "Princess" : "Gantengku";
}

function homeLeadText() {
  if (state.lang === "pl") {
    return `Duże litery, spokojne powtórki, wymowa, pisanie i osobisty AI Assistant dla ${activeProfileLabel()}.`;
  }
  return `Big letters, calm reviews, pronunciation, writing, and a personal AI Assistant for ${activeProfileLabel()}.`;
}

function aiHelloText() {
  if (state.lang === "pl") {
    return `Cześć ${activeProfileLabel()}. Jestem Twoim Alif AI Assistantem. Mogę stworzyć fiszki, mini-lekcję, quiz, historyjkę dla Ciebie i ${partnerLabel()} albo ciekawostkę dnia.`;
  }
  return `Hi ${activeProfileLabel()}. I am your Alif AI Assistant. I can create flashcards, mini-lessons, quizzes, stories for you and ${partnerLabel()}, or a daily culture fact.`;
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
    if (!next.quranSurahFavorites) next.quranSurahFavorites = [];
    return next;
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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
  mountProfileGate();
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
  const delay = (8 + Math.random() * 7) * 60 * 1000;
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
          <p class="mt-2 text-[var(--muted)]">${state.lang === "pl" ? "Wybierz, kto dziś uczy się arabskiego." : "Choose who is learning Arabic today."}</p>
        </div>
        <div class="grid gap-3 sm:grid-cols-2">
          <button class="profile-card" data-profile="Abang">
            <span class="text-sm font-bold text-emerald-600">Gantengku</span>
            <strong class="mt-2 block text-3xl">Abang</strong>
            <span class="mt-3 block text-[var(--muted)]">${state.lang === "pl" ? "Ciepła ścieżka dla Hubby." : "A warm path for Hubby."}</span>
          </button>
          <button class="profile-card" data-profile="Princess">
            <span class="text-sm font-bold text-amber-600">Guardian angel</span>
            <strong class="mt-2 block text-3xl">Princess</strong>
            <span class="mt-3 block text-[var(--muted)]">${state.lang === "pl" ? "Delikatna ścieżka dla Baby." : "A gentle path for Baby."}</span>
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

  navigator.serviceWorker.register("./service-worker.js", { updateViaCache: "none" }).catch(() => {});
}

function renderNav() {
  const moreActive = secondaryNavItems.some(([id]) => id === route);
  nav.innerHTML =
    navItems.map(([id, icon, labelKey]) => `
      <button class="nav-btn haptic-feedback ${route === id ? "active" : ""}" data-route="${id}">
        <span class="text-xl">${icon}</span><span class="nav-label">${t(labelKey)}</span>
      </button>
    `).join("") +
    secondaryNavItems.map(([id, icon, labelKey]) => `
      <button class="nav-btn haptic-feedback ${route === id ? "active" : ""} nav-secondary" data-route="${id}">
        <span class="text-xl">${icon}</span><span class="nav-label">${t(labelKey)}</span>
      </button>
    `).join("") +
    `<button id="moreNavBtn" class="nav-btn haptic-feedback ${moreActive ? "active" : ""} nav-more">
      <span class="text-xl">⋯</span><span class="nav-label">${t("more")}</span>
    </button>`;

  nav.querySelectorAll("[data-route]").forEach((btn) => {
    btn.addEventListener("click", () => { triggerHaptic(); setRoute(btn.dataset.route); });
  });

  $("#moreNavBtn")?.addEventListener("click", () => {
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
  const views = { home, koran, alphabet, lessons, flashcards, speech, writing, adventure, books, culture, games, badges, settings };
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
          <button class="big-action mt-4 w-full bg-emerald-500 text-white" data-route="alphabet">${t("start")}</button>
        </div>
        <div id="ayatOfDay" class="panel p-5">
           <h2 class="text-xl font-black mb-3">✨ ${tx("Ayat Dnia", "Ayat of the Day")}</h2>
           <div class="skeleton h-20 w-full mb-2"></div>
        </div>
        <button class="panel p-4 text-left w-full flex items-center justify-between gap-3 active:scale-95 transition-transform" data-route="badges">
          <div>
            <h2 class="text-base font-black">${tx("Odznaki", "Badges")}</h2>
            <p class="text-xs text-[var(--muted)] mt-0.5">${tx("Twoje osiągnięcia i cele", "Your achievements and goals")}</p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <div class="flex gap-0.5">
              ${BADGES_CATALOG.slice(0, 5).map(b => `<span class="text-lg ${state.badges.includes(b.id) ? "" : "grayscale opacity-25"}">${b.icon}</span>`).join("")}
            </div>
            <span class="text-sm font-black text-amber-500">${state.badges.length}/${BADGES_CATALOG.length}</span>
          </div>
        </button>
      </aside>
    </div>
    ${journeyWidget()}
    <div class="mt-4 grid gap-3 sm:grid-cols-5">
      ${quickLink(t("aiAssistant"), tx("Tworz fiszki, quizy i historie", "Create cards, quizzes and stories"), "ai")}
      ${quickLink(t("navKoran"), tx("Czytaj i sluchaj Koranu", "Read and listen to Quran"), "koran")}
      ${quickLink(t("navLessons"), tx("Pierwsze slowa i zwroty", "First words and phrases"), "lessons")}
      ${quickLink(t("navCulture"), tx("Ciekawostka dnia", "Daily culture fact"), "culture")}
      ${quickLink(t("navGames"), tx("Quiz, memory i lapanie liter", "Quiz, memory and catch game"), "games")}
    </div>
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
          <button id="switchProfileBtn" class="mt-3 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm font-black">${tx("Profil", "Profile")}: ${activeProfileLabel()}</button>
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
  const revType = surah.revelationType === "Meccan" ? tx("Mekkańska 🕌", "Meccan 🕌") : surah.revelationType === "Medinan" ? tx("Medyńska 🕋", "Medinan 🕋") : "";
  const ayahCount = surah.numberOfAyahs ? `${surah.numberOfAyahs} ${tx("wersetów", "ayahs")}` : "";
  return `
    <article class="panel p-4 relative flex flex-col gap-2">
      <div class="flex items-center gap-3">
        <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-sm font-black text-emerald-700">${surah.number}</span>
        <div class="flex-1 min-w-0">
          <button class="arabic text-2xl leading-tight block" data-say-ar="${escapeHtml(surah.arName)}">${escapeHtml(surah.arName)}</button>
          <p class="text-xs font-black">${escapeHtml(surah.enName)}</p>
        </div>
        <button class="text-xl shrink-0" data-fav-surah="${surah.number}">${isFav ? "❤️" : "🤍"}</button>
      </div>
      <p class="text-sm text-[var(--muted)]">${escapeHtml(surah.meaning)}</p>
      <div class="flex gap-2 text-xs text-[var(--muted)]">
        ${ayahCount ? `<span class="soft-panel px-2 py-0.5">${ayahCount}</span>` : ""}
        ${revType ? `<span class="soft-panel px-2 py-0.5">${revType}</span>` : ""}
      </div>
      <div class="flex gap-2 mt-1">
        <button class="big-action flex-1 border border-[var(--line)]" data-read-surah="${surah.number}">${tx("Czytaj", "Read")}</button>
        <button class="speaker-btn" data-say-ar="${escapeHtml(surah.arName)}" title="${tx("Wymowa", "Pronunciation")}">🔊</button>
      </div>
    </article>
  `;
}

function renderSurahList() {
  if (!state.quranSurahFavorites) state.quranSurahFavorites = [];
  const sortVal = $("#surahSort")?.value || "number";
  const searchVal = ($("#surahSearch")?.value || "").toLowerCase().trim();
  const favNums = state.quranSurahFavorites;

  let surahs = [...SURAH_LIST];

  // Search filter
  if (searchVal) {
    surahs = surahs.filter(s =>
      s.enName.toLowerCase().includes(searchVal) ||
      s.meaning.toLowerCase().includes(searchVal) ||
      String(s.number).includes(searchVal) ||
      s.arName.includes(searchVal)
    );
  }

  // Category filters
  if (sortVal === "short")   surahs = surahs.filter(s => s.numberOfAyahs <= 20);
  else if (sortVal === "medium") surahs = surahs.filter(s => s.numberOfAyahs > 20 && s.numberOfAyahs <= 100);
  else if (sortVal === "long")   surahs = surahs.filter(s => s.numberOfAyahs > 100);
  else if (sortVal === "meccan") surahs = surahs.filter(s => s.revelationType === "Meccan");
  else if (sortVal === "medinan") surahs = surahs.filter(s => s.revelationType === "Medinan");
  else if (sortVal === "favfirst") surahs = surahs.sort((a, b) => {
    const aF = favNums.includes(a.number) ? 0 : 1;
    const bF = favNums.includes(b.number) ? 0 : 1;
    return aF - bF || a.number - b.number;
  });
  else if (sortVal === "alpha") surahs = surahs.sort((a, b) => a.enName.localeCompare(b.enName));
  // default: already sorted by number

  const listEl = $("#surahList");
  if (!listEl) return;

  if (!surahs.length) {
    listEl.innerHTML = `<div class="soft-panel col-span-full p-6 text-center text-[var(--muted)]">${tx("Brak wyników. Zmień filtr.", "No results. Change the filter.")}</div>`;
    return;
  }

  listEl.innerHTML = surahs.map(surahCard).join("");

  listEl.querySelectorAll("[data-say-ar]").forEach(btn => btn.addEventListener("click", (e) => {
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
        <div class="panel mb-4 p-3">
          <input id="surahSearch" type="search" class="h-10 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm mb-2" placeholder="${tx("Szukaj sury...", "Search surah...")}">
          <div class="flex gap-2">
            <select id="reciterSelect" class="h-10 flex-1 min-w-0 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm">
              ${QURAN_RECITERS.map(r => `<option value="${r.id}" ${state.quranReciter === r.id ? "selected" : ""}>${r.name}</option>`).join("")}
            </select>
            <select id="surahSort" class="h-10 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 text-sm">
              <option value="number">${tx("Kolejność (1→114)", "Order (1→114)")}</option>
              <option value="short">${tx("Krótkie (≤20 wersetów)", "Short (≤20 ayahs)")}</option>
              <option value="medium">${tx("Średnie (21–100)", "Medium (21–100)")}</option>
              <option value="long">${tx("Długie (>100)", "Long (>100)")}</option>
              <option value="meccan">${tx("Mekkańskie 🕌", "Meccan 🕌")}</option>
              <option value="medinan">${tx("Medyńskie 🕋", "Medinan 🕋")}</option>
              <option value="favfirst">${tx("Ulubione pierwsze ❤️", "Favorites first ❤️")}</option>
              <option value="alpha">${tx("Alfabetycznie A→Z", "Alphabetically A→Z")}</option>
            </select>
          </div>
        </div>
        <div id="surahList" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"></div>
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
          : `<div class="grid gap-2">${(state.quranFavorites || []).map(num => `
              <div class="soft-panel p-3 flex items-center justify-between gap-2">
                <span class="text-sm">${tx("Werset", "Ayah")} ${num}</span>
                <button class="text-red-400 text-sm font-black" data-remove-fav-ayah="${num}">✕</button>
              </div>`).join("")}</div>`
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
    $("#reciterSelect").addEventListener("change", (e) => { state.quranReciter = e.target.value; saveState(); });
    $("#surahSort").addEventListener("change", renderSurahList);
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
      state.quranFavorites = (state.quranFavorites || []).filter(n => n !== num);
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
              <div class="soft-panel p-4 ayah-card" data-ayah-num="${ayah.number}" data-ayah-text="${escapeHtml(ayah.text)}">
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
        const ayahNum = btn.dataset.favAyah;
        if (!state.quranFavorites.includes(ayahNum)) state.quranFavorites.push(ayahNum);
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
        <h2 class="text-xl font-black">${tx("Profil", "Profile")}</h2>
        <div class="mt-4 grid grid-cols-2 gap-2">
          <button class="big-action ${state.profile === "Abang" ? "bg-emerald-500 text-white" : "border border-[var(--line)] bg-[var(--surface)]"}" data-profile-set="Abang">Abang</button>
          <button class="big-action ${state.profile === "Princess" ? "bg-emerald-500 text-white" : "border border-[var(--line)] bg-[var(--surface)]"}" data-profile-set="Princess">Princess</button>
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
      <div><h1 class="text-3xl font-black">${tx("Alfabet arabski", "Arabic alphabet")}</h1><p class="text-[var(--muted)]">${tx("Kliknij litere, aby uslyszec wymowe. Uzyj 'i', aby zobaczyc formy i przyklad.", "Tap a letter to hear it. Use 'i' to see forms and examples.")}</p></div>
      <span id="alphabetLearnedCount" class="font-bold text-emerald-600">${state.learnedLetters.length}/28 ${tx("poznane", "learned")}</span>
    </div>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      ${arabicAlphabet.map((letter) => `
        <article class="letter-tile relative overflow-hidden flex flex-col items-center justify-center p-2 h-32">
          <button class="absolute right-1 top-1 z-10 grid h-6 w-6 place-items-center rounded-md border border-[var(--line)] bg-[var(--surface)] text-[9px] font-black shadow-sm" data-letter-info="${letter.id}" aria-label="${t("more")}">i</button>
          <button class="flex flex-col items-center justify-center w-full h-full pt-5 gap-0.5" data-letter-say="${letter.id}">
            <span class="arabic text-4xl sm:text-5xl leading-tight">${escapeHtml(letter.forms.isolated)}</span>
            <span class="font-black text-[11px] sm:text-xs text-center leading-tight w-full truncate px-1">${escapeHtml(letterName(letter))}</span>
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

function lessons() {
  const unlocked = state.learnedLetters.length >= arabicAlphabet.length;
  const lessonsData = LESSONS_DATA[state.lang] || LESSONS_DATA.pl;
  
  const categories = [...new Set(lessonsData.map(l => l.category))];

  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Lekcje i zwroty", "Lessons and phrases")}</h1>
      <p class="text-[var(--muted)]">${unlocked ? tx("Wybierz kategorię, aby rozpocząć naukę.", "Choose a category to start learning.") : tx("Lekcje odblokują się po poznaniu wszystkich 28 liter alfabetu.", "Lessons unlock after you learn all 28 letters.")}</p>
    </div>
    
    ${!unlocked ? `
      <div class="soft-panel p-5 mb-4">
        <div class="mb-3 flex items-center justify-between gap-3">
          <strong>${state.learnedLetters.length}/28 ${tx("liter", "letters")}</strong>
          <span class="text-sm text-[var(--muted)]">${progressPercent()}%</span>
        </div>
        <div class="h-4 overflow-hidden rounded-full bg-emerald-100"><div class="h-full bg-emerald-500" style="width:${progressPercent()}%"></div></div>
        <button class="big-action mt-4 bg-emerald-500 text-white w-full" data-route="alphabet">${tx("Dokoncz alfabet", "Finish alphabet")}</button>
      </div>
    ` : ""}

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
    area.innerHTML = `<div class="panel p-6 text-center"><h2 class="text-2xl font-black">${t("noCards")}</h2><p class="mt-2 text-[var(--muted)]">${tx("Wroc do losowych albo popros AI Assistanta o nowe fiszki.", "Go back to random mode or ask the AI Assistant for new cards.")}</p><button id="openAiFromFlash" class="big-action mt-4 bg-emerald-500 text-white">${tx("Popros AI", "Ask AI")}</button></div>`;
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
  const name = nicknameForFeedback();
  if (score >= 92) return `${score}% - ${tx(`prawie idealnie, ${name}!`, `almost perfect, ${name}!`)}`;
  if (score >= 68) return `${score}% - ${tx(`piekny postep, ${name}.`, `beautiful progress, ${name}.`)}`;
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
  const promptValue = $("#storyPrompt").value.trim() || tx("Napisz krotka, ciepla historyjke o Abangu i jego zonie, z trzema prostymi arabskimi slowami.", "Write a short warm story about Abang and his wife, using three simple Arabic words.");
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
      <textarea id="aiStoryPrompt" class="min-h-20 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] p-3 mb-3" placeholder="${tx("Temat bajki (np. Abang i księżyc, przygoda w Indonezji, kolorowe ptaki...)", "Story theme (e.g. Abang and the moon, adventure in Indonesia, colorful birds...)")}"></textarea>
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
      `Napisz krótką bajkę dla dzieci i dorosłych w dwóch językach jednocześnie, w stylu interleave: każde arabskie zdanie na osobnej linii, a bezpośrednio pod nim polskie tłumaczenie na osobnej linii. Format: linia AR, linia PL, pusta linia, kolejna para. Na końcu dodaj mini słowniczek arabskich słów użytych w bajce, każde w formacie: عربي - polskie znaczenie. ${promptText || "Bajka o nauce arabskiego."}`,
      `Write a short children's story in two languages using interleaved format: each Arabic sentence on its own line, followed immediately by the English translation on the next line. Format: AR line, EN line, blank line, next pair. At the end add a mini glossary of Arabic words used, each in format: عربي - english meaning. ${promptText || "A story about learning Arabic."}`
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
  const fact = state.cultureFacts.find((item) => item.date === today());
  view.innerHTML = `
    <div class="mb-4">
      <h1 class="text-3xl font-black">${tx("Kultura i ciekawostki", "Culture and facts")}</h1>
      <p class="text-[var(--muted)]">${tx("Ciekawostki dnia o arabskim, islamie, Indonezji i codziennych zwyczajach.", "Daily facts about Arabic, Islam, Indonesia and everyday customs.")}</p>
    </div>
    <section class="panel p-5">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm font-bold text-emerald-600">${tx("Ciekawostka dnia", "Fact of the day")}</p>
          <h2 class="text-2xl font-black">${fact ? fact.title : tx("Wygeneruj dzisiejsza ciekawostke", "Generate today's fact")}</h2>
        </div>
        <button id="generateCultureBtn" class="big-action bg-emerald-500 text-white">${fact ? tx("Odswiez AI", "Refresh AI") : tx("Generuj AI", "Generate AI")}</button>
      </div>
      <p class="mt-4 whitespace-pre-wrap text-[var(--muted)]">${fact ? escapeHtml(fact.text) : tx("AI przygotuje krotka ciekawostke z mini-slowkiem arabskim i prostym przykladem.", "AI will prepare a short fact with one Arabic mini-word and a simple example.")}</p>
    </section>
    <div class="mt-4 grid gap-3 sm:grid-cols-2">
      ${state.cultureFacts.slice(0, 8).map((item) => `
        <article class="soft-panel p-4">
          <p class="text-xs font-bold text-[var(--muted)]">${item.date}</p>
          <h3 class="mt-1 font-black">${item.title}</h3>
          <p class="mt-2 text-sm text-[var(--muted)]">${escapeHtml(item.text)}</p>
        </article>
      `).join("")}
    </div>
  `;
  $("#generateCultureBtn").addEventListener("click", generateCultureFact);
}

async function generateCultureFact() {
  const button = $("#generateCultureBtn");
  button.textContent = tx("Mysle...", "Thinking...");
  try {
    const text = await askGroq([{ role: "user", content: tx("Wygeneruj jedna ciekawostke dnia do sekcji Kultura. Ma byc krotka, ciepla, po polsku, z jednym arabskim slowem, transliteracja i mikro-zadaniem.", "Generate one fact of the day for the Culture section. It should be short, warm, in English, with one Arabic word, transliteration, and a micro-task.") }]);
    state.cultureFacts.unshift({ id: crypto.randomUUID(), date: today(), title: tx(`Ciekawostka ${new Date().toLocaleDateString(localeTag())}`, `Fact ${new Date().toLocaleDateString(localeTag())}`), text });
    saveState();
    culture();
  } catch {
    button.textContent = tx("Blad AI", "AI error");
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
    <p class="arabic my-6 text-center text-8xl">${escapeHtml(correct.forms.isolated)}</p>
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
  requestAnimationFrame(() => {
    box.scrollTop = box.scrollHeight;
  });
}

function aiActionButtons(index) {
  return `
    <div class="mt-3 flex flex-wrap gap-2">
      <button class="ai-chip" data-ai-action="flashcards" data-message-index="${index}">${t("addFlashcards")}</button>
      <button class="ai-chip" data-ai-action="book" data-message-index="${index}">${t("saveBook")}</button>
      <button class="ai-chip" data-ai-action="adventure" data-message-index="${index}">${t("addAdventure")}</button>
      <button class="ai-chip" data-ai-action="culture" data-message-index="${index}">${t("addCulture")}</button>
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
  const lessonMatches = (LESSONS_DATA[state.lang] || []).filter(l => l.title.toLowerCase().includes(q) || l.meaning.toLowerCase().includes(q) || l.ar.includes(q) || l.tr.toLowerCase().includes(q));

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
  const pairRe = /^[-•*\d.\s]*([\u0600-\u06FF][\u0600-\u06FF\s\u064B-\u0652]*?)\s*[-–—:=]+\s*(.+)$/;
  for (const line of text.split("\n")) {
    const m = line.trim().match(pairRe);
    if (m) {
      const front = m[1].trim();
      const back = m[2].trim().slice(0, 180);
      if (front.length >= 2 && back.length >= 2 && !/[\u0600-\u06FF]/.test(back)) {
        created.push({ id: `ai-${crypto.randomUUID()}`, front, back, hint: "AI" });
      }
    }
  }
  if (!created.length) {
    const arabicMatches = text.match(/[\u0600-\u06FF][\u0600-\u06FF\s\u064B-\u0652]{1,30}/g) || [];
    arabicMatches.slice(0, 10).forEach((front, index) => {
      const back = extractNearbyLine(text, front) || tx(`Fiszka AI ${index + 1}`, `AI card ${index + 1}`);
      if (!/[\u0600-\u06FF]/.test(back) && back.length > 3) {
        created.push({ id: `ai-${crypto.randomUUID()}`, front: front.trim(), back, hint: "AI" });
      }
    });
  }
  if (!created.length) {
    state.customFlashcards.unshift({ id: `ai-${crypto.randomUUID()}`, front: "\u0633\u0644\u0627\u0645", back: text.slice(0, 180), hint: "AI" });
  } else {
    state.customFlashcards.unshift(...created);
  }
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
  { id: "first_surah",    icon: "📖",  pl: "Pierwsza sura",       en: "First surah",        criterionPl: "Dodaj 1 surę Koranu",               criterionEn: "Add 1 Quran surah" },
  { id: "ten_surahs",     icon: "📚",  pl: "Dziesięć sur",        en: "Ten surahs",         criterionPl: "Dodaj 10 sur Koranu",               criterionEn: "Add 10 Quran surahs" },
  { id: "streak3",        icon: "🔥",  pl: "3 dni z rzędu",       en: "3-day streak",       criterionPl: "Ucz się 3 dni pod rząd",            criterionEn: "Learn 3 days in a row" },
  { id: "streak7",        icon: "🔥🔥", pl: "Tydzień nauki",      en: "Week streak",        criterionPl: "Ucz się 7 dni pod rząd",            criterionEn: "Learn 7 days in a row" },
  { id: "streak30",       icon: "💫",  pl: "Miesiąc nauki",       en: "Month streak",       criterionPl: "Ucz się 30 dni pod rząd",           criterionEn: "Learn 30 days in a row" },
  { id: "pts500",         icon: "💯",  pl: "500 punktów",         en: "500 points",         criterionPl: "Zdobądź 500 punktów",               criterionEn: "Earn 500 points" },
  { id: "pts2000",        icon: "💎",  pl: "2000 punktów",        en: "2000 points",        criterionPl: "Zdobądź 2000 punktów",              criterionEn: "Earn 2000 points" },
  { id: "quiz10",         icon: "🧠",  pl: "10 poprawnych",       en: "10 correct",         criterionPl: "Odpowiedz poprawnie 10 razy w quizie", criterionEn: "Answer correctly 10 times in quiz" },
  { id: "flashcards25",   icon: "🃏",  pl: "25 fiszek",           en: "25 flashcards",      criterionPl: "Miej 25 fiszek w kolekcji",         criterionEn: "Have 25 flashcards in collection" },
  { id: "lessons10",      icon: "📝",  pl: "10 lekcji",           en: "10 lessons",         criterionPl: "Zalicz 10 lekcji",                  criterionEn: "Complete 10 lessons" },
  { id: "bismillah",      icon: "🌙",  pl: "Bismillah",           en: "Bismillah",          criterionPl: "Zalicz lekcję Bismillah",           criterionEn: "Complete the Bismillah lesson" },
  { id: "shahada_badge",  icon: "☪️",  pl: "Szahada",            en: "Shahada",            criterionPl: "Zalicz lekcję Szahada",             criterionEn: "Complete the Shahada lesson" },
];

function checkBadges() {
  const ll = state.learnedLetters.length;
  const sq = (state.quranSurahFavorites || []).length;
  const pts = state.points;
  const fc = (state.customFlashcards || []).length + Object.keys(state.flashcards || {}).length;
  const ld = (state.miniLessonsDone || []).length;

  if (ll >= 1)  unlockBadge("first_letter",  tx("Pierwsza litera", "First letter"));
  if (ll >= 10) unlockBadge("ten_letters",   tx("Dziesięć liter", "Ten letters"));
  if (ll >= 14) unlockBadge("half_alphabet", tx("Połowa alfabetu", "Half alphabet"));
  if (ll >= 28) unlockBadge("full_alphabet", tx("Mistrz alfabetu", "Alphabet master"));
  if (sq >= 1)  unlockBadge("first_surah",   tx("Pierwsza sura", "First surah"));
  if (sq >= 10) unlockBadge("ten_surahs",    tx("Dziesięć sur", "Ten surahs"));
  if (state.streak >= 3)  unlockBadge("streak3",  tx("3 dni z rzędu", "3-day streak"));
  if (state.streak >= 7)  unlockBadge("streak7",  tx("Tydzień nauki", "Week streak"));
  if (state.streak >= 30) unlockBadge("streak30", tx("Miesiąc nauki", "Month streak"));
  if (pts >= 500)  unlockBadge("pts500",  tx("500 punktów", "500 points"));
  if (pts >= 2000) unlockBadge("pts2000", tx("2000 punktów", "2000 points"));
  if (state.quizStats.correct >= 10) unlockBadge("quiz10", tx("10 poprawnych", "10 correct"));
  if (fc >= 25) unlockBadge("flashcards25", tx("25 fiszek", "25 flashcards"));
  if (ld >= 10) unlockBadge("lessons10",   tx("10 lekcji", "10 lessons"));
  if ((state.miniLessonsDone || []).includes("bismillah"))    unlockBadge("bismillah",     "Bismillah");
  if ((state.miniLessonsDone || []).includes("shahada"))      unlockBadge("shahada_badge", tx("Szahada", "Shahada"));
}

function unlockBadge(id, name) {
  if (state.badges.includes(id)) return;
  state.badges.push(id);
  saveState();
  showLoveToast(`🏆 ${name}!`);
  confetti();
  triggerHaptic();
}

init();
