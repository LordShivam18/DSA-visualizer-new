import SlidingWindowTracePanel from "../shared/SlidingWindowTracePanel";
import type { MinimumSizeSubarraySumTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: MinimumSizeSubarraySumTraceStep;
}) {
  return (
    <SlidingWindowTracePanel
      step={step}
      description="The trace alternates between right-edge growth, validity checks, best-answer updates, and left-edge contractions."
    />
  );
}
