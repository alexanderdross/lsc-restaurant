/**
 * Sichtbarer FAQ-Block. Der Text ist identisch mit dem FAQPage-JSON-LD
 * (Google verlangt sichtbaren Inhalt für FAQ-Auszeichnung) und liefert
 * generativen Engines klare, faktische Antworten (GEO).
 */
export default function Faq({
  items,
  className = "",
}: {
  items: readonly { q: string; a: string }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <dl className="grid gap-4 md:grid-cols-2">
        {items.map((it) => (
          <div key={it.q} className="card p-6">
            <dt className="font-serif text-lg text-cream">{it.q}</dt>
            <dd className="mt-2 text-sm leading-relaxed text-cream-dim">{it.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
