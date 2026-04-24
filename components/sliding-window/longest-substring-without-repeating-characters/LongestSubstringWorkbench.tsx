import SlidingWindowWorkbenchBase from "../shared/SlidingWindowWorkbenchBase";
import type { LongestSubstringWithoutRepeatingCharactersTraceStep } from "./generateTrace";
import DuplicateRadar from "./DuplicateRadar";

export default function LongestSubstringWorkbench({
  step,
}: {
  step: LongestSubstringWithoutRepeatingCharactersTraceStep;
}) {
  return (
    <div className="space-y-4">
      <DuplicateRadar step={step} />
      <SlidingWindowWorkbenchBase
        step={step}
        title="Inject from the right, purge duplicates from the left"
        description="The live substring expands one character at a time. Any repeat turns the window red until the left edge sweeps enough characters away to restore uniqueness."
        accent="emerald"
        legend={[
          "Emerald: right-edge injection",
          "Cyan: left-edge cleanup",
          "Yellow: best unique substring",
          "Purple: live unique interior",
          "Rose: duplicate under pressure",
        ]}
      />
    </div>
  );
}
