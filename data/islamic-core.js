const REVIEWED_AT = "2026-05-29";

const verified = {
  source_type: "quran_hadith",
  confidence: "VERIFIED",
  reviewed_at: REVIEWED_AT
};

const contextDependent = {
  source_type: "fiqh_context",
  confidence: "CONTEXT_DEPENDENT",
  reviewed_at: REVIEWED_AT
};

export const AQIDAH_BASICS = {
  sections: [
    {
      id: "rububiyyah",
      titlePl: "Tawhid ar-Rububiyyah",
      titleEn: "Tawhid ar-Rububiyyah",
      ar: "تَوْحِيدُ الرُّبُوبِيَّة",
      tr: "tawhid ar-rububiyyah",
      bodyPl:
        "Allah jest jedynym Stwórcą, Panem, Dawcą życia, śmierci i zaopatrzenia. Nikt nie współdzieli z Nim władzy nad stworzeniem.",
      bodyEn:
        "Allah alone is the Creator, Lord, giver of life, death and provision. No one shares His lordship over creation.",
      source_ref: "Quran 1:2; Quran 39:62",
      ...verified
    },
    {
      id: "uluhiyyah",
      titlePl: "Tawhid al-Uluhiyyah",
      titleEn: "Tawhid al-Uluhiyyah",
      ar: "تَوْحِيدُ الأُلُوهِيَّة",
      tr: "tawhid al-uluhiyyah",
      bodyPl: "Tylko Allah zasługuje na ibadah: modlitwę, dua, zaufanie, nadzieję, lęk religijny i oddanie serca.",
      bodyEn: "Allah alone deserves worship: prayer, dua, trust, hope, religious awe and the heart's devotion.",
      source_ref: "Quran 1:5; Quran 51:56",
      ...verified
    },
    {
      id: "asma-sifat",
      titlePl: "Tawhid al-Asma wa as-Sifat",
      titleEn: "Tawhid al-Asma wa as-Sifat",
      ar: "تَوْحِيدُ الأَسْمَاءِ وَالصِّفَات",
      tr: "tawhid al-asma wa as-sifat",
      bodyPl:
        "Allah ma najpiękniejsze imiona i doskonałe atrybuty. Przyjmujemy je z czcią, bez porównywania Allaha do stworzeń.",
      bodyEn:
        "Allah has the Most Beautiful Names and perfect attributes. We affirm them with reverence, without comparing Allah to creation.",
      source_ref: "Quran 7:180; Quran 42:11",
      ...verified
    }
  ],
  rulings: [
    {
      id: "fard",
      titlePl: "Fard / wajib",
      titleEn: "Fard / wajib",
      bodyPl: "Obowiązek. Zaniedbanie bez usprawiedliwienia jest grzechem, np. pięć modlitw.",
      bodyEn: "An obligation. Neglecting it without excuse is sinful, such as the five daily prayers.",
      source_ref: "Quran 4:103",
      ...verified
    },
    {
      id: "sunnah",
      titlePl: "Sunnah",
      titleEn: "Sunnah",
      bodyPl: "Droga Proroka ﷺ. Może oznaczać jego nauczanie ogólnie albo zalecany czyn w fiqh.",
      bodyEn: "The way of the Prophet ﷺ. It can mean his teaching generally or a recommended act in fiqh.",
      source_ref: "Quran 33:21",
      ...verified
    },
    {
      id: "mustahabb",
      titlePl: "Mustahabb",
      titleEn: "Mustahabb",
      bodyPl: "Zalecane i nagradzane, ale nie obowiązkowe. Pomaga budować nawyk dobra.",
      bodyEn: "Recommended and rewarded, but not obligatory. It helps build a habit of good.",
      source_ref: "Bukhari 6502",
      ...verified
    },
    {
      id: "makruh",
      titlePl: "Makruh",
      titleEn: "Makruh",
      bodyPl: "Odradzane. Lepiej tego unikać, choć nie zawsze jest to grzech jak haram.",
      bodyEn: "Discouraged. Better avoided, though it is not always sinful like haram.",
      source_ref: "general fiqh classification",
      ...contextDependent
    },
    {
      id: "haram",
      titlePl: "Haram",
      titleEn: "Haram",
      bodyPl:
        "Zakazane. W praktycznych przypadkach warto upewnić się u uczonego, szczególnie przy finansach, pracy i rodzinie.",
      bodyEn: "Forbidden. In practical cases, confirm with a scholar, especially around finance, work and family.",
      source_ref: "Quran 5:90; Quran 6:151",
      ...contextDependent
    }
  ]
};

export const ZAKAT_BASICS = {
  overview: [
    {
      id: "pillar",
      titlePl: "Zakat jest filarem islamu",
      titleEn: "Zakat is a pillar of Islam",
      bodyPl:
        "Zakat to obowiązkowe oczyszczenie majątku dla osoby, która posiada majątek powyżej nisab przez rok księżycowy.",
      bodyEn:
        "Zakat is the obligatory purification of wealth for a person who holds wealth above nisab for one lunar year.",
      source_ref: "Quran 2:43; Bukhari 8",
      ...verified
    },
    {
      id: "rate",
      titlePl: "Najczęstsza stawka: 2.5%",
      titleEn: "Common rate: 2.5%",
      bodyPl:
        "Dla pieniędzy, oszczędności, złota/srebra i wielu aktywów handlowych klasyczna stawka wynosi 2.5%. Inne typy majątku mogą mieć inne zasady.",
      bodyEn:
        "For cash, savings, gold/silver and many trade assets the classical rate is 2.5%. Other asset types can have different rules.",
      source_ref: "Abu Dawud 1572; classical zakat fiqh",
      ...contextDependent
    },
    {
      id: "nisab",
      titlePl: "Nisab to próg majątku",
      titleEn: "Nisab is the wealth threshold",
      bodyPl:
        "Nisab zwykle liczy się według wartości złota lub srebra. Wybór progu i lokalna wycena mogą się różnić, dlatego aplikacja nie udaje kalkulatora.",
      bodyEn:
        "Nisab is commonly measured by the value of gold or silver. The threshold choice and local valuation can differ, so the app does not pretend to be a calculator.",
      source_ref: "classical zakat fiqh",
      ...contextDependent
    }
  ],
  assets: [
    {
      id: "cash",
      titlePl: "Gotówka i oszczędności",
      titleEn: "Cash and savings",
      bodyPl: "Pieniądze na kontach, gotówka i łatwo dostępne oszczędności zwykle wchodzą do podstawy zakatu.",
      bodyEn: "Bank balances, cash and accessible savings usually count toward zakat wealth.",
      source_ref: "classical zakat fiqh",
      ...contextDependent
    },
    {
      id: "gold-silver",
      titlePl: "Złoto i srebro",
      titleEn: "Gold and silver",
      bodyPl: "Złoto i srebro są klasycznymi aktywami zakatowymi. Szczegóły biżuterii mogą różnić się między szkołami.",
      bodyEn: "Gold and silver are classical zakatable assets. Jewellery details can differ between schools.",
      source_ref: "Abu Dawud 1563; fiqh disagreement",
      ...contextDependent
    },
    {
      id: "trade",
      titlePl: "Towary handlowe",
      titleEn: "Trade goods",
      bodyPl: "Towary kupione z intencją odsprzedaży zwykle są liczone według wartości rynkowej na dzień zakatu.",
      bodyEn: "Goods bought for resale are usually valued at market value on the zakat date.",
      source_ref: "classical zakat fiqh",
      ...contextDependent
    }
  ],
  recipients: [
    {
      id: "recipients",
      titlePl: "Odbiorcy zakatu",
      titleEn: "Zakat recipients",
      bodyPl:
        "Quran wymienia osiem kategorii, m.in. ubogich, potrzebujących, zadłużonych, podróżnego i tych, których serca są zbliżane.",
      bodyEn:
        "The Quran names eight categories, including the poor, the needy, debtors, the traveller and those whose hearts are being brought closer.",
      source_ref: "Quran 9:60",
      ...verified
    }
  ],
  cautions: [
    {
      id: "ask-local",
      titlePl: "Kiedy zapytać uczonego",
      titleEn: "When to ask a scholar",
      bodyPl:
        "Zapytaj lokalnego imama lub specjalistę, gdy masz kredyty, firmę, inwestycje, kryptowaluty, długi albo złożoną sytuację rodzinną.",
      bodyEn:
        "Ask a local imam or specialist if you have loans, a business, investments, crypto assets, debts or a complex family situation.",
      source_ref: "Quran 16:43; context-dependent finance",
      ...contextDependent
    }
  ]
};

export const RAMADAN_GUIDE = {
  essentials: [
    {
      id: "fasting",
      titlePl: "Post od Fajr do Maghrib",
      titleEn: "Fast from Fajr to Maghrib",
      bodyPl:
        "Post zaczyna się o świcie przy Fajr i kończy przy Maghrib. Suhoor to posiłek przed świtem, iftar to przerwanie postu po zachodzie.",
      bodyEn:
        "The fast begins at dawn with Fajr and ends at Maghrib. Suhoor is the pre-dawn meal, iftar is breaking the fast after sunset.",
      source_ref: "Quran 2:187",
      ...verified
    },
    {
      id: "quran",
      titlePl: "Miesiąc Quranu",
      titleEn: "Month of the Quran",
      bodyPl:
        "Ramadan jest miesiącem, w którym objawiono Quran. Dla początkującego celem może być mały, stały kontakt z recytacją i znaczeniem.",
      bodyEn:
        "Ramadan is the month in which the Quran was revealed. For a beginner, the goal can be small, steady contact with recitation and meaning.",
      source_ref: "Quran 2:185",
      ...verified
    },
    {
      id: "exceptions",
      titlePl: "Islam zna realne wyjątki",
      titleEn: "Islam recognises real exemptions",
      bodyPl:
        "Choroba i podróż mają ułatwienia. Szczegóły odrabiania dni zależą od sytuacji, więc przy zdrowiu i ciąży pytaj uczonego lub lekarza.",
      bodyEn:
        "Illness and travel have concessions. Making up days depends on the situation, so ask a scholar or doctor for health and pregnancy cases.",
      source_ref: "Quran 2:184-185",
      ...contextDependent
    }
  ],
  laylat: [
    {
      id: "qadr",
      titlePl: "Laylat al-Qadr",
      titleEn: "Laylat al-Qadr",
      bodyPl:
        "Noc Dekretu jest lepsza niż tysiąc miesięcy. Szuka się jej szczególnie w ostatnich dziesięciu nocach Ramadanu.",
      bodyEn:
        "The Night of Decree is better than a thousand months. It is especially sought in the last ten nights of Ramadan.",
      source_ref: "Quran 97:1-5; Bukhari 2020",
      ...verified
    },
    {
      id: "qadr-dua",
      titlePl: "Dua Laylat al-Qadr",
      titleEn: "Laylat al-Qadr dua",
      ar: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
      tr: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
      bodyPl: "O Allahu, Ty jesteś Przebaczający i kochasz przebaczenie, więc przebacz mi.",
      bodyEn: "O Allah, You are Pardoning and love pardon, so pardon me.",
      source_ref: "Tirmidhi 3513",
      ...verified
    }
  ],
  duas: [
    {
      id: "iftar",
      titlePl: "Dua przy iftar",
      titleEn: "Iftar dua",
      ar: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ",
      tr: "Dhahaba az-zama'u wabtallatil-'uruqu wa thabatal-ajru in sha Allah",
      bodyPl: "Pragnienie odeszło, żyły są nawilżone i nagroda jest ustalona, jeśli Allah zechce.",
      bodyEn: "The thirst has gone, the veins are moistened and the reward is confirmed, if Allah wills.",
      source_ref: "Abu Dawud 2357",
      ...verified
    }
  ]
};

export const MUALLAF_GUIDANCE = [
  {
    id: "past-sins",
    titlePl: "Co z poprzednimi grzechami?",
    titleEn: "What about past sins?",
    bodyPl:
      "Szczera szahada jest nowym początkiem. Prorok ﷺ powiedział, że islam usuwa to, co było przed nim. To jedna z najpiękniejszych nadziei dla konwertyty.",
    bodyEn:
      "A sincere shahada is a new beginning. The Prophet ﷺ said that Islam wipes away what came before it. This is one of the most beautiful hopes for a convert.",
    source_ref: "Muslim 121",
    ...verified
  },
  {
    id: "family-talk",
    titlePl: "Jak rozmawiać z rodziną",
    titleEn: "How to speak with family",
    bodyPl:
      "Zacznij od uspokojenia lęku: nadal kochasz rodzinę, nie uciekasz od domu i chcesz być lepszym człowiekiem. Spór teologiczny może poczekać.",
    bodyEn:
      "Start by calming fear: you still love your family, you are not running from home, and you want to become a better person. Theology debate can wait.",
    source_ref: "Quran 31:14-15; Quran 60:8",
    ...verified
  },
  {
    id: "nikah",
    titlePl: "Ślub islamski dla konwertyty",
    titleEn: "Islamic marriage for a convert",
    bodyPl:
      "Nikah wymaga poważnej zgody, mahr i świadków według zasad fiqh. Ponieważ prawo kraju i sytuacja rodzinna są ważne, trzeba omówić szczegóły lokalnie.",
    bodyEn:
      "Nikah requires serious consent, mahr and witnesses according to fiqh. Because local law and family circumstances matter, details should be discussed locally.",
    source_ref: "Quran 4:4; marriage fiqh",
    source_type: "fiqh_context",
    confidence: "CONTEXT_DEPENDENT",
    high_risk: true,
    reviewed_at: REVIEWED_AT
  }
];
