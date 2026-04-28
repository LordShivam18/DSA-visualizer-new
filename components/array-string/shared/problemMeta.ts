import {
  formatRegistryDifficulty,
  getProblemsByCategory,
} from "@/lib/academy/problemRegistry";

export type ArrayStringProblemMeta = {
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  taxonomy: string;
};

export const arrayStringProblems: ArrayStringProblemMeta[] =
  getProblemsByCategory("array-string").map((problem) => ({
    slug: problem.slug,
    title: problem.title,
    difficulty: formatRegistryDifficulty(problem.difficulty),
    description: problem.description,
    taxonomy: problem.taxonomy,
  }));
