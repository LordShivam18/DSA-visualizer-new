import LightMicroscopeView from "../shared/LightMicroscopeView";
import type { Mode } from "../shared/types";
import type { HIndexTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: HIndexTraceStep;
  mode: Mode;
}) {
  return (
    <LightMicroscopeView
      step={step}
      mode={mode}
      subtitle="Descending order turns h-index into a monotone threshold test."
    />
  );
}
