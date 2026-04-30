import { getProblemCatalogEntry } from "./catalog";
import { createSessionId } from "./localProgressStore";
import type { Problem } from "./problemRegistry";
import type { SessionEvaluation, SessionRecord } from "./models";

type TraceLessonMode = "learn" | "prediction";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function formatInputSummary(inputs: Record<string, string>) {
  const summary = Object.entries(inputs)
    .map(([key, value]) => {
      const compactValue = value.trim().replace(/\s+/g, " ");
      return `${key}=${compactValue}`;
    })
    .join(" | ");

  return summary.length > 180 ? `${summary.slice(0, 177)}...` : summary;
}

function buildTraceLessonEvaluation({
  mode,
  durationMs,
  estimatedMinutes,
  askedCount,
  correctCount,
}: {
  mode: TraceLessonMode;
  durationMs: number;
  estimatedMinutes: number;
  askedCount: number;
  correctCount: number;
}): SessionEvaluation {
  const accuracy =
    mode === "prediction" && askedCount > 0
      ? Math.round((correctCount / askedCount) * 100)
      : mode === "prediction"
      ? 0
      : 100;
  const targetMs = Math.max(estimatedMinutes, 1) * 60000;
  const paceRatio = durationMs / targetMs;
  const efficiencyScore = clamp(
    Math.round(100 - Math.max(0, (paceRatio - 1) * 32)),
    62,
    100
  );
  const confidenceScore = clamp(
    Math.round(
      mode === "prediction"
        ? (accuracy === 0 ? 64 : accuracy * 0.78 + 14)
        : 88
    ),
    60,
    100
  );
  const weakSignals: string[] = [];
  const notes = [
    "The lesson trace was completed from the first step to the final state.",
    mode === "prediction"
      ? askedCount === 0
        ? "Prediction mode stayed available, but no recall checkpoints were answered."
        : `Prediction checkpoints landed at ${accuracy}% first-attempt accuracy.`
      : "Guided mode prioritized flow over active recall for this pass.",
  ];

  if (mode === "prediction" && accuracy > 0 && accuracy < 70) {
    weakSignals.push("next-step recall");
  }

  if (mode === "prediction" && askedCount === 0) {
    weakSignals.push("prediction engagement");
  }

  if (paceRatio > 1.35) {
    weakSignals.push("pacing");
    notes.push("The session ran longer than the estimated lesson pace.");
  }

  return {
    accuracy,
    correctness: true,
    efficiencyScore,
    confidenceScore,
    finalScore: clamp(
      Math.round(accuracy * 0.5 + efficiencyScore * 0.28 + confidenceScore * 0.22),
      0,
      100
    ),
    weakSignals,
    notes,
  };
}

export function buildTraceLessonSession({
  problem,
  mode,
  startedAt,
  endedAt,
  durationMs,
  inputs,
  askedCount,
  correctCount,
}: {
  problem: Problem;
  mode: TraceLessonMode;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  inputs: Record<string, string>;
  askedCount: number;
  correctCount: number;
}): SessionRecord {
  const catalogEntry = getProblemCatalogEntry(problem.id);
  const estimatedMinutes = catalogEntry?.estimatedMinutes ?? 12;

  return {
    id: createSessionId(problem.id, mode),
    problemId: problem.id,
    problemTitle: problem.title,
    route: problem.path,
    topicId: catalogEntry?.topicId ?? problem.category,
    topicLabel: catalogEntry?.topicLabel ?? problem.category,
    difficulty: catalogEntry?.difficulty ?? "Medium",
    mode,
    startedAt,
    endedAt,
    durationMs,
    inputSummary: formatInputSummary(inputs),
    hintsUsed: 0,
    prediction: {
      asked: askedCount,
      correct: correctCount,
    },
    evaluation: buildTraceLessonEvaluation({
      mode,
      durationMs,
      estimatedMinutes,
      askedCount,
      correctCount,
    }),
    completed: true,
  };
}
