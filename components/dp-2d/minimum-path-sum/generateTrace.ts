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
    key: "grid",
    label: "grid",
    placeholder: "[[1,3,1],[1,5,1],[4,2,1]]",
    help: "Grid of non-negative path costs.",
    multiline: true,
    rows: 5,
  },
];

export const defaultInputs = {
  grid: "[[1,3,1],[1,5,1],[4,2,1]]",
};

export type MinimumPathInputs = typeof defaultInputs;

export const presets: PresetConfig<MinimumPathInputs>[] = [
  {
    name: "Example 1",
    summary: "=> 7",
    values: { grid: "[[1,3,1],[1,5,1],[4,2,1]]" },
  },
  {
    name: "Small",
    summary: "=> 12",
    values: { grid: "[[1,2,3],[4,5,6]]" },
  },
  {
    name: "Single cell",
    summary: "=> 5",
    values: { grid: "[[5]]" },
  },
];

export const code = [
  "function minPathSum(grid: number[][]): number {",
  "  const rows = grid.length;",
  "  const cols = grid[0].length;",
  "  const dp = Array.from({ length: rows }, () => Array(cols).fill(Infinity));",
  "  dp[0][0] = grid[0][0];",
  "  for (let row = 0; row < rows; row += 1) {",
  "    for (let col = 0; col < cols; col += 1) {",
  "      if (row === 0 && col === 0) continue;",
  "      const fromTop = row > 0 ? dp[row - 1][col] : Infinity;",
  "      const fromLeft = col > 0 ? dp[row][col - 1] : Infinity;",
  "      dp[row][col] = grid[row][col] + Math.min(fromTop, fromLeft);",
  "    }",
  "  }",
  "  return dp[rows - 1][cols - 1];",
  "}",
];

export const complexity = ["Time O(m*n)", "Space O(m*n)", "Pattern: Grid path minimization"];

export function generateTrace(inputs: MinimumPathInputs): DpTraceStep[] {
  const grid = parseNestedNumberList(inputs.grid).filter((row) => row.length > 0);
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const dp = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Number.POSITIVE_INFINITY)
  );
  const { trace, pushStep } = createTraceRecorder();

  if (rows === 0 || cols === 0) {
    return [
      {
        step: 0,
        action: "The grid is empty, so the minimum path sum is 0.",
        actionKind: "initialize",
        actionTone: "slate",
        codeLines: [1],
        beginnerNote: "There are no cells to traverse in an empty grid.",
        expertNote: "An empty matrix is treated as the neutral zero case here.",
        focus: "The visualizer exits early when the grid has no dimensions.",
        hints: ["Provide at least one row to see the DP path atlas animate."],
        metrics: [{ label: "Rows", value: 0, tone: "slate" }],
        pointerChips: [],
        done: true,
        resultLabel: "minPathSum",
        resultValue: "0",
        animation: { type: "highlight", targets: [], duration: 400 },
        highlights: {},
        state: {
          scene: "grid",
          headline: "Empty atlas",
          subheadline: "No path exists because no cells were provided.",
          result: { label: "Minimum path sum", value: "0", tone: "emerald" },
        },
      },
    ];
  }

  dp[0][0] = grid[0][0];

  function cellTone(
    row: number,
    col: number,
    current: [number, number] | null,
    top: [number, number] | null,
    left: [number, number] | null,
    source: number[][]
  ): VisualTone {
    if (current && current[0] === row && current[1] === col) {
      return "sky";
    }

    if (top && top[0] === row && top[1] === col) {
      return "violet";
    }

    if (left && left[0] === row && left[1] === col) {
      return "amber";
    }

    if (Number.isFinite(source[row][col])) {
      return "emerald";
    }

    return "slate";
  }

  function buildMatrix(
    values: number[][],
    title: string,
    current: [number, number] | null,
    top: [number, number] | null,
    left: [number, number] | null
  ): VisualMatrix {
    return {
      id: title.toLowerCase(),
      title,
      subtitle:
        title === "Grid values"
          ? "Blue is the active cell. Violet and amber are the only legal incoming neighbors."
          : "Each DP cell stores the cheapest path total reaching that coordinate.",
      variant: "grid",
      rows: values.map((rowValues, rowIndex) => ({
        id: `${title}-row-${rowIndex}`,
        label: String(rowIndex),
        cells: rowValues.map((value, colIndex) => ({
          id: `${title === "Grid values" ? "grid" : "dp"}-${rowIndex}-${colIndex}`,
          value: Number.isFinite(value) ? value : "∞",
          tone: cellTone(
            rowIndex,
            colIndex,
            current,
            top,
            left,
            title === "Grid values" ? grid : dp
          ),
          tags:
            current && current[0] === rowIndex && current[1] === colIndex
              ? ["target"]
              : top && top[0] === rowIndex && top[1] === colIndex
              ? ["top"]
              : left && left[0] === rowIndex && left[1] === colIndex
              ? ["left"]
              : Number.isFinite(title === "Grid values" ? dp[rowIndex][colIndex] : value)
              ? ["known"]
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
    action: string,
    actionKind: DpTraceStep["actionKind"],
    actionTone: DpTraceStep["actionTone"],
    codeLines: number[],
    beginnerNote: string,
    expertNote: string,
    focus: string,
    done = false
  ) {
    const resultValue = String(dp[rows - 1][cols - 1]);

    pushStep({
      action,
      actionKind,
      actionTone,
      codeLines,
      beginnerNote,
      expertNote,
      focus,
      hints: [
        "Only moves from above or left are legal in this grid.",
        "dp[row][col] is the cheapest total cost to enter that cell.",
        "The bottom-right DP cell is the full-path answer.",
      ],
      metrics: [
        { label: "Rows", value: rows, tone: "slate" },
        { label: "Cols", value: cols, tone: "slate" },
        {
          label: "Current total",
          value:
            current !== null
              ? formatInfinity(dp[current[0]][current[1]])
              : formatInfinity(dp[rows - 1][cols - 1]),
          tone: "sky",
        },
      ],
      pointerChips: [
        { label: "row", value: current === null ? "done" : String(current[0]), tone: "sky" },
        { label: "col", value: current === null ? "-" : String(current[1]), tone: "sky" },
      ],
      done,
      resultLabel: "minPathSum",
      resultValue,
      animation: {
        type: done ? "highlight" : "update",
        targets:
          current === null
            ? ["dp-result"]
            : [`grid-${current[0]}-${current[1]}`, `dp-${current[0]}-${current[1]}`],
        duration: 820,
      },
      highlights: {
        primaryIds:
          current === null
            ? ["dp-result"]
            : [`grid-${current[0]}-${current[1]}`, `dp-${current[0]}-${current[1]}`],
        secondaryIds: [
          ...(top ? [`dp-${top[0]}-${top[1]}`] : []),
          ...(left ? [`dp-${left[0]}-${left[1]}`] : []),
        ],
      },
      state: {
        scene: "grid",
        headline: "Each grid cell chooses the cheaper incoming route",
        subheadline:
          "The atlas grows left-to-right and top-to-bottom, turning local minimum decisions into a global minimum path.",
        matrices: [
          buildMatrix(grid, "Grid values", current, top, left),
          buildMatrix(dp, "Path-cost atlas", current, top, left),
        ],
        result: {
          label: "Minimum path sum",
          value: resultValue,
          tone: done ? "emerald" : "sky",
        },
      },
    });
  }

  pushFrame(
    [0, 0],
    null,
    null,
    `Seed the atlas at the origin with cost ${grid[0][0]}.`,
    "initialize",
    "slate",
    [1, 2, 3, 4, 5],
    "The top-left cell is the starting point, so its path cost is just its own value.",
    "The DP grid needs one anchored origin before other cells can inherit from it.",
    "Every legal route begins at the top-left corner."
  );

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (row === 0 && col === 0) {
        continue;
      }

      const top = row > 0 ? ([row - 1, col] as [number, number]) : null;
      const left = col > 0 ? ([row, col - 1] as [number, number]) : null;
      const fromTop = top ? dp[top[0]][top[1]] : Number.POSITIVE_INFINITY;
      const fromLeft = left ? dp[left[0]][left[1]] : Number.POSITIVE_INFINITY;

      pushFrame(
        [row, col],
        top,
        left,
        `Inspect cell (${row}, ${col}) and compare the incoming totals from above and left.`,
        "inspect",
        "amber",
        [6, 7, 8, 9, 10],
        "The cell asks which legal incoming route is cheaper.",
        "Grid DP works because every shortest path to this cell must finish from either the top neighbor or the left neighbor.",
        "Only two routes are relevant for the transition."
      );

      dp[row][col] = grid[row][col] + Math.min(fromTop, fromLeft);

      pushFrame(
        [row, col],
        top,
        left,
        `Write dp[${row}][${col}] = ${grid[row][col]} + min(${formatInfinity(
          fromTop
        )}, ${formatInfinity(fromLeft)}) = ${dp[row][col]}.`,
        "update",
        "sky",
        [9, 10, 11],
        "The cell absorbs its own cost on top of the cheaper incoming path total.",
        "Optimal substructure holds because the tail of an optimal route into this cell must itself be optimal.",
        "After this write, later cells can safely build on the new minimum."
      );
    }
  }

  pushFrame(
    null,
    null,
    null,
    `The bottom-right atlas entry settles at ${dp[rows - 1][cols - 1]}.`,
    "complete",
    "emerald",
    [13, 14],
    "The final answer lives in the bottom-right DP cell.",
    "Since every route must end there, its stabilized cost is the global minimum path sum.",
    "The atlas is complete once the destination cell is filled.",
    true
  );

  return trace;
}
