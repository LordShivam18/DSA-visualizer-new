import HashmapMicroscopeView from "../shared/HashmapMicroscopeView";
import type { HashmapMode } from "../shared/types";
import type { LongestConsecutiveSequenceTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: LongestConsecutiveSequenceTraceStep;
  mode: HashmapMode;
}) {
  return (
    <HashmapMicroscopeView
      step={step}
      mode={mode}
      description="Zoom in on predecessor checks, run expansion, and best-run updates."
    />
  );
}
