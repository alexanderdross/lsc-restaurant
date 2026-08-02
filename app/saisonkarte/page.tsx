import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { DishList } from "@/components/Menu";
import { saisonkarte } from "@/content/menu";

export const metadata: Metadata = {
  title: "Saisonkarte",
  description:
    "Saisonale Spezialitäten im LSC Restaurant – frisch für Sie ausgewählt, wechselnd je nach Jahreszeit.",
  alternates: { canonical: "/saisonkarte" },
};

export default function SaisonkartePage() {
  return (
    <>
      <PageHero
        eyebrow="Saisonal & frisch"
        title="Saisonkarte"
        subtitle={saisonkarte.season}
      />
      <section className="bg-cocoa">
        <div className="container-lsc py-16 md:py-20">
          <DishList items={saisonkarte.items} />
          <div className="mt-14 text-center">
            <Link href="/reservieren" className="btn btn-primary">
              Tisch reservieren
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
