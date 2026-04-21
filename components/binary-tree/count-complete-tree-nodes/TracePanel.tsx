import BoundaryStrip from "./BoundaryStrip";
import {
  formatCountResult,
  type CountActionKind,
  type CountTraceStep,
} from "./generateTrace";

type Props = {
  step: CountTraceStep;
};

const actionTone: Record<CountActionKind, string> = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  empty: "border-rose-400/40 bg-rose-500/10 text-rose-200",
  init: "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "enter-subtree": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "scan-left": "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  "scan-right": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "perfect-subtree": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  "recurse-left": "border-rose-400/40 bg-rose-500/10 text-rose-200",
  "recurse-right": "border-amber-400/40 bg-amber-500/10 text-amber-200",
  "hit-null": "border-slate-600 bg-slate-900/70 text-slate-300",
  combine: "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  done: "border-emerald-400/50 bg-emerald-500/12 text-emerald-100",
};

function labelOf(step: CountTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

export default function TracePanel({ step }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-amber-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Trace Panel</h2>
          <p className="text-sm text-slate-400">
            Each snapshot freezes one subtree decision in the complete-tree
            counting process.
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
        <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
          Shortcuts{" "}
          <span className="font-mono text-emerald-200">
            {step.state.shortcutCount}
          </span>
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

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Final Result
          </p>
          <p className="mt-2 font-mono text-2xl text-emerald-200">
            {formatCountResult(step.state.result)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Resolved Nodes
          </p>
          <p className="mt-2 font-mono text-2xl text-cyan-200">
            {step.state.resolvedCount}/{step.state.nodes.length}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Height Visits
          </p>
          <p className="mt-2 font-mono text-2xl text-violet-200">
            {step.state.heightVisits}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Current Root
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {labelOf(step, step.pointers.currentId)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Latest Return
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.pointers.latestReturn ?? "pending"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <BoundaryStrip
          title="Left Boundary"
          ids={step.state.leftBoundaryIds}
          nodes={step.state.nodes}
          accent="yellow"
          heightLabel={`Height ${step.pointers.leftHeight ?? "-"}`}
          emptyLabel="No left-boundary path is active."
          helperText="This is the far-left path measured for the current subtree."
        />
        <BoundaryStrip
          title="Right Boundary"
          ids={step.state.rightBoundaryIds}
          nodes={step.state.nodes}
          accent="violet"
          heightLabel={`Height ${step.pointers.rightHeight ?? "-"}`}
          emptyLabel="No right-boundary path is active."
          helperText="This is the far-right path measured for the current subtree."
        />
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Invariant:</span>{" "}
        {step.explanationExpert}
      </div>
    </div>
  );
}
