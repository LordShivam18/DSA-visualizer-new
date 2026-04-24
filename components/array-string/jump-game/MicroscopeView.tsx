import LightMicroscopeView from "../shared/LightMicroscopeView";
import type { Mode } from "../shared/types";
import type { JumpGameTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: JumpGameTraceStep;
  mode: Mode;
}) {
  return (
    <LightMicroscopeView
      step={step}
      mode={mode}
      subtitle="The scan succeeds as long as every inspected index stays inside the current reachable frontier."
    />
  );
}
