/*
 * LSC Restaurant – Service Worker (vanilla, ohne Build-Plugin).
 * Wird als statisches Asset unter /sw.js mit Scope "/" ausgeliefert.
 *
 * Strategie:
 *   - Navigationen (HTML): network-first → bei Offline Cache, sonst /offline/
 *     (vermeidet veraltete Seiten nach einem Deploy).
 *   - Statische Assets (/_next/static, Fonts, Bilder): stale-while-revalidate.
 *   - Cross-Origin (OSM, Turnstile, vr-easy) und Nicht-GET: nicht abfangen.
 *
 * Die Cache-Version bei jeder relevanten Änderung erhöhen, damit alte Caches
 * beim activate-Event entfernt werden.
 */
const VERSION = "v1";
const RUNTIME_CACHE = `lsc-runtime-${VERSION}`;
const PRECACHE = `lsc-precache-${VERSION}`;
const OFFLINE_URL = "/offline/";

// Beim Install zwingend vorzuhaltende Kern-Assets (Offline-Fallback + Basics).
const PRECACHE_URLS = [
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(PRECACHE);
      // Einzeln hinzufügen, damit ein fehlendes Asset den Install nicht abbricht.
      await Promise.all(
        PRECACHE_URLS.map((url) =>
          cache.add(new Request(url, { cache: "reload" })).catch(() => {})
        )
      );
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((key) => key !== RUNTIME_CACHE && key !== PRECACHE)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })()
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/icons/") ||
    /\.(?:woff2?|ttf|otf|png|jpe?g|webp|avif|gif|svg|ico)$/i.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Nur GET und nur same-origin behandeln.
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Navigationen (Seitenaufrufe): network-first mit Offline-Fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const network = await fetch(request);
          const cache = await caches.open(RUNTIME_CACHE);
          cache.put(request, network.clone());
          return network;
        } catch {
          const cached = await caches.match(request);
          if (cached) return cached;
          const offline = await caches.match(OFFLINE_URL);
          return (
            offline ||
            new Response("Offline", {
              status: 503,
              headers: { "Content-Type": "text/plain; charset=utf-8" },
            })
          );
        }
      })()
    );
    return;
  }

  // Statische Assets: stale-while-revalidate.
  if (isStaticAsset(url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME_CACHE);
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => undefined);
        return cached || (await network) || Response.error();
      })()
    );
  }
});
