"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "./useInView";

/**
 * Generische, performance- & CLS-optimierte iframe-Einbindung.
 *
 * - Reserviert sofort den Platz über ein festes Seitenverhältnis (CLS = 0):
 *   Platzhalter, Zustimmungsfeld und iframe liegen absolut im selben
 *   Ratio-Container, das Nachladen verschiebt also nichts.
 * - Lädt das iframe erst, wenn BEIDES zutrifft: das `load`-Event der Seite ist
 *   durch UND der Container ist (fast) im Sichtbereich (IntersectionObserver).
 *   So konkurriert schwerer Drittanbieter-Code nie mit LCP und Hydration.
 *   Zusätzlich natives `loading="lazy"`.
 * - Optional (`consent`): Zwei-Klick-Lösung. Ohne aktiven Klick der Besucherin
 *   geht kein einziger Request an den Drittanbieter raus – auch keiner, der nur
 *   die IP überträgt. Siehe `EmbedConsent` unten.
 *
 * Einsatz: Google Maps (aspect-[4/3]) und 360°-Tour (aspect-video), beide mit consent.
 */
export default function LazyEmbed({
  src,
  title,
  placeholder = "Wird geladen …",
  ratio = "aspect-[4/3]",
  allow,
  rootMargin = "200px",
  className = "",
  consent,
}: {
  src: string;
  title: string;
  placeholder?: string;
  ratio?: string;
  allow?: string;
  rootMargin?: string;
  className?: string;
  /**
   * Zwei-Klick-Lösung aktivieren. `provider` erscheint im Hinweistext,
   * `storageKey` bestimmt, unter welchem Schlüssel die Zustimmung für die Dauer
   * des Besuchs gemerkt wird (sessionStorage – bewusst nicht dauerhaft).
   * Ohne `storageKey` wird er aus `provider` abgeleitet.
   */
  consent?: { provider: string; loadLabel?: string; storageKey?: string };
}) {
  const [ref, inView] = useInView<HTMLDivElement>(rootMargin);
  const pageLoaded = useAfterWindowLoad();
  const [accepted, setAccepted] = useConsent(
    consent && (consent.storageKey ?? consent.provider)
  );

  const needsConsent = Boolean(consent) && !accepted;
  const show = inView && pageLoaded && !needsConsent;

  return (
    <div ref={ref} className={`relative w-full overflow-hidden ${ratio} ${className}`}>
      {show ? (
        <iframe
          title={title}
          src={src}
          loading="lazy"
          allow={allow}
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : needsConsent ? (
        <EmbedConsent
          provider={consent!.provider}
          loadLabel={consent!.loadLabel}
          onAccept={() => setAccepted(true)}
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

/**
 * Zustimmungsfeld anstelle des Embeds: erklärt, was beim Laden passiert, und
 * lädt den Drittanbieter erst auf Klick („Zwei-Klick-Lösung").
 */
function EmbedConsent({
  provider,
  loadLabel,
  onAccept,
}: {
  provider: string;
  loadLabel?: string;
  onAccept: () => void;
}) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-cocoa-2 px-6 py-8 text-center">
      <p className="max-w-md text-sm leading-relaxed text-cream-dim">
        An dieser Stelle binden wir {provider} ein. Beim Laden werden Daten – unter
        anderem Ihre IP-Adresse – an den Anbieter übermittelt und es können Cookies
        gesetzt werden. Näheres in unserer{" "}
        <Link href="/datenschutz" className="font-semibold text-rose hover:text-rose-gold">
          Datenschutzerklärung
        </Link>
        .
      </p>
      <button type="button" onClick={onAccept} className="btn btn-primary">
        {loadLabel ?? `${provider} laden`}
      </button>
      <p className="text-xs text-cream-dim/80">
        Ihre Zustimmung gilt nur für diesen Besuch.
      </p>
    </div>
  );
}

/**
 * `true`, sobald das `load`-Event der Seite durch ist – bzw. sofort, wenn die
 * Seite beim Mounten schon fertig geladen war (z. B. Client-Navigation).
 */
function useAfterWindowLoad() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (document.readyState === "complete") {
      setLoaded(true);
      return;
    }
    const onLoad = () => setLoaded(true);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return loaded;
}

/**
 * Merkt die einmal erteilte Zustimmung für die Dauer des Besuchs, damit die
 * Karte beim Wechsel zwischen Startseite und Kontakt nicht erneut freigegeben
 * werden muss. Bewusst `sessionStorage` statt `localStorage`: nichts bleibt über
 * das Schließen des Tabs hinaus stehen, es gibt also auch nichts zu widerrufen.
 * Pro Anbieter ein eigener Schlüssel – die Zustimmung zur Karte gibt also nicht
 * zugleich die 360°-Tour frei.
 *
 * Ohne Schlüssel (kein consent gefordert) ist der Wert konstant `true`.
 */
function useConsent(key?: string | false): [boolean, (value: boolean) => void] {
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!key) return;
    try {
      if (sessionStorage.getItem(storageKey(key)) === "1") setAccepted(true);
    } catch {
      // sessionStorage kann blockiert sein (Privatmodus, strikte Einstellungen) –
      // dann bleibt es bei der Nachfrage pro Seitenaufruf.
    }
  }, [key]);

  const accept = (value: boolean) => {
    setAccepted(value);
    if (!key || !value) return;
    try {
      sessionStorage.setItem(storageKey(key), "1");
    } catch {
      // s. o. – das Embed lädt trotzdem, nur eben ohne Merken.
    }
  };

  return [key ? accepted : true, accept];
}

function storageKey(key: string) {
  return `embed-consent:${key.toLowerCase().replace(/\s+/g, "-")}`;
}
