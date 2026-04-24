import type {
  DpTraceStep,
  InputFieldConfig,
  PresetConfig,
  VisualMatrix,
  VisualTone,
} from "@/components/dp/shared/types";
import { createTraceRecorder } from "@/components/dp/shared/trace";
import { parseBinaryMatrix } from "@/components/dp/shared/parsers";

export const inputFields: InputFieldConfig[] = [
  {
    key: "matrix",
    label: "matrix",
    placeholder: "[[1,0,1,0,0],[1,0,1,1,1],[1,1,1,1,1],[1,0,0,1,0]]",
    help: "Binary matrix with 0 and 1 cells.",
    multiline: true,
    rows: 5,
  },
];

export const defaultInputs = {
  matrix: "[[1,0,1,0,0],[1,0,1,1,1],[1,1,1,1,1],[1,0,0,1,0]]",
};

export type MaximalSquareInputs = typeof defaultInputs;

export const presets: PresetConfig<MaximalSquareInputs>[] = [
  {
    name: "Example 1",
    summary: "=> 4",
    values: { matrix: "[[1,0,1,0,0],[1,0,1,1,1],[1,1,1,1,1],[1,0,0,1,0]]" },
  },
  {
    name: "Example 2",
    summary: "=> 1",
    values: { matrix: "[[0,1],[1,0]]" },
  },
  {
    name: "Solid block",
    summary: "=> 9",
    values: { matrix: "[[1,1,1],[1,1,1],[1,1,1]]" },
  },
];

export const code = [
  "function maximalSquare(matrix: number[][]): number {",
  "  const rows = matrix.length;",
  "  const cols = matrix[0].length;",
  "  const dp = Array.from({ length: rows }, () => Array(cols).fill(0));",
  "  let best = 0;",
  "  for (let row = 0; row < rows; row += 1) {",
  "    for (let col = 0; col < cols; col += 1) {",
  "      if (matrix[row][col] === 0) continue;",
  "      if (row === 0 || col === 0) {",
  "        dp[row][col] = 1;",
  "      } else {",
  "        dp[row][col] = 1 + Math.min(dp[row - 1][col], dp[row][col - 1], dp[row - 1][col - 1]);",
  "      }",
  "      best = Math.max(best, dp[row][col]);",
  "    }",
  "  }",
  "  return best * best;",
  "}",
];

export const complexity = ["Time O(m*n)", "Space O(m*n)", "Pattern: Square-growth DP"];

export function generateTrace(inputs: MaximalSquareInputs): DpTraceStep[] {
  const matrix = parseBinaryMatrix(inputs.matrix).filter((row) => row.length > 0);
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const dp = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
  const { trace, pushStep } = createTraceRecorder();
  let bestSide = 0;

  function cellTone(
    row: number,
    col: number,
    current: [number, number] | null,
    top: [number, number] | null,
    left: [number, number] | null,
    diag: [number, number] | null,
    obstacle: boolean,
    source: number[][]
  ): VisualTone {
    if (obstacle) {
      return "rose";
    }

    if (current && current[0] === row && current[1] === col) {
      return "sky";
    }

    if (top && top[0] === row && top[1] === col) {
      return "violet";
    }

    if (left && left[0] === row && left[1] === col) {
      return "amber";
    }

    if (diag && diag[0] === row && diag[1] === col) {
      return "emerald";
    }

    if (source[row][col] > 0) {
      return "emerald";
    }

    return "slate";
  }

  function buildMatrix(
    title: string,
    current: [number, number] | null,
    top: [number, number] | null,
    left: [number, number] | null,
    diag: [number, number] | null
  ): VisualMatrix {
    const source = title === "Binary matrix" ? matrix : dp;

    return {
      id: title.toLowerCase(),
      title,
      subtitle:
        title === "Binary matrix"
          ? "Red zeros break any square instantly."
          : "Each DP cell stores the side length of the largest all-ones square ending there.",
      variant: "square",
      rows: source.map((rowValues, rowIndex) => ({
        id: `${title}-row-${rowIndex}`,
        label: String(rowIndex),
        cells: rowValues.map((value, colIndex) => ({
          id: `${title === "Binary matrix" ? "grid" : "dp"}-${rowIndex}-${colIndex}`,
          value,
          tone: cellTone(
            rowIndex,
            colIndex,
            current,
            top,
            left,
            diag,
            matrix[rowIndex][colIndex] === 0,
            title === "Binary matrix" ? dp : dp
          ),
          tags:
            matrix[rowIndex][colIndex] === 0
              ? ["zero"]
              : current && current[0] === rowIndex && current[1] === colIndex
              ? ["target"]
              : [],
          variant: "square",
        })),
      })),
    };
  }

  function pushFrame(
    current: [number, number] | null,
    top: [number, number] | null,
    left: [number, number] | null,
    diag: [number, number] | null,
    action: string,
    actionKind: DpTraceStep["actionKind"],
    actionTone: DpTraceStep["actionTone"],
    codeLines: number[],
    beginnerNote: string,
    expertNote: string,
    focus: string,
    done = false
  ) {
    pushStep({
      action,
      actionKind,
      actionTone,
      codeLines,
      beginnerNote,
      expertNote,
      focus,
      hints: [
        "A zero cell cannot end any all-ones square.",
        "A one cell can extend a square only as far as its top, left, and top-left neighbors all allow.",
        "The final area is bestSide multiplied by itself.",
      ],
      metrics: [
        { label: "Rows", value: rows, tone: "slate" },
        { label: "Cols", value: cols, tone: "slate" },
        { label: "Best side", value: bestSide, tone: "emerald" },
      ],
      pointerChips: [
        { label: "row", value: current === null ? "done" : String(current[0]), tone: "sky" },
        { label: "col", value: current === null ? "-" : String(current[1]), tone: "sky" },
      ],
      done,
      resultLabel: "maxSquareArea",
      resultValue: String(bestSide * bestSide),
      animation: {
        type: done ? "highlight" : "update",
        targets:
          current === null
            ? ["result"]
            : [`grid-${current[0]}-${current[1]}`, `dp-${current[0]}-${current[1]}`],
        duration: 820,
      },
      highlights: {
        primaryIds:
          current === null
            ? ["result"]
            : [`grid-${current[0]}-${current[1]}`, `dp-${current[0]}-${current[1]}`],
      },
      state: {
        scene: "square",
        headline: "Squares expand only when three neighboring edges agree",
        subheadline:
          "The radar checks whether the top, left, and diagonal neighbors can all support a larger all-ones square ending at the current cell.",
        matrices: [
          buildMatrix("Binary matrix", current, top, left, diag),
          buildMatrix("Square-size radar", current, top, left, diag),
        ],
        result: {
          label: "Largest square area",
          value: String(bestSide * bestSide),
          tone: done ? "emerald" : "sky",
        },
      },
    });
  }

  pushFrame(
    null,
    null,
    null,
    null,
    "Initialize the radar with zero side lengths everywhere and begin scanning the matrix.",
    "initialize",
    "slate",
    [1, 2, 3, 4, 5],
    "The DP radar starts empty and grows side lengths only at cells containing 1.",
    "The best square is discovered incrementally while scanning row by row.",
    "Every square must end at a concrete matrix cell, so the scan considers each endpoint exactly once."
  );

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const current: [number, number] = [row, col];
      const top = row > 0 ? ([row - 1, col] as [number, number]) : null;
      const left = col > 0 ? ([row, col - 1] as [number, number]) : null;
      const diag = row > 0 && col > 0 ? ([row - 1, col - 1] as [number, number]) : null;

      pushFrame(
        current,
        top,
        left,
        diag,
        `Inspect cell (${row}, ${col}).`,
        "inspect",
        matrix[row][col] === 1 ? "amber" : "rose",
        [6, 7, 8, 9, 10, 11, 12],
        "The radar first checks whether the cell is a 1 and therefore capable of ending a square.",
        "Only 1-cells can contribute to square growth; zeros terminate the recurrence immediately.",
        "The current cell is deciding whether it can host a square endpoint."
      );

      if (matrix[row][col] === 1) {
        if (row === 0 || col === 0) {
          dp[row][col] = 1;
        } else {
          dp[row][col] =
            1 + Math.min(dp[row - 1][col], dp[row][col - 1], dp[row - 1][col - 1]);
        }

        bestSide = Math.max(bestSide, dp[row][col]);

        pushFrame(
          current,
          top,
          left,
          diag,
          `Set dp[${row}][${col}] = ${dp[row][col]} and bestSide = ${bestSide}.`,
          "update",
          "sky",
          [9, 10, 11, 12, 13],
          "A 1-cell can grow a square whose side is one more than the smallest supporting neighbor side.",
          "The minimum of top, left, and diagonal controls square growth because every larger square needs all three edges to exist.",
          "This DP cell measures the largest square that ends exactly here."
        );
      }
    }
  }

  pushFrame(
    null,
    null,
    null,
    null,
    `The radar's largest side length is ${bestSide}, so the maximum square area is ${bestSide * bestSide}.`,
    "complete",
    "emerald",
    [15, 16],
    "The final answer is the area of the largest side length found during the scan.",
    "Tracking the maximum side during the DP fill avoids an extra pass over the matrix.",
    "The scan completes once every possible square endpoint has been evaluated.",
    true
  );

  return trace;
}
