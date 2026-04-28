import {
  formatRegistryDifficulty,
  getProblemsByCategory,
} from "@/lib/academy/problemRegistry";

import type { DpProblemMeta } from "./types";

function toDpProblemMeta(categoryId: string): DpProblemMeta[] {
  return getProblemsByCategory(categoryId).map((problem) => ({
    slug: problem.slug,
    title: problem.title,
    difficulty: formatRegistryDifficulty(problem.difficulty),
    description: problem.description,
    taxonomy: problem.taxonomy,
    route: problem.path,
  }));
}

export const oneDimensionalDpProblems: DpProblemMeta[] =
  toDpProblemMeta("dp-1d");

export const multidimensionalDpProblems: DpProblemMeta[] =
  toDpProblemMeta("dp-2d");
