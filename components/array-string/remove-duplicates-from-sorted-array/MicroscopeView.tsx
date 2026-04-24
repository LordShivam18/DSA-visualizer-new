import LightMicroscopeView from "../shared/LightMicroscopeView";
import type { Mode } from "../shared/types";
import type { RemoveDuplicatesTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: RemoveDuplicatesTraceStep;
  mode: Mode;
}) {
  return (
    <LightMicroscopeView
      step={step}
      mode={mode}
      subtitle="Because the array is sorted, one comparison is enough to detect a duplicate."
    />
  );
}
