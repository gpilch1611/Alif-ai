# Narzędzia jakości dla vibe codingu

Ten projekt ma teraz kilka narzędzi, których Codex może używać podczas zmian w kodzie.

## Najprostsza komenda

```powershell
npm.cmd run verify:full
```

Odpala:

- składnię JS,
- walidatory danych islamskich,
- raport treści,
- ESLint,
- Prettier check,
- TypeScript/JSDoc type checking,
- Knip,
- Playwright + axe.

## Pojedyncze narzędzia

```powershell
npm.cmd run lint:eslint
```

Szuka błędów JS i podejrzanych fragmentów. Ostrzeżenia o martwym kodzie są przydatną listą sprzątania.

```powershell
npm.cmd run format:check
npm.cmd run format
```

Sprawdza lub formatuje nowe/configowe pliki. Stary duży `app.js` nie jest na razie masowo formatowany, żeby nie robić ogromnego szumu w diffach.

```powershell
npm.cmd run typecheck
```

Sprawdza typy przez TypeScript/JSDoc bez przepisywania projektu na TypeScript.

```powershell
npm.cmd run knip
```

Szuka martwych plików, zależności i eksportów.

```powershell
npm.cmd run test:e2e
```

Odpala Playwright i axe: realne kliknięcia w przeglądarce oraz podstawowe testy dostępności.

```powershell
npm.cmd run lhci
```

Uruchamia lokalny audyt Lighthouse przez Chrome/Edge i zapisuje raporty do `lighthouse-report/alif-ai.report.html` oraz `lighthouse-report/alif-ai.report.json`. To narzędzie jest raportem pomocniczym do decyzji o wydajności, SEO i dostępności.
