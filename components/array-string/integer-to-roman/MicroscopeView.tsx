import DarkMicroscopeView from "../shared/DarkMicroscopeView";
import type { Mode } from "../shared/types";
import type { IntegerToRomanTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: IntegerToRomanTraceStep;
  mode: Mode;
}) {
  return (
    <DarkMicroscopeView
      step={step}
      mode={mode}
      subtitle="The greedy Roman denomination table already includes subtractive forms like CM, XC, and IV."
    />
  );
}
