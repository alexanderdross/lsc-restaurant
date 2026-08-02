import Link from "next/link";
import PageHero from "@/components/PageHero";
import { DishList } from "@/components/Menu";
import { BreadcrumbJsonLd, SaisonkarteJsonLd } from "@/components/JsonLd";
import { saisonkarte } from "@/content/menu";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Saisonkarte",
  description:
    "Saisonale Spezialitäten im LSC Restaurant am Bodensee-Airport – frisch für Sie ausgewählt, wechselnd je nach Jahreszeit.",
  path: "/saisonkarte",
  keywords: ["Saisonkarte Friedrichshafen", "saisonale Gerichte Bodensee"],
});

export default function SaisonkartePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", path: "/" },
          { name: "Saisonkarte", path: "/saisonkarte" },
        ]}
      />
      <SaisonkarteJsonLd />
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
