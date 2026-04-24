import HashmapMicroscopeView from "../shared/HashmapMicroscopeView";
import type { HashmapMode } from "../shared/types";
import type { TwoSumTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: TwoSumTraceStep;
  mode: HashmapMode;
}) {
  return (
    <HashmapMicroscopeView
      step={step}
      mode={mode}
      description="Zoom in on the complement formula and the past index that satisfies it."
    />
  );
}
