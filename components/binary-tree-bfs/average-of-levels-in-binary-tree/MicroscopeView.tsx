import AverageStrip from "./AverageStrip";
import QueueStrip from "./QueueStrip";
import { formatAverage, type AverageTraceStep } from "./generateTrace";

type Props = {
  step: AverageTraceStep;
  mode: "beginner" | "expert";
};

function labelOf(step: AverageTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

function focusCopy(step: AverageTraceStep, mode: "beginner" | "expert") {
  if (mode === "beginner") {
    switch (step.actionKind) {
      case "start-level":
        return "We are starting a fresh row, so the running sum and running count reset to zero before any node is added.";
      case "pop-node":
        return "One node has been removed from the queue, and it is ready to contribute its value to this row's average.";
      case "add-to-sum":
        return "The value of the current node has been added to the row total. The live average is just total divided by how many nodes we have counted so far.";
      case "enqueue-left":
      case "enqueue-right":
        return "Children are queued for the next row only. They never change the average of the current row.";
      case "capture-average":
        return "Now that the whole row is processed, the final average is locked in and saved to the answer.";
      case "finish-level":
        return "The current row is finished, and the queue is holding the next row waiting to be averaged.";
      case "done":
        return "Every row produced one average, so the full answer is ready.";
      default:
        return step.explanationBeginner;
    }
  }

  switch (step.actionKind) {
    case "start-level":
      return "The invariant is that `levelSize` freezes the current frontier, so all later enqueues belong to the next frontier rather than the active average.";
    case "pop-node":
      return "Popping from the queue yields the next node in level-order, ensuring the accumulation is confined to the current breadth layer.";
    case "add-to-sum":
      return "Only `levelSum += node->val` changes the arithmetic state. The committed result still waits for `levelSum / levelSize` after the loop.";
    case "enqueue-left":
    case "enqueue-right":
      return "Queue appends preserve BFS order for the next frontier while leaving the current level's arithmetic invariant untouched.";
    case "capture-average":
      return "The final row statistic is `static_cast<double>(levelSum) / levelSize`, which ensures floating-point precision in the output vector.";
    case "finish-level":
      return "After exactly `levelSize` pops, the queue contains only the next frontier, so the outer loop can safely advance.";
    case "done":
      return "Each node is visited once, so the complexity is O(n) time with O(w) auxiliary queue space for maximum width `w`.";
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
            Zoom in on the queue, the running total, and the exact divide step that finalizes each level.
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
            Running Sum
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.runningSum}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Running Count
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {step.pointers.runningCount}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Live Average
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {formatAverage(step.pointers.runningAverage)}
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
        <QueueStrip
          title="Remaining Current Level"
          ids={step.state.remainingLevelIds}
          nodes={step.state.nodes}
          accent="yellow"
          frontId={step.state.remainingLevelIds[0] ?? null}
          highlightId={step.pointers.currentId}
          emptyLabel="The active level is fully consumed."
          helperText="These nodes still belong to the row whose average is being built."
        />
        <QueueStrip
          title="Next Frontier"
          ids={step.state.nextLevelIds}
          nodes={step.state.nodes}
          accent="violet"
          frontId={step.state.nextLevelIds[0] ?? null}
          highlightId={step.pointers.enqueuedChildId}
          emptyLabel="No child has been queued for the next level yet."
          helperText="Children land here immediately, but they wait until the next outer-loop pass."
        />
      </div>

      <div className="mt-5">
        <AverageStrip
          title="Average Ledger"
          summaries={step.state.levelSummaries}
          nodes={step.state.nodes}
          highlightLevel={latestLevel}
          emptyLabel="No level average has been finalized yet."
          helperText="Each green row is a finished level with its exact arithmetic."
        />
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Why it matters:</span>{" "}
        {mode === "beginner"
          ? "BFS naturally groups nodes by level, so the queue lets us average one row at a time without mixing values from different depths."
          : "The correctness hinges on freezing `levelSize`, accumulating exactly that many node values into `levelSum`, and only then committing `levelSum / levelSize`."}
      </div>
    </div>
  );
}
