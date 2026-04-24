import { chipTone } from "../shared/tone";
import type { ValidAnagramTraceStep } from "./generateTrace";

export default function FrequencyDeltaStrip({
  step,
}: {
  step: ValidAnagramTraceStep;
}) {
  const balanced = step.state.mapEntries.filter(
    (entry) => Number(entry.value) === 0
  ).length;

  return (
    <div className="glass-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Balance Meter
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-50">
            Anagrams keep driving every bucket back to zero
          </h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs ${chipTone("green")}`}>
          zero buckets: {balanced}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        Positive counts mean s still has unmatched supply. A negative count
        would mean t asked for more than s could provide.
      </p>
    </div>
  );
}
