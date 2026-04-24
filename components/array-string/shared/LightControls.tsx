"use client";

import type { Mode } from "./types";
import { lightPanelClassName } from "./ui";

type Props = {
  stepIndex: number;
  totalSteps: number;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  canPrev: boolean;
  canNext: boolean;
};

export default function LightControls({
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
    <div className={`${lightPanelClassName} p-5`}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onPrev}
            disabled={!canPrev}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition-all hover:border-purple-300 hover:text-violet-700 disabled:cursor-not-allowed disabled:border-slate-100 disabled:bg-slate-50 disabled:text-slate-400"
          >
            Prev Step
          </button>
          <button
            onClick={onNext}
            disabled={!canNext}
            className="rounded-xl border border-cyan-200 bg-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_26px_rgba(34,211,238,0.2)] transition-all hover:-translate-y-0.5 hover:bg-cyan-600 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-200 disabled:text-slate-500 disabled:shadow-none"
          >
            Next Step
          </button>
          <button
            onClick={onReset}
            className="rounded-xl border border-emerald-200 bg-white px-5 py-2 text-sm font-medium text-emerald-700 transition-all hover:border-emerald-300 hover:bg-emerald-50"
          >
            Reset
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs text-slate-600">
            Step{" "}
            <span className="font-mono font-semibold text-slate-800">
              {stepIndex + 1}/{Math.max(totalSteps, 1)}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 p-1">
            <button
              onClick={() => onModeChange("beginner")}
              className={`rounded-full px-4 py-1.5 text-xs transition-all ${
                mode === "beginner"
                  ? "bg-cyan-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.22)]"
                  : "text-slate-600 hover:bg-white"
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => onModeChange("expert")}
              className={`rounded-full px-4 py-1.5 text-xs transition-all ${
                mode === "expert"
                  ? "bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.22)]"
                  : "text-slate-600 hover:bg-white"
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
          <span className="font-mono text-slate-700">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-amber-300 to-emerald-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
