import DarkTracePanel from "../shared/DarkTracePanel";
import type { IntegerToRomanTraceStep } from "./generateTrace";

export default function TracePanel({ step }: { step: IntegerToRomanTraceStep }) {
  return (
    <DarkTracePanel
      step={step}
      subtitle="Follow the denomination pointer as it walks down the Roman table."
    />
  );
}
