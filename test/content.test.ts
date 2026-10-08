import { describe, it, expect } from "vitest";
import { site } from "@/content/site";
import { speisekarte } from "@/content/menu";

describe("Stammdaten (site)", () => {
  it("URL ist https ohne abschließenden Slash", () => {
    expect(site.url).toMatch(/^https:\/\//);
    expect(site.url.endsWith("/")).toBe(false);
  });

  it("Telefon-Href ist tel: und passt zur internationalen Nummer", () => {
    expect(site.phone.href).toBe(`tel:${site.phone.intl.replace(/\s+/g, "")}`);
  });

  it("Geo-Koordinaten liegen plausibel im Bodenseeraum", () => {
    expect(site.address.geo.lat).toBeGreaterThan(47);
    expect(site.address.geo.lat).toBeLessThan(48);
    expect(site.address.geo.lng).toBeGreaterThan(9);
    expect(site.address.geo.lng).toBeLessThan(10);
  });

  it("FAQ ist nicht leer und jede Frage hat eine Antwort", () => {
    expect(site.faq.length).toBeGreaterThan(0);
    for (const f of site.faq) {
      expect(f.q.trim().length).toBeGreaterThan(0);
      expect(f.a.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("Selbstabholung (takeaway)", () => {
  it("Claim, Aufhänger und Hinweistext sind gesetzt", () => {
    const t = site.takeaway;
    for (const text of [
      t.claim,
      t.subclaim,
      t.eyebrow,
      t.headline,
      t.subline,
      t.note,
      t.ctaLabel,
    ]) {
      expect(text.trim().length).toBeGreaterThan(0);
    }
  });

  it("Anker ist eine URL-taugliche ID", () => {
    expect(site.takeaway.anchor).toMatch(/^[a-z][a-z0-9-]*$/);
  });

  it("vier Argumente und drei Schritte, jeweils mit Titel und Text", () => {
    expect(site.takeaway.benefits).toHaveLength(4);
    expect(site.takeaway.steps).toHaveLength(3);
    for (const item of [...site.takeaway.benefits, ...site.takeaway.steps]) {
      expect(item.title.trim().length).toBeGreaterThan(0);
      expect(item.text.trim().length).toBeGreaterThan(0);
    }
  });

  it("FAQ beantwortet Abholung und Lieferdienst", () => {
    const questions = site.faq.map((f) => f.q);
    expect(questions).toContain("Kann ich das Essen auch selbst abholen?");
    expect(questions).toContain("Liefern Sie auch?");
  });

  it("Ausstattungsmerkmale nennen die Selbstabholung (schema.org/GEO)", () => {
    expect(site.amenities.some((a) => /Selbstabholung/.test(a))).toBe(true);
  });
});

describe("Speisekarte", () => {
  it("Kategorie-IDs sind eindeutig", () => {
    const ids = speisekarte.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("jede Kategorie hat einen Titel und mindestens ein Gericht", () => {
    for (const c of speisekarte) {
      expect(c.title.trim().length).toBeGreaterThan(0);
      expect(c.items.length).toBeGreaterThan(0);
    }
  });

  it("jedes Gericht hat einen nicht-leeren Namen; Preis (falls gesetzt) ist ein String", () => {
    for (const c of speisekarte) {
      for (const d of c.items) {
        expect(d.name.trim().length).toBeGreaterThan(0);
        if (d.price !== undefined) {
          expect(typeof d.price).toBe("string");
          expect(d.price.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });
});
