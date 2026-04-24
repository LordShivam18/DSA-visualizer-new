import HashmapMicroscopeView from "../shared/HashmapMicroscopeView";
import type { HashmapMode } from "../shared/types";
import type { ContainsDuplicateIITraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: ContainsDuplicateIITraceStep;
  mode: HashmapMode;
}) {
  return (
    <HashmapMicroscopeView
      step={step}
      mode={mode}
      description="Watch the current index collide with its last-seen index and turn into a distance check."
    />
  );
}
