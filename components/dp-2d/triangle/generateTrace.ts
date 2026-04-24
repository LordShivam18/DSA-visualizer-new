import type {
  DpTraceStep,
  InputFieldConfig,
  PresetConfig,
  VisualMatrix,
  VisualTone,
} from "@/components/dp/shared/types";
import { formatInfinity, createTraceRecorder } from "@/components/dp/shared/trace";
import { parseNestedNumberList } from "@/components/dp/shared/parsers";

export const inputFields: InputFieldConfig[] = [
  {
    key: "triangle",
    label: "triangle",
    placeholder: "[[2],[3,4],[6,5,7],[4,1,8,3]]",
    help: "Triangle rows in JSON array form.",
    multiline: true,
    rows: 5,
  },
];

export const defaultInputs = {
  triangle: "[[2],[3,4],[6,5,7],[4,1,8,3]]",
};

export type TriangleInputs = typeof defaultInputs;

export const presets: PresetConfig<TriangleInputs>[] = [
  {
    name: "Example 1",
    summary: "=> 11",
    values: { triangle: "[[2],[3,4],[6,5,7],[4,1,8,3]]" },
  },
  {
    name: "Single row",
    summary: "=> -10",
    values: { triangle: "[[-10]]" },
  },
  {
    name: "Balanced",
    summary: "=> 14",
    values: { triangle: "[[1],[2,3],[3,6,7],[8,9,6,1]]" },
  },
];

export const code = [
  "function minimumTotal(triangle: number[][]): number {",
  "  const dp = triangle.map((row) => row.map(() => Infinity));",
  "  dp[0][0] = triangle[0][0];",
  "  for (let row = 1; row < triangle.length; row += 1) {",
  "    for (let col = 0; col < triangle[row].length; col += 1) {",
  "      const fromLeft = col > 0 ? dp[row - 1][col - 1] : Infinity;",
  "      const fromRight = col < row ? dp[row - 1][col] : Infinity;",
  "      dp[row][col] = triangle[row][col] + Math.min(fromLeft, fromRight);",
  "    }",
  "  }",
  "  return Math.min(...dp[triangle.length - 1]);",
  "}",
];

export const complexity = ["Time O(rows²)", "Space O(rows²)", "Pattern: Triangular path DP"];

export function generateTrace(inputs: TriangleInputs): DpTraceStep[] {
  const triangle = parseNestedNumberList(inputs.triangle);
  const rows = triangle.length;
  const dp = triangle.map((row) => row.map(() => Number.POSITIVE_INFINITY));
  const { trace, pushStep } = createTraceRecorder();
  let best = triangle[0]?.[0] ?? 0;

  if (rows === 0) {
    return [
      {
        step: 0,
        action: "The triangle is empty, so the minimum total is 0.",
        actionKind: "initialize",
        actionTone: "slate",
        codeLines: [1],
        beginnerNote: "An empty triangle has no path cost to accumulate.",
        expertNote: "The empty structure is the natural zero-size base case.",
        focus: "No DP cells need to be filled when there are no rows.",
        hints: ["The visualizer defaults empty structures to 0."],
        metrics: [{ label: "Rows", value: 0, tone: "slate" }],
        pointerChips: [],
        done: true,
        resultLabel: "minimumTotal",
        resultValue: "0",
        animation: { type: "highlight", targets: [], duration: 400 },
        highlights: {},
        state: {
          scene: "triangle",
          headline: "No lattice, no path",
          subheadline: "An empty triangle produces the neutral answer 0.",
          result: { label: "Minimum total", value: "0", tone: "emerald" },
        },
      },
    ];
  }

  dp[0][0] = triangle[0][0];

  function cellTone(
    row: number,
    col: number,
    currentRow: number | null,
    currentCol: number | null,
    leftParent: [number, number] | null,
    rightParent: [number, number] | null,
    values: number[][]
  ): VisualTone {
    if (currentRow === row && currentCol === col) {
      return "sky";
    }

    if (leftParent && leftParent[0] === row && leftParent[1] === col) {
      return "amber";
    }

    if (rightParent && rightParent[0] === row && rightParent[1] === col) {
      return "violet";
    }

    if (Number.isFinite(values[row][col])) {
      return "emerald";
    }

    return "slate";
  }

  function buildMatrix(
    values: number[][],
    title: string,
    currentRow: number | null,
    currentCol: number | null,
    leftParent: [number, number] | null,
    rightParent: [number, number] | null
  ): VisualMatrix {
    return {
      id: title.toLowerCase(),
      title,
      subtitle:
        title === "Triangle values"
          ? "The blue crystal is the active cell. Amber and violet crystals are the candidate parents above it."
          : "Each crystal stores the cheapest total that can reach that position from the top.",
      variant: "triangle",
      rows: values.map((rowValues, rowIndex) => ({
        id: `${title}-row-${rowIndex}`,
        cells: rowValues.map((value, colIndex) => ({
          id: `${title === "Triangle values" ? "tri" : "dp"}-${rowIndex}-${colIndex}`,
          value: Number.isFinite(value) ? value : "∞",
          tone: cellTone(
            rowIndex,
            colIndex,
            currentRow,
            currentCol,
            leftParent,
            rightParent,
            title === "Triangle values" ? triangle : dp
          ),
          tags:
            currentRow === rowIndex && currentCol === colIndex
              ? ["target"]
              : leftParent &&
                leftParent[0] === rowIndex &&
                leftParent[1] === colIndex
              ? ["left"]
              : rightParent &&
                rightParent[0] === rowIndex &&
                rightParent[1] === colIndex
              ? ["right"]
              : Number.isFinite(
                  title === "Triangle values" ? dp[rowIndex][colIndex] : value
                )
              ? ["known"]
              : [],
          variant: "square",
        })),
      })),
    };
  }

  function pushFrame(
    currentRow: number | null,
    currentCol: number | null,
    leftParent: [number, number] | null,
    rightParent: [number, number] | null,
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
        "Each triangle cell may arrive from one of the two adjacent cells above it.",
        "dp[row][col] is the cheapest path sum to reach exactly that cell.",
        "The final answer is the minimum value in the last DP row.",
      ],
      metrics: [
        { label: "Rows", value: rows, tone: "slate" },
        {
          label: "Active cost",
          value:
            currentRow !== null && currentCol !== null
              ? formatInfinity(dp[currentRow][currentCol])
              : String(best),
          tone: "sky",
        },
        { label: "Best bottom", value: best, tone: "emerald" },
      ],
      pointerChips: [
        { label: "row", value: currentRow === null ? "done" : String(currentRow), tone: "sky" },
        { label: "col", value: currentCol === null ? "-" : String(currentCol), tone: "sky" },
      ],
      done,
      resultLabel: "minimumTotal",
      resultValue: String(best),
      animation: {
        type: done ? "highlight" : "update",
        targets:
          currentRow === null || currentCol === null
            ? ["dp-result"]
            : [`tri-${currentRow}-${currentCol}`, `dp-${currentRow}-${currentCol}`],
        duration: 820,
      },
      highlights: {
        primaryIds:
          currentRow === null || currentCol === null
            ? ["dp-result"]
            : [`tri-${currentRow}-${currentCol}`, `dp-${currentRow}-${currentCol}`],
        secondaryIds: [
          ...(leftParent ? [`dp-${leftParent[0]}-${leftParent[1]}`] : []),
          ...(rightParent ? [`dp-${rightParent[0]}-${rightParent[1]}`] : []),
        ],
      },
      state: {
        scene: "triangle",
        headline: "Each crystal inherits the cheaper parent above it",
        subheadline:
          "The lattice grows downward while every cell chooses the lightest of its two incoming paths.",
        matrices: [
          buildMatrix(
            triangle,
            "Triangle values",
            currentRow,
            currentCol,
            leftParent,
            rightParent
          ),
          buildMatrix(
            dp,
            "Path-cost lattice",
            currentRow,
            currentCol,
            leftParent,
            rightParent
          ),
        ],
        callouts: [
          {
            id: "active",
            label: "Active cell",
            value:
              currentRow !== null && currentCol !== null
                ? `(${currentRow}, ${currentCol})`
                : "complete",
            tone: "sky",
          },
        ],
        result: {
          label: "Minimum top-to-bottom total",
          value: String(best),
          tone: done ? "emerald" : "sky",
        },
      },
    });
  }

  pushFrame(
    0,
    0,
    null,
    null,
    `Seed the triangle at the apex with value ${triangle[0][0]}.`,
    "initialize",
    "slate",
    [1, 2, 3],
    "The apex is the only cell reachable without choosing a parent.",
    "dp[0][0] becomes the anchor state for the whole lattice.",
    "Every later path descends from the apex."
  );

  for (let row = 1; row < rows; row += 1) {
    for (let col = 0; col < triangle[row].length; col += 1) {
      const leftParent =
        col > 0 ? ([row - 1, col - 1] as [number, number]) : null;
      const rightParent =
        col < triangle[row - 1].length ? ([row - 1, col] as [number, number]) : null;
      const fromLeft = leftParent ? dp[leftParent[0]][leftParent[1]] : Number.POSITIVE_INFINITY;
      const fromRight = rightParent ? dp[rightParent[0]][rightParent[1]] : Number.POSITIVE_INFINITY;

      pushFrame(
        row,
        col,
        leftParent,
        rightParent,
        `Compare the two parent paths above cell (${row}, ${col}).`,
        "inspect",
        "amber",
        [4, 5, 6, 7],
        "This cell checks the two adjacent parent totals from the row above.",
        "Triangle DP only needs adjacent parents because those are the only valid moves from the previous row.",
        "The cell can only inherit from the left-above or right-above parent."
      );

      dp[row][col] = triangle[row][col] + Math.min(fromLeft, fromRight);

      pushFrame(
        row,
        col,
        leftParent,
        rightParent,
        `Write dp[${row}][${col}] = ${triangle[row][col]} + min(${formatInfinity(
          fromLeft
        )}, ${formatInfinity(fromRight)}) = ${dp[row][col]}.`,
        "update",
        "sky",
        [7, 8],
        "The triangle value adds onto the cheaper of the two incoming path totals.",
        "Optimal substructure holds because the cheapest path to this cell must extend the cheapest path to one of its legal parents.",
        "Once this total is written, lower rows can safely reuse it."
      );
    }
  }

  best = Math.min(...dp[rows - 1]);

  pushFrame(
    null,
    null,
    null,
    null,
    `Scan the bottom row. The cheapest completed path total is ${best}.`,
    "complete",
    "emerald",
    [10, 11],
    "The answer is the smallest number in the last DP row.",
    "Every top-to-bottom route ends in the bottom row, so taking the minimum there completes the proof.",
    "The bottom row contains all fully realized path totals.",
    true
  );

  return trace;
}
