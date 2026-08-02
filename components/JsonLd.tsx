import { site } from "@/content/site";

/** schema.org Restaurant – strukturierte Daten für Rich Results. */
export default function RestaurantJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.name,
    description: site.description,
    url: site.url,
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
    hasMenu: `${site.url}/speisekarte`,
    acceptsReservations: `${site.url}/reservieren`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
