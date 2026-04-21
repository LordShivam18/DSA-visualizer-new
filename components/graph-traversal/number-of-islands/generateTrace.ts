export type GridValue = "0" | "1";

export type Coord = {
  row: number;
  col: number;
};

export type IslandSizeEntry = {
  islandId: number;
  size: number;
};

export type NumberOfIslandsState = {
  input: string;
  grid: GridValue[][];
  visited: boolean[][];
  islandLabels: (number | null)[][];
  frontier: Coord[];
  islandSizes: IslandSizeEntry[];
  completedIslands: number[];
  islandCount: number;
  currentIslandId: number | null;
  lastCompletedIslandId: number | null;
  visitedLandCount: number;
  totalLandCount: number;
  rows: number;
  cols: number;
  result: number | null;
};

export type NumberOfIslandsPointers = {
  scan: Coord | null;
  current: Coord | null;
  neighbor: Coord | null;
  stackTop: Coord | null;
  currentIslandId: number | null;
};

export type NumberOfIslandsActionKind =
  | "parsed"
  | "scan-cell"
  | "skip-cell"
  | "start-island"
  | "pop-cell"
  | "inspect-neighbor"
  | "push-neighbor"
  | "ignore-neighbor"
  | "finish-island"
  | "done";

export type NumberOfIslandsTraceStep = {
  step: number;
  action: string;
  actionKind: NumberOfIslandsActionKind;
  codeLines: number[];
  state: NumberOfIslandsState;
  pointers: NumberOfIslandsPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

type Direction = {
  name: "down" | "up" | "right" | "left";
  dr: number;
  dc: number;
};

const directions: Direction[] = [
  { name: "down", dr: 1, dc: 0 },
  { name: "up", dr: -1, dc: 0 },
  { name: "right", dr: 0, dc: 1 },
  { name: "left", dr: 0, dc: -1 },
];

function normalizeGrid(grid: GridValue[][]) {
  if (grid.length === 0) {
    return grid;
  }

  const width = Math.max(...grid.map((row) => row.length), 0);
  return grid.map((row) =>
    Array.from({ length: width }, (_, index) => row[index] ?? "0")
  );
}

function fromParsedValue(value: unknown): GridValue[][] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  if (value.every((item) => typeof item === "string")) {
    return normalizeGrid(
      value.map((row) =>
        row
          .split("")
          .filter((char) => char === "0" || char === "1")
          .map((char) => char as GridValue)
      )
    ).filter((row) => row.length > 0);
  }

  if (value.every((item) => Array.isArray(item))) {
    return normalizeGrid(
      value.map((row) =>
        (row as unknown[])
          .map((cell) =>
            typeof cell === "number" || typeof cell === "string"
              ? String(cell)
              : ""
          )
          .filter((cell) => cell === "0" || cell === "1")
          .map((cell) => cell as GridValue)
      )
    ).filter((row) => row.length > 0);
  }

  return null;
}

export function parseGridInput(rawInput: string) {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    const jsonGrid = fromParsedValue(parsed);
    if (jsonGrid) {
      return jsonGrid;
    }
  } catch {
    // Fallback parsing handles plain text rows.
  }

  return normalizeGrid(
    trimmed
      .split(/\r?\n|\|/)
      .map((row) => row.replace(/[^01]/g, ""))
      .filter((row) => row.length > 0)
      .map((row) => row.split("").map((cell) => cell as GridValue))
  );
}

function cloneCoords(coords: Coord[]) {
  return coords.map((coord) => ({ ...coord }));
}

function cloneBooleanMatrix(matrix: boolean[][]) {
  return matrix.map((row) => [...row]);
}

function cloneLabelMatrix(matrix: (number | null)[][]) {
  return matrix.map((row) => [...row]);
}

function cloneIslandSizes(sizes: Map<number, number>) {
  return [...sizes.entries()]
    .sort((left, right) => left[0] - right[0])
    .map(([islandId, size]) => ({ islandId, size }));
}

function createMatrix<T>(rows: number, cols: number, value: T) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => value)
  );
}

function isInside(grid: GridValue[][], row: number, col: number) {
  return row >= 0 && col >= 0 && row < grid.length && col < (grid[0]?.length ?? 0);
}

function countLand(grid: GridValue[][]) {
  return grid.reduce(
    (total, row) => total + row.filter((cell) => cell === "1").length,
    0
  );
}

export function formatCoord(coord: Coord | null) {
  if (!coord) {
    return "none";
  }

  return `(${coord.row}, ${coord.col})`;
}

export function formatIslandResult(value: number | null) {
  return value === null ? "building" : String(value);
}

export function generateTrace(rawInput: string): NumberOfIslandsTraceStep[] {
  const grid = parseGridInput(rawInput);
  const rows = grid.length;
  const cols = grid[0]?.length ?? 0;
  const totalLandCount = countLand(grid);
  const visited = createMatrix(rows, cols, false);
  const islandLabels = createMatrix<number | null>(rows, cols, null);
  const frontier: Coord[] = [];
  const completedIslands: number[] = [];
  const islandSizes = new Map<number, number>();
  const trace: NumberOfIslandsTraceStep[] = [];

  let islandCount = 0;
  let visitedLandCount = 0;
  let currentIslandId: number | null = null;
  let lastCompletedIslandId: number | null = null;
  let result: number | null = null;

  let scan: Coord | null = null;
  let current: Coord | null = null;
  let neighbor: Coord | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: NumberOfIslandsActionKind;
    codeLines: number[];
    done: boolean;
    explanationBeginner: string;
    explanationExpert: string;
  }) {
    trace.push({
      step: trace.length,
      action,
      actionKind,
      codeLines,
      state: {
        input: rawInput,
        grid: grid.map((row) => [...row]),
        visited: cloneBooleanMatrix(visited),
        islandLabels: cloneLabelMatrix(islandLabels),
        frontier: cloneCoords(frontier),
        islandSizes: cloneIslandSizes(islandSizes),
        completedIslands: [...completedIslands],
        islandCount,
        currentIslandId,
        lastCompletedIslandId,
        visitedLandCount,
        totalLandCount,
        rows,
        cols,
        result,
      },
      pointers: {
        scan: scan ? { ...scan } : null,
        current: current ? { ...current } : null,
        neighbor: neighbor ? { ...neighbor } : null,
        stackTop: frontier.length > 0 ? { ...frontier[frontier.length - 1] } : null,
        currentIslandId,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      rows === 0 || cols === 0
        ? "Parse the grid. There are no cells to explore."
        : "Parse the grid, prepare the visited map, and get ready to scan every cell.",
    actionKind: "parsed",
    codeLines: [1, 2, 3, 4],
    done: false,
    explanationBeginner:
      rows === 0 || cols === 0
        ? "An empty grid cannot contain any islands."
        : "The algorithm first sets up a helper map so each land cell is counted only once.",
    explanationExpert:
      rows === 0 || cols === 0
        ? "The empty-input edge case returns 0 immediately."
        : "Traversal uses a stack-based DFS and a visited structure so each land cell is claimed by exactly one connected component.",
  });

  if (rows === 0 || cols === 0) {
    result = 0;

    pushStep({
      action: "The scan ends immediately. The number of islands is 0.",
      actionKind: "done",
      codeLines: [24],
      done: true,
      explanationBeginner:
        "Because there is no land to search, the answer stays at zero.",
      explanationExpert:
        "No connected components exist, so the final component count is 0.",
    });

    return trace;
  }

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      scan = { row, col };
      current = null;
      neighbor = null;

      pushStep({
        action: `Scan cell ${formatCoord(scan)} while sweeping the grid row by row.`,
        actionKind: "scan-cell",
        codeLines: [5, 6],
        done: false,
        explanationBeginner:
          "The outer loop checks every cell so no island start can be missed.",
        explanationExpert:
          "The scan phase searches for an unclaimed land cell that can serve as the root of a new connected component.",
      });

      if (grid[row][col] === "0") {
        pushStep({
          action: `Cell ${formatCoord(scan)} is water, so the scan moves on without starting DFS.`,
          actionKind: "skip-cell",
          codeLines: [7],
          done: false,
          explanationBeginner:
            "Water does not belong to any island, so it is ignored.",
          explanationExpert:
            "The guard clause filters out non-land cells before any component logic runs.",
        });
        continue;
      }

      if (visited[row][col]) {
        const islandId = islandLabels[row][col];
        pushStep({
          action: `Cell ${formatCoord(scan)} was already absorbed into island ${islandId}, so it behaves like already-flooded land.`,
          actionKind: "skip-cell",
          codeLines: [7],
          done: false,
          explanationBeginner:
            "This land cell was already reached from an earlier island start, so counting it again would double-count the same island.",
          explanationExpert:
            "In the in-place C++ solution this cell would already be flipped to water, preserving the one-component-one-count invariant.",
        });
        continue;
      }

      islandCount += 1;
      currentIslandId = islandCount;
      visited[row][col] = true;
      islandLabels[row][col] = islandCount;
      visitedLandCount += 1;
      islandSizes.set(islandCount, 1);
      frontier.push({ row, col });
      current = { row, col };

      pushStep({
        action: `Found untouched land at ${formatCoord(scan)}. Start island ${islandCount}, mark the cell visited, and push it onto the DFS stack.`,
        actionKind: "start-island",
        codeLines: [8, 9, 10, 11],
        done: false,
        explanationBeginner:
          "A brand-new island is discovered the first time the scan meets land that has not been claimed yet.",
        explanationExpert:
          "Incrementing the answer happens exactly once per connected component, at the moment its first unseen land cell is found.",
      });

      while (frontier.length > 0) {
        const cell = frontier.pop() as Coord;
        current = cell;
        neighbor = null;

        pushStep({
          action: `Pop ${formatCoord(cell)} from the stack and expand island ${currentIslandId}.`,
          actionKind: "pop-cell",
          codeLines: [12, 13],
          done: false,
          explanationBeginner:
            "DFS takes one land cell from the stack and explores outward from it.",
          explanationExpert:
            "Each stack pop represents one vertex expansion in the implicit grid graph.",
        });

        for (const direction of directions) {
          const nextRow = cell.row + direction.dr;
          const nextCol = cell.col + direction.dc;
          neighbor = { row: nextRow, col: nextCol };

          pushStep({
            action: `Inspect the ${direction.name} neighbor of ${formatCoord(cell)} at ${formatCoord(neighbor)}.`,
            actionKind: "inspect-neighbor",
            codeLines: [14, 15],
            done: false,
            explanationBeginner:
              "The algorithm checks each of the four horizontal and vertical directions one by one.",
            explanationExpert:
              "The component search explores 4-neighborhood edges only, matching the problem's connectivity definition.",
          });

          if (!isInside(grid, nextRow, nextCol)) {
            pushStep({
              action: `${formatCoord(neighbor)} lies outside the grid, so DFS ignores that direction.`,
              actionKind: "ignore-neighbor",
              codeLines: [16],
              done: false,
              explanationBeginner:
                "Moving off the board cannot add more land to the island.",
              explanationExpert:
                "Out-of-bounds coordinates fail the graph boundary check and contribute no edge traversal.",
            });
            continue;
          }

          if (grid[nextRow][nextCol] === "0") {
            pushStep({
              action: `${formatCoord(neighbor)} is water, so it does not join island ${currentIslandId}.`,
              actionKind: "ignore-neighbor",
              codeLines: [17],
              done: false,
              explanationBeginner:
                "Water breaks connectivity, so the island cannot continue through this cell.",
              explanationExpert:
                "Only vertices with value '1' are traversable; water cells terminate expansion in that direction.",
            });
            continue;
          }

          if (visited[nextRow][nextCol]) {
            const existingIsland = islandLabels[nextRow][nextCol];
            pushStep({
              action: `${formatCoord(neighbor)} was already marked for island ${existingIsland}, so DFS skips it to avoid duplicate work.`,
              actionKind: "ignore-neighbor",
              codeLines: [17],
              done: false,
              explanationBeginner:
                "A land cell should enter the stack only once, otherwise the same island would be explored repeatedly.",
              explanationExpert:
                "The visited check guarantees O(rows * cols) time by preventing repeated pushes of the same vertex.",
            });
            continue;
          }

          visited[nextRow][nextCol] = true;
          islandLabels[nextRow][nextCol] = currentIslandId;
          visitedLandCount += 1;
          islandSizes.set(
            currentIslandId,
            (islandSizes.get(currentIslandId) ?? 0) + 1
          );
          frontier.push({ row: nextRow, col: nextCol });

          pushStep({
            action: `Neighbor ${formatCoord(neighbor)} is new land. Mark it visited and push it so island ${currentIslandId} keeps expanding.`,
            actionKind: "push-neighbor",
            codeLines: [17, 18, 19],
            done: false,
            explanationBeginner:
              "This land cell touches the current island, so it becomes part of the same component.",
            explanationExpert:
              "Mark-before-push ensures the vertex is claimed as soon as it is discovered, preventing duplicate frontier entries.",
          });
        }
      }

      lastCompletedIslandId = currentIslandId;

      pushStep({
        action: `The stack is empty, so island ${currentIslandId} is fully explored and counted exactly once.`,
        actionKind: "finish-island",
        codeLines: [12, 21],
        done: false,
        explanationBeginner:
          "When no more connected land is waiting on the stack, that whole island is finished.",
        explanationExpert:
          "A connected component is complete precisely when DFS exhausts its frontier.",
      });

      currentIslandId = null;
      current = null;
      neighbor = null;
    }
  }

  scan = null;
  current = null;
  neighbor = null;
  result = islandCount;

  pushStep({
    action: `Every cell has been scanned. The grid contains ${islandCount} island${islandCount === 1 ? "" : "s"}.`,
    actionKind: "done",
    codeLines: [24],
    done: true,
    explanationBeginner:
      "The final answer is the number of times we had to start a brand-new DFS from unseen land.",
    explanationExpert:
      "Each land vertex is visited once, so the traversal runs in O(rows * cols) time with O(rows * cols) worst-case stack space.",
  });

  return trace;
}
