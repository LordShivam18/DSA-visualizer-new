"use client";

import { motion } from "framer-motion";

import type { TimelineSpeed } from "@/components/core/animation/TimelineEngine";

import { glassPanelClassName, gentleSpring } from "./theme";
import type { Mode } from "./types";

type Props = {
  stepIndex: number;
  totalSteps: number;
  mode: Mode;
  isPlaying: boolean;
  speed: TimelineSpeed;
  transitionProgress: number;
  onModeChange: (mode: Mode) => void;
  onPlay: () => void;
  onPause: () => void;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  onSpeedChange: (speed: TimelineSpeed) => void;
  canPrev: boolean;
  canNext: boolean;
};

const speeds: TimelineSpeed[] = [0.5, 1, 2];

function controlButtonClassName(kind: "primary" | "secondary" | "ghost") {
  if (kind === "primary") {
    return "border-sky-300 bg-sky-500 text-white shadow-[0_0_30px_rgba(14,165,233,0.24)] hover:bg-sky-600";
  }

  if (kind === "secondary") {
    return "border-violet-300 bg-white/88 text-violet-700 hover:bg-violet-50";
  }

  return "border-slate-200 bg-white/82 text-slate-700 hover:bg-slate-50";
}

export default function Controls({
  stepIndex,
  totalSteps,
  mode,
  isPlaying,
  speed,
  transitionProgress,
  onModeChange,
  onPlay,
  onPause,
  onPrev,
  onNext,
  onReset,
  onSpeedChange,
  canPrev,
  canNext,
}: Props) {
  const progress =
    totalSteps <= 1 ? 100 : Math.round((stepIndex / (totalSteps - 1)) * 100);

  return (
    <motion.section
      layout
      transition={gentleSpring}
      className={`${glassPanelClassName} p-5`}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={isPlaying ? onPause : onPlay}
            className={`rounded-2xl border px-5 py-2.5 text-sm font-semibold transition-all ${controlButtonClassName(
              "primary"
            )}`}
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={onPrev}
            disabled={!canPrev}
            className={`rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-45 ${controlButtonClassName(
              "secondary"
            )}`}
          >
            Prev
          </button>
          <button
            onClick={onNext}
            disabled={!canNext}
            className={`rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-45 ${controlButtonClassName(
              "secondary"
            )}`}
          >
            Next
          </button>
          <button
            onClick={onReset}
            className={`rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all ${controlButtonClassName(
              "ghost"
            )}`}
          >
            Reset
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-slate-200 bg-white/78 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            Step {stepIndex + 1}/{Math.max(totalSteps, 1)}
          </div>

          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/78 p-1">
            {speeds.map((value) => (
              <button
                key={value}
                onClick={() => onSpeedChange(value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  speed === value
                    ? "bg-slate-900 text-white shadow-[0_14px_28px_rgba(15,23,42,0.14)]"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {value}x
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/78 p-1">
            <button
              onClick={() => onModeChange("beginner")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                mode === "beginner"
                  ? "bg-sky-500 text-white shadow-[0_0_22px_rgba(14,165,233,0.24)]"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Beginner
            </button>
            <button
              onClick={() => onModeChange("expert")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                mode === "expert"
                  ? "bg-violet-500 text-white shadow-[0_0_22px_rgba(139,92,246,0.24)]"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Expert
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
          <span>Timeline Progress</span>
          <span className="font-mono text-slate-700">{progress}%</span>
        </div>
        <div className="relative h-3 overflow-hidden rounded-full border border-slate-200 bg-white/75">
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={gentleSpring}
            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-sky-400 via-violet-400 to-emerald-400"
          />
          <motion.div
            animate={{
              opacity: isPlaying ? 1 : 0.45,
              x: `${Math.max(progress - 5, 0)}%`,
              scaleX: Math.max(0.4, transitionProgress),
            }}
            transition={gentleSpring}
            className="absolute inset-y-0 w-[12%] rounded-full bg-white/55 blur-md"
          />
        </div>
      </div>
    </motion.section>
  );
}
