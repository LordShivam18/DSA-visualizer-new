import DarkTracePanel from "../shared/DarkTracePanel";
import type { TextJustificationTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: TextJustificationTraceStep;
}) {
  return (
    <DarkTracePanel
      step={step}
      subtitle="Track the pack phase, the spacing phase, and the commit phase for every line."
    />
  );
}
