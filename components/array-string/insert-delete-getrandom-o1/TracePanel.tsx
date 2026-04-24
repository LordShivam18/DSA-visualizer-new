import LightTracePanel from "../shared/LightTracePanel";
import type { RandomizedSetTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: RandomizedSetTraceStep;
}) {
  return (
    <LightTracePanel
      step={step}
      subtitle="Watch each API call update the dense array, the hashmap, or both."
    />
  );
}
