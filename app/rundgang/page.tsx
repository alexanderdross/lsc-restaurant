import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "360° Rundgang",
  description:
    "Erleben Sie das LSC Restaurant am Bodensee-Airport Friedrichshafen im interaktiven 360°-Rundgang.",
  alternates: { canonical: "/rundgang" },
};

export default function RundgangPage() {
  return (
    <>
      <PageHero
        eyebrow="Virtueller Besuch"
        title="360° Rundgang"
        subtitle="Werfen Sie einen Blick in unsere Räume – noch bevor Sie da sind."
      />
      <section className="bg-cocoa">
        <div className="container-lsc py-16 md:py-20">
          {site.tourEmbedUrl ? (
            <div className="card overflow-hidden">
              <iframe
                title="360° Rundgang durch das LSC Restaurant"
                src={site.tourEmbedUrl}
                className="aspect-video w-full"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
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
                <Link href="/reservieren" className="btn btn-primary">
                  Tisch reservieren
                </Link>
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
