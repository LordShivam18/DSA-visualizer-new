import {
  formatRegion,
  type QuadTreeActionKind,
  type QuadTreeTraceStep,
} from "./generateTrace";

const actionTone: Record<QuadTreeActionKind, string> = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  "enter-region": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "inspect-region": "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  "create-leaf": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  "split-region": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "recurse-child": "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  "return-node": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  invalid: "border-rose-400/40 bg-rose-500/10 text-rose-200",
  done: "border-emerald-400/50 bg-emerald-500/12 text-emerald-100",
};

export default function TracePanel({
  step,
}: {
  step: QuadTreeTraceStep;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-amber-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Trace Panel</h2>
          <p className="text-sm text-slate-400">
            Follow the active region, uniformity check, and child recursion order.
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
            Active Region
          </p>
          <p className="mt-2 text-lg font-semibold text-cyan-200">
            {formatRegion(step.pointers.activeRegion)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Child Preview
          </p>
          <p className="mt-2 text-lg font-semibold text-yellow-200">
            {step.pointers.childQuadrant ?? "none"}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Leaves
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.leafCount}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Internal
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.state.internalCount}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Uniform Value
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.uniformValue ?? "-"}
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
