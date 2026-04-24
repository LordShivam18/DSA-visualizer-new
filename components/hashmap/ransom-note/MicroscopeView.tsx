import HashmapMicroscopeView from "../shared/HashmapMicroscopeView";
import type { HashmapMode } from "../shared/types";
import type { RansomNoteTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: RansomNoteTraceStep;
  mode: HashmapMode;
}) {
  return (
    <HashmapMicroscopeView
      step={step}
      mode={mode}
      description="Watch the same frequency table switch roles from building supply to consuming demand."
    />
  );
}
