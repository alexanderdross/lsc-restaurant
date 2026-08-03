import { site } from "@/content/site";
import { speisekarte, mittagstisch, saisonkarte } from "@/content/menu";
import type { Dish } from "@/content/menu";

/** Generischer JSON-LD-Ausgabe-Baustein. */
function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function absolute(path: string): string {
  return `${site.url}${path === "/" ? "/" : `${path}/`}`;
}

/**
 * schema.org Restaurant – zentrale LocalBusiness-Entität für lokale Suche und
 * generative Engines (GEO). Wird site-weit (im Layout) ausgegeben, damit die
 * NAP-/Geo-Daten auf jeder Seite konsistent verfügbar sind.
 */
export function RestaurantJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${site.url}/#restaurant`,
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    slogan: site.claim,
    url: `${site.url}/`,
    telephone: site.phone.intl,
    email: site.email,
    servesCuisine: site.cuisine,
    keywords: [
      ...site.cuisine,
      `Restaurant ${site.address.city}`,
      `Pizzeria ${site.address.city}`,
      site.address.landmark,
    ].join(", "),
    priceRange: "€€",
    currenciesAccepted: "EUR",
    paymentAccepted: "Bar, MasterCard, VISA",
    knowsLanguage: ["de", "it"],
    image: [
      `${site.url}/opengraph-image.png`,
      `${site.url}/logo.webp`,
    ],
    logo: `${site.url}/icon.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.zip,
      addressLocality: site.address.city,
      addressRegion: "Baden-Württemberg",
      addressCountry: site.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.geo.lat,
      longitude: site.address.geo.lng,
    },
    hasMap: site.address.mapsUrl,
    areaServed: site.areaServed.map((name) => ({ "@type": "City", name })),
    openingHoursSpecification: site.openingHoursSpec.map((s) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: s.days,
      opens: s.opens,
      closes: s.closes,
    })),
    amenityFeature: site.amenities.map((name) => ({
      "@type": "LocationFeatureSpecification",
      name,
      value: true,
    })),
    publicAccess: true,
    isAccessibleForFree: true,
    // Reservierungen werden ausschließlich telefonisch entgegengenommen –
    // keine Online-ReserveAction (kein Online-Formular mehr).
    acceptsReservations: true,
    sameAs: [site.social.facebook, site.social.instagram],
    hasMenu: [
      `${site.url}/speisekarte/`,
      `${site.url}/mittagstisch/`,
      `${site.url}/saisonkarte/`,
    ],
  };
  return <JsonLd data={data} />;
}

/** schema.org WebSite – für die Startseite / site-weit. */
export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.name,
    url: `${site.url}/`,
    inLanguage: "de-DE",
    publisher: { "@id": `${site.url}/#restaurant` },
  };
  return <JsonLd data={data} />;
}

/** schema.org BreadcrumbList – für Unterseiten. */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absolute(it.path),
    })),
  };
  return <JsonLd data={data} />;
}

/* -------------------------------------------------------------------------- */
/*  Menü-Schemata                                                             */
/* -------------------------------------------------------------------------- */

type MenuSectionInput = { name: string; items: readonly Dish[] };

function menuItem(d: Dish) {
  // „vegan" wird nur ausgezeichnet, wenn es im Namen/Beschreibung explizit
  // steht – rein aus vorhandenem Text abgeleitet, nichts erfunden.
  const isVegan = /vegan/i.test(`${d.name} ${d.desc ?? ""}`);
  return {
    "@type": "MenuItem",
    name: d.name,
    ...(d.desc ? { description: d.desc } : {}),
    ...(isVegan ? { suitableForDiet: "https://schema.org/VeganDiet" } : {}),
    ...(d.price
      ? {
          offers: {
            "@type": "Offer",
            price: d.price.replace(",", "."),
            priceCurrency: "EUR",
          },
        }
      : {}),
  };
}

/** Baut ein vollständiges schema.org Menu aus einer oder mehreren Sektionen. */
function buildMenu(opts: {
  name: string;
  path: string;
  sections: MenuSectionInput[];
  description?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: opts.name,
    url: absolute(opts.path),
    inLanguage: "de-DE",
    ...(opts.description ? { description: opts.description } : {}),
    // Verknüpft die Karte mit der Restaurant-Entität (GEO/Local SEO)
    isPartOf: { "@id": `${site.url}/#restaurant` },
    hasMenuSection: opts.sections.map((sec) => ({
      "@type": "MenuSection",
      name: sec.name,
      hasMenuItem: sec.items.map(menuItem),
    })),
  };
}

/** Vollständige Speisekarte (alle Kategorien) für /speisekarte. */
export function MenuJsonLd() {
  return (
    <JsonLd
      data={buildMenu({
        name: "Speisekarte",
        path: "/speisekarte",
        sections: speisekarte.map((c) => ({ name: c.title, items: c.items })),
      })}
    />
  );
}

/** Mittagstisch-Karte für /mittagstisch. */
export function MittagstischJsonLd() {
  return (
    <JsonLd
      data={buildMenu({
        name: "Mittagstisch",
        path: "/mittagstisch",
        description: `Mittagstisch ${mittagstisch.period}, ${mittagstisch.time}.`,
        sections: [{ name: "Mittagstisch", items: mittagstisch.items }],
      })}
    />
  );
}

/** Saisonkarte für /saisonkarte. */
export function SaisonkarteJsonLd() {
  return (
    <JsonLd
      data={buildMenu({
        name: `Saisonkarte – ${saisonkarte.season}`,
        path: "/saisonkarte",
        sections: [{ name: saisonkarte.season, items: saisonkarte.items }],
      })}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*  FAQ                                                                       */
/* -------------------------------------------------------------------------- */

/** schema.org FAQPage – stärkt lokale Suche & generative KI-Antworten (GEO). */
export function FaqJsonLd({
  items,
}: {
  items: readonly { q: string; a: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.q,
      acceptedAnswer: { "@type": "Answer", text: it.a },
    })),
  };
  return <JsonLd data={data} />;
}
