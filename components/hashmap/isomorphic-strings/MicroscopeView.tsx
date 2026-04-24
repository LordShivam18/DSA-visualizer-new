import HashmapMicroscopeView from "../shared/HashmapMicroscopeView";
import type { HashmapMode } from "../shared/types";
import type { IsomorphicStringsTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: IsomorphicStringsTraceStep;
  mode: HashmapMode;
}) {
  return (
    <HashmapMicroscopeView
      step={step}
      mode={mode}
      description="Use the microscope to compare the live pair with the two mapping tables."
    />
  );
}
