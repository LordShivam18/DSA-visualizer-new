import {
  formatCoord,
  type SurroundedRegionsActionKind,
  type SurroundedRegionsTraceStep,
} from "./generateTrace";

type Props = {
  step: SurroundedRegionsTraceStep;
};

const actionTone: Record<SurroundedRegionsActionKind, string> = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  "scan-border": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "seed-safe": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  "skip-border": "border-slate-600 bg-slate-900/70 text-slate-300",
  "pop-safe": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "inspect-neighbor": "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  "mark-safe": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  "ignore-neighbor": "border-slate-600 bg-slate-900/70 text-slate-300",
  "scan-flip": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "capture-cell": "border-rose-400/40 bg-rose-500/10 text-rose-200",
  "preserve-cell": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
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
            Each snapshot shows whether the algorithm is protecting border-reachable cells or capturing enclosed ones.
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
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-200">
          Phase {step.state.phase}
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
            Scan Cell
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {formatCoord(step.pointers.scan)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            BFS Cell
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {formatCoord(step.pointers.current)}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Neighbor
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {formatCoord(step.pointers.neighbor)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Safe
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.safeCount}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Captured
          </p>
          <p className="mt-2 text-2xl font-semibold text-rose-200">
            {step.state.capturedCount}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Queue + Seeds
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Queue Size
            </p>
            <p className="mt-1 font-mono text-sm text-cyan-200">
              {step.state.frontier.length}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Queue Front
            </p>
            <p className="mt-1 font-mono text-sm text-violet-200">
              {formatCoord(step.pointers.queueFront)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
              Border Seeds
            </p>
            <p className="mt-1 font-mono text-sm text-emerald-200">
              {step.state.borderSeedCount}
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
