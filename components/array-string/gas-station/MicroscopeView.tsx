import LightMicroscopeView from "../shared/LightMicroscopeView";
import type { Mode } from "../shared/types";
import type { GasStationTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: GasStationTraceStep;
  mode: Mode;
}) {
  return (
    <LightMicroscopeView
      step={step}
      mode={mode}
      subtitle="A negative tank wipes out the whole current segment as a possible starting range."
    />
  );
}
