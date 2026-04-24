import { DarkAccentBanner, darkPanelClassName } from "../shared/darkUi";
import type { FirstOccurrenceTraceStep } from "./generateTrace";
import AlignmentTrack from "./AlignmentTrack";
import MatchLedger from "./MatchLedger";

export default function FirstOccurrenceVisualizer({
  step,
}: {
  step: FirstOccurrenceTraceStep;
}) {
  return (
    <section className={`${darkPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Sliding Alignment Search
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50">
          Test each candidate window until the first full match survives
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
          The haystack stays fixed while the needle slides underneath. Each
          mismatch kills the current window and shifts the search one step right.
        </p>
      </div>

      <div className="mt-5">
        <DarkAccentBanner tone="cyan" title="Search Status">
          Current matched prefix length: <span className="font-mono">{step.state.matched}</span>
        </DarkAccentBanner>
      </div>

      <div className="mt-5 space-y-4">
        <AlignmentTrack step={step} />
        <MatchLedger step={step} />
      </div>
    </section>
  );
}
