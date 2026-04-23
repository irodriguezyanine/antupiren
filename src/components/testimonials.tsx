import type { Testimonial } from "@/types/content";

type TestimonialsProps = {
  items: Testimonial[];
};

export function Testimonials({ items }: TestimonialsProps) {
  const enabled = items.filter((item) => item.enabled);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {enabled.map((item) => (
        <article key={item.id} className="rounded-xl border border-amber-100 bg-white p-5 shadow-sm">
          <p className="text-sm leading-relaxed text-zinc-700">“{item.text}”</p>
          <p className="mt-4 text-sm font-semibold text-amber-900">{item.author}</p>
          <p className="text-xs text-zinc-500">
            {item.role} · {item.eventType}
          </p>
        </article>
      ))}
    </div>
  );
}
