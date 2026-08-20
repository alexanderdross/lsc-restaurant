import Link from "next/link";
import Image from "next/image";
import { site } from "@/content/site";
import Reveal from "@/components/Reveal";
import PaymentNote from "@/components/PaymentNote";
import LazyEmbed from "@/components/LazyEmbed";

const highlights = [
  {
    title: "Steinofen-Pizza",
    text: "Knuspriger Boden aus dem Ofen – klassisch belegt, ganz nach italienischer Art.",
    icon: (
      <path d="M12 2C7 2 3 5 3 5s2 3 9 3 9-3 9-3-4-3-9-3Zm0 6c-6 0-8-2-8-2l7 13a1 1 0 0 0 1.8 0L21 6s-3 2-9 2Zm-2 3a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm3 3a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
    ),
  },
  {
    title: "Hausgemachte Pasta",
    text: "Frische Nudeln und Saucen nach Familienrezept – von Carbonara bis Pesto Verde.",
    icon: (
      <path d="M4 3h16v2H4V3Zm0 4h16l-1 12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 7Zm4 3v7m4-7v7m4-7v7" />
    ),
  },
  {
    title: "Frische Salate",
    text: "Knackig, mediterran und saisonal – ideal als leichte Begleitung mit Blick aufs Rollfeld.",
    icon: (
      <path d="M5 11h14a7 7 0 0 1-14 0Zm2-2a5 5 0 0 1 10 0M3 13h18l-1 3a4 4 0 0 1-3.7 2.5H7.7A4 4 0 0 1 4 16l-1-3Z" />
    ),
  },
];

const menuLinks = [
  { href: "/speisekarte", label: "Speisekarte", text: "Vorspeisen, Pasta, Pizza, Fleisch, Fisch & Dessert" },
  { href: "/mittagstisch", label: "Mittagstisch", text: "Günstige Gerichte, Di – Fr von 12 – 14 Uhr" },
  { href: "/saisonkarte", label: "Saisonkarte", text: "Saisonale Spezialitäten – frisch für Sie ausgewählt" },
];

export default function Home() {
  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden bg-espresso">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 50% 0%, rgba(90,55,51,0.9), transparent 60%), radial-gradient(60% 50% at 80% 90%, rgba(201,154,154,0.14), transparent 60%)",
          }}
        />
        <div className="container-lsc relative flex min-h-[82vh] flex-col items-center justify-center py-24 text-center">
          <Reveal>
            <h1 className="sr-only">
              {site.name} – {site.claim}
            </h1>
            <p className="eyebrow mb-5">Bodensee-Airport Friedrichshafen</p>
            <Image
              src="/logo.webp"
              alt={site.name}
              width={640}
              height={359}
              priority
              sizes="(min-width: 640px) 280px, 200px"
              className="mx-auto mb-8 h-28 w-auto sm:h-36"
            />
            <p className="script text-3xl sm:text-4xl">{site.claim}</p>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-cream-dim">
              Italienische Küche mit Herz – Steinofen-Pizza, hausgemachte Pasta und
              frische Salate, direkt am Flughafen mit Blick aufs Rollfeld.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <a href={site.phone.href} className="btn btn-primary">
                Jetzt anrufen
              </a>
              <Link href="/speisekarte" className="btn btn-outline">
                Zur Speisekarte
              </Link>
            </div>
            <PaymentNote className="mx-auto mt-6 max-w-md text-center" />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- Welcome */}
      <section className="bg-cocoa">
        <div className="container-lsc py-20 text-center md:py-28">
          <Reveal>
            <p className="script text-2xl sm:text-3xl">{site.tagline}</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-3xl leading-tight md:text-4xl">
              Der Ort, an dem kulinarische Freuden wahr werden
            </h2>
            <p className="mx-auto mt-6 max-w-2xl leading-relaxed text-cream-dim">
              Wir begrüßen unsere Gäste mit nahrhaften, leckeren und erschwinglichen
              Speisen. Überzeuge dich selbst und buche einen Tisch bei uns – wir
              freuen uns auf dich.
            </p>
            <p className="mt-6 font-serif text-lg italic text-rose">
              {site.owner}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------------------------------------------------- Highlights */}
      <section className="bg-espresso">
        <div className="container-lsc py-20 md:py-24">
          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((h, i) => (
              <Reveal key={h.title} delay={i * 90}>
                <article className="card h-full p-8 text-center">
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-wine">
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--color-rose)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      {h.icon}
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl text-cream">{h.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-cream-dim">
                    {h.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ USP band */}
      <section className="relative overflow-hidden bg-wine">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(90% 90% at 15% 20%, rgba(216,180,166,0.2), transparent 55%)",
          }}
        />
        <div className="container-lsc relative grid items-center gap-10 py-20 md:grid-cols-2 md:py-24">
          <Reveal>
            <p className="eyebrow mb-3">Einzigartige Lage</p>
            <h2 className="text-3xl md:text-4xl">
              Essen mit Blick aufs Rollfeld
            </h2>
            <p className="mt-5 max-w-lg leading-relaxed text-cream-dim">
              Direkt am Bodensee-Airport gelegen, verbindet das LSC Restaurant
              italienischen Genuss mit einem besonderen Ausblick: Von unserer
              Terrasse aus beobachten Sie startende und landende Flugzeuge – ein
              Erlebnis für die ganze Familie.
            </p>
            <Link href="/rundgang" className="btn btn-outline mt-8">
              360° Rundgang ansehen
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <div className="card overflow-hidden">
              <LazyEmbed
                src={site.address.mapsEmbed}
                title="Standort LSC Restaurant auf der Karte"
                placeholder="Karte wird geladen …"
                consent={{ provider: "Google Maps", loadLabel: "Karte laden" }}
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------------- Menu teaser */}
      <section className="bg-cocoa">
        <div className="container-lsc py-20 md:py-24">
          <Reveal className="mb-12 text-center">
            <p className="eyebrow mb-3">Guten Appetit</p>
            <h2 className="text-3xl md:text-4xl">Unsere Karten</h2>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {menuLinks.map((m, i) => (
              <Reveal key={m.href} delay={i * 90}>
                <Link
                  href={m.href}
                  className="card group flex h-full flex-col p-8 transition-colors hover:border-rose/40"
                >
                  <h3 className="font-serif text-2xl text-cream group-hover:text-rose">
                    {m.label}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-cream-dim">
                    {m.text}
                  </p>
                  <span className="mt-5 text-sm font-semibold text-rose">
                    Ansehen →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Hours + CTA */}
      <section className="bg-espresso">
        <div className="container-lsc grid gap-10 py-20 md:grid-cols-2 md:py-24">
          <Reveal>
            <p className="eyebrow mb-3">Öffnungszeiten</p>
            <h2 className="text-3xl md:text-4xl">Wir freuen uns auf Sie</h2>
            <dl className="mt-6 max-w-md space-y-3">
              {site.hours.map((h) => (
                <div
                  key={h.day}
                  className="flex justify-between border-b border-cream/10 pb-3"
                >
                  <dt className="text-cream">{h.day}</dt>
                  <dd className={h.closed ? "text-rose" : "text-cream-dim"}>
                    {h.value}
                  </dd>
                </div>
              ))}
            </dl>
            <PaymentNote className="mt-5" />
          </Reveal>

          <Reveal delay={120}>
            <div className="card flex h-full flex-col justify-center p-8 text-center md:p-10">
              <p className="script text-2xl">Reservieren Sie telefonisch</p>
              <p className="mt-3 text-cream-dim">
                Ob zu zweit oder in großer Runde – Bestellungen und Reservierungen
                nehmen wir gerne telefonisch entgegen.
              </p>
              <div className="mt-7 flex flex-col items-center gap-3">
                <a href={site.phone.href} className="btn btn-primary w-full sm:w-auto">
                  Jetzt anrufen: {site.phone.display}
                </a>
                <Link
                  href="/kontakt"
                  className="text-sm font-semibold text-cream hover:text-rose"
                >
                  Kontakt & Anfahrt
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
