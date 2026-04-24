import HashmapWorkbenchBase from "../shared/HashmapWorkbenchBase";
import type { TwoSumTraceStep } from "./generateTrace";
import ComplementSpotlight from "./ComplementSpotlight";

export default function TwoSumWorkbench({
  step,
}: {
  step: TwoSumTraceStep;
}) {
  return (
    <div className="space-y-4">
      <ComplementSpotlight step={step} />
      <HashmapWorkbenchBase
        step={step}
        title="Ask for the missing complement in one hash lookup"
        description="Each number computes the partner it needs to reach the target. If that partner already exists in the map, the answer is complete immediately."
        accent="cyan"
        legend={[
          "Cyan: current number",
          "Yellow: complement probe",
          "Green: solved pair",
          "Purple: stored history",
          "Red: no pair in custom input",
        ]}
      />
    </div>
  );
}
