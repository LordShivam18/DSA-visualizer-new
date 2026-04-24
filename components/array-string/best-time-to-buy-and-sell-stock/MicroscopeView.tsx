import LightMicroscopeView from "../shared/LightMicroscopeView";
import type { Mode } from "../shared/types";
import type { StockTraceStep } from "./generateTrace";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: StockTraceStep;
  mode: Mode;
}) {
  return (
    <LightMicroscopeView
      step={step}
      mode={mode}
      subtitle="The minimum-so-far invariant turns a two-day search into one linear pass."
    />
  );
}
