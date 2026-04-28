"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  InterviewConfig,
  PracticeHint,
} from "@/lib/academy/models";

type InterviewEvaluation = {
  accuracy: number;
  correctness: boolean;
  efficiencyScore: number;
  confidenceScore: number;
  finalScore: number;
  weakSignals: string[];
  notes: string[];
};

type InterviewState = {
  resetKey: string;
  selectedStrategyId: string | null;
  answer: string;
  selfConfidence: number;
  hintRequests: number;
  timeRemainingSec: number;
  evaluation: InterviewEvaluation | null;
  timedOut: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function createInterviewState(resetKey: string, timeLimitSec: number): InterviewState {
  return {
    resetKey,
    selectedStrategyId: null,
    answer: "",
    selfConfidence: 60,
    hintRequests: 0,
    timeRemainingSec: timeLimitSec,
    evaluation: null,
    timedOut: false,
  };
}

function buildInterviewEvaluation({
  state,
  config,
  expectedAnswer,
  correctStrategyId,
  didTimeOut,
}: {
  state: InterviewState;
  config: InterviewConfig;
  expectedAnswer: string;
  correctStrategyId: string;
  didTimeOut: boolean;
}): InterviewEvaluation {
  const answerCorrect = normalize(state.answer) === normalize(expectedAnswer);
  const strategyCorrect = state.selectedStrategyId === correctStrategyId;
  const accuracy = (answerCorrect ? 75 : 0) + (strategyCorrect ? 25 : 0);
  const timeRatio =
    config.timeLimitSec === 0 ? 0 : state.timeRemainingSec / config.timeLimitSec;
  const efficiencyScore = clamp(
    Math.round(
      (answerCorrect ? 52 : 18) +
        timeRatio * 28 +
        (strategyCorrect ? 12 : 0) -
        state.hintRequests * 12
    ),
    0,
    100
  );
  const confidenceScore = clamp(
    Math.round(
      state.selfConfidence * 0.62 +
        (answerCorrect ? 24 : -8) +
        (strategyCorrect ? 10 : 0) +
        timeRatio * 12 -
        state.hintRequests * 8
    ),
    0,
    100
  );
  const finalScore = clamp(
    Math.round(accuracy * 0.5 + efficiencyScore * 0.28 + confidenceScore * 0.22),
    0,
    100
  );
  const weakSignals: string[] = [];
  const notes = [
    answerCorrect
      ? "Your answer is interview-correct."
      : "Your final answer would not pass a correctness check yet.",
    strategyCorrect
      ? "Your chosen strategy fits the problem constraints."
      : "Your reasoning path needs a better first principle.",
    didTimeOut
      ? "The timer expired, so pacing became part of the evaluation."
      : "You submitted before time expired, which helps the pacing score.",
  ];

  if (!answerCorrect) {
    weakSignals.push("interview correctness");
  }

  if (!strategyCorrect) {
    weakSignals.push("strategy articulation");
  }

  if (state.hintRequests > 0) {
    weakSignals.push("independent recall");
  }

  return {
    accuracy,
    correctness: answerCorrect && strategyCorrect,
    efficiencyScore,
    confidenceScore,
    finalScore,
    weakSignals,
    notes,
  };
}

function finalizeInterviewState({
  state,
  config,
  expectedAnswer,
  correctStrategyId,
  didTimeOut,
}: {
  state: InterviewState;
  config: InterviewConfig;
  expectedAnswer: string;
  correctStrategyId: string;
  didTimeOut: boolean;
}) {
  if (state.evaluation) {
    return state;
  }

  return {
    ...state,
    timedOut: didTimeOut,
    timeRemainingSec: didTimeOut ? 0 : state.timeRemainingSec,
    evaluation: buildInterviewEvaluation({
      state,
      config,
      expectedAnswer,
      correctStrategyId,
      didTimeOut,
    }),
  };
}

export function useInterviewMode({
  config,
  hints,
  expectedAnswer,
  correctStrategyId,
  resetKey,
}: {
  config: InterviewConfig;
  hints: PracticeHint[];
  expectedAnswer: string;
  correctStrategyId: string;
  resetKey: string;
}) {
  const stableConfig = useMemo<InterviewConfig>(
    () => ({
      benchmarkMs: config.benchmarkMs,
      confidencePrompt: config.confidencePrompt,
      hintBudget: config.hintBudget,
      timeLimitSec: config.timeLimitSec,
    }),
    [
      config.benchmarkMs,
      config.confidencePrompt,
      config.hintBudget,
      config.timeLimitSec,
    ]
  );
  const [state, setState] = useState<InterviewState>(() =>
    createInterviewState(resetKey, stableConfig.timeLimitSec)
  );
  const currentState =
    state.resetKey === resetKey
      ? state
      : createInterviewState(resetKey, stableConfig.timeLimitSec);

  useEffect(() => {
    if (currentState.evaluation) {
      return;
    }

    const timer = window.setInterval(() => {
      setState((current) => {
        const base =
          current.resetKey === resetKey
            ? current
            : createInterviewState(resetKey, stableConfig.timeLimitSec);

        if (base.evaluation) {
          return base;
        }

        if (base.timeRemainingSec <= 1) {
          window.clearInterval(timer);

          return finalizeInterviewState({
            state: { ...base, timeRemainingSec: 0 },
            config: stableConfig,
            expectedAnswer,
            correctStrategyId,
            didTimeOut: true,
          });
        }

        return {
          ...base,
          timeRemainingSec: base.timeRemainingSec - 1,
        };
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    correctStrategyId,
    currentState.evaluation,
    expectedAnswer,
    resetKey,
    stableConfig,
  ]);

  function requestHint() {
    let granted = false;

    setState((current) => {
      const base =
        current.resetKey === resetKey
          ? current
          : createInterviewState(resetKey, stableConfig.timeLimitSec);

      if (base.hintRequests >= stableConfig.hintBudget || base.evaluation) {
        return base;
      }

      granted = true;

      return {
        ...base,
        hintRequests: base.hintRequests + 1,
      };
    });

    return granted;
  }

  function submitInterview() {
    let nextEvaluation: InterviewEvaluation | null = null;

    setState((current) => {
      const base =
        current.resetKey === resetKey
          ? current
          : createInterviewState(resetKey, stableConfig.timeLimitSec);
      const nextState = finalizeInterviewState({
        state: base,
        config: stableConfig,
        expectedAnswer,
        correctStrategyId,
        didTimeOut: false,
      });

      nextEvaluation = nextState.evaluation;
      return nextState;
    });

    return nextEvaluation;
  }

  return {
    selectedStrategyId: currentState.selectedStrategyId,
    setSelectedStrategyId: (nextValue: string | null) =>
      setState((current) => ({
        ...(current.resetKey === resetKey
          ? current
          : createInterviewState(resetKey, stableConfig.timeLimitSec)),
        selectedStrategyId: nextValue,
      })),
    answer: currentState.answer,
    setAnswer: (nextValue: string) =>
      setState((current) => ({
        ...(current.resetKey === resetKey
          ? current
          : createInterviewState(resetKey, stableConfig.timeLimitSec)),
        answer: nextValue,
      })),
    selfConfidence: currentState.selfConfidence,
    setSelfConfidence: (nextValue: number) =>
      setState((current) => ({
        ...(current.resetKey === resetKey
          ? current
          : createInterviewState(resetKey, stableConfig.timeLimitSec)),
        selfConfidence: nextValue,
      })),
    hintRequests: currentState.hintRequests,
    hintBudget: stableConfig.hintBudget,
    visibleHints: hints.slice(0, currentState.hintRequests),
    timeRemainingSec: currentState.timeRemainingSec,
    evaluation: currentState.evaluation,
    timedOut: currentState.timedOut,
    requestHint,
    submitInterview,
    resetInterview: () =>
      setState(createInterviewState(resetKey, stableConfig.timeLimitSec)),
  };
}
