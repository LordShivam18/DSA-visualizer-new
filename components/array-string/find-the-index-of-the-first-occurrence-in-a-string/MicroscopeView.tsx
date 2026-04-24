import DarkMicroscopeView from "../shared/DarkMicroscopeView";
import type { Mode } from "../shared/types";
import type { FirstOccurrenceTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: FirstOccurrenceTraceStep;
  mode: Mode;
}) {
  return (
    <DarkMicroscopeView
      step={step}
      mode={mode}
      subtitle="The naive matcher keeps only one active candidate window and one matched-prefix counter at a time."
    />
  );
}
