"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/components/useInView";

/**
 * Cloudflare Turnstile – Bot-Abwehr für Formulare.
 *
 * - CLS-optimiert: reservierter Slot (300×65) über einen Skeleton-Platzhalter.
 * - Lazy/„on-load": Script + Widget werden erst geladen, wenn der Slot in den
 *   Sichtbereich scrollt (useInView) – kein `challenges.cloudflare.com`-Request
 *   beim initialen Seitenaufruf. rootMargin sorgt dafür, dass es rechtzeitig vor
 *   dem Absende-Button bereit ist.
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
  const [slotRef, inView] = useInView<HTMLDivElement>("250px");
  const holder = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!SITE_KEY || !inView) return;
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
  }, [action, inView]);

  return (
    <div ref={slotRef} className="turnstile-slot">
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
