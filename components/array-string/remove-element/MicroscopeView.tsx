import LightMicroscopeView from "../shared/LightMicroscopeView";
import type { Mode } from "../shared/types";
import type { RemoveElementTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: RemoveElementTraceStep;
  mode: Mode;
}) {
  return (
    <LightMicroscopeView
      step={step}
      mode={mode}
      subtitle="The write pointer explains the entire answer prefix."
    />
  );
}
