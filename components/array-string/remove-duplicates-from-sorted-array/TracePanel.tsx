import LightTracePanel from "../shared/LightTracePanel";
import type { RemoveDuplicatesTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: RemoveDuplicatesTraceStep;
}) {
  return (
    <LightTracePanel
      step={step}
      subtitle="Watch the unique prefix grow exactly when a new value appears."
    />
  );
}
