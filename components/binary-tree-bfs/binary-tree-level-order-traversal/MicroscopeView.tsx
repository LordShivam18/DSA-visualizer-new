import LevelBuffer from "./LevelBuffer";
import LevelOrderStrip from "./LevelOrderStrip";
import QueueStrip from "./QueueStrip";
import { type LevelOrderTraceStep } from "./generateTrace";

type Props = {
  step: LevelOrderTraceStep;
  mode: "beginner" | "expert";
};

function labelOf(step: LevelOrderTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

function focusCopy(step: LevelOrderTraceStep, mode: "beginner" | "expert") {
  if (mode === "beginner") {
    switch (step.actionKind) {
      case "start-level":
        return "A new row is starting. We count the queue now so only nodes already waiting are copied into this row.";
      case "pop-node":
        return "One node comes out of the queue. It is the next value we will place into the current row.";
      case "collect-value":
        return "The current node's value has been copied into the row. This row is still open until all nodes from the frozen count are processed.";
      case "enqueue-left":
      case "enqueue-right":
        return "Children are saved for the next row. They wait in the queue and do not join the row we are currently building.";
      case "commit-level":
        return "The whole row is done, so we add this row to the final answer.";
      case "finish-level":
        return "The current row is finished. If the queue still has nodes, those nodes form the next row.";
      case "done":
        return "All rows were saved from top to bottom, so the traversal result is ready.";
      default:
        return step.explanationBeginner;
    }
  }

  switch (step.actionKind) {
    case "start-level":
      return "The invariant is that `levelSize` freezes the current frontier; all enqueues during the loop belong to the next frontier.";
    case "pop-node":
      return "The queue front is popped in FIFO order, so nodes within a level are processed left to right.";
    case "collect-value":
      return "`level.push_back(node->val)` preserves the traversal order of the frozen frontier.";
    case "enqueue-left":
    case "enqueue-right":
      return "Child appends maintain BFS ordering for the next level while leaving the active `level` vector unchanged.";
    case "commit-level":
      return "`answer.push_back(level)` commits exactly one breadth layer to the nested result.";
    case "finish-level":
      return "After exactly `levelSize` pops, the queue contains either the next frontier or nothing.";
    case "done":
      return "Every node is visited once, so the traversal is O(n) time with O(w) queue space for maximum width `w`.";
    default:
      return step.explanationExpert;
  }
}

export default function MicroscopeView({ step, mode }: Props) {
  const latestLevel =
    step.state.levelSummaries[step.state.levelSummaries.length - 1]?.level ?? null;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">
            Zoom in on the queue frontier, the active row vector, and the moment a row becomes output.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Node
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {labelOf(step, step.pointers.currentId)}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Level Size
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.levelSize}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Index In Level
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {step.pointers.indexInLevel < 0 ? "idle" : step.pointers.indexInLevel}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Output Rows
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.levelSummaries.length}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-gradient-to-br from-slate-950/70 via-[#07111f] to-slate-950/65 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {mode === "beginner" ? "What Is Happening" : "Algorithm Invariant"}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          {focusCopy(step, mode)}
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <LevelBuffer
          values={step.state.activeLevelValues}
          levelSize={step.pointers.levelSize}
          writeIndex={step.pointers.writeIndex}
        />
        <QueueStrip
          title="Next Frontier"
          ids={step.state.nextLevelIds}
          nodes={step.state.nodes}
          accent="violet"
          frontId={step.state.nextLevelIds[0] ?? null}
          highlightId={step.pointers.enqueuedChildId}
          emptyLabel="No child has been queued for the next level yet."
          helperText="These children wait until the next outer-loop pass."
        />
      </div>

      <div className="mt-5">
        <LevelOrderStrip
          title="Committed Rows"
          summaries={step.state.levelSummaries}
          nodes={step.state.nodes}
          highlightLevel={latestLevel}
          emptyLabel="No level has been committed yet."
          helperText="Each completed row is one entry in the final nested vector."
        />
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Why it matters:</span>{" "}
        {mode === "beginner"
          ? "The queue naturally groups nodes by row, so saving one row at a time gives the level order traversal."
          : "Correctness depends on freezing the frontier size, appending exactly those node values, and then committing that vector before the next frontier begins."}
      </div>
    </div>
  );
}
