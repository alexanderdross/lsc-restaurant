"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Cloudflare Turnstile – unsichtbare/interaktive Bot-Abwehr für Formulare.
 *
 * CLS-optimiert: Der Slot reserviert von Anfang an den Platz des Widgets
 * (Standardgröße 300×65 px) über einen Skeleton-Platzhalter, sodass beim
 * Nachladen des Widgets kein Layout-Shift entsteht.
 *
 * Der Token wird von Turnstile automatisch als verstecktes Feld
 * `cf-turnstile-response` in das umgebende <form> gelegt und serverseitig
 * (app/actions/mail.ts) gegen die siteverify-API geprüft.
 */

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  remove: (id: string) => void;
  reset: (id?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<void> | null = null;
function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Turnstile konnte nicht geladen werden."));
      document.head.appendChild(s);
    });
  }
  return scriptPromise;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function Turnstile({ action }: { action?: string }) {
  const holder = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !holder.current || !window.turnstile || widgetId.current)
          return;
        widgetId.current = window.turnstile.render(holder.current, {
          sitekey: SITE_KEY,
          theme: "dark",
          action,
          callback: () => setReady(true),
          "error-callback": () => setReady(true),
        });
      })
      .catch(() => {
        /* Skeleton bleibt sichtbar, Formular funktioniert (Server prüft optional) */
      });

    return () => {
      cancelled = true;
      if (widgetId.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetId.current);
        } catch {
          /* ignore */
        }
        widgetId.current = null;
      }
    };
  }, [action]);

  return (
    <div className="turnstile-slot">
      {/* Turnstile rendert hier hinein und legt das verborgene Token-Feld an */}
      <div ref={holder} />
      {!ready && (
        <div className="turnstile-skeleton" aria-hidden="true">
          <span>Sicherheitsprüfung</span>
        </div>
      )}
    </div>
  );
}
