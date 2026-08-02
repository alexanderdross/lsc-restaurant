/**
 * Zentrale Stammdaten des LSC Restaurants.
 * Änderungen an Adresse, Zeiten, Kontakt etc. nur hier vornehmen.
 */

export const site = {
  name: "LSC Restaurant | Pizzeria",
  shortName: "LSC Restaurant",
  owner: "Salvatore Trovato & Team",
  claim: "Ein Hauch Italien direkt am Bodensee-Airport",
  tagline: "Made with ♥ – simply delicious",
  description:
    "Italienische Küche mit Steinofen-Pizza, hausgemachter Pasta und frischen Salaten – direkt am Bodensee-Airport Friedrichshafen, mit Terrasse und Blick aufs Rollfeld.",
  url: "https://www.lsc-restaurant.de",

  phone: {
    display: "07541 73336",
    intl: "+49 7541 73336",
    href: "tel:+497541733336",
  },
  email: "info@lsc-restaurant.de",

  address: {
    street: "Am Flugplatz 70",
    zip: "88046",
    city: "Friedrichshafen",
    country: "Deutschland",
    countryCode: "DE",
    // Bodensee-Airport Friedrichshafen (Näherungswerte)
    geo: { lat: 47.6712, lng: 9.5115 },
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=LSC+Restaurant+Am+Flugplatz+70+88046+Friedrichshafen",
    // Cookie-freie Karten-Einbindung (OpenStreetMap) – DSGVO-freundlich, keine
    // Third-Party-Cookies/Tracking. Der Anfahrt-Link (mapsUrl) öffnet Google Maps
    // erst auf Klick in einem neuen Tab.
    mapsEmbed:
      "https://www.openstreetmap.org/export/embed.html?bbox=9.5055%2C47.6682%2C9.5175%2C47.6742&layer=mapnik&marker=47.6712%2C9.5115",
  },

  hours: [
    { day: "Montag", value: "Ruhetag", closed: true },
    { day: "Dienstag – Sonntag", value: "10:00 – 22:00 Uhr", closed: false },
  ],
  // Maschinenlesbar für schema.org
  openingHoursSpec: [
    {
      days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "10:00",
      closes: "22:00",
    },
  ],

  payment: {
    methods: ["Bar", "MasterCard", "VISA"],
    note: "Kartenzahlung ab 20 €.",
  },

  social: {
    facebook: "https://www.facebook.com/lscrestaurant.fn/",
    instagram: "https://www.instagram.com/lscrestaurant.fn/",
  },

  // Externe Bewertungsseite (öffnet in neuem Tab)
  reviewsUrl:
    "https://www.google.com/maps/search/?api=1&query=LSC+Restaurant+Friedrichshafen",
  // 360°-Rundgang (bestehende Tour von vr-easy / Immobilienschmiede)
  tourEmbedUrl:
    "https://vr-easy.com/tour/immobilienschmiede/240115-lsc_restaurant/#pano=2",
} as const;

export type Site = typeof site;
