import QueueStrip from "./QueueStrip";
import RightViewStrip from "./RightViewStrip";
import type { RightViewTraceStep } from "./generateTrace";

type Props = {
  step: RightViewTraceStep;
  mode: "beginner" | "expert";
};

function labelOf(step: RightViewTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

function focusCopy(step: RightViewTraceStep, mode: "beginner" | "expert") {
  if (mode === "beginner") {
    switch (step.actionKind) {
      case "start-level":
        return "The queue has been frozen for one full row. The last node removed from this row is the one the right-side camera will keep.";
      case "pop-node":
        return "We are looking at one node from the current row. Its children wait for the next row, so they cannot change which node is visible right now.";
      case "enqueue-left":
      case "enqueue-right":
        return "A child was added for later, but the current row still decides the visible node for this level.";
      case "capture-rightmost":
        return "This node is the last one popped from the row, so it becomes the visible node from the right side.";
      case "finish-level":
        return "The current row is over. Whatever got queued becomes the next row that BFS will scan.";
      case "done":
        return "Each row contributed exactly one visible node, so the answer is complete.";
      default:
        return step.explanationBeginner;
    }
  }

  switch (step.actionKind) {
    case "start-level":
      return "The invariant is that `levelSize` isolates the current frontier. Nodes enqueued during this pass belong strictly to the next frontier.";
    case "pop-node":
      return "Popping from the queue yields level-order traversal. Because the frontier is fixed, the pop index fully determines whether the node is rightmost.";
    case "enqueue-left":
    case "enqueue-right":
      return "Child enqueues preserve left-to-right ordering inside the next frontier, which is why the final pop of a level corresponds to the right-side view.";
    case "capture-rightmost":
      return "The predicate `index == levelSize - 1` is the exact BFS condition that identifies the rightmost node of the frozen frontier.";
    case "finish-level":
      return "After `levelSize` pops, the queue contains only the next level, so the outer loop can advance without extra bookkeeping.";
    case "done":
      return "The traversal is O(n), and queue occupancy is bounded by the maximum tree width `w`, giving O(w) auxiliary space.";
    default:
      return step.explanationExpert;
  }
}

export default function MicroscopeView({ step, mode }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">
            Zoom in on the queue, the active level, and the moment a node becomes the visible one.
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
            Queue Front
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {labelOf(step, step.pointers.queueFrontId)}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Next Child
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {step.pointers.enqueuedSide
              ? `${step.pointers.enqueuedSide} @ ${labelOf(step, step.pointers.enqueuedChildId)}`
              : "idle"}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            View Candidate
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {labelOf(step, step.pointers.candidateId)}
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
          accent="cyan"
          frontId={step.state.remainingLevelIds[0] ?? null}
          highlightId={step.pointers.candidateId}
          emptyLabel="The active level is fully consumed."
          helperText="These are the nodes still waiting to be popped inside the frozen level."
        />
        <QueueStrip
          title="Next Frontier"
          ids={step.state.nextLevelIds}
          nodes={step.state.nodes}
          accent="violet"
          frontId={step.state.nextLevelIds[0] ?? null}
          highlightId={step.pointers.enqueuedChildId}
          emptyLabel="No children have been scheduled for the next level yet."
          helperText="Children land here as soon as they are discovered."
        />
      </div>

      <div className="mt-5">
        <RightViewStrip
          title="Visible Skyline"
          summaries={step.state.levelSummaries}
          highlightId={step.pointers.currentId ?? step.pointers.candidateId}
          emptyLabel="No visible node has been locked in yet."
          helperText="This strip grows one level at a time as soon as BFS reaches the last pop of each row."
        />
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Why it matters:</span>{" "}
        {mode === "beginner"
          ? "BFS lets us treat the tree row by row, so the last node removed from each row is exactly the node visible from the right."
          : "The queue models a frontier. Freezing `levelSize` and preserving enqueue order are the two invariants that make the right-side extraction correct."}
      </div>
    </div>
  );
}
