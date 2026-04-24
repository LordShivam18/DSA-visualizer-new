import DarkMicroscopeView from "../shared/DarkMicroscopeView";
import type { Mode } from "../shared/types";
import type { TextJustificationTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: TextJustificationTraceStep;
  mode: Mode;
}) {
  return (
    <DarkMicroscopeView
      step={step}
      mode={mode}
      subtitle="Greedy packing decides line membership; justification logic decides how each gap spends the available spaces."
    />
  );
}
