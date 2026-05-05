# README-UPDATE

## Romantyczna aktualizacja Alif AI

Zmieniono i dodano:

- Nowy ciepły light theme: krem, subtelny róż, zielony i dużo eleganckiego złota.
- Miękkie cienie, złote obramowania, romantyczne gradienty i delikatniejsze tła.
- Nowe logo SVG: elegancka litera `ا` z gradientem zielono-złotym oraz napis `Alif AI`.
- Ekran pierwszego wyboru profilu: `Abang` albo `Princess`, zapisywany w `localStorage`.
- Przycisk przełączania profilu na stronie głównej oraz w `Ustawieniach`.
- Szybki przełącznik języka `PL/EN` w headerze, obok motywu.
- Nowy widget na stronie głównej:
  - godzina w Myślenicach i Surabayi z AM/PM,
  - wizualizacja dystansu Myślenice ↔ Surabaya,
  - odliczanie do 11.06.2026.
- Alfabet: kliknięcie litery odtwarza wymowę, przycisk `i` otwiera modal.
- Głośniki są bardziej widoczne i używają wspólnego złotego stylu.
- Fiszki: naprawiony pusty tył karty; tył zawsze pokazuje tłumaczenie i transliterację.
- Pisanie: lepszy algorytm oceny z procentem dopasowania.
- Pisanie: ocena `bardzo dobrze / very good` dla świetnych prób.
- Pisanie: motywujące komunikaty, np. `92% - prawie idealnie, Gantengku!`.
- Pisanie: historia 10 prób z miniaturą canvasu.
- Nasza Przygoda 2.0:
  - po zdjęciu aplikacja pyta, czy generować nową historyjkę,
  - własny kierunek/temat,
  - czyszczenie surowych markdown linków,
  - romantyczny prompt AI,
  - akcje `Save as new book`, `Add all words to flashcards`, `Save to gallery`,
  - `Save to gallery` pyta o własną nazwę wspomnienia.
- PDF książeczki:
  - bezpieczniejszy import PDF,
  - elegancki flipbook z animacją,
  - klikalne arabskie słowa/karty,
  - wymowa i `Add to flashcards`.
- Ustawienia:
  - PL/EN,
  - profil,
  - reset dnia,
  - reset progresu nauki,
  - reset streak,
  - eksport/import JSON,
  - czyszczenie danych,
  - historia ostatnich 25 interakcji AI.
- AI Assistant zostaje na Groq, ale historia jest limitowana do ostatnich 25 wiadomości.
- Cache PWA podniesiony do `alif-ai-v5`.
- Pełniejszy manifest PWA z ikonami PNG `192x192`, `512x512` i maskable.
- Custom install prompt: przycisk `Zainstaluj aplikację` na stronie głównej i w Ustawieniach.
- Dolna nawigacja zoptymalizowana pod telefon jako przewijany pasek dotykowy.
- Dodano [README-INSTALL.md](README-INSTALL.md) z instrukcją instalacji na Androidzie, iPhonie i wysłania linku żonie.

## Test

Uruchom:

```powershell
python -m http.server 8080
```

Otwórz:

```text
http://localhost:8080
```

Sprawdź po kolei:

1. Wyczyść dane w Ustawieniach i odśwież, aby zobaczyć ekran wyboru profilu.
2. Przełącz `PL/EN` w headerze.
3. Kliknij literę w Alfabecie i osobno przycisk `i`.
4. Otwórz Fiszki i sprawdź przód/tył oraz głośnik.
5. W Pisaniu wykonaj pustą, słabą i dobrą próbę.
6. Wgraj zdjęcie w Naszej Przygodzie i wygeneruj romantyczną historię.
7. Dodaj PDF i otwórz flipbook.
8. Sprawdź widget Myślenice ↔ Surabaya na stronie głównej.
