import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-cocoa">
      <div className="container-lsc flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
        <p className="script text-3xl">Ups …</p>
        <h1 className="mt-3 text-4xl text-cream md:text-5xl">Seite nicht gefunden</h1>
        <p className="mt-4 max-w-md text-cream-dim">
          Die aufgerufene Seite existiert leider nicht. Vielleicht hilft Ihnen ein
          Blick auf unsere Speisekarte oder die Startseite weiter.
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
