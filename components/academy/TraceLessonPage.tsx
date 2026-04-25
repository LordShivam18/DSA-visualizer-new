"use client";

import type {
  Dispatch,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
} from "react";

import type {
  LessonControllerState,
  LessonStepLike,
  TeachingMode,
} from "./hooks/useLessonController";
import LessonShell from "./LessonShell";
import ProblemShell from "../array-string/shared/ProblemShell";
import LightControls from "../array-string/shared/LightControls";
import type {
  InputFieldConfig as ArrayStringInputFieldConfig,
  PresetConfig as ArrayStringPresetConfig,
  TeachingTraceFrame as ArrayStringTeachingTraceFrame,
} from "../array-string/shared/types";
import MatrixProblemShell from "../matrix/shared/MatrixProblemShell";
import MatrixControls from "../matrix/shared/MatrixControls";
import type {
  InputFieldConfig as MatrixInputFieldConfig,
  PresetConfig as MatrixPresetConfig,
  TeachingTraceFrame as MatrixTeachingTraceFrame,
} from "../matrix/shared/types";
import BacktrackingTraceControls from "../backtracking/shared/TraceControls";
import BackButton from "../ui/BackButton";

type Difficulty = "Easy" | "Medium" | "Hard" | "easy" | "medium" | "hard";
type Variant = "dark" | "light" | "matrix";

type TraceInputField<TInputs extends Record<string, string>> = {
  id: keyof TInputs & string;
  label: string;
  placeholder?: string;
  helper?: string;
  multiline?: boolean;
  rows?: number;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
};

type TracePreset<TInputs extends Record<string, string>> = {
  name: string;
  summary?: string;
  values: TInputs;
};

type TraceLessonPageProps<
  TInputs extends Record<string, string>,
  Step extends LessonStepLike
> = {
  variant?: Variant;
  categoryHref: string;
  categoryLabel: string;
  taxonomy: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  complexity?: string;
  defaultInputs: TInputs;
  inputFields: TraceInputField<TInputs>[];
  presets: TracePreset<TInputs>[];
  buildTrace: (inputs: TInputs) => Step[];
  inputHint?: string;
  renderControls?: (
    context: LessonControllerState<TInputs, Step>
  ) => ReactNode;
  renderVisualization: (
    context: LessonControllerState<TInputs, Step>
  ) => ReactNode;
  renderMicroscope: (
    context: LessonControllerState<TInputs, Step>
  ) => ReactNode;
  renderTracePanel: (
    context: LessonControllerState<TInputs, Step>
  ) => ReactNode;
  renderCodePanel: (
    context: LessonControllerState<TInputs, Step>
  ) => ReactNode;
  renderOutput?: (
    context: LessonControllerState<TInputs, Step>
  ) => ReactNode;
};

function toTitleCaseDifficulty(value: Difficulty): "Easy" | "Medium" | "Hard" {
  const normalized = value.toLowerCase();

  if (normalized === "easy") {
    return "Easy";
  }

  if (normalized === "hard") {
    return "Hard";
  }

  return "Medium";
}

function darkDifficultyTone(value: Difficulty) {
  const normalized = value.toLowerCase();

  if (normalized === "easy") {
    return "border-emerald-400/30 bg-emerald-500/10 text-emerald-200";
  }

  if (normalized === "hard") {
    return "border-rose-400/30 bg-rose-500/10 text-rose-200";
  }

  return "border-yellow-400/30 bg-yellow-500/10 text-yellow-200";
}

function defaultDarkInputHint() {
  return "Every preset regenerates the trace from the immutable algorithm source.";
}

function renderDefaultControls<
  TInputs extends Record<string, string>,
  Step extends LessonStepLike
>(
  variant: Variant,
  context: LessonControllerState<TInputs, Step>
) {
  const controlProps = {
    stepIndex: context.timeline.activeIndex,
    totalSteps: context.trace.length,
    mode: context.teachingMode as TeachingMode,
    onModeChange: (nextMode: TeachingMode) => context.setTeachingMode(nextMode),
    onPrev: () => context.timeline.prev(),
    onNext: () => context.timeline.next(),
    onReset: () => context.timeline.reset(),
    canPrev: context.timeline.canPrev,
    canNext: context.timeline.canNext,
  };

  if (variant === "light") {
    return <LightControls {...controlProps} />;
  }

  if (variant === "matrix") {
    return <MatrixControls {...controlProps} />;
  }

  return <BacktrackingTraceControls {...controlProps} />;
}

function renderDarkLayout<
  TInputs extends Record<string, string>,
  Step extends LessonStepLike
>({
  categoryHref,
  categoryLabel,
  taxonomy,
  title,
  difficulty,
  description,
  complexity,
  inputFields,
  presets,
  inputHint,
  inputs,
  setInputs,
  run,
  currentNarration,
  controls,
  visualization,
  microscope,
  tracePanel,
  codePanel,
  output,
}: TraceLessonPageProps<TInputs, Step> & {
  inputs: TInputs;
  setInputs: Dispatch<SetStateAction<TInputs>>;
  run: (nextInputs?: TInputs) => void;
  currentNarration: string;
  controls: ReactNode;
  visualization: ReactNode;
  microscope: ReactNode;
  tracePanel: ReactNode;
  codePanel: ReactNode;
  output: ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,63,94,0.08),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href={categoryHref} label={categoryLabel} />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            {taxonomy}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              <span className="text-cyan-400 text-glow-cyan">{title}</span>
            </h1>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${darkDifficultyTone(
                difficulty
              )}`}
            >
              {toTitleCaseDifficulty(difficulty)}
            </span>
          </div>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            {description}
          </p>
          {complexity ? (
            <div className="rounded-full border border-slate-700/80 bg-slate-950/70 px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-slate-300">
              {complexity}
            </div>
          ) : null}
        </header>

        <div className="mx-auto w-full max-w-4xl">
          <div className="glass-card p-5">
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
                  onClick={() => run({ ...preset.values })}
                  className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-cyan-400/40 hover:text-cyan-100"
                >
                  {preset.name}
                  {preset.summary ? (
                    <span className="ml-1 text-slate-500">-&gt; {preset.summary}</span>
                  ) : null}
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {inputFields.map((field) => (
                <label
                  key={field.id}
                  className="text-xs font-medium text-slate-400"
                >
                  {field.label}
                  {field.multiline ? (
                    <textarea
                      value={inputs[field.id] ?? ""}
                      rows={field.rows ?? 4}
                      onChange={(event) =>
                        setInputs((current) => ({
                          ...current,
                          [field.id]: event.target.value,
                        }))
                      }
                      className="input-field mt-2 min-h-[120px] resize-y"
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      value={inputs[field.id] ?? ""}
                      onChange={(event) =>
                        setInputs((current) => ({
                          ...current,
                          [field.id]: event.target.value,
                        }))
                      }
                      className="input-field mt-2"
                      placeholder={field.placeholder}
                      inputMode={field.inputMode}
                    />
                  )}
                  {field.helper ? (
                    <span className="mt-2 block text-[11px] leading-5 text-slate-500">
                      {field.helper}
                    </span>
                  ) : null}
                </label>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
              <span>{inputHint || defaultDarkInputHint()}</span>
              <button
                onClick={() => run({ ...inputs })}
                className="btn-neon btn-neon-cyan"
              >
                Run Visualization
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl rounded-[1.5rem] border border-slate-800/80 bg-[#050916]/90 px-6 py-4 text-center text-sm leading-7 text-slate-200 shadow-[0_0_40px_rgba(2,6,23,0.65)]">
          <span className="font-semibold text-slate-50">Current action:</span>{" "}
          {currentNarration}
        </div>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.92fr)]">
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

        {output ? <div className="mx-auto w-full max-w-4xl">{output}</div> : null}
      </div>
    </div>
  );
}

export default function TraceLessonPage<
  TInputs extends Record<string, string>,
  Step extends LessonStepLike
>({
  variant = "dark",
  categoryHref,
  categoryLabel,
  taxonomy,
  title,
  difficulty,
  description,
  complexity,
  defaultInputs,
  inputFields,
  presets,
  buildTrace,
  inputHint,
  renderControls,
  renderVisualization,
  renderMicroscope,
  renderTracePanel,
  renderCodePanel,
  renderOutput,
}: TraceLessonPageProps<TInputs, Step>) {
  return (
    <LessonShell
      defaultInputs={defaultInputs}
      buildTrace={buildTrace}
      renderControls={(context) =>
        renderControls
          ? renderControls(context)
          : renderDefaultControls(variant, context)
      }
      renderVisualization={renderVisualization}
      renderMicroscope={renderMicroscope}
      renderTracePanel={renderTracePanel}
      renderCodePanel={renderCodePanel}
      renderOutput={renderOutput}
      renderContainer={({
        inputs,
        setInputs,
        run,
        step,
        teachingMode,
        currentNarration,
        controls,
        visualization,
        microscope,
        tracePanel,
        codePanel,
        output,
      }) => {
        if (variant === "light") {
          return (
            <ProblemShell
              categoryHref={categoryHref}
              categoryLabel={categoryLabel}
              taxonomy={taxonomy}
              title={title}
              difficulty={toTitleCaseDifficulty(difficulty)}
              description={description}
              complexity={complexity ?? ""}
              inputFields={inputFields.map<ArrayStringInputFieldConfig>((field) => ({
                key: field.id,
                label: field.label,
                placeholder: field.placeholder,
                help: field.helper,
                multiline: field.multiline,
                rows: field.rows,
              }))}
              inputValues={inputs}
              onInputChange={(key, value) =>
                setInputs((current) => ({ ...current, [key]: value }))
              }
              onRun={() => run({ ...inputs })}
              presets={presets.map<ArrayStringPresetConfig>((preset) => ({
                name: preset.name,
                summary: preset.summary,
                values: preset.values,
              }))}
              onPreset={(preset) => run(preset.values as TInputs)}
              step={step as unknown as ArrayStringTeachingTraceFrame}
              mode={teachingMode}
              controls={controls}
              visualization={visualization}
              microscope={microscope}
              tracePanel={tracePanel}
              codePanel={codePanel}
              output={output}
            />
          );
        }

        if (variant === "matrix") {
          return (
            <MatrixProblemShell
              categoryHref={categoryHref}
              categoryLabel={categoryLabel}
              taxonomy={taxonomy}
              title={title}
              difficulty={toTitleCaseDifficulty(difficulty)}
              description={description}
              complexity={complexity ?? ""}
              inputFields={inputFields.map<MatrixInputFieldConfig>((field) => ({
                key: field.id,
                label: field.label,
                placeholder: field.placeholder,
                help: field.helper,
                multiline: field.multiline,
                rows: field.rows,
              }))}
              inputValues={inputs}
              onInputChange={(key, value) =>
                setInputs((current) => ({ ...current, [key]: value }))
              }
              onRun={() => run({ ...inputs })}
              presets={presets.map<MatrixPresetConfig>((preset) => ({
                name: preset.name,
                summary: preset.summary,
                values: preset.values,
              }))}
              onPreset={(preset) => run(preset.values as TInputs)}
              step={step as unknown as MatrixTeachingTraceFrame}
              mode={teachingMode}
              controls={controls}
              visualization={visualization}
              microscope={microscope}
              tracePanel={tracePanel}
              codePanel={codePanel}
              output={output}
            />
          );
        }

        return renderDarkLayout({
          variant,
          categoryHref,
          categoryLabel,
          taxonomy,
          title,
          difficulty,
          description,
          complexity,
          defaultInputs,
          inputFields,
          presets,
          buildTrace,
          inputHint,
          renderControls,
          renderVisualization,
          renderMicroscope,
          renderTracePanel,
          renderCodePanel,
          renderOutput,
          inputs,
          setInputs,
          run,
          currentNarration,
          controls,
          visualization,
          microscope,
          tracePanel,
          codePanel,
          output,
        });
      }}
    />
  );
}
