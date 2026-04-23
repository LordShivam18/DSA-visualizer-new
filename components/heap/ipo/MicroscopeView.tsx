import type { IPOTraceStep } from "./generateTrace";

type Props = {
  step: IPOTraceStep;
  mode: "beginner" | "expert";
};

function beginnerFocus(step: IPOTraceStep) {
  switch (step.actionKind) {
    case "round-start":
      return "A new round begins by checking which projects are affordable with the capital we have right now.";
    case "unlock":
      return "This project just became affordable, so it joins the candidate heap.";
    case "bubble-up":
      return "A stronger profit climbs upward so the best affordable project stays easy to grab.";
    case "select":
      return "The max-heap root is the richest project we can currently start, so that is the greedy choice.";
    case "bubble-down":
      return "After taking the best project, the heap repairs itself so the next-best one rises upward.";
    case "gain":
      return "Completing the project increases capital, which can unlock more ambitious projects next round.";
    case "stalled":
      return "No affordable project is left, so growth has to stop.";
    default:
      return "The loop ends when we use up the allowed rounds or run out of affordable work.";
  }
}

function expertFocus(step: IPOTraceStep) {
  switch (step.actionKind) {
    case "round-start":
      return "The monotonic pointer scans the capital-sorted array once, moving newly feasible projects into the max-heap frontier.";
    case "unlock":
      return "Affordability is checked against current capital only once per project, which keeps the scan linear after sorting.";
    case "bubble-up":
      return "Insertion preserves the max-heap invariant so the best profit remains at the root.";
    case "select":
      return "The greedy step is valid because maximizing capital this round can only expand future feasibility, never reduce it.";
    case "bubble-down":
      return "Deletion repair keeps extraction logarithmic while restoring the max-order relation.";
    case "gain":
      return "Capital update is the state transition that expands the feasible set for the next iteration.";
    case "stalled":
      return "An empty max-heap means the affordable frontier is empty, so the algorithm terminates early.";
    default:
      return "Overall complexity is O(n log n + k log n): sort once, then each project enters and leaves a heap at most once.";
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
            Zoom in on why the sorted rail and max-heap work together.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Round
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.state.round || "setup"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Capital
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.currentCapital}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Heap Root
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.state.heap[0] ? `P${step.state.heap[0].id}` : "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Next Unlock
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.state.sortedProjects[step.state.nextProjectIndex]
              ? `P${step.state.sortedProjects[step.state.nextProjectIndex].id}`
              : "none"}
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
            Greedy Rule
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Among projects you can currently afford, always take the{" "}
            <span className="text-emerald-200">highest profit</span>. More
            capital now can only unlock at least as many future choices.
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Progress
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Selected
              </p>
              <p className="mt-1 font-mono text-sm text-cyan-200">
                {step.state.selectedProjects.length}/{step.state.k}
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
                Rail Pointer
              </p>
              <p className="mt-1 font-mono text-sm text-yellow-200">
                {step.state.nextProjectIndex}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
