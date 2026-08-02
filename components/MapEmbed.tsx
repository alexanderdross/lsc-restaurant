"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Google-Maps-Einbindung – performance- und CLS-optimiert.
 *
 * - Reserviert sofort den Platz über ein festes Seitenverhältnis (CLS = 0).
 * - Lädt das eigentliche iframe erst „on-load"/lazy, sobald der Container in die
 *   Nähe des Viewports scrollt (IntersectionObserver) – schwerer Drittanbieter-
 *   Code wird also nicht früh geladen. Zusätzlich natives `loading="lazy"`.
 * - Fallback: Ist IntersectionObserver nicht verfügbar, wird direkt geladen.
 */
export default function MapEmbed({
  src,
  title,
  className = "",
  ratio = "aspect-[4/3]",
}: {
  src: string;
  title: string;
  className?: string;
  ratio?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShow(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: "300px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${ratio} ${className}`}>
      {show ? (
        <iframe
          title={title}
          src={src}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center bg-cocoa-2 text-sm text-cream-dim"
          aria-hidden="true"
        >
          Karte wird geladen …
        </div>
      )}
    </div>
  );
}
