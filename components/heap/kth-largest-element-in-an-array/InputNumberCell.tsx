import type { HeapEntry } from "./generateTrace";

type Props = {
  index: number;
  value: number;
  current: boolean;
  inHeap: boolean;
  removed: boolean;
  processed: boolean;
  heapEntry: HeapEntry | undefined;
};

export default function InputNumberCell({
  index,
  value,
  current,
  inHeap,
  removed,
  processed,
  heapEntry,
}: Props) {
  let className =
    "border-slate-800/80 bg-slate-950/70 text-slate-200 shadow-[0_0_14px_rgba(15,23,42,0.32)]";

  if (processed) {
    className =
      "border-violet-400/35 bg-violet-500/10 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]";
  }

  if (inHeap) {
    className =
      "border-emerald-400/45 bg-emerald-500/12 text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.14)]";
  }

  if (removed) {
    className =
      "border-rose-400/45 bg-rose-500/12 text-rose-100 shadow-[0_0_22px_rgba(251,113,133,0.16)]";
  }

  if (current) {
    className =
      "border-cyan-400/55 bg-cyan-500/14 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.18)]";
  }

  return (
    <div
      className={`min-w-[88px] rounded-[1rem] border px-3 py-3 transition-all duration-300 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
          #{index}
        </span>
        {heapEntry ? (
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-emerald-200">
            heap
          </span>
        ) : removed ? (
          <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-rose-200">
            out
          </span>
        ) : current ? (
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-cyan-200">
            now
          </span>
        ) : processed ? (
          <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-violet-200">
            seen
          </span>
        ) : null}
      </div>

      <div className="mt-3 text-2xl font-semibold">{value}</div>
      <div className="mt-2 text-[11px] text-slate-400">
        {inHeap
          ? `heap slot from input ${heapEntry?.sourceIndex}`
          : removed
          ? "evicted after overflow"
          : processed
          ? "already considered"
          : "waiting in stream"}
      </div>
    </div>
  );
}
