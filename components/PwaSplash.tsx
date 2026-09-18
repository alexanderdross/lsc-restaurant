"use client";

import { useEffect } from "react";

/**
 * Steuert den Start-Ladebildschirm der installierten PWA.
 *
 * Das Overlay selbst (`#pwa-splash`) wird direkt im Server-HTML des Layouts
 * ausgeliefert, damit es beim App-Start sofort – noch vor der Hydration –
 * sichtbar ist. Sichtbar ist es ausschließlich im Standalone-Modus; im Browser
 * bleibt es per CSS (`display: none`) komplett aus.
 *
 * Diese Komponente rendert nichts. Sie blendet das Overlay aus, sobald die
 * Seite fertig geladen ist. Als Sicherheitsnetz blendet sich das Overlay per
 * CSS-Animation auch ohne JavaScript nach kurzer Zeit selbst aus – es bleibt
 * also nie dauerhaft stehen.
 */
export default function PwaSplash() {
  useEffect(() => {
    const el = document.getElementById("pwa-splash");
    if (!el) return;

    const hide = () => el.classList.add("is-hidden");

    if (document.readyState === "complete") {
      hide();
      return;
    }

    window.addEventListener("load", hide, { once: true });
    return () => window.removeEventListener("load", hide);
  }, []);

  return null;
}
