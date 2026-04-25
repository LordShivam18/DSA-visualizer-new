"use client";

import type { ComponentType } from "react";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

import type {
  ProblemInputField,
  ProblemMeta,
  ProblemPreset,
  SlidingWindowMode,
  SlidingWindowTraceStep,
} from "./types";

type PanelProps = {
  step: SlidingWindowTraceStep;
};

type MicroscopeProps = {
  step: SlidingWindowTraceStep;
  mode: SlidingWindowMode;
};

type ControlsProps = {
  stepIndex: number;
  totalSteps: number;
  mode: SlidingWindowMode;
  onModeChange: (mode: SlidingWindowMode) => void;
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
  buildTrace: (inputs: Record<string, string>) => SlidingWindowTraceStep[];
  Visualization: ComponentType<PanelProps>;
  Controls: ComponentType<ControlsProps>;
  Microscope: ComponentType<MicroscopeProps>;
  TracePanel: ComponentType<PanelProps>;
  CodePanel: ComponentType<PanelProps>;
};

export default function SlidingWindowProblemShell({
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
  return (
    <TraceLessonPage
      variant="dark"
      categoryHref={meta.backHref}
      categoryLabel={meta.backLabel}
      taxonomy={meta.eyebrow}
      title={meta.title}
      difficulty={meta.difficulty}
      description={meta.description}
      defaultInputs={initialInputs}
      inputFields={inputFields.map((field) => ({
        id: field.id,
        label: field.label,
        placeholder: field.placeholder,
        helper: field.helper,
        multiline: field.multiline,
      }))}
      presets={presets.map((preset) => ({
        name: preset.name,
        summary: preset.output,
        values: preset.values,
      }))}
      buildTrace={buildTrace}
      inputHint="Every scenario rebuilds the full sliding-window trace from the algorithm source."
      renderControls={({ teachingMode, setTeachingMode, timeline, trace }) => (
        <Controls
          stepIndex={timeline.activeIndex}
          totalSteps={trace.length}
          mode={teachingMode as SlidingWindowMode}
          onModeChange={(nextMode) => setTeachingMode(nextMode)}
          onPrev={() => timeline.prev()}
          onNext={() => timeline.next()}
          onReset={() => timeline.reset()}
          canPrev={timeline.canPrev}
          canNext={timeline.canNext}
        />
      )}
      renderVisualization={({ step }) => <Visualization step={step} />}
      renderMicroscope={({ step, teachingMode }) => (
        <Microscope step={step} mode={teachingMode as SlidingWindowMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
