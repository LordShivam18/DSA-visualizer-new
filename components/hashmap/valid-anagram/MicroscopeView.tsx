import HashmapMicroscopeView from "../shared/HashmapMicroscopeView";
import type { HashmapMode } from "../shared/types";
import type { ValidAnagramTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: ValidAnagramTraceStep;
  mode: HashmapMode;
}) {
  return (
    <HashmapMicroscopeView
      step={step}
      mode={mode}
      description="Focus on how each decrement changes the frequency difference between the two strings."
    />
  );
}
