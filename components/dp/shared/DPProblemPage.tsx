"use client";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import CodePanel from "./CodePanel";
import Controls from "./Controls";
import MainVisualizer from "./MainVisualizer";
import MicroscopeView from "./MicroscopeView";
import TracePanel from "./TracePanel";
import { glassPanelClassName } from "./theme";
import type {
  DpProblemPageProps,
  DpTraceStep,
  Mode,
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
  generateTrace,
  MainVisualizer: ProblemMainVisualizer = MainVisualizer,
  MicroscopeView: ProblemMicroscopeView = MicroscopeView,
  TracePanel: ProblemTracePanel = TracePanel,
  CodePanel: ProblemCodePanel = (({ step }: { step: DpTraceStep }) => (
    <CodePanel step={step} lines={[]} complexity={[]} />
  )) as DpProblemPageProps<TInputs>["CodePanel"],
}: DpProblemPageProps<TInputs>) {
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref={categoryHref}
      categoryLabel={categoryLabel}
      taxonomy={taxonomy}
      title={title}
      difficulty={difficulty}
      description={description}
      complexity={complexity}
      defaultInputs={defaultInputs}
      inputFields={inputFields.map((field) => ({
        id: field.key,
        label: field.label,
        placeholder: field.placeholder,
        helper: field.help,
        multiline: field.multiline,
        rows: field.rows,
      }))}
      presets={presets.map((preset) => ({
        name: preset.name,
        summary: preset.summary,
        values: preset.values,
      }))}
      generateTrace={generateTrace}
      inputHint="DP presets rebuild the same recurrence trace, so learn and prediction modes stay aligned."
      renderControls={({ teachingMode, setTeachingMode, timeline, trace }) => (
        <Controls
          stepIndex={timeline.activeIndex}
          totalSteps={trace.length}
          mode={teachingMode as Mode}
          isPlaying={timeline.isPlaying}
          speed={timeline.speed}
          transitionProgress={timeline.transitionProgress}
          onModeChange={(nextMode) => setTeachingMode(nextMode)}
          onPlay={() => timeline.play()}
          onPause={() => timeline.pause()}
          onPrev={() => timeline.prev()}
          onNext={() => timeline.next()}
          onReset={() => timeline.reset()}
          onSpeedChange={(speed) => timeline.setSpeed(speed)}
          canPrev={timeline.canPrev}
          canNext={timeline.canNext}
        />
      )}
      renderVisualization={({ step, timeline }) => (
        <ProblemMainVisualizer
          step={step}
          transitionProgress={timeline.transitionProgress}
        />
      )}
      renderMicroscope={({ step, teachingMode }) => (
        <ProblemMicroscopeView step={step} mode={teachingMode as Mode} />
      )}
      renderTracePanel={({ step }) => <ProblemTracePanel step={step} />}
      renderCodePanel={({ step }) => <ProblemCodePanel step={step} />}
      renderOutput={({ step }) => (
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
      )}
    />
  );
}
