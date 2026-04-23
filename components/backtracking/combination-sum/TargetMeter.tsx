type Props = {
  currentSum: number;
  target: number;
  remaining: number;
};

export default function TargetMeter({ currentSum, target, remaining }: Props) {
  const normalizedTarget = target <= 0 ? 1 : target;
  const progress = Math.max(0, Math.min(100, Math.round((currentSum / normalizedTarget) * 100)));
  const toneClass =
    remaining === 0
      ? "from-emerald-400 via-emerald-300 to-cyan-300"
      : remaining < 0
      ? "from-rose-400 via-rose-300 to-amber-300"
      : "from-cyan-400 via-violet-300 to-amber-300";

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
        Target Meter
      </p>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
          <span>
            current <span className="font-mono text-cyan-200">{currentSum}</span>
          </span>
          <span>
            remaining <span className="font-mono text-amber-200">{remaining}</span>
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full border border-slate-800 bg-[#050916]">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${toneClass} shadow-[0_0_22px_rgba(34,211,238,0.18)] transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-3 text-sm text-slate-300">
          target = <span className="font-mono text-emerald-200">{target}</span>
        </p>
      </div>
    </div>
  );
}
