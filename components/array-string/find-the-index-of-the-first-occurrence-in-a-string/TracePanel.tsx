import DarkTracePanel from "../shared/DarkTracePanel";
import type { FirstOccurrenceTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: FirstOccurrenceTraceStep;
}) {
  return (
    <DarkTracePanel
      step={step}
      subtitle="Follow candidate starts, inner comparisons, and the attempt ledger together."
    />
  );
}
