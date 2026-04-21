import LevelOrderStrip from "./LevelOrderStrip";
import QueueStrip from "./QueueStrip";
import {
  formatNestedLevels,
  formatValueArray,
  type LevelOrderActionKind,
  type LevelOrderTraceStep,
} from "./generateTrace";

type Props = {
  step: LevelOrderTraceStep;
};

const actionTone: Record<LevelOrderActionKind, string> = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  empty: "border-rose-400/40 bg-rose-500/10 text-rose-200",
  init: "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "start-level": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "pop-node": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "collect-value": "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  "enqueue-left": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "skip-left": "border-slate-600 bg-slate-900/70 text-slate-300",
  "enqueue-right": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "skip-right": "border-slate-600 bg-slate-900/70 text-slate-300",
  "commit-level": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  "finish-level": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  done: "border-emerald-400/50 bg-emerald-500/12 text-emerald-100",
};

export default function TracePanel({ step }: Props) {
  const latestLevel =
    step.state.levelSummaries[step.state.levelSummaries.length - 1]?.level ?? null;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-violet-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Trace Panel</h2>
          <p className="text-sm text-slate-400">
            Each snapshot freezes the queue, current row, and committed nested output.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
          Step <span className="font-mono text-slate-50">{step.step + 1}</span>
        </span>
        <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
          Level{" "}
          <span className="font-mono text-slate-50">
            {Math.max(step.pointers.level, 0) + 1}
          </span>
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
            Input
          </p>
          <p className="mt-2 break-words font-mono text-sm text-cyan-200">
            {step.state.input.trim() || "[]"}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Output
          </p>
          <p className="mt-2 font-mono text-sm text-emerald-200">
            {formatNestedLevels(step.state.resultLevels)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Queue Size
          </p>
          <p className="mt-2 font-mono text-2xl text-violet-200">
            {step.state.queueIds.length}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Current Row
          </p>
          <p className="mt-2 font-mono text-sm text-cyan-200">
            {formatValueArray(step.state.activeLevelValues)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Rows Done
          </p>
          <p className="mt-2 font-mono text-2xl text-emerald-200">
            {step.state.levelSummaries.length}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <QueueStrip
          title="BFS Queue"
          ids={step.state.queueIds}
          nodes={step.state.nodes}
          accent="violet"
          frontId={step.pointers.queueFrontId}
          highlightId={step.pointers.enqueuedChildId}
          emptyLabel="The queue is empty."
        />
        <LevelOrderStrip
          title="Committed Output"
          summaries={step.state.levelSummaries}
          nodes={step.state.nodes}
          highlightLevel={latestLevel}
          emptyLabel="No level has been committed yet."
        />
      </div>
    </div>
  );
}
