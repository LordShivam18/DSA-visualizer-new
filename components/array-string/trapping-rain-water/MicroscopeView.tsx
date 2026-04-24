import LightMicroscopeView from "../shared/LightMicroscopeView";
import type { Mode } from "../shared/types";
import type { TrappingRainWaterTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: TrappingRainWaterTraceStep;
  mode: Mode;
}) {
  return (
    <LightMicroscopeView
      step={step}
      mode={mode}
      subtitle="The shorter side is safe to settle because the opposite boundary is already tall enough not to be the limiting factor."
    />
  );
}
