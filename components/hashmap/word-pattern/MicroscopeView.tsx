import HashmapMicroscopeView from "../shared/HashmapMicroscopeView";
import type { HashmapMode } from "../shared/types";
import type { WordPatternTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: WordPatternTraceStep;
  mode: HashmapMode;
}) {
  return (
    <HashmapMicroscopeView
      step={step}
      mode={mode}
      description="Zoom in on how a letter-word pair interacts with the bidirectional mapping tables."
    />
  );
}
