import type {
  MistakePatternClassification,
  MistakePatternFamily,
  MistakeSeverity,
} from "./models";
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
  pattern: {
    label: string;
    family: MistakePatternFamily;
    severity: MistakeSeverity;
    confidence: number;
    repairAction:
      | string
      | ((context: MistakeContext<Step>, actionKey: string) => string);
    evidence?: (context: MistakeContext<Step>) => string[];
  };
  match: (context: MistakeContext<Step>) => boolean;
  message:
    | string
    | ((context: MistakeContext<Step>, actionKey: string) => string);
};

export type MistakePreview = {
  title: string;
  detail: string;
  patternLabel: string;
  repairAction: string;
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

function defaultEvidence(context: MistakeContext) {
  return [
    `Selected: ${context.selectedChoiceLabel ?? context.userAnswer}`,
    `Expected: ${context.correctChoiceLabel ?? context.correctAnswer}`,
    `Step: ${context.step.action}`,
  ].filter((item) => !item.endsWith(": "));
}

function buildFallbackPattern(
  actionKey: string,
  context: MistakeContext
): MistakePatternClassification {
  return {
    id: `fallback-${actionKey}`,
    label: "Invariant drift",
    family: "invariant",
    severity: "medium",
    confidence: 0.48,
    evidence: defaultEvidence(context),
    repairAction:
      "Restate the invariant for this exact step, then choose the answer that preserves it.",
    message: buildActionFallback(actionKey, context),
  };
}

function resolveRuleMessage<Step extends WhyStepLike>(
  rule: MistakeRule<Step>,
  context: MistakeContext<Step>,
  actionKey: string
) {
  return typeof rule.message === "function"
    ? rule.message(context, actionKey)
    : rule.message;
}

function resolveRepairAction<Step extends WhyStepLike>(
  rule: MistakeRule<Step>,
  context: MistakeContext<Step>,
  actionKey: string
) {
  return typeof rule.pattern.repairAction === "function"
    ? rule.pattern.repairAction(context, actionKey)
    : rule.pattern.repairAction;
}

export const defaultMistakeRules: MistakeRule[] = [
  {
    id: "premature-stop",
    pattern: {
      label: "Premature termination",
      family: "control-flow",
      severity: "high",
      confidence: 0.86,
      repairAction:
        "Check whether unread trace state still exists before choosing any return or finish move.",
    },
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
    pattern: {
      label: "State reset bias",
      family: "state-management",
      severity: "medium",
      confidence: 0.82,
      repairAction:
        "Name which invariant actually broke; if none broke, preserve the running state.",
    },
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
    pattern: {
      label: "Deferred safe update",
      family: "invariant",
      severity: "medium",
      confidence: 0.84,
      repairAction:
        "Ask whether the current evidence is already sufficient. If it is, commit now instead of waiting.",
    },
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
    pattern: {
      label: "Forced penalty",
      family: "state-management",
      severity: "medium",
      confidence: 0.8,
      repairAction:
        "Separate a bad signal from a required state change; many traces simply ignore non-improving evidence.",
    },
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
    pattern: {
      label: "Local signal misread",
      family: "calculation",
      severity: "medium",
      confidence: 0.78,
      repairAction:
        "Recompute the immediate comparison before deciding whether the state should move.",
      evidence: (context) => [
        `Selected value: ${context.userAnswer}`,
        `Expected value: ${context.correctAnswer}`,
        `Signal step: ${context.step.action}`,
      ],
    },
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
    pattern: {
      label: "Finish-line recomputation",
      family: "termination",
      severity: "high",
      confidence: 0.88,
      repairAction:
        "Read the final accumulated state directly instead of making one more adjustment.",
    },
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

export function classifyMistake<Step extends WhyStepLike>(
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
    return buildFallbackPattern(actionKey, context);
  }

  return {
    id: matchingRule.id,
    label: matchingRule.pattern.label,
    family: matchingRule.pattern.family,
    severity: matchingRule.pattern.severity,
    confidence: matchingRule.pattern.confidence,
    evidence: matchingRule.pattern.evidence?.(context) ?? defaultEvidence(context),
    repairAction: resolveRepairAction(matchingRule, context, actionKey),
    message: resolveRuleMessage(matchingRule, context, actionKey),
  };
}

export function diagnoseMistake<Step extends WhyStepLike>(
  context: MistakeContext<Step>,
  rules: MistakeRule<Step>[] = defaultMistakeRules as MistakeRule<Step>[]
) {
  return classifyMistake(context, rules)?.message;
}

export function getMistakePreview(step: WhyStepLike): MistakePreview {
  const actionKey = resolveWhyActionKey(step);

  switch (actionKey) {
    case "inspect":
      return {
        title: "Most likely trap: update before you measure",
        detail:
          "Inspection steps are where learners often skip the local comparison and jump to a state change too early.",
        patternLabel: "Premature mutation",
        repairAction: "Measure the local signal first, then decide whether state can move.",
      };
    case "collect":
      return {
        title: "Most likely trap: defer a safe gain",
        detail:
          "Commit steps are where learners often wait for a prettier future case even though the invariant already justifies the update now.",
        patternLabel: "Deferred safe update",
        repairAction: "Commit the update as soon as the invariant proves it is safe.",
      };
    case "skip":
      return {
        title: "Most likely trap: force progress out of noise",
        detail:
          "Skip steps tempt learners into changing state just to stay busy, even when the signal should leave the answer unchanged.",
        patternLabel: "Forced penalty",
        repairAction: "Leave the state alone when the current signal does not improve it.",
      };
    case "done":
      return {
        title: "Most likely trap: recompute at the finish line",
        detail:
          "Final steps often go wrong when the learner stops reading the built state and starts inventing one more adjustment.",
        patternLabel: "Finish-line recomputation",
        repairAction: "Return the accumulated state without adding a new transition.",
      };
    default:
      return {
        title: "Most likely trap: lose the invariant",
        detail:
          "If the next move feels fuzzy, the safest repair is to restate the local rule the algorithm is preserving right now.",
        patternLabel: "Invariant drift",
        repairAction: "Restate the invariant before choosing the next transition.",
      };
  }
}
