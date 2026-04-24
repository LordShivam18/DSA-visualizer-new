import { chipTone } from "../shared/tone";
import type { WordPatternTraceStep } from "./generateTrace";

export default function PatternBridge({
  step,
}: {
  step: WordPatternTraceStep;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Word Bridge
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-50">
            Pattern letters and words must cross the bridge one-to-one
          </h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs ${chipTone("yellow")}`}>
          focus word: {step.pointers.focusValue ?? "none"}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        This is the same bijection idea as isomorphic strings, but now the
        right side contains full words instead of single characters.
      </p>
    </div>
  );
}
