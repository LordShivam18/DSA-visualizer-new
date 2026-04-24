import { DarkAccentBanner, DarkMetricGrid, darkPanelClassName } from "../shared/darkUi";
import type { IntegerToRomanTraceStep } from "./generateTrace";
import DenominationBoard from "./DenominationBoard";
import RomanBuilderStrip from "./RomanBuilderStrip";

export default function IntegerToRomanVisualizer({
  step,
}: {
  step: IntegerToRomanTraceStep;
}) {
  return (
    <section className={`${darkPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Greedy Roman Mint
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50">
          Strip the largest legal Roman fragment from the remainder
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
          The numeral grows from left to right while the remainder shrinks. The
          active denomination board makes each greedy choice explicit.
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_280px]">
        <DarkAccentBanner tone="cyan" title="Conversion Status">
          Remaining value: <span className="font-mono">{step.state.remaining}</span>
          <br />
          Output so far: <span className="font-mono">{step.state.output || "-"}</span>
        </DarkAccentBanner>
        <DarkMetricGrid items={step.metrics} columns="grid-cols-1" />
      </div>

      <div className="mt-5 space-y-4">
        <DenominationBoard step={step} />
        <RomanBuilderStrip step={step} />
      </div>
    </section>
  );
}
