import HashmapWorkbenchBase from "../shared/HashmapWorkbenchBase";
import type { WordPatternTraceStep } from "./generateTrace";
import PatternBridge from "./PatternBridge";

export default function WordPatternWorkbench({
  step,
}: {
  step: WordPatternTraceStep;
}) {
  return (
    <div className="space-y-4">
      <PatternBridge step={step} />
      <HashmapWorkbenchBase
        step={step}
        title="Keep a bijection between pattern symbols and words"
        description="At each position, the current letter and the current word must agree with both hash maps. Any collision or reassignment ends the trace."
        accent="cyan"
        legend={[
          "Cyan: active pattern symbol",
          "Yellow: active word",
          "Green: confirmed pair",
          "Purple: reverse lookup",
          "Red: mismatch point",
        ]}
      />
    </div>
  );
}
