// Visual metadata for Prayer Mode positions.

const qiyamTips = {
  pl: ["Stań spokojnie.", "Wzrok w miejsce sujud.", "Ręce blisko ciała."],
  en: ["Stand calmly.", "Look toward the place of sujud.", "Keep the hands close."]
};

export const PRAYER_STEP_VISUALS = {
  intro: {
    posture: "qiyam",
    labelPl: "Ustawienie do modlitwy",
    labelEn: "Setting up for prayer",
    tips: qiyamTips
  },
  qiyam: {
    posture: "qiyam",
    labelPl: "Qiyam - stanie",
    labelEn: "Qiyam - standing",
    tips: qiyamTips
  },
  takbir: {
    posture: "takbir",
    labelPl: "Takbir - dłonie w górę",
    labelEn: "Takbir - hands raised",
    tips: {
      pl: ["Podnieś dłonie.", "Powiedz Allahu Akbar.", "Potem prawa dłoń na lewą."],
      en: ["Raise the hands.", "Say Allahu Akbar.", "Then right hand over left."]
    }
  },
  fatiha: {
    posture: "qiyam",
    labelPl: "Recytacja w pozycji stojącej",
    labelEn: "Recitation while standing",
    tips: {
      pl: ["Czytaj powoli.", "Nie śpiesz się.", "Na początku możesz patrzeć w tekst."],
      en: ["Read slowly.", "Do not rush.", "At first you may look at the text."]
    }
  },
  "short-surah": {
    posture: "qiyam",
    labelPl: "Krótka sura po Al-Fatiha",
    labelEn: "Short surah after Al-Fatiha",
    tips: {
      pl: ["Zostań w qiyam.", "Wybierz krótką surę.", "Dla początkujących: Al-Ikhlas."],
      en: ["Stay in qiyam.", "Choose a short surah.", "For beginners: Al-Ikhlas."]
    }
  },
  ruku: {
    posture: "ruku",
    labelPl: "Ruku - skłon",
    labelEn: "Ruku - bowing",
    tips: {
      pl: ["Dłonie na kolanach.", "Plecy możliwie prosto.", "Nie napinaj się przesadnie."],
      en: ["Hands on knees.", "Back as straight as possible.", "Do not overstrain."]
    }
  },
  rise: {
    posture: "qiyam",
    labelPl: "Powrót do stania",
    labelEn: "Rising to standing",
    tips: {
      pl: ["Wróć spokojnie.", "Stań prosto.", "Wypowiedz pochwałę."],
      en: ["Rise calmly.", "Stand upright.", "Say the praise."]
    }
  },
  sujud1: {
    posture: "sujud",
    labelPl: "Sujud - pokłon",
    labelEn: "Sujud - prostration",
    tips: {
      pl: ["Czoło i nos do ziemi.", "Dłonie przy głowie.", "Kolana i palce stóp oparte."],
      en: ["Forehead and nose to the ground.", "Hands near the head.", "Knees and toes grounded."]
    }
  },
  sit: {
    posture: "sit",
    labelPl: "Siedzenie między sujud",
    labelEn: "Sitting between sujud",
    tips: {
      pl: ["Usiądź spokojnie.", "Zrób krótką pauzę.", "Poproś o przebaczenie."],
      en: ["Sit calmly.", "Pause briefly.", "Ask for forgiveness."]
    }
  },
  sujud2: {
    posture: "sujud",
    labelPl: "Drugi sujud",
    labelEn: "Second sujud",
    tips: {
      pl: ["Powtórz pozycję.", "Nie śpiesz ruchu.", "Skup się na dua."],
      en: ["Repeat the posture.", "Do not rush the movement.", "Focus on dua."]
    }
  },
  "next-rakah": {
    posture: "qiyam",
    labelPl: "Wstań do kolejnej raka'at",
    labelEn: "Stand for the next raka'ah",
    tips: {
      pl: ["Wstań spokojnie.", "Powtórz kolejność.", "Aplikacja prowadzi dalej."],
      en: ["Stand calmly.", "Repeat the order.", "The app keeps guiding you."]
    }
  },
  tashahhud: {
    posture: "sit",
    labelPl: "Tashahhud - siedzenie",
    labelEn: "Tashahhud - sitting",
    tips: {
      pl: ["Usiądź stabilnie.", "Ucz się po fragmencie.", "Nie musisz znać całości od razu."],
      en: ["Sit steadily.", "Learn piece by piece.", "You do not need the whole text at once."]
    }
  },
  salam: {
    posture: "salam",
    labelPl: "Salam - zakończenie",
    labelEn: "Salam - closing",
    tips: {
      pl: ["Głowa w prawo.", "Potem w lewo.", "Modlitwa zakończona."],
      en: ["Head to the right.", "Then to the left.", "Prayer is complete."]
    }
  }
};
