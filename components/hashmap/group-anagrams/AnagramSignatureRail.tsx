import { chipTone } from "../shared/tone";
import type { GroupAnagramsTraceStep } from "./generateTrace";

export default function AnagramSignatureRail({
  step,
}: {
  step: GroupAnagramsTraceStep;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Signature Rail
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-50">
            Sorted characters become the grouping fingerprint
          </h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs ${chipTone("yellow")}`}>
          active signature: {step.pointers.focusKey ?? "none"}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        This visualization makes the core trick explicit: the hash map is keyed
        by a normalized signature, not by the raw word itself.
      </p>
    </div>
  );
}
