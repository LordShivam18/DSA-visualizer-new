"use client";

import type { ReactNode } from "react";

import {
  useLessonController,
  type LessonControllerState,
  type LessonStepLike,
  type TeachingMode,
} from "./hooks/useLessonController";
import type { LessonFeatureMode } from "./LessonModeToggle";
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
  lessonModeToggle: ReactNode;
  predictionCard: ReactNode;
  whyPanel: ReactNode;
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
  generateTrace,
  initialTeachingMode,
  initialLessonMode,
  renderControls,
  renderVisualization,
  renderMicroscope,
  renderTracePanel,
  renderCodePanel,
  renderOutput,
  renderContainer,
}: {
  defaultInputs: TInputs;
  buildTrace?: (inputs: TInputs) => Step[];
  generateTrace?: (inputs: TInputs) => Step[];
  initialTeachingMode?: TeachingMode;
  initialLessonMode?: LessonFeatureMode;
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
  const traceBuilder = generateTrace ?? buildTrace;

  if (!traceBuilder) {
    throw new Error(
      "LessonShell requires a generateTrace function (or legacy buildTrace alias)."
    );
  }

  const lesson = useLessonController({
    defaultInputs,
    buildTrace: traceBuilder,
    initialTeachingMode,
    initialLessonMode,
  });

  const lessonModeToggle = (
    <LessonModeToggle
      value={lesson.lessonMode}
      onChange={lesson.setLessonMode}
    />
  );

  const predictionCard =
    lesson.lessonMode === "prediction" ? (
      <PredictionCheckpointCard
        checkpoint={lesson.prediction.checkpoint}
        feedback={lesson.prediction.feedback}
        askedCount={lesson.prediction.askedCount}
        correctCount={lesson.prediction.correctCount}
        onSelect={lesson.prediction.submitPrediction}
      />
    ) : null;

  const controls = (
    <>
      {lessonModeToggle}
      {renderControls(lesson)}
      {predictionCard}
    </>
  );

  const whyPanel = <WhyPanel insight={lesson.whyInsight} />;

  const tracePanel = (
    <>
      {whyPanel}
      {renderTracePanel(lesson)}
    </>
  );

  return renderContainer({
    ...lesson,
    lessonModeToggle,
    predictionCard,
    whyPanel,
    controls,
    visualization: renderVisualization(lesson),
    microscope: renderMicroscope(lesson),
    tracePanel,
    codePanel: renderCodePanel(lesson),
    output: renderOutput ? renderOutput(lesson) : null,
  });
}
