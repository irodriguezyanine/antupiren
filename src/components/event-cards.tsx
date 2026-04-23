import { ArrowUpRight, BriefcaseBusiness, GlassWater, Heart, Megaphone } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import type { EventTypeCard } from "@/types/content";

type EventCardsProps = {
  items: EventTypeCard[];
};

export function EventCards({ items }: EventCardsProps) {
  const iconByTitle: Record<string, ReactNode> = {
    Matrimonios: <Heart size={16} />,
    "Eventos corporativos": <BriefcaseBusiness size={16} />,
    "Celebraciones sociales": <GlassWater size={16} />,
    "Activaciones de marca": <Megaphone size={16} />,
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <article
          key={item.title}
          className="group soft-shadow rounded-2xl border border-amber-100 bg-white p-5 transition hover:-translate-y-1 hover:border-amber-300"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
            {iconByTitle[item.title]}
            {item.title}
          </div>
          <p className="mt-2 text-sm text-zinc-600">{item.description}</p>
          <Link
            href={item.href}
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-900"
          >
            Ver más
            <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </article>
      ))}
    </div>
  );
}
