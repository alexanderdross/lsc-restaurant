import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import JobForm from "@/components/forms/JobForm";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Jobs & Karriere",
  description:
    "Wir suchen DICH! Werde Teil des Teams im LSC Restaurant am Bodensee-Airport Friedrichshafen. Jetzt online bewerben.",
  alternates: { canonical: "/jobs" },
};

const perks = [
  "Familiäres Team & herzliche Atmosphäre",
  "Faire Bezahlung",
  "Besonderer Arbeitsplatz direkt am Flughafen",
  "Geregelter Ruhetag (Montag)",
];

export default function JobsPage() {
  return (
    <>
      <PageHero
        eyebrow="Karriere"
        title="Wir suchen DICH!"
        subtitle="Auf der Suche nach neuen Herausforderungen? Werde Teil des LSC-Teams."
      />
      <section className="bg-cocoa">
        <div className="container-lsc grid gap-12 py-16 md:py-20 lg:grid-cols-[1fr_1.3fr]">
          <aside className="space-y-6">
            <p className="leading-relaxed text-cream-dim">
              Ob Service, Küche oder Aushilfe – wenn du Freude an italienischer
              Gastfreundschaft hast, freuen wir uns auf deine Bewerbung. Sende uns
              einfach das Formular, gerne mit Lebenslauf im Anhang.
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
              Fragen? Ruf uns an unter{" "}
              <a href={site.phone.href} className="font-semibold text-rose hover:text-rose-gold">
                {site.phone.display}
              </a>
              .
            </p>
          </aside>

          <div className="card p-6 md:p-8">
            <h2 className="mb-6 font-serif text-2xl text-cream">Jetzt bewerben</h2>
            <JobForm />
          </div>
        </div>
      </section>
    </>
  );
}
