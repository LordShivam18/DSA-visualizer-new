import DarkTracePanel from "../shared/DarkTracePanel";
import type { LengthOfLastWordTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: LengthOfLastWordTraceStep;
}) {
  return (
    <DarkTracePanel
      step={step}
      subtitle="Watch the cursor flip from trimming mode into counting mode."
    />
  );
}
