import type { KthLargestTraceStep } from "./generateTrace";

type Props = {
  step: KthLargestTraceStep;
  mode: "beginner" | "expert";
};

function beginnerFocus(step: KthLargestTraceStep) {
  switch (step.actionKind) {
    case "inspect":
      return "A new number just arrived from the array. The heap will decide whether it deserves to stay among the top k values.";
    case "push":
      return "Every number enters the heap first. We let the heap organize itself before deciding whether something must leave.";
    case "bubble-up":
      return "The smaller value climbs upward so the heap can keep its smallest survivor at the top.";
    case "size-check":
      return "This check asks one question: do we still have room for every survivor, or does the smallest one need to go?";
    case "trim":
      return "The heap got too big, so it removes the smallest survivor. That keeps only the biggest k numbers alive.";
    case "bubble-down":
      return "After removing the root, the heap slides the replacement value downward until the structure is tidy again.";
    default:
      return "Once every number is processed, the root is the kth largest answer.";
  }
}

function expertFocus(step: KthLargestTraceStep) {
  switch (step.actionKind) {
    case "inspect":
      return "Each stream element is inserted in O(log k) worst-case time, keeping memory bounded by the target rank rather than by n.";
    case "push":
      return "Insertion appends to the underlying array, then repairs the heap along one ancestor chain.";
    case "bubble-up":
      return "Bubble-up restores the min-heap invariant locally: parent <= child on every edge of the insertion path.";
    case "size-check":
      return "The core invariant is size <= k. Any overflow means the root cannot belong to the final top-k set.";
    case "trim":
      return "Removing the minimum preserves exactly the k largest processed values, which makes the root the kth order statistic.";
    case "bubble-down":
      return "Deletion repair follows one descendant chain, so each trim stays O(log k).";
    default:
      return "The full algorithm runs in O(n log k) time and O(k) space.";
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
            Zoom in on the heap invariant that makes the kth largest value cheap
            to maintain.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Scan Pointer
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.scan ?? "done"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Heap Root
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.heapTop?.value ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Heap Index
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.heapIndex ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Compare Index
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.compareIndex ?? "none"}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-gradient-to-br from-slate-950/70 via-[#07111f] to-slate-950/65 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {mode === "beginner" ? "What Is Happening" : "Algorithm Invariant"}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          {mode === "beginner" ? beginnerFocus(step) : expertFocus(step)}
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Why a Min-Heap
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            The heap keeps the <span className="text-cyan-200">largest k values</span>,
            but its root is the <span className="text-emerald-200">smallest among those survivors</span>.
            That is exactly the kth largest value we want.
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Progress
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Seen
              </p>
              <p className="mt-1 font-mono text-sm text-cyan-200">
                {step.state.processedIndices.length}/{step.state.nums.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Heap
              </p>
              <p className="mt-1 font-mono text-sm text-violet-200">
                {step.state.heap.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Last Out
              </p>
              <p className="mt-1 font-mono text-sm text-rose-200">
                {step.state.lastRemoved?.value ?? "none"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
