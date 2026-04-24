import HashmapTracePanel from "../shared/HashmapTracePanel";
import type { IsomorphicStringsTraceStep } from "./generateTrace";

export default function TracePanel({
  step,
}: {
  step: IsomorphicStringsTraceStep;
}) {
  return (
    <HashmapTracePanel
      step={step}
      description="Each trace step freezes either a pair inspection, a mapping insert, or the first contradiction."
    />
  );
}
