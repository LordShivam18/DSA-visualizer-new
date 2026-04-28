type WhyMetric = {
  label: string;
  value: string | number;
};

type WhyPointer = {
  label: string;
  value: string;
};

export type WhyStepLike = {
  action: string;
  actionKind?: string;
  beginnerNote?: string;
  expertNote?: string;
  explanationBeginner?: string;
  explanationExpert?: string;
  focus?: string;
  hints?: string[];
  metrics?: WhyMetric[];
  pointerChips?: WhyPointer[];
  done?: boolean;
};

export type WhyEvidence = {
  label: string;
  value: string;
};

export type WhyAlternative = {
  label: string;
  reason: string;
  whenToUse: string;
};

export type WhyExplanation = {
  actionKey: string;
  title: string;
  summary: string;
  reason: string;
  detail: string;
  evidence: WhyEvidence[];
  nextFocus: string;
  hints: string[];
  alternatives: WhyAlternative[];
};

export type WhyRule<Step extends WhyStepLike = WhyStepLike> = {
  id: string;
  actions?: string[];
  patterns?: RegExp[];
  build: (step: Step, actionKey: string) => WhyExplanation;
};

const ACTION_ALIASES: Record<string, string> = {
  parse: "initialize",
  parsed: "initialize",
  init: "initialize",
  initialize: "initialize",
  setup: "initialize",
  seed: "initialize",
  inspect: "inspect",
  compare: "inspect",
  check: "inspect",
  "check-cell": "inspect",
  "inspect-chunk": "inspect",
  "start-level": "inspect",
  "expand-window": "inspect",
  collect: "collect",
  accept: "collect",
  add: "collect",
  commit: "collect",
  update: "collect",
  "update-best": "collect",
  push: "collect",
  enqueue: "collect",
  insert: "collect",
  write: "collect",
  record: "collect",
  capture: "collect",
  skip: "skip",
  ignore: "skip",
  reject: "skip",
  remove: "skip",
  release: "skip",
  shrink: "skip",
  trim: "skip",
  reset: "skip",
  conflict: "skip",
  invalid: "skip",
  empty: "skip",
  backtrack: "skip",
  done: "done",
  complete: "done",
  finish: "done",
  found: "done",
  return: "done",
};

function normalizeText(value: string | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function firstToken(value: string | undefined) {
  return normalizeText(value).split(/[\s_-]+/)[0] ?? "";
}

function buildEvidence(step: WhyStepLike) {
  const metrics = (step.metrics ?? []).slice(0, 2).map((metric) => ({
    label: metric.label,
    value: String(metric.value),
  }));
  const pointers = (step.pointerChips ?? []).slice(0, 2).map((pointer) => ({
    label: pointer.label,
    value: pointer.value,
  }));

  return [...metrics, ...pointers].slice(0, 4);
}

function buildWhyExplanation(
  step: WhyStepLike,
  actionKey: string,
  title: string,
  reason: string,
  fallbackDetail: string
): WhyExplanation {
  return {
    actionKey,
    title,
    summary: step.action,
    reason,
    detail:
      step.expertNote?.trim() ||
      step.explanationExpert?.trim() ||
      step.beginnerNote?.trim() ||
      step.explanationBeginner?.trim() ||
      step.focus?.trim() ||
      fallbackDetail,
    evidence: buildEvidence(step),
    nextFocus: step.focus?.trim() || step.action,
    hints: (step.hints ?? []).slice(0, 3),
    alternatives: buildAlternatives(actionKey, step),
  };
}

function buildAlternatives(
  actionKey: string,
  step: WhyStepLike
): WhyAlternative[] {
  switch (actionKey) {
    case "initialize":
      return [
        {
          label: "Mutate immediately",
          reason:
            "Jumping straight into updates hides the invariant that explains later choices.",
          whenToUse:
            "Only switch to mutation after the setup state exists and the first signal has been read.",
        },
      ];
    case "inspect":
      return [
        {
          label: "Commit an update now",
          reason:
            "That would be premature if the local comparison has not proved the update is safe yet.",
          whenToUse:
            "Use the update path only after this exact measurement improves the running invariant.",
        },
      ];
    case "collect":
      return [
        {
          label: "Skip the signal",
          reason:
            "Skipping here would throw away evidence the invariant already says is profitable.",
          whenToUse:
            "A skip becomes correct only when the current signal fails to improve the tracked state.",
        },
      ];
    case "skip":
      return [
        {
          label: "Force an update",
          reason:
            "That would treat noise like progress and blur the rule the algorithm is preserving.",
          whenToUse:
            "Switch to an update only when the next comparison genuinely improves the answer.",
        },
      ];
    case "done":
      return [
        {
          label: "Keep scanning",
          reason:
            "More work would only repeat state the algorithm has already settled.",
          whenToUse:
            "Continue scanning only if unread input still exists or the final state has not been surfaced.",
        },
      ];
    default:
      return [
        {
          label: "Rephrase the step",
          reason:
            "If this transition feels opaque, the missing piece is usually the invariant the step preserves.",
          whenToUse:
            `Use "${step.action}" as the anchor and restate what would make the opposite move correct.`,
        },
      ];
  }
}

function matchesRule<Step extends WhyStepLike>(
  rule: WhyRule<Step>,
  step: Step,
  actionKey: string
) {
  if (rule.actions?.includes(actionKey)) {
    return true;
  }

  if (!rule.patterns || rule.patterns.length === 0) {
    return false;
  }

  const actionText = normalizeText(step.action);
  const actionKind = normalizeText(step.actionKind);

  return rule.patterns.some(
    (pattern) => pattern.test(actionText) || pattern.test(actionKind)
  );
}

export function resolveWhyActionKey(step: WhyStepLike) {
  if (step.done) {
    return "done";
  }

  const actionKind = normalizeText(step.actionKind);

  if (ACTION_ALIASES[actionKind]) {
    return ACTION_ALIASES[actionKind];
  }

  const actionKindToken = firstToken(step.actionKind);

  if (ACTION_ALIASES[actionKindToken]) {
    return ACTION_ALIASES[actionKindToken];
  }

  const actionText = normalizeText(step.action);

  if (/\b(done|complete|final|return|answer|finish)\b/.test(actionText)) {
    return "done";
  }

  if (/\b(init|initialize|parse|setup|seed|build)\b/.test(actionText)) {
    return "initialize";
  }

  if (/\b(compare|inspect|check|measure|scan|visit|delta|difference)\b/.test(actionText)) {
    return "inspect";
  }

  if (/\b(add|collect|accept|push|enqueue|update|record|capture|commit)\b/.test(actionText)) {
    return "collect";
  }

  if (/\b(skip|ignore|remove|release|reset|trim|shrink|reject|backtrack)\b/.test(actionText)) {
    return "skip";
  }

  return "default";
}

export const defaultWhyRules: WhyRule[] = [
  {
    id: "initialize",
    actions: ["initialize"],
    build: (step, actionKey) =>
      buildWhyExplanation(
        step,
        actionKey,
        "Set the invariant",
        "This step establishes the rule the rest of the trace will preserve, so later transitions can stay local and still remain correct.",
        "The run begins by defining the invariant that every later decision must respect."
      ),
  },
  {
    id: "inspect",
    actions: ["inspect"],
    build: (step, actionKey) =>
      buildWhyExplanation(
        step,
        actionKey,
        "Measure the next signal",
        "The algorithm pauses here to read the local evidence before mutating state, which keeps each decision justified by the current data.",
        "This step measures the next local signal before the state changes."
      ),
  },
  {
    id: "collect",
    actions: ["collect"],
    build: (step, actionKey) =>
      buildWhyExplanation(
        step,
        actionKey,
        "Commit the state change",
        "The current signal improves the running invariant, so the algorithm can safely update state now instead of waiting for a future guess.",
        "The evidence is strong enough to justify a direct state update."
      ),
  },
  {
    id: "skip",
    actions: ["skip"],
    build: (step, actionKey) =>
      buildWhyExplanation(
        step,
        actionKey,
        "Protect the invariant",
        "Changing state here would add noise or break the invariant, so the correct move is to preserve the running state and continue scanning.",
        "The best move is deliberate restraint because this signal should not change the answer."
      ),
  },
  {
    id: "done",
    actions: ["done"],
    build: (step, actionKey) =>
      buildWhyExplanation(
        step,
        actionKey,
        "Close the loop",
        "The trace has finished collecting evidence, so this step simply exposes the invariant that the earlier transitions have already built.",
        "The final state is ready to be surfaced as the answer."
      ),
  },
  {
    id: "fallback",
    build: (step, actionKey) =>
      buildWhyExplanation(
        step,
        actionKey,
        "Explain the transition",
        "This step exists to preserve the current invariant while the algorithm moves toward the next meaningful state change.",
        "The trace is translating one justified state into the next."
      ),
  },
];

export function resolveWhyExplanation<Step extends WhyStepLike>(
  step: Step | null | undefined,
  rules: WhyRule<Step>[] = defaultWhyRules as WhyRule<Step>[]
) {
  if (!step) {
    return null;
  }

  const actionKey = resolveWhyActionKey(step);
  const matchingRule =
    rules.find((rule) => matchesRule(rule, step, actionKey)) ??
    rules[rules.length - 1];

  return matchingRule?.build(step, actionKey) ?? null;
}
