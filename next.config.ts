import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    // Bilder werden unverändert ausgeliefert (kein Image-Optimierungs-Service auf Workers nötig).
    // Assets sind bereits in passenden Größen abgelegt.
    unoptimized: true,
  },
};

export default nextConfig;

// Ermöglicht `next dev` mit Cloudflare-Bindings (Secrets/Env) über OpenNext.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
