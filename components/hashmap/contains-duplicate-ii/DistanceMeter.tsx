import { chipTone } from "../shared/tone";
import type { ContainsDuplicateIITraceStep } from "./generateTrace";

export default function DistanceMeter({
  step,
}: {
  step: ContainsDuplicateIITraceStep;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Distance Meter
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-50">
            Only the gap to the latest occurrence matters
          </h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs ${chipTone("yellow")}`}>
          active value: {step.pointers.focusKey ?? "none"}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        The hash map stores the newest index for each value because it produces
        the smallest possible distance to any future repeat.
      </p>
    </div>
  );
}
