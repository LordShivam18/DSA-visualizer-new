import LightMicroscopeView from "../shared/LightMicroscopeView";
import type { Mode } from "../shared/types";
import type { RotateArrayTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: RotateArrayTraceStep;
  mode: Mode;
}) {
  return (
    <LightMicroscopeView
      step={step}
      mode={mode}
      subtitle="Each reversal phase has its own job in reconstructing the rotated order."
    />
  );
}
