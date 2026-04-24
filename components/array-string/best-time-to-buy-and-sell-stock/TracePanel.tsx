import LightTracePanel from "../shared/LightTracePanel";
import type { StockTraceStep } from "./generateTrace";

export default function TracePanel({ step }: { step: StockTraceStep }) {
  return (
    <LightTracePanel
      step={step}
      subtitle="See when the buy marker moves and when a sell day creates a new best profit."
    />
  );
}
