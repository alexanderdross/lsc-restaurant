import Link from "next/link";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/forms/ContactForm";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Schreiben Sie uns",
  description:
    "Kontaktformular des LSC Restaurants am Bodensee-Airport Friedrichshafen: Fragen, Feedback oder Bewerbung – schreiben Sie uns, wir melden uns bei Ihnen.",
  path: "/jobs",
  keywords: [
    "LSC Restaurant Kontaktformular",
    "Jobs Friedrichshafen Gastronomie",
    "Stellenangebote LSC Restaurant",
  ],
});

const perks = [
  "Familiäres Team & herzliche Atmosphäre",
  "Faire Bezahlung",
  "Besonderer Arbeitsplatz direkt am Flughafen",
  "Geregelter Ruhetag (Montag)",
];

export default function JobsPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", path: "/" },
          { name: "Schreiben Sie uns", path: "/jobs" },
        ]}
      />
      <PageHero
        eyebrow="Kontaktformular & Karriere"
        title="Schreiben Sie uns"
        subtitle="Ob Frage, Feedback oder Bewerbung – schreiben Sie uns einfach, wir melden uns bei Ihnen."
      />
      <section className="bg-cocoa">
        <div className="container-lsc grid gap-12 py-16 md:py-20 lg:grid-cols-[1fr_1.3fr]">
          <aside className="space-y-6">
            <p className="leading-relaxed text-cream-dim">
              Für Tischreservierungen und Bestellungen rufen Sie uns bitte
              direkt an – die nehmen wir ausschließlich telefonisch entgegen.
              Für alles andere ist dieses Formular der schnellste Weg zu uns.
            </p>
            <p>
              <a
                href={site.phone.href}
                title="LSC Restaurant telefonisch erreichen"
                className="font-semibold text-rose hover:text-rose-gold"
              >
                Jetzt anrufen: {site.phone.display}
              </a>
            </p>

            <hr className="rule" />

            <h2 className="font-serif text-2xl text-cream">Wir suchen DICH!</h2>
            <p className="leading-relaxed text-cream-dim">
              Ob Service, Küche oder Aushilfe – wenn du Freude an italienischer
              Gastfreundschaft hast, freuen wir uns auf deine Bewerbung. Wähle
              im Formular einfach „Bewerbung“ aus; Zeugnisse und Lebenslauf
              kannst du uns nachreichen, sobald wir uns bei dir gemeldet haben.
            </p>
            <ul className="space-y-3">
              {perks.map((p) => (
                <li key={p} className="flex items-start gap-3 text-cream-dim">
                  <span className="mt-1 text-rose">✓</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm text-cream-dim">
              Anfahrt, Öffnungszeiten und häufige Fragen finden Sie auf der{" "}
              <Link
                href="/kontakt"
                title="Kontakt, Anfahrt & Öffnungszeiten des LSC Restaurants"
                className="font-semibold text-rose hover:text-rose-gold"
              >
                Kontaktseite
              </Link>
              .
            </p>
          </aside>

          <div className="card p-6 md:p-8">
            <h2 className="mb-6 font-serif text-2xl text-cream">
              Ihre Nachricht
            </h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
