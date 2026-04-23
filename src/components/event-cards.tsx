import Link from "next/link";

import type { EventTypeCard } from "@/types/content";

type EventCardsProps = {
  items: EventTypeCard[];
};

export function EventCards({ items }: EventCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <article key={item.title} className="rounded-xl border border-amber-100 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-amber-900">{item.title}</h3>
          <p className="mt-2 text-sm text-zinc-600">{item.description}</p>
          <Link
            href={item.href}
            className="mt-4 inline-flex text-sm font-medium text-amber-700 hover:text-amber-900"
          >
            Ver más
          </Link>
        </article>
      ))}
    </div>
  );
}
