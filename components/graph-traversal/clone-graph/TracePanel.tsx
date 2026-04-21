import type {
  CloneGraphActionKind,
  CloneGraphTraceStep,
} from "./generateTrace";

type Props = {
  step: CloneGraphTraceStep;
};

const actionTone: Record<CloneGraphActionKind, string> = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  seed: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  dequeue: "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "inspect-neighbor": "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  "create-clone": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  "enqueue-neighbor": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "skip-neighbor": "border-slate-600 bg-slate-900/70 text-slate-300",
  "link-edge": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
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
            Each snapshot shows how BFS, the queue, and the copy map build the cloned graph.
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
          Cloned {step.state.clonedCount}
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
            Current Original
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.currentOriginal ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Neighbor
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.neighborOriginal ?? "none"}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Queue Front
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.queueFront ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Latest Clone
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.pointers.latestCloned !== null
              ? `${step.pointers.latestCloned}'`
              : "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Queue Size
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.state.queue.length}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Map Ledger
        </p>
        {step.state.mapping.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
            No clone mapping exists yet.
          </div>
        ) : (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {step.state.mapping.map((entry) => (
              <div
                key={entry.original}
                className={`rounded-xl border px-3 py-2 ${
                  entry.original === step.pointers.currentOriginal
                    ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100"
                    : entry.clone === step.pointers.latestCloned
                    ? "border-emerald-400/45 bg-emerald-500/10 text-emerald-100"
                    : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-sm">{entry.original}</span>
                  <span className="text-slate-500">-&gt;</span>
                  <span className="font-mono text-sm">
                    {entry.clone}
                    {"'"}
                  </span>
                </div>
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
