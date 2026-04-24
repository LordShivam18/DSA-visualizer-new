import DarkTracePanel from "../shared/DarkTracePanel";
import type { ZigzagConversionTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: ZigzagConversionTraceStep;
}) {
  return (
    <DarkTracePanel
      step={step}
      subtitle="See when the row pointer turns around and when the row readout begins."
    />
  );
}
