"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Löst einmalig aus, sobald das referenzierte Element (nahezu) in den
 * Sichtbereich scrollt. Für Lazy-Loading schwerer Drittanbieter-Embeds
 * (Google Maps, Cloudflare Turnstile, 360°-Tour).
 *
 * Fallback: Ist IntersectionObserver nicht verfügbar, gilt sofort `inView = true`.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  rootMargin = "200px"
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, inView]);

  return [ref, inView];
}
