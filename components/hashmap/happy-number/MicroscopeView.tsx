import HashmapMicroscopeView from "../shared/HashmapMicroscopeView";
import type { HashmapMode } from "../shared/types";
import type { HappyNumberTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: HappyNumberTraceStep;
  mode: HashmapMode;
}) {
  return (
    <HashmapMicroscopeView
      step={step}
      mode={mode}
      description="Watch the digit-square transform and the seen-set cycle guard work together."
    />
  );
}
