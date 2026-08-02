import Link from "next/link";
import PageHero from "@/components/PageHero";
import { DishList } from "@/components/Menu";
import { BreadcrumbJsonLd, MittagstischJsonLd } from "@/components/JsonLd";
import { mittagstisch } from "@/content/menu";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Mittagstisch",
  description:
    "Der Mittagstisch im LSC Restaurant am Bodensee-Airport: wechselnde, günstige Gerichte von Dienstag bis Freitag, 12 – 14 Uhr.",
  path: "/mittagstisch",
  keywords: ["Mittagstisch Friedrichshafen", "Mittagsmenü Bodensee Airport"],
});

export default function MittagstischPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", path: "/" },
          { name: "Mittagstisch", path: "/mittagstisch" },
        ]}
      />
      <MittagstischJsonLd />
      <PageHero
        eyebrow="Unsere Mittagstischkarte"
        title="Mittagstisch"
        subtitle={`${mittagstisch.period} · ${mittagstisch.time}`}
      />
      <section className="bg-cocoa">
        <div className="container-lsc py-16 md:py-20">
          <p className="mx-auto mb-10 max-w-2xl text-center text-sm leading-relaxed text-cream-dim">
            {mittagstisch.note}
          </p>
          <DishList items={mittagstisch.items} />
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-cream-dim">
            {site.payment.note}
          </p>
          <div className="mt-8 text-center">
            <Link href="/reservieren" className="btn btn-primary">
              Tisch reservieren
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
