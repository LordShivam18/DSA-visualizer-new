import { chipTone } from "../shared/tone";
import type { LongestConsecutiveSequenceTraceStep } from "./generateTrace";

export default function SequenceRunway({
  step,
}: {
  step: LongestConsecutiveSequenceTraceStep;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Start Detector
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-50">
            A number matters only if its predecessor is missing
          </h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs ${chipTone("green")}`}>
          best length: {step.state.resultValue === "building" ? "-" : step.state.resultValue}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        The set does two jobs: it removes duplicates up front and lets the
        algorithm skip every number that cannot possibly start a fresh run.
      </p>
    </div>
  );
}
