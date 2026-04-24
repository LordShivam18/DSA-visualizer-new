import {
  cloneMatrix,
  formatArray,
  isRectangular,
  parseNumberMatrix,
} from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type Direction = "top-row" | "right-column" | "bottom-row" | "left-column" | "done" | "error";

function keyOf(row: number, col: number) {
  return `${row}:${col}`;
}

function formatCells(cells: string[]) {
  return cells.length > 0 ? cells.join(" -> ") : "none";
}

export type SpiralMatrixTraceStep = TeachingTraceFrame & {
  state: {
    matrix: number[][];
    validInput: boolean;
    message: string | null;
    top: number;
    bottom: number;
    left: number;
    right: number;
    direction: Direction;
    activeCells: string[];
    visitedKeys: string[];
    collected: number[];
    result: number[] | null;
  };
};

export function generateTrace(rawMatrix: string) {
  const matrix = parseNumberMatrix(rawMatrix);
  const validInput =
    matrix.length > 0 &&
    isRectangular(matrix) &&
    matrix.every((row) => row.every(Number.isFinite));

  const trace: SpiralMatrixTraceStep[] = [];
  const visited = new Set<string>();
  const collected: number[] = [];

  let top = 0;
  let left = 0;
  let bottom = validInput ? matrix.length - 1 : -1;
  let right = validInput ? matrix[0].length - 1 : -1;
  let direction: Direction = validInput ? "top-row" : "error";
  let activeCells: string[] = [];
  let message: string | null = null;
  let result: number[] | null = null;

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
  }: Omit<SpiralMatrixTraceStep, "step" | "state" | "metrics" | "pointerChips">) {
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
        { label: "Collected", value: collected.length, tone: "emerald" },
        { label: "Rows left", value: validInput ? Math.max(bottom - top + 1, 0) : 0, tone: "sky" },
        { label: "Cols left", value: validInput ? Math.max(right - left + 1, 0) : 0, tone: "amber" },
      ],
      pointerChips: [
        { label: "top", value: String(top), tone: "sky" },
        { label: "bottom", value: String(bottom), tone: "sky" },
        { label: "left", value: String(left), tone: "amber" },
        { label: "right", value: String(right), tone: "amber" },
      ],
      done,
      state: {
        matrix: cloneMatrix(matrix),
        validInput,
        message,
        top,
        bottom,
        left,
        right,
        direction,
        activeCells: [...activeCells],
        visitedKeys: [...visited],
        collected: [...collected],
        result,
      },
    });
  }

  pushStep({
    action: validInput
      ? "Start from the outer boundary and peel the matrix one perimeter segment at a time."
      : "The visualizer first checks that the input is a non-empty rectangular numeric matrix.",
    actionKind: "parse",
    actionTone: validInput ? "sky" : "rose",
    codeLines: [1, 2, 3],
    beginnerNote: validInput
      ? "The four boundaries tell us what part of the matrix is still unvisited."
      : "Spiral traversal needs at least one row, one column, and consistent row lengths.",
    expertNote: validInput
      ? "Each sweep visits one exposed edge, then shrinks exactly one boundary so no cell is repeated."
      : "A jagged or empty matrix breaks the shrinking-boundary invariant.",
    focus: validInput
      ? "Keep the unvisited region as a shrinking rectangle."
      : "Fix the matrix shape before replaying the spiral trace.",
    hints: validInput
      ? [
          "Traverse top row left to right.",
          "Traverse right column top to bottom.",
          "Then mirror with bottom row and left column when they still exist.",
        ]
      : [
          "Example valid input: [[1,2,3],[4,5,6],[7,8,9]].",
          "New-line rows are supported.",
          "Every row must have the same width.",
        ],
    done: false,
  });

  if (!validInput) {
    result = [];
    message = "Enter a non-empty rectangular matrix of numbers.";

    pushStep({
      action: message,
      actionKind: "input-error",
      actionTone: "rose",
      codeLines: [1],
      beginnerNote:
        "There is no spiral to follow until the matrix has a consistent shape.",
      expertNote:
        "The algorithm depends on stable top, bottom, left, and right boundaries over a rectangle.",
      focus: "Input validation stopped the traversal early.",
      hints: [
        "Try the example preset first.",
        "Use JSON arrays or one row per line.",
        "Remove blank or uneven rows.",
      ],
      done: true,
    });

    return trace;
  }

  while (top <= bottom && left <= right) {
    activeCells = [];
    direction = "top-row";
    for (let col = left; col <= right; col += 1) {
      activeCells.push(keyOf(top, col));
      visited.add(keyOf(top, col));
      collected.push(matrix[top][col]);
    }
    pushStep({
      action: `Traverse the top row from (${top}, ${left}) to (${top}, ${right}) and collect ${formatArray(collected.slice(-activeCells.length))}.`,
      actionKind: "top sweep",
      actionTone: "sky",
      codeLines: [4, 5],
      beginnerNote:
        "The current top edge is fully exposed, so we read it left to right first.",
      expertNote:
        "After consuming the top edge, incrementing top removes exactly that visited row from the remaining rectangle.",
      focus: "The spiral always starts each layer by draining the top boundary.",
      hints: [
        `Visited this sweep: ${formatCells(activeCells)}.`,
        `Output so far: ${formatArray(collected)}.`,
        "The top boundary moves down after this step.",
      ],
      done: false,
    });
    top += 1;

    if (top > bottom || left > right) {
      break;
    }

    activeCells = [];
    direction = "right-column";
    for (let row = top; row <= bottom; row += 1) {
      activeCells.push(keyOf(row, right));
      visited.add(keyOf(row, right));
      collected.push(matrix[row][right]);
    }
    pushStep({
      action: `Traverse the right column from (${top}, ${right}) to (${bottom}, ${right}) and append ${formatArray(collected.slice(-activeCells.length))}.`,
      actionKind: "right sweep",
      actionTone: "amber",
      codeLines: [6, 7],
      beginnerNote:
        "Once the top edge is done, the right edge becomes the next exposed wall.",
      expertNote:
        "Shrinking right after this sweep preserves the invariant that every remaining cell is still inside the live rectangle.",
      focus: "The right boundary closes inward after its vertical pass.",
      hints: [
        `Visited this sweep: ${formatCells(activeCells)}.`,
        `Output so far: ${formatArray(collected)}.`,
        "The right boundary moves left after this step.",
      ],
      done: false,
    });
    right -= 1;

    if (top > bottom || left > right) {
      break;
    }

    activeCells = [];
    direction = "bottom-row";
    for (let col = right; col >= left; col -= 1) {
      activeCells.push(keyOf(bottom, col));
      visited.add(keyOf(bottom, col));
      collected.push(matrix[bottom][col]);
    }
    pushStep({
      action: `Traverse the bottom row from (${bottom}, ${right}) back to (${bottom}, ${left}) and append ${formatArray(collected.slice(-activeCells.length))}.`,
      actionKind: "bottom sweep",
      actionTone: "indigo",
      codeLines: [8],
      beginnerNote:
        "If rows are still left, the spiral wraps back along the bottom edge from right to left.",
      expertNote:
        "The guard top <= bottom prevents revisiting a single remaining row after the top sweep already consumed it.",
      focus: "The bottom edge is only used when the shrunken rectangle still has a real bottom row.",
      hints: [
        `Visited this sweep: ${formatCells(activeCells)}.`,
        `Output so far: ${formatArray(collected)}.`,
        "The bottom boundary moves up after this step.",
      ],
      done: false,
    });
    bottom -= 1;

    if (top > bottom || left > right) {
      break;
    }

    activeCells = [];
    direction = "left-column";
    for (let row = bottom; row >= top; row -= 1) {
      activeCells.push(keyOf(row, left));
      visited.add(keyOf(row, left));
      collected.push(matrix[row][left]);
    }
    pushStep({
      action: `Traverse the left column from (${bottom}, ${left}) up to (${top}, ${left}) and append ${formatArray(collected.slice(-activeCells.length))}.`,
      actionKind: "left sweep",
      actionTone: "rose",
      codeLines: [9],
      beginnerNote:
        "The final edge of the layer climbs upward, which completes one full ring around the matrix.",
      expertNote:
        "The guard left <= right prevents revisiting a single remaining column after the right sweep already consumed it.",
      focus: "Completing the left edge finishes the current spiral layer.",
      hints: [
        `Visited this sweep: ${formatCells(activeCells)}.`,
        `Output so far: ${formatArray(collected)}.`,
        "The left boundary moves right after this step.",
      ],
      done: false,
    });
    left += 1;
  }

  activeCells = [];
  direction = "done";
  result = [...collected];
  message = `Spiral traversal complete: ${formatArray(result)}.`;

  pushStep({
    action: message,
    actionKind: "complete",
    actionTone: "emerald",
    codeLines: [10],
    beginnerNote:
      "Once the boundaries cross, every cell has already been collected exactly once.",
    expertNote:
      "Each boundary moved inward monotonically, so the algorithm visits all m x n cells in O(mn) time with O(1) auxiliary traversal state.",
    focus: "Crossed boundaries mean the spiral has fully exhausted the matrix.",
    hints: [
      `Final order: ${formatArray(result)}.`,
      "No cell is revisited.",
      "Boundary checks handle odd row and odd column leftovers safely.",
    ],
    done: true,
  });

  return trace;
}
