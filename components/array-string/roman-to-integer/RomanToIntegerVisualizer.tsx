import { DarkAccentBanner, DarkMetricGrid, darkPanelClassName } from "../shared/darkUi";
import type { RomanToIntegerTraceStep } from "./generateTrace";
import ContributionRail from "./ContributionRail";
import RomanGlyphStrip from "./RomanGlyphStrip";

export default function RomanToIntegerVisualizer({
  step,
}: {
  step: RomanToIntegerTraceStep;
}) {
  return (
    <section className={`${darkPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Lookahead Roman Decoder
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50">
          Decide add or subtract one symbol at a time
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
          This visualizer treats each glyph as a signed contribution. The
          lookahead glow makes subtractive pairs like IV, IX, XL, XC, CD, and
          CM easy to spot.
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_280px]">
        <DarkAccentBanner tone="cyan" title="Decoded So Far">
          Running total: <span className="font-mono">{step.state.total}</span>
        </DarkAccentBanner>
        <DarkMetricGrid items={step.metrics} columns="grid-cols-1" />
      </div>

      <div className="mt-5 space-y-4">
        <RomanGlyphStrip step={step} />
        <ContributionRail step={step} />
      </div>
    </section>
  );
}
