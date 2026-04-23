import { Star } from "lucide-react";

import type { Testimonial } from "@/types/content";

type TestimonialsProps = {
  items: Testimonial[];
};

export function Testimonials({ items }: TestimonialsProps) {
  const enabled = items.filter((item) => item.enabled);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {enabled.map((item) => (
        <article
          key={item.id}
          className="soft-shadow rounded-2xl border border-amber-100 bg-white p-5"
        >
          <div className="mb-3 flex items-center gap-1 text-amber-500">
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
            <Star size={14} fill="currentColor" />
          </div>
          <p className="text-sm leading-relaxed text-zinc-700">“{item.text}”</p>
          <p className="mt-4 text-sm font-semibold text-amber-900">{item.author}</p>
          <p className="text-xs font-medium text-zinc-500">
            {item.role} · {item.eventType}
          </p>
        </article>
      ))}
    </div>
  );
}
