import Image from "next/image";

import type { EventCategory, GalleryItem } from "@/types/content";

type GalleryGridProps = {
  items: GalleryItem[];
  filter?: EventCategory | "all";
};

export function GalleryGrid({ items, filter = "all" }: GalleryGridProps) {
  const filtered = items.filter(
    (item) => item.enabled && (filter === "all" || item.category === filter),
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((item) => (
        <article
          key={item.id}
          className="group soft-shadow overflow-hidden rounded-2xl border border-amber-100 bg-white"
        >
          <div className="relative h-56 w-full">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-900">
              {item.category}
            </span>
          </div>
          <div className="p-4">
            <p className="text-sm font-semibold text-amber-900">{item.title}</p>
            <p className="mt-1 text-xs text-zinc-600">{item.description}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
