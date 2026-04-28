import { getProblemById, type Problem } from "./problemRegistry";

export type LessonEntryExperience = "default" | "guided" | "demo";

type CuratedLearningPathStep = {
  problemId: string;
  onboardingReason?: string;
  pathSummary: string;
  completionInsight: string;
};

type CuratedLearningPathDefinition = {
  id: string;
  title: string;
  summary: string;
  steps: CuratedLearningPathStep[];
};

const curatedLearningPaths: CuratedLearningPathDefinition[] = [
  {
    id: "array-compaction",
    title: "Array compaction warm-up",
    summary:
      "Start with one visible keep-or-skip pass, then reuse the same write-pointer idea on sorted arrays.",
    steps: [
      {
        problemId: "array-string:remove-element",
        onboardingReason:
          "It is easy, highly visual, and turns the first prediction into a simple keep-or-skip decision with read and write pointers.",
        pathSummary:
          "Start here: one pointer reads every value and one pointer builds the kept prefix in place.",
        completionInsight:
          "You learned how a write pointer builds a clean answer prefix in place.",
      },
      {
        problemId: "array-string:remove-duplicates-from-sorted-array",
        pathSummary:
          "Next: the same compacted-prefix pattern, but sorted order decides whether the current value is new.",
        completionInsight:
          "You learned how sorted order lets one comparison protect a unique prefix.",
      },
      {
        problemId: "array-string:remove-duplicates-from-sorted-array-ii",
        pathSummary:
          "Stretch: keep the same prefix-building idea, but allow each value to appear twice before you skip it.",
        completionInsight:
          "You learned how a small lookback rule can extend the same compaction pattern.",
      },
    ],
  },
];

function requireProblem(problemId: string) {
  const problem = getProblemById(problemId);

  if (!problem) {
    throw new Error(`Unknown academy problem: ${problemId}`);
  }

  return problem;
}

export function resolveLessonEntryExperience(
  value: string | null | undefined
): LessonEntryExperience {
  if (value === "guided" || value === "demo") {
    return value;
  }

  return "default";
}

export function buildLessonEntryHref(
  problem: Problem,
  experience: LessonEntryExperience = "default"
) {
  const params = new URLSearchParams();

  if (experience !== "default") {
    params.set("entry", experience);
  }

  const query = params.toString();
  return query ? `${problem.path}?${query}` : problem.path;
}

export function getCuratedLearningPathForProblem(problemId: string) {
  const path = curatedLearningPaths.find((candidate) =>
    candidate.steps.some((step) => step.problemId === problemId)
  );

  if (!path) {
    return null;
  }

  const currentIndex = path.steps.findIndex((step) => step.problemId === problemId);

  return {
    ...path,
    currentIndex,
  };
}

export function getCuratedCompletionInsight(problemId: string) {
  const path = getCuratedLearningPathForProblem(problemId);

  if (!path) {
    return null;
  }

  return path.steps[path.currentIndex]?.completionInsight ?? null;
}

export function getLandingStarterProblem() {
  return requireProblem(curatedLearningPaths[0].steps[0].problemId);
}

export function getLandingStarterReason() {
  return curatedLearningPaths[0].steps[0].onboardingReason ?? "";
}

export function getLandingStarterHref(
  experience: LessonEntryExperience = "guided"
) {
  return buildLessonEntryHref(getLandingStarterProblem(), experience);
}
