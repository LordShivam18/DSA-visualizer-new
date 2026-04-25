import type { PredictionCheckpoint, PredictionChoice } from "./models";
import { resolveWhyActionKey, type WhyStepLike } from "./whyEngine";

export type PredictableTraceStep = WhyStepLike & {
  step: number;
  checkpoint?: PredictionCheckpoint;
};

export function getPredictionCheckpointId<Step extends PredictableTraceStep>(
  step: Step
) {
  return step.checkpoint?.id ?? `generated-checkpoint-${step.step}`;
}

function stepDetail(step: PredictableTraceStep) {
  return (
    step.expertNote?.trim() ||
    step.explanationExpert?.trim() ||
    step.beginnerNote?.trim() ||
    step.explanationBeginner?.trim() ||
    step.focus?.trim() ||
    step.action
  );
}

function buildPrompt(actionKey: string, step: PredictableTraceStep) {
  switch (actionKey) {
    case "initialize":
      return "Before the next reveal, what setup transition should the algorithm perform?";
    case "inspect":
      return "Before the next reveal, what should the algorithm inspect or compare next?";
    case "collect":
      return "The trace is ready to commit a justified update. What happens next?";
    case "skip":
      return "The current signal should not change the invariant. What does the algorithm do next?";
    case "done":
      return "The trace is about to finish. What is the next revealed step?";
    default:
      return `Which step best matches the next transition after "${step.action}"?`;
  }
}

function buildSkillLabel(actionKey: string) {
  switch (actionKey) {
    case "initialize":
      return "Predict the setup invariant";
    case "inspect":
      return "Predict the next inspection";
    case "collect":
      return "Predict the next committed update";
    case "skip":
      return "Predict the invariant-preserving skip";
    case "done":
      return "Predict the closing step";
    default:
      return "Predict the next trace transition";
  }
}

function buildIncorrectChoices(actionKey: string): PredictionChoice[] {
  switch (actionKey) {
    case "initialize":
      return [
        {
          id: "wrong-skip-setup",
          label: "Skip setup and jump straight into mutation",
          detail: "This ignores the invariant the trace establishes before updates begin.",
          isCorrect: false,
        },
        {
          id: "wrong-reset-setup",
          label: "Reset the working state before any evidence is read",
          detail: "A reset is not the same thing as initialization.",
          isCorrect: false,
        },
        {
          id: "wrong-finish-setup",
          label: "Return the final answer immediately",
          detail: "The algorithm still needs to build state before it can finish.",
          isCorrect: false,
        },
      ];
    case "inspect":
      return [
        {
          id: "wrong-skip-inspect",
          label: "Skip the measurement and keep moving blindly",
          detail: "The next transition should be justified by current evidence, not guessed.",
          isCorrect: false,
        },
        {
          id: "wrong-reset-inspect",
          label: "Reset the running state before reading the signal",
          detail: "Nothing here implies the invariant has failed.",
          isCorrect: false,
        },
        {
          id: "wrong-finish-inspect",
          label: "Stop now and return the answer",
          detail: "Inspection steps exist because the trace is not done yet.",
          isCorrect: false,
        },
      ];
    case "collect":
      return [
        {
          id: "wrong-wait-collect",
          label: "Ignore the signal and wait for a better future window",
          detail: "This delays an update the invariant already justifies.",
          isCorrect: false,
        },
        {
          id: "wrong-reset-collect",
          label: "Reset the running state instead of committing the gain",
          detail: "A justified update should strengthen the current state, not erase it.",
          isCorrect: false,
        },
        {
          id: "wrong-finish-collect",
          label: "Return the answer immediately after noticing progress",
          detail: "The trace still needs to reveal remaining state transitions.",
          isCorrect: false,
        },
      ];
    case "skip":
      return [
        {
          id: "wrong-force-update-skip",
          label: "Force a state update even though the signal is not justified",
          detail: "This breaks the invariant by treating noise like progress.",
          isCorrect: false,
        },
        {
          id: "wrong-penalize-skip",
          label: "Decrease the running answer to account for the bad signal",
          detail: "Many invariant-preserving steps leave the accumulator unchanged.",
          isCorrect: false,
        },
        {
          id: "wrong-finish-skip",
          label: "Stop the algorithm because this signal is unhelpful",
          detail: "One unhelpful transition does not imply the whole trace is done.",
          isCorrect: false,
        },
      ];
    case "done":
      return [
        {
          id: "wrong-repeat-done",
          label: "Repeat the previous transition one more time",
          detail: "A closing step should expose the final state, not reopen the loop.",
          isCorrect: false,
        },
        {
          id: "wrong-reset-done",
          label: "Reset the accumulated answer before returning",
          detail: "The closing step should surface the built invariant, not erase it.",
          isCorrect: false,
        },
        {
          id: "wrong-restart-done",
          label: "Restart the full scan from the beginning",
          detail: "The trace is finishing, not starting over.",
          isCorrect: false,
        },
      ];
    default:
      return [
        {
          id: "wrong-repeat-default",
          label: "Repeat the previous step without new evidence",
          detail: "The next transition should move the trace forward, not loop in place.",
          isCorrect: false,
        },
        {
          id: "wrong-reset-default",
          label: "Reset the working state",
          detail: "Nothing in the current transition implies a reset is needed.",
          isCorrect: false,
        },
        {
          id: "wrong-finish-default",
          label: "Return the final answer right now",
          detail: "The current state does not yet justify ending the trace.",
          isCorrect: false,
        },
      ];
  }
}

function dedupeChoices(choices: PredictionChoice[]) {
  const seen = new Set<string>();

  return choices.filter((choice) => {
    const key = choice.label.trim().toLowerCase();

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function resolvePredictionCheckpoint<Step extends PredictableTraceStep>(
  trace: Step[],
  activeIndex: number
) {
  const upcomingStep = trace[activeIndex + 1] ?? null;

  if (!upcomingStep) {
    return null;
  }

  if (upcomingStep.checkpoint) {
    return upcomingStep.checkpoint;
  }

  const actionKey = resolveWhyActionKey(upcomingStep);
  const correctChoice: PredictionChoice = {
    id: `generated-correct-${upcomingStep.step}`,
    label: upcomingStep.action,
    detail: stepDetail(upcomingStep),
    isCorrect: true,
  };
  const choices = dedupeChoices([
    correctChoice,
    ...buildIncorrectChoices(actionKey),
  ]).slice(0, 4);

  return {
    id: getPredictionCheckpointId(upcomingStep),
    skill: buildSkillLabel(actionKey),
    prompt: buildPrompt(actionKey, upcomingStep),
    explanation: `Prediction mode is using the trace itself as the source of truth. ${stepDetail(
      upcomingStep
    )}`,
    choices,
  };
}
