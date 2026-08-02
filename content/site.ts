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
    // ISO-3166-2 Region (Baden-Württemberg) – für lokale Geo-Signale
    region: "DE-BW",
    // Landmarke / Lage – hilft lokaler Suche & KI-Antworten
    landmark: "Bodensee-Airport Friedrichshafen",
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

  // Küche/Angebot – maschinenlesbar (schema.org servesCuisine, GEO)
  cuisine: ["Italienisch", "Pizza", "Mediterran", "Pasta"],
  // Gesprochene Sprachen (schema.org knowsLanguage)
  languages: ["Deutsch", "Italienisch"],
  // Einzugsgebiet für lokale Suche (schema.org areaServed)
  areaServed: [
    "Friedrichshafen",
    "Bodenseeregion",
    "Tettnang",
    "Meckenbeuren",
    "Immenstaad",
  ],
  // Ausstattungsmerkmale (schema.org amenityFeature) – nur belegte Fakten
  amenities: [
    "Terrasse mit Blick aufs Rollfeld",
    "Flugzeug-Spotting",
    "Familienfreundlich",
    "Parkplätze am Flughafen",
    "Take-away / Straßenverkauf",
  ],

  /**
   * Häufige Fragen (FAQ) – rein faktisch aus den Stammdaten abgeleitet.
   * Sichtbar auf /reservieren gerendert und als FAQPage-JSON-LD ausgegeben
   * (gut für lokale Suche & generative KI-Antworten / GEO).
   */
  faq: [
    {
      q: "Wo befindet sich das LSC Restaurant?",
      a: "Direkt am Bodensee-Airport Friedrichshafen, Am Flugplatz 70, 88046 Friedrichshafen – mit Terrasse und Blick aufs Rollfeld.",
    },
    {
      q: "Wie sind die Öffnungszeiten?",
      a: "Dienstag bis Sonntag von 10:00 bis 22:00 Uhr. Montag ist Ruhetag.",
    },
    {
      q: "Kann ich einen Tisch reservieren?",
      a: "Ja. Reservieren Sie bequem online über unser Formular oder telefonisch unter 07541 73336.",
    },
    {
      q: "Welche Küche bietet das LSC Restaurant?",
      a: "Italienische Küche mit Steinofen-Pizza, hausgemachter Pasta, frischen Salaten sowie Fleisch- und Fischgerichten.",
    },
    {
      q: "Kann ich mit Karte zahlen?",
      a: "Ja, wir akzeptieren Bar, MasterCard und VISA. Kartenzahlung ist ab einem Betrag von 20 € möglich.",
    },
    {
      q: "Gibt es einen Mittagstisch?",
      a: "Ja, von Dienstag bis Freitag von 12:00 bis 14:00 Uhr bieten wir einen wechselnden Mittagstisch zu günstigen Preisen an.",
    },
    {
      q: "Ist das Restaurant für Familien geeignet?",
      a: "Ja. Von unserer Terrasse aus beobachten Sie startende und landende Flugzeuge – ein Erlebnis für die ganze Familie.",
    },
  ],
} as const;

export type Site = typeof site;
