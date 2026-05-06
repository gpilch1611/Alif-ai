export const arabicAlphabet = [
  { id: "alif", arabicName: "ألف", polishName: "Alif", transliteration: "a / aa", forms: { isolated: "ا", initial: "ا", medial: "ـا", final: "ـا" }, pronunciation: "Długi lub krótki dźwięk a. Sama litera nie łączy się z następną po lewej stronie.", example: { ar: "إسلام", pl: "islam", tr: "islam" } },
  { id: "ba", arabicName: "باء", polishName: "Ba", transliteration: "b", forms: { isolated: "ب", initial: "بـ", medial: "ـبـ", final: "ـب" }, pronunciation: "Jak polskie b w słowie balon. Kropka znajduje się pod literą.", example: { ar: "باتيك", pl: "batik", tr: "batik" } },
  { id: "ta", arabicName: "تاء", polishName: "Ta", transliteration: "t", forms: { isolated: "ت", initial: "تـ", medial: "ـتـ", final: "ـت" }, pronunciation: "Jak polskie t. Dwie kropki są nad literą.", example: { ar: "تمر", pl: "daktyle", tr: "tamr" } },
  { id: "tha", arabicName: "ثاء", polishName: "Sa miękkie", transliteration: "th", forms: { isolated: "ث", initial: "ثـ", medial: "ـثـ", final: "ـث" }, pronunciation: "Jak angielskie th w think. Czubek języka lekko dotyka zębów.", example: { ar: "ثلج", pl: "śnieg", tr: "thalj" } },
  { id: "jim", arabicName: "جيم", polishName: "Dżim", transliteration: "j", forms: { isolated: "ج", initial: "جـ", medial: "ـجـ", final: "ـج" }, pronunciation: "Najczęściej jak polskie dż w dżem.", example: { ar: "جاوة", pl: "Jawa", tr: "jawa" } },
  { id: "ha", arabicName: "حاء", polishName: "Ha gardłowe", transliteration: "h", forms: { isolated: "ح", initial: "حـ", medial: "ـحـ", final: "ـح" }, pronunciation: "Mocne, bezdźwięczne h z gardła. Nie ma polskiego odpowiednika.", example: { ar: "حلال", pl: "halal", tr: "halal" } },
  { id: "kha", arabicName: "خاء", polishName: "Cha", transliteration: "kh", forms: { isolated: "خ", initial: "خـ", medial: "ـخـ", final: "ـخ" }, pronunciation: "Jak polskie ch, ale głębiej w gardle.", example: { ar: "خبز", pl: "chleb", tr: "chubz" } },
  { id: "dal", arabicName: "دال", polishName: "Dal", transliteration: "d", forms: { isolated: "د", initial: "د", medial: "ـد", final: "ـد" }, pronunciation: "Jak polskie d. Nie łączy się z następną literą.", example: { ar: "دعاء", pl: "dua", tr: "du'a" } },
  { id: "dhal", arabicName: "ذال", polishName: "Zal", transliteration: "dh", forms: { isolated: "ذ", initial: "ذ", medial: "ـذ", final: "ـذ" }, pronunciation: "Jak angielskie th w this. Brzmi miękko, między d i z.", example: { ar: "ذهب", pl: "złoto", tr: "dhahab" } },
  { id: "ra", arabicName: "راء", polishName: "Ra", transliteration: "r", forms: { isolated: "ر", initial: "ر", medial: "ـر", final: "ـر" }, pronunciation: "Drżące r, podobne do polskiego. Nie łączy się z następną literą.", example: { ar: "رمضان", pl: "ramadan", tr: "ramadan" } },
  { id: "zay", arabicName: "زاي", polishName: "Zaj", transliteration: "z", forms: { isolated: "ز", initial: "ز", medial: "ـز", final: "ـز" }, pronunciation: "Jak polskie z. Nie łączy się z następną literą.", example: { ar: "زيارة", pl: "wizyta", tr: "zijara" } },
  { id: "sin", arabicName: "سين", polishName: "Sin", transliteration: "s", forms: { isolated: "س", initial: "سـ", medial: "ـسـ", final: "ـس" }, pronunciation: "Jak polskie s.", example: { ar: "سلام", pl: "pokój, salam", tr: "salam" } },
  { id: "shin", arabicName: "شين", polishName: "Szin", transliteration: "sh", forms: { isolated: "ش", initial: "شـ", medial: "ـشـ", final: "ـش" }, pronunciation: "Jak polskie sz.", example: { ar: "شمس", pl: "słońce", tr: "szams" } },
  { id: "sad", arabicName: "صاد", polishName: "Sad", transliteration: "s", forms: { isolated: "ص", initial: "صـ", medial: "ـصـ", final: "ـص" }, pronunciation: "Głębokie, ciemne s wymawiane z napięciem w jamie ustnej.", example: { ar: "صلاة", pl: "modlitwa", tr: "salat" } },
  { id: "dad", arabicName: "ضاد", polishName: "Dad", transliteration: "d", forms: { isolated: "ض", initial: "ضـ", medial: "ـضـ", final: "ـض" }, pronunciation: "Głębokie d, charakterystyczne dla arabskiego.", example: { ar: "ضيف", pl: "gość", tr: "dajf" } },
  { id: "ta_emph", arabicName: "طاء", polishName: "Ta głębokie", transliteration: "t", forms: { isolated: "ط", initial: "طـ", medial: "ـطـ", final: "ـط" }, pronunciation: "Głębokie, mocne t.", example: { ar: "طعام", pl: "jedzenie", tr: "ta'am" } },
  { id: "za_emph", arabicName: "ظاء", polishName: "Za głębokie", transliteration: "z / dh", forms: { isolated: "ظ", initial: "ظـ", medial: "ـظـ", final: "ـظ" }, pronunciation: "Głębokie brzmienie między z i angielskim th.", example: { ar: "ظاهر", pl: "widoczny", tr: "zahir" } },
  { id: "ayn", arabicName: "عين", polishName: "Ajn", transliteration: "'", forms: { isolated: "ع", initial: "عـ", medial: "ـعـ", final: "ـع" }, pronunciation: "Dźwięk gardłowy, jak napięte a zaczynane głęboko w gardle.", example: { ar: "علم", pl: "wiedza", tr: "'ilm" } },
  { id: "ghayn", arabicName: "غين", polishName: "Gajn", transliteration: "gh", forms: { isolated: "غ", initial: "غـ", medial: "ـغـ", final: "ـغ" }, pronunciation: "Dźwięczne, gardłowe r/ch, podobne do francuskiego r.", example: { ar: "غدانسك", pl: "Gdańsk", tr: "ghdansk" } },
  { id: "fa", arabicName: "فاء", polishName: "Fa", transliteration: "f", forms: { isolated: "ف", initial: "فـ", medial: "ـفـ", final: "ـف" }, pronunciation: "Jak polskie f.", example: { ar: "فجر", pl: "świt", tr: "fadżr" } },
  { id: "qaf", arabicName: "قاف", polishName: "Kaf głębokie", transliteration: "q", forms: { isolated: "ق", initial: "قـ", medial: "ـقـ", final: "ـق" }, pronunciation: "Głębokie k wymawiane z tyłu języka.", example: { ar: "قرآن", pl: "Koran", tr: "qur'an" } },
  { id: "kaf", arabicName: "كاف", polishName: "Kaf", transliteration: "k", forms: { isolated: "ك", initial: "كـ", medial: "ـكـ", final: "ـك" }, pronunciation: "Jak polskie k.", example: { ar: "كتاب", pl: "książka", tr: "kitab" } },
  { id: "lam", arabicName: "لام", polishName: "Lam", transliteration: "l", forms: { isolated: "ل", initial: "لـ", medial: "ـلـ", final: "ـل" }, pronunciation: "Jak polskie l.", example: { ar: "لوبلين", pl: "Lublin", tr: "lublin" } },
  { id: "mim", arabicName: "ميم", polishName: "Mim", transliteration: "m", forms: { isolated: "م", initial: "مـ", medial: "ـمـ", final: "ـم" }, pronunciation: "Jak polskie m.", example: { ar: "مسجد", pl: "meczet", tr: "masdżid" } },
  { id: "nun", arabicName: "نون", polishName: "Nun", transliteration: "n", forms: { isolated: "ن", initial: "نـ", medial: "ـنـ", final: "ـن" }, pronunciation: "Jak polskie n.", example: { ar: "إندونيسيا", pl: "Indonezja", tr: "indunisia" } },
  { id: "ha2", arabicName: "هاء", polishName: "Ha lekkie", transliteration: "h", forms: { isolated: "ه", initial: "هـ", medial: "ـهـ", final: "ـه" }, pronunciation: "Lekkie h, podobne do polskiego h w herbata.", example: { ar: "هلال", pl: "półksiężyc", tr: "hilal" } },
  { id: "waw", arabicName: "واو", polishName: "Ław", transliteration: "w / u", forms: { isolated: "و", initial: "و", medial: "ـو", final: "ـو" }, pronunciation: "Jak angielskie w albo długie u. Nie łączy się z następną literą.", example: { ar: "وارسو", pl: "Warszawa", tr: "warsaw" } },
  { id: "ya", arabicName: "ياء", polishName: "Ja", transliteration: "y / i", forms: { isolated: "ي", initial: "يـ", medial: "ـيـ", final: "ـي" }, pronunciation: "Jak j albo długie i.", example: { ar: "يوغياكارتا", pl: "Yogyakarta", tr: "jogyakarta" } }
];

export const words = [
  { id: "mama", ar: "ماما", tr: "mama", pl: "mama" },
  { id: "baba", ar: "بابا", tr: "baba", pl: "tata / baba" },
  { id: "kitab", ar: "كتاب", tr: "kitab", pl: "książka" },
  { id: "bait", ar: "بيت", tr: "bajt", pl: "dom" },
  { id: "shams", ar: "شمس", tr: "szams", pl: "słońce" },
  { id: "qamar", ar: "قمر", tr: "kamar", pl: "księżyc" },
  { id: "salam", ar: "سلام", tr: "salam", pl: "pokój / cześć" },
  { id: "islam", ar: "إسلام", tr: "islam", pl: "islam" },
  { id: "quran", ar: "قرآن", tr: "Koran", pl: "Koran" },
  { id: "masjid", ar: "مسجد", tr: "masdżid", pl: "meczet" },
  { id: "polska", ar: "بولندا", tr: "bulanda", pl: "Polska" },
  { id: "warsaw", ar: "وارسو", tr: "warsaw", pl: "Warszawa" },
  { id: "lublin", ar: "لوبلين", tr: "lublin", pl: "Lublin" },
  { id: "indonesia", ar: "إندونيسيا", tr: "indunisia", pl: "Indonezja" },
  { id: "batik", ar: "باتيك", tr: "batik", pl: "batik" },
  { id: "borobudur", ar: "بوروبودور", tr: "borobudur", pl: "Borobudur" },
  { id: "orangutan", ar: "أورانغوتان", tr: "orangutan", pl: "orangutan" },
  { id: "pierogi", ar: "بيروغي", tr: "pierogi", pl: "pierogi" },
  { id: "zloty", ar: "زلوتي", tr: "zloty", pl: "złoty" },
  { id: "halal", ar: "حلال", tr: "halal", pl: "halal" },
  { id: "rahma", ar: "رحمة", tr: "rahma", pl: "miłosierdzie" },
  { id: "nur", ar: "نور", tr: "nur", pl: "światło" },
  { id: "woda", ar: "ماء", tr: "ma", pl: "woda" },
  { id: "ryz", ar: "أرز", tr: "aruzz", pl: "ryż" },
  { id: "hubb", ar: "حب", tr: "hubb", pl: "miłość" },
  { id: "qalb", ar: "قلب", tr: "qalb", pl: "serce" },
  { id: "bayt", ar: "بيت", tr: "bayt", pl: "dom" },
  { id: "walad", ar: "ولد", tr: "walad", pl: "chłopiec/dziecko" },
  { id: "bint", ar: "بنت", tr: "bint", pl: "dziewczynka" },
  { id: "rijal", ar: "رجل", tr: "rijal", pl: "mężczyzna" },
  { id: "imra", ar: "امرأة", tr: "imra'a", pl: "kobieta" },
  { id: "yad", ar: "يد", tr: "yad", pl: "ręka" },
  { id: "ayn_word", ar: "عين", tr: "'ajn", pl: "oko" },
  { id: "kalb", ar: "كلب", tr: "kalb", pl: "pies" },
  { id: "qitta", ar: "قطة", tr: "qitta", pl: "kot" },
  { id: "samak", ar: "سمك", tr: "samak", pl: "ryba" },
  { id: "tayyib", ar: "طيب", tr: "tayyib", pl: "dobry / świetnie" },
  { id: "shukran", ar: "شكرًا", tr: "szukran", pl: "dziękuję" },
  { id: "afwan", ar: "عفوًا", tr: "afwan", pl: "proszę / przepraszam" },
  { id: "ahlan", ar: "أهلاً", tr: "ahlan", pl: "witaj" },
  { id: "marhaba", ar: "مرحبا", tr: "marhaba", pl: "cześć / witaj" },
  { id: "sabah", ar: "صباح", tr: "sabah", pl: "poranek" },
  { id: "masa", ar: "مساء", tr: "masa'", pl: "wieczór" },
  { id: "lail", ar: "ليل", tr: "lajl", pl: "noc" }
];

export const dailyTasks = [
  "Poznaj 3 nowe litery i otwórz każdą z nich.",
  "Zrób 7 fiszek w trybie powtórek.",
  "Przećwicz wymowę słowa سلام.",
  "Narysuj literę ب na canvasie.",
  "Zagraj jedną rundę Memory Match.",
  "Naucz się jednej nowej lekcji.",
  "Posłuchaj sury Al-Fatihah.",
  "Dodaj 3 nowe słowa do fiszek.",
  "Przejdź quiz z liter.",
  "Napisz dowolną literę arabską."
];

export const surahs = [
  {
    id: "fatihah",
    number: 1,
    name: "الفاتحة",
    nameEn: "Al-Fatihah",
    namePl: "Al-Fatihah",
    meaningEn: "The Opening",
    meaningPl: "Otwarcie",
    factPl: "Al-Fatihah jest sercem Koranu. Jest czytana w każdym rak'at modlitwy – to 17 razy dziennie. Prorok ﷺ powiedział, że nie ma modlitwy bez Al-Fatihah.",
    factEn: "Al-Fatihah is the heart of the Quran. It is recited in every rak'ah of prayer – 17 times daily. The Prophet ﷺ said there is no prayer without Al-Fatihah.",
    ayat: [
      { n: 1, ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", tr: "Bismillahi r-rahmani r-rahim", pl: "W imię Allaha, Miłosiernego, Litościwego", en: "In the name of Allah, the Most Gracious, the Most Merciful" },
      { n: 2, ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", tr: "Al-hamdu lillahi rabbi l-'alamin", pl: "Chwała Allahowi, Panu światów", en: "All praise is due to Allah, Lord of all the worlds" },
      { n: 3, ar: "الرَّحْمَٰنِ الرَّحِيمِ", tr: "Ar-rahmani r-rahim", pl: "Miłosiernemu, Litościwemu", en: "The Most Gracious, the Most Merciful" },
      { n: 4, ar: "مَالِكِ يَوْمِ الدِّينِ", tr: "Maliki yawmi d-din", pl: "Królowi Dnia Sądu", en: "Sovereign of the Day of Recompense" },
      { n: 5, ar: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", tr: "Iyyaka na'budu wa iyyaka nasta'in", pl: "Ciebie czcimy i do Ciebie się uciekamy", en: "It is You we worship and You we ask for help" },
      { n: 6, ar: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", tr: "Ihdina s-sirata l-mustaqim", pl: "Prowadź nas drogą prostą", en: "Guide us to the straight path" },
      { n: 7, ar: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", tr: "Sirata lladhina an'amta 'alayhim ghayri l-maghdubi 'alayhim wa la d-dallin", pl: "Drogą tych, którym okazałeś łaskę, nie tych na których jest gniew, i nie tych którzy błądzą", en: "The path of those upon whom You have bestowed favor, not of those who have evoked anger, nor of those who are astray" }
    ]
  },
  {
    id: "ikhlas",
    number: 112,
    name: "الإخلاص",
    nameEn: "Al-Ikhlas",
    namePl: "Al-Ichlas",
    meaningEn: "Sincerity",
    meaningPl: "Szczerość",
    factPl: "Al-Ikhlas to jedna trzecia Koranu w znaczeniu duchowym. Prorok ﷺ powiedział, że kto przeczyta ją trzy razy, zyska nagrodę jak za całość Koranu.",
    factEn: "Al-Ikhlas equals one third of the Quran in spiritual meaning. The Prophet ﷺ said reciting it three times is like reciting the whole Quran.",
    ayat: [
      { n: 1, ar: "قُلْ هُوَ اللَّهُ أَحَدٌ", tr: "Qul huwa llahu ahad", pl: "Powiedz: On jest Allah, Jedyny", en: "Say: He is Allah, the One" },
      { n: 2, ar: "اللَّهُ الصَّمَدُ", tr: "Allahu s-samad", pl: "Allah, Wiekuisty", en: "Allah, the Eternal Refuge" },
      { n: 3, ar: "لَمْ يَلِدْ وَلَمْ يُولَدْ", tr: "Lam yalid wa lam yulad", pl: "Nie zrodził i nie został zrodzony", en: "He neither begets nor is born" },
      { n: 4, ar: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ", tr: "Wa lam yakun lahu kufuwan ahad", pl: "I nie ma Mu równego nikogo", en: "Nor is there to Him any equivalent" }
    ]
  },
  {
    id: "falaq",
    number: 113,
    name: "الفلق",
    nameEn: "Al-Falaq",
    namePl: "Al-Falak",
    meaningEn: "The Daybreak",
    meaningPl: "Świt",
    factPl: "Al-Falaq i An-Nas są znane jako Al-Mu'awwidhatayn – dwie sury ochrony. Prorok ﷺ recytował je każdego wieczoru przed snem.",
    factEn: "Al-Falaq and An-Nas are known as Al-Mu'awwidhatayn – the two suras of protection. The Prophet ﷺ recited them every evening before sleep.",
    ayat: [
      { n: 1, ar: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ", tr: "Qul a'udhu bi rabbi l-falaq", pl: "Powiedz: Szukam schronienia u Pana świtu", en: "Say: I seek refuge in the Lord of daybreak" },
      { n: 2, ar: "مِن شَرِّ مَا خَلَقَ", tr: "Min sharri ma khalaq", pl: "Przed złem tego, co stworzył", en: "From the evil of that which He created" },
      { n: 3, ar: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ", tr: "Wa min sharri ghasiqin idha waqab", pl: "I przed złem ciemności, gdy się spuści", en: "And from the evil of darkness when it settles" },
      { n: 4, ar: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ", tr: "Wa min sharri n-naffathati fi l-'uqad", pl: "I przed złem tych, co dmuchają w węzły", en: "And from the evil of the blowers in knots" },
      { n: 5, ar: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ", tr: "Wa min sharri hasidin idha hasad", pl: "I przed złem zazdrosnego, gdy zazdrości", en: "And from the evil of an envier when he envies" }
    ]
  },
  {
    id: "nas",
    number: 114,
    name: "الناس",
    nameEn: "An-Nas",
    namePl: "An-Nas",
    meaningEn: "Mankind",
    meaningPl: "Ludzie",
    factPl: "An-Nas to ostatnia sura Koranu. Chroni przed szatanem i złymi podszeptami. Recytuj ją rano i wieczorem dla ochrony.",
    factEn: "An-Nas is the last surah of the Quran. It protects from Satan and evil whispers. Recite it morning and evening for protection.",
    ayat: [
      { n: 1, ar: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ", tr: "Qul a'udhu bi rabbi n-nas", pl: "Powiedz: Szukam schronienia u Pana ludzi", en: "Say: I seek refuge in the Lord of mankind" },
      { n: 2, ar: "مَلِكِ النَّاسِ", tr: "Maliki n-nas", pl: "Króla ludzi", en: "The Sovereign of mankind" },
      { n: 3, ar: "إِلَٰهِ النَّاسِ", tr: "Ilahi n-nas", pl: "Boga ludzi", en: "The God of mankind" },
      { n: 4, ar: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ", tr: "Min sharri l-waswasi l-khannas", pl: "Przed złem skrywającego się kusiciela", en: "From the evil of the retreating whisperer" },
      { n: 5, ar: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ", tr: "Alladhi yuwaswisu fi suduri n-nas", pl: "Który szepce w piersiach ludzi", en: "Who whispers in the breasts of mankind" },
      { n: 6, ar: "مِنَ الْجِنَّةِ وَالنَّاسِ", tr: "Mina l-jinnati wa n-nas", pl: "Spośród dżinnów i ludzi", en: "From among the jinn and mankind" }
    ]
  },
  {
    id: "asr",
    number: 103,
    name: "العصر",
    nameEn: "Al-Asr",
    namePl: "Al-Asr",
    meaningEn: "The Time",
    meaningPl: "Czas",
    factPl: "Imam Szafi'i powiedział: gdyby Allah nie zesłał nic innego niż tę surę, wystarczyłoby to ludzkości jako przewodnik. Zawiera cały program życia muzułmańskiego.",
    factEn: "Imam Shafi'i said: if Allah had revealed nothing but this surah, it would be enough as a guide for humanity. It contains the entire program of Muslim life.",
    ayat: [
      { n: 1, ar: "وَالْعَصْرِ", tr: "Wa l-'asr", pl: "Na czas!", en: "By time" },
      { n: 2, ar: "إِنَّ الْإِنسَانَ لَفِي خُسْرٍ", tr: "Inna l-insana lafi khusr", pl: "Zaprawdę człowiek jest w stracie", en: "Indeed, mankind is in loss" },
      { n: 3, ar: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ", tr: "Illa lladhina amanu wa 'amilu s-salihati wa tawassaw bi l-haqqi wa tawassaw bi s-sabr", pl: "Z wyjątkiem tych, którzy uwierzyli, czynili dobro, zalecali prawdę i zalecali cierpliwość", en: "Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience" }
    ]
  },
  {
    id: "kawthar",
    number: 108,
    name: "الكوثر",
    nameEn: "Al-Kawthar",
    namePl: "Al-Kawsar",
    meaningEn: "Abundance",
    meaningPl: "Obfitość",
    factPl: "Al-Kawthar to najkrótsza sura Koranu – tylko 3 ajaty. Al-Kawthar to rzeka w Raju obiecana Prorokowi ﷺ.",
    factEn: "Al-Kawthar is the shortest surah in the Quran – only 3 ayat. Al-Kawthar is a river in Paradise promised to the Prophet ﷺ.",
    ayat: [
      { n: 1, ar: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ", tr: "Inna a'taynaka l-kawthar", pl: "Zaiste daliśmy ci Al-Kawthar (obfitość)", en: "Indeed, We have granted you Al-Kawthar (abundance)" },
      { n: 2, ar: "فَصَلِّ لِرَبِّكَ وَانْحَرْ", tr: "Fa salli li rabbika wa nhar", pl: "Módl się więc do swego Pana i składaj ofiary", en: "So pray to your Lord and sacrifice" },
      { n: 3, ar: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ", tr: "Inna shani'aka huwa l-abtar", pl: "Zaprawdę ten, kto cię nienawidzi, sam jest odcięty", en: "Indeed, your enemy is the one cut off" }
    ]
  },
  {
    id: "nasr",
    number: 110,
    name: "النصر",
    nameEn: "An-Nasr",
    namePl: "An-Nasr",
    meaningEn: "The Victory",
    meaningPl: "Zwycięstwo",
    factPl: "An-Nasr zapowiadała bliską śmierć Proroka ﷺ. Po jej objawieniu Prorok często powtarzał 'Subhanakallahumma wa bihamdika, Allahumma ighfir li'.",
    factEn: "An-Nasr foretold the approaching death of the Prophet ﷺ. After its revelation, he often repeated 'Subhanakallahumma wa bihamdika, Allahumma ighfir li'.",
    ayat: [
      { n: 1, ar: "إِذَا جَاءَ نَصْرُ اللَّهِ وَالْفَتْحُ", tr: "Idha ja'a nasru llahi wa l-fath", pl: "Kiedy nadejdzie pomoc Allaha i zwycięstwo", en: "When the victory of Allah has come and the conquest" },
      { n: 2, ar: "وَرَأَيْتَ النَّاسَ يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا", tr: "Wa ra'ayta n-nasa yadkhuluna fi dini llahi afwaja", pl: "I zobaczysz ludzi wchodzących gromadnie do religii Allaha", en: "And you see the people entering into the religion of Allah in multitudes" },
      { n: 3, ar: "فَسَبِّحْ بِحَمْدِ رَبِّكَ وَاسْتَغْفِرْهُ إِنَّهُ كَانَ تَوَّابًا", tr: "Fa sabbih bi hamdi rabbika wa s-taghfirhu innahu kana tawwaba", pl: "Chwal więc swego Pana i proś Go o przebaczenie – On jest Wybaczającym", en: "Then exalt with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance" }
    ]
  },
  {
    id: "fil",
    number: 105,
    name: "الفيل",
    nameEn: "Al-Fil",
    namePl: "Al-Fil",
    meaningEn: "The Elephant",
    meaningPl: "Słoń",
    factPl: "Sura Al-Fil opisuje historię armii słoni Abrahy, która chciała zburzyć Kaabę w roku narodzin Proroka ﷺ. Allah zniszczył ją małymi ptakami.",
    factEn: "Surah Al-Fil describes the army of elephants of Abraha, who wanted to destroy the Kaaba in the year the Prophet ﷺ was born. Allah destroyed them with small birds.",
    ayat: [
      { n: 1, ar: "أَلَمْ تَرَ كَيْفَ فَعَلَ رَبُّكَ بِأَصْحَابِ الْفِيلِ", tr: "Alam tara kayfa fa'ala rabbuka bi ashabi l-fil", pl: "Czy nie widziałeś, jak uczynił twój Pan właścicielom słonia?", en: "Have you not considered how your Lord dealt with the companions of the elephant?" },
      { n: 2, ar: "أَلَمْ يَجْعَلْ كَيْدَهُمْ فِي تَضْلِيلٍ", tr: "Alam yaj'al kaydahum fi tadlil", pl: "Czy nie uczynił ich spisku marnym?", en: "Did He not make their plan into misguidance?" },
      { n: 3, ar: "وَأَرْسَلَ عَلَيْهِمْ طَيْرًا أَبَابِيلَ", tr: "Wa arsala 'alayhim tayran ababila", pl: "I zesłał na nich ptaki w stadach", en: "And He sent against them birds in flocks" },
      { n: 4, ar: "تَرْمِيهِم بِحِجَارَةٍ مِّن سِجِّيلٍ", tr: "Tarmihim bi hijarahin min sijjil", pl: "Rzucające w nich kamykami z wypalniętej gliny", en: "Striking them with stones of hard clay" },
      { n: 5, ar: "فَجَعَلَهُمْ كَعَصْفٍ مَّأْكُولٍ", tr: "Fa ja'alahum ka'asfin ma'kul", pl: "I uczynił ich jak potrawę strawioną", en: "And He made them like eaten straw" }
    ]
  },
  {
    id: "quraysh",
    number: 106,
    name: "قريش",
    nameEn: "Al-Quraysh",
    namePl: "Al-Kurajsz",
    meaningEn: "Quraysh",
    meaningPl: "Kurajszytom",
    factPl: "Ta sura przypomina Kurajszytom o łaskach Allaha – ochronie ich karawanowych podróży i bezpieczeństwie w Mekce, gdzie stoi Kaaba.",
    factEn: "This surah reminds the Quraysh of Allah's blessings – protecting their trade journeys and granting them safety in Mecca, where the Kaaba stands.",
    ayat: [
      { n: 1, ar: "لِإِيلَافِ قُرَيْشٍ", tr: "Li'ilafi Quraysh", pl: "Dla zjednoczenia Kurajszytów", en: "For the accustomed security of the Quraysh" },
      { n: 2, ar: "إِيلَافِهِمْ رِحْلَةَ الشِّتَاءِ وَالصَّيْفِ", tr: "Ilafihim rihlata sh-shita'i wa s-sayf", pl: "Ich zjednoczenia dla podróży zimowej i letniej", en: "Their accustomed security in the journey of winter and summer" },
      { n: 3, ar: "فَلْيَعْبُدُوا رَبَّ هَٰذَا الْبَيْتِ", tr: "Falya'budu rabba hadha l-bayt", pl: "Niech więc czczą Pana tego Domu", en: "Let them worship the Lord of this House" },
      { n: 4, ar: "الَّذِي أَطْعَمَهُم مِّن جُوعٍ وَآمَنَهُم مِّنْ خَوْفٍ", tr: "Alladhi at'amahum min ju'in wa ammanahum min khawf", pl: "Który nakarmił ich z głodu i dał im bezpieczeństwo od strachu", en: "Who has fed them, [saving them] from hunger and made them safe, [saving them] from fear" }
    ]
  },
  {
    id: "maun",
    number: 107,
    name: "الماعون",
    nameEn: "Al-Ma'un",
    namePl: "Al-Maun",
    meaningEn: "Small Kindnesses",
    meaningPl: "Drobne Uprzejmości",
    factPl: "Al-Ma'un uczy, że wiara bez uczynków jest pusta. Prawdziwa pobożność to nie tylko modlitwa – to też troska o sierotę i biednego.",
    factEn: "Al-Ma'un teaches that faith without deeds is empty. True piety is not only prayer – it is also caring for the orphan and the poor.",
    ayat: [
      { n: 1, ar: "أَرَأَيْتَ الَّذِي يُكَذِّبُ بِالدِّينِ", tr: "A-ra'ayta lladhi yukadhdhibu bi d-din", pl: "Czy widziałeś tego, który zaprzecza Sądowi?", en: "Have you seen the one who denies the Recompense?" },
      { n: 2, ar: "فَذَٰلِكَ الَّذِي يَدُعُّ الْيَتِيمَ", tr: "Fa dhalika lladhi yadu'u l-yatim", pl: "To jest ten, który odpycha sierotę", en: "That is the one who drives away the orphan" },
      { n: 3, ar: "وَلَا يَحُضُّ عَلَىٰ طَعَامِ الْمِسْكِينِ", tr: "Wa la yahuddu 'ala ta'ami l-miskin", pl: "I nie zachęca do karmienia ubogiego", en: "And does not encourage the feeding of the poor" },
      { n: 4, ar: "فَوَيْلٌ لِّلْمُصَلِّينَ", tr: "Fa waylun li l-musallin", pl: "Biada modlącym się", en: "So woe to those who pray" },
      { n: 5, ar: "الَّذِينَ هُمْ عَن صَلَاتِهِمْ سَاهُونَ", tr: "Alladhina hum 'an salatihim sahun", pl: "Którzy są niedbali w swojej modlitwie", en: "Who are heedless of their prayer" },
      { n: 6, ar: "الَّذِينَ هُمْ يُرَاءُونَ", tr: "Alladhina hum yura'un", pl: "Którzy się popisują (swoją pobożnością)", en: "Those who make show of their deeds" },
      { n: 7, ar: "وَيَمْنَعُونَ الْمَاعُونَ", tr: "Wa yamna'una l-ma'un", pl: "I odmawiają drobnych uprzejmości", en: "And withhold small kindnesses" }
    ]
  }
];

export const dailyTasksEn = [
  "Learn 3 new letters and open each info card.",
  "Do 7 flashcards in review mode.",
  "Practice pronunciation of the word سلام.",
  "Trace the letter ب on the canvas.",
  "Play one round of Memory Match.",
  "Complete one new lesson.",
  "Listen to Surah Al-Fatihah.",
  "Add 3 new words to flashcards.",
  "Take the letter quiz.",
  "Write any Arabic letter."
];
