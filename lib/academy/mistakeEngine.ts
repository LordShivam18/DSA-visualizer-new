import { resolveWhyActionKey, type WhyStepLike } from "./whyEngine";

export type MistakeContext<Step extends WhyStepLike = WhyStepLike> = {
  userAnswer: string;
  correctAnswer: string;
  step: Step;
  selectedChoiceId?: string;
  selectedChoiceLabel?: string;
  selectedChoiceDetail?: string;
  correctChoiceId?: string;
  correctChoiceLabel?: string;
  correctChoiceDetail?: string;
  checkpointSkill?: string;
};

export type MistakeRule<Step extends WhyStepLike = WhyStepLike> = {
  id: string;
  match: (context: MistakeContext<Step>) => boolean;
  message:
    | string
    | ((context: MistakeContext<Step>, actionKey: string) => string);
};

export type MistakePreview = {
  title: string;
  detail: string;
};

function normalizeText(value: string | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function normalizeChoiceText(context: MistakeContext) {
  return normalizeText(
    [
      context.userAnswer,
      context.selectedChoiceId,
      context.selectedChoiceLabel,
      context.selectedChoiceDetail,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function normalizeCorrectChoiceText(context: MistakeContext) {
  return normalizeText(
    [
      context.correctAnswer,
      context.correctChoiceId,
      context.correctChoiceLabel,
      context.correctChoiceDetail,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

function extractNumbers(value: string) {
  return value.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];
}

function isNumericMismatch(context: MistakeContext) {
  const userValues = extractNumbers(context.userAnswer);
  const correctValues = extractNumbers(context.correctAnswer);

  if (userValues.length === 0 || correctValues.length === 0) {
    return false;
  }

  return userValues.join(",") !== correctValues.join(",");
}

function hasPattern(value: string, pattern: RegExp) {
  return pattern.test(value);
}

function buildActionFallback(actionKey: string, context: MistakeContext) {
  switch (actionKey) {
    case "inspect":
      return `This checkpoint is asking you to measure the local signal in "${context.step.action}", so anchor on the immediate comparison before deciding what the algorithm should do.`;
    case "collect":
      return `This step exists because the current evidence improves the invariant, so the algorithm should commit the profitable update instead of delaying it.`;
    case "skip":
      return `This step protects the invariant, so the safe move is to leave the running state alone when the current signal does not improve the answer.`;
    case "done":
      return `This final checkpoint is a summary of the invariant after the scan, so the answer should restate the fully accumulated result rather than invent a new adjustment.`;
    default:
      return `Use the current step action as the anchor: the right answer should preserve the invariant described by "${context.step.action}".`;
  }
}

export const defaultMistakeRules: MistakeRule[] = [
  {
    id: "premature-stop",
    match: (context) => {
      const userText = normalizeChoiceText(context);
      const correctText = normalizeCorrectChoiceText(context);

      return (
        hasPattern(userText, /\b(stop|return|done|finish|end|quit)\b/) &&
        !hasPattern(correctText, /\b(stop|return|done|finish|end|quit)\b/)
      );
    },
    message: (context) =>
      `That choice ends the algorithm too early. The current step "${context.step.action}" is still part of the working trace, so the algorithm needs to preserve its invariant and keep moving.`,
  },
  {
    id: "reset-state",
    match: (context) => {
      const userText = normalizeChoiceText(context);
      const correctText = normalizeCorrectChoiceText(context);

      return (
        hasPattern(userText, /\b(reset|zero|clear|restart)\b/) &&
        !hasPattern(correctText, /\b(reset|zero|clear|restart)\b/)
      );
    },
    message:
      "This mistake treats the current signal like a full restart. The invariant has not broken, so the running state should be preserved rather than reset.",
  },
  {
    id: "defer-profitable-update",
    match: (context) => {
      const userText = normalizeChoiceText(context);
      const correctText = normalizeCorrectChoiceText(context);

      return (
        hasPattern(userText, /\b(wait|later|future|larger|bigger|merge)\b/) &&
        hasPattern(correctText, /\b(add|collect|keep|advance|scan)\b/)
      );
    },
    message:
      "This choice waits for a better-looking future state, but the invariant already allows a safe update now. When the local evidence is sufficient, deferring the gain throws away a justified step.",
  },
  {
    id: "penalize-non-positive-signal",
    match: (context) => {
      const userText = normalizeChoiceText(context);
      const correctText = normalizeCorrectChoiceText(context);

      return (
        hasPattern(userText, /\b(subtract|decrease|lower|drop|loss|negative)\b/) &&
        hasPattern(correctText, /\b(stay|unchanged|ignore|skip)\b/)
      );
    },
    message:
      "This treats a non-improving signal as something the accumulator must absorb. Invariant-driven traces usually leave the running answer unchanged when the current evidence does not help.",
  },
  {
    id: "local-signal-computation",
    match: (context) =>
      isNumericMismatch(context) &&
      /\b(compare|delta|difference|signal|gap)\b/.test(
        normalizeText(`${context.step.actionKind} ${context.step.action}`)
      ),
    message: (context) =>
      `This looks like a local-state computation slip. For "${context.step.action}", compute the immediate signal first, then map that signal to the next algorithm action.`,
  },
  {
    id: "final-invariant",
    match: (context) =>
      (context.step.done === true ||
        /\b(done|final|return|answer|complete)\b/.test(
          normalizeText(`${context.step.actionKind} ${context.step.action}`)
        )) &&
      normalizeText(context.userAnswer) !== normalizeText(context.correctAnswer),
    message:
      "The final checkpoint should restate the invariant accumulated by earlier steps. If the answer changes at the finish line, the learner is usually recomputing instead of reading the final state.",
  },
];

export function diagnoseMistake<Step extends WhyStepLike>(
  context: MistakeContext<Step>,
  rules: MistakeRule<Step>[] = defaultMistakeRules as MistakeRule<Step>[]
) {
  const userText = normalizeText(context.userAnswer);
  const correctText = normalizeText(context.correctAnswer);

  if (userText.length === 0 || userText === correctText) {
    return undefined;
  }

  const actionKey = resolveWhyActionKey(context.step);
  const matchingRule = rules.find((rule) => rule.match(context));

  if (!matchingRule) {
    return buildActionFallback(actionKey, context);
  }

  return typeof matchingRule.message === "function"
    ? matchingRule.message(context, actionKey)
    : matchingRule.message;
}

export function getMistakePreview(step: WhyStepLike): MistakePreview {
  const actionKey = resolveWhyActionKey(step);

  switch (actionKey) {
    case "inspect":
      return {
        title: "Most likely trap: update before you measure",
        detail:
          "Inspection steps are where learners often skip the local comparison and jump to a state change too early.",
      };
    case "collect":
      return {
        title: "Most likely trap: defer a safe gain",
        detail:
          "Commit steps are where learners often wait for a prettier future case even though the invariant already justifies the update now.",
      };
    case "skip":
      return {
        title: "Most likely trap: force progress out of noise",
        detail:
          "Skip steps tempt learners into changing state just to stay busy, even when the signal should leave the answer unchanged.",
      };
    case "done":
      return {
        title: "Most likely trap: recompute at the finish line",
        detail:
          "Final steps often go wrong when the learner stops reading the built state and starts inventing one more adjustment.",
      };
    default:
      return {
        title: "Most likely trap: lose the invariant",
        detail:
          "If the next move feels fuzzy, the safest repair is to restate the local rule the algorithm is preserving right now.",
      };
  }
}
