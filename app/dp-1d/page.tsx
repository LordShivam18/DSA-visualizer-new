import CategoryPage from "@/components/dp/shared/CategoryPage";
import { oneDimensionalDpProblems } from "@/components/dp/shared/metadata";

export default function OneDimensionalDpPage() {
  return (
    <CategoryPage
      title="1D DP"
      eyebrow="One-dimensional dynamic programming"
      description="These visualizers focus on linear state progression: every new state leans on a compact slice of earlier answers, but each problem gets its own cinematic metaphor and timeline."
      problems={oneDimensionalDpProblems}
    />
  );
}
