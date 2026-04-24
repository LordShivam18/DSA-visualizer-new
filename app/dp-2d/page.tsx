import CategoryPage from "@/components/dp/shared/CategoryPage";
import { multidimensionalDpProblems } from "@/components/dp/shared/metadata";

export default function MultidimensionalDpPage() {
  return (
    <CategoryPage
      title="Multidimensional DP"
      eyebrow="Grid, lattice, substring, and state-machine dynamic programming"
      description="These visualizers spread DP across grids, windows, and layered state machines so you can watch information flow spatially instead of only along a line."
      problems={multidimensionalDpProblems}
    />
  );
}
