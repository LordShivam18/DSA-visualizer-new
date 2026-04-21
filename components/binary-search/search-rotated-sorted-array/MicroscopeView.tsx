import { type RotatedSearchTraceStep } from "./generateTrace";

type Props = {
  step: RotatedSearchTraceStep;
  mode: "beginner" | "expert";
};

export default function MicroscopeView({ step, mode }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-yellow-400 shadow-[0_0_18px_rgba(251,191,36,0.55)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">
            Zoom in on the sorted-half test that makes rotated search possible.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Left
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.left ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Mid
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.pointers.mid ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Right
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.right ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Pivot
          </p>
          <p className="mt-2 text-2xl font-semibold text-rose-200">
            {step.state.pivotIndex ?? "none"}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-gradient-to-br from-slate-950/70 via-[#07111f] to-slate-950/65 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {mode === "beginner" ? "Simple Explanation" : "Invariant"}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          {mode === "beginner"
            ? step.explanationBeginner
            : step.explanationExpert}
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Half Check
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {step.state.sortedHalf === null
              ? "The current step is either selecting the midpoint or reporting the final answer."
              : step.state.sortedHalf === "left"
              ? "Because nums[left] <= nums[mid], the left half is sorted."
              : "Because the left half is not sorted, the right half must be sorted."}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Target Range Test
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {step.state.targetInSortedHalf === null
              ? "The target range test has not happened on this snapshot."
              : step.state.targetInSortedHalf
              ? "The target lies inside the sorted half, so that side is kept."
              : "The target lies outside the sorted half, so the search moves to the other side."}
          </p>
        </div>
      </div>
    </div>
  );
}
