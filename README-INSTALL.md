# Instalacja Alif AI na telefonie

Alif AI jest Progressive Web App. Nie wymaga sklepu Play ani App Store. Po instalacji działa jak aplikacja z ikony na ekranie głównym, a większość funkcji działa offline. Internet jest potrzebny tylko do AI Assistant / Groq oraz pierwszego pobrania zasobów CDN.

## Uruchomienie lokalne

Na komputerze w folderze projektu uruchom:

```powershell
python -m http.server 8080
```

Otwórz:

```text
http://localhost:8080
```

Na telefonie użyj adresu komputera w tej samej sieci Wi-Fi, np.:

```text
http://192.168.1.20:8080
```

Adres IP komputera sprawdzisz w PowerShell:

```powershell
ipconfig
```

## Android / Chrome

1. Otwórz Alif AI w Chrome.
2. Kliknij przycisk `Zainstaluj aplikację` na stronie głównej albo w `Ustawieniach`.
3. Jeśli przycisk systemowy się nie pokaże, użyj menu `⋮`.
4. Wybierz `Zainstaluj aplikację` albo `Dodaj do ekranu głównego`.
5. Uruchom Alif AI z nowej ikony.

## iPhone / Safari

1. Otwórz Alif AI w Safari.
2. Kliknij ikonę udostępniania.
3. Wybierz `Do ekranu początkowego`.
4. Potwierdź nazwę `Alif AI`.
5. Uruchom aplikację z ikony na ekranie początkowym.

Na iPhone przycisk `Zainstaluj aplikację` pokazuje instrukcję, bo Safari nie obsługuje `beforeinstallprompt`.

## Jak wysłać żonie

Najprościej:

1. Wrzuć cały folder projektu na hosting statyczny HTTPS, np. GitHub Pages, Netlify albo Vercel.
2. Wyślij Baby link HTTPS.
3. Poproś, żeby otworzyła link w Safari lub Chrome i dodała aplikację do ekranu głównego.

Do testów w tej samej sieci Wi-Fi możesz wysłać jej lokalny adres komputera, np.:

```text
http://192.168.1.20:8080
```

Telefon i komputer muszą być w tej samej sieci, a firewall Windows musi pozwalać na połączenia do Pythona / portu `8080`.

## Offline

Po pierwszym wejściu przez HTTP/HTTPS service worker zapisuje pliki aplikacji w cache. Następne otwarcia działają offline, poza funkcjami AI i usługami przeglądarki zależnymi od internetu.
