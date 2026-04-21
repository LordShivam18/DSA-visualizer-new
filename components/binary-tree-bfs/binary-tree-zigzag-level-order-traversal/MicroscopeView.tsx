import QueueStrip from "./QueueStrip";
import ZigzagSlots from "./ZigzagSlots";
import ZigzagStrip from "./ZigzagStrip";
import { formatDirection, type ZigzagTraceStep } from "./generateTrace";

type Props = {
  step: ZigzagTraceStep;
  mode: "beginner" | "expert";
};

function labelOf(step: ZigzagTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

function focusCopy(step: ZigzagTraceStep, mode: "beginner" | "expert") {
  if (mode === "beginner") {
    switch (step.actionKind) {
      case "start-level":
        return step.pointers.direction === "left-to-right"
          ? "This row writes normally from left to right."
          : "This row writes backward, so values go into mirrored slots while the queue still pops normally.";
      case "pop-node":
        return "A node comes out of the queue in normal BFS order. The zigzag part happens when we choose its output slot.";
      case "write-value":
        return "The current value has been placed into its direction-based slot for this row.";
      case "enqueue-left":
      case "enqueue-right":
        return "Children are queued normally for the next row. The output direction does not change child order in the queue.";
      case "commit-level":
        return "The row slots are full, so this zigzag row is saved to the answer.";
      case "flip-direction":
        return "The next row will write in the opposite direction.";
      case "done":
        return "All rows were saved while alternating direction, so the zigzag answer is ready.";
      default:
        return step.explanationBeginner;
    }
  }

  switch (step.actionKind) {
    case "start-level":
      return "`levelSize` freezes the frontier, and a fixed-size row buffer allows O(1) indexed writes in either direction.";
    case "pop-node":
      return "Queue order remains FIFO BFS; the traversal order is not reversed, only the level buffer index is mirrored.";
    case "write-value":
      return "`writeIndex = leftToRight ? index : levelSize - 1 - index` maps each BFS pop into the required zigzag output position.";
    case "enqueue-left":
    case "enqueue-right":
      return "Children are appended in standard left-then-right order, preserving the next frontier invariant.";
    case "commit-level":
      return "`answer.push_back(level)` happens after all slots are filled, so the row is already in final zigzag order.";
    case "flip-direction":
      return "`leftToRight = !leftToRight` toggles the write-index formula for the next frozen frontier.";
    case "done":
      return "Every node is processed once: O(n) time and O(w) queue plus row-buffer space.";
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
            Zoom in on the direction flag, mirrored write index, and queued next frontier.
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
            Direction
          </p>
          <p className="mt-2 text-xl font-semibold text-yellow-200">
            {formatDirection(step.pointers.direction)}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            BFS Index
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.indexInLevel < 0 ? "idle" : step.pointers.indexInLevel}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Write Index
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.pointers.writeIndex ?? "idle"}
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
        <ZigzagSlots
          slots={step.state.activeLevelSlots}
          writeIndex={step.pointers.writeIndex}
          direction={step.pointers.direction}
        />
        <QueueStrip
          title="Next Frontier"
          ids={step.state.nextLevelIds}
          nodes={step.state.nodes}
          accent="violet"
          frontId={step.state.nextLevelIds[0] ?? null}
          highlightId={step.pointers.enqueuedChildId}
          emptyLabel="No child has been queued for the next level yet."
          helperText="The next row keeps normal BFS order before choosing its own write direction."
        />
      </div>

      <div className="mt-5">
        <ZigzagStrip
          title="Committed Zigzag Rows"
          summaries={step.state.levelSummaries}
          nodes={step.state.nodes}
          highlightLevel={latestLevel}
          emptyLabel="No zigzag row has been committed yet."
          helperText="Each completed row stores the final direction-adjusted order."
        />
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Why it matters:</span>{" "}
        {mode === "beginner"
          ? "Zigzag feels like reversing every other row, but the queue can stay simple if we only change where values are written."
          : "Separating traversal order from write order keeps BFS stable and makes the alternating output a deterministic index transform."}
      </div>
    </div>
  );
}
