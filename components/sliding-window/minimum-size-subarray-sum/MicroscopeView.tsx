import SlidingWindowMicroscopeView from "../shared/SlidingWindowMicroscopeView";
import type { SlidingWindowMode } from "../shared/types";
import type { MinimumSizeSubarraySumTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: MinimumSizeSubarraySumTraceStep;
  mode: SlidingWindowMode;
}) {
  return (
    <SlidingWindowMicroscopeView
      step={step}
      mode={mode}
      description="Zoom in on the live sum, the target crossing moment, and the contraction logic that searches for the shortest valid window."
    />
  );
}
