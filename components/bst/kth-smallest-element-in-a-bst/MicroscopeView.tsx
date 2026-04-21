import RankStrip from "./RankStrip";
import StackStrip from "./StackStrip";
import { formatResult, type KthTraceStep } from "./generateTrace";

type Props = {
  step: KthTraceStep;
  mode: "beginner" | "expert";
};

function labelOf(step: KthTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

function focusCopy(step: KthTraceStep, mode: "beginner" | "expert") {
  if (mode === "beginner") {
    switch (step.actionKind) {
      case "push-left":
        return "Move left to reach smaller values before larger values.";
      case "pop-node":
        return "The stack top is the next smallest value we have not counted yet.";
      case "count-node":
        return "This value receives the next sorted rank. If that rank equals k, it is the answer.";
      case "found":
        return "The rank matched k, so we can stop without scanning the rest of the tree.";
      case "move-right":
        return "After counting this value, the next larger values are on the right.";
      case "done":
        return step.state.invalidReason ?? "The traversal is complete.";
      default:
        return step.explanationBeginner;
    }
  }

  switch (step.actionKind) {
    case "push-left":
      return "The explicit stack stores the left spine, which is the inorder frontier.";
    case "pop-node":
      return "Each pop advances the sorted rank by exactly one.";
    case "count-node":
      return "The rank counter is equivalent to decrementing k on each inorder visit.";
    case "found":
      return "Early return is correct because no unvisited node can have a smaller rank than the current inorder node.";
    case "move-right":
      return "After visiting a node, traversal continues with the left spine of its right subtree.";
    case "done":
      return step.state.invalidReason ?? "The loop ended with the desired rank resolved.";
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
            Zoom in on sorted ranks, the stack frontier, and the early return.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Rank
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.state.count}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Target k
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.state.k}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Focus
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {labelOf(step, step.pointers.focusId)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Result
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {formatResult(step.state.resultValue)}
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
          highlightId={step.pointers.stackTopId}
          reverse
          emptyLabel="The stack is empty."
          helperText="Saved ancestors waiting to receive later ranks."
        />
        <RankStrip
          ids={step.state.visitedIds}
          nodes={step.state.nodes}
          k={step.state.k}
          foundId={step.pointers.foundId}
        />
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Why it matters:</span>{" "}
        {mode === "beginner"
          ? "The BST lets us count values from smallest to largest without sorting a separate array."
          : "Inorder traversal is an online sorted stream, so kth smallest is simply the kth emitted node."}
      </div>
    </div>
  );
}
