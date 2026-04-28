import {
  academyProblemCatalog,
  getProblemCatalogEntry,
  topicCatalog,
} from "./catalog";
import type {
  AdaptiveRecommendation,
  Difficulty,
  LearningPlatformState,
  TopicProgress,
} from "./models";

const difficultyWeight: Record<Difficulty, number> = {
  Easy: 1,
  Medium: 2,
  Hard: 3,
};

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

export function getWeakTopicBreakdown(state: LearningPlatformState) {
  const topics: TopicProgress[] = topicCatalog.map((topic) => {
    return (
      state.topics[topic.id] ?? {
        topicId: topic.id,
        topicLabel: topic.label,
        attempts: 0,
        completions: 0,
        accuracy: 0,
        averageTimeMs: 0,
        mastery: 0,
        weakSignals: [],
        lastPracticedAt: null,
      }
    );
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
  currentProblemId?: string
) {
  const completedProblemIds = new Set(
    Object.values(state.problems)
      .filter((problem) => problem.completions > 0)
      .map((problem) => problem.problemId)
  );

  const weakTopic = getWeakTopicBreakdown(state)[0];
  const currentProblem = currentProblemId
    ? getProblemCatalogEntry(currentProblemId)
    : null;
  const recommendations: AdaptiveRecommendation[] = [];

  if (weakTopic) {
    const repairPick = academyProblemCatalog.find(
      (problem) =>
        problem.topicId === weakTopic.topicId &&
        !completedProblemIds.has(problem.problemId) &&
        problem.problemId !== currentProblemId
    );

    if (repairPick) {
      recommendations.push({
        problemId: repairPick.problemId,
        title: repairPick.title,
        route: repairPick.route,
        difficulty: repairPick.difficulty,
        topicLabel: repairPick.topicLabel,
        track: "repair",
        reason: `Your ${repairPick.topicLabel} mastery is the lowest right now. Tighten that topic with one more guided rep.`,
      });
    }
  }

  if (currentProblem) {
    const reinforcePick = academyProblemCatalog.find(
      (problem) =>
        problem.topicId === currentProblem.topicId &&
        !completedProblemIds.has(problem.problemId) &&
        problem.problemId !== currentProblem.problemId &&
        difficultyWeight[problem.difficulty] <= difficultyWeight[currentProblem.difficulty]
    );

    if (reinforcePick) {
      recommendations.push({
        problemId: reinforcePick.problemId,
        title: reinforcePick.title,
        route: reinforcePick.route,
        difficulty: reinforcePick.difficulty,
        topicLabel: reinforcePick.topicLabel,
        track: "reinforce",
        reason: `Stay in ${reinforcePick.topicLabel} and reinforce the same pattern family before you ramp difficulty again.`,
      });
    }

    const stretchPick = academyProblemCatalog.find(
      (problem) =>
        problem.topicId === currentProblem.topicId &&
        !completedProblemIds.has(problem.problemId) &&
        problem.problemId !== currentProblem.problemId &&
        difficultyWeight[problem.difficulty] > difficultyWeight[currentProblem.difficulty]
    );

    if (stretchPick) {
      recommendations.push({
        problemId: stretchPick.problemId,
        title: stretchPick.title,
        route: stretchPick.route,
        difficulty: stretchPick.difficulty,
        topicLabel: stretchPick.topicLabel,
        track: "stretch",
        reason: `Once this lesson feels automatic, this is the next pressure jump inside the same track.`,
      });
    }
  }

  if (recommendations.length === 0) {
    const fallbackPick =
      academyProblemCatalog.find(
        (problem) =>
          !completedProblemIds.has(problem.problemId) &&
          problem.problemId !== currentProblemId
      ) ??
      academyProblemCatalog.find((problem) => problem.problemId !== currentProblemId);

    if (fallbackPick) {
      recommendations.push({
        problemId: fallbackPick.problemId,
        title: fallbackPick.title,
        route: fallbackPick.route,
        difficulty: fallbackPick.difficulty,
        topicLabel: fallbackPick.topicLabel,
        track: "reinforce",
        reason: "Build your streak with another guided lesson from the current catalog.",
      });
    }
  }

  return dedupeRecommendations(recommendations).slice(0, 3);
}
