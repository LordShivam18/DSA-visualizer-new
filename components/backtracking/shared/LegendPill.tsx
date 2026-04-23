type Props = {
  label: string;
  tone: "cyan" | "violet" | "emerald" | "amber" | "rose" | "yellow";
};

const toneMap: Record<Props["tone"], string> = {
  cyan: "border-cyan-400/30 bg-cyan-500/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]",
  violet:
    "border-violet-400/30 bg-violet-500/10 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]",
  emerald:
    "border-emerald-400/30 bg-emerald-500/10 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]",
  amber:
    "border-amber-400/30 bg-amber-500/10 text-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.12)]",
  rose: "border-rose-400/30 bg-rose-500/10 text-rose-100 shadow-[0_0_18px_rgba(251,113,133,0.12)]",
  yellow:
    "border-yellow-400/30 bg-yellow-500/10 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]",
};

export default function LegendPill({ label, tone }: Props) {
  return (
    <span className={`rounded-full border px-3 py-1 text-xs ${toneMap[tone]}`}>
      {label}
    </span>
  );
}
