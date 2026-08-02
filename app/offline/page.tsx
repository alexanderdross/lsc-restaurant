import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline",
  description: "Sie sind derzeit offline.",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <section className="bg-cocoa">
      <div className="container-lsc flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="script text-3xl">Momentan offline</p>
        <h1 className="mt-3 text-4xl text-cream md:text-5xl">Keine Verbindung</h1>
        <p className="mt-4 max-w-md text-cream-dim">
          Diese Seite konnte nicht geladen werden, weil derzeit keine
          Internetverbindung besteht. Bereits besuchte Seiten sind weiterhin
          verfügbar. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/" className="btn btn-primary">
            Zur Startseite
          </Link>
          <Link href="/speisekarte" className="btn btn-outline">
            Zur Speisekarte
          </Link>
        </div>
      </div>
    </section>
  );
}
