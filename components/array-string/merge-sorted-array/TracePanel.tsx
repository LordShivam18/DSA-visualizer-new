import LightTracePanel from "../shared/LightTracePanel";
import type { MergeSortedArrayTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: MergeSortedArrayTraceStep;
}) {
  return (
    <LightTracePanel
      step={step}
      subtitle="Each snapshot shows one comparison or one committed write."
    />
  );
}
