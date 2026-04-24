import SlidingWindowMicroscopeView from "../shared/SlidingWindowMicroscopeView";
import type { SlidingWindowMode } from "../shared/types";
import type { MinimumWindowSubstringTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: MinimumWindowSubstringTraceStep;
  mode: SlidingWindowMode;
}) {
  return (
    <SlidingWindowMicroscopeView
      step={step}
      mode={mode}
      description="Zoom in on formed/required, the need-vs-have ledger, and the exact character that makes the window valid or invalid."
    />
  );
}
