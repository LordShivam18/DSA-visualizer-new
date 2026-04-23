type Props = {
  label: string;
  value: string | number;
  tone?: "cyan" | "violet" | "emerald" | "amber" | "rose" | "yellow";
};

const toneMap: Record<NonNullable<Props["tone"]>, string> = {
  cyan: "text-cyan-200",
  violet: "text-violet-200",
  emerald: "text-emerald-200",
  amber: "text-amber-200",
  rose: "text-rose-200",
  yellow: "text-yellow-200",
};

export default function StatCard({
  label,
  value,
  tone = "cyan",
}: Props) {
  return (
    <div className="rounded-[1.1rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-semibold ${toneMap[tone]}`}>{value}</p>
    </div>
  );
}
