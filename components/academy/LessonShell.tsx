"use client";

import type { ReactNode } from "react";

import {
  useLessonController,
  type LessonControllerState,
  type LessonStepLike,
} from "./hooks/useLessonController";
import LessonModeToggle from "./LessonModeToggle";
import PredictionCheckpointCard from "./PredictionCheckpointCard";
import WhyPanel from "./WhyPanel";

type LessonShellViewModel<
  TInputs extends Record<string, string>,
  Step extends LessonStepLike
> = LessonControllerState<TInputs, Step>;

type LessonShellContainerContext<
  TInputs extends Record<string, string>,
  Step extends LessonStepLike
> = LessonShellViewModel<TInputs, Step> & {
  controls: ReactNode;
  visualization: ReactNode;
  microscope: ReactNode;
  tracePanel: ReactNode;
  codePanel: ReactNode;
  output: ReactNode;
};

export default function LessonShell<
  TInputs extends Record<string, string>,
  Step extends LessonStepLike
>({
  defaultInputs,
  buildTrace,
  renderControls,
  renderVisualization,
  renderMicroscope,
  renderTracePanel,
  renderCodePanel,
  renderOutput,
  renderContainer,
}: {
  defaultInputs: TInputs;
  buildTrace: (inputs: TInputs) => Step[];
  renderControls: (context: LessonShellViewModel<TInputs, Step>) => ReactNode;
  renderVisualization: (context: LessonShellViewModel<TInputs, Step>) => ReactNode;
  renderMicroscope: (context: LessonShellViewModel<TInputs, Step>) => ReactNode;
  renderTracePanel: (context: LessonShellViewModel<TInputs, Step>) => ReactNode;
  renderCodePanel: (context: LessonShellViewModel<TInputs, Step>) => ReactNode;
  renderOutput?: (context: LessonShellViewModel<TInputs, Step>) => ReactNode;
  renderContainer: (
    context: LessonShellContainerContext<TInputs, Step>
  ) => ReactNode;
}) {
  const lesson = useLessonController({
    defaultInputs,
    buildTrace,
  });

  const controls = (
    <>
      <LessonModeToggle
        value={lesson.lessonMode}
        onChange={lesson.setLessonMode}
      />
      {renderControls(lesson)}
      {lesson.lessonMode === "prediction" ? (
        <PredictionCheckpointCard
          checkpoint={lesson.prediction.checkpoint}
          feedback={lesson.prediction.feedback}
          askedCount={lesson.prediction.askedCount}
          correctCount={lesson.prediction.correctCount}
          onSelect={lesson.prediction.submitPrediction}
        />
      ) : null}
    </>
  );

  const tracePanel = (
    <>
      <WhyPanel insight={lesson.whyInsight} />
      {renderTracePanel(lesson)}
    </>
  );

  return renderContainer({
    ...lesson,
    controls,
    visualization: renderVisualization(lesson),
    microscope: renderMicroscope(lesson),
    tracePanel,
    codePanel: renderCodePanel(lesson),
    output: renderOutput ? renderOutput(lesson) : null,
  });
}
