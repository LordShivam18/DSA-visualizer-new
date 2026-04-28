export const ACADEMY_SCHEMA_VERSION = 1;

export const ACADEMY_MODES = [
  "learn",
  "prediction",
  "practice",
  "interview",
] as const;

export type AcademyMode = (typeof ACADEMY_MODES)[number];

export type Difficulty = "Easy" | "Medium" | "Hard";

export type AccentTone =
  | "cyan"
  | "violet"
  | "emerald"
  | "amber"
  | "rose"
  | "blue"
  | "slate";

export type TopicCatalogEntry = {
  id: string;
  label: string;
  route: string;
  accent: AccentTone;
  totalProblems: number;
  summary: string;
};

export type PracticeOption = {
  id: string;
  label: string;
  description: string;
  isCorrect?: boolean;
};

export type PracticeHint = {
  level: 1 | 2 | 3;
  title: string;
  body: string;
};

export type PracticeConfig = {
  answerLabel: string;
  answerPlaceholder?: string;
  strategyPrompt: string;
  strategyOptions: PracticeOption[];
  hints: PracticeHint[];
  solutionLabel: string;
};

export type InterviewConfig = {
  timeLimitSec: number;
  hintBudget: number;
  benchmarkMs: number;
  confidencePrompt: string;
};

export type ProblemCatalogEntry = {
  problemId: string;
  slug: string;
  title: string;
  route: string;
  topicId: string;
  topicLabel: string;
  difficulty: Difficulty;
  description: string;
  taxonomy: string;
  skillTags: string[];
  estimatedMinutes: number;
  premiumModes: AcademyMode[];
  practice?: PracticeConfig;
  interview?: InterviewConfig;
};

export type PredictionChoice = {
  id: string;
  label: string;
  detail?: string;
  isCorrect: boolean;
};

export type PredictionCheckpoint = {
  id: string;
  skill: string;
  prompt: string;
  explanation: string;
  choices: PredictionChoice[];
};

export type PredictionFeedback = {
  checkpointId: string;
  selectedChoiceId: string;
  correctChoiceId: string;
  correct: boolean;
  explanation: string;
  diagnosis?: string;
  mistakePattern?: MistakePatternClassification;
};

export type PredictionValidation = {
  correct: boolean;
  diagnosis?: string;
};

export type MistakePatternFamily =
  | "control-flow"
  | "state-management"
  | "invariant"
  | "calculation"
  | "termination"
  | "pattern-transfer";

export type MistakeSeverity = "low" | "medium" | "high";

export type MistakePatternClassification = {
  id: string;
  label: string;
  family: MistakePatternFamily;
  severity: MistakeSeverity;
  confidence: number;
  evidence: string[];
  repairAction: string;
  message: string;
};

export type AdaptiveRecommendation = {
  problemId: string;
  title: string;
  route: string;
  difficulty: Difficulty;
  topicLabel: string;
  reason: string;
  track: "repair" | "reinforce" | "stretch";
};

export type ModeProgress = {
  attempts: number;
  completions: number;
  accuracy: number;
  averageTimeMs: number;
  hintsUsed: number;
};

export type LearnerProfile = {
  plan: "premium";
  streakDays: number;
  totalStudyMinutes: number;
  problemsCompleted: number;
  lastActiveAt: string | null;
  preferredMode: AcademyMode;
};

export type UserProgress = {
  userId: string;
  lastActiveDate: string | null;
  streak: number;
  totalSolved: number;
};

export type ProblemProgress = {
  problemId: string;
  slug: string;
  title: string;
  route: string;
  topicId: string;
  topicLabel: string;
  difficulty: Difficulty;
  attempts: number;
  completions: number;
  accuracy: number;
  bestAccuracy: number;
  averageTimeMs: number;
  fastestTimeMs: number | null;
  hintsUsed: number;
  weakSignals: string[];
  lastPracticedAt: string | null;
  mastery: number;
  modeStats: Record<AcademyMode, ModeProgress>;
};

export type TopicProgress = {
  topicId: string;
  topicLabel: string;
  attempts: number;
  completions: number;
  accuracy: number;
  averageTimeMs: number;
  mastery: number;
  weakSignals: string[];
  lastPracticedAt: string | null;
};

export type PracticeSubmission = {
  strategyId: string | null;
  expectedAnswer: string;
  movePlan: string;
  selfConfidence: number;
};

export type InterviewSubmission = {
  strategyId: string | null;
  expectedAnswer: string;
  selfConfidence: number;
  timedOut: boolean;
};

export type SessionEvaluation = {
  accuracy: number;
  correctness: boolean;
  efficiencyScore: number;
  confidenceScore: number;
  finalScore: number;
  weakSignals: string[];
  notes: string[];
};

export type SessionRecord = {
  id: string;
  problemId: string;
  problemTitle: string;
  route: string;
  topicId: string;
  topicLabel: string;
  difficulty: Difficulty;
  mode: AcademyMode;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  inputSummary: string;
  hintsUsed: number;
  prediction: {
    asked: number;
    correct: number;
  };
  practice?: PracticeSubmission;
  interview?: InterviewSubmission & {
    timeLimitSec: number;
    timeRemainingSec: number;
  };
  evaluation: SessionEvaluation;
  completed: boolean;
};

export type LearningPlatformState = {
  schemaVersion: number;
  learner: LearnerProfile;
  problems: Record<string, ProblemProgress>;
  topics: Record<string, TopicProgress>;
  sessions: SessionRecord[];
  activeModes: Record<string, AcademyMode>;
};
