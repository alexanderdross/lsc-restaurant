import { site } from "@/content/site";

/**
 * Zahlungshinweis (Kartenzahlung ab 20 € + Trinkgeld bitte in bar).
 * Steht auf den Speisekarten über dem Anruf-Button und auf der Startseite
 * beim Öffnungszeiten-/Kontaktblock. Layout-Klassen (Abstand, Ausrichtung)
 * kommen über className von der jeweiligen Seite.
 */
export default function PaymentNote({ className = "" }: { className?: string }) {
  return (
    <p className={`text-sm leading-relaxed text-cream-dim ${className}`}>
      {site.payment.note}
      <br />
      {site.payment.tipNote}
    </p>
  );
}
