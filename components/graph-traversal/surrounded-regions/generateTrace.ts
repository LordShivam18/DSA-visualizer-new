export type RegionValue = "X" | "O";

export type Coord = {
  row: number;
  col: number;
};

export type SurroundedRegionsPhase =
  | "border-scan"
  | "mark-safe"
  | "capture-pass"
  | "done";

export type SurroundedRegionsState = {
  input: string;
  board: RegionValue[][];
  safe: boolean[][];
  captured: boolean[][];
  frontier: Coord[];
  rows: number;
  cols: number;
  phase: SurroundedRegionsPhase;
  safeCount: number;
  capturedCount: number;
  borderSeedCount: number;
  result: RegionValue[][] | null;
};

export type SurroundedRegionsPointers = {
  scan: Coord | null;
  current: Coord | null;
  neighbor: Coord | null;
  queueFront: Coord | null;
  phase: SurroundedRegionsPhase;
};

export type SurroundedRegionsActionKind =
  | "parsed"
  | "scan-border"
  | "seed-safe"
  | "skip-border"
  | "pop-safe"
  | "inspect-neighbor"
  | "mark-safe"
  | "ignore-neighbor"
  | "scan-flip"
  | "capture-cell"
  | "preserve-cell"
  | "done";

export type SurroundedRegionsTraceStep = {
  step: number;
  action: string;
  actionKind: SurroundedRegionsActionKind;
  codeLines: number[];
  state: SurroundedRegionsState;
  pointers: SurroundedRegionsPointers;
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

function normalizeBoard(board: RegionValue[][]) {
  if (board.length === 0) {
    return board;
  }

  const width = Math.max(...board.map((row) => row.length), 0);
  return board.map((row) =>
    Array.from({ length: width }, (_, index) => row[index] ?? "X")
  );
}

function fromParsedValue(value: unknown): RegionValue[][] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  if (value.every((item) => typeof item === "string")) {
    return normalizeBoard(
      value.map((row) =>
        row
          .toUpperCase()
          .split("")
          .filter((char) => char === "X" || char === "O")
          .map((char) => char as RegionValue)
      )
    ).filter((row) => row.length > 0);
  }

  if (value.every((item) => Array.isArray(item))) {
    return normalizeBoard(
      value.map((row) =>
        (row as unknown[])
          .map((cell) =>
            typeof cell === "string" || typeof cell === "number"
              ? String(cell).toUpperCase()
              : ""
          )
          .filter((cell) => cell === "X" || cell === "O")
          .map((cell) => cell as RegionValue)
      )
    ).filter((row) => row.length > 0);
  }

  return null;
}

export function parseBoardInput(rawInput: string) {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    const jsonBoard = fromParsedValue(parsed);
    if (jsonBoard) {
      return jsonBoard;
    }
  } catch {
    // Fall back to plain text parsing below.
  }

  return normalizeBoard(
    trimmed
      .split(/\r?\n|\|/)
      .map((row) => row.toUpperCase().replace(/[^XO]/g, ""))
      .filter((row) => row.length > 0)
      .map((row) => row.split("").map((cell) => cell as RegionValue))
  );
}

function createMatrix<T>(rows: number, cols: number, value: T) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => value)
  );
}

function cloneCoords(coords: Coord[]) {
  return coords.map((coord) => ({ ...coord }));
}

function cloneBooleanMatrix(matrix: boolean[][]) {
  return matrix.map((row) => [...row]);
}

function cloneBoard(board: RegionValue[][]) {
  return board.map((row) => [...row]);
}

function isInside(board: RegionValue[][], row: number, col: number) {
  return row >= 0 && col >= 0 && row < board.length && col < (board[0]?.length ?? 0);
}

function buildBorderCoords(rows: number, cols: number) {
  const coords: Coord[] = [];
  const seen = new Set<string>();

  function add(row: number, col: number) {
    const key = `${row}-${col}`;
    if (!seen.has(key)) {
      seen.add(key);
      coords.push({ row, col });
    }
  }

  for (let row = 0; row < rows; row += 1) {
    add(row, 0);
    if (cols > 1) {
      add(row, cols - 1);
    }
  }

  for (let col = 1; col < cols - 1; col += 1) {
    add(0, col);
    if (rows > 1) {
      add(rows - 1, col);
    }
  }

  return coords;
}

function buildResult(board: RegionValue[][], captured: boolean[][]) {
  return board.map((row, rowIndex) =>
    row.map((cell, colIndex) => (captured[rowIndex][colIndex] ? "X" : cell))
  );
}

export function formatCoord(coord: Coord | null) {
  if (!coord) {
    return "none";
  }

  return `(${coord.row}, ${coord.col})`;
}

export function formatBoard(board: RegionValue[][] | null) {
  if (!board || board.length === 0) {
    return "[]";
  }

  return `[${board
    .map((row) => `[${row.map((cell) => `"${cell}"`).join(", ")}]`)
    .join(", ")}]`;
}

export function generateTrace(rawInput: string): SurroundedRegionsTraceStep[] {
  const board = parseBoardInput(rawInput);
  const rows = board.length;
  const cols = board[0]?.length ?? 0;
  const safe = createMatrix(rows, cols, false);
  const captured = createMatrix(rows, cols, false);
  const frontier: Coord[] = [];
  const trace: SurroundedRegionsTraceStep[] = [];

  let phase: SurroundedRegionsPhase = "border-scan";
  let safeCount = 0;
  let capturedCount = 0;
  let borderSeedCount = 0;
  let result: RegionValue[][] | null = null;

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
    actionKind: SurroundedRegionsActionKind;
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
        board: cloneBoard(board),
        safe: cloneBooleanMatrix(safe),
        captured: cloneBooleanMatrix(captured),
        frontier: cloneCoords(frontier),
        rows,
        cols,
        phase,
        safeCount,
        capturedCount,
        borderSeedCount,
        result: result ? cloneBoard(result) : null,
      },
      pointers: {
        scan: scan ? { ...scan } : null,
        current: current ? { ...current } : null,
        neighbor: neighbor ? { ...neighbor } : null,
        queueFront: frontier.length > 0 ? { ...frontier[0] } : null,
        phase,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      rows === 0 || cols === 0
        ? "Parse the board. There are no cells to process."
        : "Parse the board, prepare the queue, and get ready to protect every border-connected O.",
    actionKind: "parsed",
    codeLines: [1, 2, 3, 4],
    done: false,
    explanationBeginner:
      rows === 0 || cols === 0
        ? "An empty board cannot contain any surrounded region."
        : "The algorithm first finds O cells that touch the border, because those can never be captured.",
    explanationExpert:
      rows === 0 || cols === 0
        ? "The empty-input edge case terminates immediately."
        : "The core invariant is that only O cells unreachable from the border are flippable.",
  });

  if (rows === 0 || cols === 0) {
    result = [];
    phase = "done";

    pushStep({
      action: "The board is empty, so there are no surrounded regions to capture.",
      actionKind: "done",
      codeLines: [1],
      done: true,
      explanationBeginner:
        "Nothing changes because there are no cells at all.",
      explanationExpert:
        "No traversal or flip pass is required for an empty board.",
    });

    return trace;
  }

  const borderCoords = buildBorderCoords(rows, cols);

  for (const coord of borderCoords) {
    phase = "border-scan";
    scan = coord;
    current = null;
    neighbor = null;

    pushStep({
      action: `Inspect border cell ${formatCoord(coord)} to see whether it should seed the safe-region queue.`,
      actionKind: "scan-border",
      codeLines: [10, 11],
      done: false,
      explanationBeginner:
        "Any O on the border is automatically safe because it is not fully enclosed by X cells.",
      explanationExpert:
        "The boundary sweep identifies all starting vertices of the border-reachable subgraph.",
    });

    if (board[coord.row][coord.col] === "X") {
      pushStep({
        action: `Border cell ${formatCoord(coord)} is X, so it cannot seed a safe region.`,
        actionKind: "skip-border",
        codeLines: [4, 5],
        done: false,
        explanationBeginner:
          "Walls do not need protection because only O cells can be captured.",
        explanationExpert:
          "The offer helper enqueues only O cells; walls are filtered out immediately.",
      });
      continue;
    }

    if (safe[coord.row][coord.col]) {
      pushStep({
        action: `Border cell ${formatCoord(coord)} is already marked safe, so the queue does not need it again.`,
        actionKind: "skip-border",
        codeLines: [4, 5],
        done: false,
        explanationBeginner:
          "This O was already reached from another border entry point.",
        explanationExpert:
          "Each safe cell is enqueued once, preserving linear traversal cost.",
      });
      continue;
    }

    safe[coord.row][coord.col] = true;
    safeCount += 1;
    borderSeedCount += 1;
    frontier.push(coord);

    pushStep({
      action: `Border O at ${formatCoord(coord)} becomes a safe seed and enters the queue.`,
      actionKind: "seed-safe",
      codeLines: [5, 6, 7],
      done: false,
      explanationBeginner:
        "This O touches the edge, so it must stay O in the final board.",
      explanationExpert:
        "Safe marking mirrors the common in-place trick of changing border-reachable O cells to a temporary marker like S.",
    });
  }

  phase = "mark-safe";

  while (frontier.length > 0) {
    const cell = frontier.shift() as Coord;
    current = cell;
    neighbor = null;
    scan = null;

    pushStep({
      action: `Pop ${formatCoord(cell)} from the queue and spread safety to its neighbors.`,
      actionKind: "pop-safe",
      codeLines: [12, 13, 14],
      done: false,
      explanationBeginner:
        "BFS now expands from one already-safe O to see which adjacent O cells are also safe.",
      explanationExpert:
        "The queue performs a breadth-first traversal over the border-reachable O subgraph.",
    });

    for (const direction of directions) {
      const nextRow = cell.row + direction.dr;
      const nextCol = cell.col + direction.dc;
      neighbor = { row: nextRow, col: nextCol };

      pushStep({
        action: `Inspect the ${direction.name} neighbor of ${formatCoord(cell)} at ${formatCoord(neighbor)}.`,
        actionKind: "inspect-neighbor",
        codeLines: [15, 16],
        done: false,
        explanationBeginner:
          "Each adjacent O connected to a safe cell also becomes safe.",
        explanationExpert:
          "Traversal follows only orthogonal edges, matching the problem's connectivity definition.",
      });

      if (!isInside(board, nextRow, nextCol)) {
        pushStep({
          action: `${formatCoord(neighbor)} lies outside the board, so BFS ignores it.`,
          actionKind: "ignore-neighbor",
          codeLines: [17],
          done: false,
          explanationBeginner:
            "Leaving the board cannot protect any new cell.",
          explanationExpert:
            "Out-of-bounds coordinates fail the guard condition and contribute no reachable vertex.",
        });
        continue;
      }

      if (board[nextRow][nextCol] === "X") {
        pushStep({
          action: `${formatCoord(neighbor)} is X, so safety cannot pass through it.`,
          actionKind: "ignore-neighbor",
          codeLines: [17],
          done: false,
          explanationBeginner:
            "X cells are walls, so the safe region stops here.",
          explanationExpert:
            "Only O vertices belong to the reachable region being marked.",
        });
        continue;
      }

      if (safe[nextRow][nextCol]) {
        pushStep({
          action: `${formatCoord(neighbor)} is already marked safe, so BFS skips the duplicate visit.`,
          actionKind: "ignore-neighbor",
          codeLines: [17],
          done: false,
          explanationBeginner:
            "Once a cell is known to be safe, it does not need to be queued again.",
          explanationExpert:
            "The visited-safe guard keeps the traversal O(rows * cols).",
        });
        continue;
      }

      safe[nextRow][nextCol] = true;
      safeCount += 1;
      frontier.push({ row: nextRow, col: nextCol });

      pushStep({
        action: `${formatCoord(neighbor)} is an O connected to the border, so mark it safe and enqueue it.`,
        actionKind: "mark-safe",
        codeLines: [17, 18, 19],
        done: false,
        explanationBeginner:
          "This O can reach the border through other O cells, so it must stay O.",
        explanationExpert:
          "Border reachability is the exact criterion that separates preserved cells from captured cells.",
      });
    }
  }

  phase = "capture-pass";
  current = null;
  neighbor = null;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      scan = { row, col };

      pushStep({
        action: `Scan ${formatCoord(scan)} during the final pass that flips enclosed regions.`,
        actionKind: "scan-flip",
        codeLines: [22, 23],
        done: false,
        explanationBeginner:
          "After the safe cells are known, the board is checked one more time to decide which O cells get captured.",
        explanationExpert:
          "The second pass classifies each cell using the reachability labels computed earlier.",
      });

      if (board[row][col] === "X") {
        pushStep({
          action: `${formatCoord(scan)} is already X, so it stays unchanged.`,
          actionKind: "preserve-cell",
          codeLines: [22, 23],
          done: false,
          explanationBeginner:
            "Walls remain walls; only O cells are candidates for capture.",
          explanationExpert:
            "Non-O cells are outside the transformation domain and pass through unchanged.",
        });
        continue;
      }

      if (safe[row][col]) {
        pushStep({
          action: `${formatCoord(scan)} is safe because it can reach the border, so it stays O.`,
          actionKind: "preserve-cell",
          codeLines: [25],
          done: false,
          explanationBeginner:
            "This O survives because a path of O cells connects it back to the border.",
          explanationExpert:
            "Safe cells correspond to the temporary marker restoration step in the standard in-place solution.",
        });
        continue;
      }

      captured[row][col] = true;
      capturedCount += 1;

      pushStep({
        action: `${formatCoord(scan)} is an enclosed O, so it is captured and flipped to X.`,
        actionKind: "capture-cell",
        codeLines: [24],
        done: false,
        explanationBeginner:
          "Because this O cannot reach the border, it is surrounded on all sides by X walls.",
        explanationExpert:
          "Any O outside the border-reachable set is enclosed and therefore belongs to a capturable region.",
      });
    }
  }

  phase = "done";
  scan = null;
  result = buildResult(board, captured);

  pushStep({
    action: `The traversal is complete. Every enclosed region has been captured, and ${capturedCount} cell${capturedCount === 1 ? "" : "s"} flipped to X.`,
    actionKind: "done",
    codeLines: [22, 23, 24, 25],
    done: true,
    explanationBeginner:
      "Border-connected O cells stayed safe, and only the trapped O cells were changed into X.",
    explanationExpert:
      "The algorithm performs two linear passes plus a BFS over border-reachable O cells, yielding O(rows * cols) time and O(rows * cols) auxiliary space.",
  });

  return trace;
}
