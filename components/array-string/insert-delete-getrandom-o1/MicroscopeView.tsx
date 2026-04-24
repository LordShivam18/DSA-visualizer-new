import LightMicroscopeView from "../shared/LightMicroscopeView";
import type { Mode } from "../shared/types";
import type { RandomizedSetTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: RandomizedSetTraceStep;
  mode: Mode;
}) {
  return (
    <LightMicroscopeView
      step={step}
      mode={mode}
      subtitle="The only invariant that matters is array-index consistency between the dense array and the hashmap."
    />
  );
}
