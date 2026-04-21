import type {
  EvaluateDivisionActionKind,
  EvaluateDivisionTraceStep,
} from "./generateTrace";

type Props = {
  step: EvaluateDivisionTraceStep;
};

const actionTone: Record<EvaluateDivisionActionKind, string> = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  "add-equation": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "start-query": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "missing-variable": "border-rose-400/40 bg-rose-500/10 text-rose-200",
  "answer-self": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  "seed-search": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "pop-node": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "inspect-neighbor": "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  "push-neighbor": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "skip-neighbor": "border-slate-600 bg-slate-900/70 text-slate-300",
  "found-answer": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  "query-failed": "border-rose-400/40 bg-rose-500/10 text-rose-200",
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
            Each snapshot records graph construction, query resets, and DFS stack changes.
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
          Query{" "}
          {step.state.currentQueryIndex === null
            ? "done"
            : step.state.currentQueryIndex + 1}
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
            Current Variable
          </p>
          <p className="mt-2 font-mono text-xl font-semibold text-cyan-200">
            {step.pointers.currentVariable ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Neighbor
          </p>
          <p className="mt-2 font-mono text-xl font-semibold text-yellow-200">
            {step.pointers.neighborVariable ?? "none"}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Running Ratio
          </p>
          <p className="mt-2 font-mono text-xl font-semibold text-emerald-200">
            {step.pointers.currentProduct === null
              ? "none"
              : step.pointers.currentProduct.toFixed(5)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Stack Size
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.state.searchStack.length}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Visited
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.state.visited.length}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Path Ledger
        </p>
        <div className="mt-4 grid gap-2">
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Active Path
            </p>
            <p className="mt-2 font-mono text-sm text-violet-100">
              {step.state.activePath?.join(" -> ") ?? "none"}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-3">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Successful Path
            </p>
            <p className="mt-2 font-mono text-sm text-emerald-100">
              {step.state.successfulPath?.join(" -> ") ?? "none"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Invariant:</span>{" "}
        {step.explanationExpert}
      </div>
    </div>
  );
}
