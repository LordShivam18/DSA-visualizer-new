import { formatList, type MergeKTraceStep, type Mode } from "./generateTrace";

function beginnerText(step: MergeKTraceStep) {
  switch (step.actionKind) {
    case "parsed":
      return "Instead of merging all k lists one by one, the algorithm merges them in rounds like a playoff bracket.";
    case "start-round":
      return "A new round begins. Nearby lists will pair up and produce fewer, larger winners.";
    case "carry-list":
      return "This list had no partner, so it moves to the next round without changing.";
    case "begin-merge":
      return "One pair of lists is now entering the normal two-list merge process.";
    case "compare-heads":
      return "The two front values compete because the smaller one must come next in sorted order.";
    case "take-left":
      return "The left head wins this comparison and gets linked into the merged winner.";
    case "take-right":
      return "The right head is smaller, so it becomes the next value in the winner.";
    case "append-rest":
      return "Only one side still has values left, so they all slide straight into the merged result.";
    case "merge-complete":
      return "This pair has produced one sorted winner that advances to the next round.";
    case "advance-round":
      return "The bracket shrinks after every round, which is why divide and conquer is efficient here.";
    default:
      return "Only one list remains, so the full merge is finished.";
  }
}

function expertText(step: MergeKTraceStep) {
  switch (step.actionKind) {
    case "parsed":
      return "Pairwise merging reduces the number of active runs logarithmically, giving O(n log k) total time.";
    case "start-round":
      return "Each outer iteration operates on the current frontier of sorted runs and prepares the next frontier.";
    case "carry-list":
      return "An unmatched tail run advances unchanged, preserving correctness without extra comparisons.";
    case "begin-merge":
      return "The per-pair operation is identical to mergeTwoLists and runs in linear time in the combined pair size.";
    case "compare-heads":
      return "The smaller of the two head nodes is globally minimal among all remaining nodes in this pair.";
    case "take-left":
      return "Choosing the lower left head preserves monotonicity and advances only that run pointer.";
    case "take-right":
      return "The right run contributes the next node because its head is the smaller frontier element.";
    case "append-rest":
      return "Once one run is exhausted, the other run already remains sorted and can be attached wholesale.";
    case "merge-complete":
      return "The merged winner is the sorted union of the pair and becomes one node in the next-round frontier.";
    case "advance-round":
      return "Round depth is O(log k) because the number of runs roughly halves every iteration.";
    default:
      return "The final run contains all nodes in sorted order after every pairwise merge has resolved.";
  }
}

export default function MicroscopeView({
  step,
  mode,
}: {
  step: MergeKTraceStep;
  mode: Mode;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.55)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">
            Zoom in on the current bracket round or pairwise merge choice.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Round
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.state.currentRound + 1}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Active Pair
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.activePairIndex === null
              ? "-"
              : step.pointers.activePairIndex + 1}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Left Input
          </p>
          <p className="mt-2 text-sm font-semibold text-violet-200">
            {formatList(step.state.leftList)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Winner So Far
          </p>
          <p className="mt-2 text-sm font-semibold text-emerald-200">
            {formatList(step.state.mergedList)}
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
            Tournament idea
          </p>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <div className="rounded-xl border border-cyan-400/30 bg-cyan-500/10 px-3 py-2">
              1. Pair the active lists.
            </div>
            <div className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-3 py-2">
              2. Merge each pair into one winner.
            </div>
            <div className="rounded-xl border border-yellow-400/30 bg-yellow-500/10 px-3 py-2">
              3. Carry forward any unpaired list.
            </div>
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-3 py-2">
              4. Repeat until one champion list remains.
            </div>
          </div>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Why divide and conquer helps
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Merging each new list into one growing answer can become expensive.
            Balanced pairwise rounds keep list sizes more even, which is why the
            total work scales better when k is large.
          </p>
        </div>
      </div>
    </div>
  );
}
