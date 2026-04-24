import {
  cloneMatrix,
  formatMatrix,
  isRectangular,
  parseNumberMatrix,
} from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type Coord = {
  row: number;
  col: number;
};

type Phase = "mark-transitions" | "finalize" | "done" | "error";

type LifeCell = -1 | 0 | 1 | 2;

const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const;

function countLiveNeighbors(board: number[][], row: number, col: number) {
  const neighbors: Coord[] = [];

  for (const [dr, dc] of directions) {
    const nextRow = row + dr;
    const nextCol = col + dc;

    if (
      nextRow < 0 ||
      nextCol < 0 ||
      nextRow >= board.length ||
      nextCol >= board[0].length
    ) {
      continue;
    }

    if (Math.abs(board[nextRow][nextCol]) === 1) {
      neighbors.push({ row: nextRow, col: nextCol });
    }
  }

  return neighbors;
}

function markerCount(board: number[][]) {
  return board.flat().filter((value) => value === -1 || value === 2).length;
}

function formatCoords(coords: Coord[]) {
  return coords.length > 0
    ? coords.map((coord) => `(${coord.row}, ${coord.col})`).join(", ")
    : "none";
}

export type GameOfLifeTraceStep = TeachingTraceFrame & {
  state: {
    board: number[][];
    validInput: boolean;
    message: string | null;
    phase: Phase;
    currentCell: Coord | null;
    activeNeighbors: Coord[];
    liveNeighbors: number;
    nextValue: number | null;
    transitionCount: number;
    result: number[][] | null;
  };
};

export function generateTrace(rawBoard: string) {
  const board = parseNumberMatrix(rawBoard);
  const validInput =
    board.length > 0 &&
    isRectangular(board) &&
    board.every((row) => row.every((value) => value === 0 || value === 1));

  const trace: GameOfLifeTraceStep[] = [];
  let snapshotBoard: number[][] = board;

  let phase: Phase = validInput ? "mark-transitions" : "error";
  let currentCell: Coord | null = null;
  let activeNeighbors: Coord[] = [];
  let liveNeighbors = 0;
  let nextValue: number | null = null;
  let transitionCount = 0;
  let message: string | null = null;
  let result: number[][] | null = null;

  function pushStep({
    action,
    actionKind,
    actionTone,
    codeLines,
    beginnerNote,
    expertNote,
    focus,
      hints,
      done,
    }: Omit<GameOfLifeTraceStep, "step" | "state" | "metrics" | "pointerChips">) {
    trace.push({
      step: trace.length,
      action,
      actionKind,
      actionTone,
      codeLines,
      beginnerNote,
      expertNote,
      focus,
      hints,
      metrics: [
        { label: "Live neighbors", value: liveNeighbors, tone: "sky" },
        { label: "Pending markers", value: markerCount(snapshotBoard), tone: "amber" },
        { label: "Transitions", value: transitionCount, tone: "emerald" },
      ],
      pointerChips: [
        { label: "cell", value: currentCell ? `(${currentCell.row}, ${currentCell.col})` : "-", tone: "sky" },
        { label: "next", value: nextValue !== null ? String(nextValue) : "-", tone: "amber" },
        { label: "phase", value: phase, tone: "indigo" },
      ],
      done,
      state: {
        board: cloneMatrix(snapshotBoard),
        validInput,
        message,
        phase,
        currentCell: currentCell ? { ...currentCell } : null,
        activeNeighbors: activeNeighbors.map((coord) => ({ ...coord })),
        liveNeighbors,
        nextValue,
        transitionCount,
        result: result ? cloneMatrix(result) : null,
      },
    });
  }

  pushStep({
    action: validInput
      ? "Evaluate each cell using its eight neighbors, mark transitions in place, then finalize the next generation."
      : "The visualizer first checks that the board is a non-empty rectangular matrix containing only 0 and 1.",
    actionKind: "parse",
    actionTone: validInput ? "sky" : "rose",
    codeLines: [1, 2],
    beginnerNote: validInput
      ? "Game of Life updates every cell simultaneously, so we mark changes before finalizing them."
      : "The board must only contain dead cells (0) and live cells (1).",
    expertNote: validInput
      ? "Temporary encodings let the algorithm remember both the old and new states without allocating a second grid."
      : "Invalid cell values or jagged shape break the neighborhood model.",
    focus: validInput
      ? "Count neighbors from the old state even while transition markers are being written."
      : "Fix the board shape or values before replaying the trace.",
    hints: validInput
      ? [
          "Use -1 for live -> dead.",
          "Use 2 for dead -> live.",
          "Neighbor counts treat absolute value 1 as originally alive.",
        ]
      : [
          "Try [[0,1,0],[0,0,1],[1,1,1],[0,0,0]].",
          "Every row must have the same width.",
          "Only 0 and 1 are allowed.",
        ],
    done: false,
  });

  if (!validInput) {
    result = [];
    message = "Enter a non-empty rectangular board using only 0 and 1.";

    pushStep({
      action: message,
      actionKind: "input-error",
      actionTone: "rose",
      codeLines: [1],
      beginnerNote:
        "The update rules cannot run until the board is a clean binary grid.",
      expertNote:
        "Neighborhood evaluation assumes a rectangular lattice with binary state values.",
      focus: "Input validation stopped the simulation early.",
      hints: [
        "Use JSON arrays or one row per line.",
        "Replace any value besides 0 or 1.",
        "Replay after correcting the board.",
      ],
      done: true,
    });

    return trace;
  }

  const workingBoard = board as LifeCell[][];
  snapshotBoard = workingBoard;

  for (let row = 0; row < workingBoard.length; row += 1) {
    for (let col = 0; col < workingBoard[0].length; col += 1) {
      phase = "mark-transitions";
      currentCell = { row, col };
      activeNeighbors = countLiveNeighbors(workingBoard, row, col);
      liveNeighbors = activeNeighbors.length;

      const currentValue = workingBoard[row][col];
      nextValue = currentValue;
      let actionKind = "survive";
      let actionTone: "sky" | "rose" | "amber" | "emerald" = "sky";
      let action = `Cell (${row}, ${col}) has ${liveNeighbors} live neighbor${
        liveNeighbors === 1 ? "" : "s"
      } and stays ${currentValue === 1 ? "alive" : "dead"}.`;

      if (currentValue === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
        workingBoard[row][col] = -1;
        nextValue = 0;
        transitionCount += 1;
        actionKind = "dies";
        actionTone = "rose";
        action = `Cell (${row}, ${col}) is alive with ${liveNeighbors} live neighbors, so it dies in the next generation.`;
      } else if (currentValue === 0 && liveNeighbors === 3) {
        workingBoard[row][col] = 2;
        nextValue = 1;
        transitionCount += 1;
        actionKind = "rebirth";
        actionTone = "amber";
        action = `Cell (${row}, ${col}) is dead but has exactly 3 live neighbors, so it becomes alive.`;
      } else if (currentValue === 1) {
        actionTone = "emerald";
        action = `Cell (${row}, ${col}) survives because a live cell with ${liveNeighbors} neighbors stays alive.`;
      }

      pushStep({
        action,
        actionKind,
        actionTone,
        codeLines: [3, 4, 5],
        beginnerNote:
          "The current cell reads its neighbors from the old generation, even if nearby cells already carry temporary markers.",
        expertNote:
          "Counting abs(value) === 1 preserves the previous-generation live set while in-place markers encode the pending next state.",
        focus:
          "Every cell is judged independently against the four Game of Life rules before the board is finalized.",
        hints: [
          `Live neighbors: ${formatCoords(activeNeighbors)}.`,
          `Old state: ${currentValue}.`,
          `Next state: ${nextValue}.`,
        ],
        done: false,
      });
    }
  }

  for (let row = 0; row < workingBoard.length; row += 1) {
    for (let col = 0; col < workingBoard[0].length; col += 1) {
      if (workingBoard[row][col] !== -1 && workingBoard[row][col] !== 2) {
        continue;
      }

      phase = "finalize";
      currentCell = { row, col };
      activeNeighbors = [];
      liveNeighbors = 0;
      const finalizedValue: LifeCell = workingBoard[row][col] === 2 ? 1 : 0;
      nextValue = finalizedValue;
      workingBoard[row][col] = finalizedValue;

      pushStep({
        action: `Finalize cell (${row}, ${col}) by converting its temporary marker into ${nextValue}.`,
        actionKind: "finalize",
        actionTone: "indigo",
        codeLines: [6],
        beginnerNote:
          "Temporary markers now collapse into ordinary 0 and 1 values for the next generation.",
        expertNote:
          "The finalize pass erases historical state because every neighbor count has already been completed.",
        focus: "Only transitional cells need work during the second pass.",
        hints: [
          "Marker -1 becomes 0.",
          "Marker 2 becomes 1.",
          `Board now: ${formatMatrix(workingBoard)}.`,
        ],
        done: false,
      });
    }
  }

  phase = "done";
  currentCell = null;
  activeNeighbors = [];
  liveNeighbors = 0;
  nextValue = null;
  result = cloneMatrix(workingBoard);
  message = `Next generation ready: ${formatMatrix(result)}.`;

  pushStep({
    action: message,
    actionKind: "complete",
    actionTone: "emerald",
    codeLines: [7],
    beginnerNote:
      "All transition markers have been resolved, so the board now shows the next generation.",
    expertNote:
      "The board was updated in O(mn) time with O(1) extra space beyond the fixed neighbor loop.",
    focus: "The simulation has fully advanced by one generation.",
    hints: [
      `Final board: ${formatMatrix(result)}.`,
      "Births and deaths were applied simultaneously.",
      "No duplicate board allocation was required.",
    ],
    done: true,
  });

  return trace;
}
