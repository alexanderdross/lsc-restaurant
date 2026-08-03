import { site } from "./site";

export type NavItem = {
  label: string;
  href: string;
  /** SEO-/A11y-freundlicher title-Text (gibt Kontext, dupliziert nicht nur das Label). */
  title: string;
  external?: boolean;
};

/** Hauptnavigation (Reihenfolge wie auf der bestehenden Website). */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/", title: "LSC Restaurant | Pizzeria – Startseite am Bodensee-Airport" },
  { label: "Kontakt", href: "/kontakt", title: "Kontakt & telefonische Reservierung im LSC Restaurant Friedrichshafen" },
  { label: "Speisekarte", href: "/speisekarte", title: "Speisekarte – italienische Spezialitäten, Pasta & Steinofen-Pizza" },
  { label: "Mittagstisch", href: "/mittagstisch", title: "Mittagstisch – günstige Mittagsangebote (Di–Fr, 12–14 Uhr)" },
  { label: "Saisonkarte", href: "/saisonkarte", title: "Saisonkarte – saisonale Spezialitäten des LSC Restaurants" },
  { label: "360° Rundgang", href: "/rundgang", title: "360°-Rundgang durch das LSC Restaurant" },
  { label: "Jobs", href: "/jobs", title: "Jobs & Karriere im LSC Restaurant Friedrichshafen" },
  { label: "Bewerten", href: site.reviewsUrl, title: "LSC Restaurant bei Google bewerten", external: true },
];

/** Zusatzlinks im Footer. */
export const legalNav: NavItem[] = [
  { label: "Impressum", href: "/impressum", title: "Impressum des LSC Restaurants" },
  { label: "Datenschutz", href: "/datenschutz", title: "Datenschutzerklärung des LSC Restaurants" },
  { label: "Allergene", href: "/allergene", title: "Allergene & Zusatzstoffe unserer Speisen und Getränke" },
];
