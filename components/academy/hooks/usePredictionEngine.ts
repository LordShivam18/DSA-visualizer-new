"use client";

import { useEffect, useMemo, useState } from "react";

import { diagnoseMistake } from "@/lib/academy/mistakeEngine";
import {
  getPredictionCheckpointId,
  resolvePredictionCheckpoint,
} from "@/lib/academy/predictionCheckpointEngine";
import type {
  PredictionCheckpoint,
  PredictionFeedback,
  PredictionValidation,
} from "@/lib/academy/models";

type PredictableStep = {
  step: number;
  action: string;
  actionKind?: string;
  beginnerNote?: string;
  expertNote?: string;
  explanationBeginner?: string;
  explanationExpert?: string;
  focus?: string;
  hints?: string[];
  done?: boolean;
  checkpoint?: PredictionCheckpoint;
};

type AnswerRecord = {
  firstChoiceId: string;
  lastChoiceId: string;
  firstAttemptCorrect: boolean;
  resolved: boolean;
  attemptCount: number;
};

type PredictionState = {
  resetKey: string;
  answers: Record<string, AnswerRecord>;
  feedback: PredictionFeedback | null;
};

const EMPTY_LOCKED_STEPS: number[] = [];

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
  timeline,
}: {
  trace: Step[];
  activeIndex: number;
  enabled: boolean;
  resetKey: string;
  timeline?: {
    pause: () => void;
    resume: () => void;
  };
}) {
  const [state, setState] = useState<PredictionState>(() =>
    createPredictionState(resetKey)
  );
  const currentState =
    state.resetKey === resetKey ? state : createPredictionState(resetKey);
  const { answers, feedback } = currentState;

  const upcomingStep = enabled ? trace[activeIndex + 1] ?? null : null;
  const checkpoint = useMemo(
    () => (enabled ? resolvePredictionCheckpoint(trace, activeIndex) : null),
    [activeIndex, enabled, trace]
  );
  const checkpointResolved = checkpoint
    ? answers[checkpoint.id]?.resolved === true
    : false;
  const activeCheckpoint = checkpoint && !checkpointResolved ? checkpoint : null;
  const activeCheckpointId = activeCheckpoint?.id ?? null;

  const askedCount = Object.keys(answers).length;
  const correctCount = Object.values(answers).filter(
    (answer) => answer.firstAttemptCorrect
  ).length;

  const lockedStepIndices = useMemo(
    () => {
      if (!enabled) {
        return EMPTY_LOCKED_STEPS;
      }

      return trace
        .filter(
          (step, index) =>
            index > activeIndex &&
            typeof step.action === "string" &&
            step.action.trim().length > 0 &&
            !answers[getPredictionCheckpointId(step)]?.resolved
        )
        .map((step) => step.step);
    },
    [activeIndex, answers, enabled, trace]
  );

  useEffect(() => {
    if (!enabled || !activeCheckpointId) {
      return;
    }

    timeline?.pause();
  }, [activeCheckpointId, enabled, timeline]);

  function submitPrediction(choiceId: string): PredictionValidation | null {
    if (!activeCheckpoint) {
      return null;
    }

    timeline?.pause();

    const selectedChoice = activeCheckpoint.choices.find(
      (choice) => choice.id === choiceId
    );
    const correctChoice = activeCheckpoint.choices.find((choice) => choice.isCorrect);

    if (!selectedChoice || !correctChoice) {
      return null;
    }

    const currentStep = trace[activeIndex];
    const diagnosis = selectedChoice.isCorrect
      ? undefined
      : diagnoseMistake({
          userAnswer: selectedChoice.label,
          correctAnswer: correctChoice.label,
          step: upcomingStep ?? currentStep,
          selectedChoiceId: selectedChoice.id,
          selectedChoiceLabel: selectedChoice.label,
          selectedChoiceDetail: selectedChoice.detail,
          correctChoiceId: correctChoice.id,
          correctChoiceLabel: correctChoice.label,
          correctChoiceDetail: correctChoice.detail,
          checkpointSkill: activeCheckpoint.skill,
        });
    const nextFeedback: PredictionFeedback = {
      checkpointId: activeCheckpoint.id,
      selectedChoiceId: selectedChoice.id,
      correctChoiceId: correctChoice.id,
      correct: selectedChoice.isCorrect,
      explanation: activeCheckpoint.explanation,
      diagnosis,
    };

    setState((current) => {
      const base =
        current.resetKey === resetKey ? current : createPredictionState(resetKey);
      const previousAnswer = base.answers[activeCheckpoint.id];

      return {
        ...base,
        answers: {
          ...base.answers,
          [activeCheckpoint.id]: {
            firstChoiceId: previousAnswer?.firstChoiceId ?? selectedChoice.id,
            lastChoiceId: selectedChoice.id,
            firstAttemptCorrect:
              previousAnswer?.firstAttemptCorrect ?? selectedChoice.isCorrect,
            resolved: previousAnswer?.resolved ? true : selectedChoice.isCorrect,
            attemptCount: (previousAnswer?.attemptCount ?? 0) + 1,
          },
        },
        feedback: nextFeedback,
      };
    });

    if (selectedChoice.isCorrect) {
      requestAnimationFrame(() => {
        timeline?.resume();
      });
    }

    return {
      correct: selectedChoice.isCorrect,
      diagnosis,
    };
  }

  return {
    checkpoint: activeCheckpoint,
    feedback,
    askedCount,
    correctCount,
    accuracy: askedCount === 0 ? 0 : Math.round((correctCount / askedCount) * 100),
    lockedStepIndices,
    submitPrediction,
    resetPrediction: () => setState(createPredictionState(resetKey)),
  };
}
