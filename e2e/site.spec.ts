import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/reservieren",
  "/speisekarte",
  "/mittagstisch",
  "/saisonkarte",
  "/allergene",
  "/rundgang",
  "/jobs",
  "/impressum",
  "/datenschutz",
];

test.describe("Seiten laden & Grundstruktur", () => {
  for (const path of routes) {
    test(`${path} → 200, genau ein h1, Header & Footer`, async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.getByRole("banner")).toBeVisible();
      await expect(page.getByRole("contentinfo")).toBeVisible();
    });
  }

  test("unbekannte Route liefert 404", async ({ page }) => {
    const res = await page.goto("/diese-seite-gibt-es-nicht");
    expect(res?.status()).toBe(404);
    await expect(page.getByText("Seite nicht gefunden")).toBeVisible();
  });
});

test("Speisekarte: Kategorien, Gericht und Allergen-Link", async ({ page }) => {
  await page.goto("/speisekarte");
  await expect(page.getByRole("heading", { name: "Pizza", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Dessert", exact: true })).toBeVisible();
  await expect(page.getByText("Pizza Margherita")).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Allergene & Zusatzstoffe/ })
  ).toHaveAttribute("href", "/allergene");
});

test("Keine generischen/nicht-beschreibenden Link-Texte", async ({ page }) => {
  const generic = new Set([
    "hier",
    "klick",
    "klicke hier",
    "klicken sie hier",
    "mehr",
    "here",
    "click here",
    "read more",
    "link",
  ]);
  for (const path of ["/", "/speisekarte", "/reservieren", "/jobs"]) {
    await page.goto(path);
    const texts = await page.locator("a").allInnerTexts();
    const bad = texts
      .map((t) => t.replace(/\s+/g, " ").trim().toLowerCase())
      .filter((t) => generic.has(t));
    expect(bad, `Generische Link-Texte auf ${path}: ${bad.join(", ")}`).toEqual([]);
  }
});

test("Reservierungsformular hat die Pflichtfelder", async ({ page }) => {
  await page.goto("/reservieren");
  await expect(page.locator("#name")).toBeVisible();
  await expect(page.locator("#email")).toBeVisible();
  await expect(page.locator("textarea#message")).toBeVisible();
  await expect(page.getByRole("button", { name: /Anfrage senden/i })).toBeVisible();
});

test("Bewerbungsformular hat Datei-Upload", async ({ page }) => {
  await page.goto("/jobs");
  await expect(page.locator('input#file[type="file"]')).toBeAttached();
  await expect(page.getByRole("button", { name: /Bewerbung senden/i })).toBeVisible();
});

test.describe("CLS: reservierter Platz für Embeds/Widgets", () => {
  test("Turnstile-Slot ist von Anfang an reserviert (~300×65)", async ({ page }) => {
    await page.goto("/reservieren");
    const slot = page.locator(".turnstile-slot");
    await expect(slot).toBeVisible();
    const box = await slot.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(60);
    expect(box!.width).toBeGreaterThanOrEqual(250);
  });

  test("Map-Container reserviert Höhe vor dem Laden", async ({ page }) => {
    await page.goto("/reservieren");
    const embed = page.locator("div.relative.w-full.overflow-hidden").first();
    const box = await embed.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThan(0);
  });
});

test.describe("Lazy-Loading von Drittanbieter-Embeds", () => {
  test("Karte lädt erst beim Scrollen (Startseite)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('iframe[src*="openstreetmap"]')).toHaveCount(0);
    await page
      .locator("div.relative.w-full.overflow-hidden")
      .first()
      .scrollIntoViewIfNeeded();
    await expect(page.locator('iframe[src*="openstreetmap"]')).toHaveCount(1);
  });

  test("Keine Google-Maps-Third-Party-Einbettung (cookie-frei)", async ({ page }) => {
    const googleReqs: string[] = [];
    page.on("request", (r) => {
      if (/google\.com\/maps|googleapis\.com/.test(r.url())) googleReqs.push(r.url());
    });
    await page.goto("/reservieren");
    await page
      .locator("div.relative.w-full.overflow-hidden")
      .first()
      .scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    expect(googleReqs, googleReqs.join("\n")).toEqual([]);
  });

  test("360°-Tour wird auf /rundgang eingebunden", async ({ page }) => {
    await page.goto("/rundgang");
    await page
      .locator("div.relative.w-full.overflow-hidden")
      .first()
      .scrollIntoViewIfNeeded();
    await expect(page.locator('iframe[src*="vr-easy"]')).toHaveCount(1);
  });
});

test("Metadaten: Title und Canonical gesetzt", async ({ page }) => {
  await page.goto("/speisekarte");
  await expect(page).toHaveTitle(/Speisekarte/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/speisekarte$/
  );
});
