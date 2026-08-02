import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { DishList } from "@/components/Menu";
import { mittagstisch } from "@/content/menu";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Mittagstisch",
  description:
    "Der Mittagstisch im LSC Restaurant: wechselnde, günstige Gerichte von Dienstag bis Freitag, 12 – 14 Uhr.",
  alternates: { canonical: "/mittagstisch" },
};

export default function MittagstischPage() {
  return (
    <>
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
