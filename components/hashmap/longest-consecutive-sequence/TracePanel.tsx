import HashmapTracePanel from "../shared/HashmapTracePanel";
import type { LongestConsecutiveSequenceTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: LongestConsecutiveSequenceTraceStep;
}) {
  return (
    <HashmapTracePanel
      step={step}
      description="The trace captures set construction, non-start pruning, run extension, and best-length updates."
    />
  );
}
