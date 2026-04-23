type Props = {
  leftValue: number;
  rightValue: number;
  sum: number;
  tone: "idle" | "heap" | "result" | "current" | "next";
};

const toneStyles = {
  idle: "border-slate-800/80 bg-slate-950/70 text-slate-200",
  heap: "border-violet-400/35 bg-violet-500/10 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]",
  result:
    "border-emerald-400/35 bg-emerald-500/10 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]",
  current:
    "border-cyan-400/35 bg-cyan-500/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]",
  next: "border-yellow-400/35 bg-yellow-500/10 text-yellow-100 shadow-[0_0_18px_rgba(250,204,21,0.12)]",
} as const;

export default function PairMatrixCell({
  leftValue,
  rightValue,
  sum,
  tone,
}: Props) {
  return (
    <div
      className={`rounded-[1rem] border px-3 py-3 transition-all duration-300 ${toneStyles[tone]}`}
    >
      <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
        pair
      </p>
      <p className="mt-2 text-sm text-slate-300">
        [{leftValue}, {rightValue}]
      </p>
      <p className="mt-2 text-xl font-semibold">{sum}</p>
    </div>
  );
}
