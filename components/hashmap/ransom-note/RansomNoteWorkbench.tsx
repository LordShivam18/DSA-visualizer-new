import HashmapWorkbenchBase from "../shared/HashmapWorkbenchBase";
import type { RansomNoteTraceStep } from "./generateTrace";
import RansomLetterBank from "./RansomLetterBank";

export default function RansomNoteWorkbench({
  step,
}: {
  step: RansomNoteTraceStep;
}) {
  return (
    <div className="space-y-4">
      <RansomLetterBank step={step} />
      <HashmapWorkbenchBase
        step={step}
        title="Spend a character bank without reusing letters"
        description="The magazine fills a frequency table first. The ransom note then withdraws letters from that bank, and any missing count ends the run immediately."
        accent="cyan"
        legend={[
          "Cyan: counting supply",
          "Yellow: checking a needed letter",
          "Green: already matched",
          "Purple: extra hash-map context",
          "Red: construction breaks here",
        ]}
      />
    </div>
  );
}
