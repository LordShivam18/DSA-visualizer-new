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

type Phase = "transpose" | "reverse-row" | "done" | "error";

export type RotateImageTraceStep = TeachingTraceFrame & {
  state: {
    matrix: number[][];
    validInput: boolean;
    message: string | null;
    size: number;
    phase: Phase;
    activeA: Coord | null;
    activeB: Coord | null;
    rowIndex: number | null;
    swapCount: number;
    result: number[][] | null;
  };
};

export function generateTrace(rawMatrix: string) {
  const matrix = parseNumberMatrix(rawMatrix);
  const validInput =
    matrix.length > 0 &&
    isRectangular(matrix) &&
    matrix.length === (matrix[0]?.length ?? -1);

  const n = validInput ? matrix.length : 0;
  const trace: RotateImageTraceStep[] = [];

  let phase: Phase = validInput ? "transpose" : "error";
  let activeA: Coord | null = null;
  let activeB: Coord | null = null;
  let rowIndex: number | null = null;
  let swapCount = 0;
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
  }: Omit<RotateImageTraceStep, "step" | "state" | "metrics" | "pointerChips">) {
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
        { label: "Size", value: `${n} x ${n}`, tone: "sky" },
        { label: "Swaps", value: swapCount, tone: "amber" },
        { label: "Phase", value: phase, tone: "emerald" },
      ],
      pointerChips: [
        { label: "A", value: activeA ? `(${activeA.row}, ${activeA.col})` : "-", tone: "sky" },
        { label: "B", value: activeB ? `(${activeB.row}, ${activeB.col})` : "-", tone: "amber" },
        { label: "row", value: rowIndex !== null ? String(rowIndex) : "-", tone: "indigo" },
      ],
      done,
      state: {
        matrix: cloneMatrix(matrix),
        validInput,
        message,
        size: n,
        phase,
        activeA: activeA ? { ...activeA } : null,
        activeB: activeB ? { ...activeB } : null,
        rowIndex,
        swapCount,
        result: result ? cloneMatrix(result) : null,
      },
    });
  }

  pushStep({
    action: validInput
      ? "Rotate in place by transposing across the diagonal first, then reversing each row."
      : "The visualizer first checks that the input is a non-empty square matrix.",
    actionKind: "parse",
    actionTone: validInput ? "sky" : "rose",
    codeLines: [1, 2],
    beginnerNote: validInput
      ? "A 90-degree clockwise rotation can be broken into two simpler in-place matrix transforms."
      : "Rotate Image only works on square matrices because rows become columns.",
    expertNote: validInput
      ? "Transpose mirrors across the main diagonal, and row reversal completes the clockwise permutation."
      : "A non-square matrix does not admit the same in-place index mapping for clockwise rotation.",
    focus: validInput
      ? "Use swaps only. No auxiliary matrix is needed."
      : "Provide an n x n matrix before replaying the trace.",
    hints: validInput
      ? [
          "Swap matrix[r][c] with matrix[c][r] for c > r.",
          "Then reverse every row in place.",
          "Those two passes equal a clockwise 90-degree rotation.",
        ]
      : [
          "Try [[1,2,3],[4,5,6],[7,8,9]].",
          "All rows must have the same length.",
          "The row count and column count must match.",
        ],
    done: false,
  });

  if (!validInput) {
    result = [];
    message = "Enter a non-empty square matrix.";

    pushStep({
      action: message,
      actionKind: "input-error",
      actionTone: "rose",
      codeLines: [1],
      beginnerNote:
        "Without a square board, we cannot rotate the matrix in place.",
      expertNote:
        "In-place rotation relies on a bijection between rows and columns of equal dimension.",
      focus: "Input validation stopped the rotation early.",
      hints: [
        "Square means rows = columns.",
        "JSON arrays and newline rows both work.",
        "Replay after correcting the matrix shape.",
      ],
      done: true,
    });

    return trace;
  }

  for (let row = 0; row < n; row += 1) {
    for (let col = row + 1; col < n; col += 1) {
      phase = "transpose";
      rowIndex = row;
      activeA = { row, col };
      activeB = { row: col, col: row };
      [matrix[row][col], matrix[col][row]] = [matrix[col][row], matrix[row][col]];
      swapCount += 1;

      pushStep({
        action: `Transpose swap: exchange (${row}, ${col}) with (${col}, ${row}).`,
        actionKind: "transpose swap",
        actionTone: "sky",
        codeLines: [3, 4, 5],
        beginnerNote:
          "Transposition flips values across the main diagonal, turning rows into columns.",
        expertNote:
          "Restricting swaps to c > r avoids undoing work and preserves an O(n^2) in-place pass.",
        focus:
          "Every off-diagonal pair is visited exactly once during transposition.",
        hints: [
          "Diagonal cells stay where they are.",
          "Only one triangular half needs to be traversed.",
          `Matrix now: ${formatMatrix(matrix)}.`,
        ],
        done: false,
      });
    }
  }

  for (let row = 0; row < n; row += 1) {
    let left = 0;
    let right = n - 1;

    while (left < right) {
      phase = "reverse-row";
      rowIndex = row;
      activeA = { row, col: left };
      activeB = { row, col: right };
      [matrix[row][left], matrix[row][right]] = [matrix[row][right], matrix[row][left]];
      swapCount += 1;

      pushStep({
        action: `Reverse row ${row}: swap (${row}, ${left}) with (${row}, ${right}).`,
        actionKind: "row reversal",
        actionTone: "amber",
        codeLines: [6, 7, 8],
        beginnerNote:
          "After transposing, reversing each row swings the matrix into its clockwise orientation.",
        expertNote:
          "Row reversal converts the transpose into the composition (r, c) -> (c, n - 1 - r), which is exactly a clockwise 90-degree rotation.",
        focus:
          "Only symmetric positions inside the same row are swapped during the second phase.",
        hints: [
          "Each row is reversed independently.",
          "Pointers move inward until they cross.",
          `Matrix now: ${formatMatrix(matrix)}.`,
        ],
        done: false,
      });

      left += 1;
      right -= 1;
    }
  }

  phase = "done";
  activeA = null;
  activeB = null;
  rowIndex = null;
  result = cloneMatrix(matrix);
  message = `Rotation complete: ${formatMatrix(result)}.`;

  pushStep({
    action: message,
    actionKind: "complete",
    actionTone: "emerald",
    codeLines: [9],
    beginnerNote:
      "Once every row is reversed, the matrix has finished rotating clockwise.",
    expertNote:
      "The two in-place passes complete in O(n^2) time with O(1) extra space.",
    focus: "Transpose plus row reversal gives the final rotated image.",
    hints: [
      `Final matrix: ${formatMatrix(result)}.`,
      "No second matrix was allocated.",
      "Each swap permanently moves two cells closer to their rotated positions.",
    ],
    done: true,
  });

  return trace;
}
