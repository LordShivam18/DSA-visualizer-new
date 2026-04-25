"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

import { topicCatalog } from "@/lib/academy/catalog";
import type {
  AcademyMode,
  LearningPlatformState,
  ModeProgress,
  ProblemProgress,
  SessionRecord,
  TopicProgress,
} from "@/lib/academy/models";
import {
  createDefaultLearningState,
  createEmptyModeProgress,
  loadLearningState,
  saveLearningState,
} from "@/lib/academy/storage";

type LearningPlatformContextValue = {
  state: LearningPlatformState;
  isHydrated: boolean;
  setActiveMode: (problemId: string, mode: AcademyMode) => void;
  recordSession: (session: SessionRecord) => void;
};

type Action =
  | { type: "hydrate"; payload: LearningPlatformState }
  | { type: "set-mode"; payload: { problemId: string; mode: AcademyMode } }
  | { type: "record-session"; payload: SessionRecord };

const LearningPlatformContext =
  createContext<LearningPlatformContextValue | null>(null);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function average(currentAverage: number, currentCount: number, nextValue: number) {
  if (currentCount <= 0) {
    return round(nextValue);
  }

  return round((currentAverage * currentCount + nextValue) / (currentCount + 1));
}

function mergeWeakSignals(previous: string[], next: string[]) {
  return Array.from(new Set([...previous, ...next])).slice(0, 8);
}

function dayKey(value: string) {
  return value.slice(0, 10);
}

function updateStreak(lastActiveAt: string | null, nextActiveAt: string) {
  if (!lastActiveAt) {
    return 1;
  }

  const lastDay = Date.parse(dayKey(lastActiveAt));
  const nextDay = Date.parse(dayKey(nextActiveAt));
  const difference = Math.round((nextDay - lastDay) / 86400000);

  if (difference <= 0) {
    return null;
  }

  if (difference === 1) {
    return "increment";
  }

  return "reset";
}

function computeProblemMastery(problem: ProblemProgress) {
  const completionRate =
    problem.attempts === 0 ? 0 : (problem.completions / problem.attempts) * 100;
  const hintPenalty = Math.min(problem.hintsUsed * 2, 22);
  const timeBonus =
    problem.averageTimeMs <= 180000
      ? 14
      : problem.averageTimeMs <= 300000
      ? 8
      : 3;

  return clamp(
    Math.round(problem.accuracy * 0.58 + completionRate * 0.24 + timeBonus - hintPenalty),
    0,
    100
  );
}

function computeTopicMastery(topic: TopicProgress) {
  const completionRate =
    topic.attempts === 0 ? 0 : (topic.completions / topic.attempts) * 100;

  return clamp(
    Math.round(topic.accuracy * 0.62 + completionRate * 0.28 + Math.min(topic.attempts * 2, 10)),
    0,
    100
  );
}

function ensureTopicProgress(state: LearningPlatformState, session: SessionRecord) {
  return (
    state.topics[session.topicId] ?? {
      topicId: session.topicId,
      topicLabel: session.topicLabel,
      attempts: 0,
      completions: 0,
      accuracy: 0,
      averageTimeMs: 0,
      mastery: 0,
      weakSignals: [],
      lastPracticedAt: null,
    }
  );
}

function ensureProblemProgress(state: LearningPlatformState, session: SessionRecord) {
  return (
    state.problems[session.problemId] ?? {
      problemId: session.problemId,
      slug: session.route.split("/").pop() ?? session.problemId,
      title: session.problemTitle,
      route: session.route,
      topicId: session.topicId,
      topicLabel: session.topicLabel,
      difficulty: session.difficulty,
      attempts: 0,
      completions: 0,
      accuracy: 0,
      bestAccuracy: 0,
      averageTimeMs: 0,
      fastestTimeMs: null,
      hintsUsed: 0,
      weakSignals: [],
      lastPracticedAt: null,
      mastery: 0,
      modeStats: createEmptyModeProgress(),
    }
  );
}

function updateModeProgress(
  current: ModeProgress,
  session: SessionRecord
): ModeProgress {
  const attempts = current.attempts + 1;
  const completions = current.completions + (session.completed ? 1 : 0);

  return {
    attempts,
    completions,
    accuracy: average(current.accuracy, current.attempts, session.evaluation.accuracy),
    averageTimeMs: average(current.averageTimeMs, current.attempts, session.durationMs),
    hintsUsed: current.hintsUsed + session.hintsUsed,
  };
}

function reduceSession(state: LearningPlatformState, session: SessionRecord) {
  const previousProblem = ensureProblemProgress(state, session);
  const previousTopic = ensureTopicProgress(state, session);
  const previousMode = previousProblem.modeStats[session.mode];

  const nextProblem: ProblemProgress = {
    ...previousProblem,
    attempts: previousProblem.attempts + 1,
    completions: previousProblem.completions + (session.completed ? 1 : 0),
    accuracy: average(previousProblem.accuracy, previousProblem.attempts, session.evaluation.accuracy),
    bestAccuracy: Math.max(previousProblem.bestAccuracy, session.evaluation.accuracy),
    averageTimeMs: average(previousProblem.averageTimeMs, previousProblem.attempts, session.durationMs),
    fastestTimeMs:
      previousProblem.fastestTimeMs === null
        ? session.durationMs
        : Math.min(previousProblem.fastestTimeMs, session.durationMs),
    hintsUsed: previousProblem.hintsUsed + session.hintsUsed,
    weakSignals: mergeWeakSignals(previousProblem.weakSignals, session.evaluation.weakSignals),
    lastPracticedAt: session.endedAt,
    modeStats: {
      ...previousProblem.modeStats,
      [session.mode]: updateModeProgress(previousMode, session),
    },
    mastery: 0,
  };

  nextProblem.mastery = computeProblemMastery(nextProblem);

  const nextTopic: TopicProgress = {
    ...previousTopic,
    attempts: previousTopic.attempts + 1,
    completions: previousTopic.completions + (session.completed ? 1 : 0),
    accuracy: average(previousTopic.accuracy, previousTopic.attempts, session.evaluation.accuracy),
    averageTimeMs: average(previousTopic.averageTimeMs, previousTopic.attempts, session.durationMs),
    weakSignals: mergeWeakSignals(previousTopic.weakSignals, session.evaluation.weakSignals),
    lastPracticedAt: session.endedAt,
    mastery: 0,
  };

  nextTopic.mastery = computeTopicMastery(nextTopic);

  const streakChange = updateStreak(state.learner.lastActiveAt, session.endedAt);
  const solvedForFirstTime = previousProblem.completions === 0 && session.completed;

  return {
    ...state,
    learner: {
      ...state.learner,
      totalStudyMinutes: round(state.learner.totalStudyMinutes + session.durationMs / 60000),
      problemsCompleted: state.learner.problemsCompleted + (solvedForFirstTime ? 1 : 0),
      lastActiveAt: session.endedAt,
      preferredMode: session.mode,
      streakDays:
        streakChange === "increment"
          ? state.learner.streakDays + 1
          : streakChange === "reset"
          ? 1
          : state.learner.streakDays,
    },
    problems: {
      ...state.problems,
      [session.problemId]: nextProblem,
    },
    topics: {
      ...state.topics,
      [session.topicId]: nextTopic,
    },
    sessions: [session, ...state.sessions].slice(0, 40),
    activeModes: {
      ...state.activeModes,
      [session.problemId]: session.mode,
    },
  };
}

function reducer(state: LearningPlatformState, action: Action): LearningPlatformState {
  switch (action.type) {
    case "hydrate":
      return action.payload;
    case "set-mode":
      return {
        ...state,
        learner: {
          ...state.learner,
          preferredMode: action.payload.mode,
        },
        activeModes: {
          ...state.activeModes,
          [action.payload.problemId]: action.payload.mode,
        },
      };
    case "record-session":
      return reduceSession(state, action.payload);
    default:
      return state;
  }
}

function seedMissingTopics(state: LearningPlatformState) {
  if (Object.keys(state.topics).length >= topicCatalog.length) {
    return state;
  }

  const nextTopics: Record<string, TopicProgress> = { ...state.topics };

  topicCatalog.forEach((topic) => {
    if (!nextTopics[topic.id]) {
      nextTopics[topic.id] = {
        topicId: topic.id,
        topicLabel: topic.label,
        attempts: 0,
        completions: 0,
        accuracy: 0,
        averageTimeMs: 0,
        mastery: 0,
        weakSignals: [],
        lastPracticedAt: null,
      };
    }
  });

  return {
    ...state,
    topics: nextTopics,
  };
}

export function LearningPlatformProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, undefined, () =>
    seedMissingTopics(createDefaultLearningState())
  );
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const stored = loadLearningState();

    if (stored) {
      dispatch({
        type: "hydrate",
        payload: seedMissingTopics(stored),
      });
    }

    hasLoadedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hasLoadedRef.current) {
      return;
    }

    saveLearningState(state);
  }, [state]);

  const value = useMemo<LearningPlatformContextValue>(
    () => ({
      state,
      isHydrated: true,
      setActiveMode: (problemId, mode) =>
        dispatch({ type: "set-mode", payload: { problemId, mode } }),
      recordSession: (session) =>
        startTransition(() => {
          dispatch({ type: "record-session", payload: session });
        }),
    }),
    [state]
  );

  return (
    <LearningPlatformContext.Provider value={value}>
      {children}
    </LearningPlatformContext.Provider>
  );
}

export function useLearningPlatform() {
  const context = useContext(LearningPlatformContext);

  if (!context) {
    throw new Error("useLearningPlatform must be used inside LearningPlatformProvider.");
  }

  return context;
}
