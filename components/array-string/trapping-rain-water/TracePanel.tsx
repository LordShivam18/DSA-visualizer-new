import LightTracePanel from "../shared/LightTracePanel";
import type { TrappingRainWaterTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: TrappingRainWaterTraceStep;
}) {
  return (
    <LightTracePanel
      step={step}
      subtitle="Follow which side gets resolved, when maxima rise, and when water is added."
    />
  );
}
