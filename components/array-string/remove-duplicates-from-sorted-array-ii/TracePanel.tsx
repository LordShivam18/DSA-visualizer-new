import LightTracePanel from "../shared/LightTracePanel";
import type { RemoveDuplicatesIITraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: RemoveDuplicatesIITraceStep;
}) {
  return (
    <LightTracePanel
      step={step}
      subtitle="Each step shows whether the current value would create a third copy."
    />
  );
}
