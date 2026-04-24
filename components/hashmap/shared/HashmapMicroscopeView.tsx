import { chipTone } from "./tone";
import type { HashmapMode, HashmapTraceStep } from "./types";

type Props = {
  step: HashmapTraceStep;
  mode: HashmapMode;
  description: string;
};

export default function HashmapMicroscopeView({
  step,
  mode,
  description,
}: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Primary Index
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.primaryIndex ?? "-"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Secondary Index
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.secondaryIndex ?? "-"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Key Probe
          </p>
          <p className="mt-2 break-words text-2xl font-semibold text-yellow-200">
            {step.pointers.focusKey ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Value Probe
          </p>
          <p className="mt-2 break-words text-2xl font-semibold text-emerald-200">
            {step.pointers.focusValue ?? "none"}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-gradient-to-br from-slate-950/70 via-[#07111f] to-slate-950/65 p-4">
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
