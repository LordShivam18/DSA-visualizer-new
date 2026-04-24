import LightTracePanel from "../shared/LightTracePanel";
import type { HIndexTraceStep } from "./generateTrace";

export default function TracePanel({ step }: { step: HIndexTraceStep }) {
  return (
    <LightTracePanel
      step={step}
      subtitle="Watch h grow while the threshold holds, then freeze at the first failure."
    />
  );
}
