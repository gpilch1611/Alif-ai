# README-FIX

## Audyt i naprawy

Naprawiono:

- `Ćwiczenie pisania`: poprzedni algorytm był zbyt surowy i dawał niskie wyniki nawet przy dobrym śledzeniu. Teraz ocena jest bardziej tolerancyjna dla palca/rysika na telefonie, pokazuje procent, a dobra próba może wejść w zakres `bardzo dobrze`.
- `Ćwiczenie pisania`: półprzezroczysty wzór idealny jest wyraźniejszy, ma zielone wypełnienie i złoty kontur do śledzenia.
- `Fiszki`: tył karty ma bezpieczny fallback. Karty AI/PDF nie powinny już mieć pustej lub zbugowanej odwrotnej strony.
- `Alfabet`: licznik poznanych liter aktualizuje się natychmiast po kliknięciu litery oraz po otwarciu szczegółów `i`.
- `Głośnik`: zwiększono rozmiar, kontrast, obramowanie i stabilność `SpeechSynthesis`. Funkcja próbuje użyć arabskiego głosu `ar-SA`, gdy jest dostępny.
- `Memory Match`: karty są większe, arabskie litery mają większy font i pozostaje układ `5x5`.
- `EN mode`: przetłumaczono kolejne widoczne teksty w fiszkach, książeczkach, kulturze, grach i memory.
- `Theme`: dodano działający wybór `Romantic` oraz `Dark` w Ustawieniach. Romantic to kremowo-różowy light theme ze złotymi akcentami.
- `Mobile`: zwiększono wysokość fiszek i kafelków alfabetu oraz poprawiono czytelność elementów dotykowych.

## Romantyczny klimat

Dodano:

- Więcej miękkich gradientów, złota i subtelnych różowych akcentów.
- Delikatne dekoracje kwiatowe w tle: 🌸 🌺 💐 ❤️ 💕.
- Losowe romantyczne toasty co około 8-15 minut używania.
- Krótkie romantyczne teksty po polsku, angielsku i indonezyjsku, np. `Kocham Cię, Baby`, `Habibi`, `Aku sayang kamu`.
- AI Assistant po części odpowiedzi może pokazać subtelny romantyczny toast.

## PWA

- Cache podniesiono do `alif-ai-v6`, aby telefony pobrały świeżą wersję.

## Test po zmianach

1. Uruchom:

```powershell
python -m http.server 8080
```

2. Otwórz:

```text
http://localhost:8080
```

3. Sprawdź:

- Alfabet: klik litery zwiększa licznik i odtwarza wymowę.
- Fiszki: przód ma arabski tekst i głośnik, tył ma tłumaczenie/transliterację.
- Pisanie: pusta próba daje 0%, a realne śledzenie wzoru daje dużo wyższy procent.
- Memory Match: arabskie litery są czytelne na telefonie.
- Ustawienia: przełącz `Romantic` / `Dark` i `PL` / `EN`.
