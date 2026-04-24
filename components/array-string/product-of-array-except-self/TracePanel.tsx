import LightTracePanel from "../shared/LightTracePanel";
import type { ProductExceptSelfTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: ProductExceptSelfTraceStep;
}) {
  return (
    <LightTracePanel
      step={step}
      subtitle="Watch the prefix pass seed each answer slot, then the suffix pass finish it."
    />
  );
}
