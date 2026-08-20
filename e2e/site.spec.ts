import { test, expect } from "@playwright/test";

const routes = [
  "/",
  "/kontakt",
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
  ).toHaveAttribute("href", "/allergene/");
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
  for (const path of ["/", "/speisekarte", "/kontakt", "/jobs"]) {
    await page.goto(path);
    const texts = await page.locator("a").allInnerTexts();
    const bad = texts
      .map((t) => t.replace(/\s+/g, " ").trim().toLowerCase())
      .filter((t) => generic.has(t));
    expect(bad, `Generische Link-Texte auf ${path}: ${bad.join(", ")}`).toEqual([]);
  }
});

test("Header schrumpft beim Scrollen (Shrink-on-Scroll)", async ({ page }) => {
  await page.goto("/");
  const header = page.getByRole("banner");
  const before = await header.boundingBox();
  expect(before).not.toBeNull();

  await page.evaluate(() => window.scrollTo(0, 600));
  // Auf die 300ms-Transition warten
  await page.waitForTimeout(500);

  const after = await header.boundingBox();
  expect(after).not.toBeNull();
  expect(after!.height).toBeLessThan(before!.height);
});

test("Mobiles Menü deckt bei gescrolltem Header den vollen Viewport ab", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  // Seite scrollen → Header wird kompakt und bekommt backdrop-blur
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(400);
  // Burger öffnen
  await page.getByRole("button", { name: /Menü öffnen/i }).click();

  const overlay = page.locator("#mobile-menu");
  await expect(overlay).toBeVisible();
  const box = await overlay.boundingBox();
  const vp = page.viewportSize()!;
  expect(box).not.toBeNull();
  // Overlay muss am Viewport (nicht am geshrinkten Header) verankert sein
  expect(box!.y).toBeLessThanOrEqual(1);
  expect(box!.height).toBeGreaterThanOrEqual(vp.height - 1);
});

test("Kontakt: kein Formular, Telefon-Hinweis + Anruf-Link", async ({ page }) => {
  await page.goto("/kontakt");
  // Kein Kontakt-/Reservierungsformular mehr
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.locator("#name")).toHaveCount(0);
  // Expliziter Hinweis: nur telefonisch (Überschrift des Hinweis-Blocks)
  await expect(
    page.getByRole("heading", { name: /ausschließlich\s+telefonisch/i })
  ).toBeVisible();
  // tel:-CTA vorhanden
  await expect(
    page.getByRole("link", { name: /Jetzt anrufen/i }).first()
  ).toHaveAttribute("href", /^tel:/);
});

test("Alte /reservieren-URL leitet dauerhaft auf /kontakt um", async ({ page }) => {
  const res = await page.goto("/reservieren");
  expect(res?.status()).toBe(200);
  expect(new URL(page.url()).pathname).toBe("/kontakt/");
});

test("Bewerbungsformular hat Datei-Upload", async ({ page }) => {
  await page.goto("/jobs");
  await expect(page.locator('input#file[type="file"]')).toBeAttached();
  await expect(page.getByRole("button", { name: /Bewerbung senden/i })).toBeVisible();
});

test.describe("CLS: reservierter Platz für Embeds/Widgets", () => {
  test("Turnstile-Slot ist von Anfang an reserviert (~300×65)", async ({ page }) => {
    await page.goto("/jobs");
    const slot = page.locator(".turnstile-slot");
    await expect(slot).toBeVisible();
    const box = await slot.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThanOrEqual(60);
    expect(box!.width).toBeGreaterThanOrEqual(250);
  });

  test("Map-Container reserviert Höhe vor dem Laden", async ({ page }) => {
    await page.goto("/kontakt");
    const embed = page.locator("div.relative.w-full.overflow-hidden").first();
    const box = await embed.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.height).toBeGreaterThan(0);
  });
});

test.describe("Lazy-Loading von Drittanbieter-Embeds", () => {
  test("Zwei-Klick: Karte lädt erst nach Zustimmung (Startseite)", async ({ page }) => {
    const googleReqs: string[] = [];
    page.on("request", (r) => {
      if (/google\.com\/maps|googleapis\.com/.test(r.url())) googleReqs.push(r.url());
    });

    await page.goto("/");
    await page
      .locator("div.relative.w-full.overflow-hidden")
      .first()
      .scrollIntoViewIfNeeded();

    // Sichtbar, gescrollt – und trotzdem noch kein Request an Google.
    const loadButton = page.getByRole("button", { name: "Karte laden" }).first();
    await expect(loadButton).toBeVisible();
    await expect(page.locator('iframe[src*="google.com/maps"]')).toHaveCount(0);
    expect(googleReqs, googleReqs.join("\n")).toEqual([]);

    await loadButton.click();
    await expect(page.locator('iframe[src*="google.com/maps"]')).toHaveCount(1);
  });

  test("Zwei-Klick: Zustimmung gilt für den restlichen Besuch", async ({ page }) => {
    await page.goto("/kontakt");
    await page.getByRole("button", { name: "Karte laden" }).first().click();
    await expect(page.locator('iframe[src*="google.com/maps"]')).toHaveCount(1);

    // Auf der Startseite darf nicht erneut gefragt werden.
    await page.goto("/");
    await page
      .locator("div.relative.w-full.overflow-hidden")
      .first()
      .scrollIntoViewIfNeeded();
    await expect(page.locator('iframe[src*="google.com/maps"]')).toHaveCount(1);
    await expect(page.getByRole("button", { name: "Karte laden" })).toHaveCount(0);
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
    /\/speisekarte\/$/
  );
});

test("SEO: Open-Graph- und Twitter-Card-Tags vorhanden", async ({ page }) => {
  await page.goto("/speisekarte");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    /Speisekarte/
  );
  await expect(page.locator('meta[property="og:description"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image"
  );
  await expect(page.locator('meta[name="twitter:image"]')).toHaveCount(1);
});

test.describe("PWA: Manifest, Service Worker & Theme-Color", () => {
  test("Manifest ist erreichbar und korrekt", async ({ page, request }) => {
    await page.goto("/");
    const link = page.locator('link[rel="manifest"]');
    await expect(link).toHaveCount(1);
    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();

    const res = await request.get(href!);
    expect(res.status()).toBe(200);
    const manifest = await res.json();
    expect(manifest.name).toBeTruthy();
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("/");
    expect(Array.isArray(manifest.icons)).toBe(true);
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
    expect(
      manifest.icons.some((i: { purpose?: string }) => i.purpose === "maskable")
    ).toBe(true);
  });

  test("theme-color-Meta ist gesetzt", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      "content",
      "#1e120c"
    );
  });

  test("Service Worker wird als JavaScript ausgeliefert", async ({ request }) => {
    const res = await request.get("/sw.js");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"] || "").toContain("javascript");
    const body = await res.text();
    expect(body).toContain("addEventListener");
  });

  test("Offline-Fallback-Seite lädt", async ({ page }) => {
    const res = await page.goto("/offline/");
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
  });
});

test("SEO: JSON-LD BreadcrumbList und Menu vorhanden", async ({ page }) => {
  await page.goto("/speisekarte");
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = blocks.map((b) => {
    try {
      return JSON.parse(b)["@type"];
    } catch {
      return null;
    }
  });
  expect(types).toContain("BreadcrumbList");
  expect(types).toContain("Menu");
});

async function jsonLdTypes(page: import("@playwright/test").Page) {
  const blocks = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  return blocks.map((b) => {
    try {
      return JSON.parse(b)["@type"];
    } catch {
      return null;
    }
  });
}

test.describe("Local SEO & GEO: strukturierte Daten", () => {
  test("Restaurant-Entität ist site-weit vorhanden (Home & Unterseite)", async ({
    page,
  }) => {
    for (const path of ["/", "/impressum"]) {
      await page.goto(path);
      expect(await jsonLdTypes(page), `Restaurant fehlt auf ${path}`).toContain(
        "Restaurant"
      );
    }
  });

  test("Restaurant-Schema enthält NAP, Geo & Öffnungszeiten", async ({ page }) => {
    await page.goto("/");
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const restaurant = blocks
      .map((b) => {
        try {
          return JSON.parse(b);
        } catch {
          return null;
        }
      })
      .find((d) => d && d["@type"] === "Restaurant");
    expect(restaurant).toBeTruthy();
    expect(restaurant.telephone).toBeTruthy();
    expect(restaurant.address?.addressLocality).toBe("Friedrichshafen");
    expect(restaurant.geo?.latitude).toBeTruthy();
    expect(Array.isArray(restaurant.openingHoursSpecification)).toBe(true);
    expect(Array.isArray(restaurant.hasMenu)).toBe(true);
  });

  test("Alle drei Karten liefern Menu-Schema", async ({ page }) => {
    for (const path of ["/speisekarte", "/mittagstisch", "/saisonkarte"]) {
      await page.goto(path);
      expect(await jsonLdTypes(page), `Menu fehlt auf ${path}`).toContain("Menu");
    }
  });

  test("Kontakt: FAQPage-Schema + sichtbarer FAQ-Abschnitt", async ({
    page,
  }) => {
    await page.goto("/kontakt");
    expect(await jsonLdTypes(page)).toContain("FAQPage");
    await expect(
      page.getByRole("heading", { name: "Häufige Fragen" })
    ).toBeVisible();
    await expect(page.getByText("Wie sind die Öffnungszeiten?")).toBeVisible();
  });

  test("Kontakt: Anfahrt & Parken sichtbar, neue FAQ im Schema", async ({
    page,
  }) => {
    await page.goto("/kontakt");
    await expect(
      page.getByRole("heading", { name: /Anfahrt & Parken/ })
    ).toBeVisible();
    await expect(page.getByText("Wie komme ich zum Restaurant?")).toBeVisible();
    await expect(page.getByText("Gibt es Parkplätze?")).toBeVisible();

    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const faq = blocks
      .map((b) => {
        try {
          return JSON.parse(b);
        } catch {
          return null;
        }
      })
      .find((d) => d && d["@type"] === "FAQPage");
    const questions = (faq?.mainEntity ?? []).map(
      (q: { name: string }) => q.name
    );
    expect(questions).toContain("Wie komme ich zum Restaurant?");
    expect(questions).toContain("Gibt es Parkplätze?");
  });

  test("Speisekarte: Menu-Schema enthält suitableForDiet (vegan)", async ({
    page,
  }) => {
    await page.goto("/speisekarte");
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const menu = blocks
      .map((b) => {
        try {
          return JSON.parse(b);
        } catch {
          return null;
        }
      })
      .find((d) => d && d["@type"] === "Menu");
    expect(menu).toBeTruthy();
    const items = (menu.hasMenuSection ?? []).flatMap(
      (s: { hasMenuItem?: unknown[] }) => s.hasMenuItem ?? []
    );
    const vegan = items.filter(
      (i: { suitableForDiet?: string }) =>
        i.suitableForDiet === "https://schema.org/VeganDiet"
    );
    expect(vegan.length).toBeGreaterThanOrEqual(1);
  });

  test("Geo-Meta-Tags sind gesetzt", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[name="geo.placename"]')).toHaveAttribute(
      "content",
      "Friedrichshafen"
    );
    await expect(page.locator('meta[name="geo.region"]')).toHaveAttribute(
      "content",
      "DE-BW"
    );
    await expect(page.locator('meta[name="geo.position"]')).toHaveCount(1);
    await expect(page.locator('meta[name="ICBM"]')).toHaveCount(1);
  });

  test("/llms.txt liefert eine Text-Zusammenfassung (GEO)", async ({ request }) => {
    const res = await request.get("/llms.txt");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"] || "").toContain("text/plain");
    const body = await res.text();
    expect(body).toContain("LSC Restaurant");
    expect(body).toContain("Öffnungszeiten");
    expect(body).toContain("Friedrichshafen");
  });
});
