import type { Stat } from "@/types/content";

type StatsGridProps = {
  stats: Stat[];
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
          <p className="text-2xl font-bold text-amber-900">{stat.value}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-zinc-600">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
