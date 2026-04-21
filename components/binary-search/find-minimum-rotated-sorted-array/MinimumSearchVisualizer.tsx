import MinimumArrayCell from "./MinimumArrayCell";
import { type FindMinTraceStep } from "./generateTrace";

type Props = {
  step: FindMinTraceStep;
};

export default function MinimumSearchVisualizer({ step }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]" />
            <h2 className="text-lg font-semibold text-slate-50">
              Minimum Search Field
            </h2>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            The search does not chase a target value. It only preserves the half
            that could still hide the rotation pivot and the minimum.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-200">
            Window {step.state.left} to {step.state.right}
          </span>
          <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-3 py-1 text-yellow-200">
            Mid {step.state.mid ?? "none"}
          </span>
          <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-rose-200">
            Pivot {step.state.pivotIndex ?? "none"}
          </span>
        </div>
      </div>

      {step.state.valid ? (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
            {step.state.nums.map((value, index) => (
              <MinimumArrayCell
                key={`${index}-${value}`}
                index={index}
                value={value}
                activeWindow={index >= step.state.left && index <= step.state.right}
                isLeft={index === step.state.left}
                isMid={index === step.state.mid}
                isRight={index === step.state.right}
                isFound={step.state.resultIndex === index && step.done}
                isPivot={step.state.pivotIndex === index}
              />
            ))}
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Comparison Rule
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Compare{" "}
                <span className="font-mono text-yellow-200">
                  nums[mid] = {step.state.midValue ?? "none"}
                </span>{" "}
                against{" "}
                <span className="font-mono text-violet-200">
                  nums[right] = {step.state.rightValue ?? "none"}
                </span>
                .
              </p>
            </div>

            <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Search Decision
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {step.state.comparison === "mid-greater"
                  ? "Mid is larger than the right edge, so the minimum must sit somewhere to the right of mid."
                  : step.state.comparison === "mid-smaller-equal"
                  ? "Mid is at most the right edge, so the minimum is at mid or somewhere to the left of it."
                  : "The trace is preparing the next comparison or reporting the final answer."}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-[1.2rem] border border-rose-400/30 bg-rose-500/8 p-5 text-sm leading-7 text-rose-100">
          {step.state.message ?? "Provide a non-empty rotated array."}
        </div>
      )}
    </div>
  );
}
