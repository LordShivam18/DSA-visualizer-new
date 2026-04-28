"use client";

import { useState, type Dispatch, type ReactNode, type SetStateAction } from "react";

import CompletionFeedbackPanel from "./CompletionFeedbackPanel";
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
import ProgressiveLearningModeToggle from "./ProgressiveLearningModeToggle";
import ReplayVariationsPanel from "./ReplayVariationsPanel";
import WhyPanel from "./WhyPanel";
import { useLessonLearningExperience } from "./hooks/useLessonLearningExperience";
import {
  filterReplayVariationsForMode,
  getProgressiveDisclosure,
  type ProgressiveLearningMode,
} from "@/lib/academy/progressiveDisclosure";

type LessonShellViewModel<
  TInputs extends Record<string, string>,
  Step extends LessonStepLike
> = LessonControllerState<TInputs, Step>;

type LessonShellContainerContext<
  TInputs extends Record<string, string>,
  Step extends LessonStepLike
> = LessonShellViewModel<TInputs, Step> & {
  progressiveMode: ProgressiveLearningMode;
  setProgressiveMode: Dispatch<SetStateAction<ProgressiveLearningMode>>;
  progressiveModeToggle: ReactNode;
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
  initialProgressiveMode = "beginner",
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
  initialProgressiveMode?: ProgressiveLearningMode;
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
  const [progressiveMode, setProgressiveMode] =
    useState<ProgressiveLearningMode>(initialProgressiveMode);
  const progressiveDisclosure = getProgressiveDisclosure(progressiveMode);
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
    stepIndex: lesson.timeline.activeIndex,
    totalSteps: lesson.trace.length,
  });
  const visibleReplayVariations = filterReplayVariationsForMode(
    learningExperience.replayVariations,
    progressiveMode
  );
  const setProgressiveModeWithLens = (nextMode: ProgressiveLearningMode) => {
    setProgressiveMode(nextMode);
    lesson.setTeachingMode(nextMode === "expert" ? "expert" : "beginner");
  };

  const progressiveModeToggle = (
    <ProgressiveLearningModeToggle
      value={progressiveMode}
      onChange={setProgressiveModeWithLens}
    />
  );

  const replayPanel = learningExperience.problem ? (
    <ReplayVariationsPanel
      items={visibleReplayVariations}
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
      stepLabel={lesson.step.action}
      focus={lesson.whyInsight?.nextFocus ?? lesson.step.action}
      explanation={lesson.whyInsight?.reason ?? lesson.currentNarration}
      animation={lesson.step.animation}
      confirmation={
        lesson.whyInsight
          ? `Confirm that "${lesson.whyInsight.nextFocus}" still supports ${lesson.whyInsight.title.toLowerCase()}.`
          : undefined
      }
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
      {progressiveModeToggle}
      {lessonModeToggle}
      {renderControls(lesson)}
      {predictionCard}
      {progressiveDisclosure.panels.replay ? replayPanel : null}
    </>
  );

  const whyPanel = <WhyPanel insight={lesson.whyInsight} />;
  const completionFeedbackPanel = (
    <CompletionFeedbackPanel insight={learningExperience.completionFeedback} />
  );

  const tracePanel = (
    <>
      {progressiveDisclosure.panels.narrative ? narrativeLayer : null}
      {progressiveDisclosure.panels.why ? whyPanel : null}
      {renderTracePanel(lesson)}
      {progressiveDisclosure.panels.mistake ? mistakePanel : null}
      {progressiveDisclosure.panels.pattern ? patternPanel : null}
      {progressiveDisclosure.panels.path ? guidedPathPanel : null}
    </>
  );

  return renderContainer({
    ...lesson,
    progressiveMode,
    setProgressiveMode,
    progressiveModeToggle,
    lessonModeToggle,
    predictionCard,
    whyPanel,
    controls,
    visualization: renderVisualization(lesson),
    microscope: renderMicroscope(lesson),
    tracePanel,
    codePanel: progressiveDisclosure.panels.code ? renderCodePanel(lesson) : null,
    output: (
      <>
        {renderOutput ? renderOutput(lesson) : null}
        {progressiveDisclosure.panels.completion ? completionFeedbackPanel : null}
        {progressiveDisclosure.panels.intelligence
          ? learningIntelligencePanel
          : null}
      </>
    ),
  });
}
