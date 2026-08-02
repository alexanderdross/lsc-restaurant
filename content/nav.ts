import { site } from "./site";

export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

/** Hauptnavigation (Reihenfolge wie auf der bestehenden Website). */
export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Reservieren", href: "/reservieren" },
  { label: "Speisekarte", href: "/speisekarte" },
  { label: "Mittagstisch", href: "/mittagstisch" },
  { label: "Saisonkarte", href: "/saisonkarte" },
  { label: "360° Rundgang", href: "/rundgang" },
  { label: "Jobs", href: "/jobs" },
  { label: "Bewerten", href: site.reviewsUrl, external: true },
];

/** Zusatzlinks im Footer. */
export const legalNav: NavItem[] = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
  { label: "Allergene", href: "/allergene" },
];
