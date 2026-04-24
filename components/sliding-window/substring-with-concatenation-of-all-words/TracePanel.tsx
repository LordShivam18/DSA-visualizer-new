import SlidingWindowTracePanel from "../shared/SlidingWindowTracePanel";
import type { SubstringWithConcatenationOfAllWordsTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: SubstringWithConcatenationOfAllWordsTraceStep;
}) {
  return (
    <SlidingWindowTracePanel
      step={step}
      description="The trace records offset-lane starts, aligned chunk reads, forbidden-word resets, overflow cleanup, and answer hits."
    />
  );
}
