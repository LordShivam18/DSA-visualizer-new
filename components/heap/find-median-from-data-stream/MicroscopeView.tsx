import type { MedianStreamTraceStep } from "./generateTrace";

type Props = {
  step: MedianStreamTraceStep;
  mode: "beginner" | "expert";
};

function beginnerFocus(step: MedianStreamTraceStep) {
  switch (step.actionKind) {
    case "inspect":
      return "A new number arrives and chooses which side of the middle it belongs to.";
    case "push":
      return "The number is inserted into one of the heaps before we check if the halves stayed balanced.";
    case "bubble-up":
      return "The heap reorders itself so its special root value stays visible.";
    case "rebalance":
      return "One root moves across because the two halves drifted too far apart in size.";
    case "bubble-down":
      return "After moving a root away, the old heap repairs itself from the top.";
    case "median":
      return "The median now comes directly from the roots: one root if odd, or the average of two roots if even.";
    default:
      return "Once all operations finish, the heaps still summarize the stream correctly.";
  }
}

function expertFocus(step: MedianStreamTraceStep) {
  switch (step.actionKind) {
    case "inspect":
      return "Insertion first chooses a side based on the lower root, preserving the partition between lower and upper halves.";
    case "push":
      return "Each add is O(log n) because it performs at most one heap insertion plus a bounded amount of rebalancing.";
    case "bubble-up":
      return "Insertion repair restores either the max-heap or min-heap ordering relation along one ancestor path.";
    case "rebalance":
      return "The structural invariant requires lower.size >= upper.size and lower.size - upper.size <= 1.";
    case "bubble-down":
      return "Deletion repair after moving a root keeps the source heap valid in logarithmic time.";
    case "median":
      return "Median queries are O(1) because the middle element(s) are exposed directly at the heap roots.";
    default:
      return "The data structure supports online updates without sorting the full stream after each insertion.";
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
            Zoom in on the balance invariant that makes median queries instant.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Op
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.state.currentOpIndex !== null
              ? step.state.currentOpIndex + 1
              : "done"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Lower Size
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.lowerHeap.length}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Upper Size
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.state.upperHeap.length}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Last Median
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.state.lastMedian ?? "none"}
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
            Split Rule
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Every value in the <span className="text-emerald-200">lower max-heap</span>{" "}
            should stay less than or equal to every value in the{" "}
            <span className="text-yellow-200">upper min-heap</span>.
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Rebalance Trigger
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            If lower gets more than one element ahead, move its root to upper.
            If upper ever becomes larger, move its root back to lower.
          </p>
        </div>
      </div>
    </div>
  );
}
