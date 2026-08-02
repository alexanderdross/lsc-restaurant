import type { Metadata } from "next";
import { site } from "@/content/site";

type PageMetaInput = {
  /** Seitenspezifischer Titel (ohne Marken-Suffix – das ergänzt die Vorlage). */
  title: string;
  description: string;
  /** Pfad ohne abschließenden Slash, z. B. "/speisekarte". "/" für die Startseite. */
  path: string;
  keywords?: string[];
  /** Auf false setzen, um die Seite nicht zu indexieren (Impressum/Datenschutz). */
  index?: boolean;
};

/**
 * Baut vollständige Next-Metadaten für eine Seite:
 * Title, Description, Keywords, Canonical (mit Trailing Slash),
 * Open-Graph- und Twitter-Card-Tags. Das OG-/Twitter-Bild wird über die
 * Datei-Konventionen (app/opengraph-image.png, app/twitter-image.png)
 * automatisch ergänzt.
 */
export function pageMeta({
  title,
  description,
  path,
  keywords,
  index = true,
}: PageMetaInput): Metadata {
  const canonical = path === "/" ? "/" : `${path}/`;
  const url = `${site.url}${canonical}`;
  const ogTitle =
    path === "/" ? `${site.name} – ${site.claim}` : `${title} | ${site.shortName}`;

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: "de_DE",
      url,
      siteName: site.name,
      title: ogTitle,
      description,
      images: [
        {
          url: "/opengraph-image.png",
          width: 1200,
          height: 630,
          alt: site.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: ["/twitter-image.png"],
    },
    robots: index
      ? { index: true, follow: true }
      : { index: false, follow: true },
  };
}
