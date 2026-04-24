import LightTracePanel from "../shared/LightTracePanel";
import type { JumpGameTraceStep } from "./generateTrace";

export default function TracePanel({ step }: { step: JumpGameTraceStep }) {
  return (
    <LightTracePanel
      step={step}
      subtitle="See the frontier expand, hold steady, or fail before the end."
    />
  );
}
