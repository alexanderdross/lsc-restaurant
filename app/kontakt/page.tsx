import PageHero from "@/components/PageHero";
import LazyEmbed from "@/components/LazyEmbed";
import Faq from "@/components/Faq";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/JsonLd";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Kontakt",
  description:
    "Kontakt zum LSC Restaurant am Bodensee-Airport Friedrichshafen. Bestellungen und Tischreservierungen nehmen wir ausschließlich telefonisch unter 07541 73336 entgegen.",
  path: "/kontakt",
  keywords: [
    "LSC Restaurant Kontakt",
    "LSC Restaurant Telefon",
    "Tisch reservieren Friedrichshafen telefonisch",
  ],
});

export default function KontaktPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", path: "/" },
          { name: "Kontakt", path: "/kontakt" },
        ]}
      />
      <FaqJsonLd items={site.faq} />
      <PageHero
        eyebrow="Kontakt"
        title="Kontakt"
        subtitle="Wir freuen uns auf Ihren Anruf."
      />

      {/* Telefon-Hinweis: Bestellungen & Reservierungen nur telefonisch */}
      <section className="bg-wine">
        <div className="container-lsc py-12 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="eyebrow mb-3">Bestellung &amp; Reservierung</p>
            <h2 className="text-2xl text-cream md:text-3xl">
              Bestellungen und Tischreservierungen nehmen wir ausschließlich
              telefonisch entgegen.
            </h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-cream-dim">
              Ein Online-Reservierungs- oder Bestellformular bieten wir bewusst
              nicht an. Rufen Sie uns einfach an – wir nehmen Ihre Bestellung
              oder Tischreservierung gerne persönlich entgegen.
            </p>
            <div className="mt-8">
              <a
                href={site.phone.href}
                className="btn btn-primary text-base"
                title="Jetzt im LSC Restaurant anrufen"
              >
                Jetzt anrufen: {site.phone.display}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cocoa">
        <div className="container-lsc grid gap-12 py-16 md:py-20 lg:grid-cols-2">
          {/* Kontaktinfos */}
          <div className="card p-6 md:p-8">
            <h2 className="mb-4 font-serif text-xl text-cream">So erreichen Sie uns</h2>
            <ul className="space-y-3 text-cream-dim">
              <li>
                Telefon:{" "}
                <a href={site.phone.href} className="text-cream hover:text-rose">
                  {site.phone.intl}
                </a>
              </li>
              <li>
                E-Mail:{" "}
                <a href={`mailto:${site.email}`} className="hover:text-rose">
                  {site.email}
                </a>
              </li>
              <li className="pt-2">
                {site.address.street}
                <br />
                {site.address.zip} {site.address.city}
              </li>
            </ul>

            <h3 className="mb-3 mt-6 font-serif text-lg text-cream">Öffnungszeiten</h3>
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
          </div>

          {/* Karte */}
          <div className="card overflow-hidden">
            <LazyEmbed
              src={site.address.mapsEmbed}
              title="Standort LSC Restaurant"
              placeholder="Karte wird geladen …"
            />
          </div>
        </div>

        {/* Anfahrt & Parken – kurzer, faktischer GEO-Content (LLM-zitierfähig) */}
        <div className="container-lsc pb-16 md:pb-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl text-cream md:text-3xl">Anfahrt &amp; Parken</h2>
            <p className="mt-4 leading-relaxed text-cream-dim">
              Sie finden das {site.shortName} direkt am {site.address.landmark},{" "}
              {site.address.street}, {site.address.zip} {site.address.city} –
              direkt hinter dem Hotel Ibis. Die Anfahrt mit dem Auto führt über
              den Flughafen; am Bodensee-Airport stehen Parkmöglichkeiten zur
              Verfügung. Von unserer Terrasse aus haben Sie dabei einen direkten
              Blick aufs Rollfeld.
            </p>
          </div>
        </div>
      </section>

      {/* Häufige Fragen (sichtbar + FAQPage-Schema, gut für lokale Suche & GEO) */}
      <section className="bg-espresso">
        <div className="container-lsc py-16 md:py-20">
          <div className="mb-10 text-center">
            <p className="eyebrow mb-3">Gut zu wissen</p>
            <h2 className="text-3xl md:text-4xl">Häufige Fragen</h2>
          </div>
          <Faq items={site.faq} className="mx-auto max-w-4xl" />
        </div>
      </section>
    </>
  );
}
