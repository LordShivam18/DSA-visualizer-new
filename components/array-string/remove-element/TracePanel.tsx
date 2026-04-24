import LightTracePanel from "../shared/LightTracePanel";
import type { RemoveElementTraceStep } from "./generateTrace";

export default function TracePanel({ step }: { step: RemoveElementTraceStep }) {
  return (
    <LightTracePanel
      step={step}
      subtitle="See exactly when a value joins the kept prefix or gets discarded."
    />
  );
}
