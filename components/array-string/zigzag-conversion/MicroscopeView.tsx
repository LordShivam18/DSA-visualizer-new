import DarkMicroscopeView from "../shared/DarkMicroscopeView";
import type { Mode } from "../shared/types";
import type { ZigzagConversionTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: ZigzagConversionTraceStep;
  mode: Mode;
}) {
  return (
    <DarkMicroscopeView
      step={step}
      mode={mode}
      subtitle="The row pointer oscillates between the top and bottom boundaries before the row buffers are concatenated."
    />
  );
}
