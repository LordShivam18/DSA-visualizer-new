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

/* ---------------------------------- */
/* ✅ SAFE STORAGE ACCESS (CRITICAL)  */
/* ---------------------------------- */

function getStorage(): Storage | null {
if (typeof window === "undefined") return null;

try {
return window.localStorage;
} catch {
return null;
}
}

/* ---------------------------------- */
/* 🧠 HELPERS                         */
/* ---------------------------------- */

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
if (!isObjectRecord(value)) return {};

return Object.fromEntries(
Object.entries(value).filter(([, mode]) => isAcademyMode(mode))
) as Record<string, AcademyMode>;
}

/* ---------------------------------- */
/* 📦 STORAGE READ / WRITE            */
/* ---------------------------------- */

function readStringValue(key: string) {
const storage = getStorage();
if (!storage) return null;

try {
return storage.getItem(key);
} catch {
return null;
}
}

function writeStringValue(key: string, value: string) {
const storage = getStorage();
if (!storage) return;

try {
storage.setItem(key, value);
} catch {
return;
}
}

/* ---------------------------------- */
/* 🧾 STATE PARSING                   */
/* ---------------------------------- */

function parseProgress(raw: string | null): LearningPlatformState {
const defaults = createDefaultLearningState();

if (!raw) return defaults;

try {
const parsed = JSON.parse(raw) as Partial<LearningPlatformState>;

```
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

if (
  nextState.learner.lastActiveAt === null &&
  nextState.learner.streakDays > 0
) {
  nextState.learner.streakDays = 0;
}

return nextState;
```

} catch {
return defaults;
}

// ✅ CRITICAL: ensures TypeScript never complains
return defaults;
}

/* ---------------------------------- */
/* 🆔 USER + SESSION                  */
/* ---------------------------------- */

function createAnonymousUserId() {
if (typeof window !== "undefined" && window.crypto?.randomUUID) {
return `guest-${window.crypto.randomUUID()}`;
}

return `guest-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function createSessionId(problemId: string, mode: AcademyMode) {
if (typeof window !== "undefined" && window.crypto?.randomUUID) {
return `${problemId}:${mode}:${window.crypto.randomUUID()}`;
}

return `${problemId}:${mode}:${Date.now().toString(36)}:${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

/* ---------------------------------- */
/* 🏗 DEFAULT STATE                   */
/* ---------------------------------- */

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

/* ---------------------------------- */
/* 🚀 PUBLIC API                      */
/* ---------------------------------- */

export function getProgress() {
return parseProgress(readStringValue(PROGRESS_STORAGE_KEY));
}

export function saveProgress(state: LearningPlatformState) {
const nextState = {
...state,
schemaVersion: ACADEMY_SCHEMA_VERSION,
};

writeStringValue(PROGRESS_STORAGE_KEY, JSON.stringify(nextState));
return nextState;
}

export function subscribeToProgress(listener: ProgressListener) {
if (typeof window === "undefined") return () => undefined;

const handleStorage = (event: StorageEvent) => {
if (event.key !== PROGRESS_STORAGE_KEY) return;
listener(parseProgress(event.newValue));
};

window.addEventListener("storage", handleStorage);

return () => {
window.removeEventListener("storage", handleStorage);
};
}

/* ---------------------------------- */
/* 👤 USER UTILITIES                  */
/* ---------------------------------- */

export function getAnonymousUserId() {
const existing = readStringValue(ANONYMOUS_USER_ID_STORAGE_KEY);
if (existing) return existing;

const next = createAnonymousUserId();
writeStringValue(ANONYMOUS_USER_ID_STORAGE_KEY, next);
return next;
}

export function hasSeenGuidedEntryOnboarding() {
return readStringValue(GUIDED_ENTRY_ONBOARDING_KEY) === "seen";
}

export function markGuidedEntryOnboardingSeen() {
writeStringValue(GUIDED_ENTRY_ONBOARDING_KEY, "seen");
}
