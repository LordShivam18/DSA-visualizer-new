import { DarkAccentBanner, darkPanelClassName } from "../shared/darkUi";
import type { LengthOfLastWordTraceStep } from "./generateTrace";
import CharacterRunway from "./CharacterRunway";
import LastWordGauge from "./LastWordGauge";

export default function LengthOfLastWordVisualizer({
  step,
}: {
  step: LengthOfLastWordTraceStep;
}) {
  return (
    <section className={`${darkPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Tail-Word Scanner
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50">
          Trim the suffix, then count the final word backward
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
          The cursor moves from right to left. First it burns off trailing
          spaces, then it lights up the exact word whose length we need.
        </p>
      </div>

      <div className="mt-5">
        <DarkAccentBanner tone="cyan" title="Suffix Snapshot">
          Active last word: <span className="font-mono">{step.state.lastWord || "-"}</span>
        </DarkAccentBanner>
      </div>

      <div className="mt-5 space-y-4">
        <LastWordGauge step={step} />
        <CharacterRunway step={step} />
      </div>
    </section>
  );
}
