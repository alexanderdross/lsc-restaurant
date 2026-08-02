"use client";

import { useEffect } from "react";

/**
 * Registriert den Service Worker (/sw.js) nach dem Laden der Seite.
 * Rendert nichts. In Entwicklungs-Builds (localhost via next dev) bewusst
 * nur bei Produktions-Auslieferung aktiv, um HMR nicht zu stören.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registrierung fehlgeschlagen – die Seite funktioniert ohne SW weiter.
      });
    };

    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
