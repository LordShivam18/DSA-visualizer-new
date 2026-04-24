import { cardTone } from "./tone";
import type { VisualStat } from "./types";

export default function StatGrid({ stats }: { stats: VisualStat[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-[1.15rem] border p-4 ${cardTone(stat.tone ?? "slate")}`}
        >
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            {stat.label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-slate-50">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
