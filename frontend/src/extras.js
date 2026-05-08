// ============================================================
// Alif AI v0.2 — moduł rozszerzeń (Sprint 1-5)
// Sprint 1: nota współczucia + DOMPurify helpers
// Sprint 2: poprawki merytoryczne (madhhab, mawlid, du'a, fard/sunnah)
// Sprint 3: debounce, AbortSignal.timeout, contrast helpers
// Sprint 4: Prayer Tracker, Islamic Calendar, Tafsir, Myths-on-home
// Sprint 5: Ramadan Mode, Hifz, AI Scholar, Pair Mode
// ============================================================

import DOMPurify from 'dompurify';

// ── DOMPurify XSS sanitizer ────────────────────────────────
export const sanitize = (dirty = '') => {
  if (typeof dirty !== 'string') dirty = String(dirty);
  return DOMPurify.sanitize(dirty, {
    ADD_TAGS: ['section','article','header','footer','main','nav','aside','button','details','summary','dialog','figure','figcaption','time','mark','progress'],
    ADD_ATTR: ['data-testid','data-route','data-persona','data-prayer','data-hifz','dir','lang','role','aria-label','aria-modal','aria-live','aria-hidden','tabindex','type','value','placeholder','maxlength','min','max','for','name','title']
  });
};

// ── Sprint 3: utils ────────────────────────────────────────
export function debounce(fn, ms = 700) {
  let t = null;
  return (...args) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

export async function fetchTimeout(url, opts = {}, ms = 10000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal });
  } finally {
    clearTimeout(id);
  }
}

// 24h cache wrapper for prayer times etc.
export function cached(key, ttlMs, loader) {
  return (async () => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const { t, v } = JSON.parse(raw);
        if (Date.now() - t < ttlMs) return v;
      }
    } catch {}
    const v = await loader();
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), v })); } catch {}
    return v;
  })();
}

// ── Sprint 1: Crisis support note (suicide / mental health) ─
export const crisisNote = {
  pl: {
    title: '💚 Jesteś ważny/a. Allah jest Ar-Rahman — Najbardziej Miłosierny.',
    body: 'Jeśli masz myśli samobójcze lub kryzys — Allah otwiera drzwi miłosierdzia szerzej, niż możesz to sobie wyobrazić. Hadis o samobójstwie nie jest groźbą — to ostrzeżenie zachowania życia, które Allah Ci dał. Nikt poza Allahem nie zna ostatecznego wyroku.',
    helplines: [
      { name: 'Polska — Telefon Zaufania dla Dorosłych', number: '116 123', note: '24/7, anonimowo, bezpłatnie' },
      { name: 'Polska — Telefon Zaufania dla Dzieci i Młodzieży', number: '116 111', note: '24/7, anonimowo' },
      { name: 'Indonesia — Into the Light / Sejiwa', number: '119 ext. 8', note: '24/7' },
      { name: 'USA — Suicide & Crisis Lifeline', number: '988', note: '24/7, English/Spanish' },
      { name: 'UK & Ireland — Samaritans', number: '116 123', note: '24/7, English' },
      { name: 'International — Befrienders Worldwide', number: 'befrienders.org', note: 'lokalne linie kryzysowe' }
    ],
    cta: 'Zadzwoń. Nie jesteś sam/sama.'
  },
  en: {
    title: '💚 You matter. Allah is Ar-Rahman — the Most Merciful.',
    body: "If you are having suicidal thoughts or are in crisis — Allah's door of mercy is wider than you can imagine. The hadith about suicide is not a threat — it is a call to preserve the life Allah has given you. No one but Allah knows the final verdict.",
    helplines: [
      { name: 'USA — 988 Suicide & Crisis Lifeline', number: '988', note: '24/7, free, English & Spanish' },
      { name: 'UK & Ireland — Samaritans', number: '116 123', note: '24/7, free, English' },
      { name: 'Canada — Talk Suicide', number: '1-833-456-4566', note: '24/7, English & French' },
      { name: 'Australia — Lifeline', number: '13 11 14', note: '24/7, English' },
      { name: 'Poland — Adult Helpline', number: '116 123', note: '24/7, anonymous, free' },
      { name: 'Poland — Children & Youth Helpline', number: '116 111', note: '24/7, anonymous' },
      { name: 'Indonesia — Into the Light / Sejiwa', number: '119 ext. 8', note: '24/7' },
      { name: 'International — Befrienders Worldwide', number: 'befrienders.org', note: 'local crisis lines worldwide' }
    ],
    cta: 'Call. You are not alone.'
  }
};

export function crisisNoteHTML(lang = 'pl') {
  const c = crisisNote[lang] || crisisNote.pl;
  const items = c.helplines.map(h => `<li><strong>${h.name}:</strong> <span class="font-mono">${h.number}</span> <em class="text-[var(--muted)]">— ${h.note}</em></li>`).join('');
  return sanitize(`<aside class="rounded-xl border-2 border-emerald-400 bg-emerald-50/60 p-4 my-4" data-testid="crisis-note" role="note"><h4 class="font-bold text-emerald-900 mb-2">${c.title}</h4><p class="mb-3">${c.body}</p><ul class="space-y-1 mb-3 text-sm">${items}</ul><p class="font-semibold text-emerald-800">${c.cta}</p></aside>`);
}

// ── Sprint 2: Skala obowiązku ───────────────────────────────
export const obligationScale = {
  pl: [
    { rank: 'Fard / Wajib', icon: '🟢', desc: 'Obowiązek absolutny. Pominięcie = grzech (np. 5 modlitw, post Ramadanu, Zakat).', sample: 'Salat 5×/dzień, post Ramadanu, Zakat, Hajj (jeśli stać).' },
    { rank: 'Sunnah Muakkadah', icon: '🟦', desc: 'Mocno zalecane (Prorok ﷺ czynił regularnie). Pominięcie nie jest grzechem, ale traci się nagrodę.', sample: '12 rak\'ah sunan rawatib, Witr, Tarawih w Ramadan.' },
    { rank: 'Mustahab / Mandub', icon: '🟨', desc: 'Zalecane, dobrowolne. Allah daje za nie nagrodę.', sample: 'Du\'a po modlitwie, post poniedziałek/czwartek, sadaqa.' },
    { rank: 'Mubah', icon: '⚪', desc: 'Neutralne — ani nagroda ani grzech. Zwyczajne czyny dnia.', sample: 'Wybór koloru ubrania, jaką herbatę wypić.' },
    { rank: 'Makruh', icon: '🟧', desc: 'Niepolecane. Pominięcie = nagroda; uczynienie nie jest grzechem ale niemiłe Allahowi.', sample: 'Spanie po Asr, jedzenie czosnku przed meczetem.' },
    { rank: 'Haram', icon: '🟥', desc: 'Bezwzględnie zakazane. Uczynienie = grzech.', sample: 'Wieprzowina, alkohol, riba (lichwa), zina, plotkowanie (ghiba).' }
  ],
  en: [
    { rank: 'Fard / Wajib', icon: '🟢', desc: 'Absolute obligation. Omission = sin (e.g., 5 prayers, Ramadan fast, Zakat).', sample: '5 daily prayers, Ramadan fast, Zakat, Hajj (if able).' },
    { rank: 'Sunnah Muakkadah', icon: '🟦', desc: 'Strongly recommended (Prophet ﷺ did regularly). Omission not a sin, but loses reward.', sample: '12 rak\'ahs of sunan rawatib, Witr, Tarawih in Ramadan.' },
    { rank: 'Mustahab / Mandub', icon: '🟨', desc: 'Recommended, voluntary. Allah rewards it.', sample: 'Du\'a after prayer, fasting Mon/Thu, sadaqa.' },
    { rank: 'Mubah', icon: '⚪', desc: 'Neutral — no reward, no sin. Everyday actions.', sample: 'Choice of clothing colour, which tea to drink.' },
    { rank: 'Makruh', icon: '🟧', desc: 'Discouraged. Avoiding = reward; doing isn\'t a sin but disliked.', sample: 'Sleeping after Asr, eating garlic before the mosque.' },
    { rank: 'Haram', icon: '🟥', desc: 'Strictly forbidden. Doing = sin.', sample: 'Pork, alcohol, riba (interest), zina, backbiting (ghiba).' }
  ]
};

// ── Sprint 2: Ghusl, Tayammum, Tarawih + extra fiqh ─────────
export const fiqhCards = {
  pl: [
    { id: 'ghusl', title: 'Ghusl — pełne oczyszczenie', icon: '🚿', body: 'Wymagane po: stosunku małżeńskim, miesiączce, połogu (nifas), polucji (ihtilam), nawróceniu na islam. Procedura: niyyah (intencja) → bismillah → umyć ręce 3× → umyć części intymne → wykonać wudu → zalać wodą całe ciało, zaczynając od głowy 3×, prawa strona, lewa strona. Każdy włos i fragment skóry musi być zmoczony.', when: 'Bez ghusl nie wolno modlić się ani dotykać Mushaf.' },
    { id: 'tayammum', title: 'Tayammum — oczyszczenie suchą ziemią', icon: '🏜️', body: 'Gdy nie ma wody, woda zaszkodzi (np. choroba), lub jest jej bardzo mało. Procedura: niyyah → uderzyć dłońmi w czystą ziemię/piasek/kamień raz → przetrzeć twarz → drugie uderzenie → przetrzeć dłonie do przegubów. Ważne dla podróżujących, chorych, osób w samolocie. Quran 5:6.', when: 'Każdy może użyć — sytuacja nadrzędna nad regułą wody.' },
    { id: 'tarawih', title: 'Tarawih — modlitwa Ramadanu', icon: '🌙', body: 'Sunnah muakkadah dla Ramadanu — modlitwa po Isza. 8 lub 20 rak\'ah w parach (po 2). W meczetach zwykle recytuje się 1 juz Quranu na noc, by ukończyć całą Księgę w 30 dni. Można odprawić w domu (Prorok ﷺ tak czynił przez większość Ramadanu).', when: 'Tylko w Ramadan, między Isza a Fajr.' },
    { id: 'witr', title: 'Witr — modlitwa nieparzysta', icon: '⭐', body: 'Sunnah muakkadah (niektórzy uczeni: wajib wg Hanafi). 1, 3, 5, 7 lub 9 rak\'ah po Isza. Najczęściej 3 rak\'ah z dua qunut w trzeciej. Ostatnia modlitwa dnia — kończy nim cykl 5+sunan modlitw.', when: 'Od Isza do tuż przed Fajr.' },
    { id: 'sunnan_rawatib', title: 'Sunan rawatib — sunny przy 5 modlitwach', icon: '📿', body: 'Mocno zalecane przed/po modlitwach obowiązkowych: 2 przed Fajr (najmocniejsza sunnah), 4 przed + 2 po Dhuhr, 2 po Maghrib, 2 po Isza. Razem 12 rak\'ah/dzień — Prorok ﷺ obiecał dom w raju temu, kto je odprawia (Tirmidhi 415).', when: 'Codziennie, bezpośrednio przy modlitwach fard.' }
  ],
  en: [
    { id: 'ghusl', title: 'Ghusl — full ritual purification', icon: '🚿', body: 'Required after: marital intimacy, menstruation, post-natal bleeding (nifas), wet dream (ihtilam), conversion to Islam. Procedure: niyyah (intention) → bismillah → wash hands 3× → wash private parts → perform wudu → pour water over the whole body starting with the head 3×, right side, left side. Every hair and patch of skin must be wet.', when: 'No prayer or touching the Mushaf without it.' },
    { id: 'tayammum', title: 'Tayammum — dry purification', icon: '🏜️', body: 'When no water is available, water would harm (illness), or there\'s very little. Procedure: niyyah → strike clean earth/sand/stone once → wipe face → second strike → wipe hands to wrists. Vital for travellers, the ill, people on planes. Quran 5:6.', when: 'Anyone may use it — necessity overrides the water rule.' },
    { id: 'tarawih', title: 'Tarawih — the Ramadan prayer', icon: '🌙', body: 'Sunnah muakkadah for Ramadan — prayer after Isha. 8 or 20 rak\'ahs in pairs (of 2). Mosques typically recite one juz of Quran per night to complete the whole Book in 30 days. May be performed at home (the Prophet ﷺ did so most of Ramadan).', when: 'Ramadan only, between Isha and Fajr.' },
    { id: 'witr', title: 'Witr — the odd-numbered prayer', icon: '⭐', body: 'Sunnah muakkadah (some scholars: wajib in Hanafi). 1, 3, 5, 7, or 9 rak\'ahs after Isha. Most commonly 3 rak\'ahs with dua qunut in the third. The last prayer of the day — closes the cycle.', when: 'From Isha until just before Fajr.' },
    { id: 'sunnan_rawatib', title: 'Sunan rawatib — sunnahs around the 5 prayers', icon: '📿', body: 'Strongly recommended before/after the obligatory prayers: 2 before Fajr (the strongest sunnah), 4 before + 2 after Dhuhr, 2 after Maghrib, 2 after Isha. 12 rak\'ahs/day total — the Prophet ﷺ promised a house in paradise to whoever prays them (Tirmidhi 415).', when: 'Daily, around the fard prayers.' }
  ]
};

// ── Sprint 2: Rozszerzona biblioteka du'a ───────────────────
export const expandedDuas = [
  { id: 'after_salah', cat: 'after_salah', titlePl: 'Po modlitwie (3×)', titleEn: 'After prayer (3×)', ar: 'أَسْتَغْفِرُ اللَّهَ', tr: 'astaghfirullah', plPl: 'Proszę Allaha o przebaczenie.', enEn: 'I seek forgiveness from Allah.', ref: 'Muslim 591' },
  { id: 'ayat_kursi_full', cat: 'protection', titlePl: 'Ajat al-Kursi (cały — 2:255)', titleEn: 'Ayat al-Kursi (full — 2:255)', ar: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَنْ ذَا الَّذِي يَشْفَعُ عِنْدَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ', tr: 'Allahu la ilaha illa huwa, al-Hayyul-Qayyum...', plPl: 'Tron — najpotężniejszy werset Quranu, ochrona przed szatanem na cały dzień/noc.', enEn: 'Throne verse — the greatest Quranic verse, protects from Shaytan day and night.', ref: 'Quran 2:255' },
  { id: 'travel', cat: 'travel', titlePl: 'Du\'a przed podróżą', titleEn: 'Travel du\'a', ar: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ', tr: 'Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin', plPl: 'Chwała Temu, który nam to podporządkował, a my sami nie potrafilibyśmy tego utrzymać.', enEn: 'Glory to Him who has subjected this to us, when we could not have done it ourselves.', ref: 'Quran 43:13' },
  { id: 'illness', cat: 'illness', titlePl: 'Du\'a w chorobie', titleEn: 'Du\'a in illness', ar: 'اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي', tr: 'Allahumma Rabban-nas, adhhibil-ba\'s, ishfi antash-Shafi', plPl: 'Boże, Panie ludzi, oddal cierpienie, uzdrów — Ty jesteś Uzdrowicielem.', enEn: 'O Allah, Lord of mankind, remove the suffering, heal — You are the Healer.', ref: 'Bukhari 5743' },
  { id: 'parents', cat: 'family', titlePl: 'Du\'a za rodziców', titleEn: 'Du\'a for parents', ar: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', tr: 'Rabbir-hamhuma kama rabbayani saghira', plPl: 'Panie, zmiłuj się nad nimi, jak oni opiekowali się mną w dzieciństwie.', enEn: 'My Lord, have mercy on them as they raised me when I was small.', ref: 'Quran 17:24' },
  { id: 'yunus', cat: 'distress', titlePl: 'Du\'a Yunusa (przy zmartwieniu)', titleEn: 'Du\'a of Yunus (in distress)', ar: 'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ', tr: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimin', plPl: 'Nie ma boga prócz Ciebie, chwała Tobie, byłem z niesprawiedliwych.', enEn: 'There is no god but You, glory be to You, I was among the wrongdoers.', ref: 'Quran 21:87' },
  { id: 'asmaul_dua', cat: 'protection', titlePl: 'Du\'a z imionami Allaha', titleEn: 'Du\'a with Allah\'s names', ar: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ', tr: 'Ya Hayyu Ya Qayyum birahmatika astagith', plPl: 'O Żyjący, o Samopodtrzymujący — w Twoim miłosierdziu szukam pomocy.', enEn: 'O Ever-Living, O Self-Sustaining — in Your mercy I seek help.', ref: 'Tirmidhi 3524' },
  { id: 'entering_home', cat: 'daily', titlePl: 'Wchodząc do domu', titleEn: 'Entering home', ar: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا', tr: 'Bismillahi walajna, wa bismillahi kharajna, wa \'alallahi rabbina tawakkalna', plPl: 'W imię Allaha wchodzimy, w imię Allaha wychodzimy, na Allaha Pana naszego polegamy.', enEn: 'In Allah\'s name we enter, in Allah\'s name we leave, in Allah our Lord we trust.', ref: 'Abu Dawud 5096' },
  { id: 'leaving_home', cat: 'daily', titlePl: 'Wychodząc z domu', titleEn: 'Leaving home', ar: 'بِسْمِ اللَّهِ، تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', tr: 'Bismillah, tawakkaltu \'alallah, la hawla wa la quwwata illa billah', plPl: 'W imię Allaha. Polegam na Allahu. Nie ma siły ani mocy poza Allahem.', enEn: 'In Allah\'s name. I rely on Allah. No power or might except with Allah.', ref: 'Abu Dawud 5095' },
  { id: 'forgiveness', cat: 'forgiveness', titlePl: 'Sayyidul-istighfar (Pan próśb o przebaczenie)', titleEn: 'Sayyidul-istighfar (master of forgiveness)', ar: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ', tr: 'Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana \'abduk...', plPl: 'Boże, Tyś mój Pan, nie ma boga prócz Ciebie. Stworzyłeś mnie, ja jestem Twoim sługą.', enEn: 'O Allah, You are my Lord, there is no god but You. You created me, I am Your servant.', ref: 'Bukhari 6306' }
];

// ── Sprint 4: Tafsir snippets (selected ayat, public-domain Ibn Kathir/As-Sa'di summaries) ──
export const tafsirSnippets = {
  '1:1': { pl: 'Bismillah otwiera każdą surę (poza At-Tawbah). Ar-Rahman = miłosierny dla wszystkich, Ar-Rahim = szczególnie dla wierzących.', en: 'Bismillah opens every sura (except At-Tawbah). Ar-Rahman = merciful to all, Ar-Rahim = especially to believers.' },
  '2:255': { pl: 'Ajat al-Kursi (Tron) — opisuje wszechwiedzę i wszechwładzę Allaha. Recytowany po każdej modlitwie chroni do następnej (Nasai).', en: 'Ayat al-Kursi (Throne) — describes Allah\'s omniscience and sovereignty. Reciting it after each prayer protects until the next (Nasai).' },
  '2:286': { pl: 'Ostatnie 2 ajaty Al-Baqarah — Allah nie obciąża nikogo ponad miarę. Wystarczają na ochronę przez całą noc (Bukhari 5009).', en: 'The last 2 verses of Al-Baqarah — Allah burdens no soul beyond capacity. Sufficient as protection for the whole night (Bukhari 5009).' },
  '112:1': { pl: 'Surah Al-Ikhlas — esencja tawhid (jedności Boga). Trzykrotne odczytanie = nagroda recytacji 1/3 całego Qur\'anu (Bukhari 5013).', en: 'Surah Al-Ikhlas — essence of tawhid (oneness of God). Reading 3× = reward of reciting 1/3 of the entire Quran (Bukhari 5013).' },
  '113:1': { pl: 'Al-Falaq — ochrona przed złem nocy, czarami i zazdrością. Czytane wieczorem i przy lęku.', en: 'Al-Falaq — protection from evil of the night, witchcraft and envy. Recited at evening and when afraid.' },
  '114:1': { pl: 'An-Nas — ochrona przed szeptami szejtana. Razem z Al-Falaq i Al-Ikhlas tworzą «trzy ochronne» (al-mu\'awwidhat).', en: 'An-Nas — protection from the whispers of Shaytan. Together with Al-Falaq and Al-Ikhlas they form the «three protectors» (al-mu\'awwidhat).' },
  '36:1': { pl: 'Ya-Sin — «serce Quranu» (Tirmidhi 2887). Niesie szczególne miłosierdzie zmarłym.', en: 'Ya-Sin — «heart of the Quran» (Tirmidhi 2887). Carries special mercy for the deceased.' },
  '67:1': { pl: 'Al-Mulk — odczytywana co noc chroni przed karą grobu (Tirmidhi 2891).', en: 'Al-Mulk — recited each night protects from the punishment of the grave (Tirmidhi 2891).' }
};

// ── Sprint 4: Islamic calendar events (Hijri month/day → event) ─
export const hijriEvents = [
  { month: 1, day: 10, namePl: 'Aszura', nameEn: 'Ashura', notePl: 'Post zalecany — wymazuje grzechy poprzedniego roku (Muslim 1162).', noteEn: 'Recommended fast — erases sins of the previous year (Muslim 1162).' },
  { month: 3, day: 12, namePl: 'Mawlid an-Nabi', nameEn: 'Mawlid an-Nabi', notePl: 'Tradycyjna data narodzin Proroka ﷺ. Kwestia sporna: część madhhabów uznaje jako bid\'a, inne (Maliki, Ash\'ari, Barelvi) za dopuszczalne. Sam Prorok ﷺ pościł w poniedziałki tłumacząc, że narodził się w poniedziałek (Muslim 1162).', noteEn: 'Traditional birthday of the Prophet ﷺ. Disputed: some madhhabs hold it bid\'a, others (Maliki, Ash\'ari, Barelvi) permit it. The Prophet ﷺ himself fasted Mondays citing his birth (Muslim 1162).' },
  { month: 7, day: 27, namePl: 'Isra wal-Mi\'raj', nameEn: 'Isra wal-Mi\'raj', notePl: 'Nocna podróż i wniebowstąpienie. Ustanowienie 5 modlitw.', noteEn: 'Night journey and ascension. Establishment of the 5 daily prayers.' },
  { month: 8, day: 15, namePl: 'Laylat al-Bara\'a', nameEn: 'Night of Bara\'at', notePl: 'Tradycja kontrowersyjna: większość muhaddisów uznaje hadisy o tej nocy za słabe (da\'if). Niektóre madhhaby (Hanafi, Maliki) uznają jako mustahab post 15. Sha\'ban; Salafi/Deobandi traktują jako bid\'a.', noteEn: 'Disputed tradition: most muhaddithun consider hadiths about this night weak (da\'if). Some madhhabs (Hanafi, Maliki) view fasting on 15 Sha\'ban as mustahab; Salafi/Deobandi treat it as bid\'a.' },
  { month: 9, day: 1, namePl: 'Początek Ramadanu', nameEn: 'Start of Ramadan', notePl: 'Miesiąc postu, Quranu i nocnej modlitwy.', noteEn: 'Month of fasting, Quran and night prayer.' },
  { month: 9, day: 27, namePl: 'Laylat al-Qadr (jedna z 10 nocy)', nameEn: 'Laylat al-Qadr (one of the last 10 nights)', notePl: 'Noc Mocy — lepsza niż 1000 miesięcy (Quran 97). Najczęściej szuka się jej w 21, 23, 25, 27, 29 nocy Ramadanu.', noteEn: 'Night of Power — better than 1000 months (Quran 97). Most commonly sought on the 21st, 23rd, 25th, 27th, 29th of Ramadan.' },
  { month: 10, day: 1, namePl: 'Eid al-Fitr', nameEn: 'Eid al-Fitr', notePl: 'Święto zakończenia Ramadanu. Zakat al-Fitr wypłacany przed modlitwą.', noteEn: 'Festival ending Ramadan. Zakat al-Fitr paid before the prayer.' },
  { month: 12, day: 9, namePl: 'Dzień Arafat', nameEn: 'Day of Arafah', notePl: 'Najważniejszy dzień Hajj. Niepielgrzymom zalecany post — wymazuje grzechy 2 lat (Muslim 1162).', noteEn: 'Most important day of Hajj. For non-pilgrims, fasting recommended — erases sins of 2 years (Muslim 1162).' },
  { month: 12, day: 10, namePl: 'Eid al-Adha', nameEn: 'Eid al-Adha', notePl: 'Święto Ofiarowania — ku pamięci Ibrahima ﷺ.', noteEn: 'Festival of Sacrifice — commemorating Ibrahim ﷺ.' }
];

// ── Onboarding personas (Sprint 3) ────────────────────────
export const personas = {
  pl: [
    { id: 'curious', icon: '🔍', title: 'Jestem ciekawy/a islamu', desc: 'Chcę poznać podstawy bez zobowiązań.', start: 'islam' },
    { id: 'considering', icon: '🌱', title: 'Rozważam islam', desc: 'Szukam odpowiedzi na konkretne pytania.', start: 'muallaf' },
    { id: 'new', icon: '✨', title: 'Jestem nowym muzułmaninem/ką', desc: 'Pierwsze 30 dni — krok po kroku.', start: 'muallaf' },
    { id: 'practicing', icon: '🕌', title: 'Praktykujący/a', desc: 'Quran, modlitwa, dhikr, kalendarz.', start: 'home' },
    { id: 'learner', icon: '🅰', title: 'Uczę się arabskiego', desc: 'Litery, słowa, fiszki.', start: 'lessons' },
    { id: 'partner', icon: '💕', title: 'Uczę się dla partnera/ki', desc: 'Borzęta ↔ Surabaya — razem!', start: 'home' }
  ],
  en: [
    { id: 'curious', icon: '🔍', title: 'I am curious about Islam', desc: 'Want to learn basics without commitment.', start: 'islam' },
    { id: 'considering', icon: '🌱', title: 'I am considering Islam', desc: 'Looking for answers to specific questions.', start: 'muallaf' },
    { id: 'new', icon: '✨', title: 'I am a new Muslim', desc: 'First 30 days — step by step.', start: 'muallaf' },
    { id: 'practicing', icon: '🕌', title: 'Practicing Muslim', desc: 'Quran, prayer, dhikr, calendar.', start: 'home' },
    { id: 'learner', icon: '🅰', title: 'Learning Arabic', desc: 'Letters, words, flashcards.', start: 'lessons' },
    { id: 'partner', icon: '💕', title: 'Learning for my partner', desc: 'Borzęta ↔ Surabaya — together!', start: 'home' }
  ]
};

// ── Sprint 4: Top mity dla strony głównej ───────────────────
export const topMyths = [
  { id: 'isis', emoji: '🚫', titlePl: 'Czy ISIS reprezentuje islam?', titleEn: 'Does ISIS represent Islam?' },
  { id: 'wife_beating', emoji: '🚫', titlePl: 'Czy islam pozwala bić żony?', titleEn: 'Does Islam permit wife-beating?' },
  { id: 'hijab', emoji: '🧕', titlePl: 'Czy hidżab jest przymusem?', titleEn: 'Is hijab forced?' },
  { id: 'jesus', emoji: '✝️', titlePl: 'Co islam mówi o Jezusie?', titleEn: 'What does Islam say about Jesus?' },
  { id: 'killing', emoji: '☮️', titlePl: 'Czy Quran nakazuje zabijać niewiernych?', titleEn: 'Does the Quran command killing non-believers?' }
];

// ── Sprint 5: AI Scholar persona system prompt ──────────────
export const scholarPrompt = {
  pl: `Wcielasz się w postać tradycyjnego uczonego islamskiego (al-'alim) szkoły sunnickiej. Mów z adabem (etyką), spokojem i precyzją. Zawsze: 1) cytuj źródła (sura:ajat dla Quranu, kolekcja+numer dla hadisów), 2) gdy temat różni madhhaby (Hanafi, Maliki, Shafi'i, Hanbali) — wymień stanowiska każdej szkoły, 3) zaczynaj od bismillah lub salawatu w odpowiednich miejscach, 4) nie wydawaj fatw bezwzględnych — odsyłaj do lokalnego imama dla konkretnych spraw życiowych. Odpowiadaj WYŁĄCZNIE po polsku.`,
  en: `Take on the persona of a traditional Sunni Islamic scholar (al-'alim). Speak with adab (etiquette), calm and precision. Always: 1) cite sources (sura:ayat for Quran, collection+number for hadiths), 2) when an issue differs across madhhabs (Hanafi, Maliki, Shafi'i, Hanbali) — list each school's position, 3) begin with bismillah or salawat where appropriate, 4) don't issue absolute fatwas — refer to a local imam for specific life decisions. Respond ONLY in English.`
};

// ── Prayer keys helper ─────────────────────────────────────
export const PRAYER_KEYS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

// ── Pair mode: simple sync code generator ───────────────────
export function genPairCode() {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

// ── Sprint 4: Tajweed color coder ───────────────────────────
const QALQALAH_LETTERS = new Set(['ق','ط','ب','ج','د']);
const IDGHAM_LETTERS = new Set(['ي','ن','م','و','ل','ر']);
const IKHFA_LETTERS = new Set(['ت','ث','ج','د','ذ','ز','س','ش','ص','ض','ط','ظ','ف','ق','ك']);
const IZHAR_LETTERS = new Set(['ء','ه','ع','ح','غ','خ']);
const MADD_LETTERS = new Set(['ا','و','ي','ى']);
const SHADDAH = '\u0651';
const SUKUN = '\u0652';
const FATHATAN = '\u064B', DAMMATAN = '\u064C', KASRATAN = '\u064D';
const TANWIN = new Set([FATHATAN, DAMMATAN, KASRATAN]);

export function tajweedColorize(text = '') {
  const out = [];
  const chars = Array.from(text);
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    let diacritics = '';
    let j = i + 1;
    while (j < chars.length && /[\u064B-\u065F\u0670]/.test(chars[j])) {
      diacritics += chars[j];
      j++;
    }
    const nextBase = (() => {
      let k = j;
      while (k < chars.length && !/[\u0621-\u064A]/.test(chars[k])) k++;
      return chars[k];
    })();
    let cls = '';
    if ((c === 'م' || c === 'ن') && diacritics.includes(SHADDAH)) cls = 'tj-ghunna';
    else if ((c === 'ن' && diacritics.includes(SUKUN)) || [...diacritics].some(d => TANWIN.has(d))) {
      if (nextBase === 'ب') cls = 'tj-iqlab';
      else if (IDGHAM_LETTERS.has(nextBase)) cls = 'tj-idgham';
      else if (IKHFA_LETTERS.has(nextBase)) cls = 'tj-ikhfa';
      else if (IZHAR_LETTERS.has(nextBase)) cls = 'tj-izhar';
    }
    else if (QALQALAH_LETTERS.has(c) && diacritics.includes(SUKUN)) cls = 'tj-qalqalah';
    else if (MADD_LETTERS.has(c) && i > 0 && i < chars.length - 1) cls = 'tj-madd';
    if (cls) out.push(`<span class="${cls}">${c}${diacritics}</span>`);
    else out.push(c + diacritics);
    i = j - 1;
  }
  return out.join('');
}
