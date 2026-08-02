import PageHero from "@/components/PageHero";
import ContactForm from "@/components/forms/ContactForm";
import LazyEmbed from "@/components/LazyEmbed";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Reservieren & Kontakt",
  description:
    "Reservieren Sie Ihren Tisch im LSC Restaurant am Bodensee-Airport Friedrichshafen – bequem online oder telefonisch unter 07541 73336.",
  path: "/reservieren",
  keywords: [
    "Tisch reservieren Friedrichshafen",
    "LSC Restaurant Kontakt",
    "Reservierung Bodensee Airport",
  ],
});

export default function ReservierenPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", path: "/" },
          { name: "Reservieren", path: "/reservieren" },
        ]}
      />
      <PageHero
        eyebrow="Reservierung & Kontakt"
        title="Tisch reservieren"
        subtitle="Senden Sie uns Ihre Anfrage – wir melden uns schnellstmöglich zurück."
      />
      <section className="bg-cocoa">
        <div className="container-lsc grid gap-12 py-16 md:py-20 lg:grid-cols-[1.3fr_1fr]">
          {/* Formular */}
          <div>
            <ContactForm />
          </div>

          {/* Kontaktinfos */}
          <aside className="space-y-8">
            <div className="card p-6 md:p-8">
              <h2 className="mb-4 font-serif text-xl text-cream">So erreichen Sie uns</h2>
              <ul className="space-y-3 text-cream-dim">
                <li>
                  <a href={site.phone.href} className="hover:text-rose">
                    {site.phone.intl}
                  </a>
                </li>
                <li>
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
                    <dd className={h.closed ? "text-rose" : "text-cream"}>{h.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="card overflow-hidden">
              <LazyEmbed
                src={site.address.mapsEmbed}
                title="Standort LSC Restaurant"
                placeholder="Karte wird geladen …"
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
