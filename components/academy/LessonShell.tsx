"use client";

import type { ReactNode } from "react";

import {
  useLessonController,
  type LessonControllerState,
  type LessonStepLike,
  type TeachingMode,
} from "./hooks/useLessonController";
import GuidedLearningPathPanel from "./GuidedLearningPathPanel";
import LearningIntelligencePanel from "./LearningIntelligencePanel";
import type { LessonFeatureMode } from "./LessonModeToggle";
import LessonModeToggle from "./LessonModeToggle";
import MistakeDetectionPanel from "./MistakeDetectionPanel";
import NarrativeAnimationLayer from "./NarrativeAnimationLayer";
import PatternRecognitionPanel from "./PatternRecognitionPanel";
import PredictionCheckpointCard from "./PredictionCheckpointCard";
import ReplayVariationsPanel from "./ReplayVariationsPanel";
import WhyPanel from "./WhyPanel";
import { useLessonLearningExperience } from "./hooks/useLessonLearningExperience";

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
  generateTrace: (inputs: TInputs) => Step[];
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
  const lesson = useLessonController({
    defaultInputs,
    generateTrace,
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

  const learningExperience = useLessonLearningExperience({
    defaultInputs,
    inputs: lesson.inputs,
    step: lesson.step,
    whyInsight: lesson.whyInsight,
    feedback: lesson.prediction.feedback,
    predictionAccuracy: lesson.prediction.accuracy,
  });

  const replayPanel = learningExperience.problem ? (
    <ReplayVariationsPanel
      items={learningExperience.replayVariations}
      onApply={(variation) =>
        lesson.run({
          ...lesson.inputs,
          ...variation.values,
        } as TInputs)
      }
    />
  ) : null;

  const narrativeLayer = (
    <NarrativeAnimationLayer
      key={`${lesson.step.step}:${lesson.step.action}`}
      stepKey={`${lesson.step.step}:${lesson.step.action}`}
      focus={lesson.whyInsight?.nextFocus ?? lesson.step.action}
      explanation={lesson.whyInsight?.reason ?? lesson.currentNarration}
      animation={lesson.step.animation}
    />
  );

  const mistakePanel = (
    <MistakeDetectionPanel insight={learningExperience.mistakeInsight} />
  );

  const patternPanel = (
    <PatternRecognitionPanel insight={learningExperience.pattern} />
  );

  const guidedPathPanel = (
    <GuidedLearningPathPanel path={learningExperience.guidedPath} />
  );

  const learningIntelligencePanel = (
    <LearningIntelligencePanel insight={learningExperience.learningIntelligence} />
  );

  const controls = (
    <>
      {lessonModeToggle}
      {renderControls(lesson)}
      {predictionCard}
      {replayPanel}
    </>
  );

  const whyPanel = <WhyPanel insight={lesson.whyInsight} />;

  const tracePanel = (
    <>
      {narrativeLayer}
      {whyPanel}
      {renderTracePanel(lesson)}
      {mistakePanel}
      {patternPanel}
      {guidedPathPanel}
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
    output: (
      <>
        {renderOutput ? renderOutput(lesson) : null}
        {learningIntelligencePanel}
      </>
    ),
  });
}
