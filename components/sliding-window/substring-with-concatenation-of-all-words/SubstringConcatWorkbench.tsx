import SlidingWindowWorkbenchBase from "../shared/SlidingWindowWorkbenchBase";
import type { SubstringWithConcatenationOfAllWordsTraceStep } from "./generateTrace";
import OffsetWave from "./OffsetWave";

export default function SubstringConcatWorkbench({
  step,
}: {
  step: SubstringWithConcatenationOfAllWordsTraceStep;
}) {
  return (
    <div className="space-y-4">
      <OffsetWave step={step} />
      <SlidingWindowWorkbenchBase
        step={step}
        title="Run a word-aligned window on every offset lane"
        description="This workbench visualizes the hard part directly: the algorithm scans fixed-size chunks, not characters, and every offset lane owns its own sliding word window."
        accent="emerald"
        legend={[
          "Emerald: incoming chunk",
          "Cyan: left boundary for this lane",
          "Yellow: latest valid hit",
          "Purple: live aligned chunk window",
          "Rose: overflow cleanup",
        ]}
      />
    </div>
  );
}
