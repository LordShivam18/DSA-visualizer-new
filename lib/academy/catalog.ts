import { arrayStringProblems } from "@/components/array-string/shared/problemMeta";

import type {
  ProblemCatalogEntry,
  TopicCatalogEntry,
} from "./models";

function skillTagsFromTaxonomy(taxonomy: string) {
  return taxonomy
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);
}

export const topicCatalog: TopicCatalogEntry[] = [
  {
    id: "array-string",
    label: "Array / String",
    route: "/array-string",
    accent: "cyan",
    totalProblems: arrayStringProblems.length,
    summary: "Greedy scans, string transforms, in-place compaction, and simulation.",
  },
  {
    id: "two-pointers",
    label: "Two Pointers",
    route: "/two-pointers",
    accent: "violet",
    totalProblems: 5,
    summary: "Converging indices, partition scans, and inward proof strategies.",
  },
  {
    id: "sliding-window",
    label: "Sliding Window",
    route: "/sliding-window",
    accent: "emerald",
    totalProblems: 4,
    summary: "Dynamic ranges, frequency maps, and expandable constraints.",
  },
  {
    id: "matrix",
    label: "Matrix",
    route: "/matrix",
    accent: "amber",
    totalProblems: 5,
    summary: "Grid simulation, rotations, in-place transforms, and boundary traversals.",
  },
  {
    id: "binary-search",
    label: "Binary Search",
    route: "/binary-search",
    accent: "rose",
    totalProblems: 7,
    summary: "Monotonic structure, partition logic, and boundary targeting.",
  },
  {
    id: "dp-1d",
    label: "1D DP",
    route: "/dp-1d",
    accent: "blue",
    totalProblems: 5,
    summary: "State compression, recurrence spotting, and optimal substructure.",
  },
];

const baseArrayStringCatalog: ProblemCatalogEntry[] = arrayStringProblems.map(
  (problem) => ({
    problemId: `array-string:${problem.slug}`,
    slug: problem.slug,
    title: problem.title,
    route: `/array-string/${problem.slug}`,
    topicId: "array-string",
    topicLabel: "Array / String",
    difficulty: problem.difficulty,
    description: problem.description,
    taxonomy: problem.taxonomy,
    skillTags: skillTagsFromTaxonomy(problem.taxonomy),
    estimatedMinutes: problem.difficulty === "Hard" ? 18 : problem.difficulty === "Medium" ? 14 : 10,
    premiumModes:
      problem.slug === "best-time-to-buy-and-sell-stock-ii"
        ? ["prediction", "practice", "interview"]
        : ["prediction", "practice"],
  })
);

export const stockIILessonDefinition: ProblemCatalogEntry = {
  ...baseArrayStringCatalog.find(
    (problem) => problem.slug === "best-time-to-buy-and-sell-stock-ii"
  )!,
  estimatedMinutes: 16,
  practice: {
    answerLabel: "Expected max profit",
    answerPlaceholder: "7",
    strategyPrompt: "Which reasoning pattern should you apply first?",
    strategyOptions: [
      {
        id: "positive-deltas",
        label: "Add every positive adjacent gain",
        description: "Treat each rising edge as safe profit in an unlimited-transactions setting.",
        isCorrect: true,
      },
      {
        id: "single-best-window",
        label: "Find one widest profitable window",
        description: "Optimizes for a single transaction, which is the wrong objective here.",
      },
      {
        id: "sort-prices",
        label: "Sort prices before scanning",
        description: "Destroys chronology, so it invalidates the buy/sell sequence.",
      },
    ],
    hints: [
      {
        level: 1,
        title: "Direction Hint",
        body: "Look at each day and only compare it with the day immediately before it.",
      },
      {
        level: 2,
        title: "Logic Hint",
        body: "Whenever the price rises from one day to the next, that rise can be added directly to the final answer.",
      },
      {
        level: 3,
        title: "Reveal Hint",
        body: "The hidden solution is the sum of all positive adjacent deltas; once you unlock this hint, the trace opens for step-by-step reveal.",
      },
    ],
    solutionLabel: "Positive deltas ledger",
  },
  interview: {
    timeLimitSec: 480,
    hintBudget: 1,
    benchmarkMs: 180000,
    confidencePrompt:
      "How confident are you that your answer and reasoning would survive a whiteboard follow-up?",
  },
};

export const academyProblemCatalog: ProblemCatalogEntry[] = baseArrayStringCatalog.map(
  (problem) =>
    problem.problemId === stockIILessonDefinition.problemId
      ? stockIILessonDefinition
      : problem
);

export const academyProblemCatalogById = Object.fromEntries(
  academyProblemCatalog.map((problem) => [problem.problemId, problem])
);

export function getProblemCatalogEntry(problemId: string) {
  return academyProblemCatalogById[problemId] ?? null;
}
