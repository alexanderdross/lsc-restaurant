/**
 * Custom Image Loader für next/image (Cloudflare-Best-Practice).
 *
 * Auf Cloudflare Workers steht der Standard-Optimizer (sharp) nicht zur Verfügung.
 * Dieser Loader nutzt stattdessen **Cloudflare Image Transformations**
 * (`/cdn-cgi/image/...`) für echtes Resizing + moderne Formate (AVIF/WebP).
 *
 * Sicher by default: Ist die Transformation nicht aktiviert (z. B. während des
 * Tests auf `*.workers.dev`), wird das Originalbild ausgeliefert. Erst wenn auf
 * der Zone „Image Transformations" aktiv ist, per Build-Variable
 * `NEXT_PUBLIC_CF_IMAGE_RESIZING=true` einschalten.
 *
 * Doku: https://developers.cloudflare.com/images/transform-images/
 */
export default function cloudflareLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  // Externe URLs unverändert lassen.
  if (/^https?:\/\//i.test(src)) return src;

  const enabled = process.env.NEXT_PUBLIC_CF_IMAGE_RESIZING === "true";
  if (!enabled) return src;

  const params = [`width=${width}`, `quality=${quality || 75}`, "format=auto"].join(",");
  const normalizedSrc = src.startsWith("/") ? src : `/${src}`;
  return `/cdn-cgi/image/${params}${normalizedSrc}`;
}
