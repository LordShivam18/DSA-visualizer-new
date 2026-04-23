export type Coord = {
  row: number;
  col: number;
};

export type WordSearchFrame = {
  depth: number;
  cell: Coord;
  index: number;
  char: string;
  path: Coord[];
  status: "active" | "success" | "backtracking";
};

export type WordSearchState = {
  rawBoard: string;
  rawWord: string;
  board: string[][];
  word: string;
  rows: number;
  cols: number;
  path: Coord[];
  successfulPath: Coord[];
  deadEndCells: Coord[];
  testedStarts: Coord[];
  stack: WordSearchFrame[];
  exploredMoves: number;
  found: boolean | null;
};

export type WordSearchPointers = {
  current: Coord | null;
  neighbor: Coord | null;
  wordIndex: number | null;
  expectedChar: string | null;
  direction: "up" | "down" | "left" | "right" | null;
  depth: number;
};

export type WordSearchActionKind =
  | "parsed"
  | "empty"
  | "scan-start"
  | "reject-start"
  | "enter-cell"
  | "explore-neighbor"
  | "mismatch"
  | "success"
  | "backtrack"
  | "done";

export type WordSearchTraceStep = {
  step: number;
  action: string;
  actionKind: WordSearchActionKind;
  codeLines: number[];
  state: WordSearchState;
  pointers: WordSearchPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

type Direction = {
  name: "up" | "down" | "left" | "right";
  dr: number;
  dc: number;
};

const directions: Direction[] = [
  { name: "up", dr: -1, dc: 0 },
  { name: "down", dr: 1, dc: 0 },
  { name: "left", dr: 0, dc: -1 },
  { name: "right", dr: 0, dc: 1 },
];

function normalizeBoard(board: string[][]) {
  const width = Math.max(...board.map((row) => row.length), 0);
  return board.map((row) =>
    Array.from({ length: width }, (_, index) => row[index] ?? "")
  );
}

function parseBoardFromJson(value: unknown) {
  if (!Array.isArray(value)) {
    return null;
  }

  if (value.every((item) => typeof item === "string")) {
    return normalizeBoard(
      value.map((row) =>
        String(row)
          .split("")
          .map((char) => char.toUpperCase())
          .filter((char) => /^[A-Z]$/.test(char))
      )
    );
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
          .map((cell) => cell.replace(/[^A-Z]/g, ""))
          .map((cell) => (cell.length > 0 ? cell[0] : ""))
      )
    );
  }

  return null;
}

export function parseBoardInput(rawBoard: string) {
  const trimmed = rawBoard.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    const fromJson = parseBoardFromJson(parsed);
    if (fromJson) {
      return fromJson;
    }
  } catch {
    // Fallback below.
  }

  return normalizeBoard(
    trimmed
      .split(/\r?\n|\|/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const tokens = line.split(/[\s,]+/).filter((token) => token.length > 0);
        const source = tokens.length > 1 ? tokens : line.split("");
        return source
          .map((token) => token.replace(/[^A-Za-z]/g, "").toUpperCase())
          .filter((token) => token.length > 0)
          .map((token) => token[0]);
      })
  );
}

export function parseWordInput(rawWord: string) {
  return rawWord.replace(/[^A-Za-z]/g, "").toUpperCase();
}

function cloneCoords(coords: Coord[]) {
  return coords.map((coord) => ({ ...coord }));
}

function cloneStack(stack: WordSearchFrame[]) {
  return stack.map((frame) => ({
    ...frame,
    cell: { ...frame.cell },
    path: cloneCoords(frame.path),
  }));
}

function keyOf(coord: Coord) {
  return `${coord.row}-${coord.col}`;
}

function addUniqueCoord(collection: Coord[], coord: Coord) {
  if (!collection.some((item) => item.row === coord.row && item.col === coord.col)) {
    collection.push({ ...coord });
  }
}

function isInside(board: string[][], row: number, col: number) {
  return row >= 0 && col >= 0 && row < board.length && col < (board[0]?.length ?? 0);
}

export function formatCoord(coord: Coord | null) {
  if (!coord) {
    return "none";
  }
  return `(${coord.row}, ${coord.col})`;
}

export function formatPath(coords: Coord[]) {
  if (coords.length === 0) {
    return "[]";
  }
  return `[${coords.map((coord) => `(${coord.row},${coord.col})`).join(" -> ")}]`;
}

export function formatWordSearchResult(value: boolean | null) {
  if (value === null) {
    return "searching";
  }
  return value ? "true" : "false";
}

export function generateTrace(
  rawBoard: string,
  rawWord: string
): WordSearchTraceStep[] {
  const board = parseBoardInput(rawBoard);
  const word = parseWordInput(rawWord);
  const rows = board.length;
  const cols = board[0]?.length ?? 0;
  const path: Coord[] = [];
  const successfulPath: Coord[] = [];
  const deadEndCells: Coord[] = [];
  const testedStarts: Coord[] = [];
  const stack: WordSearchFrame[] = [];
  const trace: WordSearchTraceStep[] = [];
  const visited = new Set<string>();

  let exploredMoves = 0;
  let found: boolean | null = null;
  let current: Coord | null = null;
  let neighbor: Coord | null = null;
  let wordIndex: number | null = 0;
  let expectedChar: string | null = word[0] ?? null;
  let direction: "up" | "down" | "left" | "right" | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: WordSearchActionKind;
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
        rawBoard,
        rawWord,
        board: board.map((row) => [...row]),
        word,
        rows,
        cols,
        path: cloneCoords(path),
        successfulPath: cloneCoords(successfulPath),
        deadEndCells: cloneCoords(deadEndCells),
        testedStarts: cloneCoords(testedStarts),
        stack: cloneStack(stack),
        exploredMoves,
        found,
      },
      pointers: {
        current: current ? { ...current } : null,
        neighbor: neighbor ? { ...neighbor } : null,
        wordIndex,
        expectedChar,
        direction,
        depth: stack.length,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      rows === 0 || cols === 0
        ? "Parse the grid, but there are no usable cells to search."
        : `Parse the ${rows} x ${cols} board and target word "${word}".`,
    actionKind: "parsed",
    codeLines: [1, 2, 3],
    done: false,
    explanationBeginner:
      rows === 0 || cols === 0
        ? "An empty board cannot spell any non-empty word."
        : "The search will try matching the word one character at a time by walking up, down, left, or right.",
    explanationExpert:
      rows === 0 || cols === 0
        ? "The empty-board edge case terminates immediately."
        : "DFS state is `(row, col, index)` plus a visited set for the active path.",
  });

  if (rows === 0 || cols === 0 || word.length === 0) {
    found = word.length === 0;
    current = null;
    neighbor = null;
    wordIndex = null;
    expectedChar = null;
    direction = null;

    pushStep({
      action:
        word.length === 0
          ? "The target word is empty, so it is trivially present."
          : "The board is empty, so the target word cannot be formed.",
      actionKind: "empty",
      codeLines: [1, 20],
      done: true,
      explanationBeginner:
        word.length === 0
          ? "An empty word does not need any cells."
          : "Without cells, there is nowhere to build the word from.",
      explanationExpert:
        word.length === 0
          ? "The empty-string query is a trivial success."
          : "No DFS root exists when the board has zero cells.",
    });

    return trace;
  }

  function dfs(row: number, col: number, index: number): boolean {
    current = { row, col };
    neighbor = null;
    wordIndex = index;
    expectedChar = word[index];
    direction = null;

    path.push({ row, col });
    visited.add(keyOf({ row, col }));

    const frame: WordSearchFrame = {
      depth: stack.length,
      cell: { row, col },
      index,
      char: board[row][col],
      path: cloneCoords(path),
      status: "active",
    };
    stack.push(frame);

    pushStep({
      action: `Enter cell ${formatCoord(current)}. It matches word[${index}] = "${word[index]}".`,
      actionKind: "enter-cell",
      codeLines: [4, 5, 6, 7],
      done: false,
      explanationBeginner:
        "This cell matches the needed character, so it joins the active path.",
      explanationExpert:
        "The cell is marked visited as soon as it is accepted, preserving the no-reuse invariant for the branch.",
    });

    if (index === word.length - 1) {
      successfulPath.splice(0, successfulPath.length, ...cloneCoords(path));
      found = true;
      frame.status = "success";

      pushStep({
        action: `Matched the final character at ${formatCoord(current)}, so the full word "${word}" has been found.`,
        actionKind: "success",
        codeLines: [6],
        done: false,
        explanationBeginner:
          "Because this was the last needed character, the search succeeds immediately.",
        explanationExpert:
          "The base case fires when `index == word.size() - 1`, allowing short-circuit success.",
      });

      return true;
    }

    for (const nextDirection of directions) {
      exploredMoves += 1;
      const nextRow = row + nextDirection.dr;
      const nextCol = col + nextDirection.dc;
      neighbor = { row: nextRow, col: nextCol };
      expectedChar = word[index + 1] ?? null;
      direction = nextDirection.name;

      pushStep({
        action: `Explore ${nextDirection.name} from ${formatCoord(current)} toward ${formatCoord(neighbor)} looking for "${expectedChar}".`,
        actionKind: "explore-neighbor",
        codeLines: [8, 9, 10],
        done: false,
        explanationBeginner:
          "The search checks one neighboring cell to see whether it can continue the word.",
        explanationExpert:
          "Each DFS frame branches over the four orthogonal moves allowed by the problem.",
      });

      if (!isInside(board, nextRow, nextCol)) {
        pushStep({
          action: `${formatCoord(neighbor)} is outside the board, so that direction cannot continue the word.`,
          actionKind: "mismatch",
          codeLines: [10],
          done: false,
          explanationBeginner:
            "Moving off the grid is never a valid next step.",
          explanationExpert:
            "Out-of-bounds coordinates fail before any recursive call is attempted.",
        });
        continue;
      }

      if (visited.has(keyOf({ row: nextRow, col: nextCol }))) {
        pushStep({
          action: `${formatCoord(neighbor)} is already on the current path, so it cannot be reused.`,
          actionKind: "mismatch",
          codeLines: [5, 10],
          done: false,
          explanationBeginner:
            "The same board cell cannot be used twice in one word path.",
          explanationExpert:
            "The visited guard enforces the path-simple constraint required by the problem.",
        });
        continue;
      }

      if (board[nextRow][nextCol] !== word[index + 1]) {
        pushStep({
          action: `${formatCoord(neighbor)} contains "${board[nextRow][nextCol] || " "}" instead of "${word[index + 1]}".`,
          actionKind: "mismatch",
          codeLines: [5, 10],
          done: false,
          explanationBeginner:
            "The neighbor does not match the next needed character, so this direction fails.",
          explanationExpert:
            "Character mismatch prevents the recursive state from advancing to `index + 1`.",
        });
        continue;
      }

      if (dfs(nextRow, nextCol, index + 1)) {
        frame.status = "success";
        return true;
      }
    }

    visited.delete(keyOf({ row, col }));
    path.pop();
    addUniqueCoord(deadEndCells, { row, col });
    current = { row, col };
    neighbor = null;
    wordIndex = index;
    expectedChar = word[index];
    direction = null;
    frame.status = "backtracking";

    pushStep({
      action: `Backtrack from ${formatCoord(current)} because no neighbor could continue the word from this cell.`,
      actionKind: "backtrack",
      codeLines: [12, 13],
      done: false,
      explanationBeginner:
        "This path segment is a dead end, so the search removes the cell and returns to the previous one.",
      explanationExpert:
        "Unmarking the cell restores it for other branches that may reach it from a different path.",
    });

    stack.pop();
    current = path[path.length - 1] ?? null;
    wordIndex = path.length === 0 ? 0 : path.length - 1;
    expectedChar = current ? word[wordIndex] : word[0];
    return false;
  }

  outer: for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      current = { row, col };
      neighbor = null;
      wordIndex = 0;
      expectedChar = word[0];
      direction = null;
      addUniqueCoord(testedStarts, { row, col });

      pushStep({
        action: `Try ${formatCoord(current)} as a start cell for the word "${word}".`,
        actionKind: "scan-start",
        codeLines: [15, 16, 17],
        done: false,
        explanationBeginner:
          "The outer loop checks whether this cell could be the first letter of the word.",
        explanationExpert:
          "Every board position is a potential DFS root for `index = 0`.",
      });

      if (board[row][col] !== word[0]) {
        pushStep({
          action: `${formatCoord(current)} contains "${board[row][col] || " "}", so it cannot start the word.`,
          actionKind: "reject-start",
          codeLines: [17],
          done: false,
          explanationBeginner:
            "If the first letter does not match, the search skips this start immediately.",
          explanationExpert:
            "The top-level loop still relies on the same first-character guard as recursive calls.",
        });
        continue;
      }

      if (dfs(row, col, 0)) {
        break outer;
      }
    }
  }

  if (found !== true) {
    found = false;
    current = null;
    neighbor = null;
    wordIndex = null;
    expectedChar = null;
    direction = null;
  } else {
    current = successfulPath[successfulPath.length - 1] ?? null;
    neighbor = null;
    wordIndex = successfulPath.length - 1;
    expectedChar =
      wordIndex !== null && wordIndex >= 0 ? word[wordIndex] ?? null : null;
    direction = null;
  }

  pushStep({
    action:
      found
        ? `The word "${word}" exists in the board.`
        : `The search exhausted every start cell and branch without spelling "${word}".`,
    actionKind: "done",
    codeLines: found ? [17] : [20],
    done: true,
    explanationBeginner: found
      ? "A full path matched every character in order, so the answer is true."
      : "No path could spell the whole word, so the answer is false.",
    explanationExpert: found
      ? "DFS short-circuited on the first successful witness path."
      : "The solver explored all reachable simple paths that matched prefixes of the target word and found no witness.",
  });

  return trace;
}
