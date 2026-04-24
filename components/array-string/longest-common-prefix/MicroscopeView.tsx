import DarkMicroscopeView from "../shared/DarkMicroscopeView";
import type { Mode } from "../shared/types";
import type { LongestCommonPrefixTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: LongestCommonPrefixTraceStep;
  mode: Mode;
}) {
  return (
    <DarkMicroscopeView
      step={step}
      mode={mode}
      subtitle="Column-by-column comparison stops at the first failed character or the first exhausted word."
    />
  );
}
