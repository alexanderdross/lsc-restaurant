import Link from "next/link";
import { site } from "@/content/site";

/**
 * Kompakter Abhol-Hinweis mit Claim und Telefon-CTA.
 * Steht auf allen drei Karten (`/speisekarte`, `/mittagstisch`,
 * `/saisonkarte`) unter den Gerichten. Texte: `site.takeaway`.
 */
export default function TakeawayNote({
  className = "",
}: {
  className?: string;
}) {
  const t = site.takeaway;

  return (
    <aside
      aria-label={t.eyebrow}
      className={`rounded-[var(--radius-card)] border border-rose/25 bg-wine/40 p-6 text-center md:p-8 ${className}`}
    >
      <p className="eyebrow mb-3">{t.eyebrow}</p>
      <p className="script text-2xl sm:text-3xl">{t.claim}</p>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-cream-dim">
        {t.note}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <a
          href={site.phone.href}
          title="Essen zur Selbstabholung telefonisch bestellen"
          className="btn btn-primary"
        >
          {/* Nummer nicht mitten im Umbruch trennen (schmale Viewports) */}
          {`${t.ctaLabel}: ${site.phone.display.replace(/\s/g, "\u00a0")}`}
        </a>
        <Link
          href={`/#${t.anchor}`}
          title="Alle Vorteile der Selbstabholung im LSC Restaurant"
          className="text-sm font-semibold text-rose hover:text-rose-gold"
        >
          Vorteile der Selbstabholung →
        </Link>
      </div>
    </aside>
  );
}
