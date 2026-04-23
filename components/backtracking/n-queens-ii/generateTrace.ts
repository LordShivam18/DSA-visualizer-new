export type ConflictType = "column" | "diag-down" | "diag-up" | null;

export type NQueensFrame = {
  depth: number;
  row: number;
  placements: (number | null)[];
  status: "active" | "complete" | "backtracking";
};

export type NQueensState = {
  rawN: string;
  n: number;
  queenCols: (number | null)[];
  usedCols: number[];
  usedDiagDown: number[];
  usedDiagUp: number[];
  solutions: number;
  solutionBoards: number[][];
  stack: NQueensFrame[];
  exploredChoices: number;
};

export type NQueensPointers = {
  row: number | null;
  candidateCol: number | null;
  conflictType: ConflictType;
  depth: number;
};

export type NQueensActionKind =
  | "parsed"
  | "invalid"
  | "enter-row"
  | "test-col"
  | "reject-col"
  | "place-queen"
  | "complete"
  | "remove-queen"
  | "done";

export type NQueensTraceStep = {
  step: number;
  action: string;
  actionKind: NQueensActionKind;
  codeLines: number[];
  state: NQueensState;
  pointers: NQueensPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function parseCount(rawInput: string) {
  const trimmed = rawInput.trim();
  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed);
  }
  return 0;
}

function cloneStack(stack: NQueensFrame[]) {
  return stack.map((frame) => ({
    ...frame,
    placements: [...frame.placements],
  }));
}

export function parseNQueensInput(rawN: string) {
  return Math.max(0, parseCount(rawN));
}

export function formatPlacementBoard(placements: number[]) {
  return `[${placements.join(", ")}]`;
}

export function generateTrace(rawN: string): NQueensTraceStep[] {
  const n = parseNQueensInput(rawN);
  const queenCols = Array.from({ length: n }, () => null) as (number | null)[];
  const usedCols = new Set<number>();
  const usedDiagDown = new Set<number>();
  const usedDiagUp = new Set<number>();
  const solutionBoards: number[][] = [];
  const stack: NQueensFrame[] = [];
  const trace: NQueensTraceStep[] = [];

  let solutions = 0;
  let exploredChoices = 0;
  let rowPointer: number | null = 0;
  let candidateCol: number | null = null;
  let conflictType: ConflictType = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: NQueensActionKind;
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
        rawN,
        n,
        queenCols: [...queenCols],
        usedCols: [...usedCols].sort((left, right) => left - right),
        usedDiagDown: [...usedDiagDown].sort((left, right) => left - right),
        usedDiagUp: [...usedDiagUp].sort((left, right) => left - right),
        solutions,
        solutionBoards: solutionBoards.map((board) => [...board]),
        stack: cloneStack(stack),
        exploredChoices,
      },
      pointers: {
        row: rowPointer,
        candidateCol,
        conflictType,
        depth: stack.length,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action: `Parse n = ${n} and prepare the board plus the column and diagonal guards.`,
    actionKind: "parsed",
    codeLines: [1, 2, 3, 4, 5],
    done: false,
    explanationBeginner:
      "The search will try to place one queen in each row without letting queens attack each other.",
    explanationExpert:
      "Three constraint sets are enough: one for columns, one for `row - col`, and one for `row + col`.",
  });

  if (n === 0) {
    rowPointer = null;

    pushStep({
      action: "A board with size 0 has no valid queen placements to explore.",
      actionKind: "invalid",
      codeLines: [1, 24],
      done: true,
      explanationBeginner:
        "Without any rows or columns, there is no actual chessboard to solve.",
      explanationExpert:
        "The search space is empty when `n == 0`.",
    });

    return trace;
  }

  function dfs(row: number) {
    rowPointer = row;
    candidateCol = null;
    conflictType = null;

    const frame: NQueensFrame = {
      depth: stack.length,
      row,
      placements: [...queenCols],
      status: "active",
    };
    stack.push(frame);

    pushStep({
      action:
        row === n
          ? `All ${n} rows already contain safe queens, so one full solution has been formed.`
          : `Enter row ${row}. This row now tests each column for a safe queen placement.`,
      actionKind: "enter-row",
      codeLines: row === n ? [6, 7, 8] : [5, 6, 10],
      done: false,
      explanationBeginner:
        row === n
          ? "A full board is solved because every row already has one safe queen."
          : "Backtracking always works row by row, so only one queen is being placed right now.",
      explanationExpert:
        row === n
          ? "The base case is `row == n`, which means one complete non-attacking arrangement has been found."
          : "Row-by-row placement reduces branching because earlier rows fully determine all current column and diagonal constraints.",
    });

    if (row === n) {
      solutions += 1;
      solutionBoards.push(queenCols.map((value) => value ?? -1));
      frame.status = "complete";

      pushStep({
        action: `Increment the answer to ${solutions} because the current placement board is a complete non-attacking solution.`,
        actionKind: "complete",
        codeLines: [6, 7, 8],
        done: false,
        explanationBeginner:
          "This arrangement is saved because no queen attacks any other queen on the board.",
        explanationExpert:
          "The solver counts solutions only at the base case; it does not need to copy or inspect any further rows.",
      });

      stack.pop();
      rowPointer = row - 1 >= 0 ? row - 1 : 0;
      candidateCol = null;
      conflictType = null;
      return;
    }

    for (let col = 0; col < n; col += 1) {
      exploredChoices += 1;
      rowPointer = row;
      candidateCol = col;
      conflictType = null;

      pushStep({
        action: `Test row ${row}, col ${col} as the next queen position.`,
        actionKind: "test-col",
        codeLines: [10, 11],
        done: false,
        explanationBeginner:
          "The solver checks whether this square is attacked by any earlier queen.",
        explanationExpert:
          "Safety is decided in O(1) time by consulting the column and diagonal sets.",
      });

      if (usedCols.has(col)) {
        conflictType = "column";
        pushStep({
          action: `Reject row ${row}, col ${col} because another queen already owns column ${col}.`,
          actionKind: "reject-col",
          codeLines: [11],
          done: false,
          explanationBeginner:
            "Two queens in the same column would attack each other vertically.",
          explanationExpert:
            "A column conflict is detected directly from `usedCols`.",
        });
        continue;
      }

      if (usedDiagDown.has(row - col)) {
        conflictType = "diag-down";
        pushStep({
          action: `Reject row ${row}, col ${col} because diagonal row-col = ${row - col} is already occupied.`,
          actionKind: "reject-col",
          codeLines: [11],
          done: false,
          explanationBeginner:
            "A queen on the same top-left to bottom-right diagonal would attack this square.",
          explanationExpert:
            "Main diagonals share the invariant `row - col`, so a collision there is immediate.",
        });
        continue;
      }

      if (usedDiagUp.has(row + col)) {
        conflictType = "diag-up";
        pushStep({
          action: `Reject row ${row}, col ${col} because diagonal row+col = ${row + col} is already occupied.`,
          actionKind: "reject-col",
          codeLines: [11],
          done: false,
          explanationBeginner:
            "A queen on the same bottom-left to top-right diagonal would attack this square.",
          explanationExpert:
            "Anti-diagonals share the invariant `row + col`, so a collision there is immediate.",
        });
        continue;
      }

      queenCols[row] = col;
      usedCols.add(col);
      usedDiagDown.add(row - col);
      usedDiagUp.add(row + col);
      frame.placements = [...queenCols];
      conflictType = null;

      pushStep({
        action: `Place a queen at row ${row}, col ${col}, then recurse to the next row.`,
        actionKind: "place-queen",
        codeLines: [12, 13, 14, 15, 16],
        done: false,
        explanationBeginner:
          "This square is safe, so the queen is placed and the search continues one row lower.",
        explanationExpert:
          "The placement updates all three guard sets before recurring to `row + 1`.",
      });

      dfs(row + 1);

      usedCols.delete(col);
      usedDiagDown.delete(row - col);
      usedDiagUp.delete(row + col);
      queenCols[row] = null;
      frame.status = "backtracking";
      frame.placements = [...queenCols];
      rowPointer = row;
      candidateCol = col;
      conflictType = null;

      pushStep({
        action: `Remove the queen from row ${row}, col ${col} so this row can try the next column.`,
        actionKind: "remove-queen",
        codeLines: [17, 18, 19, 20],
        done: false,
        explanationBeginner:
          "The placement is undone because every branch beneath it has already been explored.",
        explanationExpert:
          "Backtracking restores the exact caller constraints before the loop advances.",
      });

      frame.status = "active";
    }

    stack.pop();
    rowPointer = row - 1 >= 0 ? row - 1 : 0;
    candidateCol = null;
    conflictType = null;
  }

  dfs(0);
  rowPointer = null;
  candidateCol = null;
  conflictType = null;

  pushStep({
    action: `The search has finished exploring every safe row-by-row placement. Total solutions: ${solutions}.`,
    actionKind: "done",
    codeLines: [23, 24],
    done: true,
    explanationBeginner:
      "Every legal queen arrangement has been counted, and the final answer is ready.",
    explanationExpert:
      "Backtracking prunes unsafe placements immediately, which is why N-Queens is practical despite its exponential search space.",
  });

  return trace;
}
