export const arabicAlphabet = [
  { id: "alif", arabicName: "ألف", polishName: "Alif", transliteration: "a / aa", forms: { isolated: "ا", initial: "ا", medial: "ـا", final: "ـا" }, pronunciation: "Długi lub krótki dźwięk", example: { ar: "أسد", pl: "lew", tr: "asad" } },
  { id: "ba", arabicName: "باء", polishName: "Ba", transliteration: "b", forms: { isolated: "ب", initial: "بـ", medial: "ـبـ", final: "ـب" }, pronunciation: "Jak polskie b", example: { ar: "باب", pl: "drzwi", tr: "bab" } },
  { id: "ta", arabicName: "تاء", polishName: "Ta", transliteration: "t", forms: { isolated: "ت", initial: "تـ", medial: "ـتـ", final: "ـت" }, pronunciation: "Jak polskie t", example: { ar: "تاج", pl: "korona", tr: "taj" } },
  { id: "tha", arabicName: "ثاء", polishName: "Sa miękkie", transliteration: "th", forms: { isolated: "ث", initial: "ثـ", medial: "ـثـ", final: "ـث" }, pronunciation: "Jak angielskie th", example: { ar: "ثلج", pl: "lód", tr: "talj" } },
  { id: "jim", arabicName: "جيم", polishName: "Dżim", transliteration: "j", forms: { isolated: "ج", initial: "جـ", medial: "ـجـ", final: "ـج" }, pronunciation: "Jak polskie dż", example: { ar: "جمل", pl: "wielbłąd", tr: "jamal" } },
  { id: "ha", arabicName: "حاء", polishName: "Ha gardłowe", transliteration: "h", forms: { isolated: "ح", initial: "حـ", medial: "ـحـ", final: "ـح" }, pronunciation: "Mocne h z gardła", example: { ar: "حار", pl: "gorący", tr: "har" } },
  { id: "kha", arabicName: "خاء", polishName: "Cha", transliteration: "kh", forms: { isolated: "خ", initial: "خـ", medial: "ـخـ", final: "ـخ" }, pronunciation: "Jak polskie ch", example: { ar: "خبز", pl: "chleb", tr: "chubz" } },
  { id: "dal", arabicName: "دال", polishName: "Dal", transliteration: "d", forms: { isolated: "د", initial: "د", medial: "ـد", final: "ـد" }, pronunciation: "Jak polskie d", example: { ar: "دار", pl: "dom", tr: "dar" } },
  { id: "dhal", arabicName: "ذال", polishName: "Zal", transliteration: "dh", forms: { isolated: "ذ", initial: "ذ", medial: "ـذ", final: "ـذ" }, pronunciation: "Jak angielskie th w this", example: { ar: "ذهب", pl: "złoto", tr: "dhahab" } },
  { id: "ra", arabicName: "راء", polishName: "Ra", transliteration: "r", forms: { isolated: "ر", initial: "ر", medial: "ـر", final: "ـر" }, pronunciation: "Drżące r", example: { ar: "رجل", pl: "mężczyzna", tr: "rajul" } },
  { id: "zay", arabicName: "زاي", polishName: "Zaj", transliteration: "z", forms: { isolated: "ز", initial: "ز", medial: "ـز", final: "ـز" }, pronunciation: "Jak polskie z", example: { ar: "زيت", pl: "olej", tr: "zajt" } },
  { id: "sin", arabicName: "سين", polishName: "Sin", transliteration: "s", forms: { isolated: "س", initial: "سـ", medial: "ـسـ", final: "ـس" }, pronunciation: "Jak polskie s", example: { ar: "سلام", pl: "pokój", tr: "salam" } },
  { id: "shin", arabicName: "شين", polishName: "Szin", transliteration: "sh", forms: { isolated: "ش", initial: "شـ", medial: "ـشـ", final: "ـش" }, pronunciation: "Jak polskie sz", example: { ar: "شمس", pl: "słońce", tr: "szams" } },
  { id: "sad", arabicName: "صاد", polishName: "Sad", transliteration: "s", forms: { isolated: "ص", initial: "صـ", medial: "ـصـ", final: "ـص" }, pronunciation: "Głębokie s", example: { ar: "صبر", pl: "cierpliwość", tr: "sabr" } },
  { id: "dad", arabicName: "ضاد", polishName: "Dad", transliteration: "d", forms: { isolated: "ض", initial: "ضـ", medial: "ـضـ", final: "ـض" }, pronunciation: "Głębokie d", example: { ar: "ضوء", pl: "światło", tr: "daw" } },
  { id: "ta_emph", arabicName: "طاء", polishName: "Ta głębokie", transliteration: "t", forms: { isolated: "ط", initial: "طـ", medial: "ـطـ", final: "ـط" }, pronunciation: "Głębokie t", example: { ar: "طعام", pl: "jedzenie", tr: "taam" } },
  { id: "za_emph", arabicName: "ظاء", polishName: "Za głębokie", transliteration: "z / dh", forms: { isolated: "ظ", initial: "ظـ", medial: "ـظـ", final: "ـظ" }, pronunciation: "Głębokie z", example: { ar: "ظلام", pl: "ciemność", tr: "zulam" } },
  { id: "ayn", arabicName: "عين", polishName: "Ajn", transliteration: "'", forms: { isolated: "ع", initial: "عـ", medial: "ـعـ", final: "ـع" }, pronunciation: "Dźwięk gardłowy", example: { ar: "علم", pl: "wiedza", tr: "ilm" } },
  { id: "ghayn", arabicName: "غين", polishName: "Gajn", transliteration: "gh", forms: { isolated: "غ", initial: "غـ", medial: "ـغـ", final: "ـغ" }, pronunciation: "Gardłowe gh", example: { ar: "غنى", pl: "bogactwo", tr: "ghina" } },
  { id: "fa", arabicName: "فاء", polishName: "Fa", transliteration: "f", forms: { isolated: "ف", initial: "فـ", medial: "ـفـ", final: "ـف" }, pronunciation: "Jak polskie f", example: { ar: "فرح", pl: "radość", tr: "farah" } },
  { id: "qaf", arabicName: "قاف", polishName: "Kaf głębokie", transliteration: "q", forms: { isolated: "ق", initial: "قـ", medial: "ـقـ", final: "ـق" }, pronunciation: "Głębokie k", example: { ar: "قلب", pl: "serce", tr: "qalb" } },
  { id: "kaf", arabicName: "كاف", polishName: "Kaf", transliteration: "k", forms: { isolated: "ك", initial: "كـ", medial: "ـكـ", final: "ـك" }, pronunciation: "Jak polskie k", example: { ar: "كتاب", pl: "książka", tr: "kitab" } },
  { id: "lam", arabicName: "لام", polishName: "Lam", transliteration: "l", forms: { isolated: "ل", initial: "لـ", medial: "ـلـ", final: "ـل" }, pronunciation: "Jak polskie l", example: { ar: "لسان", pl: "język", tr: "lisan" } },
  { id: "mim", arabicName: "ميم", polishName: "Mim", transliteration: "m", forms: { isolated: "م", initial: "مـ", medial: "ـمـ", final: "ـم" }, pronunciation: "Jak polskie m", example: { ar: "ملك", pl: "król", tr: "malik" } },
  { id: "nun", arabicName: "نون", polishName: "Nun", transliteration: "n", forms: { isolated: "ن", initial: "نـ", medial: "ـنـ", final: "ـن" }, pronunciation: "Jak polskie n", example: { ar: "نور", pl: "światło", tr: "nur" } },
  { id: "ha2", arabicName: "هاء", polishName: "Ha lekkie", transliteration: "h", forms: { isolated: "ه", initial: "هـ", medial: "ـهـ", final: "ـه" }, pronunciation: "Lekkie h", example: { ar: "هدى", pl: "przewodnictwo", tr: "huda" } },
  { id: "waw", arabicName: "واو", polishName: "Ław", transliteration: "w / u", forms: { isolated: "و", initial: "و", medial: "ـو", final: "ـو" }, pronunciation: "Jak angielskie w", example: { ar: "وقت", pl: "czas", tr: "wakt" } },
  { id: "ya", arabicName: "ياء", polishName: "Ja", transliteration: "y / i", forms: { isolated: "ي", initial: "يـ", medial: "ـيـ", final: "ـي" }, pronunciation: "Jak j albo długie i", example: { ar: "يد", pl: "ręka", tr: "yad" } }
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
  { id: "masjid", ar: "مسجد", tr: "masjid", pl: "meczet" },
  { id: "lublin", ar: "لوبلين", tr: "lublin", pl: "Lublin" },
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
  }
];