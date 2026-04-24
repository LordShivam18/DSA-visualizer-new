import LightTracePanel from "../shared/LightTracePanel";
import type { StockIITraceStep } from "./generateTrace";

export default function TracePanel({ step }: { step: StockIITraceStep }) {
  return (
    <LightTracePanel
      step={step}
      subtitle="Watch the total profit grow only on positive day-to-day deltas."
    />
  );
}
