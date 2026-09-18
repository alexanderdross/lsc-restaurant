"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Zurück-Button für die installierte PWA.
 *
 * Eine im Standalone-Modus gestartete PWA hat keine Browser-Leiste – wer in
 * eine Unterseite navigiert, hätte sonst keinen Weg zurück. Im normalen Browser
 * ist der Button überflüssig (die Browser-Leiste hat einen eigenen Zurück-Pfeil)
 * und bleibt deshalb komplett ausgeblendet.
 *
 * Bewusst als `next/dynamic`-Insel mit `ssr: false` in den Header geladen:
 *   - Er taucht nie im Server-HTML auf – die Kopfzeile im Browser bleibt
 *     Byte-identisch zu vorher.
 *   - Der zusätzliche Code liegt in einem eigenen Chunk und belastet nicht die
 *     First-Load-JS jeder Seite.
 *
 * Sichtbar nur, wenn:
 *   - die App im Standalone-Modus läuft (installierte PWA) UND
 *   - es überhaupt einen Verlaufseintrag gibt, zu dem zurückgesprungen werden
 *     kann (`history.length > 1`) – neu bei jedem Routenwechsel geprüft.
 *
 * Rein kosmetisch: löst `history.back()` aus.
 */
export default function PwaBackButton() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Nur in der installierten App zeigen, nicht im Browser-Tab.
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // iOS Safari kennt `display-mode` nicht überall, meldet aber `standalone`.
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    // Ausgeblendet, wenn es nichts gibt, wohin zurückgegangen werden könnte.
    setVisible(standalone && window.history.length > 1);
  }, [pathname]);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      aria-label="Zurück"
      title="Eine Seite zurück"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-cream transition-colors hover:text-rose"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );
}
