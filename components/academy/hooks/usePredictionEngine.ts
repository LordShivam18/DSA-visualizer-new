"use client";

import { useMemo, useState } from "react";

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

type PredictionState = {
  resetKey: string;
  answers: Record<string, AnswerRecord>;
  feedback: PredictionFeedback | null;
};

function createPredictionState(resetKey: string): PredictionState {
  return {
    resetKey,
    answers: {},
    feedback: null,
  };
}

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
  const [state, setState] = useState<PredictionState>(() =>
    createPredictionState(resetKey)
  );
  const currentState =
    state.resetKey === resetKey ? state : createPredictionState(resetKey);
  const { answers, feedback } = currentState;

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

    setState((current) => {
      const base =
        current.resetKey === resetKey ? current : createPredictionState(resetKey);

      return {
        ...base,
        answers: {
          ...base.answers,
          [checkpoint.id]: {
            choiceId: selectedChoice.id,
            correct: selectedChoice.isCorrect,
          },
        },
        feedback: nextFeedback,
      };
    });

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
    resetPrediction: () => setState(createPredictionState(resetKey)),
  };
}
