import type { LearningPlatformState } from "./models";
import {
  categoryRegistry,
  categoryRegistryById,
  problemRegistry,
  problemRegistryById,
  problemRegistryByPath,
  type RegistryDifficulty,
} from "./problemRegistry";

export type HintDependency = "low" | "medium" | "high";
export type SpeedProfile = "fast" | "average" | "slow";

export type UserMetrics = {
  solvedProblems: string[];
  accuracy: Record<string, number>;
  timeSpent: Record<string, number>;
  hintUsage: Record<string, number>;
  attempts?: Record<string, number>;
};

export type LearningInsights = {
  strongCategories: string[];
  weakCategories: string[];
  hintDependency: HintDependency;
  speedProfile: SpeedProfile;
  recommendations: string[];
};

export type CategoryLearningInsight = {
  categoryId: string;
  label: string;
  totalProblems: number;
  attemptedProblems: number;
  solvedProblems: number;
  attempts: number;
  accuracy: number;
  hintsUsed: number;
  hintsPerAttempt: number;
  averageTimeMs: number;
  speedRatio: number;
  masteryScore: number;
  status: "strong" | "weak" | "building" | "unstarted";
};

type CategoryAggregate = {
  categoryId: string;
  label: string;
  totalProblems: number;
  attemptedProblems: number;
  solvedProblems: number;
  attempts: number;
  weightedAccuracy: number;
  accuracyWeight: number;
  timeMs: number;
  timeWeight: number;
  baselineMs: number;
  hintsUsed: number;
};

const baselineMsByDifficulty: Record<RegistryDifficulty, number> = {
  easy: 10 * 60000,
  medium: 14 * 60000,
  hard: 18 * 60000,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function normalizePercent(value: number) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  if (value >= 0 && value <= 1) {
    return round(value * 100);
  }

  return round(clamp(value, 0, 100));
}

function hasMetric(record: Record<string, number>, problemId: string, path: string) {
  return record[problemId] !== undefined || record[path] !== undefined;
}

function readMetric(record: Record<string, number>, problemId: string, path: string) {
  return record[problemId] ?? record[path] ?? null;
}

function resolveProblemId(problemKey: string) {
  const byId = problemRegistryById[problemKey];

  if (byId) {
    return byId.id;
  }

  const byPath = problemRegistryByPath[problemKey];

  if (byPath) {
    return byPath.id;
  }

  return null;
}

function formatList(values: string[]) {
  if (values.length === 0) {
    return "";
  }

  if (values.length === 1) {
    return values[0];
  }

  return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
}

function createCategoryAggregates() {
  return Object.fromEntries(
    categoryRegistry.map((category) => [
      category.id,
      {
        categoryId: category.id,
        label: category.label,
        totalProblems: 0,
        attemptedProblems: 0,
        solvedProblems: 0,
        attempts: 0,
        weightedAccuracy: 0,
        accuracyWeight: 0,
        timeMs: 0,
        timeWeight: 0,
        baselineMs: 0,
        hintsUsed: 0,
      },
    ])
  ) as Record<string, CategoryAggregate>;
}

function computeMasteryScore(row: Omit<CategoryLearningInsight, "masteryScore" | "status">) {
  if (row.attempts === 0) {
    return 0;
  }

  const coverageScore =
    row.totalProblems === 0 ? 0 : (row.solvedProblems / row.totalProblems) * 100;
  const attemptConfidence = Math.min(row.attempts * 2, 12);
  const hintPenalty = Math.min(row.hintsPerAttempt * 12, 28);
  const speedPenalty =
    row.speedRatio > 1 ? Math.min((row.speedRatio - 1) * 18, 18) : 0;

  return clamp(
    Math.round(
      row.accuracy * 0.62 +
        coverageScore * 0.22 +
        attemptConfidence -
        hintPenalty -
        speedPenalty
    ),
    0,
    100
  );
}

function categoryStatus(row: Omit<CategoryLearningInsight, "status">) {
  if (row.attempts === 0) {
    return "unstarted";
  }

  const weakAccuracyCutoff = row.attempts >= 3 ? 75 : 65;

  if (row.accuracy < weakAccuracyCutoff) {
    return "weak";
  }

  if (row.accuracy >= 82 && row.solvedProblems > 0 && row.hintsPerAttempt <= 1) {
    return "strong";
  }

  return "building";
}

export function getCategoryInsightRows(
  metrics: UserMetrics
): CategoryLearningInsight[] {
  const solvedProblemIds = new Set(
    metrics.solvedProblems
      .map(resolveProblemId)
      .filter((problemId): problemId is string => problemId !== null)
  );
  const aggregates = createCategoryAggregates();

  problemRegistry.forEach((problem) => {
    const aggregate = aggregates[problem.category];

    if (!aggregate) {
      return;
    }

    const accuracyValue = readMetric(metrics.accuracy, problem.id, problem.path);
    const timeSpentValue = readMetric(metrics.timeSpent, problem.id, problem.path);
    const hintUsageValue = readMetric(metrics.hintUsage, problem.id, problem.path);
    const explicitAttempts = metrics.attempts
      ? readMetric(metrics.attempts, problem.id, problem.path)
      : null;
    const hasAnyMetric =
      accuracyValue !== null ||
      timeSpentValue !== null ||
      hintUsageValue !== null ||
      hasMetric(metrics.accuracy, problem.id, problem.path) ||
      hasMetric(metrics.timeSpent, problem.id, problem.path) ||
      hasMetric(metrics.hintUsage, problem.id, problem.path);
    const solved = solvedProblemIds.has(problem.id);
    const attempts = Math.max(
      0,
      Math.round(
        explicitAttempts ??
          (hasAnyMetric || solved ? 1 : 0)
      )
    );

    aggregate.totalProblems += 1;

    if (attempts === 0) {
      return;
    }

    aggregate.attemptedProblems += 1;
    aggregate.attempts += attempts;

    if (solved) {
      aggregate.solvedProblems += 1;
    }

    if (accuracyValue !== null || solved) {
      const normalizedAccuracy = normalizePercent(accuracyValue ?? 100);
      aggregate.weightedAccuracy += normalizedAccuracy * attempts;
      aggregate.accuracyWeight += attempts;
    }

    if (timeSpentValue !== null && Number.isFinite(timeSpentValue)) {
      const safeTime = Math.max(0, timeSpentValue);
      aggregate.timeMs += safeTime * attempts;
      aggregate.timeWeight += attempts;
      aggregate.baselineMs += baselineMsByDifficulty[problem.difficulty] * attempts;
    }

    if (hintUsageValue !== null && Number.isFinite(hintUsageValue)) {
      aggregate.hintsUsed += Math.max(0, hintUsageValue);
    }
  });

  return categoryRegistry.map((category) => {
    const aggregate = aggregates[category.id];
    const accuracy =
      aggregate.accuracyWeight === 0
        ? 0
        : round(aggregate.weightedAccuracy / aggregate.accuracyWeight);
    const averageTimeMs =
      aggregate.timeWeight === 0 ? 0 : round(aggregate.timeMs / aggregate.timeWeight);
    const speedRatio =
      aggregate.baselineMs === 0 ? 1 : round(aggregate.timeMs / aggregate.baselineMs);
    const hintsPerAttempt =
      aggregate.attempts === 0 ? 0 : round(aggregate.hintsUsed / aggregate.attempts);
    const baseRow = {
      categoryId: category.id,
      label: aggregate.label,
      totalProblems: aggregate.totalProblems,
      attemptedProblems: aggregate.attemptedProblems,
      solvedProblems: aggregate.solvedProblems,
      attempts: aggregate.attempts,
      accuracy,
      hintsUsed: aggregate.hintsUsed,
      hintsPerAttempt,
      averageTimeMs,
      speedRatio,
    };
    const masteryScore = computeMasteryScore(baseRow);

    return {
      ...baseRow,
      masteryScore,
      status: categoryStatus({ ...baseRow, masteryScore }),
    };
  });
}

export function buildUserMetricsFromLearningState(
  state: LearningPlatformState
): UserMetrics {
  const solvedProblems: string[] = [];
  const accuracy: Record<string, number> = {};
  const timeSpent: Record<string, number> = {};
  const hintUsage: Record<string, number> = {};
  const attempts: Record<string, number> = {};

  Object.values(state.problems).forEach((problem) => {
    if (!problemRegistryById[problem.problemId]) {
      return;
    }

    if (problem.completions > 0) {
      solvedProblems.push(problem.problemId);
    }

    accuracy[problem.problemId] = problem.accuracy;
    timeSpent[problem.problemId] = problem.averageTimeMs;
    hintUsage[problem.problemId] = problem.hintsUsed;
    attempts[problem.problemId] = problem.attempts;
  });

  return {
    solvedProblems,
    accuracy,
    timeSpent,
    hintUsage,
    attempts,
  };
}

export function getHintDependency(metrics: UserMetrics): HintDependency {
  let totalHints = 0;
  let totalAttempts = 0;

  problemRegistry.forEach((problem) => {
    const hints = readMetric(metrics.hintUsage, problem.id, problem.path) ?? 0;
    const attempts =
      (metrics.attempts
        ? readMetric(metrics.attempts, problem.id, problem.path)
        : null) ??
      (hints > 0 || hasMetric(metrics.accuracy, problem.id, problem.path) ? 1 : 0);

    totalHints += Math.max(0, hints);
    totalAttempts += Math.max(0, attempts);
  });

  if (totalAttempts === 0) {
    return "low";
  }

  const hintsPerAttempt = totalHints / totalAttempts;

  if (hintsPerAttempt > 1) {
    return "high";
  }

  if (hintsPerAttempt > 0.35) {
    return "medium";
  }

  return "low";
}

export function getSpeedProfile(metrics: UserMetrics): SpeedProfile {
  let totalTimeMs = 0;
  let totalBaselineMs = 0;

  problemRegistry.forEach((problem) => {
    const timeSpentValue = readMetric(metrics.timeSpent, problem.id, problem.path);

    if (timeSpentValue === null || !Number.isFinite(timeSpentValue)) {
      return;
    }

    const attempts =
      (metrics.attempts
        ? readMetric(metrics.attempts, problem.id, problem.path)
        : null) ?? 1;
    const safeAttempts = Math.max(1, attempts);

    totalTimeMs += Math.max(0, timeSpentValue) * safeAttempts;
    totalBaselineMs += baselineMsByDifficulty[problem.difficulty] * safeAttempts;
  });

  if (totalBaselineMs === 0) {
    return "average";
  }

  const ratio = totalTimeMs / totalBaselineMs;

  if (ratio <= 0.72) {
    return "fast";
  }

  if (ratio >= 1.25) {
    return "slow";
  }

  return "average";
}

export function generateLearningInsights(metrics: UserMetrics): LearningInsights {
  const rows = getCategoryInsightRows(metrics);
  const attemptedRows = rows.filter((row) => row.attempts > 0);
  const strongCategories = rows
    .filter((row) => row.status === "strong")
    .sort((left, right) => {
      if (right.masteryScore !== left.masteryScore) {
        return right.masteryScore - left.masteryScore;
      }

      return right.accuracy - left.accuracy;
    })
    .slice(0, 3)
    .map((row) => row.label);
  const weakCategories = rows
    .filter((row) => row.status === "weak")
    .sort((left, right) => {
      if (left.accuracy !== right.accuracy) {
        return left.accuracy - right.accuracy;
      }

      return right.attempts - left.attempts;
    })
    .slice(0, 3)
    .map((row) => row.label);
  const hintDependency = getHintDependency(metrics);
  const speedProfile = getSpeedProfile(metrics);
  const recommendations: string[] = [];

  if (attemptedRows.length === 0) {
    recommendations.push(
      "Complete one guided lesson to unlock category-level learning insights."
    );
  }

  if (strongCategories.length > 0 && weakCategories.length > 0) {
    recommendations.push(
      `You are strong in ${formatList(strongCategories)} but should reinforce ${formatList(
        weakCategories
      )}.`
    );
  } else if (strongCategories.length > 0) {
    recommendations.push(
      `Your strongest category is ${formatList(strongCategories)}; use it as a confidence anchor before moving into harder patterns.`
    );
  } else if (weakCategories.length > 0) {
    recommendations.push(
      `Your weakest category is ${formatList(weakCategories)}; spend the next session there before adding new topics.`
    );
  }

  const weakestRow = rows.find((row) => weakCategories.includes(row.label));

  if (weakestRow) {
    recommendations.push(
      `${weakestRow.label} accuracy is ${Math.round(
        weakestRow.accuracy
      )}% across ${weakestRow.attempts} attempt${
        weakestRow.attempts === 1 ? "" : "s"
      }; take an easier unsolved problem there and rebuild the invariant step by step.`
    );
  }

  if (hintDependency === "high") {
    recommendations.push(
      "You rely heavily on hints. Try one prediction or practice attempt with no hint reveal before opening guidance."
    );
  } else if (hintDependency === "medium") {
    recommendations.push(
      "Your hint use is moderate. Delay the first hint until you can name the invariant you are testing."
    );
  }

  if (speedProfile === "slow") {
    recommendations.push(
      "Your solve pace is slower than the current difficulty baseline. Review the trace summary before starting the next timed run."
    );
  } else if (speedProfile === "fast" && weakCategories.length === 0) {
    recommendations.push(
      "Your pace is strong. Add one slightly harder unsolved problem to keep the practice adaptive."
    );
  }

  return {
    strongCategories,
    weakCategories,
    hintDependency,
    speedProfile,
    recommendations: recommendations.slice(0, 5),
  };
}

export function getCategoryLabel(categoryId: string) {
  return categoryRegistryById[categoryId]?.label ?? categoryId;
}
