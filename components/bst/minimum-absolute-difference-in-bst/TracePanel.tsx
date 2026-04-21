import DifferenceLedger from "./DifferenceLedger";
import StackStrip from "./StackStrip";
import {
  formatDiff,
  formatNumberList,
  type MinDiffActionKind,
  type MinDiffTraceStep,
} from "./generateTrace";

type Props = {
  step: MinDiffTraceStep;
};

const actionTone: Record<MinDiffActionKind, string> = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  empty: "border-rose-400/40 bg-rose-500/10 text-rose-200",
  init: "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "push-left": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "pop-node": "border-amber-400/40 bg-amber-500/10 text-amber-200",
  "first-value": "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  compare: "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  "update-best": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  "keep-best": "border-slate-600 bg-slate-900/70 text-slate-300",
  "move-right": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "skip-right": "border-slate-600 bg-slate-900/70 text-slate-300",
  done: "border-emerald-400/50 bg-emerald-500/12 text-emerald-100",
};

function labelOf(step: MinDiffTraceStep, id: string | null) {
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
            Follow the inorder stack, previous pointer, and running minimum gap.
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
          Visited{" "}
          <span className="font-mono text-cyan-200">
            {step.state.visitedIds.length}/{step.state.nodes.length}
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

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Input
          </p>
          <p className="mt-2 break-words font-mono text-sm text-cyan-200">
            {step.state.input.trim() || "[]"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Inorder Prefix
          </p>
          <p className="mt-2 break-words font-mono text-sm text-emerald-200">
            {formatNumberList(step.state.inorderValues)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Previous
          </p>
          <p className="mt-2 font-mono text-2xl text-yellow-200">
            {labelOf(step, step.pointers.prevId)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Focus
          </p>
          <p className="mt-2 font-mono text-2xl text-cyan-200">
            {labelOf(step, step.pointers.focusId)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Best Gap
          </p>
          <p className="mt-2 font-mono text-2xl text-emerald-200">
            {formatDiff(step.state.bestDiff)}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <StackStrip
          title="Stack Snapshot"
          ids={step.state.stackIds}
          nodes={step.state.nodes}
          accent="amber"
          highlightId={step.pointers.stackTopId}
          reverse
          emptyLabel="The stack is empty."
        />
        <DifferenceLedger
          records={step.state.differences}
          nodes={step.state.nodes}
          bestPairIds={step.pointers.bestPairIds}
        />
      </div>
    </div>
  );
}
