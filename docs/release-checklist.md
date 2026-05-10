# Release checklist

Przed publikacja Alif AI przejdz te punkty:

- Uruchom `npm.cmd run verify:full`.
- Uruchom `npm.cmd run lhci` i sprawdz raport w `lighthouse-report/alif-ai.report.html`.
- Sprawdz recznie Start, Quran, Prayer Mode, Islam FAQ, Ustawienia oraz backup/import.
- Upewnij sie, ze kalkulator zakat, romantyczne elementy i lokalne slowka nie wrocily do aplikacji.
- Przed publicznym wydaniem przenies klucz Groq/API poza kod klienta.
- Sprawdz `manifest.json`, ikony PWA i instalacje na telefonie.
- Wyeksportuj backup testowy i zaimportuj go w czystej przegladarce.
- Przejrzyj tresci religijne: komunikat edukacyjny, zrodla i wysokie ryzyko interpretacji.
