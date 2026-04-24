import HashmapWorkbenchBase from "../shared/HashmapWorkbenchBase";
import type { HappyNumberTraceStep } from "./generateTrace";
import CycleRibbon from "./CycleRibbon";

export default function HappyNumberWorkbench({
  step,
}: {
  step: HappyNumberTraceStep;
}) {
  return (
    <div className="space-y-4">
      <CycleRibbon step={step} />
      <HashmapWorkbenchBase
        step={step}
        title="Use a hash set to separate convergence from cycles"
        description="Each state expands into squared digits, then the set checks whether that new state is fresh or repeated. Reaching 1 is success; repeating a state means a loop."
        accent="cyan"
        legend={[
          "Cyan: current state",
          "Yellow: active digit",
          "Green: squared contribution or success",
          "Purple: seen states",
          "Red: repeated cycle state",
        ]}
      />
    </div>
  );
}
