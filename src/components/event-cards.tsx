import { ArrowUpRight, BriefcaseBusiness, GlassWater, Heart, Megaphone } from "lucide-react";
import Image from "next/image";
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
          className="group soft-shadow relative overflow-hidden rounded-2xl border border-amber-100 bg-white transition hover:-translate-y-1 hover:border-amber-300"
        >
          {item.backgroundImageUrl ? (
            <>
              <div className="absolute inset-0">
                <Image
                  src={item.backgroundImageUrl}
                  alt={`Fondo ${item.title}`}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/10" />
              </div>
              <div className="relative z-10 flex min-h-56 flex-col justify-end p-5">
                <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                  {iconByTitle[item.title]}
                  {item.title}
                </div>
                <p className="mt-3 text-sm text-white/90">{item.description}</p>
                <Link
                  href={item.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-white hover:text-amber-100"
                >
                  Ver más
                  <ArrowUpRight
                    size={14}
                    className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </>
          ) : (
            <div className="p-5">
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
                <ArrowUpRight
                  size={14}
                  className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}
