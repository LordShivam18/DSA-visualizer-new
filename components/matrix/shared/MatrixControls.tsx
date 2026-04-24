"use client";

import type { Mode } from "./types";
import { matrixPanelClassName } from "./ui";

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

export default function MatrixControls({
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
    <div className={`${matrixPanelClassName} p-5`}>
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onPrev}
            disabled={!canPrev}
            className="rounded-xl border border-[#e1d2bb] bg-white px-5 py-2 text-sm font-medium text-stone-700 transition-all hover:border-[#cbb089] hover:text-stone-900 disabled:cursor-not-allowed disabled:border-stone-200 disabled:bg-stone-50 disabled:text-stone-400"
          >
            Prev Step
          </button>
          <button
            onClick={onNext}
            disabled={!canNext}
            className="rounded-xl border border-[#d7be98] bg-[#8eb8cf] px-5 py-2 text-sm font-semibold text-white shadow-[0_14px_28px_rgba(142,184,207,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#7ca8c1] disabled:cursor-not-allowed disabled:border-stone-200 disabled:bg-stone-200 disabled:text-stone-500 disabled:shadow-none"
          >
            Next Step
          </button>
          <button
            onClick={onReset}
            className="rounded-xl border border-[#d7be98] bg-white px-5 py-2 text-sm font-medium text-[#8a6433] transition-all hover:border-[#c5a06a] hover:bg-[#fff5e8]"
          >
            Reset
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="rounded-full border border-[#eadcc8] bg-[#fffaf5] px-4 py-1.5 text-xs text-stone-600">
            Step{" "}
            <span className="font-mono font-semibold text-stone-800">
              {stepIndex + 1}/{Math.max(totalSteps, 1)}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#eadcc8] bg-[#fffaf5] p-1">
            <button
              onClick={() => onModeChange("beginner")}
              className={`rounded-full px-4 py-1.5 text-xs transition-all ${
                mode === "beginner"
                  ? "bg-[#8eb8cf] text-white shadow-[0_10px_20px_rgba(142,184,207,0.28)]"
                  : "text-stone-600 hover:bg-white"
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => onModeChange("expert")}
              className={`rounded-full px-4 py-1.5 text-xs transition-all ${
                mode === "expert"
                  ? "bg-[#8a6433] text-white shadow-[0_10px_20px_rgba(138,100,51,0.2)]"
                  : "text-stone-600 hover:bg-white"
              }`}
            >
              Expert
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-stone-500">
          <span>Trace Progress</span>
          <span className="font-mono text-stone-700">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full border border-[#eadcc8] bg-[#f7eee2]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#d8a55a] via-[#8eb8cf] to-[#77b49b] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
