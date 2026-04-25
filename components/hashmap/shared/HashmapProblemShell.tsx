"use client";

import type { ComponentType } from "react";

import TraceLessonPage from "@/components/academy/TraceLessonPage";

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
      inputHint="Inputs are safely parsed each time the trace is regenerated."
      renderControls={({ teachingMode, setTeachingMode, timeline, trace }) => (
        <Controls
          stepIndex={timeline.activeIndex}
          totalSteps={trace.length}
          mode={teachingMode as HashmapMode}
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
        <Microscope step={step} mode={teachingMode as HashmapMode} />
      )}
      renderTracePanel={({ step }) => <TracePanel step={step} />}
      renderCodePanel={({ step }) => <CodePanel step={step} />}
    />
  );
}
