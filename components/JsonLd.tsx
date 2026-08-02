import { site } from "@/content/site";
import { speisekarte } from "@/content/menu";

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

/** schema.org Restaurant – strukturierte Daten für Rich Results. */
export default function RestaurantJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${site.url}/#restaurant`,
    name: site.name,
    description: site.description,
    url: `${site.url}/`,
    telephone: site.phone.intl,
    email: site.email,
    servesCuisine: ["Italienisch", "Pizza", "Mediterran"],
    priceRange: "€€",
    image: `${site.url}/opengraph-image.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      postalCode: site.address.zip,
      addressLocality: site.address.city,
      addressCountry: site.address.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.address.geo.lat,
      longitude: site.address.geo.lng,
    },
    openingHoursSpecification: site.openingHoursSpec.map((s) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: s.days,
      opens: s.opens,
      closes: s.closes,
    })),
    paymentAccepted: "Bar, MasterCard, VISA",
    sameAs: [site.social.facebook, site.social.instagram],
    hasMenu: `${site.url}/speisekarte/`,
    acceptsReservations: `${site.url}/reservieren/`,
  };
  return <JsonLd data={data} />;
}

/** schema.org WebSite – für die Startseite. */
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

/** schema.org Menu – vollständige Speisekarte für die Speisekarte-Seite. */
export function MenuJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: "Speisekarte",
    url: `${site.url}/speisekarte/`,
    inLanguage: "de-DE",
    hasMenuSection: speisekarte.map((cat) => ({
      "@type": "MenuSection",
      name: cat.title,
      hasMenuItem: cat.items.map((d) => ({
        "@type": "MenuItem",
        name: d.name,
        ...(d.desc ? { description: d.desc } : {}),
        ...(d.price
          ? {
              offers: {
                "@type": "Offer",
                price: d.price.replace(",", "."),
                priceCurrency: "EUR",
              },
            }
          : {}),
      })),
    })),
  };
  return <JsonLd data={data} />;
}
