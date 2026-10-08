import { site } from "@/content/site";
import Reveal from "./Reveal";

/**
 * Kampagnen-Band „Selbstabholung“ für die Startseite.
 *
 * Trägt den Claim (`site.takeaway.claim`), den Aufhänger gegen die lange
 * Wartezeit beim Lieferdienst, vier Argumente und den Ablauf in drei
 * Schritten. Texte stehen zentral in `content/site.ts`.
 *
 * Die Reihenfolge der Icons entspricht der von `site.takeaway.benefits` –
 * beim Umsortieren der Argumente hier mitziehen.
 */
function BenefitIcon({ index }: { index: number }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-rose)"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Uhr – Abholzeit statt Lieferfenster */}
      {index === 0 && (
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7.2V12l3.4 2" />
        </>
      )}
      {/* Flamme – heiß statt lauwarm */}
      {index === 1 && (
        <path d="M12 2.5c2.6 3 4.5 5.3 4.5 8.6a4.5 4.5 0 0 1-9 0c0-1.8.8-3.2 1.9-4.4.2 1.5.9 2.4 1.8 2.6-.6-2.3-.2-4.5.8-6.8Z" />
      )}
      {/* Preisschild – Preis wie auf der Karte */}
      {index === 2 && (
        <>
          <path d="M20.6 11.4 12.2 3H4v8.2l8.4 8.4a2 2 0 0 0 2.8 0l5.4-5.4a2 2 0 0 0 0-2.8Z" />
          <circle cx="7.6" cy="7.6" r="1.2" />
        </>
      )}
      {/* Auto – Parkplatz vor der Tür */}
      {index === 3 && (
        <>
          <path d="M4.5 16.5V11l1.8-4.2a2 2 0 0 1 1.8-1.3h7.8a2 2 0 0 1 1.8 1.3L19.5 11v5.5M4.5 13.5h15" />
          <circle cx="8" cy="16.8" r="1.7" />
          <circle cx="16" cy="16.8" r="1.7" />
        </>
      )}
    </svg>
  );
}

export default function TakeawayBand() {
  const t = site.takeaway;

  return (
    <section
      id={t.anchor}
      aria-labelledby={`${t.anchor}-title`}
      className="relative scroll-mt-28 overflow-hidden bg-cocoa"
    >
      {/* warmer Rosé-Schimmer, damit das Band als Kampagnenfläche liest */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(85% 70% at 50% 0%, rgba(216,180,166,0.14), transparent 62%)",
        }}
      />

      <div className="container-lsc relative py-20 md:py-24">
        {/* ------------------------------------------------- Claim & Aufhänger */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-4">{t.eyebrow}</p>
          <p className="script text-3xl sm:text-4xl">{t.claim}</p>
          <h2
            id={`${t.anchor}-title`}
            className="mt-5 text-3xl leading-tight md:text-4xl"
          >
            {t.headline}
          </h2>
          <p className="mt-5 leading-relaxed text-cream-dim">{t.subline}</p>
        </Reveal>

        {/* -------------------------------------------------------- Argumente */}
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.benefits.map((b, i) => (
            <Reveal as="li" key={b.title} delay={i * 80} className="h-full">
              <div className="card h-full p-6">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-wine">
                  <BenefitIcon index={i} />
                </span>
                <h3 className="font-serif text-lg text-cream">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-dim">
                  {b.text}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>

        {/* ------------------------------------------------- Ablauf & Abschluss */}
        <div className="mt-14 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <h3 className="font-serif text-xl text-cream">So einfach geht’s</h3>
            <ol className="mt-5 space-y-5">
              {t.steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-rose/40 font-serif text-sm text-rose"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-cream">{s.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-cream-dim">
                      {s.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={120}>
            <div className="card p-8 text-center">
              <p className="script text-2xl">{t.subclaim}</p>
              <p className="mt-3 text-sm leading-relaxed text-cream-dim">
                Bestellungen zur Abholung nehmen wir telefonisch entgegen –
                Dienstag bis Sonntag, warme Küche von 12:00 bis 21:00 Uhr.
              </p>
              <a
                href={site.phone.href}
                title="Essen zur Selbstabholung telefonisch bestellen"
                className="btn btn-primary mt-6 w-full sm:w-auto"
              >
                {/* Nummer nicht mitten im Umbruch trennen (schmale Viewports) */}
                {`${t.ctaLabel}: ${site.phone.display.replace(/\s/g, "\u00a0")}`}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
