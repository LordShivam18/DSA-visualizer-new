import { DarkAccentBanner, darkPanelClassName } from "../shared/darkUi";
import type { ZigzagConversionTraceStep } from "./generateTrace";
import RowAssembler from "./RowAssembler";
import ZigzagGrid from "./ZigzagGrid";

export default function ZigzagConversionVisualizer({
  step,
}: {
  step: ZigzagConversionTraceStep;
}) {
  return (
    <section className={`${darkPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Zigzag Router
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50">
          Bounce a row cursor down and up through the character stream
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
          The placement grid shows where each character lands. Once every
          character is routed, the row buffers are read top to bottom.
        </p>
      </div>

      <div className="mt-5">
        <DarkAccentBanner tone="cyan" title="Conversion Status">
          Output so far: <span className="font-mono">{step.state.result || "·"}</span>
        </DarkAccentBanner>
      </div>

      <div className="mt-5 space-y-4">
        <ZigzagGrid step={step} />
        <RowAssembler step={step} />
      </div>
    </section>
  );
}
