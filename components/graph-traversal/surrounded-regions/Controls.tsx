"use client";

type Props = {
  stepIndex: number;
  totalSteps: number;
  mode: "beginner" | "expert";
  onModeChange: (mode: "beginner" | "expert") => void;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  canPrev: boolean;
  canNext: boolean;
};

export default function Controls({
  stepIndex,
  totalSteps,
  mode,
  onModeChange,
  onPrev,
  onNext,
  onReset,
  canPrev,
  canNext,
}: Props) {
  const progress =
    totalSteps <= 1 ? 100 : Math.round((stepIndex / (totalSteps - 1)) * 100);

  return (
    <div className="glass-card p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onPrev}
            disabled={!canPrev}
            className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-5 py-2 text-sm font-medium text-slate-200 transition-all hover:border-cyan-400/50 hover:text-cyan-200 disabled:cursor-not-allowed disabled:border-slate-800 disabled:text-slate-500"
          >
            Prev Step
          </button>

          <button
            onClick={onNext}
            disabled={!canNext}
            className="rounded-xl bg-cyan-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-[0_0_26px_rgba(34,211,238,0.38)] transition-all hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 disabled:shadow-none"
          >
            Next Step
          </button>

          <button
            onClick={onReset}
            className="rounded-xl border border-slate-700/80 bg-slate-950/70 px-5 py-2 text-sm font-medium text-slate-200 transition-all hover:border-emerald-400/50 hover:text-emerald-200"
          >
            Reset
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="rounded-full border border-slate-700/80 bg-slate-950/70 px-4 py-1.5 text-xs text-slate-300">
            Step{" "}
            <span className="font-mono text-slate-50">
              {stepIndex + 1}/{Math.max(totalSteps, 1)}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/70 p-1">
            <button
              onClick={() => onModeChange("beginner")}
              className={`rounded-full px-4 py-1.5 text-xs transition-all ${
                mode === "beginner"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_16px_rgba(34,211,238,0.7)]"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => onModeChange("expert")}
              className={`rounded-full px-4 py-1.5 text-xs transition-all ${
                mode === "expert"
                  ? "bg-slate-100 text-slate-900 shadow-[0_0_16px_rgba(148,163,184,0.7)]"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              Expert
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-slate-500">
          <span>Trace Progress</span>
          <span className="font-mono text-slate-300">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full border border-slate-800 bg-slate-950/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-yellow-300 to-rose-400 shadow-[0_0_18px_rgba(34,211,238,0.28)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
