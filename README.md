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

## AI Assistant

Aplikacja ma globalny pływający przycisk `AI Assistant`, widoczny na każdej stronie. Assistant używa Groq API:

- model: `llama-3.3-70b-versatile`
- endpoint: `https://api.groq.com/openai/v1/chat/completions`
- klucz API jest wpisany bezpośrednio w `app.js`

AI działa online. Reszta aplikacji nadal działa offline po zcache'owaniu PWA.

Assistant może generować treści i zapisywać je bezpośrednio do aplikacji:

- `Dodaj do fiszek`
- `Zapisz jako nową książeczkę`
- `Dodaj do Naszej Przygody`
- `Dodaj jako ciekawostkę`

## Funkcje

- Strona główna z serią dni, poziomem, paskiem postępu i zadaniem dnia.
- Alfabet: 28 liter, 4 formy każdej litery, wymowa i przykłady.
- Mini-lekcje `Pierwsze słowa i zwroty`, odblokowane po opanowaniu alfabetu.
- Fiszki: litery, słowa i fiszki AI, tryby losowo / nieznane / powtórki, prosty algorytm SM-2.
- Zaawansowana wymowa: SpeechRecognition, wzorzec TTS, nagrywanie własnej wymowy i odsłuch.
- Pisanie: canvas z półprzezroczystą literą do przerysowania.
- Nasza Przygoda 2.0: wiele zdjęć, lokalna galeria i historyjki generowane przez AI.
- Moje Książeczki: PDF jako plik lub link, viewer oraz interaktywne książeczki z kartami i wymową.
- Kultura: ciekawostka dnia generowana przez AI.
- Gry: quiz, Memory Match i `Łap literę`.
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

AI Assistant, generowanie historyjek i ciekawostek wymagają internetu, bo używają Groq API. SpeechRecognition oraz synteza mowy zależą od obsługi danej przeglądarki i mogą na części urządzeń korzystać z usług systemowych online.
