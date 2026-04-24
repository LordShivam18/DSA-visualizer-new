import HashmapWorkbenchBase from "../shared/HashmapWorkbenchBase";
import type { LongestConsecutiveSequenceTraceStep } from "./generateTrace";
import SequenceRunway from "./SequenceRunway";

export default function LongestConsecutiveSequenceWorkbench({
  step,
}: {
  step: LongestConsecutiveSequenceTraceStep;
}) {
  return (
    <div className="space-y-4">
      <SequenceRunway step={step} />
      <HashmapWorkbenchBase
        step={step}
        title="Expand only predecessor-free starts inside the hash set"
        description="After deduplicating into a set, each number checks whether it can start a run. Only predecessor-free values expand forward, which keeps the whole search linear."
        accent="cyan"
        legend={[
          "Cyan: current value or run",
          "Yellow: start check",
          "Green: best run",
          "Purple: set membership",
          "Red: reserved for invalid states",
        ]}
      />
    </div>
  );
}
