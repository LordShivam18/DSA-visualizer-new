"use client";

import { useEffect, useMemo, useState } from "react";

import type {
  PredictionCheckpoint,
  PredictionFeedback,
} from "@/lib/academy/models";

type PredictableStep = {
  step: number;
  checkpoint?: PredictionCheckpoint;
};

type AnswerRecord = {
  choiceId: string;
  correct: boolean;
};

export function usePredictionEngine<Step extends PredictableStep>({
  trace,
  activeIndex,
  enabled,
  resetKey,
}: {
  trace: Step[];
  activeIndex: number;
  enabled: boolean;
  resetKey: string;
}) {
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>({});
  const [feedback, setFeedback] = useState<PredictionFeedback | null>(null);

  useEffect(() => {
    setAnswers({});
    setFeedback(null);
  }, [resetKey]);

  const upcomingStep = enabled ? trace[activeIndex + 1] ?? null : null;
  const checkpoint =
    upcomingStep?.checkpoint && !answers[upcomingStep.checkpoint.id]
      ? upcomingStep.checkpoint
      : null;

  const askedCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter((answer) => answer.correct).length;

  const lockedStepIndices = useMemo(
    () =>
      enabled
        ? trace
            .filter(
              (step, index) =>
                index > activeIndex &&
                step.checkpoint &&
                !answers[step.checkpoint.id]
            )
            .map((step) => step.step)
        : [],
    [activeIndex, answers, enabled, trace]
  );

  function submitPrediction(choiceId: string) {
    if (!checkpoint) {
      return null;
    }

    const selectedChoice = checkpoint.choices.find((choice) => choice.id === choiceId);
    const correctChoice = checkpoint.choices.find((choice) => choice.isCorrect);

    if (!selectedChoice || !correctChoice) {
      return null;
    }

    const nextFeedback: PredictionFeedback = {
      checkpointId: checkpoint.id,
      selectedChoiceId: selectedChoice.id,
      correctChoiceId: correctChoice.id,
      correct: selectedChoice.isCorrect,
      explanation: checkpoint.explanation,
    };

    setAnswers((current) => ({
      ...current,
      [checkpoint.id]: {
        choiceId: selectedChoice.id,
        correct: selectedChoice.isCorrect,
      },
    }));
    setFeedback(nextFeedback);

    return nextFeedback;
  }

  return {
    checkpoint,
    feedback,
    askedCount,
    correctCount,
    accuracy: askedCount === 0 ? 0 : Math.round((correctCount / askedCount) * 100),
    lockedStepIndices,
    submitPrediction,
    resetPrediction: () => {
      setAnswers({});
      setFeedback(null);
    },
  };
}
