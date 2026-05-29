// Static Quran, Dua, and Hifz configuration used by the Quran screen.

export const QURAN_RECITERS = [
  { id: "ar.alafasy", name: "Mishary Rashid Alafasy" },
  { id: "ar.abdulsamad", name: "Abdul Basit Abdus Samad" },
  { id: "ar.minshawi", name: "Mohamed Siddiq al-Minshawi" }
];

export const SURAH_LIST = [
  {
    number: 1,
    arName: "الفاتحة",
    enName: "Al-Fatiha",
    meaning: "The Opening",
    numberOfAyahs: 7,
    revelationType: "Meccan"
  },
  {
    number: 2,
    arName: "البقرة",
    enName: "Al-Baqarah",
    meaning: "The Cow",
    numberOfAyahs: 286,
    revelationType: "Medinan"
  },
  {
    number: 3,
    arName: "آل عمران",
    enName: "Al-Imran",
    meaning: "Family of Imran",
    numberOfAyahs: 200,
    revelationType: "Medinan"
  },
  {
    number: 4,
    arName: "النساء",
    enName: "An-Nisa",
    meaning: "The Women",
    numberOfAyahs: 176,
    revelationType: "Medinan"
  },
  {
    number: 5,
    arName: "المائدة",
    enName: "Al-Maidah",
    meaning: "The Table Spread",
    numberOfAyahs: 120,
    revelationType: "Medinan"
  },
  {
    number: 6,
    arName: "الأنعام",
    enName: "Al-Anam",
    meaning: "The Cattle",
    numberOfAyahs: 165,
    revelationType: "Meccan"
  },
  {
    number: 7,
    arName: "الأعراف",
    enName: "Al-Araf",
    meaning: "The Heights",
    numberOfAyahs: 206,
    revelationType: "Meccan"
  },
  {
    number: 8,
    arName: "الأنفال",
    enName: "Al-Anfal",
    meaning: "The Spoils of War",
    numberOfAyahs: 75,
    revelationType: "Medinan"
  },
  {
    number: 9,
    arName: "التوبة",
    enName: "At-Tawbah",
    meaning: "The Repentance",
    numberOfAyahs: 129,
    revelationType: "Medinan"
  },
  { number: 10, arName: "يونس", enName: "Yunus", meaning: "Jonah", numberOfAyahs: 109, revelationType: "Meccan" },
  { number: 11, arName: "هود", enName: "Hud", meaning: "Hud", numberOfAyahs: 123, revelationType: "Meccan" },
  { number: 12, arName: "يوسف", enName: "Yusuf", meaning: "Joseph", numberOfAyahs: 111, revelationType: "Meccan" },
  {
    number: 13,
    arName: "الرعد",
    enName: "Ar-Rad",
    meaning: "The Thunder",
    numberOfAyahs: 43,
    revelationType: "Medinan"
  },
  { number: 14, arName: "إبراهيم", enName: "Ibrahim", meaning: "Abraham", numberOfAyahs: 52, revelationType: "Meccan" },
  {
    number: 15,
    arName: "الحجر",
    enName: "Al-Hijr",
    meaning: "The Rocky Tract",
    numberOfAyahs: 99,
    revelationType: "Meccan"
  },
  { number: 16, arName: "النحل", enName: "An-Nahl", meaning: "The Bee", numberOfAyahs: 128, revelationType: "Meccan" },
  {
    number: 17,
    arName: "الإسراء",
    enName: "Al-Isra",
    meaning: "The Night Journey",
    numberOfAyahs: 111,
    revelationType: "Meccan"
  },
  { number: 18, arName: "الكهف", enName: "Al-Kahf", meaning: "The Cave", numberOfAyahs: 110, revelationType: "Meccan" },
  { number: 19, arName: "مريم", enName: "Maryam", meaning: "Mary", numberOfAyahs: 98, revelationType: "Meccan" },
  { number: 20, arName: "طه", enName: "Ta-Ha", meaning: "Ta-Ha", numberOfAyahs: 135, revelationType: "Meccan" },
  {
    number: 21,
    arName: "الأنبياء",
    enName: "Al-Anbiya",
    meaning: "The Prophets",
    numberOfAyahs: 112,
    revelationType: "Meccan"
  },
  {
    number: 22,
    arName: "الحج",
    enName: "Al-Hajj",
    meaning: "The Pilgrimage",
    numberOfAyahs: 78,
    revelationType: "Medinan"
  },
  {
    number: 23,
    arName: "المؤمنون",
    enName: "Al-Muminun",
    meaning: "The Believers",
    numberOfAyahs: 118,
    revelationType: "Meccan"
  },
  { number: 24, arName: "النور", enName: "An-Nur", meaning: "The Light", numberOfAyahs: 64, revelationType: "Medinan" },
  {
    number: 25,
    arName: "الفرقان",
    enName: "Al-Furqan",
    meaning: "The Criterion",
    numberOfAyahs: 77,
    revelationType: "Meccan"
  },
  {
    number: 26,
    arName: "الشعراء",
    enName: "Ash-Shuara",
    meaning: "The Poets",
    numberOfAyahs: 227,
    revelationType: "Meccan"
  },
  { number: 27, arName: "النمل", enName: "An-Naml", meaning: "The Ant", numberOfAyahs: 93, revelationType: "Meccan" },
  {
    number: 28,
    arName: "القصص",
    enName: "Al-Qasas",
    meaning: "The Stories",
    numberOfAyahs: 88,
    revelationType: "Meccan"
  },
  {
    number: 29,
    arName: "العنكبوت",
    enName: "Al-Ankabut",
    meaning: "The Spider",
    numberOfAyahs: 69,
    revelationType: "Meccan"
  },
  { number: 30, arName: "الروم", enName: "Ar-Rum", meaning: "The Romans", numberOfAyahs: 60, revelationType: "Meccan" },
  { number: 31, arName: "لقمان", enName: "Luqman", meaning: "Luqman", numberOfAyahs: 34, revelationType: "Meccan" },
  {
    number: 32,
    arName: "السجدة",
    enName: "As-Sajdah",
    meaning: "The Prostration",
    numberOfAyahs: 30,
    revelationType: "Meccan"
  },
  {
    number: 33,
    arName: "الأحزاب",
    enName: "Al-Ahzab",
    meaning: "The Combined Forces",
    numberOfAyahs: 73,
    revelationType: "Medinan"
  },
  { number: 34, arName: "سبأ", enName: "Saba", meaning: "Sheba", numberOfAyahs: 54, revelationType: "Meccan" },
  { number: 35, arName: "فاطر", enName: "Fatir", meaning: "Originator", numberOfAyahs: 45, revelationType: "Meccan" },
  { number: 36, arName: "يس", enName: "Ya-Sin", meaning: "Ya Sin", numberOfAyahs: 83, revelationType: "Meccan" },
  {
    number: 37,
    arName: "الصافات",
    enName: "As-Saffat",
    meaning: "Those Ranged in Ranks",
    numberOfAyahs: 182,
    revelationType: "Meccan"
  },
  { number: 38, arName: "ص", enName: "Sad", meaning: "Sad", numberOfAyahs: 88, revelationType: "Meccan" },
  {
    number: 39,
    arName: "الزمر",
    enName: "Az-Zumar",
    meaning: "The Groups",
    numberOfAyahs: 75,
    revelationType: "Meccan"
  },
  {
    number: 40,
    arName: "غافر",
    enName: "Ghafir",
    meaning: "The Forgiver",
    numberOfAyahs: 85,
    revelationType: "Meccan"
  },
  {
    number: 41,
    arName: "فصلت",
    enName: "Fussilat",
    meaning: "Explained in Detail",
    numberOfAyahs: 54,
    revelationType: "Meccan"
  },
  {
    number: 42,
    arName: "الشورى",
    enName: "Ash-Shura",
    meaning: "The Consultation",
    numberOfAyahs: 53,
    revelationType: "Meccan"
  },
  {
    number: 43,
    arName: "الزخرف",
    enName: "Az-Zukhruf",
    meaning: "The Gold Adornments",
    numberOfAyahs: 89,
    revelationType: "Meccan"
  },
  {
    number: 44,
    arName: "الدخان",
    enName: "Ad-Dukhan",
    meaning: "The Smoke",
    numberOfAyahs: 59,
    revelationType: "Meccan"
  },
  {
    number: 45,
    arName: "الجاثية",
    enName: "Al-Jathiyah",
    meaning: "The Crouching",
    numberOfAyahs: 37,
    revelationType: "Meccan"
  },
  {
    number: 46,
    arName: "الأحقاف",
    enName: "Al-Ahqaf",
    meaning: "The Wind-Curved Sandhills",
    numberOfAyahs: 35,
    revelationType: "Meccan"
  },
  { number: 47, arName: "محمد", enName: "Muhammad", meaning: "Muhammad", numberOfAyahs: 38, revelationType: "Medinan" },
  {
    number: 48,
    arName: "الفتح",
    enName: "Al-Fath",
    meaning: "The Victory",
    numberOfAyahs: 29,
    revelationType: "Medinan"
  },
  {
    number: 49,
    arName: "الحجرات",
    enName: "Al-Hujurat",
    meaning: "The Rooms",
    numberOfAyahs: 18,
    revelationType: "Medinan"
  },
  { number: 50, arName: "ق", enName: "Qaf", meaning: "Qaf", numberOfAyahs: 45, revelationType: "Meccan" },
  {
    number: 51,
    arName: "الذاريات",
    enName: "Adh-Dhariyat",
    meaning: "The Winnowing Winds",
    numberOfAyahs: 60,
    revelationType: "Meccan"
  },
  { number: 52, arName: "الطور", enName: "At-Tur", meaning: "The Mount", numberOfAyahs: 49, revelationType: "Meccan" },
  { number: 53, arName: "النجم", enName: "An-Najm", meaning: "The Star", numberOfAyahs: 62, revelationType: "Meccan" },
  { number: 54, arName: "القمر", enName: "Al-Qamar", meaning: "The Moon", numberOfAyahs: 55, revelationType: "Meccan" },
  {
    number: 55,
    arName: "الرحمن",
    enName: "Ar-Rahman",
    meaning: "The Most Gracious",
    numberOfAyahs: 78,
    revelationType: "Medinan"
  },
  {
    number: 56,
    arName: "الواقعة",
    enName: "Al-Waqiah",
    meaning: "The Inevitable",
    numberOfAyahs: 96,
    revelationType: "Meccan"
  },
  {
    number: 57,
    arName: "الحديد",
    enName: "Al-Hadid",
    meaning: "The Iron",
    numberOfAyahs: 29,
    revelationType: "Medinan"
  },
  {
    number: 58,
    arName: "المجادلة",
    enName: "Al-Mujadila",
    meaning: "The Pleading Woman",
    numberOfAyahs: 22,
    revelationType: "Medinan"
  },
  {
    number: 59,
    arName: "الحشر",
    enName: "Al-Hashr",
    meaning: "The Exile",
    numberOfAyahs: 24,
    revelationType: "Medinan"
  },
  {
    number: 60,
    arName: "الممتحنة",
    enName: "Al-Mumtahanah",
    meaning: "She That is to be Examined",
    numberOfAyahs: 13,
    revelationType: "Medinan"
  },
  { number: 61, arName: "الصف", enName: "As-Saf", meaning: "The Ranks", numberOfAyahs: 14, revelationType: "Medinan" },
  {
    number: 62,
    arName: "الجمعة",
    enName: "Al-Jumuah",
    meaning: "Friday",
    numberOfAyahs: 11,
    revelationType: "Medinan"
  },
  {
    number: 63,
    arName: "المنافقون",
    enName: "Al-Munafiqun",
    meaning: "The Hypocrites",
    numberOfAyahs: 11,
    revelationType: "Medinan"
  },
  {
    number: 64,
    arName: "التغابن",
    enName: "At-Taghabun",
    meaning: "The Mutual Disillusion",
    numberOfAyahs: 18,
    revelationType: "Medinan"
  },
  {
    number: 65,
    arName: "الطلاق",
    enName: "At-Talaq",
    meaning: "The Divorce",
    numberOfAyahs: 12,
    revelationType: "Medinan"
  },
  {
    number: 66,
    arName: "التحريم",
    enName: "At-Tahrim",
    meaning: "The Prohibition",
    numberOfAyahs: 12,
    revelationType: "Medinan"
  },
  {
    number: 67,
    arName: "الملك",
    enName: "Al-Mulk",
    meaning: "The Sovereignty",
    numberOfAyahs: 30,
    revelationType: "Meccan"
  },
  { number: 68, arName: "القلم", enName: "Al-Qalam", meaning: "The Pen", numberOfAyahs: 52, revelationType: "Meccan" },
  {
    number: 69,
    arName: "الحاقة",
    enName: "Al-Haqqah",
    meaning: "The Reality",
    numberOfAyahs: 52,
    revelationType: "Meccan"
  },
  {
    number: 70,
    arName: "المعارج",
    enName: "Al-Maarij",
    meaning: "The Ascending Stairways",
    numberOfAyahs: 44,
    revelationType: "Meccan"
  },
  { number: 71, arName: "نوح", enName: "Nuh", meaning: "Noah", numberOfAyahs: 28, revelationType: "Meccan" },
  { number: 72, arName: "الجن", enName: "Al-Jinn", meaning: "The Jinn", numberOfAyahs: 28, revelationType: "Meccan" },
  {
    number: 73,
    arName: "المزمل",
    enName: "Al-Muzzammil",
    meaning: "The Enshrouded One",
    numberOfAyahs: 20,
    revelationType: "Meccan"
  },
  {
    number: 74,
    arName: "المدثر",
    enName: "Al-Muddaththir",
    meaning: "The Cloaked One",
    numberOfAyahs: 56,
    revelationType: "Meccan"
  },
  {
    number: 75,
    arName: "القيامة",
    enName: "Al-Qiyamah",
    meaning: "The Resurrection",
    numberOfAyahs: 40,
    revelationType: "Meccan"
  },
  {
    number: 76,
    arName: "الإنسان",
    enName: "Al-Insan",
    meaning: "The Man",
    numberOfAyahs: 31,
    revelationType: "Medinan"
  },
  {
    number: 77,
    arName: "المرسلات",
    enName: "Al-Mursalat",
    meaning: "The Emissaries",
    numberOfAyahs: 50,
    revelationType: "Meccan"
  },
  {
    number: 78,
    arName: "النبأ",
    enName: "An-Naba",
    meaning: "The Tidings",
    numberOfAyahs: 40,
    revelationType: "Meccan"
  },
  {
    number: 79,
    arName: "النازعات",
    enName: "An-Naziat",
    meaning: "Those Who Drag Forth",
    numberOfAyahs: 46,
    revelationType: "Meccan"
  },
  { number: 80, arName: "عبس", enName: "Abasa", meaning: "He Frowned", numberOfAyahs: 42, revelationType: "Meccan" },
  {
    number: 81,
    arName: "التكوير",
    enName: "At-Takwir",
    meaning: "The Overthrowing",
    numberOfAyahs: 29,
    revelationType: "Meccan"
  },
  {
    number: 82,
    arName: "الانفطار",
    enName: "Al-Infitar",
    meaning: "The Cleaving",
    numberOfAyahs: 19,
    revelationType: "Meccan"
  },
  {
    number: 83,
    arName: "المطففين",
    enName: "Al-Mutaffifin",
    meaning: "The Defrauding",
    numberOfAyahs: 36,
    revelationType: "Meccan"
  },
  {
    number: 84,
    arName: "الانشقاق",
    enName: "Al-Inshiqaq",
    meaning: "The Sundering",
    numberOfAyahs: 25,
    revelationType: "Meccan"
  },
  {
    number: 85,
    arName: "البروج",
    enName: "Al-Buruj",
    meaning: "The Mansions of the Stars",
    numberOfAyahs: 22,
    revelationType: "Meccan"
  },
  {
    number: 86,
    arName: "الطارق",
    enName: "At-Tariq",
    meaning: "The Night-Comer",
    numberOfAyahs: 17,
    revelationType: "Meccan"
  },
  {
    number: 87,
    arName: "الأعلى",
    enName: "Al-Ala",
    meaning: "The Most High",
    numberOfAyahs: 19,
    revelationType: "Meccan"
  },
  {
    number: 88,
    arName: "الغاشية",
    enName: "Al-Ghashiyah",
    meaning: "The Overwhelming",
    numberOfAyahs: 26,
    revelationType: "Meccan"
  },
  { number: 89, arName: "الفجر", enName: "Al-Fajr", meaning: "The Dawn", numberOfAyahs: 30, revelationType: "Meccan" },
  { number: 90, arName: "البلد", enName: "Al-Balad", meaning: "The City", numberOfAyahs: 20, revelationType: "Meccan" },
  { number: 91, arName: "الشمس", enName: "Ash-Shams", meaning: "The Sun", numberOfAyahs: 15, revelationType: "Meccan" },
  { number: 92, arName: "الليل", enName: "Al-Layl", meaning: "The Night", numberOfAyahs: 21, revelationType: "Meccan" },
  {
    number: 93,
    arName: "الضحى",
    enName: "Ad-Duha",
    meaning: "The Morning Hours",
    numberOfAyahs: 11,
    revelationType: "Meccan"
  },
  {
    number: 94,
    arName: "الشرح",
    enName: "Ash-Sharh",
    meaning: "The Relief",
    numberOfAyahs: 8,
    revelationType: "Meccan"
  },
  { number: 95, arName: "التين", enName: "At-Tin", meaning: "The Fig", numberOfAyahs: 8, revelationType: "Meccan" },
  { number: 96, arName: "العلق", enName: "Al-Alaq", meaning: "The Clot", numberOfAyahs: 19, revelationType: "Meccan" },
  { number: 97, arName: "القدر", enName: "Al-Qadr", meaning: "The Power", numberOfAyahs: 5, revelationType: "Meccan" },
  {
    number: 98,
    arName: "البينة",
    enName: "Al-Bayyinah",
    meaning: "The Clear Proof",
    numberOfAyahs: 8,
    revelationType: "Medinan"
  },
  {
    number: 99,
    arName: "الزلزلة",
    enName: "Az-Zalzalah",
    meaning: "The Earthquake",
    numberOfAyahs: 8,
    revelationType: "Medinan"
  },
  {
    number: 100,
    arName: "العاديات",
    enName: "Al-Adiyat",
    meaning: "The Courser",
    numberOfAyahs: 11,
    revelationType: "Meccan"
  },
  {
    number: 101,
    arName: "القارعة",
    enName: "Al-Qariah",
    meaning: "The Calamity",
    numberOfAyahs: 11,
    revelationType: "Meccan"
  },
  {
    number: 102,
    arName: "التكاثر",
    enName: "At-Takathur",
    meaning: "The Rivalry in World Increase",
    numberOfAyahs: 8,
    revelationType: "Meccan"
  },
  {
    number: 103,
    arName: "العصر",
    enName: "Al-Asr",
    meaning: "The Declining Day",
    numberOfAyahs: 3,
    revelationType: "Meccan"
  },
  {
    number: 104,
    arName: "الهمزة",
    enName: "Al-Humazah",
    meaning: "The Traducer",
    numberOfAyahs: 9,
    revelationType: "Meccan"
  },
  {
    number: 105,
    arName: "الفيل",
    enName: "Al-Fil",
    meaning: "The Elephant",
    numberOfAyahs: 5,
    revelationType: "Meccan"
  },
  { number: 106, arName: "قريش", enName: "Quraysh", meaning: "Quraysh", numberOfAyahs: 4, revelationType: "Meccan" },
  {
    number: 107,
    arName: "الماعون",
    enName: "Al-Maun",
    meaning: "The Small Kindnesses",
    numberOfAyahs: 7,
    revelationType: "Meccan"
  },
  {
    number: 108,
    arName: "الكوثر",
    enName: "Al-Kawthar",
    meaning: "The Abundance",
    numberOfAyahs: 3,
    revelationType: "Meccan"
  },
  {
    number: 109,
    arName: "الكافرون",
    enName: "Al-Kafirun",
    meaning: "The Disbelievers",
    numberOfAyahs: 6,
    revelationType: "Meccan"
  },
  {
    number: 110,
    arName: "النصر",
    enName: "An-Nasr",
    meaning: "The Divine Support",
    numberOfAyahs: 3,
    revelationType: "Medinan"
  },
  {
    number: 111,
    arName: "المسد",
    enName: "Al-Masad",
    meaning: "The Palm Fibre",
    numberOfAyahs: 5,
    revelationType: "Meccan"
  },
  {
    number: 112,
    arName: "الإخلاص",
    enName: "Al-Ikhlas",
    meaning: "The Sincerity",
    numberOfAyahs: 4,
    revelationType: "Meccan"
  },
  {
    number: 113,
    arName: "الفلق",
    enName: "Al-Falaq",
    meaning: "The Daybreak",
    numberOfAyahs: 5,
    revelationType: "Meccan"
  },
  { number: 114, arName: "الناس", enName: "An-Nas", meaning: "The Mankind", numberOfAyahs: 6, revelationType: "Meccan" }
];

export const SURAH_EXTRA = {
  1: {
    badge_pl: "Fard ✓",
    badge_en: "Obligatory ✓",
    tip_pl: "Recytowana w każdej rak'ah — bez niej modlitwa nieważna",
    tip_en: "Recited in every rak'ah — prayer invalid without it"
  },
  2: {
    badge_pl: "Ayat al-Kursi",
    badge_en: "Ayat al-Kursi",
    tip_pl: "Zawiera Ayat al-Kursi (2:255) — recytuj po każdej modlitwie",
    tip_en: "Contains Ayat al-Kursi (2:255) — recite after every prayer"
  },
  18: {
    badge_pl: "Piątek 🌙",
    badge_en: "Friday 🌙",
    tip_pl: "Recytuj co piątek — ochrona przed Dajjalem (Muslim 809)",
    tip_en: "Recite every Friday — protection from Dajjal (Muslim 809)"
  },
  36: {
    badge_pl: "Serce ♥",
    badge_en: "Heart ♥",
    tip_pl: "Ya-Sin — Serce Koranu (at-Tirmidhi 2812)",
    tip_en: "Ya-Sin — Heart of the Quran (at-Tirmidhi 2812)"
  },
  44: {
    badge_pl: "Noc piątku",
    badge_en: "Friday night",
    tip_pl: "Recytuj w nocy czwartku/piątku — wielka nagroda",
    tip_en: "Recite on Thursday/Friday night — great reward"
  },
  55: {
    badge_pl: "Oblubienica",
    badge_en: "Bride",
    tip_pl: "Az-Zahra — Oblubienica Koranu, 31× 'Które łaski Pana swego odrzucicie?'",
    tip_en: "Az-Zahra — Bride of the Quran, 31× 'Which favors of your Lord will you deny?'"
  },
  56: {
    badge_pl: "Bogactwo",
    badge_en: "Wealth",
    tip_pl: "Recytuj każdej nocy — chroni przed ubóstwem (Ibn Masud)",
    tip_en: "Recite every night — protects from poverty (Ibn Masud)"
  },
  67: {
    badge_pl: "Tarcza 🛡",
    badge_en: "Shield 🛡",
    tip_pl: "Al-Mulk — chroni przed karą grobu, recytuj przed snem (Abu Dawud 1400)",
    tip_en: "Al-Mulk — protects from grave punishment, recite before sleep (Abu Dawud 1400)"
  },
  110: {
    badge_pl: "Pożegnanie",
    badge_en: "Farewell",
    tip_pl: "Jedna z ostatnich objawień — Prorok ﷺ wiedział, że czas mu się kończy",
    tip_en: "One of the last revelations — the Prophet ﷺ knew his time was near"
  },
  112: {
    badge_pl: "1/3 Koranu",
    badge_en: "1/3 Quran",
    tip_pl: "Równoważna 1/3 Koranu w nagrodzie — recytuj 3× = cały Koran (Bukhari 5013)",
    tip_en: "Equivalent to 1/3 of the Quran in reward — recite 3× = whole Quran (Bukhari 5013)"
  },
  113: {
    badge_pl: "Schronienie",
    badge_en: "Refuge",
    tip_pl: "Al-Mu'awwidhatain — recytuj rano ×3, wieczorem ×3 (Abu Dawud 5082)",
    tip_en: "Al-Mu'awwidhatain — recite ×3 morning and evening (Abu Dawud 5082)"
  },
  114: {
    badge_pl: "Schronienie",
    badge_en: "Refuge",
    tip_pl: "Recytuj razem z Al-Falaq rano i wieczorem ×3",
    tip_en: "Recite together with Al-Falaq morning and evening ×3"
  }
};

export const ESSENTIAL_SURAHS = [1, 112, 113, 114, 67, 36, 55, 18, 2, 56];

export const HIFZ_SURAHS = [1, 112, 113, 114];

export const HIFZ_STATES = ["not-started", "in-progress", "memorized"];

export const SURAH_LENGTH_GROUPS = [
  { key: "xs", labelPl: "Bardzo krótkie (≤6)", labelEn: "Very short (≤6)", min: 1, max: 6 },
  { key: "short", labelPl: "Krótkie (7–12)", labelEn: "Short (7–12)", min: 7, max: 12 },
  { key: "smed", labelPl: "Krótko-średnie (13–20)", labelEn: "Short-medium (13–20)", min: 13, max: 20 },
  { key: "med", labelPl: "Średnie (21–50)", labelEn: "Medium (21–50)", min: 21, max: 50 },
  { key: "medlong", labelPl: "Średnio-długie (51–100)", labelEn: "Medium-long (51–100)", min: 51, max: 100 },
  { key: "long", labelPl: "Długie (>100)", labelEn: "Long (>100)", min: 101, max: 999 }
];

const duaMeta = (source_ref) => ({
  source_ref,
  source_type: "dua_collection",
  confidence: "VERIFIED",
  reviewed_at: "2026-05-29"
});

export const DUA_DATA = [
  {
    id: "bismillah",
    categoryPl: "Jedzenie",
    categoryEn: "Food",
    ar: "بِسْمِ اللَّهِ",
    tr: "Bismillah",
    pl: "Przed jedzeniem i piciem",
    en: "Before eating or drinking",
    ...duaMeta("Bukhari 5376; Muslim 2022")
  },
  {
    id: "after_eating",
    categoryPl: "Jedzenie",
    categoryEn: "Food",
    ar: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا وَرَزَقَنِيهِ",
    tr: "Alhamdu lillahil-ladhi at'amani hadha wa razaqanih",
    pl: "Po jedzeniu: wdzięczność za pożywienie",
    en: "After eating: gratitude for provision",
    ...duaMeta("Abu Dawud 4023; Tirmidhi 3458")
  },
  {
    id: "leaving_home",
    categoryPl: "Dom",
    categoryEn: "Home",
    ar: "بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
    tr: "Bismillah, tawakkaltu 'ala Allah, wa la hawla wa la quwwata illa billah",
    pl: "Wychodząc z domu",
    en: "When leaving home",
    ...duaMeta("Abu Dawud 5095; Tirmidhi 3426")
  },
  {
    id: "entering_home",
    categoryPl: "Dom",
    categoryEn: "Home",
    ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلَجِ وَخَيْرَ الْمَخْرَجِ",
    tr: "Allahumma inni as'aluka khayral-mawlaji wa khayral-makhraj",
    pl: "Wchodząc do domu",
    en: "When entering home",
    ...duaMeta("Abu Dawud 5096")
  },
  {
    id: "morning",
    categoryPl: "Adhkar poranne",
    categoryEn: "Morning adhkar",
    ar: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
    tr: "Asbahna wa asbahal-mulku lillah",
    pl: "Poranne wspomnienie: nastał ranek i królestwo należy do Allaha",
    en: "Morning remembrance: we entered morning and dominion belongs to Allah",
    ...duaMeta("Muslim 2723")
  },
  {
    id: "morning_life",
    categoryPl: "Adhkar poranne",
    categoryEn: "Morning adhkar",
    ar: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    tr: "Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilaykan-nushur",
    pl: "Poranne oddanie dnia Allahowi",
    en: "Morning entrusting the day to Allah",
    ...duaMeta("Abu Dawud 5068; Tirmidhi 3391")
  },
  {
    id: "morning_protection",
    categoryPl: "Adhkar poranne",
    categoryEn: "Morning adhkar",
    ar: "قُلْ هُوَ اللَّهُ أَحَدٌ، قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    tr: "Qul Huwa Allahu Ahad; Qul a'udhu bi-rabbil-falaq; Qul a'udhu bi-rabbin-nas",
    pl: "Trzy ostatnie sury rano po 3 razy",
    en: "The last three surahs in the morning, three times",
    ...duaMeta("Abu Dawud 5082")
  },
  {
    id: "evening",
    categoryPl: "Adhkar wieczorne",
    categoryEn: "Evening adhkar",
    ar: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
    tr: "Amsayna wa amsal-mulku lillah",
    pl: "Wieczorne wspomnienie: nastał wieczór i królestwo należy do Allaha",
    en: "Evening remembrance: we entered evening and dominion belongs to Allah",
    ...duaMeta("Muslim 2723")
  },
  {
    id: "evening_life",
    categoryPl: "Adhkar wieczorne",
    categoryEn: "Evening adhkar",
    ar: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
    tr: "Allahumma bika amsayna wa bika asbahna wa bika nahya wa bika namutu wa ilaykal-masir",
    pl: "Wieczorne oddanie nocy Allahowi",
    en: "Evening entrusting the night to Allah",
    ...duaMeta("Abu Dawud 5068; Tirmidhi 3391")
  },
  {
    id: "evening_protection",
    categoryPl: "Adhkar wieczorne",
    categoryEn: "Evening adhkar",
    ar: "قُلْ هُوَ اللَّهُ أَحَدٌ، قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ، قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
    tr: "Qul Huwa Allahu Ahad; Qul a'udhu bi-rabbil-falaq; Qul a'udhu bi-rabbin-nas",
    pl: "Trzy ostatnie sury wieczorem po 3 razy",
    en: "The last three surahs in the evening, three times",
    ...duaMeta("Abu Dawud 5082")
  },
  {
    id: "sleeping",
    categoryPl: "Sen",
    categoryEn: "Sleep",
    ar: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا",
    tr: "Bismika Allahumma amutu wa ahya",
    pl: "Przed snem",
    en: "Before sleeping",
    ...duaMeta("Bukhari 6324")
  },
  {
    id: "waking",
    categoryPl: "Sen",
    categoryEn: "Sleep",
    ar: "الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ",
    tr: "Alhamdu lillahil-ladhi ahyana ba'da ma amatana wa ilayhin-nushur",
    pl: "Po przebudzeniu",
    en: "Upon waking",
    ...duaMeta("Bukhari 6312")
  },
  {
    id: "travel",
    categoryPl: "Podróż",
    categoryEn: "Travel",
    ar: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ",
    tr: "Subhana alladhi sakhkhara lana hadha wa ma kunna lahu muqrinin wa inna ila rabbina lamunqalibun",
    pl: "Dua w podróży",
    en: "Travel dua",
    ...duaMeta("Quran 43:13-14; Muslim 1342")
  },
  {
    id: "forgiveness",
    categoryPl: "Istighfar",
    categoryEn: "Forgiveness",
    ar: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
    tr: "Astaghfirullaha wa atubu ilayh",
    pl: "Krótka prośba o przebaczenie",
    en: "Short request for forgiveness",
    ...duaMeta("Bukhari 6307")
  },
  {
    id: "sayyid_istighfar",
    categoryPl: "Istighfar",
    categoryEn: "Forgiveness",
    ar: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ",
    tr: "Allahumma anta rabbi la ilaha illa anta khalaqtani wa ana 'abduk",
    pl: "Sayyid al-Istighfar: najpełniejsza prośba o przebaczenie",
    en: "Sayyid al-Istighfar: the master supplication for forgiveness",
    ...duaMeta("Bukhari 6306")
  },
  {
    id: "anxiety",
    categoryPl: "Smutek i troska",
    categoryEn: "Hardship",
    ar: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ",
    tr: "Allahumma inni a'udhu bika minal-hammi wal-hazan",
    pl: "Dua przy smutku, trosce i trudnościach",
    en: "Dua for anxiety, grief and hardship",
    ...duaMeta("Bukhari 6369")
  },
  {
    id: "yunus",
    categoryPl: "Smutek i troska",
    categoryEn: "Hardship",
    ar: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    tr: "La ilaha illa anta subhanaka inni kuntu minaz-zalimin",
    pl: "Dua Yunusa w trudności",
    en: "Dua of Yunus in hardship",
    ...duaMeta("Quran 21:87; Tirmidhi 3505")
  },
  {
    id: "parents",
    categoryPl: "Rodzina",
    categoryEn: "Family",
    ar: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
    tr: "Rabbi irhamhuma kama rabbayani saghira",
    pl: "Dua za rodziców",
    en: "Dua for parents",
    ...duaMeta("Quran 17:24")
  },
  {
    id: "spouse_family",
    categoryPl: "Rodzina",
    categoryEn: "Family",
    ar: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ",
    tr: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yun",
    pl: "Dua za rodzinę i potomstwo",
    en: "Dua for family and offspring",
    ...duaMeta("Quran 25:74")
  },
  {
    id: "knowledge",
    categoryPl: "Wiedza",
    categoryEn: "Knowledge",
    ar: "رَبِّ زِدْنِي عِلْمًا",
    tr: "Rabbi zidni 'ilma",
    pl: "Panie, pomnóż moją wiedzę",
    en: "My Lord, increase me in knowledge",
    ...duaMeta("Quran 20:114")
  },
  {
    id: "good_end",
    categoryPl: "Codzienne",
    categoryEn: "Daily",
    ar: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    tr: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar",
    pl: "Dobro na tym świecie i w życiu wiecznym",
    en: "Good in this world and the next",
    ...duaMeta("Quran 2:201")
  },
  {
    id: "heart",
    categoryPl: "Serce",
    categoryEn: "Heart",
    ar: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا",
    tr: "Rabbana la tuzigh qulubana ba'da idh hadaytana",
    pl: "O stabilność serca po prowadzeniu",
    en: "For steadiness of the heart after guidance",
    ...duaMeta("Quran 3:8")
  },
  {
    id: "after_salah_subhanallah",
    categoryPl: "Po salah",
    categoryEn: "After salah",
    ar: "سُبْحَانَ اللَّهِ",
    tr: "Subhanallah",
    pl: "Po modlitwie: 33 razy Subhanallah",
    en: "After prayer: Subhanallah 33 times",
    ...duaMeta("Bukhari 843; Muslim 595")
  },
  {
    id: "after_salah_alhamdulillah",
    categoryPl: "Po salah",
    categoryEn: "After salah",
    ar: "الْحَمْدُ لِلَّهِ",
    tr: "Alhamdulillah",
    pl: "Po modlitwie: 33 razy Alhamdulillah",
    en: "After prayer: Alhamdulillah 33 times",
    ...duaMeta("Bukhari 843; Muslim 595")
  },
  {
    id: "after_salah_allahuakbar",
    categoryPl: "Po salah",
    categoryEn: "After salah",
    ar: "اللَّهُ أَكْبَرُ",
    tr: "Allahu Akbar",
    pl: "Po modlitwie: 34 razy Allahu Akbar",
    en: "After prayer: Allahu Akbar 34 times",
    ...duaMeta("Bukhari 843; Muslim 595")
  },
  {
    id: "after_salah_ayat_kursi",
    categoryPl: "Po salah",
    categoryEn: "After salah",
    ar: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
    tr: "Allahu la ilaha illa huwal-hayyul-qayyum",
    pl: "Ayat al-Kursi po modlitwie",
    en: "Ayat al-Kursi after prayer",
    ...duaMeta("Quran 2:255; Nasai al-Kubra 9848")
  },
  {
    id: "ramadan_iftar",
    categoryPl: "Ramadan",
    categoryEn: "Ramadan",
    ar: "ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ",
    tr: "Dhahaba az-zama'u wabtallatil-'uruqu wa thabatal-ajru in sha Allah",
    pl: "Dua przy iftar",
    en: "Iftar dua",
    ...duaMeta("Abu Dawud 2357")
  },
  {
    id: "ramadan_qadr",
    categoryPl: "Ramadan",
    categoryEn: "Ramadan",
    ar: "اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
    tr: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
    pl: "Dua Laylat al-Qadr",
    en: "Laylat al-Qadr dua",
    ...duaMeta("Tirmidhi 3513")
  },
  {
    id: "market",
    categoryPl: "Okazje",
    categoryEn: "Occasions",
    ar: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ",
    tr: "La ilaha illa Allah wahdahu la sharika lah",
    pl: "Dhikr przy wejściu na targ/miejsce handlu",
    en: "Dhikr when entering the marketplace",
    ...duaMeta("Tirmidhi 3428")
  },
  {
    id: "clothing",
    categoryPl: "Okazje",
    categoryEn: "Occasions",
    ar: "الْحَمْدُ لِلَّهِ الَّذِي كَسَانِي هَذَا",
    tr: "Alhamdu lillahil-ladhi kasani hadha",
    pl: "Zakładając ubranie",
    en: "When putting on clothing",
    ...duaMeta("Abu Dawud 4023")
  },
  {
    id: "sneezing",
    categoryPl: "Okazje",
    categoryEn: "Occasions",
    ar: "الْحَمْدُ لِلَّهِ",
    tr: "Alhamdulillah",
    pl: "Po kichnięciu",
    en: "After sneezing",
    ...duaMeta("Bukhari 6224")
  },
  {
    id: "rain",
    categoryPl: "Okazje",
    categoryEn: "Occasions",
    ar: "اللَّهُمَّ صَيِّبًا نَافِعًا",
    tr: "Allahumma sayyiban nafi'a",
    pl: "Gdy pada deszcz",
    en: "When rain falls",
    ...duaMeta("Bukhari 1032")
  },
  {
    id: "mosque_enter",
    categoryPl: "Meczet",
    categoryEn: "Mosque",
    ar: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    tr: "Allahumma iftah li abwaba rahmatik",
    pl: "Wchodząc do meczetu",
    en: "Entering the mosque",
    ...duaMeta("Muslim 713")
  },
  {
    id: "mosque_exit",
    categoryPl: "Meczet",
    categoryEn: "Mosque",
    ar: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
    tr: "Allahumma inni as'aluka min fadlik",
    pl: "Wychodząc z meczetu",
    en: "Leaving the mosque",
    ...duaMeta("Muslim 713")
  }
];

export const DUA_SOURCE_MAP = {
  ...Object.fromEntries(DUA_DATA.map((dua) => [dua.id, dua.source_ref]))
};
