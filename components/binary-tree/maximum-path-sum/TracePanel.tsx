import PathGainStrip from "./PathGainStrip";
import ReturnGainTable from "./ReturnGainTable";
import {
  formatBestResult,
  type MaxPathActionKind,
  type MaxPathTraceStep,
} from "./generateTrace";

type Props = {
  step: MaxPathTraceStep;
};

const actionTone: Record<MaxPathActionKind, string> = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  empty: "border-rose-400/40 bg-rose-500/10 text-rose-200",
  init: "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "enter-node": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "explore-left": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "receive-left": "border-amber-400/40 bg-amber-500/10 text-amber-200",
  "explore-right": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "receive-right": "border-amber-400/40 bg-amber-500/10 text-amber-200",
  "hit-null": "border-slate-600 bg-slate-900/70 text-slate-300",
  "evaluate-through": "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  "update-best": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  "keep-best": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "compute-return": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  done: "border-emerald-400/50 bg-emerald-500/12 text-emerald-100",
};

function labelOf(step: MaxPathTraceStep, id: string | null) {
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
            Each step freezes one postorder decision in the maximum-path-sum DFS.
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
            Best So Far
          </p>
          <p className="mt-2 font-mono text-2xl text-emerald-200">
            {formatBestResult(step.state.globalBest)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Null Hits
          </p>
          <p className="mt-2 font-mono text-2xl text-violet-200">
            {step.state.nullHits}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-4">
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
            Left Gain
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {step.pointers.leftGain ?? "pending"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Right Gain
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {step.pointers.rightGain ?? "pending"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Return Gain
          </p>
          <p
            className={`mt-2 text-2xl font-semibold ${
              (step.pointers.upwardGain ?? 0) >= 0
                ? "text-emerald-200"
                : "text-rose-200"
            }`}
          >
            {step.pointers.upwardGain ?? "pending"}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <PathGainStrip
          title="Candidate Path"
          ids={step.state.candidatePathIds}
          nodes={step.state.nodes}
          accent="yellow"
          emptyLabel="The active node has not built a candidate path yet."
          helperText="This is the best full path through the active node before comparing against the global best."
        />
        <PathGainStrip
          title="Global Best Path"
          ids={step.state.bestPathIds}
          nodes={step.state.nodes}
          accent="emerald"
          emptyLabel="No global best path has been recorded yet."
          helperText="This path stays green because it is currently the strongest one found anywhere in the tree."
        />
      </div>

      <div className="mt-5">
        <ReturnGainTable
          title="Returned Gains"
          values={step.state.returnedGains}
          nodes={step.state.nodes}
          highlightNodeId={step.pointers.focusNodeId}
          emptyLabel="No node has returned a gain yet."
          helperText="Returned gains are the single-branch values available to a parent."
        />
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Invariant:</span>{" "}
        {step.explanationExpert}
      </div>
    </div>
  );
}
