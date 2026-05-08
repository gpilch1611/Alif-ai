# Audyt aplikacji Alif AI (działanie + spójność sekcji islamu)

Data audytu: 2026-05-08 (UTC)

## Zakres
- Statyczna analiza kodu i danych w repozytorium.
- Kontrola kompletności krytycznych zbiorów islamicznych (surah, asma, miesiące).
- Wskazanie błędów działania i niespójności treści.

## Wynik skrócony
- **Sekcja surah**: lista zawiera pełne **114 sur**.
- **Asmaul Husna**: lista zawiera **99 imion**.
- **Miesiące hidżry**: lista zawiera **12 miesięcy**.
- **Krytyczny błąd bezpieczeństwa**: jawny klucz API w `app.js`.
- **Krytyczna niespójność merytoryczna**: sztuczne „dopompowanie” FAQ do 100 pozycji przez duplikaty z dopiskami (może dawać fałszywe poczucie kompletności i jakości).
- **Wysokie ryzyko wiarygodności**: brak warstwy źródłowej/walidacji dla ayah/dua/hadith (brak odwołania do zweryfikowanego korpusu).

## Kluczowe problemy

### 1) Bezpieczeństwo: klucz API w kodzie frontendowym (KRYTYCZNE)
- `GROQ_API_KEY` jest wpisany na stałe w pliku `app.js`.
- Każdy użytkownik aplikacji może go odczytać z DevTools i nadużyć.
- Skutki: wyciek kosztów, limity, potencjalna blokada klucza.

**Rekomendacja:**
- Natychmiastowa rotacja klucza.
- Przeniesienie wywołań LLM na backend/proxy; frontend bez sekretów.

### 2) Niespójność merytoryczna: sztuczne rozszerzanie FAQ do 100 (WYSOKIE)
- Kod buduje `islamicFaqExpanded` przez pętlę i powielanie treści bazowej z dopiskami `(... n)`.
- To nie jest realne 100 unikalnych odpowiedzi, tylko warianty szablonu.

**Ryzyko:**
- Użytkownik otrzymuje pozorną „pełność” wiedzy.
- Spada jakość i zaufanie do sekcji islamu.

**Rekomendacja:**
- Wyłączyć automatyczne duplikowanie.
- Zostawić tylko zweryfikowane, unikalne QA ze źródłami.

### 3) Brak formalnej walidacji „prawdziwości” ayah/dua/hadith (WYSOKIE)
- Dane są trzymane lokalnie i nie ma mechanizmu porównania z oficjalnym korpusem.
- Wymóg „wszystkie informacje mają być prawdziwe” nie jest technicznie gwarantowany obecną architekturą.

**Rekomendacja:**
- Dodać pipeline walidacji danych religijnych:
  1. Źródło referencyjne (Quran corpus + kolekcje hadith + uznane zbiory dua).
  2. Testy automatyczne porównujące tekst i numerację.
  3. Flagi jakości (`verified`, `source`, `last_checked_at`).

### 4) Ryzyko halucynacji AI w treściach islamicznych (WYSOKIE)
- Assistant opiera się na modelu ogólnym i promptach.
- Brak wymuszenia cytowania źródeł w każdej odpowiedzi religijnej.

**Rekomendacja:**
- W trybie islam wymusić RAG z dozwolonych źródeł + obowiązkowy format źródeł.
- Blokować odpowiedzi bez cytatu źródłowego.

## Kontrola kompletności (co jest, a czego nie ma)
- **Surah**: komplet 114/114 obecny.
- **Asmaul Husna**: komplet 99/99 obecny.
- **Miesiące islamskie**: 12/12 obecne.
- **Ayah**: brak pełnego korpusu wszystkich ayah (są tylko wybrane cytaty/odniesienia).
- **Dua**: brak formalnej deklaracji „pełny zbiór dua” (jest zbiór częściowy).
- **Hadith**: lista 30 pozycji, niepełna względem kanonicznych zbiorów.

## Priorytetowy plan naprawy
1. Usunąć sekret z frontendu + rotacja klucza (P0).
2. Wyłączyć sztuczne FAQ 100 i zastąpić realnym curated content (P1).
3. Dodać walidację źródeł i testy integralności danych islamicznych (P1).
4. Wprowadzić poziomy zaufania treści (`verified/unverified`) i widoczne źródła w UI (P2).

## Komendy użyte podczas audytu
- `rg --files`
- `sed -n '1,240p' index.html`
- `sed -n '1,280p' app.js`
- `sed -n '1,320p' data.js`
- `rg -n "quranSurahs|GROQ_API_KEY|faqExpansionSeed|extra_" app.js data.js`
- `node -e "import('./data.js').then(m=>{console.log('surahs',m.quranSurahs.length);console.log('asma',m.asmaulHusna.length);console.log('hadith',m.islamicHadith.length);console.log('months',m.islamicMonths?.length);console.log('faq',m.islamicFaq?.length);}).catch(e=>{console.error(e);process.exit(1);})"`
