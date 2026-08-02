import PageHero from "@/components/PageHero";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { allergene } from "@/content/menu";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Allergene & Zusatzstoffe",
  description:
    "Kennzeichnung der in unseren Speisen und Getränken enthaltenen Allergene und Zusatzstoffe im LSC Restaurant.",
  path: "/allergene",
  keywords: ["Allergene", "Zusatzstoffe", "LSC Restaurant Kennzeichnung"],
});

function Legend({
  title,
  items,
}: {
  title: string;
  items: { code: string; label: string }[];
}) {
  return (
    <div className="card p-6 md:p-8">
      <h2 className="mb-5 font-serif text-2xl text-cream">{title}</h2>
      <dl className="space-y-3">
        {items.map((it) => (
          <div key={it.code} className="flex gap-4 border-b border-cream/10 pb-3 last:border-0">
            <dt className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-wine text-sm font-semibold text-rose">
              {it.code}
            </dt>
            <dd className="pt-0.5 text-cream-dim">{it.label}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export default function AllergenePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", path: "/" },
          { name: "Allergene & Zusatzstoffe", path: "/allergene" },
        ]}
      />
      <PageHero
        eyebrow="Gut zu wissen"
        title="Allergene & Zusatzstoffe"
        subtitle="Die Codes in Klammern auf unserer Speisekarte entsprechen der folgenden Kennzeichnung."
      />
      <section className="bg-cocoa">
        <div className="container-lsc py-16 md:py-20">
          <div className="grid gap-6 md:grid-cols-2">
            <Legend title="Allergene" items={allergene.allergens} />
            <Legend title="Zusatzstoffe" items={allergene.additives} />
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-cream-dim">
            {allergene.note}
          </p>
        </div>
      </section>
    </>
  );
}
