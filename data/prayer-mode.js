// Static Prayer Mode content and configuration.

export const PRAYER_GUIDE_PRAYERS = [
  { id: "fajr", pl: "Fadżr", en: "Fajr", rakat: 2 },
  { id: "dhuhr", pl: "Dhuhr", en: "Dhuhr", rakat: 4 },
  { id: "asr", pl: "Asr", en: "Asr", rakat: 4 },
  { id: "maghrib", pl: "Maghrib", en: "Maghrib", rakat: 3 },
  { id: "isha", pl: "Isza", en: "Isha", rakat: 4 }
];

export const PRAYER_GUIDE_CORE_STEPS = [
  {
    id: "intro",
    titlePl: "Start i intencja",
    titleEn: "Start and intention",
    bodyPl:
      "Stań spokojnie twarzą w stronę Qibla. W sercu wiesz, którą modlitwę wykonujesz. Nie musisz wypowiadać intencji na głos.",
    bodyEn:
      "Stand calmly facing the Qibla. In your heart, know which prayer you are praying. You do not need to say the intention out loud.",
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
    bodyEn:
      "Raise your hands near your ears or shoulders and say Allahu Akbar. Then place your right hand over your left.",
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

export const PRAYER_LOCATIONS = [
  { id: "makkah", label: "Makkah", city: "Makkah", tz: "Asia/Riyadh", lat: "21.3891", lng: "39.8579", method: 4 },
  { id: "madinah", label: "Madinah", city: "Madinah", tz: "Asia/Riyadh", lat: "24.4672", lng: "39.6111", method: 4 }
];

export const PRAYER_NAMES = ["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"];

export const PRAYER_NAMES_PL = ["Fadżr", "Wschód", "Dhuhr", "Asr", "Maghrib", "Isza"];

export const OBLIGATORY_PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

export const OBLIGATORY_PRAYERS_PL = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isza"];

export const PRAYER_MODE_TABS = [
  { id: "today", pl: "Dzisiaj", en: "Today" },
  { id: "guide", pl: "Przewodnik", en: "Guide" },
  { id: "wudu", pl: "Wudu", en: "Wudu" },
  { id: "qibla", pl: "Qibla/Czasy", en: "Qibla/Times" },
  { id: "history", pl: "Historia", en: "History" }
];

export const WUDU_STEPS = [
  { id: "intention", pl: "Intencja w sercu i spokojny start.", en: "Intention in the heart and a calm start." },
  { id: "hands", pl: "Umyj dłonie trzy razy.", en: "Wash the hands three times." },
  { id: "mouth-nose", pl: "Przepłucz usta i nos.", en: "Rinse the mouth and nose." },
  { id: "face", pl: "Umyj twarz.", en: "Wash the face." },
  { id: "arms", pl: "Umyj ręce do łokci.", en: "Wash the arms up to the elbows." },
  { id: "head", pl: "Przetrzyj głowę i uszy.", en: "Wipe the head and ears." },
  { id: "feet", pl: "Umyj stopy do kostek.", en: "Wash the feet up to the ankles." }
];
