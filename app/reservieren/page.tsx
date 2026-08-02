import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/forms/ContactForm";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Reservieren & Kontakt",
  description:
    "Reservieren Sie Ihren Tisch im LSC Restaurant am Bodensee-Airport Friedrichshafen – bequem online oder telefonisch unter 07541 73336.",
  alternates: { canonical: "/reservieren" },
};

export default function ReservierenPage() {
  return (
    <>
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
              <iframe
                title="Standort LSC Restaurant"
                src={site.address.mapsEmbed}
                className="aspect-[4/3] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
