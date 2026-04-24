import DarkTracePanel from "../shared/DarkTracePanel";
import type { RomanToIntegerTraceStep } from "./generateTrace";

export default function TracePanel({ step }: { step: RomanToIntegerTraceStep }) {
  return (
    <DarkTracePanel
      step={step}
      subtitle="The trace shows exactly when a glyph adds and when it subtracts."
    />
  );
}
