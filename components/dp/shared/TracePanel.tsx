"use client";

import { motion } from "framer-motion";

import { glassPanelClassName, gentleSpring, toneClasses } from "./theme";
import type { DpTraceStep } from "./types";

function MetricPill({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone?: DpTraceStep["actionTone"];
}) {
  const resolvedTone = toneClasses(tone);

  return (
    <motion.div
      layout
      transition={gentleSpring}
      className={`rounded-[1.15rem] border px-4 py-3 ${resolvedTone.surface}`}
    >
      <p className="text-[11px] uppercase tracking-[0.22em] opacity-70">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </motion.div>
  );
}

export default function TracePanel({ step }: { step: DpTraceStep }) {
  const actionTone = toneClasses(step.actionTone);

  return (
    <motion.aside
      layout
      transition={gentleSpring}
      className={`${glassPanelClassName} p-5`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
            Trace Panel
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">
            {step.action}
          </h2>
        </div>
        <span
          className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${actionTone.soft}`}
        >
          {step.actionKind}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-slate-200 bg-white/85 px-3 py-1 text-slate-700">
          Animation: {step.animation.type}
        </span>
        <span className="rounded-full border border-slate-200 bg-white/85 px-3 py-1 text-slate-700">
          Targets: {step.animation.targets.length > 0 ? step.animation.targets.join(", ") : "none"}
        </span>
        <span
          className={`rounded-full border px-3 py-1 ${
            step.done
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-violet-200 bg-violet-50 text-violet-700"
          }`}
        >
          {step.done ? "Resolved" : "In Flight"}
        </span>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {step.metrics.map((metric) => (
          <MetricPill
            key={metric.label}
            label={metric.label}
            value={metric.value}
            tone={metric.tone}
          />
        ))}
      </div>

      <div className="mt-5 rounded-[1.35rem] border border-slate-200 bg-white/70 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Active Pointers
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {step.pointerChips.length > 0 ? (
            step.pointerChips.map((chip) => {
              const chipTone = toneClasses(chip.tone);

              return (
                <span
                  key={`${chip.label}-${chip.value}`}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium ${chipTone.surface}`}
                >
                  {chip.label}: <span className="font-mono">{chip.value}</span>
                </span>
              );
            })
          ) : (
            <span className="rounded-full border border-dashed border-slate-200 px-3 py-1.5 text-sm text-slate-500">
              No active pointers in this frame.
            </span>
          )}
        </div>
      </div>

      <div className="mt-5 rounded-[1.35rem] border border-slate-200 bg-gradient-to-br from-white/90 to-sky-50/80 p-4 text-sm leading-7 text-slate-700">
        <span className="font-semibold text-slate-900">Expert invariant:</span>{" "}
        {step.expertNote}
      </div>
    </motion.aside>
  );
}
