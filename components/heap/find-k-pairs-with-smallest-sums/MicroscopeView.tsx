import type { KSmallestPairsTraceStep } from "./generateTrace";

type Props = {
  step: KSmallestPairsTraceStep;
  mode: "beginner" | "expert";
};

function beginnerFocus(step: KSmallestPairsTraceStep) {
  switch (step.actionKind) {
    case "seed":
      return "Each row sends only its first pair into the heap because that is the cheapest place that row can start.";
    case "bubble-up":
      return "A cheaper pair climbs upward so the next answer stays close to the top.";
    case "pop":
      return "The root is the smallest pair waiting right now, so it becomes the next one we examine.";
    case "append":
      return "Once a pair is popped, it is confirmed as the next answer pair in sorted order.";
    case "push-next":
      return "Only the next column in the same row can matter after a pop, so that is the only new pair we add.";
    case "bubble-down":
      return "After removing the root, the heap repairs itself to expose the next smallest candidate.";
    default:
      return "The process ends when we collect k pairs or run out of candidates.";
  }
}

function expertFocus(step: KSmallestPairsTraceStep) {
  switch (step.actionKind) {
    case "seed":
      return "Seeding (i, 0) for each row builds the initial monotone frontier because rows are non-decreasing by j.";
    case "bubble-up":
      return "Insertion preserves the min-heap invariant so the frontier minimum remains at the root.";
    case "pop":
      return "Root extraction returns the global minimum over all active row frontiers.";
    case "append":
      return "Appending after a pop is safe because the heap root is globally minimal among all unseen frontier states.";
    case "push-next":
      return "After consuming (i, j), only (i, j + 1) can newly compete from row i; later columns are still dominated.";
    case "bubble-down":
      return "Deletion repair restores heap order in logarithmic time.";
    default:
      return "The heap holds at most O(min(k, nums1.size())) candidates, giving O(k log min(k, nums1.size())) extraction work after seeding.";
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
            Focus on why the heap needs only one live candidate per row.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Active Row
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.row ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Active Col
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.col ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Next Col
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.nextCol ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Heap Root
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.heap[0] ? `[${step.state.heap[0].leftValue}, ${step.state.heap[0].rightValue}]` : "none"}
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
            Frontier Rule
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            If pair <span className="text-cyan-200">(i, j)</span> was the next
            answer, then the only unseen pair in row <span className="text-violet-200">i</span>{" "}
            that can compete next is <span className="text-yellow-200">(i, j + 1)</span>.
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Progress
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Output
              </p>
              <p className="mt-1 font-mono text-sm text-cyan-200">
                {step.state.resultPairs.length}/{step.state.k}
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
                Seed Rows
              </p>
              <p className="mt-1 font-mono text-sm text-yellow-200">
                {step.state.seedLimit}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
