import { DarkAccentBanner, darkPanelClassName } from "../shared/darkUi";
import type { TextJustificationTraceStep } from "./generateTrace";
import LineComposer from "./LineComposer";
import OutputLinesBoard from "./OutputLinesBoard";

export default function TextJustificationVisualizer({
  step,
}: {
  step: TextJustificationTraceStep;
}) {
  return (
    <section className={`${darkPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Line Packing Studio
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50">
          Greedily fill a line, then allocate its spaces explicitly
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
          This view separates greedy word packing from gap distribution so the
          spacing rules for full justification and the last line stay visible.
        </p>
      </div>

      <div className="mt-5">
        <DarkAccentBanner tone="cyan" title="Formatting Status">
          Built lines: <span className="font-mono">{step.state.builtLines.length}</span>
          <br />
          Phase: <span className="font-mono">{step.state.phase}</span>
        </DarkAccentBanner>
      </div>

      <div className="mt-5 space-y-4">
        <LineComposer step={step} />
        <OutputLinesBoard step={step} />
      </div>
    </section>
  );
}
