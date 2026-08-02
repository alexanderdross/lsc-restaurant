"use client";

import { useInView } from "./useInView";

/**
 * Generische, performance- & CLS-optimierte iframe-Einbindung.
 *
 * - Reserviert sofort den Platz über ein festes Seitenverhältnis (CLS = 0).
 * - Lädt das iframe erst „on-load"/lazy, sobald der Container in den Sichtbereich
 *   scrollt (IntersectionObserver) – schwerer Drittanbieter-Code wird nicht früh
 *   geladen. Zusätzlich natives `loading="lazy"`.
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

  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${ratio} ${className}`}>
      {inView ? (
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
