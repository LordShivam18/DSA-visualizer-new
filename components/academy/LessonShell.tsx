"use client";

import {
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import { useSearchParams } from "next/navigation";

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
import {
  resolveLessonEntryExperience,
  type LessonEntryExperience,
} from "@/lib/academy/entryPoints";

const GUIDED_ENTRY_ONBOARDING_KEY = "guided-dsa:first-problem-overlay:v1";

type LessonShellViewModel<
  TInputs extends Record<string, string>,
  Step extends LessonStepLike
> = LessonControllerState<TInputs, Step>;

type LessonShellContainerContext<
  TInputs extends Record<string, string>,
  Step extends LessonStepLike
> = LessonShellViewModel<TInputs, Step> & {
  entryExperience: LessonEntryExperience;
  guidedEntry: boolean;
  showEntryOnboarding: boolean;
  dismissEntryOnboarding: () => void;
  markEntryInteraction: () => void;
  progressiveMode: ProgressiveLearningMode;
  setProgressiveMode: Dispatch<SetStateAction<ProgressiveLearningMode>>;
  progressiveModeToggle: ReactNode;
  lessonModeToggle: ReactNode;
  lessonControls: ReactNode;
  predictionCard: ReactNode;
  replayPanel: ReactNode;
  guidedReplayPanel: ReactNode;
  whyPanel: ReactNode;
  completionFeedback: ReactNode;
  controls: ReactNode;
  visualization: ReactNode;
  microscope: ReactNode;
  tracePanel: ReactNode;
  codePanel: ReactNode;
  supplementalOutput: ReactNode;
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
  const searchParams = useSearchParams();
  const entryExperience = resolveLessonEntryExperience(searchParams.get("entry"));
  const guidedEntry = entryExperience !== "default";
  const [progressiveMode, setProgressiveMode] =
    useState<ProgressiveLearningMode>(
      guidedEntry ? "beginner" : initialProgressiveMode
    );
  const [showEntryOnboarding, setShowEntryOnboarding] = useState(
    entryExperience === "guided"
  );
  const progressiveDisclosure = getProgressiveDisclosure(progressiveMode);
  const lesson = useLessonController({
    defaultInputs,
    generateTrace,
    initialTeachingMode: guidedEntry ? "beginner" : initialTeachingMode,
    initialLessonMode:
      guidedEntry && entryExperience === "guided"
        ? "prediction"
        : guidedEntry && entryExperience === "demo"
        ? "learn"
        : initialLessonMode,
  });

  useEffect(() => {
    if (entryExperience !== "guided") {
      return;
    }

    try {
      if (window.localStorage.getItem(GUIDED_ENTRY_ONBOARDING_KEY) === "seen") {
        const frame = window.requestAnimationFrame(() =>
          setShowEntryOnboarding(false)
        );

        return () => window.cancelAnimationFrame(frame);
      }
    } catch {
      return;
    }
  }, [entryExperience]);

  function dismissEntryOnboarding() {
    setShowEntryOnboarding(false);

    try {
      window.localStorage.setItem(GUIDED_ENTRY_ONBOARDING_KEY, "seen");
    } catch {
      return;
    }
  }

  function markEntryInteraction() {
    if (showEntryOnboarding) {
      dismissEntryOnboarding();
    }
  }

  const lessonModeToggle = (
    <LessonModeToggle
      value={lesson.lessonMode}
      onChange={lesson.setLessonMode}
    />
  );
  const lessonControls = renderControls(lesson);

  const predictionCard =
    lesson.lessonMode === "prediction" ? (
      <PredictionCheckpointCard
        checkpoint={lesson.prediction.checkpoint}
        feedback={lesson.prediction.feedback}
        askedCount={lesson.prediction.askedCount}
        correctCount={lesson.prediction.correctCount}
        onSelect={lesson.prediction.submitPrediction}
        variant={guidedEntry ? "guided" : "default"}
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
  const guidedReplayItems = learningExperience.replayVariations
    .filter((variation) =>
      ["edge", "adversarial", "mutation"].includes(variation.kind)
    )
    .slice(0, 2);
  const guidedReplayPanel = learningExperience.problem ? (
    <ReplayVariationsPanel
      variant="guided"
      items={
        guidedReplayItems.length > 0
          ? guidedReplayItems
          : learningExperience.replayVariations.slice(0, 2)
      }
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
      {lessonControls}
      {predictionCard}
      {progressiveDisclosure.panels.replay ? replayPanel : null}
    </>
  );

  const whyPanel = (
    <WhyPanel
      insight={lesson.whyInsight}
      variant={guidedEntry ? "guided" : "default"}
    />
  );
  const completionFeedbackPanel = learningExperience.completionFeedback ? (
    <CompletionFeedbackPanel
      insight={learningExperience.completionFeedback}
      variant={guidedEntry ? "guided" : "default"}
    />
  ) : null;
  const supplementalOutput = renderOutput ? renderOutput(lesson) : null;

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
    lessonControls,
    predictionCard,
    replayPanel,
    guidedReplayPanel,
    whyPanel,
    completionFeedback: completionFeedbackPanel,
    controls,
    visualization: renderVisualization(lesson),
    microscope: renderMicroscope(lesson),
    tracePanel,
    codePanel: progressiveDisclosure.panels.code ? renderCodePanel(lesson) : null,
    entryExperience,
    guidedEntry,
    showEntryOnboarding,
    dismissEntryOnboarding,
    markEntryInteraction,
    supplementalOutput,
    output: (
      <>
        {supplementalOutput}
        {progressiveDisclosure.panels.completion ? completionFeedbackPanel : null}
        {progressiveDisclosure.panels.intelligence
          ? learningIntelligencePanel
          : null}
      </>
    ),
  });
}
