import { iosSplashLinks } from "@/content/iosSplash";

/**
 * iOS-Startbilder (`apple-touch-startup-image`).
 *
 * iOS zeigt beim Start einer installierten PWA ein statisches Startbild an –
 * eines je Bildschirmauflösung und Ausrichtung, ausgewählt per Media-Query.
 * Ohne diese Links bliebe der Start auf älteren iOS-Versionen leer/weiß, bis
 * die Seite geladen ist (der CSS-Overlay `#pwa-splash` greift erst danach).
 *
 * Die `<link>`-Tags werden von React in den `<head>` gehoben. Quelle der Liste
 * ist `content/iosSplash.ts`, erzeugt von `scripts/generate-ios-splash.mjs`.
 */
export default function IosSplashLinks() {
  return (
    <>
      {iosSplashLinks.map((l) => (
        <link
          key={l.href}
          rel="apple-touch-startup-image"
          media={l.media}
          href={l.href}
        />
      ))}
    </>
  );
}
