import HashmapTracePanel from "../shared/HashmapTracePanel";
import type { WordPatternTraceStep } from "./generateTrace";

export default function TracePanel({ step }: { step: WordPatternTraceStep }) {
  return (
    <HashmapTracePanel
      step={step}
      description="The trace records each letter-word comparison and the exact moment the bijection would break."
    />
  );
}
