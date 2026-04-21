import FrameStack from "./FrameStack";
import ValidationLedger from "./ValidationLedger";
import {
  formatBound,
  formatRange,
  formatResult,
  type ValidateTraceStep,
} from "./generateTrace";

type Props = {
  step: ValidateTraceStep;
  mode: "beginner" | "expert";
};

function labelOf(step: ValidateTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

function focusCopy(step: ValidateTraceStep, mode: "beginner" | "expert") {
  if (mode === "beginner") {
    switch (step.actionKind) {
      case "pop-frame":
        return "We are checking whether this node fits between the limits passed down from its ancestors.";
      case "check-valid":
        return "This node is inside its allowed range, so its children can be checked with tighter limits.";
      case "check-invalid":
        return "This node breaks one of its inherited limits, so the whole tree is invalid.";
      case "schedule-left":
        return "The left child must stay below the current node.";
      case "schedule-right":
        return "The right child must stay above the current node.";
      case "done":
        return "Every checked node stayed inside its range, so the BST is valid.";
      default:
        return step.explanationBeginner;
    }
  }

  switch (step.actionKind) {
    case "pop-frame":
      return "The active frame carries exclusive low and high bounds derived from every ancestor.";
    case "check-valid":
      return "The strict condition `low < node->val < high` passed for this node.";
    case "check-invalid":
      return "A violated range bound is sufficient to return false immediately.";
    case "schedule-left":
      return "Left recursion tightens the upper bound to the current node value.";
    case "schedule-right":
      return "Right recursion tightens the lower bound to the current node value.";
    case "done":
      return "All non-null frames satisfied the range invariant, so validation returns true.";
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
            Zoom in on the active node and the exact strict bounds it must satisfy.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Focus Node
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {labelOf(step, step.pointers.focusId)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Must Be Greater Than
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {formatBound(step.pointers.lowerBound)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Must Be Less Than
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {formatBound(step.pointers.upperBound)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Result
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {formatResult(step.state.result)}
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

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Active Range
        </p>
        <p className="mt-2 font-mono text-lg text-cyan-200">
          {formatRange(step.pointers.lowerBound, step.pointers.upperBound)}
        </p>
        {step.pointers.failedBound ? (
          <p className="mt-2 text-sm text-rose-200">
            Failed {step.pointers.failedBound === "low" ? "lower" : "upper"} bound.
          </p>
        ) : null}
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <FrameStack
          frames={step.state.frames}
          nodes={step.state.nodes}
          emptyLabel="No scheduled range checks remain."
        />
        <ValidationLedger
          records={step.state.records}
          nodes={step.state.nodes}
          invalidId={step.state.invalidId}
        />
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Why it matters:</span>{" "}
        {mode === "beginner"
          ? "A node can look correct next to its parent but still break a rule from an older ancestor, so we carry the full range."
          : "Range propagation catches global BST violations that parent-only comparisons miss."}
      </div>
    </div>
  );
}
