import LightTracePanel from "../shared/LightTracePanel";
import type { JumpGameIITraceStep } from "./generateTrace";

export default function TracePanel({ step }: { step: JumpGameIITraceStep }) {
  return (
    <LightTracePanel
      step={step}
      subtitle="Watch the layer boundary close, then see the jump count advance."
    />
  );
}
