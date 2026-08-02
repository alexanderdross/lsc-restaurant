import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Alle URLs mit abschließendem Slash; Aufrufe ohne Slash werden umgeleitet.
  trailingSlash: true,
  images: {
    // Cloudflare-nativer Optimizer via Custom Loader (siehe image-loader.ts).
    // Ohne aktivierte Cloudflare Image Transformations wird das Original geliefert.
    loader: "custom",
    loaderFile: "./image-loader.ts",
  },
};

export default nextConfig;

// Ermöglicht `next dev` mit Cloudflare-Bindings (Secrets/Env) über OpenNext.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
