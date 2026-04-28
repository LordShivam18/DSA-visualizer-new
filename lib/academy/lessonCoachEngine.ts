import type { LearningInsights } from "./learningInsights";
import type {
  AdaptiveRecommendation,
  LearnerProfile,
  ProblemProgress,
  PredictionFeedback,
  TopicProgress,
} from "./models";
import type { PatternRecognitionInsight } from "./patternEngine";
import type { Problem } from "./problemRegistry";
import type { ReplayVariation } from "./variationEngine";
import type { WhyExplanation } from "./whyEngine";

export type LessonActionTone = "cyan" | "emerald" | "amber" | "violet" | "rose";

export type LessonActionCard = {
  label: string;
  title: string;
  detail: string;
  tone: LessonActionTone;
};

export type LessonIntelligenceInsight = {
  headline: string;
  summary: string;
  metrics: Array<{
    label: string;
    value: string;
  }>;
  actions: LessonActionCard[];
};

function formatPercent(value: number | null | undefined) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "New";
  }

  return `${Math.round(value)}%`;
}

export function buildLessonIntelligence({
  problem,
  learner,
  problemProgress,
  topicProgress,
  learningInsights,
  pattern,
  whyInsight,
  feedback,
  recommendations,
  variations,
  predictionAccuracy,
}: {
  problem: Problem;
  learner: LearnerProfile;
  problemProgress: ProblemProgress | null;
  topicProgress: TopicProgress | null;
  learningInsights: LearningInsights;
  pattern: PatternRecognitionInsight | null;
  whyInsight: WhyExplanation | null;
  feedback: PredictionFeedback | null;
  recommendations: AdaptiveRecommendation[];
  variations: ReplayVariation[];
  predictionAccuracy: number;
}): LessonIntelligenceInsight {
  const topRecommendation = recommendations[0];
  const replayPick =
    variations.find((variation) => variation.kind === "adversarial") ??
    variations.find((variation) => variation.kind === "edge") ??
    variations[0];
  const weakInCurrentTrack = learningInsights.weakCategories.includes(
    topicProgress?.topicLabel ?? problem.category
  );
  const headline =
    feedback && !feedback.correct
      ? "Repair the reasoning pattern before adding more speed."
      : weakInCurrentTrack
      ? `Use ${problem.title} as a focused repair rep.`
      : problemProgress
      ? "Convert the trace into recall, then into transfer."
      : `Build your first durable model for ${pattern?.label ?? "this pattern"}.`;
  const summary =
    feedback && feedback.diagnosis
      ? feedback.diagnosis
      : whyInsight
      ? `Anchor the next move on "${whyInsight.nextFocus}" so the step stays tied to the invariant instead of the surface animation.`
      : `Treat ${problem.title} as a guided rep, then immediately replay it on a different case so the pattern detaches from one example.`;

  return {
    headline,
    summary,
    metrics: [
      {
        label: "Streak",
        value: `${learner.streakDays} day${learner.streakDays === 1 ? "" : "s"}`,
      },
      {
        label: "Problem mastery",
        value: formatPercent(problemProgress?.mastery),
      },
      {
        label: "Prediction",
        value: predictionAccuracy > 0 ? `${predictionAccuracy}%` : "Warm up",
      },
      {
        label: "Track mastery",
        value: formatPercent(topicProgress?.mastery),
      },
    ],
    actions: [
      {
        label: "Now",
        title:
          feedback && !feedback.correct
            ? "Restate the invariant out loud"
            : "Name the next local proof",
        detail:
          whyInsight?.reason ??
          "Before advancing, say what evidence the algorithm needs from this exact step.",
        tone: feedback && !feedback.correct ? "rose" : "cyan",
      },
      {
        label: "Replay",
        title: replayPick ? replayPick.label : "Change one boundary",
        detail: replayPick
          ? replayPick.summary
          : "Use the custom inputs to force an edge case before moving on to a new lesson.",
        tone: "amber",
      },
      {
        label: "Next",
        title: topRecommendation?.title ?? "Reinforce a nearby pattern",
        detail:
          topRecommendation?.reason ??
          "Stay close to the current pattern while the state transition is still fresh.",
        tone: "violet",
      },
    ],
  };
}
