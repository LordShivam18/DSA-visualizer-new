"use client";

import type { ComponentType, HTMLAttributes, ReactNode } from "react";

import TraceLessonPage from "./TraceLessonPage";
import type {
  LessonControllerState,
  LessonStepLike,
  TeachingMode,
} from "./hooks/useLessonController";

type Difficulty = "Easy" | "Medium" | "Hard" | "easy" | "medium" | "hard";
type Variant = "dark" | "light" | "matrix";

export type StandardLessonInputField<TInputs extends Record<string, string>> = {
  id: keyof TInputs & string;
  label: string;
  placeholder?: string;
  helper?: string;
  multiline?: boolean;
  rows?: number;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
};

export type StandardLessonPreset<TInputs extends Record<string, string>> = {
  name: string;
  summary?: string;
  values: TInputs;
};

type StandardControlsProps<Mode extends string> = {
  stepIndex: number;
  totalSteps: number;
  mode: Mode;
  onModeChange: (nextMode: Mode) => void;
  onPrev: () => void;
  onNext: () => void;
  onReset: () => void;
  canPrev: boolean;
  canNext: boolean;
};

type StandardRenderContext<
  TInputs extends Record<string, string>,
  Step extends LessonStepLike
> = LessonControllerState<TInputs, Step>;

type StepPanelComponent<Step extends LessonStepLike> = ComponentType<{
  step: Step;
}>;

type MicroscopeComponent<Step extends LessonStepLike, Mode extends string> =
  ComponentType<{
    step: Step;
    mode: Mode;
  }>;

export default function StandardTraceLessonPage<
  TInputs extends Record<string, string>,
  Step extends LessonStepLike,
  Mode extends string = "beginner" | "expert"
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
  generateTrace,
  inputHint,
  Controls,
  Visualization,
  Microscope,
  TracePanel,
  CodePanel,
  renderControls,
  renderVisualization,
  renderMicroscope,
  renderTracePanel,
  renderCodePanel,
  renderOutput,
}: {
  variant?: Variant;
  categoryHref: string;
  categoryLabel: string;
  taxonomy: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  complexity?: string;
  defaultInputs: TInputs;
  inputFields: StandardLessonInputField<TInputs>[];
  presets: StandardLessonPreset<TInputs>[];
  buildTrace?: (inputs: TInputs) => Step[];
  generateTrace?: (inputs: TInputs) => Step[];
  inputHint?: string;
  Controls?: ComponentType<StandardControlsProps<Mode>>;
  Visualization?: StepPanelComponent<Step>;
  Microscope?: MicroscopeComponent<Step, Mode>;
  TracePanel?: StepPanelComponent<Step>;
  CodePanel?: StepPanelComponent<Step>;
  renderControls?: (
    context: StandardRenderContext<TInputs, Step>
  ) => ReactNode;
  renderVisualization?: (
    context: StandardRenderContext<TInputs, Step>
  ) => ReactNode;
  renderMicroscope?: (
    context: StandardRenderContext<TInputs, Step>
  ) => ReactNode;
  renderTracePanel?: (
    context: StandardRenderContext<TInputs, Step>
  ) => ReactNode;
  renderCodePanel?: (
    context: StandardRenderContext<TInputs, Step>
  ) => ReactNode;
  renderOutput?: (
    context: StandardRenderContext<TInputs, Step>
  ) => ReactNode;
}) {
  return (
    <TraceLessonPage
      variant={variant}
      categoryHref={categoryHref}
      categoryLabel={categoryLabel}
      taxonomy={taxonomy}
      title={title}
      difficulty={difficulty}
      description={description}
      complexity={complexity}
      defaultInputs={defaultInputs}
      inputFields={inputFields}
      presets={presets}
      buildTrace={buildTrace}
      generateTrace={generateTrace}
      inputHint={inputHint}
      renderControls={(context) => {
        if (renderControls) {
          return renderControls(context);
        }

        if (!Controls) {
          return null;
        }

        return (
          <Controls
            stepIndex={context.timeline.activeIndex}
            totalSteps={context.trace.length}
            mode={context.teachingMode as Mode}
            onModeChange={(nextMode) =>
              context.setTeachingMode(nextMode as TeachingMode)
            }
            onPrev={() => context.timeline.prev()}
            onNext={() => context.timeline.next()}
            onReset={() => context.timeline.reset()}
            canPrev={context.timeline.canPrev}
            canNext={context.timeline.canNext}
          />
        );
      }}
      renderVisualization={(context) =>
        renderVisualization ? (
          renderVisualization(context)
        ) : Visualization ? (
          <Visualization step={context.step as Step} />
        ) : null
      }
      renderMicroscope={(context) =>
        renderMicroscope ? (
          renderMicroscope(context)
        ) : Microscope ? (
          <Microscope
            step={context.step as Step}
            mode={context.teachingMode as Mode}
          />
        ) : null
      }
      renderTracePanel={(context) =>
        renderTracePanel ? (
          renderTracePanel(context)
        ) : TracePanel ? (
          <TracePanel step={context.step as Step} />
        ) : null
      }
      renderCodePanel={(context) =>
        renderCodePanel ? (
          renderCodePanel(context)
        ) : CodePanel ? (
          <CodePanel step={context.step as Step} />
        ) : null
      }
      renderOutput={renderOutput}
    />
  );
}
