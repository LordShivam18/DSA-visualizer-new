import type { CountStackFrame } from "./generateTrace";

type Props = {
  stack: CountStackFrame[];
};

const statusTone: Record<CountStackFrame["status"], string> = {
  active: "border-cyan-400/35 bg-cyan-500/10 text-cyan-100",
  perfect: "border-emerald-400/35 bg-emerald-500/10 text-emerald-100",
  split: "border-rose-400/35 bg-rose-500/10 text-rose-100",
  combined: "border-violet-400/35 bg-violet-500/10 text-violet-100",
};

export default function RecursionStack({ stack }: Props) {
  const frames = [...stack].reverse();

  return (
    <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Recursion Stack
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Each frame stores the subtree root, its measured heights, and any
            counts returned by child calls.
          </p>
        </div>
        <span className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1 text-xs text-slate-300">
          Frames <span className="font-mono text-slate-100">{stack.length}</span>
        </span>
      </div>

      {frames.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-4 py-5 text-sm text-slate-500">
          No recursive frames are active right now.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {frames.map((frame) => (
            <div
              key={frame.id}
              className="rounded-[1rem] border border-slate-800/80 bg-[#07101d] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1 text-xs text-slate-300">
                  Node <span className="font-mono text-slate-100">{frame.value}</span>
                </span>
                <span className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1 text-xs text-slate-300">
                  Depth <span className="font-mono text-slate-100">{frame.depth}</span>
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs ${statusTone[frame.status]}`}
                >
                  {frame.status}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Heights
                  </p>
                  <p className="mt-1 font-mono text-sm text-slate-100">
                    L {frame.leftHeight ?? "-"} / R {frame.rightHeight ?? "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Children
                  </p>
                  <p className="mt-1 font-mono text-sm text-slate-100">
                    {frame.leftCount ?? "-"} / {frame.rightCount ?? "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Return
                  </p>
                  <p className="mt-1 font-mono text-sm text-emerald-200">
                    {frame.resultCount ?? "pending"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
