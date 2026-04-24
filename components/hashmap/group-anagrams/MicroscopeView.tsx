import HashmapMicroscopeView from "../shared/HashmapMicroscopeView";
import type { HashmapMode } from "../shared/types";
import type { GroupAnagramsTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: GroupAnagramsTraceStep;
  mode: HashmapMode;
}) {
  return (
    <HashmapMicroscopeView
      step={step}
      mode={mode}
      description="Watch the current word become a canonical key and then expand its bucket."
    />
  );
}
