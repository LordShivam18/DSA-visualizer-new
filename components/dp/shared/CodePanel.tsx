"use client";

import { AnimatePresence, motion } from "framer-motion";

import { glassPanelClassName, gentleSpring } from "./theme";
import type { DpTraceStep } from "./types";

export default function CodePanel({
  step,
  lines,
  title = "Code Panel",
  caption = "The highlighted lines are synchronized with the current trace frame.",
  complexity,
}: {
  step: DpTraceStep;
  lines: string[];
  title?: string;
  caption?: string;
  complexity: string[];
}) {
  return (
    <motion.aside
      layout
      transition={gentleSpring}
      className={`${glassPanelClassName} p-5`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-500">
        {title}
      </p>
      <h2 className="mt-2 text-xl font-semibold text-slate-900">{caption}</h2>

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        {complexity.map((entry) => (
          <span
            key={entry}
            className="rounded-full border border-slate-200 bg-white/85 px-3 py-1 text-slate-700"
          >
            {entry}
          </span>
        ))}
      </div>

      <div className="mt-5 rounded-[1.4rem] border border-slate-900/85 bg-slate-950/96 p-4 font-mono text-[12px] leading-6 text-slate-300">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const active = step.codeLines.includes(lineNumber);

          return (
            <motion.div
              layout
              key={lineNumber}
              transition={gentleSpring}
              className={`relative flex gap-4 rounded-xl px-3 py-1 ${
                active ? "bg-amber-400/12 text-white" : ""
              }`}
            >
              <span className="w-6 shrink-0 text-right text-slate-500">
                {lineNumber}
              </span>
              <span className="whitespace-pre">{line || " "}</span>
              <AnimatePresence>
                {active ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={gentleSpring}
                    className="pointer-events-none absolute inset-0 rounded-xl border border-amber-300/45 shadow-[0_0_28px_rgba(245,158,11,0.18)]"
                  />
                ) : null}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-4 rounded-[1.2rem] border border-slate-200 bg-white/78 px-4 py-3 text-sm leading-7 text-slate-700">
        <span className="font-semibold text-slate-900">Why these lines:</span>{" "}
        {step.beginnerNote}
      </div>
    </motion.aside>
  );
}
