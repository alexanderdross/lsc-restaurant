import { describe, it, expect } from "vitest";
import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { site } from "@/content/site";

// Kleine Helfer, um die (typisierten) verschachtelten Felder bequem zu lesen.
const og = (m: Metadata) => m.openGraph as Record<string, unknown> | undefined;
const tw = (m: Metadata) => m.twitter as Record<string, unknown> | undefined;

describe("pageMeta", () => {
  it("Startseite: canonical '/', OG-Titel ohne Marken-Suffix", () => {
    const m = pageMeta({ title: "Home", description: "d", path: "/" });
    expect(m.alternates?.canonical).toBe("/");
    expect(og(m)?.url).toBe(`${site.url}/`);
    expect(og(m)?.title).toBe(`${site.name} – ${site.claim}`);
  });

  it("Unterseite: canonical mit Trailing Slash + Marken-Suffix", () => {
    const m = pageMeta({
      title: "Speisekarte",
      description: "d",
      path: "/speisekarte",
    });
    expect(m.alternates?.canonical).toBe("/speisekarte/");
    expect(og(m)?.url).toBe(`${site.url}/speisekarte/`);
    expect(og(m)?.title).toBe(`Speisekarte | ${site.shortName}`);
  });

  it("index=false ⇒ robots noindex, follow bleibt", () => {
    const m = pageMeta({
      title: "Impressum",
      description: "d",
      path: "/impressum",
      index: false,
    });
    expect(m.robots).toMatchObject({ index: false, follow: true });
  });

  it("index (Default) ⇒ robots index+follow", () => {
    const m = pageMeta({ title: "x", description: "d", path: "/x" });
    expect(m.robots).toMatchObject({ index: true, follow: true });
  });

  it("OG- und Twitter-Bild sind gesetzt", () => {
    const m = pageMeta({ title: "x", description: "d", path: "/x" });
    const images = og(m)?.images as Array<{ url: string }> | undefined;
    expect(images?.[0]?.url).toBe("/opengraph-image.png");
    expect((tw(m)?.images as string[])?.[0]).toBe("/twitter-image.png");
    expect(tw(m)?.card).toBe("summary_large_image");
  });
});
