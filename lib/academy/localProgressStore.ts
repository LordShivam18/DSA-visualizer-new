import {
  ACADEMY_MODES,
  ACADEMY_SCHEMA_VERSION,
  type AcademyMode,
  type LearningPlatformState,
  type ModeProgress,
} from "./models";

const PROGRESS_STORAGE_KEY = "guided-dsa-learning-platform:v1";
const ANONYMOUS_USER_ID_STORAGE_KEY = "guided-dsa:anonymous-user-id:v1";
const GUIDED_ENTRY_ONBOARDING_KEY = "guided-dsa:first-problem-overlay:v1";

type ProgressListener = (state: LearningPlatformState) => void;

function isBrowser() {
  return typeof window !== "undefined";
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asNonNegativeNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : 0;
}

function isAcademyMode(value: unknown): value is AcademyMode {
  return ACADEMY_MODES.includes(value as AcademyMode);
}

function normalizeActiveModes(value: unknown) {
  if (!isObjectRecord(value)) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(([, mode]) => isAcademyMode(mode))
  ) as Record<string, AcademyMode>;
}

function parseProgress(raw: string | null): LearningPlatformState {
  const defaults = createDefaultLearningState();

  if (!raw) {
    return defaults;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<LearningPlatformState>;

    if (!parsed || parsed.schemaVersion !== ACADEMY_SCHEMA_VERSION) {
      return defaults;
    }

    const learner = (
      isObjectRecord(parsed.learner) ? parsed.learner : {}
    ) as Partial<LearningPlatformState["learner"]>;
    const nextState: LearningPlatformState = {
      schemaVersion: ACADEMY_SCHEMA_VERSION,
      learner: {
        plan: learner.plan === "premium" ? "premium" : defaults.learner.plan,
        streakDays: asNonNegativeNumber(learner.streakDays),
        totalStudyMinutes: asNonNegativeNumber(learner.totalStudyMinutes),
        problemsCompleted: asNonNegativeNumber(learner.problemsCompleted),
        lastActiveAt:
          typeof learner.lastActiveAt === "string" ? learner.lastActiveAt : null,
        preferredMode: isAcademyMode(learner.preferredMode)
          ? learner.preferredMode
          : defaults.learner.preferredMode,
      },
      problems: isObjectRecord(parsed.problems)
        ? (parsed.problems as LearningPlatformState["problems"])
        : {},
      topics: isObjectRecord(parsed.topics)
        ? (parsed.topics as LearningPlatformState["topics"])
        : {},
      sessions: Array.isArray(parsed.sessions)
        ? (parsed.sessions as LearningPlatformState["sessions"])
        : [],
      activeModes: normalizeActiveModes(parsed.activeModes),
    };

    if (nextState.learner.lastActiveAt === null && nextState.learner.streakDays > 0) {
      nextState.learner.streakDays = 0;
    }

    return nextState;
  } catch {
    return defaults;
  }
}

function readStringValue(key: string) {
  if (!isBrowser()) {
    return null;
  }

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStringValue(key: string, value: string) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}

function createAnonymousUserId() {
  if (
    isBrowser() &&
    "crypto" in window &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return `guest-${window.crypto.randomUUID()}`;
  }

  return `guest-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

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

export function getProgress() {
  if (!isBrowser()) {
    return createDefaultLearningState();
  }

  return parseProgress(readStringValue(PROGRESS_STORAGE_KEY));
}

export function saveProgress(state: LearningPlatformState) {
  if (!isBrowser()) {
    return state;
  }

  const nextState = {
    ...state,
    schemaVersion: ACADEMY_SCHEMA_VERSION,
  };

  try {
    window.localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(nextState));
  } catch {
    return state;
  }

  return nextState;
}

export function subscribeToProgress(listener: ProgressListener) {
  if (!isBrowser()) {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key !== PROGRESS_STORAGE_KEY) {
      return;
    }

    listener(parseProgress(event.newValue));
  };

  window.addEventListener("storage", handleStorage);

  return () => {
    window.removeEventListener("storage", handleStorage);
  };
}

export function createSessionId(problemId: string, mode: AcademyMode) {
  return `${problemId}:${mode}:${Date.now().toString(36)}:${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function getAnonymousUserId() {
  const existingUserId = readStringValue(ANONYMOUS_USER_ID_STORAGE_KEY);

  if (existingUserId) {
    return existingUserId;
  }

  const nextUserId = createAnonymousUserId();
  writeStringValue(ANONYMOUS_USER_ID_STORAGE_KEY, nextUserId);
  return nextUserId;
}

export function hasSeenGuidedEntryOnboarding() {
  return readStringValue(GUIDED_ENTRY_ONBOARDING_KEY) === "seen";
}

export function markGuidedEntryOnboardingSeen() {
  writeStringValue(GUIDED_ENTRY_ONBOARDING_KEY, "seen");
}
