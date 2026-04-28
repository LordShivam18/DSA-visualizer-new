import {
  categoryRegistry,
  categoryRegistryById,
  formatRegistryDifficulty,
  getCategoryProblemCount,
  problemRegistry,
} from "./problemRegistry";
import type {
  Difficulty,
  ProblemCatalogEntry,
  TopicCatalogEntry,
} from "./models";

function estimatedMinutesForDifficulty(difficulty: Difficulty) {
  if (difficulty === "Hard") {
    return 18;
  }

  if (difficulty === "Medium") {
    return 14;
  }

  return 10;
}

export const topicCatalog: TopicCatalogEntry[] = categoryRegistry.map(
  (category) => ({
    id: category.id,
    label: category.label,
    route: category.path,
    accent: category.accent,
    totalProblems: getCategoryProblemCount(category.id),
    summary: category.summary,
  })
);

export const academyProblemCatalog: ProblemCatalogEntry[] = problemRegistry.map(
  (problem) => {
    const difficulty = formatRegistryDifficulty(problem.difficulty);
    const category = categoryRegistryById[problem.category];

    return {
      problemId: problem.id,
      slug: problem.slug,
      title: problem.title,
      route: problem.path,
      topicId: problem.category,
      topicLabel: category?.label ?? problem.category,
      difficulty,
      description: problem.description,
      taxonomy: problem.taxonomy,
      skillTags: problem.tags,
      estimatedMinutes:
        problem.id === "array-string:best-time-to-buy-and-sell-stock-ii"
          ? 16
          : estimatedMinutesForDifficulty(difficulty),
      premiumModes:
        problem.id === "array-string:best-time-to-buy-and-sell-stock-ii"
          ? ["prediction", "practice", "interview"]
          : ["prediction", "practice"],
      practice:
        problem.id === "array-string:best-time-to-buy-and-sell-stock-ii"
          ? {
              answerLabel: "Expected max profit",
              answerPlaceholder: "7",
              strategyPrompt: "Which reasoning pattern should you apply first?",
              strategyOptions: [
                {
                  id: "positive-deltas",
                  label: "Add every positive adjacent gain",
                  description:
                    "Treat each rising edge as safe profit in an unlimited-transactions setting.",
                  isCorrect: true,
                },
                {
                  id: "single-best-window",
                  label: "Find one widest profitable window",
                  description:
                    "Optimizes for a single transaction, which is the wrong objective here.",
                },
                {
                  id: "sort-prices",
                  label: "Sort prices before scanning",
                  description:
                    "Destroys chronology, so it invalidates the buy/sell sequence.",
                },
              ],
              hints: [
                {
                  level: 1,
                  title: "Direction Hint",
                  body:
                    "Look at each day and only compare it with the day immediately before it.",
                },
                {
                  level: 2,
                  title: "Logic Hint",
                  body:
                    "Whenever the price rises from one day to the next, that rise can be added directly to the final answer.",
                },
                {
                  level: 3,
                  title: "Reveal Hint",
                  body:
                    "The hidden solution is the sum of all positive adjacent deltas; once you unlock this hint, the trace opens for step-by-step reveal.",
                },
              ],
              solutionLabel: "Positive deltas ledger",
            }
          : undefined,
      interview:
        problem.id === "array-string:best-time-to-buy-and-sell-stock-ii"
          ? {
              timeLimitSec: 480,
              hintBudget: 1,
              benchmarkMs: 180000,
              confidencePrompt:
                "How confident are you that your answer and reasoning would survive a whiteboard follow-up?",
            }
          : undefined,
    };
  }
);

export const academyProblemCatalogById = Object.fromEntries(
  academyProblemCatalog.map((problem) => [problem.problemId, problem])
);

export function getProblemCatalogEntry(problemId: string) {
  return academyProblemCatalogById[problemId] ?? null;
}
