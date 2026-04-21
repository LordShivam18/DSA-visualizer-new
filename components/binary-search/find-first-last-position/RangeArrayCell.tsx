type Props = {
  index: number;
  value: number;
  activeWindow: boolean;
  isLeft: boolean;
  isMid: boolean;
  isRight: boolean;
  isFirstCandidate: boolean;
  isLastCandidate: boolean;
  inFinalRange: boolean;
};

export default function RangeArrayCell({
  index,
  value,
  activeWindow,
  isLeft,
  isMid,
  isRight,
  isFirstCandidate,
  isLastCandidate,
  inFinalRange,
}: Props) {
  const tone = inFinalRange
    ? "border-emerald-400/60 bg-emerald-500/16 text-emerald-100 shadow-[0_0_24px_rgba(52,211,153,0.28)]"
    : isMid
    ? "border-yellow-400/60 bg-yellow-500/16 text-yellow-100 shadow-[0_0_24px_rgba(251,191,36,0.24)]"
    : activeWindow
    ? "border-cyan-400/35 bg-cyan-500/10 text-slate-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]"
    : "border-slate-800/80 bg-slate-950/55 text-slate-500";

  return (
    <div className={`rounded-[1.1rem] border p-3 transition-all duration-300 ${tone}`}>
      <div className="flex items-start justify-between gap-3 text-[11px] uppercase tracking-[0.18em] text-slate-500">
        <span>#{index}</span>
      </div>

      <div className="mt-4 text-center text-2xl font-semibold">{value}</div>

      <div className="mt-4 flex flex-wrap justify-center gap-1 text-[11px] uppercase tracking-[0.18em]">
        {isLeft ? <span className="rounded-full bg-cyan-500/12 px-2 py-1 text-cyan-200">L</span> : null}
        {isMid ? <span className="rounded-full bg-yellow-500/12 px-2 py-1 text-yellow-200">M</span> : null}
        {isRight ? <span className="rounded-full bg-violet-500/12 px-2 py-1 text-violet-200">R</span> : null}
        {isFirstCandidate ? <span className="rounded-full bg-emerald-500/12 px-2 py-1 text-emerald-200">First</span> : null}
        {isLastCandidate ? <span className="rounded-full bg-violet-500/12 px-2 py-1 text-violet-200">Last</span> : null}
      </div>
    </div>
  );
}
