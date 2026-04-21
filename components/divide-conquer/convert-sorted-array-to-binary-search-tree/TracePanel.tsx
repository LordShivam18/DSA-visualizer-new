import {
  formatRange,
  type SortedArrayToBSTActionKind,
  type SortedArrayToBSTTraceStep,
} from "./generateTrace";

const actionTone: Record<SortedArrayToBSTActionKind, string> = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  "enter-range": "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  "empty-range": "border-rose-400/40 bg-rose-500/10 text-rose-200",
  "choose-mid": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "create-node": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "recurse-left": "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  "recurse-right": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "return-node": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  done: "border-emerald-400/50 bg-emerald-500/12 text-emerald-100",
};

export default function TracePanel({
  step,
}: {
  step: SortedArrayToBSTTraceStep;
}) {
  const focusNode = step.state.nodes.find(
    (node) => node.id === step.pointers.focusNodeId
  );

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-amber-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Trace Panel</h2>
          <p className="text-sm text-slate-400">
            Snapshot the active interval, midpoint choice, and subtree return.
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
        <span
          className={`rounded-full border px-3 py-1 ${
            step.done
              ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
              : "border-cyan-400/40 bg-cyan-500/10 text-cyan-200"
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
            Active Range
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {formatRange(step.pointers.activeRange)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Mid Index
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.midIndex ?? "-"}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Focus Node
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {focusNode?.value ?? "-"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Frames
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.state.frames.length}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Built Nodes
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.builtCount}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Invariant:</span>{" "}
        {step.explanationExpert}
      </div>
    </div>
  );
}
