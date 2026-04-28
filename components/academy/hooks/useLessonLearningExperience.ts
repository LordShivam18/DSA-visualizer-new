"use client";

import { useMemo } from "react";

import { usePathname } from "next/navigation";

import { buildCompletionFeedback } from "@/lib/academy/completionFeedbackEngine";
import { buildGuidedLearningPath } from "@/lib/academy/learningPathEngine";
import { buildLessonIntelligence } from "@/lib/academy/lessonCoachEngine";
import { buildPatternRecognition } from "@/lib/academy/patternEngine";
import { getMistakePreview } from "@/lib/academy/mistakeEngine";
import type { PredictionFeedback } from "@/lib/academy/models";
import { getProblemByPath } from "@/lib/academy/problemRegistry";
import { buildReplayVariations } from "@/lib/academy/variationEngine";
import type { WhyExplanation, WhyStepLike } from "@/lib/academy/whyEngine";

import { useProgressTracker } from "./useProgressTracker";

export type LessonMistakeInsight = {
  state: "watch" | "correct" | "repair";
  title: string;
  detail: string;
  support: string;
  patternLabel?: string;
  severity?: "low" | "medium" | "high";
  confidence?: number;
  evidence?: string[];
};

export function useLessonLearningExperience<Step extends WhyStepLike>({
  defaultInputs,
  inputs,
  step,
  stepIndex,
  totalSteps,
  whyInsight,
  feedback,
  predictionAccuracy,
}: {
  defaultInputs: Record<string, string>;
  inputs: Record<string, string>;
  step: Step;
  stepIndex: number;
  totalSteps: number;
  whyInsight: WhyExplanation | null;
  feedback: PredictionFeedback | null;
  predictionAccuracy: number;
}) {
  const pathname = usePathname();
  const problem = useMemo(
    () => (pathname ? getProblemByPath(pathname) : null),
    [pathname]
  );
  const progress = useProgressTracker(problem?.id);

  const pattern = useMemo(
    () => (problem ? buildPatternRecognition(problem) : null),
    [problem]
  );
  const replayVariations = useMemo(
    () =>
      problem ? buildReplayVariations(problem, inputs, defaultInputs) : [],
    [defaultInputs, inputs, problem]
  );
  const guidedPath = useMemo(
    () =>
      problem ? buildGuidedLearningPath(problem, progress.recommendations) : null,
    [problem, progress.recommendations]
  );
  const learningIntelligence = useMemo(() => {
    if (!problem) {
      return null;
    }

    return buildLessonIntelligence({
      problem,
      learner: progress.learner,
      problemProgress: progress.problemProgress,
      topicProgress: progress.topicProgress,
      learningInsights: progress.learningInsights,
      pattern,
      whyInsight,
      feedback,
      recommendations: progress.recommendations,
      variations: replayVariations,
      predictionAccuracy,
    });
  }, [
    feedback,
    pattern,
    predictionAccuracy,
    problem,
    progress,
    replayVariations,
    whyInsight,
  ]);

  const mistakeInsight = useMemo<LessonMistakeInsight | null>(() => {
    if (!problem) {
      return null;
    }

    const preview = getMistakePreview(step);

    if (feedback && !feedback.correct) {
      const mistakePattern = feedback.mistakePattern;

      return {
        state: "repair",
        title: mistakePattern?.label ?? "Reasoning pattern detected",
        detail: mistakePattern?.message ?? feedback.diagnosis ?? feedback.explanation,
        support:
          mistakePattern?.repairAction ??
          "Use the why panel and replay controls to correct the same step on a new case before the pattern hardens.",
        patternLabel: mistakePattern?.family,
        severity: mistakePattern?.severity,
        confidence: mistakePattern?.confidence,
        evidence: mistakePattern?.evidence,
      };
    }

    if (feedback && feedback.correct) {
      return {
        state: "correct",
        title: "Reasoning check passed",
        detail: feedback.explanation,
        support:
          "The next step is unlocked. Try to predict the following transition without leaning on the explanation text.",
      };
    }

    return {
      state: "watch",
      title: preview.title,
      detail: preview.detail,
      support: preview.repairAction,
      patternLabel: preview.patternLabel,
    };
  }, [feedback, problem, step]);

  const completionFeedback = useMemo(() => {
    if (!problem) {
      return null;
    }

    return buildCompletionFeedback({
      problem,
      step,
      stepIndex,
      totalSteps,
      predictionAccuracy,
      feedback,
      pattern,
      variations: replayVariations,
      guidedPath,
    });
  }, [
    feedback,
    guidedPath,
    pattern,
    predictionAccuracy,
    problem,
    replayVariations,
    step,
    stepIndex,
    totalSteps,
  ]);

  return {
    problem,
    pattern,
    guidedPath,
    replayVariations,
    learningIntelligence,
    mistakeInsight,
    completionFeedback,
  };
}
