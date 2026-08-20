"use client";

import { useEffect, useState } from "react";
import { useInView } from "./useInView";

/**
 * Generische, performance- & CLS-optimierte iframe-Einbindung.
 *
 * - Reserviert sofort den Platz über ein festes Seitenverhältnis (CLS = 0):
 *   Platzhalter und iframe liegen absolut im selben Ratio-Container, das
 *   Nachladen verschiebt also nichts.
 * - Lädt das iframe erst, wenn BEIDES zutrifft: das `load`-Event der Seite ist
 *   durch UND der Container ist (fast) im Sichtbereich (IntersectionObserver).
 *   So konkurriert schwerer Drittanbieter-Code nie mit LCP und Hydration.
 *   Zusätzlich natives `loading="lazy"`.
 * - Dezenter Platzhalter bis dahin.
 *
 * Einsatz: Google Maps (aspect-[4/3]) und 360°-Tour (aspect-video).
 */
export default function LazyEmbed({
  src,
  title,
  placeholder = "Wird geladen …",
  ratio = "aspect-[4/3]",
  allow,
  rootMargin = "200px",
  className = "",
}: {
  src: string;
  title: string;
  placeholder?: string;
  ratio?: string;
  allow?: string;
  rootMargin?: string;
  className?: string;
}) {
  const [ref, inView] = useInView<HTMLDivElement>(rootMargin);
  const pageLoaded = useAfterWindowLoad();
  const show = inView && pageLoaded;

  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${ratio} ${className}`}>
      {show ? (
        <iframe
          title={title}
          src={src}
          loading="lazy"
          allow={allow}
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center bg-cocoa-2 text-sm text-cream-dim"
          aria-hidden="true"
        >
          {placeholder}
        </div>
      )}
    </div>
  );
}

/**
 * `true`, sobald das `load`-Event der Seite durch ist – bzw. sofort, wenn die
 * Seite beim Mounten schon fertig geladen war (z. B. Client-Navigation).
 */
function useAfterWindowLoad() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (document.readyState === "complete") {
      setLoaded(true);
      return;
    }
    const onLoad = () => setLoaded(true);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return loaded;
}
