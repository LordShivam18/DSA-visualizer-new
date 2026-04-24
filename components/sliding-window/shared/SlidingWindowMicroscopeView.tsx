import { chipTone } from "./tone";
import type { SlidingWindowMode, SlidingWindowTraceStep } from "./types";

export default function SlidingWindowMicroscopeView({
  step,
  mode,
  description,
}: {
  step: SlidingWindowTraceStep;
  mode: SlidingWindowMode;
  description: string;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.6)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Left
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.left ?? "-"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Right
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.pointers.right ?? "-"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Focus Key
          </p>
          <p className="mt-2 break-words text-xl font-semibold text-yellow-200">
            {step.pointers.focusKey ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Focus Value
          </p>
          <p className="mt-2 break-words text-xl font-semibold text-violet-200">
            {step.pointers.focusValue ?? "none"}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-gradient-to-br from-slate-950/75 via-[#07151b] to-slate-950/70 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {mode === "beginner" ? "What Is Happening" : "Algorithm Invariant"}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          {mode === "beginner"
            ? step.explanationBeginner
            : step.explanationExpert}
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Result Signal
          </p>
          <p className="mt-3 text-lg font-semibold text-slate-50">
            {step.state.resultValue}
          </p>
          {step.state.summary ? (
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {step.state.summary}
            </p>
          ) : null}
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Active Stats
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {step.state.stats.map((stat) => (
              <span
                key={stat.label}
                className={`rounded-full border px-3 py-1 text-xs ${chipTone(
                  stat.tone ?? "slate"
                )}`}
              >
                {stat.label}: {stat.value}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
