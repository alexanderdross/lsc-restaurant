import Link from "next/link";
import Image from "next/image";
import { site } from "@/content/site";
import { legalNav } from "@/content/nav";

export default function Footer() {
  const year = 2026;
  return (
    <footer className="border-t border-cream/10 bg-espresso">
      <div className="container-lsc grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Marke */}
        <div>
          <Image
            src="/logo-sm.webp"
            alt={site.name}
            width={360}
            height={202}
            loading="lazy"
            sizes="180px"
            className="mb-4 h-16 w-auto"
          />
          <p className="max-w-xs text-sm leading-relaxed text-cream-dim">
            {site.claim}. Familiär geführt von {site.owner}.
          </p>
        </div>

        {/* Kontakt */}
        <div>
          <h2 className="eyebrow mb-4">Kontakt</h2>
          <address className="space-y-2 text-sm not-italic text-cream-dim">
            <p>
              <a
                href={site.phone.href}
                title="LSC Restaurant telefonisch erreichen"
                className="hover:text-rose"
              >
                {site.phone.intl}
              </a>
            </p>
            <p>
              <Link
                href="/reservieren"
                title="Kontakt & Reservierung im LSC Restaurant"
                className="hover:text-rose"
              >
                {site.email}
              </Link>
            </p>
            <p className="pt-2">
              {site.address.street}
              <br />
              {site.address.zip} {site.address.city}
            </p>
            <p>
              <a
                href={site.address.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Anfahrt zum LSC Restaurant am Bodensee-Airport"
                className="text-rose hover:text-rose-gold"
              >
                Anfahrt &amp; Karte →
              </a>
            </p>
          </address>
        </div>

        {/* Öffnungszeiten */}
        <div>
          <h2 className="eyebrow mb-4">Öffnungszeiten</h2>
          <dl className="space-y-2 text-sm text-cream-dim">
            {site.hours.map((h) => (
              <div key={h.day} className="flex justify-between gap-4">
                <dt>{h.day}</dt>
                <dd
                  className={`whitespace-nowrap ${
                    h.closed ? "text-rose" : "text-cream"
                  }`}
                >
                  {h.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-cream-dim/80">
            {site.payment.note}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {site.payment.methods.map((m) => (
              <span
                key={m}
                className="rounded border border-cream/15 px-2 py-1 text-[0.7rem] uppercase tracking-wider text-cream-dim"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Jobs + Social */}
        <div>
          <h2 className="eyebrow mb-4">Wir suchen DICH!</h2>
          <p className="text-sm leading-relaxed text-cream-dim">
            Auf der Suche nach neuen Herausforderungen?
          </p>
          <Link
            href="/jobs"
            title="Jobs & Karriere im LSC Restaurant Friedrichshafen"
            className="mt-2 inline-block text-sm font-semibold text-rose hover:text-rose-gold"
          >
            Mehr Informationen →
          </Link>
          <div className="mt-6 flex gap-3">
            <a
              href={site.social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="LSC Restaurant auf Facebook"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream transition-colors hover:border-rose hover:text-rose"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M14 13.5h2.5l1-4H14V7c0-1.03 0-2 2-2h1.5V1.64c-.33-.04-1.55-.14-2.83-.14C11.98 1.5 10 3.16 10 6.2v3.3H7v4h3V22h4v-8.5z" />
              </svg>
            </a>
            <a
              href={site.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="LSC Restaurant auf Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/15 text-cream transition-colors hover:border-rose hover:text-rose"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Unterzeile */}
      <div className="border-t border-cream/10">
        <div className="container-lsc flex flex-col items-center justify-between gap-3 py-5 text-xs text-cream-dim sm:flex-row">
          <p>
            © {year} {site.shortName}. Alle Rechte vorbehalten.
          </p>
          <nav aria-label="Rechtliches" className="flex flex-wrap gap-4">
            {legalNav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                title={l.title}
                className="hover:text-rose"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
