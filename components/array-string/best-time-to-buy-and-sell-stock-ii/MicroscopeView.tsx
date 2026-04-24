import LightMicroscopeView from "../shared/LightMicroscopeView";
import type { Mode } from "../shared/types";
import type { StockIITraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: StockIITraceStep;
  mode: Mode;
}) {
  return (
    <LightMicroscopeView
      step={step}
      mode={mode}
      subtitle="Unlimited transactions let us sum each positive daily gain independently."
    />
  );
}
