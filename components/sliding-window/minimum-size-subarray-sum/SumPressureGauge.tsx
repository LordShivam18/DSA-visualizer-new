import type { MinimumSizeSubarraySumTraceStep } from "./generateTrace";

function statValue(step: MinimumSizeSubarraySumTraceStep, label: string) {
  return step.state.stats.find((stat) => stat.label === label)?.value ?? "0";
}

export default function SumPressureGauge({
  step,
}: {
  step: MinimumSizeSubarraySumTraceStep;
}) {
  const target = Number(statValue(step, "Target"));
  const sum = Number(statValue(step, "Window Sum"));
  const best = statValue(step, "Best Length");
  const ratio = target > 0 ? Math.min(100, Math.round((sum / target) * 100)) : 0;
  const overTarget = sum >= target;

  return (
    <div className="glass-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Sum Pressure
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-50">
            The live window behaves like a pressure chamber
          </h3>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs ${
            overTarget
              ? "border-emerald-400/35 bg-emerald-500/10 text-emerald-100"
              : "border-cyan-400/35 bg-cyan-500/10 text-cyan-100"
          }`}
        >
          target {target}
        </span>
      </div>

      <div className="mt-5 rounded-[1.1rem] border border-slate-800/80 bg-slate-950/60 p-4">
        <div className="mb-3 flex items-center justify-between text-sm text-slate-300">
          <span>Current sum</span>
          <span className="font-mono text-lg text-slate-50">{sum}</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full border border-slate-800 bg-[#07151b]">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              overTarget
                ? "bg-[linear-gradient(90deg,rgba(52,211,153,0.65),rgba(34,211,238,0.85),rgba(250,204,21,0.75))]"
                : "bg-[linear-gradient(90deg,rgba(6,182,212,0.55),rgba(52,211,153,0.75))]"
            }`}
            style={{ width: `${ratio}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>0</span>
          <span>{overTarget ? "window valid" : "still expanding"}</span>
          <span>{target}</span>
        </div>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-300">
        Once the bar crosses the target, the animation flips from growth mode
        into shrink mode, because that is the only moment when a shorter answer
        can be tested.
      </p>

      <div className="mt-4 rounded-[1rem] border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
        Best length so far: <span className="font-mono text-yellow-200">{best}</span>
      </div>
    </div>
  );
}
