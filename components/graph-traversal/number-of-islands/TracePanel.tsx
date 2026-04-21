import {
  formatCoord,
  type NumberOfIslandsActionKind,
  type NumberOfIslandsTraceStep,
} from "./generateTrace";

type Props = {
  step: NumberOfIslandsTraceStep;
};

const actionTone: Record<NumberOfIslandsActionKind, string> = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  "scan-cell": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "skip-cell": "border-slate-600 bg-slate-900/70 text-slate-300",
  "start-island": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "pop-cell": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "inspect-neighbor": "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  "push-neighbor": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  "ignore-neighbor": "border-slate-600 bg-slate-900/70 text-slate-300",
  "finish-island": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
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
            Each snapshot freezes one decision in the scan or DFS flood fill.
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
          Islands {step.state.islandCount}
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
            Scan Cell
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {formatCoord(step.pointers.scan)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            DFS Cell
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
            Frontier
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.state.frontier.length}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Result
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.result ?? step.state.islandCount}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Island Ledger
        </p>
        {step.state.islandSizes.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
            No island has been discovered yet.
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {step.state.islandSizes.map((entry) => (
              <div
                key={entry.islandId}
                className={`rounded-xl border px-3 py-2 ${
                  entry.islandId === step.state.currentIslandId
                    ? "border-violet-400/45 bg-violet-500/10 text-violet-100"
                    : step.state.completedIslands.includes(entry.islandId)
                    ? "border-emerald-400/45 bg-emerald-500/10 text-emerald-100"
                    : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">Island {entry.islandId}</span>
                  <span className="font-mono text-sm">{entry.size} cells</span>
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
