"use client";

import { motion } from "framer-motion";

import { glassPanelClassName, gentleSpring, toneClasses } from "./theme";
import type { DpTraceStep, Mode } from "./types";

export default function MicroscopeView({
  step,
  mode,
}: {
  step: DpTraceStep;
  mode: Mode;
}) {
  const primaryTone = toneClasses(mode === "beginner" ? "sky" : "violet");

  return (
    <motion.section
      layout
      transition={gentleSpring}
      className={`${glassPanelClassName} p-5`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
        Microscope View
      </p>
      <h2 className="mt-2 text-xl font-semibold text-slate-900">
        {mode === "beginner" ? "What changed in this frame" : "Why this invariant stays valid"}
      </h2>

      <motion.div
        layout
        transition={gentleSpring}
        className={`mt-5 rounded-[1.45rem] border px-5 py-4 ${primaryTone.surface}`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-70">
          {mode === "beginner" ? "Beginner lens" : "Expert lens"}
        </p>
        <p className="mt-3 text-sm leading-7">
          {mode === "beginner" ? step.beginnerNote : step.expertNote}
        </p>
      </motion.div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className="rounded-[1.35rem] border border-slate-200 bg-white/72 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Focus
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-700">{step.focus}</p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {step.metrics.map((metric) => {
              const tone = toneClasses(metric.tone);

              return (
                <div
                  key={metric.label}
                  className={`rounded-[1.1rem] border px-4 py-3 ${tone.surface}`}
                >
                  <p className="text-[11px] uppercase tracking-[0.22em] opacity-70">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-xl font-semibold">{metric.value}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[1.35rem] border border-slate-200 bg-white/72 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Teaching notes
          </p>
          <div className="mt-3 space-y-2">
            {step.hints.map((hint) => (
              <div
                key={hint}
                className="rounded-[1rem] border border-slate-200 bg-slate-50/82 px-4 py-3 text-sm leading-7 text-slate-700"
              >
                {hint}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
