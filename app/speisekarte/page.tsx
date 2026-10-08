import PageHero from "@/components/PageHero";
import PaymentNote from "@/components/PaymentNote";
import AllergeneNote from "@/components/AllergeneNote";
import TakeawayNote from "@/components/TakeawayNote";
import { MenuCategories } from "@/components/Menu";
import { BreadcrumbJsonLd, MenuJsonLd } from "@/components/JsonLd";
import { speisekarte } from "@/content/menu";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

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
    "Pizza abholen Friedrichshafen",
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

          <TakeawayNote className="mt-14" />

          <AllergeneNote className="mt-16" />

          <PaymentNote className="mx-auto mt-10 max-w-2xl text-center" />

          <div className="mt-8 text-center">
            <a href={site.phone.href} className="btn btn-primary">
              Jetzt anrufen
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
