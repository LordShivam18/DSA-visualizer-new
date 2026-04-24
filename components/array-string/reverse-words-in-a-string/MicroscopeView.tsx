import DarkMicroscopeView from "../shared/DarkMicroscopeView";
import type { Mode } from "../shared/types";
import type { ReverseWordsTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: ReverseWordsTraceStep;
  mode: Mode;
}) {
  return (
    <DarkMicroscopeView
      step={step}
      mode={mode}
      subtitle="Whitespace normalization and reverse assembly are separate phases with different invariants."
    />
  );
}
