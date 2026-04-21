import {
  formatRange,
  type Mode,
  type SortedArrayToBSTTraceStep,
} from "./generateTrace";

function beginnerText(step: SortedArrayToBSTTraceStep) {
  switch (step.actionKind) {
    case "parsed":
      return "The visualizer starts with the whole sorted array. Each recursive call will shrink that window and build one subtree.";
    case "enter-range":
      return "We are focusing on one slice of the array. This slice will become one subtree.";
    case "empty-range":
      return "This side ran out of values, so that child stays empty.";
    case "choose-mid":
      return "The middle number is the best root for this slice because it leaves a similar amount of data on both sides.";
    case "create-node":
      return "That middle value is now a tree node, and future recursive calls will hang smaller and larger values beneath it.";
    case "recurse-left":
      return "The left half contains smaller numbers, so it becomes the left subtree.";
    case "recurse-right":
      return "Now the larger numbers on the right half become the right subtree.";
    case "return-node":
      return "This subtree is complete, so the finished root can be returned to its parent call.";
    default:
      return "Every slice chose its own midpoint, so the finished tree stays balanced.";
  }
}

function expertText(step: SortedArrayToBSTTraceStep) {
  switch (step.actionKind) {
    case "parsed":
      return "The helper receives inclusive bounds and constructs exactly one subtree for each interval.";
    case "enter-range":
      return "The recursive invariant is: build a height-balanced BST using the sorted values inside the current interval only.";
    case "empty-range":
      return "The base case returns null when the interval is exhausted, which terminates the branch cleanly.";
    case "choose-mid":
      return "Choosing the midpoint minimizes subtree height difference and preserves the BST ordering property automatically.";
    case "create-node":
      return "The midpoint becomes the subtree root before assigning left and right child pointers recursively.";
    case "recurse-left":
      return "All indices left of mid remain strictly smaller than the root, so they form the left subtree.";
    case "recurse-right":
      return "All indices right of mid remain strictly larger than the root, so they form the right subtree.";
    case "return-node":
      return "Once both recursive assignments resolve, the helper returns the completed subtree root in O(1) additional work.";
    default:
      return "The construction touches each element once, giving O(n) time and O(log n) stack depth on balanced splits.";
  }
}

export default function MicroscopeView({
  step,
  mode,
}: {
  step: SortedArrayToBSTTraceStep;
  mode: Mode;
}) {
  const focusNode = step.state.nodes.find(
    (node) => node.id === step.pointers.focusNodeId
  );

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">
            Follow how one midpoint choice turns into a balanced subtree.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Action Kind
          </p>
          <p className="mt-2 text-lg font-semibold text-cyan-200">
            {step.actionKind}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Active Range
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {formatRange(step.pointers.activeRange)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Midpoint
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.midIndex ?? "-"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Focus Node
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {focusNode?.value ?? "-"}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-gradient-to-br from-slate-950/70 via-[#07111f] to-slate-950/65 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {mode === "beginner" ? "Plain-English View" : "Invariant View"}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          {mode === "beginner" ? beginnerText(step) : expertText(step)}
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Why the midpoint matters
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            The midpoint is the only value that can sit above the two halves
            without breaking sorted order. That is why the array view and tree
            view stay perfectly in sync.
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Recursion recipe
          </p>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2">
              1. Solve one interval.
            </div>
            <div className="rounded-xl border border-yellow-400/30 bg-yellow-500/10 px-3 py-2">
              2. Choose the midpoint as the root.
            </div>
            <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-3 py-2">
              3. Recurse on left and right halves.
            </div>
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2">
              4. Return the completed subtree.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
