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

type Phase =
  | "mark-first-row-col"
  | "zero-inner"
  | "zero-first-row"
  | "zero-first-col"
  | "done"
  | "error";

function computeRowMarkers(matrix: number[][]) {
  const markers: number[] = [];
  for (let row = 1; row < matrix.length; row += 1) {
    if (matrix[row][0] === 0) {
      markers.push(row);
    }
  }
  return markers;
}

function computeColMarkers(matrix: number[][]) {
  const markers: number[] = [];
  for (let col = 1; col < matrix[0].length; col += 1) {
    if (matrix[0][col] === 0) {
      markers.push(col);
    }
  }
  return markers;
}

export type SetMatrixZeroesTraceStep = TeachingTraceFrame & {
  state: {
    matrix: number[][];
    validInput: boolean;
    message: string | null;
    firstRowZero: boolean;
    firstColZero: boolean;
    phase: Phase;
    activeCell: Coord | null;
    markerCell: Coord | null;
    rowMarkers: number[];
    colMarkers: number[];
    result: number[][] | null;
  };
};

export function generateTrace(rawMatrix: string) {
  const matrix = parseNumberMatrix(rawMatrix);
  const validInput =
    matrix.length > 0 &&
    isRectangular(matrix) &&
    matrix.every((row) => row.every(Number.isFinite));

  const trace: SetMatrixZeroesTraceStep[] = [];

  let firstRowZero = false;
  let firstColZero = false;
  let phase: Phase = validInput ? "mark-first-row-col" : "error";
  let activeCell: Coord | null = null;
  let markerCell: Coord | null = null;
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
  }: Omit<SetMatrixZeroesTraceStep, "step" | "state" | "metrics" | "pointerChips">) {
    const rowMarkers = validInput ? computeRowMarkers(matrix) : [];
    const colMarkers = validInput ? computeColMarkers(matrix) : [];
    const zeroCount = validInput
      ? matrix.flat().filter((value) => value === 0).length
      : 0;

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
        { label: "Zeroes", value: zeroCount, tone: "emerald" },
        { label: "Row markers", value: rowMarkers.length, tone: "amber" },
        { label: "Col markers", value: colMarkers.length, tone: "sky" },
      ],
      pointerChips: [
        { label: "cell", value: activeCell ? `(${activeCell.row}, ${activeCell.col})` : "-", tone: "sky" },
        { label: "marker", value: markerCell ? `(${markerCell.row}, ${markerCell.col})` : "-", tone: "amber" },
        { label: "phase", value: phase, tone: "indigo" },
      ],
      done,
      state: {
        matrix: cloneMatrix(matrix),
        validInput,
        message,
        firstRowZero,
        firstColZero,
        phase,
        activeCell: activeCell ? { ...activeCell } : null,
        markerCell: markerCell ? { ...markerCell } : null,
        rowMarkers,
        colMarkers,
        result: result ? cloneMatrix(result) : null,
      },
    });
  }

  pushStep({
    action: validInput
      ? "Use the first row and first column as marker ledgers so zeroing can happen in place."
      : "The visualizer first checks that the input is a non-empty rectangular numeric matrix.",
    actionKind: "parse",
    actionTone: validInput ? "sky" : "rose",
    codeLines: [1, 2],
    beginnerNote: validInput
      ? "Instead of extra arrays, the matrix stores row and column zero-markers inside itself."
      : "Set Matrix Zeroes needs a valid rectangular matrix before it can mark anything.",
    expertNote: validInput
      ? "The first row and first column compress the marker state down to O(1) auxiliary space."
      : "Irregular shape invalidates the row-marker and column-marker addressing scheme.",
    focus: validInput
      ? "Track first-row and first-column zeroes separately, then reuse those lanes as markers."
      : "Fix the matrix shape before replaying the trace.",
    hints: validInput
      ? [
          "The first row remembers which columns must become zero.",
          "The first column remembers which rows must become zero.",
          "The first row and first column need their own booleans because they also store markers.",
        ]
      : [
          "Use JSON arrays or new-line rows.",
          "Every row must have the same number of values.",
          "The matrix must contain numbers.",
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
        "The algorithm cannot place markers until the matrix has a valid shape.",
      expertNote:
        "Marker coordinates depend on a rectangular memory layout.",
      focus: "Input validation stopped the trace early.",
      hints: [
        "Try [[1,1,1],[1,0,1],[1,1,1]].",
        "Remove uneven rows.",
        "Replay after correcting the matrix.",
      ],
      done: true,
    });

    return trace;
  }

  firstRowZero = matrix[0].some((value) => value === 0);
  firstColZero = matrix.some((row) => row[0] === 0);
  message = `First row zero = ${firstRowZero}, first col zero = ${firstColZero}.`;

  pushStep({
    action: message,
    actionKind: "scan-first-lane",
    actionTone: "amber",
    codeLines: [1, 2],
    beginnerNote:
      "We snapshot the first row and first column up front because they will soon double as marker storage.",
    expertNote:
      "Separate booleans preserve the original zero-status of the two marker lanes after they are repurposed.",
    focus: "Protect the first row and first column before writing any markers into them.",
    hints: [
      `firstRowZero = ${firstRowZero}`,
      `firstColZero = ${firstColZero}`,
      "These booleans are applied near the end.",
    ],
    done: false,
  });

  for (let row = 1; row < matrix.length; row += 1) {
    for (let col = 1; col < matrix[0].length; col += 1) {
      if (matrix[row][col] !== 0) {
        continue;
      }

      phase = "mark-first-row-col";
      activeCell = { row, col };
      markerCell = { row, col: 0 };
      matrix[row][0] = 0;
      matrix[0][col] = 0;

      pushStep({
        action: `Found an inner zero at (${row}, ${col}), so mark row ${row} and column ${col} by writing zero into (${row}, 0) and (0, ${col}).`,
        actionKind: "mark",
        actionTone: "sky",
        codeLines: [3],
        beginnerNote:
          "A single interior zero causes its whole row and whole column to become zero later.",
        expertNote:
          "Marker writes defer the expensive zero-fill until all trigger rows and columns have been discovered.",
        focus:
          "Only the first cell of the row and the first cell of the column are needed as persistent marker bits.",
        hints: [
          `Current row markers: ${computeRowMarkers(matrix).join(", ") || "none"}.`,
          `Current column markers: ${computeColMarkers(matrix).join(", ") || "none"}.`,
          "Marker cells are not applied to the interior until the next phase.",
        ],
        done: false,
      });
    }
  }

  for (let row = 1; row < matrix.length; row += 1) {
    for (let col = 1; col < matrix[0].length; col += 1) {
      if (matrix[row][0] !== 0 && matrix[0][col] !== 0) {
        continue;
      }

      if (matrix[row][col] === 0) {
        continue;
      }

      phase = "zero-inner";
      activeCell = { row, col };
      markerCell = matrix[row][0] === 0 ? { row, col: 0 } : { row: 0, col };
      matrix[row][col] = 0;

      pushStep({
        action: `Cell (${row}, ${col}) becomes zero because ${
          markerCell.row === row
            ? `row ${row} is marked`
            : `column ${col} is marked`
        }.`,
        actionKind: "apply-marker",
        actionTone: "indigo",
        codeLines: [4],
        beginnerNote:
          "Any interior cell inherits zero if either its row marker or its column marker is zero.",
        expertNote:
          "Marker lanes encode the union of zero-triggered rows and columns, so a logical OR decides each interior cell.",
        focus:
          "The board is now replaying the stored marker information across the inner rectangle.",
        hints: [
          `Row markers: ${computeRowMarkers(matrix).join(", ") || "none"}.`,
          `Column markers: ${computeColMarkers(matrix).join(", ") || "none"}.`,
          `Matrix now: ${formatMatrix(matrix)}.`,
        ],
        done: false,
      });
    }
  }

  if (firstRowZero) {
    phase = "zero-first-row";
    activeCell = { row: 0, col: 0 };
    markerCell = { row: 0, col: 0 };
    for (let col = 0; col < matrix[0].length; col += 1) {
      matrix[0][col] = 0;
    }

    pushStep({
      action: "The first row originally contained a zero, so zero the entire first row now.",
      actionKind: "zero-first-row",
      actionTone: "amber",
      codeLines: [5],
      beginnerNote:
        "The first row was saved separately because it also stored column markers during the algorithm.",
      expertNote:
        "Applying the first-row flag last avoids destroying marker information before the inner cells were processed.",
      focus: "Deferred first-row zeroing protects marker fidelity until the interior replay is done.",
      hints: [
        "This step affects every cell in row 0.",
        "Column marker information has already been consumed.",
        `Matrix now: ${formatMatrix(matrix)}.`,
      ],
      done: false,
    });
  }

  if (firstColZero) {
    phase = "zero-first-col";
    activeCell = { row: 0, col: 0 };
    markerCell = { row: 0, col: 0 };
    for (let row = 0; row < matrix.length; row += 1) {
      matrix[row][0] = 0;
    }

    pushStep({
      action: "The first column originally contained a zero, so zero the entire first column now.",
      actionKind: "zero-first-col",
      actionTone: "amber",
      codeLines: [6],
      beginnerNote:
        "The first column is handled last for the same reason as the first row.",
      expertNote:
        "Deferring the first-column update prevents premature loss of row-marker information.",
      focus: "The last special-case lane is now finalized.",
      hints: [
        "This step affects every cell in column 0.",
        "All interior decisions have already been made.",
        `Matrix now: ${formatMatrix(matrix)}.`,
      ],
      done: false,
    });
  }

  phase = "done";
  activeCell = null;
  markerCell = null;
  result = cloneMatrix(matrix);
  message = `Zero propagation complete: ${formatMatrix(result)}.`;

  pushStep({
    action: message,
    actionKind: "complete",
    actionTone: "emerald",
    codeLines: [6],
    beginnerNote:
      "Every required row and column has now been turned into zeroes.",
    expertNote:
      "The first row and first column compressed the marker memory into the matrix itself, yielding O(mn) time and O(1) extra space.",
    focus: "All marker information has been fully applied.",
    hints: [
      `Final matrix: ${formatMatrix(result)}.`,
      "Rows and columns triggered by any zero are fully cleared.",
      "No auxiliary marker arrays were needed.",
    ],
    done: true,
  });

  return trace;
}
