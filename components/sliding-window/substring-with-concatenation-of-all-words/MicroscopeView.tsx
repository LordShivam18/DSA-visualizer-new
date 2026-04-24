import SlidingWindowMicroscopeView from "../shared/SlidingWindowMicroscopeView";
import type { SlidingWindowMode } from "../shared/types";
import type { SubstringWithConcatenationOfAllWordsTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: SubstringWithConcatenationOfAllWordsTraceStep;
  mode: SlidingWindowMode;
}) {
  return (
    <SlidingWindowMicroscopeView
      step={step}
      mode={mode}
      description="Zoom in on offset lanes, chunk counts, overflow cleanup, and the exact moment a valid concatenation index is recorded."
    />
  );
}
