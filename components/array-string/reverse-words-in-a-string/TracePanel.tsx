import DarkTracePanel from "../shared/DarkTracePanel";
import type { ReverseWordsTraceStep } from "./generateTrace";

export default function TracePanel({ step }: { step: ReverseWordsTraceStep }) {
  return (
    <DarkTracePanel
      step={step}
      subtitle="Track the extraction pointer first, then the reverse-build pointer."
    />
  );
}
