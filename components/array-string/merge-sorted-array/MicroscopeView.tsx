import LightMicroscopeView from "../shared/LightMicroscopeView";
import type { Mode } from "../shared/types";
import type { MergeSortedArrayTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: MergeSortedArrayTraceStep;
  mode: Mode;
}) {
  return (
    <LightMicroscopeView
      step={step}
      mode={mode}
      title="Microscope View"
      subtitle="Track why each tail value claims the current write slot."
    />
  );
}
