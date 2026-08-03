import PageHero from "@/components/PageHero";
import LazyEmbed from "@/components/LazyEmbed";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { site } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "360° Rundgang",
  description:
    "Erleben Sie das LSC Restaurant am Bodensee-Airport Friedrichshafen im interaktiven 360°-Rundgang durch unsere Räume.",
  path: "/rundgang",
  keywords: ["360 Grad Rundgang", "virtuelle Tour LSC Restaurant"],
});

export default function RundgangPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Startseite", path: "/" },
          { name: "360° Rundgang", path: "/rundgang" },
        ]}
      />
      <PageHero
        eyebrow="Virtueller Besuch"
        title="360° Rundgang"
        subtitle="Werfen Sie einen Blick in unsere Räume – noch bevor Sie da sind."
      />
      <section className="bg-cocoa">
        <div className="container-lsc py-16 md:py-20">
          {site.tourEmbedUrl ? (
            <div className="card overflow-hidden">
              <LazyEmbed
                src={site.tourEmbedUrl}
                title="360° Rundgang durch das LSC Restaurant"
                placeholder="Rundgang wird geladen …"
                ratio="aspect-video"
                allow="accelerometer; gyroscope; magnetometer; xr-spatial-tracking; fullscreen"
              />
            </div>
          ) : (
            <div className="card mx-auto max-w-2xl p-10 text-center">
              <p className="script text-2xl">Bald hier verfügbar</p>
              <p className="mt-4 leading-relaxed text-cream-dim">
                Der interaktive 360°-Rundgang wird an dieser Stelle eingebunden.
                Bis dahin freuen wir uns, Sie persönlich bei uns begrüßen zu dürfen.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a href={site.phone.href} className="btn btn-primary">
                  Jetzt anrufen
                </a>
                <a href={site.address.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  Anfahrt ansehen
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
