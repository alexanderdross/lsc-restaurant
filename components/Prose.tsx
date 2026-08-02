/** Einheitliches Textlayout für Rechtstexte (Impressum, Datenschutz). */
export default function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="
        mx-auto max-w-3xl text-cream-dim
        [&_a]:text-rose [&_a]:underline [&_a:hover]:text-rose-gold
        [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-cream
        [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-serif [&_h3]:text-lg [&_h3]:text-cream
        [&_p]:mb-4 [&_p]:leading-relaxed
        [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6
        [&_strong]:text-cream
      "
    >
      {children}
    </div>
  );
}
