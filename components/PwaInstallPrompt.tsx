"use client";

import { useEffect, useState } from "react";

/**
 * Dezenter Installations-Hinweis für die PWA.
 *
 * Kleiner, wegklickbarer Banner unten rechts – kein modaler Dialog, blockiert
 * also nichts. Erscheint nur, wenn die App noch nicht installiert ist (kein
 * Standalone-Modus) und der Hinweis nicht kürzlich weggeklickt wurde.
 *
 * Zwei Wege, je nach Plattform:
 *   - Android/Chromium/Desktop: echtes `beforeinstallprompt`-Event → eigener
 *     „Installieren"-Button, der den nativen Dialog auslöst.
 *   - iOS/iPadOS Safari: kennt kein `beforeinstallprompt` → kurzer Hinweis
 *     „Teilen → Zum Home-Bildschirm".
 *
 * Wird wie der Zurück-Button als `next/dynamic`-Insel mit `ssr: false` geladen:
 * taucht nie im Server-HTML auf und liegt nicht in der First-Load-JS.
 */

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "pwa-install-dismissed";
// Nach dem Wegklicken eine Weile Ruhe geben.
const COOLDOWN_MS = 1000 * 60 * 60 * 24 * 14; // 14 Tage

function isStandalone(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone ===
      true
  );
}

function isIosSafari(): boolean {
  const ua = window.navigator.userAgent;
  const iOS =
    /iPad|iPhone|iPod/.test(ua) ||
    // iPadOS meldet sich als „MacIntel" mit Touch.
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (!iOS) return false;
  // Nur echtes Safari kann „Zum Home-Bildschirm"; andere iOS-Browser nicht.
  return /^((?!crios|fxios|edgios|chrome|android).)*safari/i.test(ua);
}

function recentlyDismissed(): boolean {
  try {
    const v = localStorage.getItem(DISMISS_KEY);
    if (!v) return false;
    const ts = Number(v);
    if (Number.isNaN(ts)) return true; // Altwert → als abgelehnt werten
    return Date.now() - ts < COOLDOWN_MS;
  } catch {
    return false;
  }
}

function markDismissed(): void {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // localStorage kann blockiert sein (Privatmodus) – dann eben ohne Merken.
  }
}

export default function PwaInstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [mode, setMode] = useState<null | "android" | "ios">(null);

  useEffect(() => {
    if (isStandalone() || recentlyDismissed()) return;

    let iosTimer = 0;

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // eigenen Hinweis statt Chrome-Mini-Infobar zeigen
      setDeferred(e as BeforeInstallPromptEvent);
      // Kurz warten, damit der Banner nicht direkt beim Laden aufpoppt.
      window.setTimeout(() => setMode("android"), 2500);
    };

    const onInstalled = () => {
      setMode(null);
      setDeferred(null);
      markDismissed();
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);

    if (isIosSafari()) {
      iosTimer = window.setTimeout(() => setMode("ios"), 3000);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      if (iosTimer) window.clearTimeout(iosTimer);
    };
  }, []);

  const install = async () => {
    if (!deferred) return;
    try {
      await deferred.prompt();
      await deferred.userChoice;
    } catch {
      // Abbruch/Fehler ignorieren – Hinweis in jedem Fall schließen.
    }
    setMode(null);
    setDeferred(null);
    markDismissed();
  };

  const dismiss = () => {
    setMode(null);
    markDismissed();
  };

  if (!mode) return null;

  return (
    <aside
      aria-label="LSC Restaurant installieren"
      className="pwa-prompt fixed inset-x-4 bottom-4 z-[60] sm:inset-x-auto sm:right-4 sm:max-w-sm"
    >
      <div className="card flex items-start gap-3 p-4 shadow-lg shadow-black/40">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/icons/icon-192.png"
          alt=""
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-xl"
          aria-hidden="true"
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-cream">App installieren</p>
          {mode === "android" ? (
            <p className="mt-0.5 text-sm text-cream-dim">
              LSC Restaurant zum Startbildschirm hinzufügen – schneller Zugriff,
              ganz ohne Browser-Leiste.
            </p>
          ) : (
            <p className="mt-0.5 text-sm text-cream-dim">
              Im Menü{" "}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="inline h-4 w-4 -translate-y-0.5 text-rose"
                aria-hidden="true"
              >
                <path d="M12 16V4" />
                <path d="M8 8l4-4 4 4" />
                <path d="M6 12v6a2 2 0 002 2h8a2 2 0 002-2v-6" />
              </svg>{" "}
              „Teilen" tippen und dann{" "}
              <span className="whitespace-nowrap font-medium text-cream">
                „Zum Home-Bildschirm"
              </span>
              .
            </p>
          )}

          {mode === "android" && (
            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={install}
                className="btn btn-primary !py-2 text-sm"
              >
                Installieren
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="text-sm text-cream-dim underline decoration-cream/30 underline-offset-4 hover:text-cream"
              >
                Später
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="Hinweis schließen"
          className="-m-1 shrink-0 rounded-full p-1 text-cream-dim transition-colors hover:text-cream"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
