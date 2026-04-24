import HashmapWorkbenchBase from "../shared/HashmapWorkbenchBase";
import type { GroupAnagramsTraceStep } from "./generateTrace";
import AnagramSignatureRail from "./AnagramSignatureRail";

export default function GroupAnagramsWorkbench({
  step,
}: {
  step: GroupAnagramsTraceStep;
}) {
  return (
    <div className="space-y-4">
      <AnagramSignatureRail step={step} />
      <HashmapWorkbenchBase
        step={step}
        title="Cluster words by their canonical sorted signature"
        description="Every word is normalized into a signature key. Buckets sharing the same key become the final anagram groups."
        accent="cyan"
        legend={[
          "Cyan: current word",
          "Yellow: active signature key",
          "Green: words already bucketed",
          "Purple: existing groups",
          "Red: reserved for impossible states",
        ]}
      />
    </div>
  );
}
