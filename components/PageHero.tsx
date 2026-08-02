/** Kompakter Seiten-Kopf für Unterseiten (Titel + optionaler Untertitel). */
export default function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-wine">
      {/* warme Verlaufs-Textur */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 120% at 50% -10%, rgba(216,180,166,0.22), transparent 60%)",
        }}
      />
      <div className="container-lsc relative py-16 text-center md:py-20">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="text-4xl text-cream md:text-5xl">{title}</h1>
        {subtitle && (
          <p className="mx-auto mt-4 max-w-2xl text-cream-dim">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
