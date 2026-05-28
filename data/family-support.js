// Convert and family support content used across Start, New Muslim, Quran and Games.

export const HOME_BRIDGE_CARDS = [
  {
    id: "for-me",
    icon: "🌱",
    route: "muallaf",
    titlePl: "Dla mnie",
    titleEn: "For me",
    textPl: "Spokojny plan dla osoby, która myśli o islamie albo jest świeżo po szahadzie.",
    textEn: "A calm plan for someone exploring Islam or newly after shahada.",
    actionPl: "Otwórz plan",
    actionEn: "Open plan"
  },
  {
    id: "for-family",
    icon: "🤝",
    route: "muallaf",
    anchor: "family",
    titlePl: "Dla rodziny",
    titleEn: "For family",
    textPl: "Proste odpowiedzi na lęki rodziców: czy dziecko nadal jest sobą, czy islam oznacza zerwanie więzi.",
    textEn: "Simple answers to family fears: whether their child is still themselves and whether Islam breaks family ties.",
    actionPl: "Pokaż rodzinie",
    actionEn: "Show family"
  },
  {
    id: "isa-maryam",
    icon: "🕊",
    route: "history",
    historyTab: "christianity",
    titlePl: "Isa i Maryam",
    titleEn: "Isa and Maryam",
    textPl: "Most dla rodzin chrześcijańskich: islam szanuje Jezusa i Maryję, ale wyjaśnia ich inaczej teologicznie.",
    textEn: "A bridge for Christian families: Islam honours Jesus and Mary while explaining them differently theologically.",
    actionPl: "Zobacz mosty",
    actionEn: "See bridges"
  },
  {
    id: "ask-ai",
    icon: "✦",
    route: "ai",
    titlePl: "Zapytaj spokojnie",
    titleEn: "Ask calmly",
    textPl: "AI odpowiada tylko o islamie, konwersji, rodzinie, Koranie i modlitwie.",
    textEn: "AI only answers about Islam, conversion, family, Quran and prayer.",
    actionPl: "Otwórz AI",
    actionEn: "Open AI"
  }
];

export const FAMILY_REASSURANCE_POINTS = [
  {
    id: "same-person",
    icon: "💚",
    titlePl: "To nadal ta sama osoba",
    titleEn: "They are still the same person",
    bodyPl: "Konwersja nie musi oznaczać odrzucenia domu, języka ani rodziny. Islam uczy dobroci wobec rodziców, nawet gdy nie podzielają wiary.",
    bodyEn: "Conversion does not need to mean rejecting home, language or family. Islam teaches kindness to parents even when they do not share the faith.",
    source: "Quran 31:14-15"
  },
  {
    id: "no-compulsion",
    icon: "🛡",
    titlePl: "Bez przymusu",
    titleEn: "No compulsion",
    bodyPl: "Islam jasno mówi, że nie ma przymusu w religii. Wiara ma sens tylko wtedy, gdy jest szczera.",
    bodyEn: "Islam clearly states there is no compulsion in religion. Faith only has meaning when it is sincere.",
    source: "Quran 2:256"
  },
  {
    id: "questions-safe",
    icon: "❔",
    titlePl: "Pytania są bezpieczne",
    titleEn: "Questions are safe",
    bodyPl: "Rodzina może pytać ostro, bo się boi. Lepsza jest spokojna odpowiedź niż debata, którą ktoś musi wygrać.",
    bodyEn: "Family may ask sharply because they are afraid. A calm answer is better than a debate someone must win.",
    source: "adab principle"
  },
  {
    id: "gradual",
    icon: "🌿",
    titlePl: "Zmiana może być stopniowa",
    titleEn: "Change can be gradual",
    bodyPl: "Nowy muzułmanin uczy się modlitwy, Koranu i nawyków krok po kroku. Perfekcja nie jest warunkiem startu.",
    bodyEn: "A new Muslim learns prayer, Quran and habits step by step. Perfection is not a condition for starting.",
    source: "Bukhari 39"
  }
];

export const FAMILY_CONVERSATION_GUIDE = [
  {
    id: "opening",
    labelPl: "Pierwsze zdanie",
    labelEn: "Opening sentence",
    textPl: "Nie chcę od was uciekać. Chcę wam spokojnie pokazać, dlaczego islam stał się dla mnie ważny.",
    textEn: "I do not want to run away from you. I want to calmly show you why Islam has become important to me."
  },
  {
    id: "jesus",
    labelPl: "Gdy pytają o Jezusa",
    labelEn: "When they ask about Jesus",
    textPl: "Nie przestałem szanować Jezusa. W islamie Isa (Jezus) jest Mesjaszem i wielkim prorokiem, ale nie Bogiem.",
    textEn: "I did not stop respecting Jesus. In Islam, Isa (Jesus) is the Messiah and a great prophet, but not God."
  },
  {
    id: "family",
    labelPl: "Gdy boją się zerwania więzi",
    labelEn: "When they fear losing family ties",
    textPl: "Islam nie pozwala mi gardzić rodzicami. Chcę być dla was lepszy, spokojniejszy i bardziej odpowiedzialny.",
    textEn: "Islam does not allow me to despise my parents. I want to be better, calmer and more responsible toward you."
  },
  {
    id: "pace",
    labelPl: "Gdy wszystko dzieje się szybko",
    labelEn: "When everything feels fast",
    textPl: "Nie musicie rozumieć wszystkiego dziś. Ja też uczę się krok po kroku. Możemy rozmawiać bez presji.",
    textEn: "You do not need to understand everything today. I am also learning step by step. We can talk without pressure."
  }
];

export const MUALLAF_SUPPORT_PANELS = [
  {
    id: "before-shahada",
    icon: "🧭",
    titlePl: "Jeśli jesteś przed szahadą",
    titleEn: "If you are before shahada",
    bodyPl: "Nie musisz znać wszystkiego. Zrozum Tawhid, sens szahady i podstawy modlitwy. Potem uczysz się dalej.",
    bodyEn: "You do not need to know everything. Understand Tawhid, the meaning of shahada and the basics of prayer. Then you keep learning.",
    route: "pillars"
  },
  {
    id: "after-shahada",
    icon: "🤲",
    titlePl: "Jeśli jesteś po szahadzie",
    titleEn: "If you are after shahada",
    bodyPl: "Najpierw Al-Fatiha, krótkie sury, wudu i jeden realistyczny rytm modlitwy. Mało, ale codziennie.",
    bodyEn: "Begin with Al-Fatiha, short surahs, wudu and one realistic prayer rhythm. Small, but daily.",
    route: "prayer"
  },
  {
    id: "family-talk",
    icon: "🏠",
    titlePl: "Jeśli boisz się rozmowy z rodziną",
    titleEn: "If you fear talking to family",
    bodyPl: "Zacznij od relacji, nie od sporu. Pokaż, że islam ma cię uczynić lepszym człowiekiem, nie obcym.",
    bodyEn: "Start from the relationship, not from an argument. Show that Islam is meant to make you better, not foreign.",
    route: "muallaf"
  }
];

export const QURAN_LEARNING_STEPS = [
  {
    id: "listen",
    icon: "🔊",
    titlePl: "Słuchaj",
    titleEn: "Listen",
    bodyPl: "Najpierw osłuchaj melodię i pauzy. Nie próbuj od razu recytować idealnie.",
    bodyEn: "First become familiar with the sound and pauses. Do not try to recite perfectly immediately."
  },
  {
    id: "read",
    icon: "👁",
    titlePl: "Czytaj z tekstu",
    titleEn: "Read with text",
    bodyPl: "Patrz na arabski, transliterację i znaczenie. Mózg łączy wtedy dźwięk z sensem.",
    bodyEn: "Look at Arabic, transliteration and meaning. The mind links sound with meaning."
  },
  {
    id: "repeat",
    icon: "🔁",
    titlePl: "Powtarzaj mało",
    titleEn: "Repeat small parts",
    bodyPl: "Jedna linijka dziennie jest lepsza niż godzina raz w miesiącu.",
    bodyEn: "One line a day is better than one hour once a month."
  },
  {
    id: "pray",
    icon: "🕌",
    titlePl: "Wprowadź do salat",
    titleEn: "Bring it into salat",
    bodyPl: "Gdy krótka sura jest stabilna, użyj jej w modlitwie. Wtedy nauka staje się żywa.",
    bodyEn: "When a short surah feels steady, use it in prayer. Then learning becomes alive."
  }
];

export const FAMILY_BRIDGE_QUIZ = [
  {
    id: "no-compulsion",
    promptPl: "Rodzic mówi: „Czy ktoś cię zmusza?”",
    promptEn: "A parent says: “Is someone forcing you?”",
    answerPl: "Islam uczy, że nie ma przymusu w religii.",
    answerEn: "Islam teaches that there is no compulsion in religion.",
    choicesPl: [
      "Islam uczy, że nie ma przymusu w religii.",
      "Najlepiej odpowiedzieć ostrą debatą.",
      "Trzeba zerwać kontakt, jeśli rodzina pyta."
    ],
    choicesEn: [
      "Islam teaches that there is no compulsion in religion.",
      "It is best to answer with a harsh debate.",
      "You must cut contact if family asks questions."
    ],
    source: "Quran 2:256"
  },
  {
    id: "parents",
    promptPl: "Rodzina boi się, że islam odcina od rodziców.",
    promptEn: "Family fears Islam cuts someone off from parents.",
    answerPl: "Islam nakazuje dobroć wobec rodziców, nawet gdy nie podzielają wiary.",
    answerEn: "Islam commands kindness to parents even when they do not share the faith.",
    choicesPl: [
      "Islam nakazuje dobroć wobec rodziców, nawet gdy nie podzielają wiary.",
      "Nowy muzułmanin nie ma już obowiązków wobec rodziny.",
      "Dobre zachowanie nie ma znaczenia w rozmowie."
    ],
    choicesEn: [
      "Islam commands kindness to parents even when they do not share the faith.",
      "A new Muslim no longer has duties toward family.",
      "Good character does not matter in conversation."
    ],
    source: "Quran 31:14-15"
  },
  {
    id: "jesus",
    promptPl: "Ktoś pyta: „Czy muzułmanie nienawidzą Jezusa?”",
    promptEn: "Someone asks: “Do Muslims hate Jesus?”",
    answerPl: "Muzułmanie kochają i szanują Isę (Jezusa) jako Mesjasza i proroka.",
    answerEn: "Muslims love and honour Isa (Jesus) as the Messiah and a prophet.",
    choicesPl: [
      "Muzułmanie kochają i szanują Isę (Jezusa) jako Mesjasza i proroka.",
      "Islam nie wspomina o Jezusie.",
      "Rodzina nie powinna zadawać takich pytań."
    ],
    choicesEn: [
      "Muslims love and honour Isa (Jesus) as the Messiah and a prophet.",
      "Islam does not mention Jesus.",
      "Family should not ask such questions."
    ],
    source: "Quran 3:45; Quran 19"
  },
  {
    id: "pace",
    promptPl: "Co jest najlepszym tonem pierwszej rozmowy?",
    promptEn: "What is the best tone for the first conversation?",
    answerPl: "Spokojny, wdzięczny i bez presji na natychmiastowe zrozumienie.",
    answerEn: "Calm, grateful and without pressure for immediate understanding.",
    choicesPl: [
      "Spokojny, wdzięczny i bez presji na natychmiastowe zrozumienie.",
      "Udowodnić wszystko naraz.",
      "Nie odpowiadać na żadne pytania."
    ],
    choicesEn: [
      "Calm, grateful and without pressure for immediate understanding.",
      "Prove everything at once.",
      "Answer no questions at all."
    ],
    source: "adab principle"
  },
  {
    id: "respect",
    promptPl: "Rodzic mówi: „Nie zgadzam się, ale chcę wiedzieć, czy nadal mnie szanujesz”.",
    promptEn: "A parent says: “I disagree, but I want to know if you still respect me.”",
    answerPl: "Islam uczy szacunku, wdzięczności i łagodności wobec rodziców.",
    answerEn: "Islam teaches respect, gratitude and gentleness toward parents.",
    choicesPl: [
      "Islam uczy szacunku, wdzięczności i łagodności wobec rodziców.",
      "Szacunek jest potrzebny tylko wtedy, gdy rodzic się zgadza.",
      "Najlepiej unikać rodziny po każdej trudnej rozmowie."
    ],
    choicesEn: [
      "Islam teaches respect, gratitude and gentleness toward parents.",
      "Respect is only needed when a parent agrees.",
      "It is best to avoid family after every difficult talk."
    ],
    source: "Quran 17:23"
  },
  {
    id: "kindness",
    promptPl: "Rodzina nie jest muzułmańska. Jak traktować ją na co dzień?",
    promptEn: "The family is not Muslim. How should they be treated day to day?",
    answerPl: "Z dobrocią i sprawiedliwością, szczególnie gdy nie walczą z czyjąś wiarą.",
    answerEn: "With kindness and justice, especially when they are not fighting someone's faith.",
    choicesPl: [
      "Z dobrocią i sprawiedliwością, szczególnie gdy nie walczą z czyjąś wiarą.",
      "Z dystansem, bo każda różnica wiary niszczy relację.",
      "Tylko przez gotowe argumenty, bez słuchania ich lęków."
    ],
    choicesEn: [
      "With kindness and justice, especially when they are not fighting someone's faith.",
      "With distance, because every faith difference destroys a relationship.",
      "Only through ready-made arguments, without hearing their fears."
    ],
    source: "Quran 60:8"
  },
  {
    id: "identity",
    promptPl: "Ktoś boi się, że islam odbierze kulturę, język i rodzinne korzenie.",
    promptEn: "Someone fears Islam will erase culture, language and family roots.",
    answerPl: "Islam uznaje różnorodność narodów i rodzin, a oczyszcza przede wszystkim wiarę i charakter.",
    answerEn: "Islam recognises the diversity of peoples and families, while primarily purifying faith and character.",
    choicesPl: [
      "Islam uznaje różnorodność narodów i rodzin, a oczyszcza przede wszystkim wiarę i charakter.",
      "Każdy muzułmanin musi porzucić swój język i dom.",
      "Nie warto tłumaczyć rodzinie, czym jest kultura, a czym religia."
    ],
    choicesEn: [
      "Islam recognises the diversity of peoples and families, while primarily purifying faith and character.",
      "Every Muslim must abandon their language and home.",
      "It is not worth explaining what is culture and what is religion."
    ],
    source: "Quran 49:13"
  },
  {
    id: "learning-pace",
    promptPl: "Nowy muzułmanin martwi się: „Nie znam jeszcze całej modlitwy”.",
    promptEn: "A new Muslim worries: “I do not know the whole prayer yet.”",
    answerPl: "Nauka idzie krok po kroku: najpierw podstawy, potem stabilność i piękno.",
    answerEn: "Learning goes step by step: first the basics, then stability and beauty.",
    choicesPl: [
      "Nauka idzie krok po kroku: najpierw podstawy, potem stabilność i piękno.",
      "Bez perfekcyjnej arabskiej recytacji nie warto zaczynać.",
      "Lepiej odłożyć modlitwę na kilka lat."
    ],
    choicesEn: [
      "Learning goes step by step: first the basics, then stability and beauty.",
      "Without perfect Arabic recitation it is not worth starting.",
      "It is better to delay prayer for several years."
    ],
    source: "Bukhari 39"
  }
];
