"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useSearchParams } from "next/navigation";

import {
  resolveLessonEntryExperience,
  type LessonEntryExperience,
} from "@/lib/academy/entryPoints";

const LEARNING_MODE_STORAGE_KEY = "guided-dsa:lesson-entry-mode:v1";

function readStoredLearningMode() {
  if (typeof window === "undefined") {
    return "default" as LessonEntryExperience;
  }

  try {
    return resolveLessonEntryExperience(
      window.localStorage.getItem(LEARNING_MODE_STORAGE_KEY)
    );
  } catch {
    return "default";
  }
}

function persistLearningMode(nextMode: LessonEntryExperience) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (nextMode === "default") {
      window.localStorage.removeItem(LEARNING_MODE_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(LEARNING_MODE_STORAGE_KEY, nextMode);
  } catch {
    return;
  }
}

export function useLearningMode() {
  const searchParams = useSearchParams();
  const queryEntry = searchParams.get("entry");
  const queryMode = useMemo(
    () => resolveLessonEntryExperience(queryEntry),
    [queryEntry]
  );
  const hasExplicitQuery = queryEntry !== null;
  const [learningMode, setLearningModeState] =
    useState<LessonEntryExperience>("default");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const nextMode = hasExplicitQuery ? queryMode : readStoredLearningMode();

    const frame = window.requestAnimationFrame(() => {
      setLearningModeState(nextMode);
      setIsReady(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [hasExplicitQuery, queryMode]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    persistLearningMode(learningMode);
  }, [isReady, learningMode]);

  const setLearningMode = useCallback((nextMode: LessonEntryExperience) => {
    setLearningModeState(nextMode);
    setIsReady(true);
    persistLearningMode(nextMode);
  }, []);

  return {
    learningMode,
    isReady,
    setLearningMode,
  };
}
