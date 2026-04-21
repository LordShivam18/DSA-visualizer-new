import PeakBar from "./PeakBar";
import { type PeakSearchTraceStep } from "./generateTrace";

type Props = {
  step: PeakSearchTraceStep;
};

function buildHeightPercent(nums: number[], value: number) {
  const maxValue = Math.max(...nums);
  const minValue = Math.min(...nums);

  if (maxValue === minValue) {
    return 55;
  }

  return 26 + ((value - minValue) / (maxValue - minValue)) * 70;
}

export default function PeakSearchVisualizer({ step }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]" />
            <h2 className="text-lg font-semibold text-slate-50">
              Peak Search Field
            </h2>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            The bars show the local slope around the midpoint. Binary search
            follows the slope toward a guaranteed peak.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-200">
            Window {step.state.left} to {step.state.right}
          </span>
          <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-200">
            Mid {step.state.mid ?? "none"}
          </span>
          <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-200">
            Next {step.state.nextIndex ?? "none"}
          </span>
        </div>
      </div>

      {step.state.valid ? (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 xl:grid-cols-7">
            {step.state.nums.map((value, index) => (
              <PeakBar
                key={`${index}-${value}`}
                index={index}
                value={value}
                heightPercent={buildHeightPercent(step.state.nums, value)}
                activeWindow={index >= step.state.left && index <= step.state.right}
                isLeft={index === step.state.left}
                isMid={index === step.state.mid}
                isNext={index === step.state.nextIndex}
                isRight={index === step.state.right}
                isPeak={step.state.resultIndex === index && step.done}
              />
            ))}
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Active Comparison
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Compare{" "}
                <span className="font-mono text-yellow-200">
                  nums[{step.state.mid ?? "none"}] = {step.state.midValue ?? "none"}
                </span>{" "}
                with{" "}
                <span className="font-mono text-violet-200">
                  nums[{step.state.nextIndex ?? "none"}] = {step.state.nextValue ?? "none"}
                </span>
                .
              </p>
            </div>

            <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Slope Reading
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {step.state.midValue !== null && step.state.nextValue !== null
                  ? step.state.midValue > step.state.nextValue
                    ? "The slope is falling, so the current half already contains a peak."
                    : "The slope is rising, so at least one peak lies further to the right."
                  : "The final single index is being reported as the peak."}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-[1.2rem] border border-rose-400/30 bg-rose-500/8 p-5 text-sm leading-7 text-rose-100">
          {step.state.message ?? "Provide a non-empty numeric array."}
        </div>
      )}
    </div>
  );
}
