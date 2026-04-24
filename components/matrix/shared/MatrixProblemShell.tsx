"use client";

import type { ProblemShellProps, TeachingTraceFrame } from "./types";
import MatrixBackLink from "./MatrixBackLink";
import { MatrixDifficultyBadge, matrixPanelClassName } from "./ui";

const headingStyle = {
  fontFamily: '"Palatino Linotype", "Book Antiqua", Georgia, serif',
} as const;

export default function MatrixProblemShell<Step extends TeachingTraceFrame>({
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
    <div className="relative min-h-screen overflow-hidden bg-[#f8f1e8] text-stone-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.88),transparent_26%),radial-gradient(circle_at_top_right,rgba(141,176,199,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(217,165,90,0.16),transparent_26%),linear-gradient(180deg,#fbf6ef_0%,#f7efe4_52%,#f3eadf_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(161,138,108,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(161,138,108,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-35" />
      <div className="absolute left-[-8rem] top-20 h-72 w-72 rounded-full bg-white/60 blur-3xl" />
      <div className="absolute bottom-10 right-[-8rem] h-80 w-80 rounded-full bg-[#dfc49e]/25 blur-3xl" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <MatrixBackLink href={categoryHref} label={categoryLabel} />
        </div>

        <header className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.38em] text-stone-500">
            {taxonomy}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <h1
              className="text-4xl font-semibold tracking-tight text-stone-900 md:text-6xl"
              style={headingStyle}
            >
              <span className="bg-gradient-to-r from-[#8a6433] via-[#6487a2] to-[#5f8d78] bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            <MatrixDifficultyBadge difficulty={difficulty} />
          </div>
          <p className="max-w-3xl text-sm leading-7 text-stone-600 md:text-base">
            {description}
          </p>
          <div className="rounded-full border border-[#e3d4bd] bg-white/85 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-stone-600 shadow-[0_14px_32px_rgba(120,94,56,0.08)]">
            {complexity}
          </div>
        </header>

        <div className="mx-auto w-full max-w-5xl">
          <div className={`${matrixPanelClassName} p-5`}>
            <div className="mb-4 flex items-center gap-2">
              <div className="h-5 w-1.5 rounded-full bg-[#8eb8cf]" />
              <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-900">
                Input
              </h3>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => onPreset(preset)}
                  className="rounded-full border border-[#eadcc8] bg-[#fffaf5] px-3 py-1.5 text-xs font-medium text-stone-700 transition-all hover:-translate-y-0.5 hover:border-[#d9c2a0] hover:bg-white"
                >
                  {preset.name}
                  {preset.summary ? (
                    <span className="ml-1 text-stone-400">- {preset.summary}</span>
                  ) : null}
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {inputFields.map((field) => (
                <label key={field.key} className="block text-sm font-medium text-stone-700">
                  <span>{field.label}</span>
                  {field.help ? (
                    <span className="mt-1 block text-xs font-normal text-stone-500">
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
                      className="mt-2 min-h-[140px] w-full rounded-[1.1rem] border border-[#e5d7c3] bg-[#fffaf5] px-4 py-3 font-mono text-sm text-stone-800 outline-none transition-all focus:border-[#9eb7c7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(158,183,199,0.16)]"
                    />
                  ) : (
                    <input
                      value={inputValues[field.key] ?? ""}
                      onChange={(event) =>
                        onInputChange(field.key, event.target.value)
                      }
                      placeholder={field.placeholder}
                      className="mt-2 h-12 w-full rounded-[1.1rem] border border-[#e5d7c3] bg-[#fffaf5] px-4 py-3 font-mono text-sm text-stone-800 outline-none transition-all focus:border-[#9eb7c7] focus:bg-white focus:shadow-[0_0_0_3px_rgba(158,183,199,0.16)]"
                    />
                  )}
                </label>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
              <span>Use JSON arrays or quick row input separated by new lines or pipes.</span>
              <button
                onClick={onRun}
                className="rounded-xl border border-[#d8c1a0] bg-gradient-to-r from-[#b88c4a] via-[#8ea8ba] to-[#6e9a83] px-5 py-2 text-sm font-semibold text-white shadow-[0_18px_35px_rgba(120,94,56,0.2)] transition-all hover:-translate-y-0.5"
              >
                Run Visualization
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-5xl rounded-[1.6rem] border border-[#eadcc8] bg-white/88 px-6 py-4 text-center text-sm leading-7 text-stone-700 shadow-[0_22px_60px_rgba(120,94,56,0.1)]">
          <span className="font-semibold text-stone-900">Current action:</span>{" "}
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
