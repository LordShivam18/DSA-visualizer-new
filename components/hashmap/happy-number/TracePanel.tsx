import HashmapTracePanel from "../shared/HashmapTracePanel";
import type { HappyNumberTraceStep } from "./generateTrace";

export default function TracePanel({ step }: { step: HappyNumberTraceStep }) {
  return (
    <HashmapTracePanel
      step={step}
      description="The trace records each stored state, each squared digit contribution, and the exact step where the process reaches 1 or loops."
    />
  );
}
