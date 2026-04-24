import { chipTone } from "../shared/tone";
import type { TwoSumTraceStep } from "./generateTrace";

export default function ComplementSpotlight({
  step,
}: {
  step: TwoSumTraceStep;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Complement Spotlight
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-50">
            The current value asks for exactly one missing partner
          </h3>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs ${chipTone("yellow")}`}>
          need: {step.pointers.focusKey ?? "none"}
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-300">
        The hash map turns the missing-partner search into a direct lookup, so
        the visual story is always current number to needed complement to a
        past index.
      </p>
    </div>
  );
}
