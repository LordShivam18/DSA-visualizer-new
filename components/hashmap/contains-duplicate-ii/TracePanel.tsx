import HashmapTracePanel from "../shared/HashmapTracePanel";
import type { ContainsDuplicateIITraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: ContainsDuplicateIITraceStep;
}) {
  return (
    <HashmapTracePanel
      step={step}
      description="The trace captures each lookup, each measured gap, and every refresh of the last-seen index."
    />
  );
}
