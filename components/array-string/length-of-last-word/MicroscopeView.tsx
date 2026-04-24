import DarkMicroscopeView from "../shared/DarkMicroscopeView";
import type { Mode } from "../shared/types";
import type { LengthOfLastWordTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: LengthOfLastWordTraceStep;
  mode: Mode;
}) {
  return (
    <DarkMicroscopeView
      step={step}
      mode={mode}
      subtitle="A reverse scan avoids splitting the entire string just to find the final word."
    />
  );
}
