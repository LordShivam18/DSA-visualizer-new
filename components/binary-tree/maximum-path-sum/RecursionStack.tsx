import type { MaxPathStackFrame } from "./generateTrace";

type Props = {
  stack: MaxPathStackFrame[];
};

const toneClass: Record<MaxPathStackFrame["status"], string> = {
  active:
    "border-cyan-400/40 bg-cyan-500/10 text-cyan-50 shadow-[0_0_18px_rgba(34,211,238,0.14)]",
  evaluated:
    "border-violet-400/40 bg-violet-500/10 text-violet-50 shadow-[0_0_18px_rgba(167,139,250,0.14)]",
};

const relationTone: Record<MaxPathStackFrame["relation"], string> = {
  root: "text-violet-200",
  left: "text-cyan-200",
  right: "text-amber-200",
};

export default function RecursionStack({ stack }: Props) {
  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <span className="inline-flex rounded-full border border-violet-400/40 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-100">
            Recursion Stack
          </span>
          <p className="mt-2 text-xs leading-6 text-slate-400">
            The top frame is the node currently gathering child gains.
          </p>
        </div>

        <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-2.5 py-1 text-[11px] font-mono text-slate-300">
          {stack.length}
        </span>
      </div>

      {stack.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          The call stack is empty right now.
        </div>
      ) : (
        <div className="space-y-3">
          {[...stack].reverse().map((frame) => (
            <div
              key={`${frame.id}-${frame.depth}`}
              className={`rounded-[1rem] border p-3 transition-all duration-300 ${toneClass[frame.status]}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-300">
                    Depth {frame.depth}
                  </span>
                  <span className={`text-[11px] font-semibold uppercase tracking-[0.16em] ${relationTone[frame.relation]}`}>
                    {frame.relation}
                  </span>
                </div>

                <span className="font-mono text-lg">{frame.value}</span>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    Left
                  </p>
                  <p className="mt-1 font-mono text-sm text-slate-100">
                    {frame.leftRawGain ?? "pending"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    Right
                  </p>
                  <p className="mt-1 font-mono text-sm text-slate-100">
                    {frame.rightRawGain ?? "pending"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    Through
                  </p>
                  <p className="mt-1 font-mono text-sm text-amber-200">
                    {frame.throughSum ?? "pending"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/55 px-3 py-2">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    Return
                  </p>
                  <p
                    className={`mt-1 font-mono text-sm ${
                      (frame.upwardGain ?? 0) >= 0
                        ? "text-emerald-200"
                        : "text-rose-200"
                    }`}
                  >
                    {frame.upwardGain ?? "pending"}
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
