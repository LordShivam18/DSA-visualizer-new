"use client";

import { useEffect, useMemo, useState } from "react";

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
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [movePlan, setMovePlan] = useState("");
  const [selfConfidence, setSelfConfidence] = useState(65);
  const [hintLevel, setHintLevel] = useState(0);
  const [evaluation, setEvaluation] = useState<PracticeEvaluation | null>(null);
  const [solutionUnlocked, setSolutionUnlocked] = useState(false);

  useEffect(() => {
    setSelectedStrategyId(null);
    setAnswer("");
    setMovePlan("");
    setSelfConfidence(65);
    setHintLevel(0);
    setEvaluation(null);
    setSolutionUnlocked(false);
  }, [resetKey]);

  const strategy = config.strategyOptions.find(
    (option) => option.id === selectedStrategyId
  );

  const visibleHints = useMemo(
    () => config.hints.slice(0, hintLevel),
    [config.hints, hintLevel]
  );

  function unlockNextHint() {
    setHintLevel((current) => {
      const nextLevel = Math.min(current + 1, config.hints.length);

      if (nextLevel >= 3) {
        setSolutionUnlocked(true);
      }

      return nextLevel;
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

    setEvaluation(nextEvaluation);
    setSolutionUnlocked(true);
    return nextEvaluation;
  }

  return {
    selectedStrategyId,
    setSelectedStrategyId,
    answer,
    setAnswer,
    movePlan,
    setMovePlan,
    selfConfidence,
    setSelfConfidence,
    hintLevel,
    visibleHints,
    evaluation,
    solutionUnlocked,
    unlockNextHint,
    evaluateAttempt,
    resetPractice: () => {
      setSelectedStrategyId(null);
      setAnswer("");
      setMovePlan("");
      setSelfConfidence(65);
      setHintLevel(0);
      setEvaluation(null);
      setSolutionUnlocked(false);
    },
  };
}
