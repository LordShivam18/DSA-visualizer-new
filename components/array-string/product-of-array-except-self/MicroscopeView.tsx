import LightMicroscopeView from "../shared/LightMicroscopeView";
import type { Mode } from "../shared/types";
import type { ProductExceptSelfTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: ProductExceptSelfTraceStep;
  mode: Mode;
}) {
  return (
    <LightMicroscopeView
      step={step}
      mode={mode}
      subtitle="The answer slot is first seeded with left context and later multiplied by right context."
    />
  );
}
