// Static Prayer Mode content and configuration.

const REVIEWED_AT = "2026-05-29";
const verified = { source_type: "quran_hadith", confidence: "VERIFIED", reviewed_at: REVIEWED_AT };
const contextDependent = { source_type: "fiqh_context", confidence: "CONTEXT_DEPENDENT", reviewed_at: REVIEWED_AT };

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
    bodyPl:
      "Powiedz Allahu Akbar i pochyl się, opierając dłonie na kolanach. Plecy trzymaj możliwie prosto, łokcie lekko od ciała, głowę w linii pleców.",
    bodyEn:
      "Say Allahu Akbar and bow, placing your hands on your knees. Keep your back as straight as you can, elbows slightly away and head aligned with the back.",
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
    bodyPl:
      "Powiedz Allahu Akbar i przejdź do pokłonu. Czoło, nos, dłonie, kolana i palce stóp dotykają ziemi; dłonie są przy głowie, a palce stóp skierowane do Qibla.",
    bodyEn:
      "Say Allahu Akbar and go down. Forehead, nose, hands, knees and toes touch the ground; hands are near the head and toes face the Qibla.",
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
    bodyPl:
      "Po ostatniej raka'at usiądź. To pełny tashahhud w najczęściej uczonej formie; ucz się go spokojnie, zdanie po zdaniu.",
    bodyEn:
      "After the final raka'ah, sit. This is the full tashahhud in a commonly taught form; learn it calmly, phrase by phrase.",
    ar: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ\nالسَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ\nالسَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ\nأَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    tr: "At-tahiyyatu lillahi was-salawatu wat-tayyibat. As-salamu 'alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh. As-salamu 'alayna wa 'ala 'ibadillahis-salihin. Ashhadu an la ilaha illa Allah wa ashhadu anna Muhammadan 'abduhu wa rasuluh.",
    meaningPl:
      "Pozdrowienia, modlitwy i dobre rzeczy należą do Allaha. Pokój Prorokowi, nam i prawym sługom Allaha. Świadczę, że nie ma boga prócz Allaha i że Muhammad jest Jego sługą i posłańcem.",
    meaningEn:
      "Greetings, prayers and good things belong to Allah. Peace be upon the Prophet, upon us and upon Allah's righteous servants. I bear witness there is no god but Allah and Muhammad is His servant and messenger."
  },
  {
    id: "salawat",
    titlePl: "Salawat Ibrahimiyyah",
    titleEn: "Salawat Ibrahimiyyah",
    bodyPl: "Po tashahhudzie wyślij salawat na Proroka ﷺ. Na początku możesz uczyć się krótszymi fragmentami.",
    bodyEn: "After tashahhud, send blessings upon the Prophet ﷺ. At first, you may learn it in shorter parts.",
    ar: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ\nكَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ\nإِنَّكَ حَمِيدٌ مَجِيدٌ\nاللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ\nكَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ\nإِنَّكَ حَمِيدٌ مَجِيدٌ",
    tr: "Allahumma salli 'ala Muhammad wa 'ala ali Muhammad, kama sallayta 'ala Ibrahim wa 'ala ali Ibrahim, innaka hamidun majid. Allahumma barik 'ala Muhammad wa 'ala ali Muhammad, kama barakta 'ala Ibrahim wa 'ala ali Ibrahim, innaka hamidun majid.",
    meaningPl:
      "O Allahu, obdarz błogosławieństwem Muhammada i rodzinę Muhammada, jak obdarzyłeś Ibrahima i rodzinę Ibrahima. Zaprawdę jesteś Godny Chwały, Pełen Majestatu.",
    meaningEn:
      "O Allah, send blessings upon Muhammad and the family of Muhammad as You sent blessings upon Ibrahim and the family of Ibrahim. You are Praiseworthy, Majestic."
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
  { id: "adhkar", pl: "Po salah", en: "After salah" },
  { id: "sunnah", pl: "Sunna i podróż", en: "Sunnah & travel" },
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

export const WUDU_INVALIDATORS = [
  {
    id: "toilet",
    pl: "Oddanie moczu, stolca lub gazów.",
    en: "Passing urine, stool or wind.",
    source_ref: "Quran 5:6; Bukhari 135",
    ...verified
  },
  {
    id: "deep-sleep",
    pl: "Głęboki sen, w którym traci się kontrolę i świadomość.",
    en: "Deep sleep in which awareness and control are lost.",
    source_ref: "Abu Dawud 203",
    ...contextDependent
  },
  {
    id: "unconscious",
    pl: "Utrata przytomności, omdlenie lub stan podobny.",
    en: "Loss of consciousness, fainting or a similar state.",
    source_ref: "general fiqh",
    ...contextDependent
  },
  {
    id: "major-impurity",
    pl: "Stan wymagający ghusl, np. po współżyciu.",
    en: "A state requiring ghusl, such as after marital intimacy.",
    source_ref: "Quran 5:6",
    ...verified
  }
];

export const GHUSL_GUIDE = {
  when: [
    {
      id: "janabah",
      pl: "Po współżyciu lub wytrysku.",
      en: "After marital intimacy or ejaculation.",
      source_ref: "Quran 5:6",
      ...verified
    },
    {
      id: "menses",
      pl: "Po zakończeniu miesiączki lub krwawienia poporodowego.",
      en: "After menstruation or postnatal bleeding ends.",
      source_ref: "Quran 2:222",
      ...verified
    },
    {
      id: "conversion",
      pl: "Wielu uczonych zaleca ghusl po przyjęciu islamu; zapytaj lokalnie, jeśli masz wątpliwość.",
      en: "Many scholars recommend ghusl after accepting Islam; ask locally if unsure.",
      source_ref: "Tirmidhi 605; fiqh discussion",
      ...contextDependent
    }
  ],
  steps: [
    {
      id: "intention",
      pl: "Intencja w sercu, że wykonujesz ghusl.",
      en: "Intention in the heart that you are performing ghusl."
    },
    {
      id: "wash-private",
      pl: "Umycie miejsc intymnych i usunięcie nieczystości.",
      en: "Wash private areas and remove impurity."
    },
    { id: "wudu", pl: "Wykonanie wudu.", en: "Perform wudu." },
    {
      id: "whole-body",
      pl: "Oblanie całego ciała wodą, tak aby dotarła do skóry i włosów.",
      en: "Wash the whole body so water reaches the skin and hair."
    }
  ],
  practicalDifference: {
    pl: "Wudu to małe obmycie przed modlitwą. Ghusl to pełne obmycie po stanie większej nieczystości; po poprawnym ghusl możesz się modlić.",
    en: "Wudu is the minor washing before prayer. Ghusl is the full washing after major ritual impurity; after a valid ghusl you may pray."
  }
};

export const PRAYER_AFTER_SALAH_ADHKAR = [
  {
    id: "astaghfirullah",
    ar: "أَسْتَغْفِرُ اللَّهَ",
    tr: "Astaghfirullah",
    pl: "Po salam: powiedz 3 razy «Proszę Allaha o przebaczenie».",
    en: "After salam: say three times, 'I ask Allah for forgiveness.'",
    source_ref: "Muslim 591",
    ...verified
  },
  {
    id: "allahumma-salam",
    ar: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ",
    tr: "Allahumma antas-salam wa minkas-salam",
    pl: "O Allahu, Ty jesteś Pokojem i od Ciebie pochodzi pokój.",
    en: "O Allah, You are Peace and from You comes peace.",
    source_ref: "Muslim 591",
    ...verified
  },
  {
    id: "tasbih",
    ar: "سُبْحَانَ اللَّهِ ٣٣ · الْحَمْدُ لِلَّهِ ٣٣ · اللَّهُ أَكْبَرُ ٣٤",
    tr: "Subhanallah 33 · Alhamdulillah 33 · Allahu Akbar 34",
    pl: "Tasbih po modlitwie: 33, 33 i 34.",
    en: "Tasbih after prayer: 33, 33 and 34.",
    source_ref: "Bukhari 843; Muslim 595",
    ...verified
  },
  {
    id: "ayat-kursi",
    ar: "آيَةُ الْكُرْسِي",
    tr: "Ayat al-Kursi",
    pl: "Recytacja Ayat al-Kursi po modlitwie jest znaną praktyką w adhkar.",
    en: "Reciting Ayat al-Kursi after prayer is a known practice in adhkar.",
    source_ref: "Quran 2:255; Nasai al-Kubra 9848",
    ...verified
  }
];

export const PRAYER_SUNNAH_TRAVEL = {
  rawatib: [
    { id: "fajr", pl: "2 raka'at przed Fajr.", en: "2 raka'at before Fajr.", source_ref: "Muslim 725", ...verified },
    {
      id: "dhuhr",
      pl: "4 przed Dhuhr i 2 po Dhuhr według często uczonego układu.",
      en: "4 before Dhuhr and 2 after Dhuhr in a commonly taught pattern.",
      source_ref: "Tirmidhi 415",
      ...contextDependent
    },
    {
      id: "maghrib",
      pl: "2 raka'at po Maghrib.",
      en: "2 raka'at after Maghrib.",
      source_ref: "Bukhari 1180",
      ...verified
    },
    { id: "isha", pl: "2 raka'at po Isha.", en: "2 raka'at after Isha.", source_ref: "Bukhari 1180", ...verified }
  ],
  witr: {
    pl: "Witr to modlitwa nieparzysta po Isha, zwykle 1 lub 3 raka'at. W praktyce szczegóły różnią się między szkołami.",
    en: "Witr is the odd-numbered prayer after Isha, commonly 1 or 3 raka'at. Practical details differ between schools.",
    source_ref: "Bukhari 990; Muslim 749",
    ...contextDependent
  },
  travel: [
    {
      id: "qasr",
      pl: "W podróży Dhuhr, Asr i Isha mogą być skrócone z 4 do 2 raka'at.",
      en: "During travel, Dhuhr, Asr and Isha may be shortened from 4 to 2 raka'at.",
      source_ref: "Quran 4:101; Muslim 686",
      ...verified
    },
    {
      id: "jam",
      pl: "W podróży lub realnej trudności można łączyć Dhuhr z Asr oraz Maghrib z Isha.",
      en: "During travel or real hardship, Dhuhr may be combined with Asr and Maghrib with Isha.",
      source_ref: "Muslim 705",
      ...contextDependent
    },
    {
      id: "ask",
      pl: "Granice podróży i lokalna praktyka mogą się różnić, więc warto zapytać lokalnego imama.",
      en: "Travel thresholds and local practice can differ, so it is worth asking a local imam.",
      source_ref: "fiqh disagreement",
      ...contextDependent
    }
  ]
};
