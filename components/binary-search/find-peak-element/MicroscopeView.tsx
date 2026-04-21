import { type PeakSearchTraceStep } from "./generateTrace";

type Props = {
  step: PeakSearchTraceStep;
  mode: "beginner" | "expert";
};

export default function MicroscopeView({ step, mode }: Props) {
  const windowSize =
    step.state.valid && step.state.left <= step.state.right
      ? step.state.right - step.state.left + 1
      : 0;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-yellow-400 shadow-[0_0_18px_rgba(251,191,36,0.55)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">
            Focus on the slope rule that makes peak search work.
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
            Next
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.next ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Window Width
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">{windowSize}</p>
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
            Slope Check
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            {step.state.midValue !== null && step.state.nextValue !== null
              ? step.state.midValue > step.state.nextValue
                ? "Because nums[mid] is larger than nums[mid + 1], the search keeps the left side including mid."
                : "Because nums[mid] is smaller than nums[mid + 1], the search moves right to chase the uphill slope."
              : "The search is finished, so the remaining index is the answer."}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Complexity
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Time
              </p>
              <p className="mt-1 font-mono text-sm text-cyan-200">O(log n)</p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Space
              </p>
              <p className="mt-1 font-mono text-sm text-emerald-200">O(1)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
