import {
  formatRegistryDifficulty,
  getProblemsByCategory,
} from "@/lib/academy/problemRegistry";

export type MatrixProblemMeta = {
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  taxonomy: string;
};

export const matrixProblems: MatrixProblemMeta[] = getProblemsByCategory(
  "matrix"
).map((problem) => ({
  slug: problem.slug,
  title: problem.title,
  difficulty: formatRegistryDifficulty(problem.difficulty),
  description: problem.description,
  taxonomy: problem.taxonomy,
}));
