# Alif AI (ألف AI)

Progressive Web App do nauki alfabetu arabskiego po polsku. Projekt jest statyczny: HTML, CSS, Tailwind przez CDN, Vanilla JavaScript, dane w `data.js`, postęp w `localStorage`.

## Struktura

```text
Alif AI/
├─ index.html
├─ manifest.json
├─ service-worker.js
├─ styles.css
├─ app.js
├─ data.js
├─ README.md
├─ README-UPDATE.md
├─ docs/
│  └─ religious-content-policy.md
└─ assets/
   ├─ icon.svg
   ├─ maskable.svg
   └─ apple-touch-icon.svg
```

## Uruchomienie lokalne

Aplikację można otworzyć bezpośrednio przez `index.html`, ale tryb PWA, service worker i instalacja na ekranie głównym wymagają `http://localhost` albo hostingu HTTPS.

Najprościej uruchomić lokalny statyczny podgląd:

```powershell
python -m http.server 8080
```

Potem otwórz:

```text
http://localhost:8080
```

Nie jest potrzebny backend ani baza danych. Po pierwszym wczytaniu service worker zapisuje pliki aplikacji w cache, a postęp użytkownika trafia do `localStorage`.

## Kontrola jakości

Projekt ma lekkie skrypty kontrolne bez zależności npm:

```powershell
npm run lint
npm test
npm run content:report
```

`lint` sprawdza składnię głównych plików JS, `test` uruchamia walidację danych islamskich i podstawową kontrolę jakości kodu, a `content:report` pokazuje lokalny raport przeglądu treści bez zależności npm i bez internetu. Raport liczy FAQ wyłącznie z `data.js` i pokazuje rozkład FAQ po `confidence`, `source_type` oraz `high_risk`. Docelowa walidacja oczekuje 44 FAQ w `data.js`, formalnych metadanych `source_type`, `confidence` i `reviewed_at` przy każdym FAQ oraz braku przejściowych `FAQ_REFERENCE_FIXES`, `faqExtraUnique` / extra FAQ w `app.js`.

## AI Assistant

Aplikacja ma globalny pływający przycisk `AI Assistant`, widoczny na każdej stronie. Assistant uzywa Groq API przez bezpieczny endpoint proxy:

- model: `llama-3.3-70b-versatile`
- endpoint aplikacji: `/api/groq-proxy`
- klucz API nalezy ustawic w zmiennej srodowiskowej `GROQ_API_KEY`

AI działa online i jest ograniczone do pytań oraz porad o islamie, muzułmanach, konwersji, rodzinie, Koranie i modlitwie. Reszta aplikacji nadal działa offline po zcache'owaniu PWA.

Treści islamskie w aplikacji mają osobną politykę odpowiedzialności: widoczny disclaimer, poziomy zaufania treści i metadane źródeł. Szczegóły są w `docs/religious-content-policy.md`.

Assistant nie tworzy już fiszek, quizów, bajek ani ciekawostek AI. Gotowe ćwiczenia są kuratorowane w sekcjach aplikacji, a AI pełni rolę doradcy i wsparcia w rozmowach o islamie.

## Funkcje

- Strona główna z serią dni, poziomem, paskiem postępu i zadaniem dnia.
- Alfabet: 28 liter, 4 formy każdej litery, wymowa i przykłady.
- Mini-lekcje `Pierwsze słowa i zwroty`, odblokowane po opanowaniu alfabetu.
- Fiszki: litery, słowa i własne karty, tryby losowo / nieznane / powtórki, prosty algorytm SM-2.
- Zaawansowana wymowa: SpeechRecognition, wzorzec TTS, nagrywanie własnej wymowy i odsłuch.
- Pisanie: canvas z półprzezroczystą literą do przerysowania.
- Moje Książeczki: PDF jako plik lub link, viewer oraz interaktywne książeczki z kartami i wymową.
- Kultura: krótkie, kuratorowane notatki o codzienności muzułmanów i rozmowie z rodziną.
- Gry: quizy aplikacji, Memory Match, Dhikr Speed, Historia Quiz i 99 Imion Challenge.
- Light / Dark mode.
- Confetti przy sukcesach.

## Instalacja na telefonie

### Android / Chrome

1. Otwórz aplikację przez adres HTTPS albo lokalny adres dostępny w sieci telefonu.
2. Wejdź w menu Chrome.
3. Wybierz `Dodaj do ekranu głównego` lub `Zainstaluj aplikację`.

### iPhone / Safari

1. Otwórz aplikację w Safari.
2. Kliknij ikonę udostępniania.
3. Wybierz `Do ekranu początkowego`.

## Ważne uwagi offline

Tailwind CSS i pdf.js są ładowane przez CDN zgodnie z wymaganiem. Po pierwszym udanym uruchomieniu przez HTTP/HTTPS service worker próbuje je zapisać w cache. Jeżeli chcesz absolutnego offline już od pierwszego otwarcia, pobierz te zasoby i podmień linki CDN na lokalne pliki.

AI Assistant wymaga internetu, bo używa Groq API. SpeechRecognition oraz synteza mowy zależą od obsługi danej przeglądarki i mogą na części urządzeń korzystać z usług systemowych online.


## Contributing (English)

Alif AI is a Polish-language Arabic/Islamic learning PWA. Contributions welcome.

### Setup

```bash
python -m http.server 8080
# Open http://localhost:8080
```

### Architecture

- `app.js` — monolithic app (planned modularization in v2)
- `data.js` — all static Islamic content
- `data/*.js` — modular content: prayer, quran, hadith, FAQ, halal/haram
- `service-worker.js` — offline caching
- `scripts/` — validation and build helpers

### Religious content policy

See `docs/religious-content-policy.md`. All Islamic content requires `source_type`, `confidence`, and `reviewed_at` metadata.

### Running tests

```bash
npm test          # validates Islamic data integrity
npm run lint      # checks JS syntax
```
