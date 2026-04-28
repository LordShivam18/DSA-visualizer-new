import type { GuidedLearningPath } from "./learningPathEngine";
import type { PredictionFeedback } from "./models";
import type { PatternRecognitionInsight } from "./patternEngine";
import type { Problem } from "./problemRegistry";
import type { ReplayVariation } from "./variationEngine";
import type { WhyStepLike } from "./whyEngine";
import { getCuratedCompletionInsight } from "./entryPoints";

export type CompletionFeedbackTone = "cyan" | "emerald" | "amber" | "violet" | "rose";

export type CompletionFeedbackInsight = {
  headline: string;
  summary: string;
  beginnerInsight: string;
  beginnerSuggestion: string;
  continueTitle: string;
  continueHref?: string;
  metrics: Array<{
    label: string;
    value: string;
    tone: CompletionFeedbackTone;
  }>;
  confirmations: string[];
  nextSteps: Array<{
    label: string;
    title: string;
    detail: string;
    tone: CompletionFeedbackTone;
    href?: string;
  }>;
};

function formatPredictionAccuracy(value: number) {
  return value > 0 ? `${value}%` : "No recall";
}

function resolveNextPath(path: GuidedLearningPath | null) {
  return (
    path?.nodes.find((node) => node.status === "next") ??
    path?.nodes.find((node) => node.status === "stretch") ??
    null
  );
}

function resolveReplayPick(variations: ReplayVariation[]) {
  return (
    variations.find((variation) => variation.kind === "adversarial") ??
    variations.find((variation) => variation.kind === "edge") ??
    variations.find((variation) => variation.kind === "minimal") ??
    variations[0] ??
    null
  );
}

export function buildCompletionFeedback<Step extends WhyStepLike>({
  problem,
  step,
  stepIndex,
  totalSteps,
  predictionAccuracy,
  feedback,
  pattern,
  variations,
  guidedPath,
}: {
  problem: Problem;
  step: Step;
  stepIndex: number;
  totalSteps: number;
  predictionAccuracy: number;
  feedback: PredictionFeedback | null;
  pattern: PatternRecognitionInsight | null;
  variations: ReplayVariation[];
  guidedPath: GuidedLearningPath | null;
}): CompletionFeedbackInsight | null {
  const isComplete = totalSteps > 0 && (step.done || stepIndex >= totalSteps - 1);

  if (!isComplete) {
    return null;
  }

  const replayPick = resolveReplayPick(variations);
  const nextPath = resolveNextPath(guidedPath);
  const repairedPattern = feedback?.mistakePattern;
  const traceCoverage = totalSteps <= 1 ? 100 : Math.round(((stepIndex + 1) / totalSteps) * 100);
  const beginnerInsight =
    getCuratedCompletionInsight(problem.id) ??
    (pattern
      ? `You learned the core ${pattern.label.toLowerCase()} rule behind ${problem.title}.`
      : `You finished the core trace for ${problem.title}.`);
  const continueTitle = nextPath?.title ?? "Take the next nearby rep";
  const continueHref = nextPath?.route;
  const beginnerSuggestion = nextPath
    ? `Next, try ${nextPath.title}. ${nextPath.summary}`
    : "Next, try a nearby problem while the pattern is still fresh.";

  return {
    headline: `${problem.title} complete`,
    summary: repairedPattern
      ? `You finished the trace and surfaced a ${repairedPattern.label.toLowerCase()} pattern to repair before the next rep.`
      : `You finished the trace. Lock the invariant with one transfer case before leaving the problem.`,
    beginnerInsight,
    beginnerSuggestion,
    continueTitle,
    continueHref,
    metrics: [
      {
        label: "Trace coverage",
        value: `${traceCoverage}%`,
        tone: "emerald",
      },
      {
        label: "Prediction",
        value: formatPredictionAccuracy(predictionAccuracy),
        tone: predictionAccuracy >= 80 ? "emerald" : predictionAccuracy > 0 ? "amber" : "cyan",
      },
      {
        label: "Pattern",
        value: pattern?.label ?? "Invariant",
        tone: "violet",
      },
    ],
    confirmations: [
      `Final action: ${step.action}`,
      repairedPattern
        ? `Repair focus: ${repairedPattern.repairAction}`
        : "Reasoning focus: preserve the same invariant on a new input.",
      replayPick
        ? `Transfer case: ${replayPick.label}`
        : "Transfer case: edit one input boundary and replay.",
    ],
    nextSteps: [
      {
        label: "Confirm",
        title: "State the invariant once",
        detail:
          pattern?.whyItFits ??
          "Say what rule survived from the first step through the final state.",
        tone: "cyan",
      },
      {
        label: "Replay",
        title: replayPick?.label ?? "Create a boundary case",
        detail:
          replayPick?.summary ??
          "Change the smallest input that could break the reasoning and rerun the trace.",
        tone: "amber",
      },
      {
        label: "Continue",
        title: continueTitle,
        detail:
          nextPath?.summary ??
          "Stay close to the same pattern while the transition chain is still fresh.",
        tone: "violet",
        href: continueHref,
      },
    ],
  };
}
