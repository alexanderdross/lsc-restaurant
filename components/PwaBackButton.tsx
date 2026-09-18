"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * Zurück-Button für den installierten PWA-Modus (Standalone).
 *
 * Im Browser übernimmt die native Zurück-Schaltfläche die Navigation. Als
 * installierte App (`display-mode: standalone` bzw. iOS `navigator.standalone`)
 * fehlt diese Chrome-Leiste – man kann von einer Unterseite sonst nur über das
 * Menü zurück. Deshalb blenden wir hier – wie in vielen App-Headern – einen
 * eigenen Zurück-Pfeil links neben dem Logo ein.
 *
 * Sichtbar nur, wenn:
 *   - die Seite im Standalone-Modus läuft (sonst reicht der Browser), und
 *   - man sich nicht auf der Startseite befindet (die `start_url` „/“ ist der
 *     Einstieg – dahinter gibt es kein „zurück“).
 */
export default function PwaBackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const [standalone, setStandalone] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(
      "(display-mode: standalone), (display-mode: minimal-ui), (display-mode: fullscreen)"
    );
    // iOS Safari meldet den Standalone-Modus nicht über display-mode.
    const iosStandalone = () =>
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true;

    const update = () => setStandalone(mql.matches || iosStandalone());
    update();

    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  if (!standalone || pathname === "/") return null;

  const goBack = () => {
    // Innerhalb der App zurück gehen, sonst als sicherer Fallback zur
    // Startseite – so landet man nie in einer Sackgasse oder „fällt“ aus der App.
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <button
      type="button"
      onClick={goBack}
      aria-label="Zurück"
      title="Zurück"
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-cream transition-colors hover:text-rose"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-6 w-6"
      >
        <path d="M19 12H5" />
        <path d="m12 19-7-7 7-7" />
      </svg>
      <span className="sr-only">Zurück</span>
    </button>
  );
}
