import { site } from "@/content/site";

/**
 * Zahlungshinweis über den Anruf-Buttons der Speisekarten
 * (Kartenzahlung ab 20 € + Trinkgeld bitte in bar).
 */
export default function PaymentNote({ className = "" }: { className?: string }) {
  return (
    <p
      className={`mx-auto max-w-2xl text-center text-sm leading-relaxed text-cream-dim ${className}`}
    >
      {site.payment.note}
      <br />
      {site.payment.tipNote}
    </p>
  );
}
