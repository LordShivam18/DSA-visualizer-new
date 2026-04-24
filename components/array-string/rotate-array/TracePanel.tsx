import LightTracePanel from "../shared/LightTracePanel";
import type { RotateArrayTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: RotateArrayTraceStep;
}) {
  return (
    <LightTracePanel
      step={step}
      subtitle="Follow segment selection, pair swaps, and phase completion."
    />
  );
}
