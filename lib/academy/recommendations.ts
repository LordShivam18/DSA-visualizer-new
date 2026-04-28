import {
  buildUserMetricsFromLearningState,
  generateLearningInsights,
  getCategoryInsightRows,
  type LearningInsights,
} from "./learningInsights";
import type {
  AdaptiveRecommendation,
  Difficulty,
  LearningPlatformState,
  TopicProgress,
} from "./models";
import {
  categoryRegistry,
  categoryRegistryById,
  formatRegistryDifficulty,
  problemRegistry,
  problemRegistryById,
  type Problem,
  type RegistryDifficulty,
} from "./problemRegistry";

const difficultyWeight: Record<RegistryDifficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

function toDifficulty(difficulty: RegistryDifficulty): Difficulty {
  return formatRegistryDifficulty(difficulty);
}

function dedupeRecommendations(items: AdaptiveRecommendation[]) {
  const seen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.problemId)) {
      return false;
    }

    seen.add(item.problemId);
    return true;
  });
}

function defaultTopicProgress(categoryId: string): TopicProgress {
  const category = categoryRegistryById[categoryId];

  return {
    topicId: categoryId,
    topicLabel: category?.label ?? categoryId,
    attempts: 0,
    completions: 0,
    accuracy: 0,
    averageTimeMs: 0,
    mastery: 0,
    weakSignals: [],
    lastPracticedAt: null,
  };
}

function normalizedCategoryKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function resolveCategoryId(value: string) {
  const key = normalizedCategoryKey(value);
  const match = categoryRegistry.find(
    (category) =>
      category.id === value ||
      normalizedCategoryKey(category.id) === key ||
      normalizedCategoryKey(category.label) === key
  );

  return match?.id ?? null;
}

function toRecommendation(
  problem: Problem,
  track: AdaptiveRecommendation["track"],
  reason: string
): AdaptiveRecommendation {
  const category = categoryRegistryById[problem.category];

  return {
    problemId: problem.id,
    title: problem.title,
    route: problem.path,
    difficulty: toDifficulty(problem.difficulty),
    topicLabel: category?.label ?? problem.category,
    track,
    reason,
  };
}

function getCompletedProblemIds(state: LearningPlatformState) {
  return new Set(
    Object.values(state.problems)
      .filter((problem) => problem.completions > 0)
      .map((problem) => problem.problemId)
  );
}

function nextDifficultyCeiling(
  categoryId: string,
  completedProblemIds: Set<string>,
  currentProblem: Problem | null
) {
  if (currentProblem?.category === categoryId) {
    return Math.min(3, difficultyWeight[currentProblem.difficulty] + 1);
  }

  const solvedWeights = problemRegistry
    .filter(
      (problem) =>
        problem.category === categoryId && completedProblemIds.has(problem.id)
    )
    .map((problem) => difficultyWeight[problem.difficulty]);

  if (solvedWeights.length === 0) {
    return 2;
  }

  return Math.min(3, Math.max(...solvedWeights) + 1);
}

function rankCandidate(
  problem: Problem,
  completedProblemIds: Set<string>,
  difficultyCeiling: number
) {
  const unsolvedRank = completedProblemIds.has(problem.id) ? 1 : 0;
  const weight = difficultyWeight[problem.difficulty];
  const ceilingDistance = weight <= difficultyCeiling ? 0 : weight - difficultyCeiling;

  return {
    unsolvedRank,
    ceilingDistance,
    weight,
    title: problem.title,
  };
}

function selectCategoryProblem({
  categoryId,
  completedProblemIds,
  currentProblemId,
  difficultyCeiling,
}: {
  categoryId: string;
  completedProblemIds: Set<string>;
  currentProblemId?: string;
  difficultyCeiling: number;
}) {
  return problemRegistry
    .filter(
      (problem) =>
        problem.category === categoryId && problem.id !== currentProblemId
    )
    .sort((left, right) => {
      const leftRank = rankCandidate(left, completedProblemIds, difficultyCeiling);
      const rightRank = rankCandidate(right, completedProblemIds, difficultyCeiling);

      if (leftRank.unsolvedRank !== rightRank.unsolvedRank) {
        return leftRank.unsolvedRank - rightRank.unsolvedRank;
      }

      if (leftRank.ceilingDistance !== rightRank.ceilingDistance) {
        return leftRank.ceilingDistance - rightRank.ceilingDistance;
      }

      if (leftRank.weight !== rightRank.weight) {
        return leftRank.weight - rightRank.weight;
      }

      return leftRank.title.localeCompare(rightRank.title);
    })[0];
}

export function getWeakTopicBreakdown(state: LearningPlatformState) {
  const topics: TopicProgress[] = categoryRegistry.map((category) => {
    return state.topics[category.id] ?? defaultTopicProgress(category.id);
  });

  return topics.sort((left, right) => {
    if (left.mastery !== right.mastery) {
      return left.mastery - right.mastery;
    }

    return left.accuracy - right.accuracy;
  });
}

export function getAdaptiveRecommendations(
  state: LearningPlatformState,
  currentProblemId?: string,
  learningInsights?: LearningInsights
) {
  const userMetrics = buildUserMetricsFromLearningState(state);
  const insights = learningInsights ?? generateLearningInsights(userMetrics);
  const categoryRows = getCategoryInsightRows(userMetrics);
  const completedProblemIds = getCompletedProblemIds(state);
  const currentProblem = currentProblemId
    ? problemRegistryById[currentProblemId] ?? null
    : null;
  const recommendations: AdaptiveRecommendation[] = [];
  const weakCategoryIds = insights.weakCategories
    .map(resolveCategoryId)
    .filter((categoryId): categoryId is string => categoryId !== null);

  weakCategoryIds.forEach((categoryId) => {
    const category = categoryRegistryById[categoryId];
    const categoryRow = categoryRows.find((row) => row.categoryId === categoryId);
    const pick = selectCategoryProblem({
      categoryId,
      completedProblemIds,
      currentProblemId,
      difficultyCeiling: nextDifficultyCeiling(
        categoryId,
        completedProblemIds,
        currentProblem
      ),
    });

    if (!pick) {
      return;
    }

    recommendations.push(
      toRecommendation(
        pick,
        "repair",
        `${category?.label ?? categoryId} is currently a weak category at ${
          categoryRow ? Math.round(categoryRow.accuracy) : 0
        }% accuracy, so this unsolved ${toDifficulty(
          pick.difficulty
        )} lesson gives you a focused repair rep.`
      )
    );
  });

  if (currentProblem) {
    const currentCategory = categoryRegistryById[currentProblem.category];
    const currentWeight = difficultyWeight[currentProblem.difficulty];
    const reinforcePick = problemRegistry
      .filter(
        (problem) =>
          problem.category === currentProblem.category &&
          problem.id !== currentProblem.id &&
          !completedProblemIds.has(problem.id) &&
          difficultyWeight[problem.difficulty] <= currentWeight
      )
      .sort(
        (left, right) =>
          difficultyWeight[right.difficulty] - difficultyWeight[left.difficulty] ||
          left.title.localeCompare(right.title)
      )[0];

    if (reinforcePick) {
      recommendations.push(
        toRecommendation(
          reinforcePick,
          "reinforce",
          `Stay in ${currentCategory?.label ?? currentProblem.category} and reinforce a nearby ${toDifficulty(
            reinforcePick.difficulty
          )} pattern before ramping up.`
        )
      );
    }

    const stretchPick = problemRegistry
      .filter(
        (problem) =>
          problem.category === currentProblem.category &&
          problem.id !== currentProblem.id &&
          !completedProblemIds.has(problem.id) &&
          difficultyWeight[problem.difficulty] === Math.min(currentWeight + 1, 3)
      )
      .sort(
        (left, right) =>
          difficultyWeight[left.difficulty] - difficultyWeight[right.difficulty] ||
          left.title.localeCompare(right.title)
      )[0];

    if (stretchPick) {
      recommendations.push(
        toRecommendation(
          stretchPick,
          "stretch",
          `Your next ${currentCategory?.label ?? currentProblem.category} step is one difficulty level higher, which keeps the progression gradual.`
        )
      );
    }
  }

  if (recommendations.length === 0) {
    const fallbackCategory =
      weakCategoryIds[0] ??
      categoryRows
        .filter((row) => row.status !== "unstarted")
        .sort((left, right) => left.masteryScore - right.masteryScore)[0]
        ?.categoryId;
    const fallbackPick = fallbackCategory
      ? selectCategoryProblem({
          categoryId: fallbackCategory,
          completedProblemIds,
          currentProblemId,
          difficultyCeiling: nextDifficultyCeiling(
            fallbackCategory,
            completedProblemIds,
            currentProblem
          ),
        })
      : problemRegistry.find(
          (problem) =>
            !completedProblemIds.has(problem.id) &&
            problem.id !== currentProblemId
        ) ?? problemRegistry.find((problem) => problem.id !== currentProblemId);

    if (fallbackPick) {
      recommendations.push(
        toRecommendation(
          fallbackPick,
          "reinforce",
          "Build your streak with an unsolved registry lesson selected from your current progress profile."
        )
      );
    }
  }

  return dedupeRecommendations(recommendations).slice(0, 3);
}
