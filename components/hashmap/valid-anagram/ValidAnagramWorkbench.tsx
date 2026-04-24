import HashmapWorkbenchBase from "../shared/HashmapWorkbenchBase";
import type { ValidAnagramTraceStep } from "./generateTrace";
import FrequencyDeltaStrip from "./FrequencyDeltaStrip";

export default function ValidAnagramWorkbench({
  step,
}: {
  step: ValidAnagramTraceStep;
}) {
  return (
    <div className="space-y-4">
      <FrequencyDeltaStrip step={step} />
      <HashmapWorkbenchBase
        step={step}
        title="Balance two character multisets with one frequency ledger"
        description="Count every letter in s, then remove letters using t. If all buckets return to zero without ever going negative, the strings are anagrams."
        accent="cyan"
        legend={[
          "Cyan: counting from s",
          "Yellow: consuming from t",
          "Green: balanced or matched",
          "Purple: leftover supply",
          "Red: impossible mismatch",
        ]}
      />
    </div>
  );
}
