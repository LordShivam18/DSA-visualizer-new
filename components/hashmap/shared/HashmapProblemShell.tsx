"use client";

import { useState } from "react";
import type { ComponentType } from "react";

import BackButton from "../../ui/BackButton";
import { difficultyTone } from "./tone";
import type {
  HashmapMode,
  HashmapTraceStep,
  ProblemInputField,
  ProblemMeta,
  ProblemPreset,
} from "./types";

type PanelProps = {
  step: HashmapTraceStep;
};

type MicroscopeProps = {
  step: HashmapTraceStep;
  mode: HashmapMode;
};

type ControlsProps = {
  stepIndex: number;
  totalSteps: number;
  mode: HashmapMode;
  onModeChange: (mode: HashmapMode) => void;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  canPrev: boolean;
  canNext: boolean;
};

type Props = {
  meta: ProblemMeta;
  inputFields: ProblemInputField[];
  presets: ProblemPreset[];
  initialInputs: Record<string, string>;
  buildTrace: (inputs: Record<string, string>) => HashmapTraceStep[];
  Visualization: ComponentType<PanelProps>;
  Controls: ComponentType<ControlsProps>;
  Microscope: ComponentType<MicroscopeProps>;
  TracePanel: ComponentType<PanelProps>;
  CodePanel: ComponentType<PanelProps>;
};

export default function HashmapProblemShell({
  meta,
  inputFields,
  presets,
  initialInputs,
  buildTrace,
  Visualization,
  Controls,
  Microscope,
  TracePanel,
  CodePanel,
}: Props) {
  const [inputs, setInputs] = useState<Record<string, string>>(initialInputs);
  const [trace, setTrace] = useState<HashmapTraceStep[]>(() =>
    buildTrace(initialInputs)
  );
  const [cursor, setCursor] = useState(0);
  const [mode, setMode] = useState<HashmapMode>("beginner");

  const safeIndex = Math.min(cursor, Math.max(trace.length - 1, 0));
  const step = trace[safeIndex];
  const canPrev = safeIndex > 0;
  const canNext = safeIndex < trace.length - 1;

  function updateField(id: string, value: string) {
    setInputs((current) => ({
      ...current,
      [id]: value,
    }));
  }

  function runWith(nextInputs: Record<string, string>) {
    setInputs(nextInputs);
    setTrace(buildTrace(nextInputs));
    setCursor(0);
  }

  return (
    <div className="relative min-h-screen overflow-hidden grid-pattern bg-[#030611] text-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_28%),radial-gradient(circle_at_top_right,rgba(244,63,94,0.08),transparent_24%),linear-gradient(180deg,rgba(3,6,17,0.94),rgba(3,6,17,1))]" />

      <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6">
        <div className="w-full max-w-4xl">
          <BackButton href={meta.backHref} label={meta.backLabel} />
        </div>

        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          <p className="text-xs uppercase tracking-[0.34em] text-slate-500">
            {meta.eyebrow}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
              <span className="text-cyan-400 text-glow-cyan">{meta.title}</span>
            </h1>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${difficultyTone(
                meta.difficulty
              )}`}
            >
              {meta.difficulty}
            </span>
          </div>
          <p className="max-w-3xl text-sm leading-7 text-slate-400 md:text-base">
            {meta.description}
          </p>
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
                  onClick={() => runWith({ ...preset.values })}
                  className="rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-cyan-400/40 hover:text-cyan-100"
                >
                  {preset.name}{" "}
                  <span className="text-slate-500">to {preset.output}</span>
                </button>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {inputFields.map((field) => (
                <label key={field.id} className="text-xs font-medium text-slate-400">
                  {field.label}
                  {field.multiline ? (
                    <textarea
                      value={inputs[field.id] ?? ""}
                      onChange={(event) => updateField(field.id, event.target.value)}
                      className="input-field mt-2 min-h-[120px] resize-y"
                      placeholder={field.placeholder}
                    />
                  ) : (
                    <input
                      value={inputs[field.id] ?? ""}
                      onChange={(event) => updateField(field.id, event.target.value)}
                      className="input-field mt-2"
                      placeholder={field.placeholder}
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
              <span>Inputs are safely parsed each time you regenerate the trace.</span>
              <button onClick={() => runWith({ ...inputs })} className="btn-neon btn-neon-cyan">
                Run Visualization
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-4xl rounded-[1.5rem] border border-slate-800/80 bg-[#050916]/90 px-6 py-4 text-center text-sm leading-7 text-slate-200 shadow-[0_0_40px_rgba(2,6,23,0.65)]">
          <span className="font-semibold text-slate-50">Current action:</span>{" "}
          {mode === "beginner"
            ? step.explanationBeginner
            : step.explanationExpert}
        </div>

        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(0,0.92fr)]">
          <section className="space-y-5">
            <Controls
              stepIndex={safeIndex}
              totalSteps={trace.length}
              mode={mode}
              onModeChange={setMode}
              onPrev={() => setCursor((current) => Math.max(current - 1, 0))}
              onNext={() =>
                setCursor((current) => Math.min(current + 1, trace.length - 1))
              }
              onReset={() => setCursor(0)}
              canPrev={canPrev}
              canNext={canNext}
            />

            <Visualization step={step} />
            <Microscope step={step} mode={mode} />
          </section>

          <aside className="space-y-5">
            <TracePanel step={step} />
            <CodePanel step={step} />
          </aside>
        </div>
      </div>
    </div>
  );
}
