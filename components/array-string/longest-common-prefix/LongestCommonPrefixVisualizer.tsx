import { darkPanelClassName } from "../shared/darkUi";
import type { LongestCommonPrefixTraceStep } from "./generateTrace";
import PrefixMatrix from "./PrefixMatrix";
import PrefixRibbon from "./PrefixRibbon";

export default function LongestCommonPrefixVisualizer({
  step,
}: {
  step: LongestCommonPrefixTraceStep;
}) {
  return (
    <section className={`${darkPanelClassName} p-6`}>
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
          Column Scanner
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-50">
          Grow the prefix only after every word passes the current column
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-400">
          The first word acts as the reference rail. A single mismatch or a
          word ending too early immediately freezes the current prefix.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <PrefixRibbon step={step} />
        <PrefixMatrix step={step} />
      </div>
    </section>
  );
}
