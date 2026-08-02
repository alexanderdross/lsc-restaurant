import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", priority: 1.0 },
    { path: "/speisekarte", priority: 0.9 },
    { path: "/mittagstisch", priority: 0.8 },
    { path: "/saisonkarte", priority: 0.8 },
    { path: "/reservieren", priority: 0.9 },
    { path: "/rundgang", priority: 0.6 },
    { path: "/jobs", priority: 0.6 },
    { path: "/allergene", priority: 0.4 },
    { path: "/impressum", priority: 0.3 },
    { path: "/datenschutz", priority: 0.3 },
  ];
  const lastModified = new Date("2026-08-02");
  return routes.map((r) => ({
    url: `${site.url}${r.path === "/" ? "/" : `${r.path}/`}`,
    lastModified,
    changeFrequency: "monthly",
    priority: r.priority,
  }));
}
