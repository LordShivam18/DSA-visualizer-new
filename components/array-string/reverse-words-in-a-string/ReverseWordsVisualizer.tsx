import { DarkAccentBanner, darkPanelClassName } from "../shared/darkUi";
import type { ReverseWordsTraceStep } from "./generateTrace";
import SentenceRibbon from "./SentenceRibbon";
import WordConveyor from "./WordConveyor";

export default function ReverseWordsVisualizer({
  step,
}: {
  step: ReverseWordsTraceStep;
}) {
  return (
    <section className={`${darkPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Token Conveyor
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50">
          Normalize words first, then rebuild from back to front
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
          This view splits the job into a clean extraction conveyor and a
          reverse assembly belt so spacing rules stay easy to reason about.
        </p>
      </div>

      <div className="mt-5">
        <DarkAccentBanner tone="cyan" title="Output Snapshot">
          {step.state.output || "The reversed sentence will appear here once assembly starts."}
        </DarkAccentBanner>
      </div>

      <div className="mt-5 space-y-4">
        <SentenceRibbon step={step} />
        <WordConveyor step={step} />
      </div>
    </section>
  );
}
