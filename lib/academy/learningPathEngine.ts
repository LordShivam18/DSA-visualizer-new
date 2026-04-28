import type { AdaptiveRecommendation, Difficulty } from "./models";
import {
  categoryRegistryById,
  getProblemById,
  getProblemsByCategory,
  formatRegistryDifficulty,
  type Problem,
} from "./problemRegistry";
import { getCuratedLearningPathForProblem } from "./entryPoints";

export type GuidedPathNodeStatus =
  | "foundation"
  | "current"
  | "next"
  | "stretch"
  | "later";

export type GuidedPathNode = {
  problemId: string;
  title: string;
  route: string;
  difficulty: Difficulty;
  status: GuidedPathNodeStatus;
  summary: string;
};

export type GuidedLearningPath = {
  title: string;
  summary: string;
  nodes: GuidedPathNode[];
  recommendations: AdaptiveRecommendation[];
};

function toDifficultyLabel(problem: Problem): Difficulty {
  return formatRegistryDifficulty(problem.difficulty);
}

function statusForOffset(offset: number): GuidedPathNodeStatus {
  if (offset < 0) {
    return "foundation";
  }

  if (offset === 0) {
    return "current";
  }

  if (offset === 1) {
    return "next";
  }

  if (offset === 2) {
    return "stretch";
  }

  return "later";
}

function summaryForOffset(offset: number) {
  if (offset < 0) {
    return "Warm up the same pattern with a simpler or earlier rep.";
  }

  if (offset === 0) {
    return "This is the current lesson in the track.";
  }

  if (offset === 1) {
    return "Best immediate follow-up after this lesson settles.";
  }

  if (offset === 2) {
    return "A slightly wider transfer rep once the core pattern feels stable.";
  }

  return "Keep this in the queue for later reinforcement.";
}

export function buildGuidedLearningPath(
  problem: Problem,
  recommendations: AdaptiveRecommendation[]
): GuidedLearningPath {
  const curatedPath = getCuratedLearningPathForProblem(problem.id);

  if (curatedPath) {
    return {
      title: curatedPath.title,
      summary: curatedPath.summary,
      nodes: curatedPath.steps
        .map((step, index) => {
          const registryProblem = getProblemById(step.problemId);

          if (!registryProblem) {
            return null;
          }

          const offset = index - curatedPath.currentIndex;

          return {
            problemId: registryProblem.id,
            title: registryProblem.title,
            route: registryProblem.path,
            difficulty: toDifficultyLabel(registryProblem),
            status: statusForOffset(offset),
            summary: step.pathSummary,
          };
        })
        .filter((node): node is GuidedPathNode => node !== null),
      recommendations: recommendations.slice(0, 2),
    };
  }

  const categoryProblems = getProblemsByCategory(problem.category);
  const currentIndex = categoryProblems.findIndex(
    (candidate) => candidate.id === problem.id
  );
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const startIndex = Math.max(0, safeIndex - 1);
  const endIndex = Math.min(categoryProblems.length, safeIndex + 3);
  const categoryLabel =
    categoryRegistryById[problem.category]?.label ?? problem.category;

  return {
    title: `${categoryLabel} progression`,
    summary: `Lesson ${safeIndex + 1} of ${categoryProblems.length} in the registry-ordered ${categoryLabel} track.`,
    nodes: categoryProblems.slice(startIndex, endIndex).map((candidate, index) => {
      const absoluteIndex = startIndex + index;
      const offset = absoluteIndex - safeIndex;

      return {
        problemId: candidate.id,
        title: candidate.title,
        route: candidate.path,
        difficulty: toDifficultyLabel(candidate),
        status: statusForOffset(offset),
        summary: summaryForOffset(offset),
      };
    }),
    recommendations: recommendations.slice(0, 2),
  };
}
