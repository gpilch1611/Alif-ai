import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function expectNoOverflow(locator) {
  const boxes = await locator.evaluateAll((nodes) =>
    nodes.map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        text: node.textContent?.trim() || "",
        scrollWidth: node.scrollWidth,
        clientWidth: node.clientWidth,
        scrollHeight: node.scrollHeight,
        clientHeight: node.clientHeight,
        width: rect.width,
        height: rect.height
      };
    })
  );

  for (const box of boxes) {
    expect
      .soft(box.scrollWidth, `${box.text} should not overflow horizontally`)
      .toBeLessThanOrEqual(box.clientWidth + 1);
    expect
      .soft(box.scrollHeight, `${box.text} should not overflow vertically`)
      .toBeLessThanOrEqual(box.clientHeight + 1);
    expect.soft(box.width, `${box.text} should have a visible width`).toBeGreaterThan(20);
    expect.soft(box.height, `${box.text} should have a visible height`).toBeGreaterThan(20);
  }
}

test.describe("Alif AI smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto("/");
  });

  test("Start in Polish keeps quick cards and stat cards inside their boxes", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Islam/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Co robimy teraz/ })).toBeVisible();
    await expect(page.locator(".home-quick-card")).toHaveCount(5);
    await expectNoOverflow(page.locator(".home-quick-card"));
    await expectNoOverflow(page.locator(".home-stat-card"));
    await expect(page.locator("body")).not.toContainText("Kalkulator zakat");
  });

  test("Start stays within viewport with many Quran favorites", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "alif-ai-state",
        JSON.stringify({
          lang: "pl",
          theme: "light",
          quranSurahFavorites: Array.from({ length: 60 }, (_, index) => index + 1),
          quranFavorites: Array.from({ length: 60 }, (_, index) => ({
            num: String(index + 1),
            surahName: `Very long favorite surah name ${index + 1}`
          })),
          quranDuaFavorites: Array.from({ length: 20 }, (_, index) => `dua_${index + 1}`)
        })
      );
    });
    await page.goto("/");
    await expect(page.locator(".home-favorites-strip")).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(2);
    await expectNoOverflow(page.locator(".home-favorite-card").first());
  });

  test("removed route falls back to Start", async ({ page }) => {
    await page.goto("/#zakat");
    await expect(page).toHaveURL(/#home$/);
    await expect(page.getByRole("heading", { name: /Islam/ })).toBeVisible();
  });

  test("Islam and journal routes render expected replacement features", async ({ page }) => {
    await page.goto("/#islam");
    await expect(page.getByRole("button", { name: /Słownik|Slownik/ })).toBeVisible();
    await expect(page.locator("body")).not.toContainText("Kalkulator zakat");

    await page.goto("/#adventure");
    await expect(page.getByRole("heading", { name: /Dziennik nauki/ })).toBeVisible();
    await expect(page.getByText(/Nastepny maly krok|Następny mały krok/)).toBeVisible();
    await expect(page.getByRole("button", { name: /Wygeneruj wpis AI/ })).toBeVisible();
  });

  test("Prayer Mode renders center tabs and rakat-aware guide", async ({ page }) => {
    await page.goto("/#prayer");
    await expect(page.getByRole("heading", { name: /Prayer Mode/ })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Dzisiaj/ })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Przewodnik/ })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Wudu/ })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Qibla\/Czasy/ })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Historia/ })).toBeVisible();

    await page.getByRole("tab", { name: /Przewodnik/ }).click();
    await expect(page.getByRole("button", { name: /Fadżr|Fajr/ })).toContainText("2 raka'at");
    await expect(page.getByRole("button", { name: /Maghrib/ })).toContainText("3 raka'at");
    await expect(page.getByRole("button", { name: /Isza|Isha/ })).toContainText("4 raka'at");
    await page.getByRole("button", { name: /Pełny ekran|Pelny ekran/ }).click();
    await expect(page.locator(".prayer-guide-card-focus")).toBeVisible();
  });

  test("legacy Prayer Guide route opens the new Prayer Mode guide tab", async ({ page }) => {
    await page.goto("/#prayerGuide");
    await expect(page.getByRole("heading", { name: /Prayer Mode/ })).toBeVisible();
    await expect(page.getByRole("tab", { name: /Przewodnik/ })).toHaveClass(/active/);
    await expect(page.getByRole("tab", { name: /Dzisiaj/ })).toBeVisible();
    await expect(page.locator(".prayer-guide-card")).toBeVisible();
  });

  test("Prayer Mode saves wudu checklist and prayer history", async ({ page }) => {
    await page.goto("/#prayer");
    await page.getByRole("tab", { name: /Wudu/ }).click();
    await page.locator("[data-wudu-step]").first().check();
    await expect
      .poll(() =>
        page.evaluate(() => JSON.parse(localStorage.getItem("alif-ai-state") || "{}").wuduChecklist?.length || 0)
      )
      .toBe(1);

    await page.getByRole("tab", { name: /Dzisiaj/ }).click();
    await page.locator("[data-prayer-log='Fajr']").check();
    await expect
      .poll(() =>
        page.evaluate(
          () =>
            JSON.parse(localStorage.getItem("alif-ai-state") || "{}").prayerLog?.[new Date().toISOString().slice(0, 10)]
              ?.Fajr
        )
      )
      .toBe(true);

    await page.getByRole("tab", { name: /Historia/ }).click();
    await expect(page.getByText(new Date().toISOString().slice(0, 10))).toBeVisible();
    await expect(page.getByText("1/5")).toBeVisible();
  });

  test("Prayer Mode keeps GPS optional and shows manual fallback on denial", async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "geolocation", {
        configurable: true,
        value: {
          getCurrentPosition(_success, error) {
            error({ code: 1, message: "denied" });
          }
        }
      });
    });
    await page.goto("/#prayer");
    await page.getByRole("tab", { name: /Qibla\/Czasy/ }).click();
    await expect(page.getByRole("button", { name: /Użyj GPS|Uzyj GPS/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Wpisz ręcznie|Wpisz recznie/ })).toBeVisible();
    await page.getByRole("button", { name: /Użyj GPS|Uzyj GPS/ }).click();
    await expect(page.locator("#gpsPrayerStatus")).toContainText(/fallback|ręczny|reczny/i);
  });

  test("settings exposes privacy and backup controls", async ({ page }) => {
    await page
      .getByRole("button", { name: /Ustawienia/ })
      .first()
      .click();
    await expect(page.getByRole("heading", { name: /Prywatnosc danych|Prywatność danych/ })).toBeVisible();
    await expect(page.getByRole("heading", { name: /Backup/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Eksport postępu/ })).toBeVisible();
    await expect(page.locator("#importStateFile")).toBeVisible();
  });

  test("backup export downloads JSON and import restores state", async ({ page }) => {
    await page.goto("/#settings");

    await page.locator("#importStateFile").setInputFiles({
      name: "alif-ai-backup-seed.json",
      mimeType: "application/json",
      buffer: Buffer.from(
        JSON.stringify({
          app: "Alif AI",
          version: "test",
          state: { points: 321, learnedLetters: ["alif"] }
        }),
        "utf8"
      )
    });
    await expect
      .poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("alif-ai-state") || "{}").points))
      .toBe(321);

    const downloadPromise = page.waitForEvent("download");
    await page.locator("#exportStateBtn").click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/^alif-ai-backup-\d{4}-\d{2}-\d{2}\.json$/);
    const stream = await download.createReadStream();
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const exported = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    expect(exported.app).toBe("Alif AI");
    expect(exported.state.points).toBe(321);

    const backup = {
      app: "Alif AI",
      version: "test",
      state: {
        lang: "en",
        points: 777,
        learnedLetters: ["ba"],
        groqApiKey: "keep-local-api-key"
      }
    };
    await page.locator("#importStateFile").setInputFiles({
      name: "alif-ai-backup-test.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(backup), "utf8")
    });

    await expect
      .poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("alif-ai-state") || "{}").points))
      .toBe(777);
    await expect(page.getByRole("heading", { name: /Settings/ })).toBeVisible();
    const restored = await page.evaluate(() => JSON.parse(localStorage.getItem("alif-ai-state") || "{}"));
    expect(restored.lang).toBe("en");
    expect(restored.learnedLetters).toEqual(["ba"]);
    expect(restored.groqApiKey).toBe("keep-local-api-key");
  });

  test("Start has no serious automated accessibility violations", async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .disableRules(["color-contrast"])
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const serious = results.violations.filter((violation) => ["critical", "serious"].includes(violation.impact || ""));
    expect(serious).toEqual([]);
  });
});
