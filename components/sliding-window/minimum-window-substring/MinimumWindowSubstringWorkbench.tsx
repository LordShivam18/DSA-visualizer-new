import SlidingWindowWorkbenchBase from "../shared/SlidingWindowWorkbenchBase";
import type { MinimumWindowSubstringTraceStep } from "./generateTrace";
import CoverageRadar from "./CoverageRadar";

export default function MinimumWindowSubstringWorkbench({
  step,
}: {
  step: MinimumWindowSubstringTraceStep;
}) {
  return (
    <div className="space-y-4">
      <CoverageRadar step={step} />
      <SlidingWindowWorkbenchBase
        step={step}
        title="Cover the target completely, then tighten until it breaks"
        description="This is the most expressive window in the category: the source rail, the target rail, and the requirement ledger all move in sync while the best answer keeps shrinking."
        accent="emerald"
        legend={[
          "Emerald: fully valid coverage",
          "Cyan: live coverage build",
          "Yellow: best answer so far",
          "Purple: satisfied requirements",
          "Rose: coverage just broke",
        ]}
      />
    </div>
  );
}
