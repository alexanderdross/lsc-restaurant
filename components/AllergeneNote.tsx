import Link from "next/link";

/**
 * Hinweis-Box mit Verweis auf die Allergene-Infoseite.
 * Steht auf allen Speisekarten zwischen Gerichten und Zahlungshinweis.
 */
export default function AllergeneNote({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-[var(--radius-card)] border border-cream/10 bg-espresso/60 p-6 text-center text-sm text-cream-dim ${className}`}
    >
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
    </div>
  );
}
