"use client";

import type { ProblemShellProps, TeachingTraceFrame } from "./types";
import DarkBackLink from "./DarkBackLink";
import { DarkDifficultyBadge, darkPanelClassName } from "./darkUi";

export default function DarkProblemShell<Step extends TeachingTraceFrame>({
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
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(167,139,250,0.1),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(52,211,153,0.1),transparent_22%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <DarkBackLink href={categoryHref} label={categoryLabel} />
        </div>

        <header className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            {taxonomy}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              <span className="text-cyan-400 text-glow-cyan">{title}</span>
            </h1>
            <DarkDifficultyBadge difficulty={difficulty} />
          </div>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            {description}
          </p>
          <div className="rounded-full border border-slate-700/80 bg-slate-950/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
            {complexity}
          </div>
        </header>

        <div className="mx-auto w-full max-w-5xl">
          <div className={`${darkPanelClassName} p-5`}>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-5 w-1.5 rounded-full bg-cyan-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-100">
                Input
              </h3>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onPreset(preset)}
                  className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:-translate-y-0.5 hover:border-cyan-400/40 hover:text-cyan-100"
                >
                  {preset.name}
                  {preset.summary ? (
                    <span className="ml-1 text-slate-500">- {preset.summary}</span>
                  ) : null}
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {inputFields.map((field) => (
                <label key={field.key} className="block text-sm font-medium text-slate-300">
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
                      className="input-field mt-2 min-h-[120px] resize-y"
                    />
                  ) : (
                    <input
                      value={inputValues[field.key] ?? ""}
                      onChange={(event) =>
                        onInputChange(field.key, event.target.value)
                      }
                      placeholder={field.placeholder}
                      className="input-field mt-2 h-12"
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>
                Inputs accept plain text, JSON arrays, comma-separated values, or newline rows where relevant.
              </span>
              <button onClick={onRun} className="btn-neon btn-neon-cyan">
                Run Visualization
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-5xl rounded-[1.5rem] border border-slate-800/80 bg-[#050916]/90 px-6 py-4 text-center text-sm leading-7 text-slate-200 shadow-[0_0_40px_rgba(2,6,23,0.65)]">
          <span className="font-semibold text-slate-50">Current action:</span>{" "}
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
