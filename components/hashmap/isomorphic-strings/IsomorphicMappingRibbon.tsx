import { chipTone } from "../shared/tone";
import type { IsomorphicStringsTraceStep } from "./generateTrace";

export default function IsomorphicMappingRibbon({
  step,
}: {
  step: IsomorphicStringsTraceStep;
}) {
  const pairs = step.state.mapEntries.filter((entry) => entry.id.startsWith("forward-"));

  return (
    <div className="glass-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Bijection Pulse
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-50">
            Forward and reverse maps must agree at the same time
          </h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs ${chipTone("purple")}`}>
          locked pairs: {pairs.length}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        A single map can miss target collisions. The reverse map is the visual
        proof that no two source characters collapse onto the same destination.
      </p>
    </div>
  );
}
