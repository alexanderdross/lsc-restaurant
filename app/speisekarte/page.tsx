import PageHero from "@/components/PageHero";
import { MenuCategories } from "@/components/Menu";
import { BreadcrumbJsonLd, MenuJsonLd } from "@/components/JsonLd";
import { speisekarte } from "@/content/menu";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMeta({
  title: "Speisekarte",
  description:
    "Die Speisekarte des LSC Restaurants am Bodensee-Airport: Vorspeisen, Salate, hausgemachte Pasta, Steinofen-Pizza, Fleisch, Fisch und hausgemachte Desserts.",
  path: "/speisekarte",
  keywords: [
    "Speisekarte LSC Restaurant",
    "Pizza Friedrichshafen",
    "Pasta Friedrichshafen",
    "Italiener Bodensee Airport",
  ],
});

export default function SpeisekartePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", path: "/" },
          { name: "Speisekarte", path: "/speisekarte" },
        ]}
      />
      <MenuJsonLd />
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
              Die vollständige Übersicht aller in unseren Speisen &amp; Getränken
              enthaltenen{" "}
              <Link
                href="/allergene"
                className="font-semibold text-rose hover:text-rose-gold"
              >
                Allergene &amp; Zusatzstoffe
              </Link>{" "}
              finden Sie auf unserer Info-Seite.
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
