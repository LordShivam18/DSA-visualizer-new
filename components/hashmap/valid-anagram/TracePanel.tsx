import HashmapTracePanel from "../shared/HashmapTracePanel";
import type { ValidAnagramTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: ValidAnagramTraceStep;
}) {
  return (
    <HashmapTracePanel
      step={step}
      description="The trace follows the build pass, the cancel-out pass, and the first bucket that would go empty too early."
    />
  );
}
