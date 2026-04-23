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
        <article key={item.id} className="overflow-hidden rounded-xl border border-amber-100 bg-white shadow-sm">
          <div className="relative h-52 w-full">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
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
