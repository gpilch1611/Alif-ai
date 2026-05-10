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
    await expect(page.locator(".home-quick-card")).toHaveCount(5);
    await expectNoOverflow(page.locator(".home-quick-card"));
    await expectNoOverflow(page.locator(".home-stat-card"));
    await expect(page.locator("body")).not.toContainText("Kalkulator zakat");
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

  test("Start has no serious automated accessibility violations", async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .disableRules(["color-contrast"])
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();
    const serious = results.violations.filter((violation) => ["critical", "serious"].includes(violation.impact || ""));
    expect(serious).toEqual([]);
  });
});
