"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { updateStreak } from "@/lib/academy/actions/updateStreak";
import { buildTraceLessonSession } from "@/lib/academy/sessionBuilders";
import type { UserProgress } from "@/lib/academy/models";
import type { Problem } from "@/lib/academy/problemRegistry";

import type { LessonFeatureMode } from "../LessonModeToggle";
import { useLearningPlatform } from "../LearningPlatformProvider";
import { useAnonymousUserId } from "./useAnonymousUserId";

type CompletionStep = {
  done?: boolean;
  action: string;
};

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
  const userId = useAnonymousUserId();
  const { state, recordSession } = useLearningPlatform();
  const sessionStartedAtRef = useRef(new Date().toISOString());
  const recordedSessionKeyRef = useRef<string | null>(null);
  const syncedSessionKeyRef = useRef<string | null>(null);
  const [serverProgress, setServerProgress] = useState<UserProgress | null>(null);
  const [celebrationSessionKey, setCelebrationSessionKey] = useState<string | null>(
    null
  );
  const isComplete = totalSteps > 0 && (step.done || stepIndex >= totalSteps - 1);

  useEffect(() => {
    sessionStartedAtRef.current = new Date().toISOString();
    recordedSessionKeyRef.current = null;
    syncedSessionKeyRef.current = null;
  }, [sessionKey]);

  useEffect(() => {
    if (!isComplete || !problem || recordedSessionKeyRef.current === sessionKey) {
      return;
    }

    recordedSessionKeyRef.current = sessionKey;
    const frame = window.requestAnimationFrame(() => {
      setCelebrationSessionKey(sessionKey);
    });

    const endedAt = new Date().toISOString();
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
      window.cancelAnimationFrame(frame);
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
  ]);

  useEffect(() => {
    if (
      !isComplete ||
      !userId ||
      syncedSessionKeyRef.current === sessionKey
    ) {
      return;
    }

    syncedSessionKeyRef.current = sessionKey;

    let cancelled = false;

    void updateStreak(userId)
      .then((nextProgress) => {
        if (!cancelled) {
          setServerProgress(nextProgress);
        }
      })
      .catch(() => {
        return;
      });

    return () => {
      cancelled = true;
    };
  }, [
    isComplete,
    sessionKey,
    userId,
  ]);

  const streakDays = useMemo(() => {
    if (serverProgress) {
      return serverProgress.streak;
    }

    return state.learner.streakDays;
  }, [serverProgress, state.learner.streakDays]);

  return {
    isComplete,
    showCelebration: celebrationSessionKey === sessionKey,
    streakDays,
    userProgress: serverProgress,
  };
}
