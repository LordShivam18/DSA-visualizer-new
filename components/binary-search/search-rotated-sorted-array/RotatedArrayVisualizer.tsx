import RotatedArrayCell from "./RotatedArrayCell";
import { type RotatedSearchTraceStep } from "./generateTrace";

type Props = {
  step: RotatedSearchTraceStep;
};

function isInSortedHalf(step: RotatedSearchTraceStep, index: number) {
  if (step.state.sortedHalf === "left") {
    return index >= step.state.left && index <= (step.state.mid ?? -1);
  }

  if (step.state.sortedHalf === "right") {
    return index >= (step.state.mid ?? step.state.right + 1) && index <= step.state.right;
  }

  return false;
}

export default function RotatedArrayVisualizer({ step }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]" />
            <h2 className="text-lg font-semibold text-slate-50">
              Rotated Search Field
            </h2>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            One side of every rotated window is still sorted. The trace exposes
            that side before deciding where the target can still live.
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
              <RotatedArrayCell
                key={`${index}-${value}`}
                index={index}
                value={value}
                activeWindow={index >= step.state.left && index <= step.state.right}
                isLeft={index === step.state.left}
                isMid={index === step.state.mid}
                isRight={index === step.state.right}
                isFound={step.state.resultIndex === index && step.done}
                inSortedHalf={isInSortedHalf(step, index)}
                isPivot={step.state.pivotIndex === index}
              />
            ))}
          </div>

          <div className="mt-6 grid gap-3 lg:grid-cols-2">
            <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Sorted Half
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {step.state.sortedHalf === "left"
                  ? "The left segment is in order, so its value range can be tested directly."
                  : step.state.sortedHalf === "right"
                  ? "The right segment is in order, so its value range can be tested directly."
                  : "The trace is setting up the next comparison or has already finished."}
              </p>
            </div>

            <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Target Test
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                {step.state.targetInSortedHalf === null
                  ? "The algorithm has not yet tested whether the target fits the sorted half."
                  : step.state.targetInSortedHalf
                  ? "The target falls inside the sorted side's range, so the search keeps that side."
                  : "The target falls outside the sorted side's range, so the search jumps to the rotated side."}
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-[1.2rem] border border-rose-400/30 bg-rose-500/8 p-5 text-sm leading-7 text-rose-100">
          {step.state.message ?? "Provide a non-empty array and numeric target."}
        </div>
      )}
    </div>
  );
}
