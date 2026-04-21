import DifferenceLedger from "./DifferenceLedger";
import InorderStrip from "./InorderStrip";
import StackStrip from "./StackStrip";
import { formatDiff, type MinDiffTraceStep } from "./generateTrace";

type Props = {
  step: MinDiffTraceStep;
  mode: "beginner" | "expert";
};

function labelOf(step: MinDiffTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

function focusCopy(step: MinDiffTraceStep, mode: "beginner" | "expert") {
  if (mode === "beginner") {
    switch (step.actionKind) {
      case "push-left":
        return "We keep moving left because smaller BST values live on the left side.";
      case "pop-node":
        return "The left side is finished, so this node is now the next value in sorted order.";
      case "first-value":
        return "This is the first sorted value. We need one more value before a difference can be measured.";
      case "update-best":
        return "This adjacent pair is closer than every pair seen before, so the answer improves.";
      case "keep-best":
        return "This adjacent pair is not closer, so the saved answer stays the same.";
      case "move-right":
        return "After visiting the node, we move to the right side to find larger values.";
      case "done":
        return "All sorted neighbors were compared, so the smallest gap is ready.";
      default:
        return step.explanationBeginner;
    }
  }

  switch (step.actionKind) {
    case "push-left":
      return "The stack simulates recursive inorder calls and stores ancestors whose left subtrees are still being completed.";
    case "pop-node":
      return "Popping the stack yields the next sorted element in the BST inorder sequence.";
    case "first-value":
      return "`prev` is seeded only after the first inorder visit, because no adjacent pair exists before that.";
    case "update-best":
      return "The minimum absolute difference in a sorted sequence is found among adjacent values only.";
    case "keep-best":
      return "The current adjacent gap is larger than the stored minimum, so the invariant remains unchanged.";
    case "move-right":
      return "The traversal now enters the right subtree, whose values are greater than the current node.";
    case "done":
      return "Each node was visited once: O(n) time and O(h) auxiliary stack space.";
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
            Zoom in on the previous pointer, current sorted value, and best adjacent gap.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Previous
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {labelOf(step, step.pointers.prevId)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {labelOf(step, step.pointers.focusId)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Stack Top
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {labelOf(step, step.pointers.stackTopId)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Best Gap
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {formatDiff(step.state.bestDiff)}
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
        <StackStrip
          title="Stack"
          ids={step.state.stackIds}
          nodes={step.state.nodes}
          accent="amber"
          highlightId={step.pointers.stackTopId}
          reverse
          emptyLabel="The stack is empty."
          helperText="Saved ancestors waiting for their inorder turn."
        />
        <InorderStrip
          ids={step.state.visitedIds}
          nodes={step.state.nodes}
          prevId={step.pointers.prevId}
          focusId={step.pointers.focusId}
        />
      </div>

      <div className="mt-5">
        <DifferenceLedger
          records={step.state.differences}
          nodes={step.state.nodes}
          bestPairIds={step.pointers.bestPairIds}
        />
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Why it matters:</span>{" "}
        {mode === "beginner"
          ? "A BST gives values in sorted order when read inorder, so the closest two values must be neighbors in that sorted list."
          : "The proof reduces the tree problem to the adjacent-difference scan of a sorted sequence emitted lazily by inorder traversal."}
      </div>
    </div>
  );
}
