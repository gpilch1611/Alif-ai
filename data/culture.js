export const CULTURE_REVIEWED_AT = "2026-06-03";

export const CULTURE_TABS = [
  {
    id: "situations",
    icon: "☕",
    titlePl: "Sytuacje",
    titleEn: "Situations",
    leadPl: "Codzienne sytuacje z różnych wspólnot muzułmańskich.",
    leadEn: "Everyday situations from different Muslim communities."
  },
  {
    id: "boundaries",
    icon: "⚖",
    titlePl: "Kultura vs religia",
    titleEn: "Culture vs religion",
    leadPl: "Co jest praktyką religijną, co zwyczajem, a co zależy od miejsca.",
    leadEn: "What is religious practice, what is custom, and what depends on place."
  },
  {
    id: "ummah",
    icon: "🌍",
    titlePl: "Ummah",
    titleEn: "Ummah",
    leadPl: "Islam jest globalny: wiele języków, domów, kuchni i historii.",
    leadEn: "Islam is global: many languages, homes, cuisines and histories."
  },
  {
    id: "adab",
    icon: "🤝",
    titlePl: "Adab",
    titleEn: "Adab",
    leadPl: "Piękny sposób bycia: rozmowa, sąsiedztwo, rodzina i cierpliwość.",
    leadEn: "A beautiful way of being: speech, neighbours, family and patience."
  },
  {
    id: "home",
    icon: "✦",
    titlePl: "Dom i piękno",
    titleEn: "Home and beauty",
    leadPl: "Sztuka, dźwięk, święta i małe gesty, które budują klimat wiary.",
    leadEn: "Art, sound, celebrations and small gestures that shape the feel of faith."
  }
];

export const CULTURE_KIND_LABELS = {
  religion: {
    pl: "religia",
    en: "religion",
    hintPl: "Podstawowy element islamu. Szczegóły są w sekcjach religijnych aplikacji.",
    hintEn: "A core part of Islam. Details live in the religious sections of the app."
  },
  custom: {
    pl: "zwyczaj",
    en: "custom",
    hintPl: "Popularny zwyczaj, nie warunek wiary.",
    hintEn: "A common custom, not a condition of faith."
  },
  local: {
    pl: "różni się lokalnie",
    en: "varies locally",
    hintPl: "Może wyglądać inaczej w różnych krajach i rodzinach.",
    hintEn: "It can look different across countries and families."
  },
  adab: {
    pl: "adab",
    en: "adab",
    hintPl: "Etykieta, takt i dobry charakter w praktyce.",
    hintEn: "Etiquette, tact and good character in practice."
  },
  ask: {
    pl: "zapytaj lokalnie",
    en: "ask locally",
    hintPl: "Przy decyzji osobistej warto zapytać zaufanego imama albo osoby z lokalnej wspólnoty.",
    hintEn: "For a personal decision, ask a trusted imam or someone in the local community."
  }
};

export const CULTURE_TOPICS = [
  {
    id: "first-mosque-visit",
    tab: "situations",
    kind: "custom",
    icon: "🕌",
    titlePl: "Pierwsza wizyta w meczecie",
    titleEn: "First mosque visit",
    bodyPl:
      "Meczet jest miejscem modlitwy, nauki i wspólnoty. Pierwsza wizyta nie musi być perfekcyjna: wystarczy spokój, skromny ubiór i gotowość zapytania, gdzie wejść.",
    bodyEn:
      "A mosque is a place for prayer, learning and community. The first visit does not need to be perfect: calm, modest clothing and willingness to ask where to enter are enough.",
    doPl: "Zapytaj spokojnie, gdzie zostawić buty i gdzie usiąść.",
    doEn: "Calmly ask where to leave your shoes and where to sit.",
    avoidPl: "Nie fotografuj ludzi podczas modlitwy bez ich zgody.",
    avoidEn: "Do not photograph people during prayer without their permission.",
    sourcePl: "żywa praktyka wspólnot",
    sourceEn: "living community practice",
    confidence: "CONTEXT_DEPENDENT",
    link: { route: "prayerGuide", labelPl: "Zobacz Prayer Mode", labelEn: "Open Prayer Mode" }
  },
  {
    id: "tea-before-answers",
    tab: "situations",
    kind: "custom",
    icon: "☕",
    titlePl: "Herbata zanim padną wielkie pytania",
    titleEn: "Tea before big questions",
    bodyPl:
      "W wielu domach gościnność zaczyna rozmowę zanim pojawia się temat wiary. Kawa, herbata albo daktyle mówią: jesteś mile widziany, usiądźmy spokojnie.",
    bodyEn:
      "In many homes, hospitality begins the conversation before faith is discussed. Coffee, tea or dates say: you are welcome, let us sit calmly.",
    doPl: "Przyjmij mały gest z wdzięcznością, nawet jeśli nie znasz wszystkich zwyczajów.",
    doEn: "Receive a small gesture with gratitude, even if you do not know every custom.",
    avoidPl: "Nie oceniaj całej religii po stylu jednego domu.",
    avoidEn: "Do not judge the whole religion by the style of one home.",
    sourcePl: "gościnność w kulturach muzułmańskich",
    sourceEn: "hospitality in Muslim cultures",
    confidence: "CONTEXT_DEPENDENT"
  },
  {
    id: "family-table-convert",
    tab: "situations",
    kind: "adab",
    icon: "🏠",
    titlePl: "Przy stole, gdy wiara staje się tematem",
    titleEn: "At the table when faith becomes a topic",
    bodyPl:
      "W wielu rodzinach rozmowa o religii najpierw budzi emocje. Kultura rozmowy jest tu ważna: mniej debaty, więcej spokoju i jasnego szacunku.",
    bodyEn:
      "In many families, speaking about religion brings emotion first. The culture of conversation matters here: less debate, more calm and clear respect.",
    doPl: "Użyj prostego zdania: chcę wyjaśnić spokojnie, bez zrywania więzi.",
    doEn: "Use a simple sentence: I want to explain calmly, without breaking bonds.",
    avoidPl: "Nie próbuj wygrać całej rozmowy podczas jednego obiadu.",
    avoidEn: "Do not try to win the whole conversation over one meal.",
    sourcePl: "rozmowy rodzinne i adab",
    sourceEn: "family conversation and adab",
    confidence: "CONTEXT_DEPENDENT",
    link: { route: "muallaf", labelPl: "Pierwsze kroki", labelEn: "First steps" }
  },
  {
    id: "eid-visit",
    tab: "situations",
    kind: "local",
    icon: "🎁",
    titlePl: "Eid u znajomych",
    titleEn: "Eid at friends' home",
    bodyPl:
      "Eid może wyglądać inaczej w każdym kraju i domu: słodycze, ryż, prezenty, telefon do rodziny albo skromne spotkanie po modlitwie.",
    bodyEn:
      "Eid can look different in every country and home: sweets, rice, gifts, a family call or a simple gathering after prayer.",
    doPl: "Powiedz Eid Mubarak i przyjmij lokalny styl bez presji porównywania.",
    doEn: "Say Eid Mubarak and receive the local style without pressure to compare.",
    avoidPl: "Nie zakładaj, że jeden sposób świętowania jest jedynym islamskim sposobem.",
    avoidEn: "Do not assume one celebration style is the only Islamic way.",
    sourcePl: "globalna praktyka muzułmańska",
    sourceEn: "global Muslim practice",
    confidence: "CONTEXT_DEPENDENT",
    link: { route: "calendar", labelPl: "Kalendarz islamski", labelEn: "Islamic calendar" }
  },
  {
    id: "five-prayers-boundary",
    tab: "boundaries",
    kind: "religion",
    icon: "🧎",
    titlePl: "Pięć modlitw to religia, nie lokalny zwyczaj",
    titleEn: "Five prayers are religion, not local custom",
    bodyPl:
      "Styl dywanu, melodie adhanu czy organizacja meczetu mogą być lokalne. Sama obowiązkowa modlitwa należy do fundamentów islamu.",
    bodyEn:
      "The carpet style, adhan melodies or mosque organisation may be local. The obligatory prayer itself belongs to Islam's foundations.",
    doPl: "Gdy temat dotyczy salat, przejdź do przewodnika modlitwy zamiast uczyć się z kulturowych skrótów.",
    doEn: "When the topic is salat, go to the prayer guide instead of learning from cultural shortcuts.",
    avoidPl: "Nie mieszaj braku znajomości lokalnego zwyczaju z błędem w religii.",
    avoidEn: "Do not confuse not knowing a local custom with making a religious mistake.",
    sourcePl: "podstawy islamu",
    sourceEn: "Islam basics",
    confidence: "VERIFIED",
    link: { route: "prayerGuide", labelPl: "Przewodnik salat", labelEn: "Salat guide" }
  },
  {
    id: "food-custom-halal",
    tab: "boundaries",
    kind: "ask",
    icon: "🍽",
    titlePl: "Jedzenie: zwyczaj stołu a halal",
    titleEn: "Food: table customs and halal",
    bodyPl:
      "To, czy rodzina podaje ryż, chleb, zupę albo daktyle, jest kulturą. To, czy jedzenie jest halal, należy do zasad religijnych i czasem wymaga pytania.",
    bodyEn:
      "Whether a family serves rice, bread, soup or dates is culture. Whether food is halal belongs to religious rules and sometimes requires asking.",
    doPl: "Pytaj łagodnie o składniki, bez zawstydzania gospodarza.",
    doEn: "Ask gently about ingredients without embarrassing the host.",
    avoidPl: "Nie rób publicznej lekcji fiqh przy stole.",
    avoidEn: "Do not turn the table into a public fiqh lesson.",
    sourcePl: "fiqh jedzenia i adab gościnności",
    sourceEn: "food fiqh and hospitality adab",
    confidence: "CONTEXT_DEPENDENT",
    link: { route: "halalharam", labelPl: "Halal & Haram", labelEn: "Halal & Haram" }
  },
  {
    id: "clothing-local-modesty",
    tab: "boundaries",
    kind: "local",
    icon: "🧕",
    titlePl: "Skromność ma zasady, stroje mają kultury",
    titleEn: "Modesty has principles, clothes have cultures",
    bodyPl:
      "Muzułmanie ubierają się różnie: Malezja, Turcja, Senegal, Indonezja czy Bośnia mają inne style. Warto odróżnić zasadę skromności od lokalnej estetyki.",
    bodyEn:
      "Muslims dress differently: Malaysia, Turkey, Senegal, Indonesia and Bosnia have different styles. It helps to separate modesty principles from local aesthetics.",
    doPl: "Patrz na sens: godność, skromność i komfort w danej sytuacji.",
    doEn: "Look at the purpose: dignity, modesty and comfort in the situation.",
    avoidPl: "Nie oceniaj czyjejś wiary po jednym kroju ubrania.",
    avoidEn: "Do not judge someone's faith by one clothing style.",
    sourcePl: "praktyka lokalnych wspólnot",
    sourceEn: "local community practice",
    confidence: "CONTEXT_DEPENDENT",
    link: { route: "islamfaq", labelPl: "FAQ o pytaniach rodziny", labelEn: "Family FAQ" }
  },
  {
    id: "christmas-family-line",
    tab: "boundaries",
    kind: "ask",
    icon: "🕯",
    titlePl: "Zaproszenia między religiami: kultura, wiara i granice",
    titleEn: "Interfaith invitations: culture, faith and boundaries",
    bodyPl:
      "W różnych krajach muzułmanie spotykają się z zaproszeniami na uroczystości rodzinne, narodowe albo religijne innych osób. Decyzje bywają delikatne i zależą od kontekstu.",
    bodyEn:
      "Across countries, Muslims may receive invitations to family, national or religious occasions of other people. Decisions can be delicate and depend on context.",
    doPl: "Oddziel życzliwą obecność od udziału w obrzędzie religijnym i zapytaj uczonego przy wątpliwościach.",
    doEn: "Separate kind presence from joining a religious rite, and ask a scholar when unsure.",
    avoidPl: "Nie używaj kultury jako wymówki do udawania przekonań.",
    avoidEn: "Do not use culture as an excuse to pretend belief.",
    sourcePl: "temat sporny i kontekstowy",
    sourceEn: "disputed and context-dependent topic",
    confidence: "SCHOLARLY_DISAGREEMENT",
    link: { route: "islamfaq", labelPl: "Zobacz FAQ islamu", labelEn: "Open Islam FAQ" }
  },
  {
    id: "indonesia-not-arab",
    tab: "ummah",
    kind: "local",
    icon: "🌏",
    titlePl: "Największy kraj muzułmański nie jest arabski",
    titleEn: "The largest Muslim country is not Arab",
    bodyPl:
      "Indonezja pomaga szybko zrozumieć ważną rzecz: islam ma język Koranu, ale nie należy do jednej kultury ani jednego narodu.",
    bodyEn:
      "Indonesia helps make one point clear: Islam has the language of the Quran, but it does not belong to one culture or one nation.",
    doPl: "Gdy słyszysz stereotyp 'islam = Arabowie', pamiętaj o Azji, Afryce, Europie i lokalnych wspólnotach.",
    doEn: "When you hear 'Islam = Arabs', remember Asia, Africa, Europe and local communities.",
    avoidPl: "Nie zamieniaj islamu w etniczną etykietę.",
    avoidEn: "Do not turn Islam into an ethnic label.",
    sourcePl: "demografia współczesnego islamu",
    sourceEn: "modern Muslim demographics",
    confidence: "VERIFIED",
    link: { route: "history", historyTab: "timeline", labelPl: "Historia globalna", labelEn: "Global history" }
  },
  {
    id: "local-muslim-language",
    tab: "ummah",
    kind: "local",
    icon: "🌐",
    titlePl: "Islam może mówić lokalnym językiem",
    titleEn: "Islam can speak the local language",
    bodyPl:
      "Dla osoby uczącej się islamu dobre zdanie w jej własnym języku często pomaga bardziej niż długi arabski termin bez wyjaśnienia.",
    bodyEn:
      "For someone learning Islam, a clear sentence in their own language often helps more than a long Arabic term without explanation.",
    doPl: "Tłumacz sens prostym językiem, a arabskie słowa dodawaj stopniowo.",
    doEn: "Explain the meaning simply, and add Arabic words gradually.",
    avoidPl: "Nie używaj nowych terminów jako bariery między ludźmi.",
    avoidEn: "Do not use new terms as a wall between people.",
    sourcePl: "edukacja początkujących",
    sourceEn: "beginner education",
    confidence: "CONTEXT_DEPENDENT",
    link: { route: "glossary", labelPl: "Słowniczek", labelEn: "Glossary" }
  },
  {
    id: "adhan-many-voices",
    tab: "ummah",
    kind: "custom",
    icon: "🔊",
    titlePl: "Adhan brzmi różnie, sens zostaje ten sam",
    titleEn: "Adhan sounds different, the meaning stays",
    bodyPl:
      "Wezwanie do modlitwy może mieć inne melodie w Stambule, Kairze czy Dżakarcie. To różnorodność dźwięku, nie zmiana celu.",
    bodyEn:
      "The call to prayer may have different melodies in Istanbul, Cairo or Jakarta. That is diversity of sound, not a change of purpose.",
    doPl: "Słuchaj różnic jak znaku globalnej wspólnoty.",
    doEn: "Hear the differences as a sign of global community.",
    avoidPl: "Nie traktuj jednej melodii jako jedynej poprawnej kultury islamu.",
    avoidEn: "Do not treat one melody as Islam's only correct culture.",
    sourcePl: "żywa praktyka adhanu",
    sourceEn: "living adhan practice",
    confidence: "CONTEXT_DEPENDENT",
    link: { route: "lessons", labelPl: "Lekcje arabskiego", labelEn: "Arabic lessons" }
  },
  {
    id: "ummah-table",
    tab: "ummah",
    kind: "local",
    icon: "🍚",
    titlePl: "Jeden Eid, wiele smaków",
    titleEn: "One Eid, many tastes",
    bodyPl:
      "W jednym domu będzie ryż, w innym ciasto, w innym kawa i daktyle. Radość Eid nie potrzebuje jednego menu.",
    bodyEn:
      "One home may have rice, another cake, another coffee and dates. Eid joy does not need one menu.",
    doPl: "Pytaj o historię dania. To często otwiera ciepłą rozmowę.",
    doEn: "Ask about the story of the dish. It often opens a warm conversation.",
    avoidPl: "Nie oceniaj pobożności po tym, czy potrawa wygląda 'orientalnie'.",
    avoidEn: "Do not judge devotion by whether food looks 'oriental'.",
    sourcePl: "globalna codzienność muzułmanów",
    sourceEn: "global Muslim everyday life",
    confidence: "CONTEXT_DEPENDENT"
  },
  {
    id: "soft-truth",
    tab: "adab",
    kind: "adab",
    icon: "🕊",
    titlePl: "Prawda nie musi być ostra",
    titleEn: "Truth does not need to be harsh",
    bodyPl:
      "Adab to nie udawanie, że różnic nie ma. To sposób mówienia prawdy tak, żeby nie kruszyć serca drugiej osoby bez potrzeby.",
    bodyEn:
      "Adab is not pretending differences do not exist. It is telling the truth without needlessly breaking another person's heart.",
    doPl: "Mów: rozumiem, że to brzmi nowe; mogę wyjaśnić spokojnie.",
    doEn: "Say: I understand this sounds new; I can explain calmly.",
    avoidPl: "Nie myl szczerej wiary z ostrym tonem.",
    avoidEn: "Do not confuse sincere faith with a harsh tone.",
    sourcePl: "akhlaq i adab",
    sourceEn: "akhlaq and adab",
    confidence: "VERIFIED",
    link: { route: "muallaf", labelPl: "Rozmowa z rodziną", labelEn: "Family conversation" }
  },
  {
    id: "neighbour-adab",
    tab: "adab",
    kind: "adab",
    icon: "🏘",
    titlePl: "Sąsiad widzi islam przed argumentem",
    titleEn: "A neighbour sees Islam before the argument",
    bodyPl:
      "Czasem najlepsze wyjaśnienie islamu to oddać pożyczoną rzecz, być punktualnym, nie robić hałasu i zapytać, czy ktoś potrzebuje pomocy.",
    bodyEn:
      "Sometimes the best explanation of Islam is returning what you borrowed, being on time, keeping noise down and asking if someone needs help.",
    doPl: "Zacznij od jednego dobrego gestu wobec osoby obok.",
    doEn: "Start with one good gesture toward someone nearby.",
    avoidPl: "Nie zostawiaj dobrego charakteru tylko na sytuacje religijne.",
    avoidEn: "Do not reserve good character only for religious moments.",
    sourcePl: "etyka sąsiedztwa",
    sourceEn: "neighbourly ethics",
    confidence: "VERIFIED"
  },
  {
    id: "questions-are-safe",
    tab: "adab",
    kind: "adab",
    icon: "❔",
    titlePl: "Pytania nie zawsze są atakiem",
    titleEn: "Questions are not always attacks",
    bodyPl:
      "Ludzie mogą pytać niezręcznie, bo nie mają języka albo znają islam tylko z nagłówków. Spokojna odpowiedź może być mostem, zanim pojawi się głębsza rozmowa.",
    bodyEn:
      "People may ask awkwardly because they lack the language or only know Islam from headlines. A calm answer can be a bridge before deeper conversation appears.",
    doPl: "Najpierw odpowiedz na emocję: rozumiem, że to może brzmieć obco.",
    doEn: "Answer the emotion first: I understand this may sound unfamiliar.",
    avoidPl: "Nie odpowiadaj na każde niezręczne pytanie jak na oskarżenie.",
    avoidEn: "Do not answer every awkward question as if it were an accusation.",
    sourcePl: "rozmowa międzykulturowa",
    sourceEn: "intercultural conversation",
    confidence: "CONTEXT_DEPENDENT",
    link: { route: "games", activeGame: "familyBridgeQuiz", labelPl: "Ćwicz odpowiedzi", labelEn: "Practice answers" }
  },
  {
    id: "sabr-small",
    tab: "adab",
    kind: "adab",
    icon: "🌿",
    titlePl: "Sabr bywa bardzo codzienny",
    titleEn: "Sabr can be very ordinary",
    bodyPl:
      "Cierpliwość nie zawsze wygląda heroicznie. Czasem to przerwać spór, wrócić do tematu jutro i nie użyć wiary jako broni.",
    bodyEn:
      "Patience does not always look heroic. Sometimes it means pausing an argument, returning tomorrow and not using faith as a weapon.",
    doPl: "Zamknij trudną rozmowę zdaniem: chcę o tym porozmawiać lepiej, nie szybciej.",
    doEn: "Close a hard conversation with: I want to discuss this better, not faster.",
    avoidPl: "Nie myl cierpliwości z pozwalaniem na przemoc lub upokorzenie.",
    avoidEn: "Do not confuse patience with allowing harm or humiliation.",
    sourcePl: "zasada cierpliwości i bezpieczeństwa",
    sourceEn: "patience and safety principle",
    confidence: "CONTEXT_DEPENDENT"
  },
  {
    id: "calligraphy-word",
    tab: "home",
    kind: "custom",
    icon: "✒",
    titlePl: "Kaligrafia uczy szacunku do słowa",
    titleEn: "Calligraphy teaches respect for words",
    bodyPl:
      "W wielu kulturach islamu piękno pisma niosło pamięć Koranu. Litera mogła stać się formą uważności, nie tylko dekoracją.",
    bodyEn:
      "In many Islamic cultures, beautiful writing carried the memory of the Quran. A letter could become attention, not only decoration.",
    doPl: "Połącz ciekawość kultury z nauką liter w aplikacji.",
    doEn: "Connect cultural curiosity with learning letters in the app.",
    avoidPl: "Nie traktuj tekstu Koranu jak zwykłego ornamentu bez szacunku.",
    avoidEn: "Do not treat Quranic text as ordinary ornament without respect.",
    sourcePl: "tradycja sztuki islamskiej",
    sourceEn: "Islamic art tradition",
    confidence: "CONTEXT_DEPENDENT",
    link: { route: "alphabet", labelPl: "Alfabet", labelEn: "Alphabet" }
  },
  {
    id: "mosque-light",
    tab: "home",
    kind: "custom",
    icon: "💡",
    titlePl: "Światło w meczecie buduje skupienie",
    titleEn: "Light in a mosque shapes focus",
    bodyPl:
      "Dziedzińce, lampy, okna i cisza nie są tylko ładnym tłem. W wielu miejscach pomagają ciału i sercu wejść w spokój.",
    bodyEn:
      "Courtyards, lamps, windows and quiet are not only a pretty background. In many places they help body and heart enter calm.",
    doPl: "Zauważ, jak przestrzeń pomaga zwolnić przed modlitwą.",
    doEn: "Notice how space helps you slow down before prayer.",
    avoidPl: "Nie myl architektury z warunkiem ważności modlitwy.",
    avoidEn: "Do not confuse architecture with a condition for prayer validity.",
    sourcePl: "architektura i doświadczenie wspólnoty",
    sourceEn: "architecture and community experience",
    confidence: "CONTEXT_DEPENDENT",
    link: { route: "history", historyTab: "stories", labelPl: "Stories Historii", labelEn: "History stories" }
  },
  {
    id: "ramadan-home-rhythm",
    tab: "home",
    kind: "religion",
    icon: "🌙",
    titlePl: "Ramadan zmienia rytm domu",
    titleEn: "Ramadan changes the rhythm of home",
    bodyPl:
      "Post jest praktyką religijną, ale atmosfera domu bywa lokalna: suhoor, iftar, zaproszenia, cisza albo rodzinny gwar.",
    bodyEn:
      "Fasting is religious practice, while the home atmosphere is often local: suhoor, iftar, invitations, quiet or family noise.",
    doPl: "Ucz się zasad w przewodniku, a zwyczaje poznawaj przez ludzi.",
    doEn: "Learn the rules in the guide, and learn customs through people.",
    avoidPl: "Nie zakładaj, że każdy dom przeżywa Ramadan identycznie.",
    avoidEn: "Do not assume every home experiences Ramadan identically.",
    sourcePl: "Ramadan i lokalna praktyka domu",
    sourceEn: "Ramadan and local home practice",
    confidence: "VERIFIED",
    link: { route: "ramadan", labelPl: "Przewodnik Ramadan", labelEn: "Ramadan guide" }
  },
  {
    id: "dates-small-gift",
    tab: "home",
    kind: "custom",
    icon: "🌴",
    titlePl: "Daktyle jako mały gest",
    titleEn: "Dates as a small gesture",
    bodyPl:
      "Daktyle często pojawiają się przy iftarze, gościach albo jako prosty prezent. Nie chodzi o luksus, ale o pamięć, słodycz i gościnność.",
    bodyEn:
      "Dates often appear at iftar, with guests or as a simple gift. It is not about luxury, but memory, sweetness and hospitality.",
    doPl: "Jeśli nie wiesz, co przynieść, prosty i halal drobiazg zwykle wystarczy.",
    doEn: "If you do not know what to bring, a simple halal small gift is usually enough.",
    avoidPl: "Nie rób z jednego zwyczaju obowiązku dla każdego muzułmanina.",
    avoidEn: "Do not turn one custom into an obligation for every Muslim.",
    sourcePl: "gościnność i zwyczaje Ramadanu",
    sourceEn: "hospitality and Ramadan customs",
    confidence: "CONTEXT_DEPENDENT"
  }
];
