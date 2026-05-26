# Playwright w Alif AI

Playwright uruchamia aplikację jak prawdziwy użytkownik w przeglądarce. W tym projekcie sprawdza między innymi ekran Start po polsku, brak kalkulatora zakat, Historię, Islam i ustawienia prywatności.

## NajwaĹĽniejsze komendy

```powershell
npm.cmd run test:e2e
```

Uruchamia testy desktop + mobile w tle.

```powershell
npm.cmd run test:e2e:headed
```

Uruchamia testy w widocznej przeglÄ…darce. Dobre do nauki, bo widzisz, gdzie Playwright klika.

```powershell
npm.cmd run test:e2e:ui
```

Otwiera tryb UI Playwrighta: moĹĽesz wybieraÄ‡ testy, odpalaÄ‡ je pojedynczo i oglÄ…daÄ‡ przebieg.

```powershell
npm.cmd run verify:full
```

Uruchamia zwykĹ‚Ä… weryfikacjÄ™ projektu oraz testy Playwright.

## Jak czytaÄ‡ bĹ‚Ä…d

Gdy test nie przejdzie, Playwright zapisuje materiaĹ‚y w:

```text
test-results/
playwright-report/
```

NajczÄ™Ĺ›ciej patrz na:

- `error-context.md` â€” opis bĹ‚Ä™du i snapshot strony.
- `test-failed-1.png` â€” screenshot w momencie bĹ‚Ä™du.
- `npm.cmd run test:e2e:report` â€” raport HTML po testach.

## Gdzie sÄ… testy

```text
tests/smoke.spec.js
```

KaĹĽdy test ma prosty scenariusz:

1. OtwĂłrz aplikacjÄ™.
2. Wykonaj akcjÄ™ uĹĽytkownika.
3. SprawdĹş, czy waĹĽny tekst, przycisk albo ukĹ‚ad istnieje.

PrzykĹ‚ad:

```js
await page.goto("/");
await expect(page.locator(".learning-center-card")).toHaveCount(4);
```

To znaczy: otwórz Start i sprawdź, czy Centrum nauki ma 4 kafelki.

## Jak dodaÄ‡ nowy test

Dodaj kolejny blok w `tests/smoke.spec.js`:

```js
test("opis co sprawdzam", async ({ page }) => {
  await page.goto("/#islam");
  await expect(page.getByText("FAQ islamu")).toBeVisible();
});
```

Najlepsza zasada: testuj zachowanie uĹĽytkownika, nie wewnÄ™trzne szczegĂłĹ‚y kodu.
