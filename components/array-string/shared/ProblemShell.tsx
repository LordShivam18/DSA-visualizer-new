"use client";

import type { ProblemShellProps, TeachingTraceFrame } from "./types";
import LightBackLink from "./LightBackLink";
import { DifficultyBadge, lightPanelClassName } from "./ui";

export default function ProblemShell<Step extends TeachingTraceFrame>({
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
}: ProblemShellProps<Step>) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6fbff] text-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_26%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_24%),linear-gradient(180deg,#f8fcff_0%,#eef7ff_54%,#f6fbff_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:64px_64px] opacity-40" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <LightBackLink href={categoryHref} label={categoryLabel} />
        </div>

        <header className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            {taxonomy}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              <span className="bg-gradient-to-r from-cyan-600 via-violet-600 to-emerald-600 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            <DifficultyBadge difficulty={difficulty} />
          </div>
          <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            {description}
          </p>
          <div className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-600 shadow-[0_12px_30px_rgba(15,23,42,0.06)]">
            {complexity}
          </div>
        </header>

        <div className="mx-auto w-full max-w-5xl">
          <div className={`${lightPanelClassName} p-5`}>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-5 w-1.5 rounded-full bg-cyan-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                Input
              </h3>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onPreset(preset)}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700"
                >
                  {preset.name}
                  {preset.summary ? (
                    <span className="ml-1 text-slate-400">- {preset.summary}</span>
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
                      onChange={(event) =>
                        onInputChange(field.key, event.target.value)
                      }
                      placeholder={field.placeholder}
                      className="mt-2 min-h-[120px] w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-800 outline-none transition-all focus:border-cyan-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,211,238,0.08)]"
                    />
                  ) : (
                    <input
                      value={inputValues[field.key] ?? ""}
                      onChange={(event) =>
                        onInputChange(field.key, event.target.value)
                      }
                      placeholder={field.placeholder}
                      className="mt-2 h-12 w-full rounded-[1rem] border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-800 outline-none transition-all focus:border-cyan-300 focus:bg-white focus:shadow-[0_0_0_3px_rgba(34,211,238,0.08)]"
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
              <span>Inputs are safely parsed from CSV, whitespace, or JSON arrays.</span>
              <button
                onClick={onRun}
                className="rounded-xl border border-cyan-200 bg-cyan-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.22)] transition-all hover:-translate-y-0.5 hover:bg-cyan-600"
              >
                Run Visualization
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-5xl rounded-[1.5rem] border border-white/70 bg-white/88 px-6 py-4 text-center text-sm leading-7 text-slate-700 shadow-[0_22px_60px_rgba(15,23,42,0.09)]">
          <span className="font-semibold text-slate-900">Current action:</span>{" "}
          {mode === "beginner" ? step.beginnerNote : step.expertNote}
        </div>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.95fr)]">
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
