type Props = {
  index: number;
  value: number;
  heightPercent: number;
  activeWindow: boolean;
  isLeft: boolean;
  isMid: boolean;
  isNext: boolean;
  isRight: boolean;
  isPeak: boolean;
};

export default function PeakBar({
  index,
  value,
  heightPercent,
  activeWindow,
  isLeft,
  isMid,
  isNext,
  isRight,
  isPeak,
}: Props) {
  const tone = isPeak
    ? "border-emerald-400/60 bg-emerald-500/18 shadow-[0_0_24px_rgba(52,211,153,0.28)]"
    : isMid
    ? "border-yellow-400/60 bg-yellow-500/16 shadow-[0_0_24px_rgba(251,191,36,0.24)]"
    : isNext
    ? "border-violet-400/60 bg-violet-500/16 shadow-[0_0_24px_rgba(167,139,250,0.24)]"
    : activeWindow
    ? "border-cyan-400/35 bg-cyan-500/10 shadow-[0_0_18px_rgba(34,211,238,0.12)]"
    : "border-slate-800/80 bg-slate-950/55";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-7 items-center gap-1 text-[11px] uppercase tracking-[0.18em]">
        {isLeft ? <span className="rounded-full bg-cyan-500/12 px-2 py-1 text-cyan-200">L</span> : null}
        {isMid ? <span className="rounded-full bg-yellow-500/12 px-2 py-1 text-yellow-200">M</span> : null}
        {isNext ? <span className="rounded-full bg-violet-500/12 px-2 py-1 text-violet-200">N</span> : null}
        {isRight ? <span className="rounded-full bg-cyan-500/12 px-2 py-1 text-cyan-200">R</span> : null}
        {isPeak ? <span className="rounded-full bg-emerald-500/12 px-2 py-1 text-emerald-200">Peak</span> : null}
      </div>

      <div className="flex h-56 w-full items-end justify-center rounded-[1.15rem] border border-slate-800/80 bg-slate-950/45 px-3 pb-3">
        <div
          className={`flex w-full max-w-[72px] items-end justify-center rounded-t-[1rem] border border-b-0 transition-all duration-300 ${tone}`}
          style={{ height: `${Math.max(heightPercent, 18)}%` }}
        >
          <span className="mb-3 text-lg font-semibold text-slate-100">{value}</span>
        </div>
      </div>

      <div className="text-center">
        <div className="font-mono text-sm text-slate-200">{index}</div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
          index
        </div>
      </div>
    </div>
  );
}
