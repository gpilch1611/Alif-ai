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
  { id: "nun", arabicName: "نون", polishName: "Nun", transliteration: "n", forms: { isolated: "ن", initial: "نـ", medial: "ـنـ", final: "ـن" }, pronunciation: "Jak polskie n.", example: { ar: "نُور", pl: "światło", tr: "nur" } },
  { id: "ha2", arabicName: "هاء", polishName: "Ha lekkie", transliteration: "h", forms: { isolated: "ه", initial: "هـ", medial: "ـهـ", final: "ـه" }, pronunciation: "Lekkie h, podobne do polskiego h w herbata.", example: { ar: "هلال", pl: "półksiężyc", tr: "hilal" } },
  { id: "waw", arabicName: "واو", polishName: "Ław", transliteration: "w / u", forms: { isolated: "و", initial: "و", medial: "ـو", final: "ـو" }, pronunciation: "Jak angielskie w albo długie u. Nie łączy się z następną literą.", example: { ar: "وَرْد", pl: "róża", tr: "ward" } },
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
  { id: "ryz", ar: "أرز", tr: "aruzz", pl: "ryż" }
];

export { quranSurahs } from "./data/quran-surahs.js";

export const dailyTasks = [
  "Poznaj 3 nowe litery i kliknij każdą z nich.",
  "Zrób 7 fiszek w trybie powtórek.",
  "Przećwicz wymowę słowa سلام.",
  "Narysuj literę ب na canvasie.",
  "Zagraj jedną rundę Memory Match."
];

// Source: verified against Quran.com and classical references. Harakat added for learners. reviewed_at: 2026-05-16
export const asmaulHusna = [
  { n: 1, ar: "اللَّهُ", tr: "Allah", pl: "Bóg / Allah", en: "God / Allah", tafsir_pl: "Największe imię — obejmuje wszystkie atrybuty boskości.", tafsir_en: "The greatest name — encompassing all divine attributes." },
  { n: 2, ar: "الرَّحْمَٰنُ", tr: "Ar-Rahman", pl: "Miłosierny", en: "The Most Gracious", tafsir_pl: "Bezmiar Jego łaski obejmuje wszystkich stworzeń.", tafsir_en: "His boundless grace encompasses all of creation." },
  { n: 3, ar: "الرَّحِيمُ", tr: "Ar-Rahim", pl: "Miłościwy", en: "The Most Merciful", tafsir_pl: "Szczególna łaska dla wierzących w dniu ostatecznym.", tafsir_en: "Special mercy for believers on the Day of Judgment." },
  { n: 4, ar: "الْمَلِكُ", tr: "Al-Malik", pl: "Władca", en: "The Sovereign", tafsir_pl: "Absolutny król wszechświata, bez współwładcy.", tafsir_en: "The absolute king of the universe, with no partner." },
  { n: 5, ar: "الْقُدُّوسُ", tr: "Al-Quddus", pl: "Święty", en: "The Holy", tafsir_pl: "Wolny od wszelkich niedoskonałości i braków.", tafsir_en: "Free from all imperfections and deficiencies." },
  { n: 6, ar: "السَّلَامُ", tr: "As-Salam", pl: "Źródło Pokoju", en: "The Source of Peace", tafsir_pl: "Daje pokój stworzeniu i jest wolny od wszelkiego zła.", tafsir_en: "Grants peace and is free from all harm." },
  { n: 7, ar: "الْمُؤْمِنُ", tr: "Al-Mu'min", pl: "Dawca Bezpieczeństwa", en: "The Inspirer of Faith", tafsir_pl: "Zapewnia bezpieczeństwo wierzącym i potwierdza prawdę.", tafsir_en: "Grants security to believers and confirms the truth." },
  { n: 8, ar: "الْمُهَيْمِنُ", tr: "Al-Muhaymin", pl: "Czuwający", en: "The Guardian", tafsir_pl: "Czuwa nad wszystkim i zarządza wszystkim.", tafsir_en: "Watches over all things and governs everything." },
  { n: 9, ar: "الْعَزِيزُ", tr: "Al-'Aziz", pl: "Wszechmocny", en: "The Almighty", tafsir_pl: "Niezwyciężony, potężny i godnościowy.", tafsir_en: "Invincible, powerful and dignified." },
  { n: 10, ar: "الْجَبَّارُ", tr: "Al-Jabbar", pl: "Naprawiający złamane", en: "The Compeller", tafsir_pl: "Naprawia złamane serca i zmusza do sprawiedliwości.", tafsir_en: "Mends broken hearts and compels toward justice." },
  { n: 11, ar: "الْمُتَكَبِّر", tr: "Al-Mutakabbir", pl: "Majestatyczny", en: "The Supreme", tafsir_pl: "Jedyny godzien najwyższego majestatu.", tafsir_en: "The only one deserving supreme majesty." },
  { n: 12, ar: "الْخَالِق", tr: "Al-Khaliq", pl: "Stwórca", en: "The Creator", tafsir_pl: "Stwarza wszystko z niczego.", tafsir_en: "Creates everything from nothing." },
  { n: 13, ar: "الْبَارِئ", tr: "Al-Bari'", pl: "Twórca form", en: "The Evolver", tafsir_pl: "Tworzy stworzenia w precyzyjnych, odrębnych formach.", tafsir_en: "Creates beings in precise, distinct forms." },
  { n: 14, ar: "الْمُصَوِّر", tr: "Al-Musawwir", pl: "Nadający kształty", en: "The Fashioner", tafsir_pl: "Nadaje każdemu stworzeniu unikalny kształt.", tafsir_en: "Gives each creation its unique form." },
  { n: 15, ar: "الْغَفَّار", tr: "Al-Ghaffar", pl: "Wielce Wybaczający", en: "The Ever-Forgiving", tafsir_pl: "Przebacza grzechy wciąż na nowo.", tafsir_en: "Forgives sins again and again." },
  { n: 16, ar: "الْقَهَّار", tr: "Al-Qahhar", pl: "Poskramiający", en: "The Subduer", tafsir_pl: "Pokonuje i poskramia wszystko co mu przeciwne.", tafsir_en: "Overcomes and subdues all that opposes Him." },
  { n: 17, ar: "الْوَهَّاب", tr: "Al-Wahhab", pl: "Hojny Darczyńca", en: "The Bestower", tafsir_pl: "Daje dary bez oczekiwania czegokolwiek w zamian.", tafsir_en: "Gives gifts without expecting anything in return." },
  { n: 18, ar: "الرَّزَّاق", tr: "Ar-Razzaq", pl: "Żywiciel", en: "The Provider", tafsir_pl: "Zapewnia pożywienie wszystkim stworzeniom.", tafsir_en: "Provides sustenance for all of creation." },
  { n: 19, ar: "الْفَتَّاح", tr: "Al-Fattah", pl: "Otwierający", en: "The Opener", tafsir_pl: "Otwiera drzwi łaski i wiedzy.", tafsir_en: "Opens the doors of mercy and knowledge." },
  { n: 20, ar: "الْعَلِيم", tr: "Al-'Alim", pl: "Wszechwiedzący", en: "The All-Knowing", tafsir_pl: "Jego wiedza obejmuje wszystko — jawne i ukryte.", tafsir_en: "His knowledge encompasses everything — seen and unseen." },
  { n: 21, ar: "الْقَابِض", tr: "Al-Qabid", pl: "Ograniczający", en: "The Constrictor", tafsir_pl: "Zatrzymuje i ogranicza według swojej mądrości.", tafsir_en: "Withholds and restricts according to His wisdom." },
  { n: 22, ar: "الْبَاسِط", tr: "Al-Basit", pl: "Rozszerzający", en: "The Extender", tafsir_pl: "Rozszerza zaopatrzenie i łaskę.", tafsir_en: "Expands provision and grace." },
  { n: 23, ar: "الْخَافِض", tr: "Al-Khafid", pl: "Poniżający tyranów", en: "The Abaser", tafsir_pl: "Poniża tych którzy się buntują przeciw Bogu.", tafsir_en: "Humbles those who transgress against God." },
  { n: 24, ar: "الرَّافِع", tr: "Ar-Rafi'", pl: "Wywyższający", en: "The Exalter", tafsir_pl: "Wywyższa tych którym zechce.", tafsir_en: "Raises up those whom He wills." },
  { n: 25, ar: "الْمُعِزّ", tr: "Al-Mu'izz", pl: "Honorujący", en: "The Bestower of Honour", tafsir_pl: "Obdarza honorem i godnością.", tafsir_en: "Grants honour and dignity." },
  { n: 26, ar: "الْمُذِلّ", tr: "Al-Mudhill", pl: "Upokarzający pysznych", en: "The Humiliator", tafsir_pl: "Upokarza pysznych i niesprawiedliwych.", tafsir_en: "Humiliates the arrogant and unjust." },
  { n: 27, ar: "السَّمِيع", tr: "As-Sami'", pl: "Wszechsłyszący", en: "The All-Hearing", tafsir_pl: "Słyszy każde słowo i każdą myśl.", tafsir_en: "Hears every word and every thought." },
  { n: 28, ar: "الْبَصِير", tr: "Al-Basir", pl: "Wszechwidzący", en: "The All-Seeing", tafsir_pl: "Widzi każdy atom w stworzeniu.", tafsir_en: "Sees every atom in creation." },
  { n: 29, ar: "الْحَكَم", tr: "Al-Hakam", pl: "Sędzia", en: "The Judge", tafsir_pl: "Ostateczny sędzia wszystkich spraw.", tafsir_en: "The ultimate judge of all matters." },
  { n: 30, ar: "الْعَدْل", tr: "Al-'Adl", pl: "Sprawiedliwy", en: "The Just", tafsir_pl: "Absolutna sprawiedliwość — nie skrzywdzi nikogo.", tafsir_en: "Absolute justice — will wrong no one." },
  { n: 31, ar: "اللَّطِيف", tr: "Al-Latif", pl: "Subtelny i Łaskawy", en: "The Subtle One", tafsir_pl: "Wie o najsubtelniejszych sprawach i jest łaskawy.", tafsir_en: "Knows the most subtle matters and is kind." },
  { n: 32, ar: "الْخَبِير", tr: "Al-Khabir", pl: "Świadomy wszystkiego", en: "The All-Aware", tafsir_pl: "Świadom wszelkich wewnętrznych stanów i spraw.", tafsir_en: "Aware of all inner states and affairs." },
  { n: 33, ar: "الْحَلِيم", tr: "Al-Halim", pl: "Wyrozumiały", en: "The Forbearing", tafsir_pl: "Nie spieszy się z karą lecz daje czas na skruchę.", tafsir_en: "Does not rush to punish but gives time to repent." },
  { n: 34, ar: "الْعَظِيم", tr: "Al-'Azim", pl: "Wspaniały", en: "The Magnificent", tafsir_pl: "Jego wielkość przekracza wszelkie wyobrażenie.", tafsir_en: "His greatness surpasses all imagination." },
  { n: 35, ar: "الْغَفُور", tr: "Al-Ghafur", pl: "Wszechprzebaczający", en: "The All-Forgiving", tafsir_pl: "Przebacza nawet największe grzechy.", tafsir_en: "Forgives even the greatest sins." },
  { n: 36, ar: "الشَّكُور", tr: "Ash-Shakur", pl: "Doceniający", en: "The Appreciative", tafsir_pl: "Nagradza nawet najmniejsze dobre czyny.", tafsir_en: "Rewards even the smallest good deeds." },
  { n: 37, ar: "الْعَلِيّ", tr: "Al-'Ali", pl: "Najwyższy", en: "The Most High", tafsir_pl: "Wyniesiony ponad wszystko stworzenie.", tafsir_en: "Elevated above all of creation." },
  { n: 38, ar: "الْكَبِير", tr: "Al-Kabir", pl: "Największy", en: "The Greatest", tafsir_pl: "Nieporównywalnie większy od wszystkiego.", tafsir_en: "Incomparably greater than everything." },
  { n: 39, ar: "الْحَفِيظ", tr: "Al-Hafiz", pl: "Stróż", en: "The Preserver", tafsir_pl: "Zachowuje i strzeże wszystkiego.", tafsir_en: "Preserves and guards all things." },
  { n: 40, ar: "الْمُقِيت", tr: "Al-Muqit", pl: "Podtrzymujący życie", en: "The Nourisher", tafsir_pl: "Podtrzymuje życie każdego stworzenia.", tafsir_en: "Sustains the life of every creature." },
  { n: 41, ar: "الْحَسِيب", tr: "Al-Hasib", pl: "Obliczający", en: "The Reckoner", tafsir_pl: "Rozlicza wszystkie czyny z najwyższą precyzją.", tafsir_en: "Accounts for all deeds with supreme precision." },
  { n: 42, ar: "الْجَلِيل", tr: "Al-Jalil", pl: "Majestatyczny", en: "The Majestic", tafsir_pl: "Posiadający absolutny majestat i chwałę.", tafsir_en: "Possessing absolute majesty and glory." },
  { n: 43, ar: "الْكَرِيم", tr: "Al-Karim", pl: "Hojny", en: "The Generous", tafsir_pl: "Hojność bez granic — daje nawet tym którzy Go nie proszą.", tafsir_en: "Boundless generosity — gives even to those who don't ask." },
  { n: 44, ar: "الرَّقِيب", tr: "Ar-Raqib", pl: "Czuwający nad wszystkim", en: "The Watchful", tafsir_pl: "Obserwuje każdy czyn każdego stworzenia.", tafsir_en: "Observes every deed of every creature." },
  { n: 45, ar: "الْمُجِيب", tr: "Al-Mujib", pl: "Odpowiadający na modlitwy", en: "The Responsive", tafsir_pl: "Odpowiada na każdą szczerą prośbę.", tafsir_en: "Responds to every sincere supplication." },
  { n: 46, ar: "الْوَاسِع", tr: "Al-Wasi'", pl: "Nieograniczony", en: "The All-Encompassing", tafsir_pl: "Jego łaska i wiedza nie mają granic.", tafsir_en: "His mercy and knowledge have no limits." },
  { n: 47, ar: "الْحَكِيم", tr: "Al-Hakim", pl: "Mądry", en: "The All-Wise", tafsir_pl: "Każda Jego decyzja jest mądra i celowa.", tafsir_en: "Every His decision is wise and purposeful." },
  { n: 48, ar: "الْوَدُود", tr: "Al-Wadud", pl: "Kochający", en: "The Loving", tafsir_pl: "Kocha tych którzy czynią dobro.", tafsir_en: "Loves those who do good." },
  { n: 49, ar: "الْمَجِيد", tr: "Al-Majid", pl: "Chwałorodny", en: "The Most Glorious", tafsir_pl: "Niezrównana chwała i szlachetność.", tafsir_en: "Unmatched glory and nobility." },
  { n: 50, ar: "الْبَاعِث", tr: "Al-Ba'ith", pl: "Wskrzeszający", en: "The Resurrector", tafsir_pl: "Wskrzesi wszystkich w dniu ostatecznym.", tafsir_en: "Will resurrect all on the Last Day." },
  { n: 51, ar: "الشَّهِيد", tr: "Ash-Shahid", pl: "Świadek", en: "The Witness", tafsir_pl: "Świadkiem każdej chwili i każdego miejsca.", tafsir_en: "Witness to every moment and every place." },
  { n: 52, ar: "الْحَقّ", tr: "Al-Haqq", pl: "Prawda absolutna", en: "The Truth", tafsir_pl: "Jedyna absolutna prawda — wszystko inne jest względne.", tafsir_en: "The only absolute truth — everything else is relative." },
  { n: 53, ar: "الْوَكِيل", tr: "Al-Wakil", pl: "Powiernik", en: "The Trustee", tafsir_pl: "Wystarczy powierzyć Mu wszystkie sprawy.", tafsir_en: "Sufficient to entrust all affairs to Him." },
  { n: 54, ar: "الْقَوِيّ", tr: "Al-Qawi", pl: "Silny", en: "The All-Strong", tafsir_pl: "Jego siła jest absolutna i nieograniczona.", tafsir_en: "His strength is absolute and unlimited." },
  { n: 55, ar: "الْمَتِين", tr: "Al-Matin", pl: "Nieugięty", en: "The Firm", tafsir_pl: "Jego siła i postanowienia są niepokonane.", tafsir_en: "His strength and decrees are indomitable." },
  { n: 56, ar: "الْوَلِيّ", tr: "Al-Wali", pl: "Opiekun wierzących", en: "The Protecting Friend", tafsir_pl: "Przyjaciel i opiekun wierzących.", tafsir_en: "Friend and protector of the believers." },
  { n: 57, ar: "الْحَمِيد", tr: "Al-Hamid", pl: "Godny wszelkiej chwały", en: "The Praiseworthy", tafsir_pl: "Godny wszelkiej chwały i wdzięczności.", tafsir_en: "Worthy of all praise and gratitude." },
  { n: 58, ar: "الْمُحْصِي", tr: "Al-Muhsi", pl: "Zliczający wszystko", en: "The Counter", tafsir_pl: "Zlicza każdy atom i każdy czyn.", tafsir_en: "Counts every atom and every deed." },
  { n: 59, ar: "الْمُبْدِئ", tr: "Al-Mubdi'", pl: "Inicjujący stworzenie", en: "The Originator", tafsir_pl: "Zaczyna stworzenie bez precedensu.", tafsir_en: "Begins creation without precedent." },
  { n: 60, ar: "الْمُعِيد", tr: "Al-Mu'id", pl: "Przywracający do życia", en: "The Restorer", tafsir_pl: "Przywróci stworzenie po jego śmierci.", tafsir_en: "Will restore creation after its death." },
  { n: 61, ar: "الْمُحْيِي", tr: "Al-Muhyi", pl: "Ożywiający", en: "The Giver of Life", tafsir_pl: "Daje życie wszystkiemu co żywe.", tafsir_en: "Gives life to all that lives." },
  { n: 62, ar: "الْمُمِيت", tr: "Al-Mumit", pl: "Dający śmierć", en: "The Bringer of Death", tafsir_pl: "Śmierć jest Jego dziełem — nie ma od niej ucieczki.", tafsir_en: "Death is His work — there is no escape from it." },
  { n: 63, ar: "الْحَيّ", tr: "Al-Hayy", pl: "Wiecznie Żyjący", en: "The Ever Living", tafsir_pl: "Żyje wiecznie — nie zazna śmierci.", tafsir_en: "Lives eternally — will never experience death." },
  { n: 64, ar: "الْقَيُّوم", tr: "Al-Qayyum", pl: "Samoistny Podtrzymujący", en: "The Sustainer", tafsir_pl: "Samoistny i podtrzymuje cały wszechświat.", tafsir_en: "Self-sustaining and maintains the entire universe." },
  { n: 65, ar: "الْوَاجِد", tr: "Al-Wajid", pl: "Wszystko posiadający", en: "The Finder", tafsir_pl: "Wszystko jest dla Niego dostępne.", tafsir_en: "Everything is available to Him." },
  { n: 66, ar: "الْمَاجِد", tr: "Al-Majid", pl: "Szlachetny", en: "The Glorious", tafsir_pl: "Szlachetny w swoich atrybutach i działaniach.", tafsir_en: "Noble in His attributes and actions." },
  { n: 67, ar: "الْوَاحِد", tr: "Al-Wahid", pl: "Jedyny", en: "The One", tafsir_pl: "Jedyny bez żadnego partnera czy równego.", tafsir_en: "The One with no partner or equal." },
  { n: 68, ar: "الْأَحَد", tr: "Al-Ahad", pl: "Absolutnie Jedyny", en: "The Unique", tafsir_pl: "Absolutnie jedyny — Jego jedność jest niepodzielna.", tafsir_en: "Absolutely one — His oneness is indivisible." },
  { n: 69, ar: "الصَّمَد", tr: "As-Samad", pl: "Samowystarczalny", en: "The Eternal", tafsir_pl: "Wszystko Go potrzebuje, On niczego.", tafsir_en: "All need Him, He needs nothing." },
  { n: 70, ar: "الْقَادِر", tr: "Al-Qadir", pl: "Wszechwładny", en: "The All-Powerful", tafsir_pl: "Zdolny do wszystkiego co tylko zechce.", tafsir_en: "Capable of all that He wills." },
  { n: 71, ar: "الْمُقْتَدِر", tr: "Al-Muqtadir", pl: "Wykonujący swoją wolę", en: "The All-Determining", tafsir_pl: "Wykonuje swoją wolę z absolutną mocą.", tafsir_en: "Executes His will with absolute power." },
  { n: 72, ar: "الْمُقَدِّم", tr: "Al-Muqaddim", pl: "Przyspieszający", en: "The Expediter", tafsir_pl: "Stawia rzeczy na pierwszym miejscu według mądrości.", tafsir_en: "Places things first according to His wisdom." },
  { n: 73, ar: "الْمُؤَخِّر", tr: "Al-Mu'akhkhir", pl: "Opóźniający", en: "The Delayer", tafsir_pl: "Opóźnia według Swojej mądrości i planu.", tafsir_en: "Delays according to His wisdom and plan." },
  { n: 74, ar: "الْأَوَّل", tr: "Al-Awwal", pl: "Pierwszy", en: "The First", tafsir_pl: "Był zanim cokolwiek istniało.", tafsir_en: "Existed before anything else existed." },
  { n: 75, ar: "الْآخِر", tr: "Al-Akhir", pl: "Ostatni", en: "The Last", tafsir_pl: "Pozostanie po tym jak wszystko przeminie.", tafsir_en: "Will remain after everything else has perished." },
  { n: 76, ar: "الظَّاهِر", tr: "Az-Zahir", pl: "Jawny przez znaki", en: "The Manifest", tafsir_pl: "Objawia się przez znaki w stworzeniu.", tafsir_en: "Manifests through signs in creation." },
  { n: 77, ar: "الْبَاطِن", tr: "Al-Batin", pl: "Ukryty", en: "The Hidden", tafsir_pl: "Ukryty przed wzrokiem lecz bliższy niż żyła szyjna.", tafsir_en: "Hidden from sight yet closer than the jugular vein." },
  { n: 78, ar: "الْوَالِي", tr: "Al-Wali", pl: "Zarządca", en: "The Governor", tafsir_pl: "Zarządza wszystkimi sprawami stworzenia.", tafsir_en: "Governs all affairs of creation." },
  { n: 79, ar: "الْمُتَعَالِ", tr: "Al-Muta'ali", pl: "Wzniosły", en: "The Self-Exalted", tafsir_pl: "Wznosi się ponad wszelkie opisy i ograniczenia.", tafsir_en: "Rises above all descriptions and limitations." },
  { n: 80, ar: "الْبَرّ", tr: "Al-Barr", pl: "Dobrotliwy", en: "The Most Kind", tafsir_pl: "Dobry dla stworzenia — łaskawy i hojny.", tafsir_en: "Kind to creation — gracious and generous." },
  { n: 81, ar: "التَّوَّاب", tr: "At-Tawwab", pl: "Przyjmujący skruchę", en: "The Acceptor of Repentance", tafsir_pl: "Przyjmuje pokutę wciąż na nowo z miłością.", tafsir_en: "Accepts repentance again and again with love." },
  { n: 82, ar: "الْمُنْتَقِم", tr: "Al-Muntaqim", pl: "Mszczący uciśnionych", en: "The Avenger", tafsir_pl: "Pomści uciśnionych i ukarze tyranów.", tafsir_en: "Will avenge the oppressed and punish tyrants." },
  { n: 83, ar: "الْعَفُوّ", tr: "Al-'Afuww", pl: "Wymazujący grzechy", en: "The Pardoner", tafsir_pl: "Wymazuje grzechy zupełnie — jakby ich nie było.", tafsir_en: "Erases sins completely — as if they never were." },
  { n: 84, ar: "الرَّؤُوف", tr: "Ar-Ra'uf", pl: "Niezwykle Czuły", en: "The Compassionate", tafsir_pl: "Niezwykle czuły i współczujący wobec stworzenia.", tafsir_en: "Extremely tender and compassionate toward creation." },
  { n: 85, ar: "مَالِكُ الْمُلْك", tr: "Malik al-Mulk", pl: "Władca Królestwa", en: "The Owner of Sovereignty", tafsir_pl: "Jedyny prawowity władca całego stworzenia.", tafsir_en: "The only rightful ruler of all creation." },
  { n: 86, ar: "ذُو الْجَلَالِ وَالْإِكْرَام", tr: "Dhu l-Jalali wa-l-Ikram", pl: "Pan Majestatu i Łaski", en: "The Lord of Majesty and Bounty", tafsir_pl: "Łączy majestat z łaską — potęgę z dobrocią.", tafsir_en: "Combines majesty with grace — power with goodness." },
  { n: 87, ar: "الْمُقْسِط", tr: "Al-Muqsit", pl: "Bezstronny", en: "The Equitable", tafsir_pl: "Równy i sprawiedliwy wobec wszystkich.", tafsir_en: "Fair and just to all without exception." },
  { n: 88, ar: "الْجَامِع", tr: "Al-Jami'", pl: "Gromadzący wszystkich", en: "The Gatherer", tafsir_pl: "Zgromadzi wszystkich w dniu ostatecznym.", tafsir_en: "Will gather everyone on the Last Day." },
  { n: 89, ar: "الْغَنِيّ", tr: "Al-Ghani", pl: "Samowystarczalny", en: "The All-Sufficient", tafsir_pl: "Nie potrzebuje niczego — jest absolutnie samowystarczalny.", tafsir_en: "Needs nothing — absolutely self-sufficient." },
  { n: 90, ar: "الْمُغْنِي", tr: "Al-Mughni", pl: "Wzbogacający", en: "The Enricher", tafsir_pl: "Wzbogaca kogo chce — materialnie i duchowo.", tafsir_en: "Enriches whom He wills — materially and spiritually." },
  { n: 91, ar: "الْمَانِع", tr: "Al-Mani'", pl: "Powstrzymujący zło", en: "The Preventer", tafsir_pl: "Powstrzymuje zło i chroni od szkody.", tafsir_en: "Prevents harm and protects from evil." },
  { n: 92, ar: "الضَّارّ", tr: "Ad-Darr", pl: "Dopuszczający próby", en: "The Distresser", tafsir_pl: "Dopuszcza próby dla mądrości i oczyszczenia.", tafsir_en: "Permits trials for wisdom and purification." },
  { n: 93, ar: "النَّافِع", tr: "An-Nafi'", pl: "Zsyłający dobro", en: "The Benefiter", tafsir_pl: "Zsyła dobro i korzyści dla stworzenia.", tafsir_en: "Sends good and benefits to creation." },
  { n: 94, ar: "النُّور", tr: "An-Nur", pl: "Światło", en: "The Light", tafsir_pl: "Oświetla niebiosa i ziemię Swoim światłem (24:35).", tafsir_en: "Illuminates the heavens and earth with His light (24:35)." },
  { n: 95, ar: "الْهَادِي", tr: "Al-Hadi", pl: "Przewodnik na prostą drogę", en: "The Guide", tafsir_pl: "Prowadzi ku prawdzie tych którzy szukają.", tafsir_en: "Guides to truth those who seek it." },
  { n: 96, ar: "الْبَدِيع", tr: "Al-Badi'", pl: "Stwórca doskonałości", en: "The Incomparable", tafsir_pl: "Tworzy rzeczy doskonałe bez wzoru ani podobieństwa.", tafsir_en: "Creates perfect things without model or likeness." },
  { n: 97, ar: "الْبَاقِي", tr: "Al-Baqi", pl: "Wiecznotrwały", en: "The Everlasting", tafsir_pl: "Trwa wiecznie — bez początku i bez końca.", tafsir_en: "Lasts forever — without beginning or end." },
  { n: 98, ar: "الْوَارِث", tr: "Al-Warith", pl: "Dziedzic wszechświata", en: "The Inheritor", tafsir_pl: "Dziedziczy wszystko gdy wszechświat przeminie.", tafsir_en: "Inherits everything when the universe perishes." },
  { n: 99, ar: "الرَّشِيد", tr: "Ar-Rashid", pl: "Prowadzący prostą drogą", en: "The Guide to Right Path", tafsir_pl: "Prowadzi swoich wiernych na prostą drogę.", tafsir_en: "Leads His faithful on the straight path." }
];

export { islamicHadith } from "./data/islamic-hadith.js";

export const seerahTimeline = [
  { year: "570 n.e.", hijri: "Rok Słonia", pl: "Narodziny Proroka Muhammada ﷺ", en: "Birth of Prophet Muhammad ﷺ", desc_pl: "Urodzony w Mekce w plemieniu Quraysh. Ojciec Abdullah zmarł przed narodzinami.", desc_en: "Born in Mecca in the Quraysh tribe. Father Abdullah died before his birth." },
  { year: "610 n.e.", hijri: "1. rok objawienia", pl: "Pierwsze Objawienie w jaskini Hira", en: "First Revelation in Cave Hira", desc_pl: "Anioł Dżibril objawił pierwsze wersety sury Al-Alaq: 'Czytaj w imię Pana...'. Prorok miał 40 lat.", desc_en: "Angel Jibreel revealed the first verses of Al-Alaq: 'Read in the name of your Lord...' The Prophet was 40 years old." },
  { year: "613 n.e.", hijri: "3 lata po objawieniu", pl: "Publiczne głoszenie islamu", en: "Public Proclamation of Islam", desc_pl: "Prorok ﷺ zaczął publicznie głosić nową religię. Zaczęły się prześladowania pierwszych muzułmanów.", desc_en: "The Prophet ﷺ began publicly preaching. Persecution of early Muslims began." },
  { year: "619 n.e.", hijri: "Rok Smutku", pl: "Rok Smutku — śmierć Chadidży i Abu Taliba", en: "Year of Grief — death of Khadijah and Abu Talib", desc_pl: "W jednym roku umarły dwie osoby które go chroniły: ukochana żona Chadidża i wuj Abu Talib.", desc_en: "In one year died the two people who protected him: beloved wife Khadijah and uncle Abu Talib." },
  { year: "620 n.e.", hijri: "ok. 10 roku misji", pl: "Isra wal-Mi'radż — Nocna podróż", en: "Isra wal-Mi'raj — Night Journey", desc_pl: "Nocna podróż do Jerozolimy i wstąpienie przez 7 sfer niebieskich do Allaha. Ustanowiono 5 modlitw.", desc_en: "Night journey to Jerusalem and ascension through 7 heavens to Allah. The 5 daily prayers were established." },
  { year: "622 n.e.", hijri: "1 AH", pl: "Hidżra — migracja do Medyny", en: "Hijra — Migration to Madinah", desc_pl: "Prorok ﷺ i muzułmanie migrowali do Medyny. Rok ten stał się początkiem kalendarza muzułmańskiego.", desc_en: "The Prophet ﷺ and Muslims migrated to Madinah. This became the start of the Islamic calendar." },
  { year: "624 n.e.", hijri: "2 AH", pl: "Bitwa pod Badr", en: "Battle of Badr", desc_pl: "313 muzułmanów pokonało armię 1000 Mecczyczyków. Wielkie zwycięstwo opisane w Koranie.", desc_en: "313 Muslims defeated an army of 1000 Meccans. A great victory described in the Quran." },
  { year: "625 n.e.", hijri: "3 AH", pl: "Bitwa pod Uhud", en: "Battle of Uhud", desc_pl: "Muzułmanie ponieśli straty gdy łucznicy opuścili stanowiska. Prorok ﷺ był ranny. Lekcja posłuszeństwa.", desc_en: "Muslims suffered losses when archers abandoned positions. The Prophet ﷺ was wounded. A lesson in obedience." },
  { year: "627 n.e.", hijri: "5 AH", pl: "Bitwa o Rów (Al-Khandaq)", en: "Battle of the Trench", desc_pl: "Na pomysł Salmana al-Farisiego wykopano rów wokół Medyny. Koalicja tysięcy wrogów odeszła bez walki.", desc_en: "On Salman al-Farisi's idea, a trench was dug around Madinah. A coalition of thousands retreated without fighting." },
  { year: "628 n.e.", hijri: "6 AH", pl: "Układ w Hudajbijja", en: "Treaty of Hudaybiyyah", desc_pl: "Traktat pokojowy z Mekkańczykami. Koran nazwał go 'wyraźnym zwycięstwem' (48:1).", desc_en: "Peace treaty with Meccans. The Quran called it a 'clear victory' (48:1)." },
  { year: "630 n.e.", hijri: "8 AH", pl: "Zdobycie Mekki", en: "Conquest of Mecca", desc_pl: "Wejście do Mekki prawie bez rozlewu krwi. Prorok ﷺ ogłosił powszechne przebaczenie.", desc_en: "Entry into Mecca with almost no bloodshed. The Prophet ﷺ declared a general amnesty." },
  { year: "632 n.e.", hijri: "10 AH", pl: "Pożegnalna Pielgrzymka i śmierć Proroka ﷺ", en: "Farewell Pilgrimage and death of Prophet ﷺ", desc_pl: "Ostatni Hajj — słynne Kazanie Pożegnalne. 8 czerwca 632 roku Prorok ﷺ odszedł do Allaha w wieku 63 lat.", desc_en: "Last Hajj — the famous Farewell Sermon. On June 8, 632, the Prophet ﷺ passed away at age 63." }
];

export const tajweedRules = [
  { id: "idgham", name_pl: "Idgham — Wtopienie", name_en: "Idgham — Assimilation", desc_pl: "Gdy nun sakin (نْ) lub tanwin spotka literę ي ن م و ل ر — łączymy je w jedno z dźwiękiem nosowym.", desc_en: "When nun sakin or tanwin meets ي ن م و ل ر — they merge into one with a nasal sound.", example_ar: "مَن يَقُولُ", example_tr: "man-yaqulu", letters: "ي ن م و ل ر", color: "#10b981" },
  { id: "ikhfa", name_pl: "Ikhfa — Ukrycie", name_en: "Ikhfa — Concealment", desc_pl: "Gdy nun sakin lub tanwin spotka jedną z 15 liter — wymawiamy z ukrytym dźwiękiem nosowym przez 2 haraki.", desc_en: "When nun sakin or tanwin meets one of 15 letters — pronounce with hidden nasal sound for 2 beats.", example_ar: "مَن كَانَ", example_tr: "man kaana", letters: "ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك", color: "#f59e0b" },
  { id: "iqlab", name_pl: "Iqlab — Zamiana", name_en: "Iqlab — Conversion", desc_pl: "Gdy nun sakin lub tanwin spotka literę ب — zamieniamy na mim z ghunna (dźwiękiem nosowym).", desc_en: "When nun sakin or tanwin meets ب — convert the nun to mim with ghunnah.", example_ar: "مِن بَعْدِ", example_tr: "mim ba'di", letters: "ب", color: "#ef4444" },
  { id: "izhar", name_pl: "Izhar — Wymówienie wyraźne", name_en: "Izhar — Clear Pronunciation", desc_pl: "Gdy nun sakin lub tanwin spotka literę gardłową — wymawiamy wyraźnie bez ghunna.", desc_en: "When nun sakin or tanwin meets a throat letter — pronounce clearly without ghunnah.", example_ar: "مَنْ أَمَنَ", example_tr: "man amana", letters: "ء ه ع ح غ خ", color: "#3b82f6" },
  { id: "ghunna", name_pl: "Ghunna — Dźwięk nosowy", name_en: "Ghunnah — Nasalization", desc_pl: "Dźwięk nosowy przy م i ن z taszdid — trwa 2 haraki.", desc_en: "Nasal sound on م and ن with shaddah — lasts 2 beats.", example_ar: "إِنَّ", example_tr: "inna", letters: "م ن (z taszdid)", color: "#8b5cf6" },
  { id: "madd", name_pl: "Madd — Przedłużenie", name_en: "Madd — Elongation", desc_pl: "Przedłużenie samogłoski przy literach ا و ي. Podstawowy madd: 2 haraki, inne: 4-6 haraków.", desc_en: "Elongation at ا و ي. Basic madd: 2 beats, others: 4-6 beats.", example_ar: "قَالَ", example_tr: "qaala", letters: "ا و ي", color: "#06b6d4" },
  { id: "qalqalah", name_pl: "Qalqalah — Odbicie", name_en: "Qalqalah — Echoing", desc_pl: "Lekkie odbijające się brzmienie przy ق ط ب ج د gdy mają sukun lub są na końcu słowa.", desc_en: "Slight echoing sound on ق ط ب ج د with sukun or at end of word.", example_ar: "أَحَدٌ", example_tr: "ahad", letters: "ق ط ب ج د", color: "#ec4899" },
  { id: "waqf", name_pl: "Waqf — Pauza w recytacji", name_en: "Waqf — Pausing", desc_pl: "Zasady zatrzymywania się w recytacji. Znaki: م (musi), لا (nie), ج (można), قلى (lepiej).", desc_en: "Rules for stopping in recitation. Signs: م (must stop), لا (don't), ج (can stop), قلى (better to stop).", example_ar: "وَقف", example_tr: "waqf", letters: "م لا ج قلى ط", color: "#64748b" }
];

export const pillarsOfIslam = [
  { n: 1, ar: "الشَّهَادَة", tr: "Ash-Shahada", pl: "Wyznanie Wiary", en: "Declaration of Faith", desc_pl: "لَا إِلَهَ إِلَّا اللَّهُ مُحَمَّدٌ رَسُولُ اللَّهِ — Nie ma boga prócz Allaha, Muhammad jest Jego Posłańcem.", desc_en: "There is no god but Allah, Muhammad is His Messenger. Entry into Islam." },
  { n: 2, ar: "الصَّلَاة", tr: "As-Salah", pl: "Modlitwa", en: "Prayer", desc_pl: "5 modlitw dziennie: Fajr, Dhuhr, Asr, Maghrib, Isza. Bezpośrednia rozmowa z Allahem.", desc_en: "5 daily prayers: Fajr, Dhuhr, Asr, Maghrib, Isha. Direct conversation with Allah." },
  { n: 3, ar: "الزَّكَاة", tr: "Az-Zakah", pl: "Jałmużna Obowiązkowa", en: "Obligatory Charity", desc_pl: "2,5% majątku powyżej nisab rocznie dla potrzebujących. Oczyszcza majątek i serce.", desc_en: "2.5% of wealth above nisab annually for those in need. Purifies wealth and heart." },
  { n: 4, ar: "الصَّوْم", tr: "As-Sawm", pl: "Post", en: "Fasting", desc_pl: "Post w miesiącu Ramadan od świtu do zachodu słońca. Wstrzemięźliwość od jedzenia, picia i złych czynów.", desc_en: "Fasting in Ramadan from dawn to sunset. Abstaining from food, drink and bad deeds." },
  { n: 5, ar: "الْحَجّ", tr: "Al-Hajj", pl: "Pielgrzymka", en: "Pilgrimage", desc_pl: "Coroczna pielgrzymka do Mekki — obowiązek raz w życiu dla każdego kto ma możliwości.", desc_en: "Annual pilgrimage to Mecca — obligation once in a lifetime for those who are able." }
];

export const pillarsOfIman = [
  { n: 1, ar: "الإِيمَان بِاللَّه", tr: "Al-Iman billah", pl: "Wiara w Allaha", en: "Belief in Allah", desc_pl: "Wiara w jednego Boga — Allaha. Tawhed: jedność i wyjątkowość Boga.", desc_en: "Belief in one God — Allah. Tawhid: the oneness of God." },
  { n: 2, ar: "الإِيمَان بِالْمَلَائِكَة", tr: "Al-Iman bil-mala'ika", pl: "Wiara w Aniołów", en: "Belief in Angels", desc_pl: "Aniołowie stworzeni ze światła. Najważniejsi: Dżibril (objawienie), Mikail (deszcz), Israfil (trąba sądu).", desc_en: "Angels created from light. Key: Jibreel (revelation), Mikail (rain), Israfil (trumpet of judgment)." },
  { n: 3, ar: "الإِيمَان بِالْكُتُب", tr: "Al-Iman bil-kutub", pl: "Wiara w Księgi Objawione", en: "Belief in the Revealed Books", desc_pl: "Wiara we wszystkie księgi zesłane przez Allaha: Koran, Tora, Ewangelia, Psalmy.", desc_en: "Belief in all books sent by Allah: Quran, Torah, Gospel, Psalms." },
  { n: 4, ar: "الإِيمَان بِالرُّسُل", tr: "Al-Iman bir-rusul", pl: "Wiara w Proroków", en: "Belief in the Prophets", desc_pl: "Wiara we wszystkich proroków — od Adama przez Ibrahima, Musę, Isę aż do Muhammada ﷺ.", desc_en: "Belief in all prophets — from Adam through Ibrahim, Musa, Isa to Muhammad ﷺ." },
  { n: 5, ar: "الإِيمَان بِالْيَوْمِ الْآخِر", tr: "Al-Iman bil-yawmil-akhir", pl: "Wiara w Dzień Ostatni", en: "Belief in the Last Day", desc_pl: "Wiara w Dzień Sądu, raj (Janna) i piekło (Dżahannam). Każdy człowiek będzie rozliczony.", desc_en: "Belief in the Day of Judgment, paradise and hellfire. Every person will be accountable." },
  { n: 6, ar: "الإِيمَان بِالْقَدَر", tr: "Al-Iman bil-qadar", pl: "Wiara w Przeznaczenie", en: "Belief in Divine Decree", desc_pl: "Allah wie wszystko co było, jest i będzie. Tawakkul: ufanie Allahowi przy jednoczesnym działaniu.", desc_en: "Allah knows everything that was, is and will be. Tawakkul: trust in Allah while still acting." }
];

export const islamicMonths = [
  { n: 1, ar: "مُحَرَّم", tr: "Muharram", pl: "Muharram", en: "Muharram", note_pl: "Pierwszy miesiąc. Dzień Aszura (10.) — post i refleksja.", note_en: "First month. Day of Ashura (10th) — fasting and reflection." },
  { n: 2, ar: "صَفَر", tr: "Safar", pl: "Safar", en: "Safar", note_pl: "Drugi miesiąc.", note_en: "Second month." },
  { n: 3, ar: "رَبِيعُ الْأَوَّل", tr: "Rabi al-Awwal", pl: "Rabi al-Awwal", en: "Rabi al-Awwal", note_pl: "Trzeci miesiąc. 12. — Mawlid an-Nabi: narodziny Proroka ﷺ.", note_en: "Third month. 12th — Mawlid an-Nabi: birth of the Prophet ﷺ." },
  { n: 4, ar: "رَبِيعُ الثَّانِي", tr: "Rabi ath-Thani", pl: "Rabi ath-Thani", en: "Rabi ath-Thani", note_pl: "Czwarty miesiąc.", note_en: "Fourth month." },
  { n: 5, ar: "جُمَادَى الْأُولَى", tr: "Jumada al-Ula", pl: "Jumada al-Ula", en: "Jumada al-Ula", note_pl: "Piąty miesiąc.", note_en: "Fifth month." },
  { n: 6, ar: "جُمَادَى الْآخِرَة", tr: "Jumada al-Akhira", pl: "Jumada al-Akhira", en: "Jumada al-Akhira", note_pl: "Szósty miesiąc.", note_en: "Sixth month." },
  { n: 7, ar: "رَجَب", tr: "Rajab", pl: "Rajab", en: "Rajab", note_pl: "Siódmy miesiąc. Jeden z czterech świętych miesięcy. 27. — Isra wal-Mi'radż.", note_en: "Seventh month. One of four sacred months. 27th — Isra wal-Mi'raj." },
  { n: 8, ar: "شَعْبَان", tr: "Sha'ban", pl: "Sha'ban", en: "Sha'ban", note_pl: "Ósmy miesiąc. 15. — Laylat al-Bara'a. Miesiąc przygotowania przed Ramadanem.", note_en: "Eighth month. 15th — Night of Bara'at. Month of preparation before Ramadan." },
  { n: 9, ar: "رَمَضَان", tr: "Ramadan", pl: "Ramadan", en: "Ramadan", note_pl: "Dziewiąty miesiąc. Miesiąc postu i Koranu. Laylat al-Qadr w ostatnich 10 nocach.", note_en: "Ninth month. Month of fasting and Quran. Laylat al-Qadr in the last 10 nights." },
  { n: 10, ar: "شَوَّال", tr: "Shawwal", pl: "Shawwal", en: "Shawwal", note_pl: "Dziesiąty miesiąc. 1. — Eid al-Fitr. 6 dni postu = post całego roku.", note_en: "Tenth month. 1st — Eid al-Fitr. 6 days fasting = reward of fasting a whole year." },
  { n: 11, ar: "ذُو الْقَعْدَة", tr: "Dhu al-Qi'dah", pl: "Dhu al-Qi'dah", en: "Dhu al-Qi'dah", note_pl: "Jedenasty miesiąc. Jeden z czterech świętych miesięcy.", note_en: "Eleventh month. One of four sacred months." },
  { n: 12, ar: "ذُو الْحِجَّة", tr: "Dhu al-Hijjah", pl: "Dhu al-Hijjah", en: "Dhu al-Hijjah", note_pl: "Dwunasty miesiąc. 8-13. — Hajj. 10. — Eid al-Adha. Jeden z czterech świętych miesięcy.", note_en: "Twelfth month. 8th-13th — Hajj. 10th — Eid al-Adha. One of four sacred months." }
];

export const arabicRoots = [
  { root: "ك-ت-ب", root_ar: "ك ت ب", tr: "k-t-b", meaning_pl: "pisanie", meaning_en: "writing", words: [
    { ar: "كَتَبَ", tr: "kataba", pl: "pisał", en: "he wrote" },
    { ar: "كِتَاب", tr: "kitab", pl: "książka", en: "book" },
    { ar: "كَاتِب", tr: "katib", pl: "pisarz", en: "writer" },
    { ar: "مَكْتَبَة", tr: "maktaba", pl: "biblioteka", en: "library" }
  ]},
  { root: "ع-ل-م", root_ar: "ع ل م", tr: "'a-l-m", meaning_pl: "wiedza", meaning_en: "knowledge", words: [
    { ar: "عِلْم", tr: "'ilm", pl: "wiedza", en: "knowledge" },
    { ar: "عَالِم", tr: "'alim", pl: "uczony", en: "scholar" },
    { ar: "تَعَلَّمَ", tr: "ta'allama", pl: "uczył się", en: "he learned" },
    { ar: "مَعْلُوم", tr: "ma'lum", pl: "znany", en: "known" }
  ]},
  { root: "د-ر-س", root_ar: "د ر س", tr: "d-r-s", meaning_pl: "nauka", meaning_en: "study", words: [
    { ar: "دَرَسَ", tr: "darasa", pl: "uczył się", en: "he studied" },
    { ar: "دَرْس", tr: "dars", pl: "lekcja", en: "lesson" },
    { ar: "مَدْرَسَة", tr: "madrasa", pl: "szkoła", en: "school" },
    { ar: "مُدَرِّس", tr: "mudarris", pl: "nauczyciel", en: "teacher" }
  ]},
  { root: "س-ل-م", root_ar: "س ل م", tr: "s-l-m", meaning_pl: "pokój/bezpieczeństwo", meaning_en: "peace/safety", words: [
    { ar: "سَلَام", tr: "salam", pl: "pokój", en: "peace" },
    { ar: "إِسْلَام", tr: "islam", pl: "islam", en: "Islam" },
    { ar: "مُسْلِم", tr: "muslim", pl: "muzułmanin", en: "Muslim" },
    { ar: "سَلَامة", tr: "salama", pl: "bezpieczeństwo", en: "safety" }
  ]},
  { root: "ق-ر-أ", root_ar: "ق ر أ", tr: "q-r-'", meaning_pl: "czytanie", meaning_en: "reading", words: [
    { ar: "قَرَأَ", tr: "qara'a", pl: "czytał", en: "he read" },
    { ar: "قُرْآن", tr: "qur'an", pl: "Koran", en: "Quran" },
    { ar: "قِرَاءَة", tr: "qira'a", pl: "czytanie", en: "reading" },
    { ar: "قَارِئ", tr: "qari'", pl: "recytator", en: "reciter" }
  ]},
  { root: "ح-م-د", root_ar: "ح م د", tr: "h-m-d", meaning_pl: "chwała", meaning_en: "praise", words: [
    { ar: "حَمْد", tr: "hamd", pl: "chwała", en: "praise" },
    { ar: "أَحْمَد", tr: "Ahmad", pl: "Ahmad (imię Proroka)", en: "Ahmad (name of the Prophet)" },
    { ar: "مُحَمَّد", tr: "Muhammad", pl: "Muhammad", en: "Muhammad" },
    { ar: "حَمِيد", tr: "hamid", pl: "godny chwały", en: "praiseworthy" }
  ]},
  { root: "ر-ح-م", root_ar: "ر ح م", tr: "r-h-m", meaning_pl: "miłosierdzie", meaning_en: "mercy", words: [
    { ar: "رَحْمَة", tr: "rahma", pl: "miłosierdzie", en: "mercy" },
    { ar: "رَحْمَن", tr: "rahman", pl: "Miłosierny", en: "Most Gracious" },
    { ar: "رَحِيم", tr: "rahim", pl: "Miłościwy", en: "Most Merciful" },
    { ar: "أَرْحَام", tr: "arham", pl: "więzy krwi", en: "blood ties" }
  ]},
  { root: "ص-ب-ر", root_ar: "ص ب ر", tr: "s-b-r", meaning_pl: "cierpliwość", meaning_en: "patience", words: [
    { ar: "صَبْر", tr: "sabr", pl: "cierpliwość", en: "patience" },
    { ar: "صَابِر", tr: "sabir", pl: "cierpliwy", en: "patient" },
    { ar: "صَبُور", tr: "sabur", pl: "bardzo cierpliwy", en: "very patient" },
    { ar: "إِصْبَار", tr: "isbara", pl: "wykazywać cierpliwość", en: "to show patience" }
  ]}
];

// ============================================================
// NEW MUSLIM GUIDE — muallaf
// ============================================================
export const newMuslimSteps = [
  {
    n: 1, icon: "☪",
    ar: "أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ ٱللَّٰهِ",
    tr: "Ašhadu an lā ilāha illā-llāh, wa ašhadu anna Muḥammadan rasūlu-llāh",
    titlePl: "Szahada — Wyznanie Wiary",
    titleEn: "Shahada — Declaration of Faith",
    descPl: "Pierwsze i najważniejsze. Znaczy: «Świadczę, że nie ma boga prócz Allaha i świadczę, że Muhammad jest Jego posłańcem.» Wypowiedziana szczerze — jest momentem, w którym stajesz się muzułmaninem.",
    descEn: "First and most important. It means: 'I bear witness there is no god but Allah and Muhammad is His messenger.' Said sincerely — it is the moment you become Muslim.",
    tipPl: "Nie musisz rozumieć arabskiego idealnie. Liczy się szczerość serca (niyyah).",
    tipEn: "You don't need perfect Arabic. What counts is sincerity of heart (niyyah)."
  },
  {
    n: 2, icon: "💧",
    ar: "الوُضُوء",
    tr: "al-wuḍūʾ",
    titlePl: "Wudu — Oczyszczenie",
    titleEn: "Wudu — Ritual Purification",
    descPl: "Bez wudu modlitwa jest nieważna. Na szczęście to proste: myjesz ręce, usta, nos, twarz, przedramiona, głowę, uszy i stopy — w określonej kolejności. Trwa ok. 2 minut.",
    descEn: "Without wudu prayer is invalid. Fortunately it's simple: wash hands, mouth, nose, face, forearms, head, ears and feet — in order. Takes about 2 minutes.",
    tipPl: "Wudu trwa do momentu gdy coś je 'złamie' — sen, wyjście do toalety, utrata przytomności.",
    tipEn: "Wudu stays valid until 'broken' — by sleep, using the bathroom, or losing consciousness."
  },
  {
    n: 3, icon: "📖",
    ar: "الفَاتِحَة",
    tr: "al-Fātiḥa",
    titlePl: "Al-Fatiha — Zanim zaczniesz się modlić",
    titleEn: "Al-Fatiha — Before You Start Praying",
    descPl: "7 wersetów, które recytujesz w każdej jednostce modlitwy (raka'at). To pierwsza sura, której należy się nauczyć. Zacznij od niej — reszta może poczekać.",
    descEn: "7 verses recited in every prayer unit (raka'at). This is the first surah to learn. Start here — the rest can wait.",
    tipPl: "Dopuszczalne jest czytanie Al-Fatiha z kartki lub telefonu, gdy dopiero zaczynasz.",
    tipEn: "It's acceptable to read Al-Fatiha from a card or phone when you're just starting out."
  },
  {
    n: 4, icon: "🕌",
    ar: "الصَّلَاة",
    tr: "aṣ-Ṣalāh",
    titlePl: "Salat — 5 Modlitw Dziennie",
    titleEn: "Salat — 5 Daily Prayers",
    descPl: "Fajr (świt), Dhuhr (południe), Asr (popołudnie), Maghrib (zachód słońca), Isha (noc). Nie martw się, że zrobisz błąd — Allah ocenia intencję i wysiłek, nie perfekcję.",
    descEn: "Fajr (dawn), Dhuhr (noon), Asr (afternoon), Maghrib (sunset), Isha (night). Don't worry about making mistakes — Allah judges intention and effort, not perfection.",
    tipPl: "Możesz łączyć modlitwy w podróży lub chorobie — islam jest religią ułatwień.",
    tipEn: "You may combine prayers while travelling or ill — Islam is a religion of ease."
  },
  {
    n: 5, icon: "🌙",
    ar: "الصِّيَام",
    tr: "aṣ-Ṣiyām",
    titlePl: "Ramadan — Post",
    titleEn: "Ramadan — Fasting",
    descPl: "Raz w roku, przez cały miesiąc Ramadan, muzułmanie powstrzymują się od jedzenia, picia i współżycia od świtu do zachodu słońca. To czas duchowości, wspólnoty i wdzięczności.",
    descEn: "Once a year, throughout Ramadan, Muslims abstain from food, drink and intimacy from dawn to sunset. It is a time of spirituality, community and gratitude.",
    tipPl: "Chorzy, podróżni i kobiety w ciąży są zwolnieni — mogą odpracować dni później.",
    tipEn: "The sick, travellers and pregnant women are exempt — they can make up days later."
  },
  {
    n: 6, icon: "🤲",
    ar: "الزَّكَاة",
    tr: "az-Zakāh",
    titlePl: "Zakat — Jałmużna",
    titleEn: "Zakat — Almsgiving",
    descPl: "2,5% rocznych oszczędności przekazywane potrzebującym — jeśli posiadasz nadwyżkę przez cały rok. To oczyszczenie majątku i filar solidarności społecznej w islamie.",
    descEn: "2.5% of annual savings given to those in need — if you've held a surplus for a full year. It purifies wealth and is a pillar of social solidarity in Islam.",
    tipPl: "Nie dotyczy kogoś, kto nie ma nadwyżek finansowych. Islam nie nakłada ciężarów.",
    tipEn: "Doesn't apply to someone without financial surplus. Islam does not burden people."
  },
  {
    n: 7, icon: "🕋",
    ar: "الحَج",
    tr: "al-Ḥajj",
    titlePl: "Hadżdż — Pielgrzymka",
    titleEn: "Hajj — Pilgrimage",
    descPl: "Raz w życiu, jeśli możesz sobie na to pozwolić zdrowotnie i finansowo. Miliony muzułmanów z całego świata spotykają się w Mekce — jedno z najpotężniejszych doświadczeń duchowych na ziemi.",
    descEn: "Once in a lifetime, if you are physically and financially able. Millions of Muslims from around the world gather in Mecca — one of the most powerful spiritual experiences on earth.",
    tipPl: "Nikt nie jest zobowiązany do Hadżdżu jeśli go nie stać lub choruje. Allah jest Al-Latif — subtelny i wyrozumiały.",
    tipEn: "No one is obligated for Hajj if they cannot afford it or are ill. Allah is Al-Latif — gentle and understanding."
  }
];

// ============================================================
// HALAL & HARAM DATA
// ============================================================
export { halalHaramData } from "./data/halal-haram.js";

// ============================================================
// ISLAMIC FAQ - islamfaq
// ============================================================
export { islamicFaq } from "./data/islamic-faq.js";
