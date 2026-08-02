import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { MenuCategories } from "@/components/Menu";
import { speisekarte } from "@/content/menu";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Speisekarte",
  description:
    "Die Speisekarte des LSC Restaurants: Vorspeisen, Salate, hausgemachte Pasta, Steinofen-Pizza, Fleisch, Fisch und hausgemachte Desserts.",
  alternates: { canonical: "/speisekarte" },
};

export default function SpeisekartePage() {
  return (
    <>
      <PageHero
        eyebrow="Buon Appetito"
        title="Speisekarte"
        subtitle="Italienische Spezialitäten – frisch zubereitet mit Liebe zum Detail."
      />
      <section className="bg-cocoa">
        <div className="container-lsc py-16 md:py-20">
          <MenuCategories categories={speisekarte} />

          <div className="mt-16 rounded-[var(--radius-card)] border border-cream/10 bg-espresso/60 p-6 text-center text-sm text-cream-dim">
            <p>
              Eine Auflistung aller in unseren Speisen &amp; Getränken enthaltenen
              Allergene und Zusatzstoffe finden Sie{" "}
              <Link href="/allergene" className="font-semibold text-rose hover:text-rose-gold">
                hier
              </Link>
              .
            </p>
            <p className="mt-2">{site.payment.note}</p>
          </div>

          <div className="mt-10 text-center">
            <Link href="/reservieren" className="btn btn-primary">
              Tisch reservieren
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
