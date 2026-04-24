export type MatrixProblemMeta = {
  slug: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  taxonomy: string;
};

export const matrixProblems: MatrixProblemMeta[] = [
  {
    slug: "valid-sudoku",
    title: "Valid Sudoku",
    difficulty: "Medium",
    description:
      "Validate every filled digit against its row, column, and 3 x 3 box while the board highlights the exact constraint being checked.",
    taxonomy: "Constraint tracking / row sets / column sets / box sets",
  },
  {
    slug: "spiral-matrix",
    title: "Spiral Matrix",
    difficulty: "Medium",
    description:
      "Peel the matrix one perimeter at a time and watch the boundaries tighten after each directional sweep.",
    taxonomy: "Simulation / boundary contraction / ordered traversal",
  },
  {
    slug: "rotate-image",
    title: "Rotate Image",
    difficulty: "Medium",
    description:
      "Rotate the square matrix in place by transposing first and then reversing each row with visible swap pairs.",
    taxonomy: "In-place matrix transform / transpose / row reversal",
  },
  {
    slug: "set-matrix-zeroes",
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    description:
      "Use the first row and first column as in-place markers, then replay how each marked lane collapses to zero.",
    taxonomy: "In-place markers / first row and column bookkeeping",
  },
  {
    slug: "game-of-life",
    title: "Game of Life",
    difficulty: "Medium",
    description:
      "Count live neighbors, mark transitional cells, and finalize the next generation without allocating a second board.",
    taxonomy: "Cellular automaton / neighbor counting / in-place encoding",
  },
];
