import {
  cloneMatrix,
  isRectangular,
  parseStringMatrix,
} from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type Coord = {
  row: number;
  col: number;
};

type ConflictKind = "row" | "column" | "box" | null;

export type ValidSudokuTraceStep = TeachingTraceFrame & {
  state: {
    board: string[][];
    validInput: boolean;
    message: string | null;
    currentCell: Coord | null;
    currentValue: string | null;
    boxIndex: number | null;
    filledCells: number;
    processedCells: number;
    validatedKeys: string[];
    rowSeen: string[];
    colSeen: string[];
    boxSeen: string[];
    conflictKind: ConflictKind;
    result: boolean | null;
  };
};

function isValidCellValue(value: string) {
  return value === "." || /^[1-9]$/.test(value);
}

function normalizeBoard(rawBoard: string[][]) {
  return rawBoard.map((row) => row.map((value) => value.trim()));
}

function keyOf(row: number, col: number) {
  return `${row}:${col}`;
}

function boxIndexOf(row: number, col: number) {
  return Math.floor(row / 3) * 3 + Math.floor(col / 3);
}

function formatDigits(values: Iterable<string>) {
  const list = [...values];
  return list.length > 0 ? list.join(", ") : "empty";
}

export function generateTrace(rawBoard: string) {
  const parsedBoard = normalizeBoard(parseStringMatrix(rawBoard));
  const validInput =
    parsedBoard.length === 9 &&
    isRectangular(parsedBoard) &&
    parsedBoard.every((row) => row.length === 9 && row.every(isValidCellValue));

  const board = validInput
    ? parsedBoard
    : Array.from({ length: 9 }, (_, row) =>
        Array.from({ length: 9 }, (_, col) => parsedBoard[row]?.[col] ?? ".")
      );

  const filledCells = board.flat().filter((value) => value !== ".").length;
  const rows = Array.from({ length: 9 }, () => new Set<string>());
  const cols = Array.from({ length: 9 }, () => new Set<string>());
  const boxes = Array.from({ length: 9 }, () => new Set<string>());
  const validatedKeys = new Set<string>();

  let currentCell: Coord | null = null;
  let currentValue: string | null = null;
  let currentBox: number | null = null;
  let processedCells = 0;
  let rowSeen = "empty";
  let colSeen = "empty";
  let boxSeen = "empty";
  let conflictKind: ConflictKind = null;
  let result: boolean | null = null;
  let message: string | null = null;

  const trace: ValidSudokuTraceStep[] = [];

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
  }: Omit<ValidSudokuTraceStep, "step" | "state" | "metrics" | "pointerChips">) {
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
        { label: "Filled", value: filledCells, tone: "amber" },
        { label: "Processed", value: processedCells, tone: "sky" },
        { label: "Remaining", value: Math.max(filledCells - processedCells, 0), tone: "emerald" },
      ],
      pointerChips: [
        { label: "cell", value: currentCell ? `(${currentCell.row}, ${currentCell.col})` : "none", tone: "sky" },
        { label: "digit", value: currentValue ?? "-", tone: "amber" },
        { label: "box", value: currentBox !== null ? String(currentBox) : "-", tone: "indigo" },
      ],
      done,
      state: {
        board: cloneMatrix(board),
        validInput,
        message,
        currentCell: currentCell ? { ...currentCell } : null,
        currentValue,
        boxIndex: currentBox,
        filledCells,
        processedCells,
        validatedKeys: [...validatedKeys],
        rowSeen: rowSeen === "empty" ? [] : rowSeen.split(", "),
        colSeen: colSeen === "empty" ? [] : colSeen.split(", "),
        boxSeen: boxSeen === "empty" ? [] : boxSeen.split(", "),
        conflictKind,
        result,
      },
    });
  }

  pushStep({
    action: validInput
      ? "Scan the board left-to-right and validate each filled digit against its row, column, and 3 x 3 box."
      : "The visualizer first checks that the input is a 9 x 9 board made of digits 1-9 or dots.",
    actionKind: "parse",
    actionTone: validInput ? "sky" : "rose",
    codeLines: [1, 2],
    beginnerNote: validInput
      ? "Only the filled cells matter. Empty dots are skipped."
      : "Sudoku validation only works on a clean 9 x 9 board input.",
    expertNote: validInput
      ? "Each filled digit must be unique across three independent constraint sets: row, column, and box."
      : "Invalid shape or tokens break the constraint model before validation can begin.",
    focus: validInput
      ? "Prepare three families of sets so each new digit can be checked in O(1)."
      : "Fix the board shape or cell values before replaying the trace.",
    hints: validInput
      ? [
          "Row sets catch horizontal duplicates.",
          "Column sets catch vertical duplicates.",
          "Box sets catch duplicates inside 3 x 3 regions.",
        ]
      : [
          "Provide exactly 9 rows.",
          "Each row must contain exactly 9 values.",
          'Allowed values are ".", "1", ..., "9".',
        ],
    done: false,
  });

  if (!validInput) {
    result = false;
    message =
      'Enter a 9 x 9 board using digits "1" to "9" and "." for blanks.';

    pushStep({
      action: message,
      actionKind: "input-error",
      actionTone: "rose",
      codeLines: [1],
      beginnerNote:
        "The board must be a proper 9 x 9 Sudoku layout before we can test any rules.",
      expertNote:
        "Constraint validation assumes a fixed 9 x 9 lattice with valid cell symbols.",
      focus: "Input validation stopped the run early.",
      hints: [
        "JSON input like [[\"5\",\"3\",\".\"], ...] is supported.",
        "Plain text rows also work when each row has 9 entries.",
        "Replay after correcting the board shape or symbols.",
      ],
      done: true,
    });

    return trace;
  }

  for (let row = 0; row < 9; row += 1) {
    for (let col = 0; col < 9; col += 1) {
      const value = board[row][col];
      if (value === ".") {
        continue;
      }

      currentCell = { row, col };
      currentValue = value;
      currentBox = boxIndexOf(row, col);
      rowSeen = formatDigits(rows[row]);
      colSeen = formatDigits(cols[col]);
      boxSeen = formatDigits(boxes[currentBox]);
      conflictKind = null;

      pushStep({
        action: `Inspect digit ${value} at (${row}, ${col}) by checking row ${row}, column ${col}, and box ${currentBox}.`,
        actionKind: "check-cell",
        actionTone: "sky",
        codeLines: [3, 4, 5],
        beginnerNote:
          "Before adding the digit anywhere, ask whether that same digit is already visible in one of the three required regions.",
        expertNote:
          "A cell is legal only if its value is absent from the row, column, and box sets that summarize previously processed cells.",
        focus:
          "The active cell is compared against three constraint ledgers without modifying the board yet.",
        hints: [
          `Row ${row} currently has: ${rowSeen}.`,
          `Column ${col} currently has: ${colSeen}.`,
          `Box ${currentBox} currently has: ${boxSeen}.`,
        ],
        done: false,
      });

      if (rows[row].has(value)) {
        conflictKind = "row";
      } else if (cols[col].has(value)) {
        conflictKind = "column";
      } else if (boxes[currentBox].has(value)) {
        conflictKind = "box";
      }

      if (conflictKind) {
        result = false;
        message = `Digit ${value} repeats in the ${conflictKind}. The board is invalid.`;

        pushStep({
          action: message,
          actionKind: "conflict",
          actionTone: "rose",
          codeLines: [6, 7, 8],
          beginnerNote:
            "The moment one duplicate appears, the whole Sudoku board fails validation.",
          expertNote:
            "A repeated digit violates the uniqueness invariant for that constraint set, so the algorithm can terminate early.",
          focus:
            "The highlighted region already contained the same digit before this cell was processed.",
          hints: [
            "A row conflict means two equal digits share the same horizontal line.",
            "A column conflict means two equal digits share the same vertical line.",
            "A box conflict means the duplicate sits inside the same 3 x 3 sub-grid.",
          ],
          done: true,
        });

        return trace;
      }

      rows[row].add(value);
      cols[col].add(value);
      boxes[currentBox].add(value);
      validatedKeys.add(keyOf(row, col));
      processedCells += 1;
      rowSeen = formatDigits(rows[row]);
      colSeen = formatDigits(cols[col]);
      boxSeen = formatDigits(boxes[currentBox]);

      pushStep({
        action: `Digit ${value} is safe, so record it in row ${row}, column ${col}, and box ${currentBox}.`,
        actionKind: "accept",
        actionTone: "emerald",
        codeLines: [9, 10],
        beginnerNote:
          "Because no duplicate was found, this digit becomes part of the seen-history for all three regions.",
        expertNote:
          "Persisting the digit in the three sets preserves the prefix invariant for every later cell in the scan order.",
        focus:
          "Accepted cells become validated anchors for future duplicate checks.",
        hints: [
          `Updated row ${row}: ${rowSeen}.`,
          `Updated column ${col}: ${colSeen}.`,
          `Updated box ${currentBox}: ${boxSeen}.`,
        ],
        done: false,
      });
    }
  }

  currentCell = null;
  currentValue = null;
  currentBox = null;
  conflictKind = null;
  rowSeen = "empty";
  colSeen = "empty";
  boxSeen = "empty";
  result = true;
  message = "Every filled cell satisfied all Sudoku constraints.";

  pushStep({
    action: message,
    actionKind: "complete",
    actionTone: "emerald",
    codeLines: [11],
    beginnerNote:
      "The scan finished without finding any duplicates, so the board is valid.",
    expertNote:
      "All processed digits preserved uniqueness across rows, columns, and boxes, which proves the board is valid.",
    focus: "A full pass with no conflicts means the board satisfies all local constraints.",
    hints: [
      "A valid partial Sudoku does not need to be solvable.",
      "Only filled cells are checked.",
      "The algorithm runs in one pass over the 81 cells.",
    ],
    done: true,
  });

  return trace;
}
