import CompletedPathsTable from "./CompletedPathsTable";
import PathNumberStrip from "./PathNumberStrip";
import {
  formatSumResult,
  type SumRootActionKind,
  type SumRootTraceStep,
} from "./generateTrace";

type Props = {
  step: SumRootTraceStep;
};

const actionTone: Record<SumRootActionKind, string> = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  empty: "border-rose-400/40 bg-rose-500/10 text-rose-200",
  init: "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "enter-node": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "check-leaf": "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  "leaf-complete": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  "explore-left": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "explore-right": "border-amber-400/40 bg-amber-500/10 text-amber-200",
  "hit-null": "border-slate-600 bg-slate-900/70 text-slate-300",
  combine: "border-violet-400/40 bg-violet-500/10 text-violet-200",
  done: "border-emerald-400/50 bg-emerald-500/12 text-emerald-100",
};

function labelOf(step: SumRootTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

export default function TracePanel({ step }: Props) {
  const latestCompletedPath =
    step.state.completedPaths[step.state.completedPaths.length - 1]?.ids ?? [];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-amber-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Trace Panel</h2>
          <p className="text-sm text-slate-400">
            Each snapshot freezes one recursive decision in the number-building
            DFS.
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
          Stack <span className="font-mono text-violet-200">{step.state.stack.length}</span>
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
            Total So Far
          </p>
          <p className="mt-2 font-mono text-2xl text-emerald-200">
            {step.state.totalSumSoFar}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Final Result
          </p>
          <p className="mt-2 font-mono text-2xl text-cyan-200">
            {formatSumResult(step.state.result)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Current
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {labelOf(step, step.pointers.currentId)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Current Number
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.currentNumber}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Focus Leaf
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {labelOf(step, step.pointers.focusLeafId)}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <PathNumberStrip
          title="Current Path"
          ids={step.state.currentPathIds}
          nodes={step.state.nodes}
          accent="yellow"
          emptyLabel="No active path remains."
          helperText="This is the digit path currently sitting on the recursion stack."
        />
        <PathNumberStrip
          title="Latest Completed"
          ids={latestCompletedPath}
          nodes={step.state.nodes}
          accent="emerald"
          emptyLabel="No completed number exists yet."
          helperText="The newest leaf contribution appears here as soon as it is produced."
        />
      </div>

      <div className="mt-5">
        <CompletedPathsTable
          title="Completed Numbers"
          paths={step.state.completedPaths}
          nodes={step.state.nodes}
          total={step.state.totalSumSoFar}
          highlightLeafId={step.pointers.focusLeafId}
          emptyLabel="No completed root-to-leaf numbers yet."
          helperText="Each finished leaf path contributes one decimal number to the total."
        />
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Invariant:</span>{" "}
        {step.explanationExpert}
      </div>
    </div>
  );
}
