import { chipTone } from "../shared/tone";
import type { RansomNoteTraceStep } from "./generateTrace";

export default function RansomLetterBank({
  step,
}: {
  step: RansomNoteTraceStep;
}) {
  const available = step.state.mapEntries.filter(
    (entry) => Number(entry.value) > 0
  ).length;
  const drained = step.state.mapEntries.length - available;

  return (
    <div className="glass-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Letter Bank Pulse
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-50">
            Supply survives only while counts stay above zero
          </h3>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className={`rounded-full border px-3 py-1 ${chipTone("green")}`}>
            Positive buckets: {available}
          </span>
          <span className={`rounded-full border px-3 py-1 ${chipTone("red")}`}>
            Drained buckets: {drained}
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        The magazine and the ransom note can reuse the same character key, but
        not the same physical copy. That is why each successful match visibly
        lowers the bucket count.
      </p>
    </div>
  );
}
