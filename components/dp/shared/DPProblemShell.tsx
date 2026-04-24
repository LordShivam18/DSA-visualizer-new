"use client";

import { motion } from "framer-motion";

import LightBackLink from "@/components/array-string/shared/LightBackLink";

import { glassPanelClassName, gentleSpring } from "./theme";
import type { DpProblemShellProps } from "./types";

function difficultyClasses(difficulty: DpProblemShellProps["difficulty"]) {
  if (difficulty === "Easy") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (difficulty === "Medium") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-rose-200 bg-rose-50 text-rose-700";
}

export default function DPProblemShell({
  categoryHref,
  categoryLabel,
  taxonomy,
  title,
  difficulty,
  description,
  complexity,
  inputFields,
  inputValues,
  onInputChange,
  onRun,
  presets,
  onPreset,
  step,
  mode,
  controls,
  visualization,
  microscope,
  tracePanel,
  codePanel,
  output,
}: DpProblemShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#fcfdff_0%,#f1f7ff_40%,#f6f0ff_100%)] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(125,211,252,0.25),transparent_28%),radial-gradient(circle_at_top_right,rgba(196,181,253,0.24),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(110,231,183,0.18),transparent_30%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <LightBackLink href={categoryHref} label={categoryLabel} />
        </div>

        <header className="mx-auto flex w-full max-w-5xl flex-col items-center gap-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-500">
            {taxonomy}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              <span className="bg-gradient-to-r from-sky-600 via-violet-600 to-emerald-600 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${difficultyClasses(
                difficulty
              )}`}
            >
              {difficulty}
            </span>
          </div>

          <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            {description}
          </p>

          <div className="rounded-full border border-white/80 bg-white/82 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
            {complexity}
          </div>
        </header>

        <motion.section
          layout
          transition={gentleSpring}
          className={`${glassPanelClassName} mx-auto w-full max-w-5xl p-5`}
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="h-5 w-1.5 rounded-full bg-sky-400" />
            <h2 className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-800">
              Inputs
            </h2>
          </div>

          <div className="mb-5 flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => onPreset(preset)}
                className="rounded-full border border-slate-200 bg-white/82 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:-translate-y-0.5 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
              >
                {preset.name}
                {preset.summary ? (
                  <span className="ml-1 font-normal text-slate-500">- {preset.summary}</span>
                ) : null}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {inputFields.map((field) => (
              <label key={field.key} className="block text-sm font-medium text-slate-700">
                <span>{field.label}</span>
                {field.help ? (
                  <span className="mt-1 block text-xs font-normal text-slate-500">
                    {field.help}
                  </span>
                ) : null}
                {field.multiline ? (
                  <textarea
                    value={inputValues[field.key] ?? ""}
                    rows={field.rows ?? 4}
                    onChange={(event) => onInputChange(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    className="mt-2 min-h-[120px] w-full rounded-[1.2rem] border border-slate-200 bg-white/82 px-4 py-3 font-mono text-sm text-slate-800 outline-none transition-all focus:border-sky-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(14,165,233,0.1)]"
                  />
                ) : (
                  <input
                    value={inputValues[field.key] ?? ""}
                    onChange={(event) => onInputChange(field.key, event.target.value)}
                    placeholder={field.placeholder}
                    className="mt-2 h-12 w-full rounded-[1.2rem] border border-slate-200 bg-white/82 px-4 py-3 font-mono text-sm text-slate-800 outline-none transition-all focus:border-sky-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(14,165,233,0.1)]"
                  />
                )}
              </label>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
            <span>JSON arrays and lightweight CSV input both work here.</span>
            <button
              onClick={onRun}
              className="rounded-2xl border border-sky-300 bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(14,165,233,0.24)] transition-all hover:-translate-y-0.5 hover:bg-sky-600"
            >
              Run Visualization
            </button>
          </div>
        </motion.section>

        <motion.div
          layout
          transition={gentleSpring}
          className="mx-auto w-full max-w-5xl rounded-[1.55rem] border border-white/78 bg-white/82 px-6 py-4 text-center text-sm leading-7 text-slate-700 shadow-[0_26px_60px_rgba(15,23,42,0.1)]"
        >
          <span className="font-semibold text-slate-900">Current cue:</span>{" "}
          {mode === "beginner" ? step.beginnerNote : step.expertNote}
        </motion.div>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,0.95fr)]">
          <section className="space-y-5">
            {controls}
            {visualization}
            {microscope}
          </section>

          <aside className="space-y-5">
            {tracePanel}
            {codePanel}
          </aside>
        </div>

        <div className="mx-auto w-full max-w-5xl">{output}</div>
      </div>
    </div>
  );
}
