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

async function mockSurahApi(page, surahNumber = 1) {
  await page.route(`**/v1/surah/${surahNumber}/**`, async (route) => {
    const url = route.request().url();
    const isTransliteration = url.includes("en.transliteration");
    const isTranslation = url.includes("pl.bielawskiego") || url.includes("en.asad");
    await route.fulfill({
      contentType: "application/json",
      body: JSON.stringify({
        code: 200,
        data: {
          number: surahNumber,
          name: "الفاتحة",
          englishName: "Al-Fatiha",
          englishNameTranslation: "The Opening",
          ayahs: [
            {
              number: 1,
              numberInSurah: 1,
              text: isTransliteration
                ? "Bismi Allahi alrrahmani alrraheemi"
                : isTranslation
                  ? "W imię Boga Miłosiernego, Litościwego"
                  : "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
              audio: "https://example.test/fatiha-1.mp3"
            }
          ]
        }
      })
    });
  });
}

test.describe("Alif AI smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem("alif-ai-state", JSON.stringify({ lang: "pl", theme: "light", onboardingComplete: true }));
    });
    await page.goto("/");
  });

  test("New users see full-screen onboarding first", async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /Wybierz pierwsza sciezke|Choose your first path/ })).toBeVisible();
    await expect(page.locator("[data-onboarding-goal]")).toHaveCount(5);
    await expect(page.locator(".home-stat-card")).toHaveCount(0);
  });

  test("Start in Polish keeps learning center and stat cards inside their boxes", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Islam/ })).toBeVisible();
    await expect(page.locator(".home-quick-card")).toHaveCount(0);
    await expect(page.locator("[data-stat-action='level']")).toBeVisible();
    await page.locator("[data-stat-action='level']").click();
    await expect(page.locator("#levelDetails")).toBeVisible();
    await expectNoOverflow(page.locator(".home-stat-card"));
    await expectNoOverflow(page.locator(".level-activity"));
    await expect(page.locator("body")).not.toContainText("Kalkulator zakat");
    await expect(page.locator("body")).not.toContainText("Poznane dua");
  });

  test("Start stays within viewport with many Quran favorites", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "alif-ai-state",
        JSON.stringify({
          lang: "pl",
          theme: "light",
          onboardingComplete: true,
          quranSurahFavorites: Array.from({ length: 60 }, (_, index) => index + 1),
          quranFavorites: Array.from({ length: 60 }, (_, index) => ({
            num: String(index + 1),
            surahName: `Very long favorite surah name ${index + 1}`,
            trans: `Very long favorite translation text ${index + 1}`
          })),
          quranDuaFavorites: ["bismillah", "after_eating", "leaving_home"]
        })
      );
    });
    await page.goto("/?favorites=1");
    await expect(page.locator(".home-favorites-carousel")).toHaveCount(3);
    await expect(page.locator(".home-carousel-track").first()).toBeVisible();
    await expect(page.locator(".home-carousel-card").first()).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(2);
    await expectNoOverflow(page.locator(".home-carousel-card").first());
  });

  test("Home favorite carousels link to Quran sections", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "alif-ai-state",
        JSON.stringify({
          lang: "pl",
          theme: "light",
          onboardingComplete: true,
          quranSurahFavorites: [1, 2],
          quranDuaFavorites: ["bismillah"],
          quranFavorites: [{ num: "2", surahName: "Al-Fatiha", trans: "The Opening" }]
        })
      );
    });
    await page.goto("/");
    await page.locator(".home-favorites-carousel").nth(0).locator(".home-carousel-card").first().click();
    await expect(page).toHaveURL(/#koran$/);

    await page.goto("/");
    await page.locator(".home-favorites-carousel").nth(1).locator(".home-carousel-card").first().click();
    await expect(page).toHaveURL(/#koran$/);
    await expect(page.getByRole("button", { name: /Dua/ })).toHaveClass(/border-emerald-500/);

    await page.goto("/");
    await page.locator(".home-favorites-carousel").nth(2).locator(".home-carousel-card").first().click();
    await expect(page).toHaveURL(/#koran$/);
    await expect(page.getByRole("button", { name: /Ulubione|Favorites/ })).toHaveClass(/border-emerald-500/);
  });

  test("Home surah favorite opens a focused Quran reader", async ({ page }) => {
    await mockSurahApi(page, 1);
    await page.addInitScript(() => {
      localStorage.setItem(
        "alif-ai-state",
        JSON.stringify({
          lang: "pl",
          theme: "light",
          onboardingComplete: true,
          quranTab: "dua",
          quranSurahFavorites: [1],
          quranDuaFavorites: [],
          quranFavorites: []
        })
      );
    });
    await page.goto("/");
    await page.locator(".home-favorites-carousel").nth(0).locator(".home-carousel-card").first().click();
    await expect(page).toHaveURL(/#koran$/);
    await expect(page.getByRole("button", { name: /Sury|Surahs/ })).toHaveClass(/border-emerald-500/);
    await expect(page.locator("#tabSurahs")).toBeVisible();
    await expect(page.locator(".surah-reader[data-open-surah='1']")).toBeVisible();
    await expect(page.locator(".surah-reader")).toContainText("Al-Fatiha");
  });

  test("Islamic calendar opens from Home and renders Hijri months", async ({ page }) => {
    await page.locator(".hijri-widget").click();
    await expect(page).toHaveURL(/#calendar$/);
    await expect(page.getByRole("heading", { name: /Kalendarz islamski|Islamic calendar/ })).toBeVisible();
    await expect(page.locator(".calendar-month-card")).toHaveCount(12);
    await expect(page.locator(".calendar-month-card.is-current")).toBeVisible();
    await expect(page.locator("body")).toContainText(/obserwacji księżyca|moon sighting/);
  });

  test("Learning journal navigation uses an icon instead of Note text", async ({ page }) => {
    await expect(page.locator("#bottomNav")).not.toContainText("Note");
    await expect(page.locator("#moreNavBtn")).toHaveCount(1);
  });

  test("99 Names Challenge accepts prefixes, meanings and simple typos once", async ({ page }) => {
    await page.goto("/#games");
    await page.locator("[data-game='asmaChallenge']").click();
    await expect(page.locator("#asmaChallengeBox")).toBeVisible();
    await page.locator("#asmaInput").fill("ar rahman");
    await page.locator("#asmaAdd").click();
    await expect(page.locator("#asmaScore")).toHaveText("1 / 99");
    await expect(page.locator("#asmaFound")).toContainText(/Ar-Rahman/i);

    await page.locator("#asmaInput").fill("rahman");
    await page.locator("#asmaAdd").click();
    await expect(page.locator("#asmaScore")).toHaveText("1 / 99");

    await page.locator("#asmaInput").fill("merciful");
    await page.locator("#asmaAdd").click();
    await expect(page.locator("#asmaScore")).toHaveText("2 / 99");
  });

  test("Review center lists active mistakes and opens practice", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "alif-ai-state",
        JSON.stringify({
          lang: "pl",
          theme: "light",
          onboardingComplete: true,
          reviewMistakes: {
            "quiz:alif": 2,
            "surah:112": 1
          }
        })
      );
    });
    await page.goto("/?review=active#review");
    await expect(page.getByRole("heading", { name: /Do poprawy|To improve/ })).toBeVisible();
    await expect(page.locator(".review-card")).toHaveCount(2);
    await expect(page.locator(".review-card").first()).toContainText(/Alif|Al-Ikhlas/);
    await page
      .locator(".review-card")
      .filter({ hasText: /Quiz liter|Letter quiz/ })
      .getByRole("button")
      .click();
    await expect(page).toHaveURL(/#games$/);
    await expect(page.locator("#quizBox")).toBeVisible();
  });

  test("Review center sanitizes and clears active mistakes", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        "alif-ai-state",
        JSON.stringify({
          lang: "pl",
          theme: "light",
          onboardingComplete: true,
          reviewMistakes: {
            "quiz:ba": 2,
            "surah:112": "bad",
            "unknown:<script>": 7,
            "memory:ta": 120
          }
        })
      );
    });
    await page.goto("/?review-sanitize=1#review");
    await expect(page.locator(".review-card")).toHaveCount(2);
    await expect(page.locator("body")).not.toContainText("script");
    await page.locator("#clearReviewMistakes").click();
    await expect(page.locator(".review-card")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /Czysto|All clear/ })).toBeVisible();
  });

  test("Mobile nav More and AI button do not overlap", async ({ page }) => {
    const viewport = page.viewportSize();
    if (!viewport || viewport.width >= 640) return;
    const boxes = await page.evaluate(() => {
      const nav = document.querySelector("#bottomNav")?.getBoundingClientRect();
      const fab = document.querySelector("#aiFab")?.getBoundingClientRect();
      return nav && fab
        ? {
            navTop: nav.top,
            navHeight: nav.height,
            fabBottom: fab.bottom
          }
        : null;
    });
    expect(boxes).not.toBeNull();
    expect(boxes.navHeight).toBeLessThan(90);
    expect(boxes.fabBottom).toBeLessThanOrEqual(boxes.navTop - 4);
    await page.getByRole("button", { name: /Dziennik|Journal/ }).click();
    await expect(page).toHaveURL(/#adventure$/);
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
    await expect(page.getByRole("button", { name: /Moje wpisy/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Zdarzenia systemowe/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Wygeneruj wpis AI/ })).toHaveCount(0);
  });

  test("AI assistant topics and quiz hub use the new guarded creation flow", async ({ page }) => {
    await page.goto("/#games");
    await expect(page.getByRole("button", { name: /Quizy/ })).toBeVisible();
    await expect(page.locator("body")).not.toContainText(/Łap literę|Catch the Letter/);
    await page.getByRole("button", { name: /Quizy/ }).click();
    await expect(page.getByRole("button", { name: /Quizy AI/ })).toBeVisible();
    await page.getByRole("button", { name: /Quizy AI/ }).click();
    await expect(page.getByRole("button", { name: /Generuj quiz/ })).toBeVisible();

    await page.getByRole("button", { name: /AI Assistant/ }).click();
    await page.getByRole("button", { name: /Generuj fiszki|Generate cards/ }).click();
    await expect(page.getByText(/Wybierz temat|Choose a topic/)).toBeVisible();
    await expect(page.getByText(/Modlitwa|Prayer/)).toBeVisible();
  });

  test("badges are grouped and locked badges navigate to unlock activities", async ({ page }) => {
    await page.goto("/#badges");
    await expect(page.getByRole("button", { name: /Nauka/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /Ćwiczenia|Practice/ })).toBeVisible();
    await page.getByRole("button", { name: /Ćwiczenia|Practice/ }).click();
    await page.getByRole("button", { name: /Pierwszy quiz AI|First AI quiz/ }).click();
    await expect(page).toHaveURL(/#games$/);
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
    await page.goto("/#settings");
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
