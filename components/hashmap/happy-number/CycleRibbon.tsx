import { chipTone } from "../shared/tone";
import type { HappyNumberTraceStep } from "./generateTrace";

export default function CycleRibbon({
  step,
}: {
  step: HappyNumberTraceStep;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Cycle Guard
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-50">
            The hash set decides whether the sequence is progressing or looping
          </h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs ${chipTone("purple")}`}>
          seen states: {step.state.mapEntries.length}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        Happy Number is really a cycle-detection problem. The set is what turns
        an invisible loop into a visible, teachable state transition graph.
      </p>
    </div>
  );
}
