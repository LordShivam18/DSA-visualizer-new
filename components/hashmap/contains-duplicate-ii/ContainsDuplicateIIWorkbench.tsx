import HashmapWorkbenchBase from "../shared/HashmapWorkbenchBase";
import type { ContainsDuplicateIITraceStep } from "./generateTrace";
import DistanceMeter from "./DistanceMeter";

export default function ContainsDuplicateIIWorkbench({
  step,
}: {
  step: ContainsDuplicateIITraceStep;
}) {
  return (
    <div className="space-y-4">
      <DistanceMeter step={step} />
      <HashmapWorkbenchBase
        step={step}
        title="Measure duplicate distance with a last-seen index map"
        description="Every repeated value turns into a quick distance calculation. If the gap is at most k, the answer becomes true immediately."
        accent="cyan"
        legend={[
          "Cyan: current index",
          "Yellow: distance probe",
          "Green: qualifying duplicate",
          "Purple: latest stored index",
          "Red: duplicate exists but is too far",
        ]}
      />
    </div>
  );
}
