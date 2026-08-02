import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export const dynamic = "force-static";

/**
 * Web App Manifest (PWA). Wird unter /manifest.webmanifest ausgeliefert und
 * macht die Seite installierbar. Farben orientieren sich an der Braun-Palette
 * (Espresso als Theme-/Hintergrundfarbe).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    lang: "de",
    dir: "ltr",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1e120c",
    theme_color: "#1e120c",
    categories: ["food", "restaurant", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-192-maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-512-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
