import LightTracePanel from "../shared/LightTracePanel";
import type { GasStationTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: GasStationTraceStep;
}) {
  return (
    <LightTracePanel
      step={step}
      subtitle="Track how the running tank, total balance, and start candidate evolve."
    />
  );
}
