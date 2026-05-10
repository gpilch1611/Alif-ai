# Playwright w Alif AI

Playwright uruchamia aplikację jak prawdziwy użytkownik w przeglądarce. W tym projekcie sprawdza między innymi ekran Start po polsku, brak kalkulatora zakat, Dziennik nauki, Islam i ustawienia prywatności.

## Najważniejsze komendy

```powershell
npm.cmd run test:e2e
```

Uruchamia testy desktop + mobile w tle.

```powershell
npm.cmd run test:e2e:headed
```

Uruchamia testy w widocznej przeglądarce. Dobre do nauki, bo widzisz, gdzie Playwright klika.

```powershell
npm.cmd run test:e2e:ui
```

Otwiera tryb UI Playwrighta: możesz wybierać testy, odpalać je pojedynczo i oglądać przebieg.

```powershell
npm.cmd run verify:full
```

Uruchamia zwykłą weryfikację projektu oraz testy Playwright.

## Jak czytać błąd

Gdy test nie przejdzie, Playwright zapisuje materiały w:

```text
test-results/
playwright-report/
```

Najczęściej patrz na:

- `error-context.md` — opis błędu i snapshot strony.
- `test-failed-1.png` — screenshot w momencie błędu.
- `npm.cmd run test:e2e:report` — raport HTML po testach.

## Gdzie są testy

```text
tests/smoke.spec.js
```

Każdy test ma prosty scenariusz:

1. Otwórz aplikację.
2. Wykonaj akcję użytkownika.
3. Sprawdź, czy ważny tekst, przycisk albo układ istnieje.

Przykład:

```js
await page.goto("/");
await expect(page.locator(".home-quick-card")).toHaveCount(5);
```

To znaczy: otwórz Start i sprawdź, czy jest 5 szybkich kafelków.

## Jak dodać nowy test

Dodaj kolejny blok w `tests/smoke.spec.js`:

```js
test("opis co sprawdzam", async ({ page }) => {
  await page.goto("/#islam");
  await expect(page.getByText("FAQ islamu")).toBeVisible();
});
```

Najlepsza zasada: testuj zachowanie użytkownika, nie wewnętrzne szczegóły kodu.
