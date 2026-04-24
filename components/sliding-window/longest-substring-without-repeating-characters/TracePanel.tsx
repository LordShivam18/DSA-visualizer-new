import SlidingWindowTracePanel from "../shared/SlidingWindowTracePanel";
import type { LongestSubstringWithoutRepeatingCharactersTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: LongestSubstringWithoutRepeatingCharactersTraceStep;
}) {
  return (
    <SlidingWindowTracePanel
      step={step}
      description="The trace records character injections, duplicate alarms, left-edge cleanup sweeps, and best-window updates."
    />
  );
}
