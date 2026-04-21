export type Coord = {
  row: number;
  col: number;
};

export type MatrixSearchState = {
  inputMatrix: string;
  inputTarget: string;
  matrix: number[][];
  rows: number;
  cols: number;
  left: number;
  right: number;
  mid: number | null;
  midCoord: Coord | null;
  midValue: number | null;
  target: number | null;
  result: boolean | null;
  resultIndex: number | null;
  valid: boolean;
  message: string | null;
};

export type MatrixSearchPointers = {
  left: number | null;
  mid: number | null;
  right: number | null;
  cell: Coord | null;
};

export type MatrixSearchActionKind =
  | "parsed"
  | "invalid"
  | "choose-mid"
  | "move-left"
  | "move-right"
  | "found"
  | "done";

export type MatrixSearchTraceStep = {
  step: number;
  action: string;
  actionKind: MatrixSearchActionKind;
  codeLines: number[];
  state: MatrixSearchState;
  pointers: MatrixSearchPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function parseMatrixInput(rawInput: string) {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    if (
      Array.isArray(parsed) &&
      parsed.every(
        (row) =>
          Array.isArray(row) &&
          row.every((value) => typeof value === "number" || typeof value === "string")
      )
    ) {
      return parsed.map((row) => row.map((value) => Number(value)));
    }
  } catch {
    // Fall back to plain text parsing.
  }

  return trimmed
    .split(/\r?\n|\|/)
    .map((row) =>
      row
        .split(/[\s,]+/)
        .filter(Boolean)
        .map((value) => Number(value))
    )
    .filter((row) => row.length > 0);
}

function isRectangular(matrix: number[][]) {
  if (matrix.length === 0) {
    return false;
  }

  const cols = matrix[0].length;
  return cols > 0 && matrix.every((row) => row.length === cols && row.every(Number.isFinite));
}

function toCoord(index: number, cols: number): Coord {
  return {
    row: Math.floor(index / cols),
    col: index % cols,
  };
}

function cloneMatrix(matrix: number[][]) {
  return matrix.map((row) => [...row]);
}

export function formatCoord(coord: Coord | null) {
  if (!coord) {
    return "none";
  }

  return `(${coord.row}, ${coord.col})`;
}

export function generateTrace(
  rawMatrixInput: string,
  rawTargetInput: string
): MatrixSearchTraceStep[] {
  const matrix = parseMatrixInput(rawMatrixInput);
  const target = Number(rawTargetInput.trim());
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const valid = isRectangular(matrix) && Number.isFinite(target);

  const trace: MatrixSearchTraceStep[] = [];

  let left = 0;
  let right = valid ? rows * cols - 1 : -1;
  let mid: number | null = null;
  let midCoord: Coord | null = null;
  let midValue: number | null = null;
  let result: boolean | null = null;
  let resultIndex: number | null = null;
  let message: string | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: MatrixSearchActionKind;
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
        inputMatrix: rawMatrixInput,
        inputTarget: rawTargetInput,
        matrix: cloneMatrix(matrix),
        rows,
        cols,
        left,
        right,
        mid,
        midCoord: midCoord ? { ...midCoord } : null,
        midValue,
        target: Number.isFinite(target) ? target : null,
        result,
        resultIndex,
        valid,
        message,
      },
      pointers: {
        left: valid && left <= right ? left : valid ? left : null,
        mid,
        right: valid ? right : null,
        cell: midCoord ? { ...midCoord } : null,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      valid
        ? `Flatten the ${rows} x ${cols} matrix into one virtual sorted array and search for ${target}.`
        : "Parse the matrix and target before the binary search can begin.",
    actionKind: "parsed",
    codeLines: [1, 2, 3],
    done: false,
    explanationBeginner:
      valid
        ? "Even though the numbers are drawn in rows, binary search can treat the matrix like one long sorted list."
        : "The visualizer checks that the matrix is rectangular and that the target is a valid number first.",
    explanationExpert:
      valid
        ? "Because each row is sorted and every row starts after the previous row ends, the matrix is globally sorted under row-major indexing."
        : "Trace generation validates the preconditions needed for row-major binary search.",
  });

  if (!valid) {
    result = false;
    message =
      !Number.isFinite(target)
        ? "Enter a numeric target."
        : "Enter a rectangular matrix with at least one value in every row.";

    pushStep({
      action: message,
      actionKind: "invalid",
      codeLines: [1],
      done: true,
      explanationBeginner:
        "The search cannot run until both the matrix and target are valid.",
      explanationExpert:
        "An invalid matrix shape or non-numeric target breaks the indexing model, so the trace stops early.",
    });

    return trace;
  }

  while (left <= right) {
    mid = left + Math.floor((right - left) / 2);
    midCoord = toCoord(mid, cols);
    midValue = matrix[midCoord.row][midCoord.col];

    pushStep({
      action: `Choose middle flat index ${mid}, which maps to matrix${formatCoord(midCoord)} = ${midValue}.`,
      actionKind: "choose-mid",
      codeLines: [4, 5, 6],
      done: false,
      explanationBeginner:
        "The midpoint is picked from the current search window, then converted back into a row and column.",
      explanationExpert:
        "Row-major mapping uses row = mid / cols and col = mid % cols, preserving the sorted order from the virtual array.",
    });

    if (midValue === target) {
      result = true;
      resultIndex = mid;
      message = `Target ${target} is present in the matrix.`;

      pushStep({
        action: `matrix${formatCoord(midCoord)} matches the target ${target}, so the search succeeds.`,
        actionKind: "found",
        codeLines: [7],
        done: true,
        explanationBeginner:
          "The middle cell already holds the target, so there is nothing left to search.",
        explanationExpert:
          "The equality case terminates immediately because binary search has located the exact row-major index.",
      });

      return trace;
    }

    if (midValue < target) {
      left = mid + 1;

      pushStep({
        action: `${midValue} is too small, so discard the left half through flat index ${mid} and move left to ${left}.`,
        actionKind: "move-left",
        codeLines: [8],
        done: false,
        explanationBeginner:
          "Everything up to the midpoint is too small now, so the next search window starts just after it.",
        explanationExpert:
          "Since the virtual array is sorted, all indices <= mid are invalid once value < target, so l = mid + 1 preserves correctness.",
      });
      continue;
    }

    right = mid - 1;

    pushStep({
      action: `${midValue} is too large, so discard the right half from flat index ${mid} onward and move right to ${right}.`,
      actionKind: "move-right",
      codeLines: [9],
      done: false,
      explanationBeginner:
        "The midpoint and everything after it are too large, so the answer can only be earlier in the matrix.",
      explanationExpert:
        "When value > target, all indices >= mid are impossible, so r = mid - 1 keeps the invariant that the target, if present, remains inside [l, r].",
    });
  }

  result = false;
  mid = null;
  midCoord = null;
  midValue = null;
  message = `The target ${target} does not appear in the matrix.`;

  pushStep({
    action: `The window is empty because left = ${left} and right = ${right}. The target is not in the matrix.`,
    actionKind: "done",
    codeLines: [10],
    done: true,
    explanationBeginner:
      "Once the search window closes completely, the target cannot be anywhere else.",
    explanationExpert:
      "Loop termination with l > r proves the target is absent, giving O(log(rows * cols)) time and O(1) extra space.",
  });

  return trace;
}
