import SlidingWindowTracePanel from "../shared/SlidingWindowTracePanel";
import type { MinimumWindowSubstringTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: MinimumWindowSubstringTraceStep;
}) {
  return (
    <SlidingWindowTracePanel
      step={step}
      description="The trace follows target-ledger setup, right-edge expansion, requirement satisfaction, tightening, and coverage loss."
    />
  );
}
