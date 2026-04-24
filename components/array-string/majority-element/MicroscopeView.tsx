import LightMicroscopeView from "../shared/LightMicroscopeView";
import type { Mode } from "../shared/types";
import type { MajorityElementTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: MajorityElementTraceStep;
  mode: Mode;
}) {
  return (
    <LightMicroscopeView
      step={step}
      mode={mode}
      subtitle="The vote count represents how much unmatched support the current candidate still has."
    />
  );
}
