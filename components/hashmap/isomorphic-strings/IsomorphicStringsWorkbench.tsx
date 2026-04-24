import HashmapWorkbenchBase from "../shared/HashmapWorkbenchBase";
import type { IsomorphicStringsTraceStep } from "./generateTrace";
import IsomorphicMappingRibbon from "./IsomorphicMappingRibbon";

export default function IsomorphicStringsWorkbench({
  step,
}: {
  step: IsomorphicStringsTraceStep;
}) {
  return (
    <div className="space-y-4">
      <IsomorphicMappingRibbon step={step} />
      <HashmapWorkbenchBase
        step={step}
        title="Lock a one-to-one character mapping in both directions"
        description="Every index contributes one pair. The pair is valid only if the old forward mapping and the old reverse claim both agree with it."
        accent="cyan"
        legend={[
          "Cyan: current source character",
          "Yellow: current target character",
          "Green: validated indices",
          "Purple: reverse claims",
          "Red: contradiction",
        ]}
      />
    </div>
  );
}
