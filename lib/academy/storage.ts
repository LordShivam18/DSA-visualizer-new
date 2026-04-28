import {
  ACADEMY_MODES,
  ACADEMY_SCHEMA_VERSION,
  type AcademyMode,
  type LearningPlatformState,
  type ModeProgress,
} from "./models";

const STORAGE_KEY = "guided-dsa-learning-platform:v1";

export function createEmptyModeProgress(): Record<AcademyMode, ModeProgress> {
  return Object.fromEntries(
    ACADEMY_MODES.map((mode) => [
      mode,
      {
        attempts: 0,
        completions: 0,
        accuracy: 0,
        averageTimeMs: 0,
        hintsUsed: 0,
      },
    ])
  ) as Record<AcademyMode, ModeProgress>;
}

export function createDefaultLearningState(): LearningPlatformState {
  return {
    schemaVersion: ACADEMY_SCHEMA_VERSION,
    learner: {
      plan: "premium",
      streakDays: 0,
      totalStudyMinutes: 0,
      problemsCompleted: 0,
      lastActiveAt: null,
      preferredMode: "prediction",
    },
    problems: {},
    topics: {},
    sessions: [],
    activeModes: {},
  };
}

export function loadLearningState() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as LearningPlatformState;

    if (parsed.schemaVersion !== ACADEMY_SCHEMA_VERSION) {
      return null;
    }

    if (parsed.learner.lastActiveAt === null && parsed.learner.streakDays > 0) {
      parsed.learner.streakDays = 0;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveLearningState(state: LearningPlatformState) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    return;
  }
}

export function createSessionId(problemId: string, mode: AcademyMode) {
  return `${problemId}:${mode}:${Date.now().toString(36)}:${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}
