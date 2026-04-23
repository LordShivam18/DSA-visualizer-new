import type {
  MedianStreamActionKind,
  MedianStreamTraceStep,
} from "./generateTrace";

type Props = {
  step: MedianStreamTraceStep;
};

const actionTone: Record<MedianStreamActionKind, string> = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  inspect: "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  push: "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "bubble-up": "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  rebalance: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  "bubble-down": "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  median: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  done: "border-emerald-400/50 bg-emerald-500/12 text-emerald-100",
};

export default function TracePanel({ step }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-amber-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Trace Panel</h2>
          <p className="text-sm text-slate-400">
            Watch each stream operation insert, rebalance, or read the roots.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
          Step <span className="font-mono text-slate-50">{step.step + 1}</span>
        </span>
        <span className={`rounded-full border px-3 py-1 ${actionTone[step.actionKind]}`}>
          {step.actionKind}
        </span>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-200">
          ops {step.state.outputs.length}/{step.state.operations.length}
        </span>
        <span
          className={`rounded-full border px-3 py-1 ${
            step.done
              ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
              : "border-violet-400/40 bg-violet-500/10 text-violet-200"
          }`}
        >
          {step.done ? "Complete" : "In Progress"}
        </span>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-[#061020] p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Current Action
        </p>
        <p className="mt-2 text-sm leading-7 text-slate-100">{step.action}</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Lower Root
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.lowerHeap[0] ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Upper Root
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.state.upperHeap[0] ?? "none"}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Last Added
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.state.lastAdded ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Last Median
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.state.lastMedian ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Balance
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.state.lowerHeap.length - step.state.upperHeap.length}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Output Sequence
        </p>
        {step.state.outputs.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
            No finished operations yet.
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {step.state.outputs.map((value, index) => (
              <div
                key={`output-${index}`}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  value === null
                    ? "border-slate-800/80 bg-slate-950/70 text-slate-400"
                    : "border-emerald-400/35 bg-emerald-500/10 text-emerald-100"
                }`}
              >
                {value === null ? "null" : value}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Invariant:</span>{" "}
        {step.explanationExpert}
      </div>
    </div>
  );
}
