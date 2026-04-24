import DarkTracePanel from "../shared/DarkTracePanel";
import type { LongestCommonPrefixTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: LongestCommonPrefixTraceStep;
}) {
  return (
    <DarkTracePanel
      step={step}
      subtitle="The trace captures which word is being tested against the active column."
    />
  );
}
