import LightMicroscopeView from "../shared/LightMicroscopeView";
import type { Mode } from "../shared/types";
import type { RemoveDuplicatesIITraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: RemoveDuplicatesIITraceStep;
  mode: Mode;
}) {
  return (
    <LightMicroscopeView
      step={step}
      mode={mode}
      subtitle="The write-2 lookback is the whole trick behind the at-most-twice constraint."
    />
  );
}
