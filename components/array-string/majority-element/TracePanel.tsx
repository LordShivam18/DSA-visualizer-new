import LightTracePanel from "../shared/LightTracePanel";
import type { MajorityElementTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: MajorityElementTraceStep;
}) {
  return (
    <LightTracePanel
      step={step}
      subtitle="See candidate resets, reinforcements, and vote cancellations."
    />
  );
}
