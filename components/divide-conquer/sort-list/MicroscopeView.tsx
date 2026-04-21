import { formatList, type Mode, type SortListTraceStep } from "./generateTrace";

function beginnerText(step: SortListTraceStep) {
  switch (step.actionKind) {
    case "parsed":
      return "The whole list starts as one big sorting job. Merge sort will keep cutting it until the pieces become tiny.";
    case "enter-sort":
      return "This recursive call owns one slice of the linked list and will return it in sorted order.";
    case "find-middle":
      return "Slow and fast pointers help us find where to cut the list into two smaller halves.";
    case "split":
      return "The big list becomes two smaller lists. Smaller problems are easier to sort.";
    case "base-case":
      return "A list with at most one node is already sorted, so recursion can stop here.";
    case "begin-merge":
      return "Now the algorithm has two sorted halves and starts weaving them into one sorted result.";
    case "compare-heads":
      return "Only the front nodes matter because each half is already sorted inside.";
    case "take-left":
      return "The left head wins this comparison, so it becomes the next node in the merged output.";
    case "take-right":
      return "The right head is smaller this time, so it gets attached next.";
    case "append-rest":
      return "Once one half is empty, the rest of the other half can be connected directly.";
    case "merge-complete":
      return "Two smaller sorted runs have been combined into one larger sorted run.";
    default:
      return "The list is fully sorted after all splits and merges finish.";
  }
}

function expertText(step: SortListTraceStep) {
  switch (step.actionKind) {
    case "parsed":
      return "Linked-list merge sort avoids random access and relies on pointer splits plus linear merges.";
    case "enter-sort":
      return "The recursive invariant is: return a sorted list containing exactly the nodes in this frame's segment.";
    case "find-middle":
      return "The tortoise-hare walk identifies the split point in O(length) time without extra indexing structures.";
    case "split":
      return "Breaking the next pointer at the midpoint yields two independent subproblems for recursion.";
    case "base-case":
      return "Size 0 and size 1 runs are already sorted and serve as leaves of the recursion tree.";
    case "begin-merge":
      return "The conquer step merges two sorted runs while maintaining a monotonically nondecreasing output tail.";
    case "compare-heads":
      return "Because both runs are sorted, comparing the two heads is sufficient to choose the next globally smallest node.";
    case "take-left":
      return "Taking the left node on ties preserves merge stability and advances only that run's head pointer.";
    case "take-right":
      return "The right run contributes the smaller head, so tail->next is rewired to that node.";
    case "append-rest":
      return "Once one run is exhausted, the remaining run is already sorted and can be linked in O(1) per node.";
    case "merge-complete":
      return "The merged run is the exact sorted union of both child runs and becomes the return value of this frame.";
    default:
      return "The full algorithm runs in O(n log n) time with O(log n) recursive stack depth.";
  }
}

export default function MicroscopeView({
  step,
  mode,
}: {
  step: SortListTraceStep;
  mode: Mode;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">
            Zoom into the split or merge rule that is active right now.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Active Run
          </p>
          <p className="mt-2 text-xl font-semibold text-cyan-200">
            {step.pointers.activeLabel ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Active Size
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.state.activeSegment.length}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Left Run
          </p>
          <p className="mt-2 text-sm font-semibold text-violet-200">
            {formatList(step.state.leftSegment)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Merged So Far
          </p>
          <p className="mt-2 text-sm font-semibold text-emerald-200">
            {formatList(step.state.mergedSegment)}
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
            Merge-sort recipe
          </p>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <div className="rounded-xl border border-yellow-400/30 bg-yellow-500/10 px-3 py-2">
              1. Find the midpoint.
            </div>
            <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2">
              2. Recursively sort both halves.
            </div>
            <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-3 py-2">
              3. Compare the two heads.
            </div>
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2">
              4. Attach the smaller node to the tail.
            </div>
          </div>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Why linked lists like merge sort
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Splitting by pointers and merging by rewiring next links fits linked
            lists naturally. Unlike array-based sorts, merge sort does not need
            random index access to stay efficient here.
          </p>
        </div>
      </div>
    </div>
  );
}
