"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { buildTraceLessonSession } from "@/lib/academy/sessionBuilders";
import { updateStreakLocal } from "@/lib/academy/streakLocal";
import type { Problem } from "@/lib/academy/problemRegistry";

import type { LessonFeatureMode } from "../LessonModeToggle";
import { useLearningPlatform } from "../LearningPlatformProvider";

type CompletionStep = {
  done?: boolean;
  action: string;
};

const COMPLETION_CELEBRATION_DELAY_MS = 300;

export function useLessonCompletion({
  problem,
  inputs,
  step,
  stepIndex,
  totalSteps,
  mode,
  sessionKey,
  askedCount,
  correctCount,
}: {
  problem: Problem | null;
  inputs: Record<string, string>;
  step: CompletionStep;
  stepIndex: number;
  totalSteps: number;
  mode: LessonFeatureMode;
  sessionKey: string;
  askedCount: number;
  correctCount: number;
}) {
  const { state, recordSession } = useLearningPlatform();
  const sessionStartedAtRef = useRef(new Date().toISOString());
  const recordedSessionKeysRef = useRef<Set<string>>(new Set());
  const [celebrationSessionKey, setCelebrationSessionKey] = useState<string | null>(
    null
  );
  const isComplete = totalSteps > 0 && (step.done || stepIndex >= totalSteps - 1);

  useEffect(() => {
    sessionStartedAtRef.current = new Date().toISOString();
  }, [sessionKey]);

  useEffect(() => {
    if (
      !isComplete ||
      !problem ||
      recordedSessionKeysRef.current.has(sessionKey)
    ) {
      return;
    }

    recordedSessionKeysRef.current.add(sessionKey);
    const endedAt = new Date().toISOString();

    const celebrationTimeout = window.setTimeout(() => {
      setCelebrationSessionKey(sessionKey);
    }, COMPLETION_CELEBRATION_DELAY_MS);
    const session = buildTraceLessonSession({
      problem,
      mode,
      startedAt: sessionStartedAtRef.current,
      endedAt,
      durationMs: Math.max(
        1000,
        Date.parse(endedAt) - Date.parse(sessionStartedAtRef.current)
      ),
      inputs,
      askedCount,
      correctCount,
    });

    recordSession(session);

    return () => {
      window.clearTimeout(celebrationTimeout);
    };
  }, [
    askedCount,
    correctCount,
    inputs,
    isComplete,
    mode,
    problem,
    recordSession,
    sessionKey,
    state.learner,
  ]);

  const streakDays = useMemo(() => {
    if (celebrationSessionKey !== sessionKey) {
      return state.learner.streakDays;
    }

    return updateStreakLocal(state.learner, new Date()).streakDays;
  }, [celebrationSessionKey, sessionKey, state.learner]);

  return {
    isComplete,
    showCelebration: celebrationSessionKey === sessionKey,
    streakDays,
  };
}
