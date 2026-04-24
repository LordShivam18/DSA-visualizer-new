import DarkMicroscopeView from "../shared/DarkMicroscopeView";
import type { Mode } from "../shared/types";
import type { RomanToIntegerTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: RomanToIntegerTraceStep;
  mode: Mode;
}) {
  return (
    <DarkMicroscopeView
      step={step}
      mode={mode}
      subtitle="Roman numerals become integers by turning each symbol into a signed contribution."
    />
  );
}
