import HashmapTracePanel from "../shared/HashmapTracePanel";
import type { TwoSumTraceStep } from "./generateTrace";

export default function TracePanel({ step }: { step: TwoSumTraceStep }) {
  return (
    <HashmapTracePanel
      step={step}
      description="The trace alternates between complement lookups and hash-map insertions until a pair appears."
    />
  );
}
