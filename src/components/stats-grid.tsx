import type { Stat } from "@/types/content";

type StatsGridProps = {
  stats: Stat[];
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="soft-shadow rounded-2xl border border-amber-100 bg-[linear-gradient(180deg,#ffffff,#fff8ef)] p-5"
        >
          <p className="text-3xl font-bold text-amber-900">{stat.value}</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-zinc-600">{stat.label}</p>
          <div className="mt-3 h-1.5 w-16 rounded-full bg-amber-100">
            <div
              className="h-1.5 rounded-full bg-amber-500"
              style={{ width: `${45 + index * 15}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
