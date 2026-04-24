import HashmapTracePanel from "../shared/HashmapTracePanel";
import type { GroupAnagramsTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: GroupAnagramsTraceStep;
}) {
  return (
    <HashmapTracePanel
      step={step}
      description="The trace records signature creation, bucket growth, and the final grouped output."
    />
  );
}
