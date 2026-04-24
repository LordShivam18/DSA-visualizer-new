import SlidingWindowMicroscopeView from "../shared/SlidingWindowMicroscopeView";
import type { SlidingWindowMode } from "../shared/types";
import type { LongestSubstringWithoutRepeatingCharactersTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: LongestSubstringWithoutRepeatingCharactersTraceStep;
  mode: SlidingWindowMode;
}) {
  return (
    <SlidingWindowMicroscopeView
      step={step}
      mode={mode}
      description="Zoom in on the duplicate that broke the invariant and the cleanup steps that repair the window."
    />
  );
}
