import LightMicroscopeView from "../shared/LightMicroscopeView";
import type { Mode } from "../shared/types";
import type { JumpGameIITraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: JumpGameIITraceStep;
  mode: Mode;
}) {
  return (
    <LightMicroscopeView
      step={step}
      mode={mode}
      subtitle="Each jump commits a whole BFS layer, not just one locally attractive index."
    />
  );
}
