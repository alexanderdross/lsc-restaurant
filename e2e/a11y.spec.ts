import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/**
 * Accessibility-Tests (axe-core) gegen WCAG 2.0/2.1 Level A & AA.
 * Schlägt fehl bei Verstößen mit Impact "serious" oder "critical".
 */
const pages = [
  "/",
  "/speisekarte",
  "/mittagstisch",
  "/kontakt",
  "/jobs",
  "/allergene",
  "/impressum",
  "/datenschutz",
];

for (const path of pages) {
  test(`a11y: ${path} ohne kritische WCAG-A/AA-Verstöße`, async ({ page }) => {
    await page.goto(path);
    // Scroll-Reveal deterministisch abschließen: Text sofort voll deckend
    // prüfen (kein Messen mitten in der Einblend-Animation).
    await page.addStyleTag({
      content:
        ".reveal{opacity:1 !important;transform:none !important;transition:none !important}" +
        ".turnstile-skeleton{animation:none !important;opacity:1 !important}",
    });
    await page.waitForTimeout(50);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const severe = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical"
    );

    expect(
      severe,
      severe
        .map((v) => `${v.id} (${v.impact}) – ${v.nodes.length}× – ${v.helpUrl}`)
        .join("\n")
    ).toEqual([]);
  });
}

// Überschriften-Reihenfolge (keine übersprungenen Ebenen) – auch auf den
// Karten-Seiten mit flacher Gerichtsliste.
for (const path of ["/", "/speisekarte", "/mittagstisch", "/saisonkarte"]) {
  test(`heading-order korrekt: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({ page })
      .withRules(["heading-order"])
      .analyze();
    expect(
      results.violations,
      results.violations.map((v) => v.nodes.map((n) => n.html).join("\n")).join("\n")
    ).toEqual([]);
  });
}
