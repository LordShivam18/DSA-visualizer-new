import LightTracePanel from "../shared/LightTracePanel";
import type { CandyTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: CandyTraceStep;
}) {
  return (
    <LightTracePanel
      step={step}
      subtitle="Follow the left-to-right construction and the right-to-left corrections."
    />
  );
}
