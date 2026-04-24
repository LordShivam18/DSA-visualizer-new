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
    key: "obstacleGrid",
    label: "obstacleGrid",
    placeholder: "[[0,0,0],[0,1,0],[0,0,0]]",
    help: "0 means open cell, 1 means obstacle.",
    multiline: true,
    rows: 5,
  },
];

export const defaultInputs = {
  obstacleGrid: "[[0,0,0],[0,1,0],[0,0,0]]",
};

export type UniquePathsInputs = typeof defaultInputs;

export const presets: PresetConfig<UniquePathsInputs>[] = [
  {
    name: "Example 1",
    summary: "=> 2",
    values: { obstacleGrid: "[[0,0,0],[0,1,0],[0,0,0]]" },
  },
  {
    name: "Blocked start",
    summary: "=> 0",
    values: { obstacleGrid: "[[1,0],[0,0]]" },
  },
  {
    name: "Single lane",
    summary: "=> 1",
    values: { obstacleGrid: "[[0,0,0,0]]" },
  },
];

export const code = [
  "function uniquePathsWithObstacles(grid: number[][]): number {",
  "  const rows = grid.length;",
  "  const cols = grid[0].length;",
  "  const dp = Array.from({ length: rows }, () => Array(cols).fill(0));",
  "  if (grid[0][0] === 1) return 0;",
  "  dp[0][0] = 1;",
  "  for (let row = 0; row < rows; row += 1) {",
  "    for (let col = 0; col < cols; col += 1) {",
  "      if (grid[row][col] === 1) {",
  "        dp[row][col] = 0;",
  "        continue;",
  "      }",
  "      if (row === 0 && col === 0) continue;",
  "      const fromTop = row > 0 ? dp[row - 1][col] : 0;",
  "      const fromLeft = col > 0 ? dp[row][col - 1] : 0;",
  "      dp[row][col] = fromTop + fromLeft;",
  "    }",
  "  }",
  "  return dp[rows - 1][cols - 1];",
  "}",
];

export const complexity = ["Time O(m*n)", "Space O(m*n)", "Pattern: Obstacle-aware path counting"];

export function generateTrace(inputs: UniquePathsInputs): DpTraceStep[] {
  const obstacleGrid = parseBinaryMatrix(inputs.obstacleGrid).filter((row) => row.length > 0);
  const rows = obstacleGrid.length;
  const cols = obstacleGrid[0]?.length ?? 0;
  const dp = Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
  const { trace, pushStep } = createTraceRecorder();

  if (rows === 0 || cols === 0) {
    return [
      {
        step: 0,
        action: "The grid is empty, so there are 0 unique paths.",
        actionKind: "initialize",
        actionTone: "slate",
        codeLines: [1],
        beginnerNote: "No board means no route to count.",
        expertNote: "The empty matrix is handled as a zero-path edge case.",
        focus: "The path counter exits before building a DP grid.",
        hints: ["Provide at least one row and one column to animate the robot."],
        metrics: [{ label: "Rows", value: 0, tone: "slate" }],
        pointerChips: [],
        done: true,
        resultLabel: "uniquePaths",
        resultValue: "0",
        animation: { type: "highlight", targets: [], duration: 400 },
        highlights: {},
        state: {
          scene: "pathfinder",
          headline: "Empty board",
          subheadline: "The robot has nowhere to travel.",
          result: { label: "Unique paths", value: "0", tone: "rose" },
        },
      },
    ];
  }

  if (obstacleGrid[0][0] === 1) {
    return [
      {
        step: 0,
        action: "The start cell is blocked, so the robot cannot begin any path.",
        actionKind: "blocked",
        actionTone: "rose",
        codeLines: [4, 5],
        beginnerNote: "A blocked start means zero paths immediately.",
        expertNote: "The start obstacle short-circuits the whole DP because every path must originate there.",
        focus: "No reachable state can exist if the origin is forbidden.",
        hints: [
          "Obstacles force DP cells to zero.",
          "If the origin is zeroed, the entire grid stays unreachable.",
        ],
        metrics: [{ label: "Rows", value: rows, tone: "slate" }],
        pointerChips: [],
        done: true,
        resultLabel: "uniquePaths",
        resultValue: "0",
        animation: { type: "highlight", targets: ["grid-0-0"], duration: 500 },
        highlights: { primaryIds: ["grid-0-0"] },
        state: {
          scene: "pathfinder",
          headline: "The obstacle field blocks the launch pad",
          subheadline: "Because the robot starts on an obstacle, no path can ever be formed.",
          matrices: [
            {
              id: "obstacles",
              title: "Obstacle grid",
              subtitle: "1 means blocked.",
              variant: "grid",
              rows: obstacleGrid.map((row, rowIndex) => ({
                id: `row-${rowIndex}`,
                label: String(rowIndex),
                cells: row.map((value, colIndex) => ({
                  id: `grid-${rowIndex}-${colIndex}`,
                  value,
                  tone: value === 1 ? "rose" : "slate",
                  tags: value === 1 ? ["rock"] : [],
                  variant: "square",
                })),
              })),
            },
          ],
          result: { label: "Unique paths", value: "0", tone: "rose" },
        },
      },
    ];
  }

  dp[0][0] = 1;

  function cellTone(
    row: number,
    col: number,
    current: [number, number] | null,
    top: [number, number] | null,
    left: [number, number] | null,
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

    if (source[row][col] > 0) {
      return "emerald";
    }

    return "slate";
  }

  function buildMatrix(
    title: string,
    current: [number, number] | null,
    top: [number, number] | null,
    left: [number, number] | null
  ): VisualMatrix {
    const source = title === "Obstacle grid" ? obstacleGrid : dp;

    return {
      id: title.toLowerCase(),
      title,
      subtitle:
        title === "Obstacle grid"
          ? "Red cells are blocked. The robot can only pass through open cells."
          : "Each DP cell counts how many ways the robot can arrive there.",
      variant: "grid",
      rows: source.map((rowValues, rowIndex) => ({
        id: `${title}-row-${rowIndex}`,
        label: String(rowIndex),
        cells: rowValues.map((value, colIndex) => ({
          id: `${title === "Obstacle grid" ? "grid" : "dp"}-${rowIndex}-${colIndex}`,
          value,
          tone: cellTone(
            rowIndex,
            colIndex,
            current,
            top,
            left,
            obstacleGrid[rowIndex][colIndex] === 1,
            title === "Obstacle grid" ? dp : dp
          ),
          tags:
            obstacleGrid[rowIndex][colIndex] === 1
              ? ["rock"]
              : current && current[0] === rowIndex && current[1] === colIndex
              ? ["target"]
              : top && top[0] === rowIndex && top[1] === colIndex
              ? ["top"]
              : left && left[0] === rowIndex && left[1] === colIndex
              ? ["left"]
              : value > 0 && title !== "Obstacle grid"
              ? ["reachable"]
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
    pushStep({
      action,
      actionKind,
      actionTone,
      codeLines,
      beginnerNote,
      expertNote,
      focus,
      hints: [
        "Obstacles always force their DP cell to 0.",
        "Open cells collect path counts from the top and left neighbors.",
        "The destination cell is the total number of valid unique paths.",
      ],
      metrics: [
        { label: "Rows", value: rows, tone: "slate" },
        { label: "Cols", value: cols, tone: "slate" },
        {
          label: "Destination paths",
          value: dp[rows - 1][cols - 1],
          tone: dp[rows - 1][cols - 1] > 0 ? "emerald" : "rose",
        },
      ],
      pointerChips: [
        { label: "row", value: current === null ? "done" : String(current[0]), tone: "sky" },
        { label: "col", value: current === null ? "-" : String(current[1]), tone: "sky" },
      ],
      done,
      resultLabel: "uniquePaths",
      resultValue: String(dp[rows - 1][cols - 1]),
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
        scene: "pathfinder",
        headline: "Path counts flow around obstacles like water around stones",
        subheadline:
          "Open cells add counts from above and left, while obstacles instantly collapse their path count to zero.",
        matrices: [
          buildMatrix("Obstacle grid", current, top, left),
          buildMatrix("Reachability grid", current, top, left),
        ],
        result: {
          label: "Unique paths to destination",
          value: String(dp[rows - 1][cols - 1]),
          tone: done ? (dp[rows - 1][cols - 1] > 0 ? "emerald" : "rose") : "sky",
        },
      },
    });
  }

  pushFrame(
    [0, 0],
    null,
    null,
    "Seed the robot at the start cell with one valid path.",
    "initialize",
    "slate",
    [1, 2, 3, 5, 6],
    "The robot begins at the origin, so there is exactly one way to be there.",
    "The start cell is the only source of path counts in the grid.",
    "Every future path count ultimately descends from this single seeded path."
  );

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (row === 0 && col === 0) {
        continue;
      }

      const current: [number, number] = [row, col];
      const top = row > 0 ? ([row - 1, col] as [number, number]) : null;
      const left = col > 0 ? ([row, col - 1] as [number, number]) : null;

      if (obstacleGrid[row][col] === 1) {
        dp[row][col] = 0;

        pushFrame(
          current,
          top,
          left,
          `Cell (${row}, ${col}) is an obstacle, so its path count is forced to 0.`,
          "blocked",
          "rose",
          [7, 8, 9, 10],
          "Obstacles cannot be entered, so no path may end there.",
          "A blocked cell annihilates its DP state regardless of its neighbors.",
          "The robot treats this cell as a hard wall."
        );

        continue;
      }

      pushFrame(
        current,
        top,
        left,
        `Inspect open cell (${row}, ${col}) and gather paths from above and left.`,
        "inspect",
        "amber",
        [11, 12, 13, 14],
        "The robot can only arrive from the two legal predecessor cells.",
        "Path counts are additive because routes from above and left are disjoint ways to reach the same cell.",
        "This cell is waiting for path flow from its open neighbors."
      );

      const fromTop = top ? dp[top[0]][top[1]] : 0;
      const fromLeft = left ? dp[left[0]][left[1]] : 0;
      dp[row][col] = fromTop + fromLeft;

      pushFrame(
        current,
        top,
        left,
        `Write dp[${row}][${col}] = ${fromTop} + ${fromLeft} = ${dp[row][col]}.`,
        "update",
        "sky",
        [13, 14, 15],
        "The cell stores the sum of all valid paths entering from the top and the left.",
        "Because the robot moves only right or down, these two predecessor counts fully describe the state transition.",
        "This count is now stable and can feed later cells."
      );
    }
  }

  pushFrame(
    null,
    null,
    null,
    `The destination cell stabilizes at ${dp[rows - 1][cols - 1]} unique path(s).`,
    "complete",
    dp[rows - 1][cols - 1] > 0 ? "emerald" : "rose",
    [17, 18],
    "The bottom-right DP cell is the total number of valid routes to the goal.",
    "Every valid route must terminate at the destination, so its DP count is the final answer.",
    "The path field is fully solved once the destination is reached.",
    true
  );

  return trace;
}
