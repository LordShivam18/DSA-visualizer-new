"use client";

import { useMemo, useState } from "react";

import type { PracticeConfig } from "@/lib/academy/models";

type PracticeEvaluation = {
  accuracy: number;
  correct: boolean;
  answerCorrect: boolean;
  strategyCorrect: boolean;
  movePlanCredit: boolean;
  weakSignals: string[];
  notes: string[];
};

type PracticeState = {
  resetKey: string;
  selectedStrategyId: string | null;
  answer: string;
  movePlan: string;
  selfConfidence: number;
  hintLevel: number;
  evaluation: PracticeEvaluation | null;
  solutionUnlocked: boolean;
};

function createPracticeState(resetKey: string): PracticeState {
  return {
    resetKey,
    selectedStrategyId: null,
    answer: "",
    movePlan: "",
    selfConfidence: 65,
    hintLevel: 0,
    evaluation: null,
    solutionUnlocked: false,
  };
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function normalizeMoves(value: string) {
  return Array.from(
    new Set(
      value
        .toLowerCase()
        .match(/\d+\s*->\s*\d+/g)
        ?.map((item) => item.replace(/\s+/g, "")) ?? []
    )
  ).sort();
}

export function usePracticeMode({
  config,
  expectedAnswer,
  expectedMoves,
  resetKey,
}: {
  config: PracticeConfig;
  expectedAnswer: string;
  expectedMoves: string[];
  resetKey: string;
}) {
  const [state, setState] = useState<PracticeState>(() =>
    createPracticeState(resetKey)
  );
  const currentState =
    state.resetKey === resetKey ? state : createPracticeState(resetKey);
  const {
    selectedStrategyId,
    answer,
    movePlan,
    selfConfidence,
    hintLevel,
    evaluation,
    solutionUnlocked,
  } = currentState;

  const strategy = config.strategyOptions.find(
    (option) => option.id === selectedStrategyId
  );

  const visibleHints = useMemo(
    () => config.hints.slice(0, hintLevel),
    [config.hints, hintLevel]
  );

  function unlockNextHint() {
    setState((current) => {
      const base =
        current.resetKey === resetKey ? current : createPracticeState(resetKey);
      const nextLevel = Math.min(base.hintLevel + 1, config.hints.length);

      return {
        ...base,
        hintLevel: nextLevel,
        solutionUnlocked: nextLevel >= 3 ? true : base.solutionUnlocked,
      };
    });
  }

  function evaluateAttempt() {
    const answerCorrect = normalize(answer) === normalize(expectedAnswer);
    const strategyCorrect = strategy?.isCorrect === true;
    const expectedMoveTokens = normalizeMoves(expectedMoves.join(","));
    const moveTokens = normalizeMoves(movePlan);
    const movePlanCredit =
      moveTokens.length > 0 &&
      expectedMoveTokens.every((token) => moveTokens.includes(token));
    const accuracy =
      (answerCorrect ? 60 : 0) +
      (strategyCorrect ? 25 : 0) +
      (movePlanCredit ? 15 : 0);
    const notes = [
      answerCorrect
        ? "Your final profit matches the optimal answer."
        : "Your final profit is off; revisit how much each rising edge contributes.",
      strategyCorrect
        ? "You chose the correct greedy invariant."
        : "The right pattern is to collect every positive adjacent delta.",
      movePlanCredit
        ? "Your move plan captures each profitable segment cleanly."
        : "List the profitable day-to-day moves to pressure-test your reasoning.",
    ];
    const weakSignals: string[] = [];

    if (!answerCorrect) {
      weakSignals.push("final-answer accuracy");
    }

    if (!strategyCorrect) {
      weakSignals.push("greedy pattern selection");
    }

    if (!movePlanCredit) {
      weakSignals.push("transaction decomposition");
    }

    const nextEvaluation: PracticeEvaluation = {
      accuracy,
      correct: answerCorrect && strategyCorrect,
      answerCorrect,
      strategyCorrect,
      movePlanCredit,
      weakSignals,
      notes,
    };

    setState((current) => {
      const base =
        current.resetKey === resetKey ? current : createPracticeState(resetKey);

      return {
        ...base,
        evaluation: nextEvaluation,
        solutionUnlocked: true,
      };
    });
    return nextEvaluation;
  }

  return {
    selectedStrategyId,
    setSelectedStrategyId: (nextValue: string | null) =>
      setState((current) => ({
        ...(current.resetKey === resetKey
          ? current
          : createPracticeState(resetKey)),
        selectedStrategyId: nextValue,
      })),
    answer,
    setAnswer: (nextValue: string) =>
      setState((current) => ({
        ...(current.resetKey === resetKey
          ? current
          : createPracticeState(resetKey)),
        answer: nextValue,
      })),
    movePlan,
    setMovePlan: (nextValue: string) =>
      setState((current) => ({
        ...(current.resetKey === resetKey
          ? current
          : createPracticeState(resetKey)),
        movePlan: nextValue,
      })),
    selfConfidence,
    setSelfConfidence: (nextValue: number) =>
      setState((current) => ({
        ...(current.resetKey === resetKey
          ? current
          : createPracticeState(resetKey)),
        selfConfidence: nextValue,
      })),
    hintLevel,
    visibleHints,
    evaluation,
    solutionUnlocked,
    unlockNextHint,
    evaluateAttempt,
    resetPractice: () => setState(createPracticeState(resetKey)),
  };
}
