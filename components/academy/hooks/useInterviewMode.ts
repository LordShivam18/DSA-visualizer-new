"use client";

import { useEffect, useEffectEvent, useState } from "react";

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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalize(value: string) {
  return value.trim().toLowerCase();
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
  const [selectedStrategyId, setSelectedStrategyId] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [selfConfidence, setSelfConfidence] = useState(60);
  const [hintRequests, setHintRequests] = useState(0);
  const [timeRemainingSec, setTimeRemainingSec] = useState(config.timeLimitSec);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(null);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    setSelectedStrategyId(null);
    setAnswer("");
    setSelfConfidence(60);
    setHintRequests(0);
    setTimeRemainingSec(config.timeLimitSec);
    setEvaluation(null);
    setTimedOut(false);
  }, [config.timeLimitSec, resetKey]);

  const finalize = useEffectEvent((didTimeOut: boolean) => {
    if (evaluation) {
      return evaluation;
    }

    const answerCorrect = normalize(answer) === normalize(expectedAnswer);
    const strategyCorrect = selectedStrategyId === correctStrategyId;
    const accuracy = (answerCorrect ? 75 : 0) + (strategyCorrect ? 25 : 0);
    const timeRatio = config.timeLimitSec === 0 ? 0 : timeRemainingSec / config.timeLimitSec;
    const efficiencyScore = clamp(
      Math.round(
        (answerCorrect ? 52 : 18) +
          timeRatio * 28 +
          (strategyCorrect ? 12 : 0) -
          hintRequests * 12
      ),
      0,
      100
    );
    const confidenceScore = clamp(
      Math.round(
        selfConfidence * 0.62 +
          (answerCorrect ? 24 : -8) +
          (strategyCorrect ? 10 : 0) +
          timeRatio * 12 -
          hintRequests * 8
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

    if (hintRequests > 0) {
      weakSignals.push("independent recall");
    }

    const nextEvaluation: InterviewEvaluation = {
      accuracy,
      correctness: answerCorrect && strategyCorrect,
      efficiencyScore,
      confidenceScore,
      finalScore,
      weakSignals,
      notes,
    };

    setTimedOut(didTimeOut);
    setEvaluation(nextEvaluation);
    return nextEvaluation;
  });

  useEffect(() => {
    if (evaluation) {
      return;
    }

    const timer = window.setInterval(() => {
      setTimeRemainingSec((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          finalize(true);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [evaluation, finalize, resetKey]);

  function requestHint() {
    if (hintRequests >= config.hintBudget) {
      return false;
    }

    setHintRequests((current) => current + 1);
    return true;
  }

  return {
    selectedStrategyId,
    setSelectedStrategyId,
    answer,
    setAnswer,
    selfConfidence,
    setSelfConfidence,
    hintRequests,
    hintBudget: config.hintBudget,
    visibleHints: hints.slice(0, hintRequests),
    timeRemainingSec,
    evaluation,
    timedOut,
    requestHint,
    submitInterview: () => finalize(false),
    resetInterview: () => {
      setSelectedStrategyId(null);
      setAnswer("");
      setSelfConfidence(60);
      setHintRequests(0);
      setTimeRemainingSec(config.timeLimitSec);
      setEvaluation(null);
      setTimedOut(false);
    },
  };
}
