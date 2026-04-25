"use client";

import { useMemo } from "react";

import { academyProblemCatalog } from "@/lib/academy/catalog";
import { getAdaptiveRecommendations, getWeakTopicBreakdown } from "@/lib/academy/recommendations";

import { useLearningPlatform } from "../LearningPlatformProvider";

export function useProgressTracker(problemId?: string) {
  const { state, isHydrated } = useLearningPlatform();

  return useMemo(() => {
    const problemProgress = problemId ? state.problems[problemId] ?? null : null;
    const topicProgress = problemProgress
      ? state.topics[problemProgress.topicId] ?? null
      : null;
    const recentSessions = state.sessions.slice(0, 5);
    const weakTopics = getWeakTopicBreakdown(state).filter(
      (topic) => topic.attempts > 0
    );
    const solvedProblems = Object.values(state.problems).filter(
      (problem) => problem.completions > 0
    ).length;
    const averageAccuracy =
      state.sessions.length === 0
        ? 0
        : Math.round(
            state.sessions.reduce(
              (total, session) => total + session.evaluation.accuracy,
              0
            ) / state.sessions.length
          );

    return {
      isHydrated,
      learner: state.learner,
      problemProgress,
      topicProgress,
      recentSessions,
      weakTopics,
      recommendations: getAdaptiveRecommendations(state, problemId),
      totalProblems: academyProblemCatalog.length,
      solvedProblems,
      averageAccuracy,
      modeCoverage: Object.keys(state.activeModes).length,
    };
  }, [isHydrated, problemId, state]);
}
