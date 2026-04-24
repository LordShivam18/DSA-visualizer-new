"use client";

import { useState } from "react";

import { useTimeline } from "@/components/core/animation/useTimeline";

import CodePanel from "./CodePanel";
import Controls from "./Controls";
import DPProblemShell from "./DPProblemShell";
import MainVisualizer from "./MainVisualizer";
import MicroscopeView from "./MicroscopeView";
import TracePanel from "./TracePanel";
import { glassPanelClassName } from "./theme";
import type {
  DpProblemPageProps,
  DpTraceStep,
  Mode,
  PresetConfig,
} from "./types";

export default function DPProblemPage<TInputs extends Record<string, string>>({
  categoryHref,
  categoryLabel,
  taxonomy,
  title,
  difficulty,
  description,
  complexity,
  inputFields,
  defaultInputs,
  presets,
  buildTrace,
  MainVisualizer: ProblemMainVisualizer = MainVisualizer,
  MicroscopeView: ProblemMicroscopeView = MicroscopeView,
  TracePanel: ProblemTracePanel = TracePanel,
  CodePanel: ProblemCodePanel = (({ step }: { step: DpTraceStep }) => (
    <CodePanel step={step} lines={[]} complexity={[]} />
  )) as DpProblemPageProps<TInputs>["CodePanel"],
}: DpProblemPageProps<TInputs>) {
  const [inputs, setInputs] = useState<TInputs>(defaultInputs);
  const [trace, setTrace] = useState<DpTraceStep[]>(() => buildTrace(defaultInputs));
  const [mode, setMode] = useState<Mode>("beginner");

  const timeline = useTimeline(trace);
  const step = timeline.activeStep ?? trace[0];

  function run(nextInputs = inputs) {
    setInputs(nextInputs);
    setTrace(buildTrace(nextInputs));
  }

  return (
    <DPProblemShell
      categoryHref={categoryHref}
      categoryLabel={categoryLabel}
      taxonomy={taxonomy}
      title={title}
      difficulty={difficulty}
      description={description}
      complexity={complexity}
      inputFields={inputFields}
      inputValues={inputs}
      onInputChange={(key, value) =>
        setInputs((current) => ({ ...current, [key]: value }))
      }
      onRun={() => run()}
      presets={presets as Array<PresetConfig<Record<string, string>>>}
      onPreset={(preset) => run(preset.values as TInputs)}
      step={step}
      mode={mode}
      controls={
        <Controls
          stepIndex={timeline.activeIndex}
          totalSteps={trace.length}
          mode={mode}
          isPlaying={timeline.isPlaying}
          speed={timeline.speed}
          transitionProgress={timeline.transitionProgress}
          onModeChange={setMode}
          onPlay={() => timeline.play()}
          onPause={() => timeline.pause()}
          onPrev={() => timeline.prev()}
          onNext={() => timeline.next()}
          onReset={() => timeline.reset()}
          onSpeedChange={(speed) => timeline.setSpeed(speed)}
          canPrev={timeline.canPrev}
          canNext={timeline.canNext}
        />
      }
      visualization={
        <ProblemMainVisualizer
          step={step}
          transitionProgress={timeline.transitionProgress}
        />
      }
      microscope={<ProblemMicroscopeView step={step} mode={mode} />}
      tracePanel={<ProblemTracePanel step={step} />}
      codePanel={<ProblemCodePanel step={step} />}
      output={
        <div
          className={`${glassPanelClassName} p-5 ${
            step.done ? "border-emerald-200 bg-emerald-50/70" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <span
              className={`h-5 w-1.5 rounded-full ${
                step.done ? "bg-emerald-400" : "bg-sky-400"
              }`}
            />
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Output</h3>
              <p className="text-sm text-slate-500">
                Timeline-synced result snapshot for the current DP state.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[1.3rem] border border-slate-900/85 bg-slate-950/96 px-4 py-4 font-mono text-base text-sky-200">
            {step.resultLabel} = {step.resultValue}
          </div>
        </div>
      }
    />
  );
}
