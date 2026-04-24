import SlidingWindowWorkbenchBase from "../shared/SlidingWindowWorkbenchBase";
import type { MinimumSizeSubarraySumTraceStep } from "./generateTrace";
import SumPressureGauge from "./SumPressureGauge";

export default function MinimumSizeSubarraySumWorkbench({
  step,
}: {
  step: MinimumSizeSubarraySumTraceStep;
}) {
  return (
    <div className="space-y-4">
      <SumPressureGauge step={step} />
      <SlidingWindowWorkbenchBase
        step={step}
        title="Expand until valid, then contract until tight"
        description="This window lives on positive integers, so every expansion increases the sum and every contraction decreases it. That monotonic behavior is what makes the animation and the algorithm so clean."
        accent="emerald"
        legend={[
          "Emerald: live right expansion",
          "Cyan: left boundary and sum control",
          "Yellow: best answer so far",
          "Purple: active interior",
          "Rose: no solution",
        ]}
      />
    </div>
  );
}
