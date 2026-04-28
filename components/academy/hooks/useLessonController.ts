"use client";

import type { Dispatch, SetStateAction } from "react";
import { useEffect, useMemo, useState } from "react";

import type {
  TimelineAnimation,
  TimelineStep,
} from "@/components/core/animation/TimelineEngine";
import { useTimeline } from "@/components/core/animation/useTimeline";

import { usePredictionEngine } from "./usePredictionEngine";
import { useWhyPanel } from "./useWhyPanel";
import type { LessonFeatureMode } from "../LessonModeToggle";

export type LessonStepLike = {
  step: number;
  state: unknown;
  action: string;
  actionKind?: string;
  beginnerNote?: string;
  expertNote?: string;
  explanationBeginner?: string;
  explanationExpert?: string;
  highlights?: unknown;
  animation?: TimelineAnimation;
  focus?: string;
  hints?: string[];
  done?: boolean;
};

export type TeachingMode = "beginner" | "expert";

type LessonTimelineStep<Step extends LessonStepLike> = Step &
  TimelineStep<
    Step["state"],
    Step extends { highlights?: infer Highlights } ? Highlights : null
  >;

export type LessonControllerState<
  TInputs extends Record<string, string>,
  Step extends LessonStepLike
> = {
  sessionKey: string;
  inputs: TInputs;
  setInputs: Dispatch<SetStateAction<TInputs>>;
  trace: Step[];
  step: LessonTimelineStep<Step>;
  timeline: ReturnType<typeof useTimeline<LessonTimelineStep<Step>>>;
  teachingMode: TeachingMode;
  setTeachingMode: Dispatch<SetStateAction<TeachingMode>>;
  lessonMode: LessonFeatureMode;
  setLessonMode: (nextMode: LessonFeatureMode) => void;
  currentNarration: string;
  whyInsight: ReturnType<typeof useWhyPanel<Step>>;
  prediction: ReturnType<typeof usePredictionEngine<Step>>;
  run: (nextInputs?: TInputs) => void;
  resetLesson: () => void;
};

function resolveNarration(step: LessonStepLike, mode: TeachingMode) {
  if (mode === "expert") {
    return (
      step.expertNote?.trim() ||
      step.explanationExpert?.trim() ||
      step.beginnerNote?.trim() ||
      step.explanationBeginner?.trim() ||
      step.action
    );
  }

  return (
    step.beginnerNote?.trim() ||
    step.explanationBeginner?.trim() ||
    step.expertNote?.trim() ||
    step.explanationExpert?.trim() ||
    step.action
  );
}

function normalizeTimelineStep<Step extends LessonStepLike>(
  step: Step
): LessonTimelineStep<Step> {
  const defaultAnimation: TimelineAnimation = {
    type: "highlight",
    targets: [],
    duration: 650,
  };

  return {
    ...step,
    highlights: (step.highlights ?? null) as LessonTimelineStep<Step>["highlights"],
    animation: step.animation ?? defaultAnimation,
  };
}

export function useLessonController<
  TInputs extends Record<string, string>,
  Step extends LessonStepLike
>({
  defaultInputs,
  generateTrace,
  initialTeachingMode = "beginner",
  initialLessonMode = "learn",
}: {
  defaultInputs: TInputs;
  generateTrace: (inputs: TInputs) => Step[];
  initialTeachingMode?: TeachingMode;
  initialLessonMode?: LessonFeatureMode;
}): LessonControllerState<TInputs, Step> {
  const [inputs, setInputs] = useState<TInputs>(defaultInputs);
  const [trace, setTrace] = useState<Step[]>(() => generateTrace(defaultInputs));
  const [teachingMode, setTeachingMode] =
    useState<TeachingMode>(initialTeachingMode);
  const [lessonMode, setLessonModeState] =
    useState<LessonFeatureMode>(initialLessonMode);
  const [cycleId, setCycleId] = useState(0);

  const timelineTrace = useMemo(
    () => trace.map((item) => normalizeTimelineStep(item)),
    [trace]
  );
  const timeline = useTimeline(timelineTrace);
  const step = timeline.activeStep ?? timelineTrace[0];
  const { pause, play, reset, setLockedSteps } = timeline;
  const predictionTimeline = useMemo(
    () => ({
      pause,
      resume: play,
    }),
    [pause, play]
  );
  const resetKey = useMemo(
    () => `${cycleId}:${lessonMode}:${JSON.stringify(inputs)}`,
    [cycleId, inputs, lessonMode]
  );
  const prediction = usePredictionEngine({
    trace,
    activeIndex: timeline.activeIndex,
    enabled: lessonMode === "prediction",
    resetKey,
    timeline: predictionTimeline,
  });
  const whyInsight = useWhyPanel(step);

  useEffect(() => {
    if (lessonMode === "prediction") {
      setLockedSteps(
        prediction.lockedStepIndices,
        "Answer the prediction to unlock the next step."
      );
      return;
    }

    setLockedSteps([]);
  }, [lessonMode, prediction.lockedStepIndices, setLockedSteps]);

  function run(nextInputs = inputs) {
    pause();
    setInputs(nextInputs);
    setTrace(generateTrace(nextInputs));
    setCycleId((current) => current + 1);
  }

  function setLessonMode(nextMode: LessonFeatureMode) {
    if (nextMode === lessonMode) {
      return;
    }

    pause();
    reset();
    setLessonModeState(nextMode);
    setCycleId((current) => current + 1);
  }

  function resetLesson() {
    pause();
    reset();
    setCycleId((current) => current + 1);
  }

  return {
    sessionKey: resetKey,
    inputs,
    setInputs,
    trace,
    step,
    timeline,
    teachingMode,
    setTeachingMode,
    lessonMode,
    setLessonMode,
    currentNarration: step ? resolveNarration(step, teachingMode) : "",
    whyInsight,
    prediction,
    run,
    resetLesson,
  };
}
