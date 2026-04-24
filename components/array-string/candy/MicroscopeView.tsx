import LightMicroscopeView from "../shared/LightMicroscopeView";
import type { Mode } from "../shared/types";
import type { CandyTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: CandyTraceStep;
  mode: Mode;
}) {
  return (
    <LightMicroscopeView
      step={step}
      mode={mode}
      subtitle="The second pass uses max so it can repair descending slopes without undoing the first pass."
    />
  );
}
