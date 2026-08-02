import type { Dish, MenuCategory } from "@/content/menu";
import Reveal from "./Reveal";

function Price({ value }: { value?: string }) {
  if (!value) return null;
  return (
    <span className="shrink-0 whitespace-nowrap font-serif text-rose">
      {value} €
    </span>
  );
}

function DishRow({ dish }: { dish: Dish }) {
  return (
    <div className="py-4">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-lg text-cream">{dish.name}</h3>
        <Price value={dish.price} />
      </div>
      {dish.desc && (
        <p className="mt-1 max-w-prose text-sm leading-relaxed text-cream-dim">
          {dish.desc}
        </p>
      )}
      {dish.codes && (
        <p className="mt-1 text-xs italic text-cream-dim/70">({dish.codes})</p>
      )}
    </div>
  );
}

/** Zweispaltige Menü-Darstellung mit Kategorien. */
export function MenuCategories({ categories }: { categories: MenuCategory[] }) {
  return (
    <div className="space-y-16">
      {categories.map((cat) => (
        <Reveal as="section" key={cat.id} className="scroll-mt-28" id={cat.id}>
          <div className="mb-2 flex items-end gap-4">
            <h2 className="font-serif text-2xl text-cream md:text-3xl">
              {cat.title}
            </h2>
            <hr className="rule mb-2 flex-1" />
          </div>
          {cat.note && (
            <p className="mb-4 text-sm italic text-cream-dim">{cat.note}</p>
          )}
          <div className="grid gap-x-12 divide-y divide-cream/10 md:grid-cols-2 md:divide-y-0">
            {cat.items.map((dish, i) => (
              <div
                key={dish.name + i}
                className="border-b border-cream/10 last:border-0 md:[&:nth-last-child(-n+2)]:border-0"
              >
                <DishRow dish={dish} />
              </div>
            ))}
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/** Einfache einspaltige Gerichtsliste (Mittagstisch, Saisonkarte). */
export function DishList({ items }: { items: Dish[] }) {
  return (
    <div className="mx-auto max-w-3xl divide-y divide-cream/10">
      {items.map((dish, i) => (
        <DishRow key={dish.name + i} dish={dish} />
      ))}
    </div>
  );
}
