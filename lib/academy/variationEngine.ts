import type { Problem } from "./problemRegistry";

export type ReplayVariationKind = "edge" | "random" | "mutation";

export type ReplayVariation = {
  id: string;
  label: string;
  kind: ReplayVariationKind;
  summary: string;
  values: Record<string, string>;
};

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(items: T[]) {
  return items[randomInt(0, items.length - 1)];
}

function parseNumberList(raw: string) {
  return raw.match(/-?\d+/g)?.map(Number) ?? [];
}

function stringifyNumberList(values: number[]) {
  return `[${values.join(",")}]`;
}

function randomUppercaseString(length: number) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return Array.from({ length }, () => alphabet[randomInt(0, alphabet.length - 1)]).join(
    ""
  );
}

function sanitizeLetters(raw: string) {
  return raw.replace(/[^A-Za-z]/g, "").toUpperCase();
}

function buildStockIIReplayVariations(
  inputs: Record<string, string>
): ReplayVariation[] {
  const base = parseNumberList(inputs.prices ?? "");
  const mutationSeed = base.length > 0 ? [...base] : [7, 1, 5, 3, 6, 4];
  const mutationIndex = Math.min(Math.max(1, mutationSeed.length - 1), 4);
  mutationSeed.splice(mutationIndex, 0, mutationSeed[mutationIndex - 1]);

  return [
    {
      id: "stock-edge",
      label: "Edge case",
      kind: "edge",
      summary: "Use a descending market to prove that the accumulator should stay at zero.",
      values: {
        prices: "[9,7,4,3,1]",
      },
    },
    {
      id: "stock-random",
      label: "Random case",
      kind: "random",
      summary: "Generate a fresh price walk and replay the same greedy invariant.",
      values: {
        prices: stringifyNumberList(
          Array.from({ length: randomInt(5, 8) }, () => randomInt(1, 9))
        ),
      },
    },
    {
      id: "stock-mutation",
      label: "Mutate current",
      kind: "mutation",
      summary: "Insert a flat plateau into the current series and verify that non-positive deltas are ignored.",
      values: {
        prices: stringifyNumberList(mutationSeed),
      },
    },
  ];
}

function buildZigzagReplayVariations(
  inputs: Record<string, string>
): ReplayVariation[] {
  const source = sanitizeLetters(inputs.s ?? "") || "PAYPALISHIRING";
  const rows = Math.max(1, Number.parseInt(inputs.numRows ?? "3", 10) || 3);

  return [
    {
      id: "zigzag-edge",
      label: "Edge case",
      kind: "edge",
      summary: "Force the one-row identity case so the routing loop short-circuits.",
      values: {
        s: source.slice(0, Math.max(1, Math.min(source.length, 4))),
        numRows: "1",
      },
    },
    {
      id: "zigzag-random",
      label: "Random case",
      kind: "random",
      summary: "Create a new string and row count to test the bounce pattern from scratch.",
      values: {
        s: randomUppercaseString(randomInt(6, 10)),
        numRows: String(randomInt(2, 5)),
      },
    },
    {
      id: "zigzag-mutation",
      label: "Mutate current",
      kind: "mutation",
      summary: "Keep the same characters but change the bounce depth by one row.",
      values: {
        s: source,
        numRows: String(Math.max(1, Math.min(source.length, rows + (rows > 2 ? -1 : 1)))),
      },
    },
  ];
}

function boardToInput(board: string[][]) {
  return board.map((row) => row.join(" ")).join("\n");
}

function emptyLetterBoard(rows: number, cols: number) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () =>
      String.fromCharCode(65 + randomInt(0, 25))
    )
  );
}

function randomWalkWordBoard(rows: number, cols: number, wordLength: number) {
  const board = emptyLetterBoard(rows, cols);
  const visited = new Set<string>();
  const path: Array<{ row: number; col: number }> = [];
  let row = randomInt(0, rows - 1);
  let col = randomInt(0, cols - 1);

  for (let index = 0; index < wordLength; index += 1) {
    path.push({ row, col });
    visited.add(`${row}:${col}`);

    if (index === wordLength - 1) {
      break;
    }

    const neighbors = [
      { row: row - 1, col },
      { row: row + 1, col },
      { row, col: col - 1 },
      { row, col: col + 1 },
    ].filter(
      (candidate) =>
        candidate.row >= 0 &&
        candidate.col >= 0 &&
        candidate.row < rows &&
        candidate.col < cols &&
        !visited.has(`${candidate.row}:${candidate.col}`)
    );

    if (neighbors.length === 0) {
      return randomWalkWordBoard(rows, cols, wordLength);
    }

    const next = pick(neighbors);
    row = next.row;
    col = next.col;
  }

  const word = randomUppercaseString(wordLength);
  path.forEach((cell, index) => {
    board[cell.row][cell.col] = word[index];
  });

  return {
    board,
    word,
  };
}

function buildWordSearchReplayVariations(
  inputs: Record<string, string>
): ReplayVariation[] {
  const currentWord = sanitizeLetters(inputs.word ?? "") || "ABCCED";
  const randomCase = randomWalkWordBoard(4, 4, randomInt(4, 6));
  const impossibleWord = `${currentWord.slice(0, Math.max(1, currentWord.length - 1))}Z`;

  return [
    {
      id: "word-search-edge",
      label: "Edge case",
      kind: "edge",
      summary: "Reduce the board to a single cell so the DFS base case becomes obvious.",
      values: {
        board: "A",
        word: "A",
      },
    },
    {
      id: "word-search-random",
      label: "Random case",
      kind: "random",
      summary: "Generate a fresh board with one hidden witness path and search for it.",
      values: {
        board: boardToInput(randomCase.board),
        word: randomCase.word,
      },
    },
    {
      id: "word-search-mutation",
      label: "Mutate current",
      kind: "mutation",
      summary: "Change only the last character so the search explores the same prefix but fails at the boundary.",
      values: {
        board: inputs.board ?? "A B C E\nS F C S\nA D E E",
        word: impossibleWord,
      },
    },
  ];
}

function buildGenericArrayVariations(
  inputKey: string,
  inputs: Record<string, string>
): ReplayVariation[] {
  const base = parseNumberList(inputs[inputKey] ?? "");

  if (base.length === 0) {
    return [];
  }

  const ascending = [...base].sort((left, right) => left - right);
  const mutated = [...base];
  mutated.splice(Math.min(mutated.length, 2), 0, randomInt(0, 9));

  return [
    {
      id: `${inputKey}-edge`,
      label: "Edge case",
      kind: "edge",
      summary: "Strip the input down to a tiny boundary case before replaying the invariant.",
      values: {
        [inputKey]: stringifyNumberList(base.slice(0, Math.max(1, Math.min(base.length, 2)))),
      },
    },
    {
      id: `${inputKey}-random`,
      label: "Random case",
      kind: "random",
      summary: "Swap in a fresh random array and pressure-test the same reasoning pattern.",
      values: {
        [inputKey]: stringifyNumberList(
          Array.from({ length: randomInt(4, 7) }, () => randomInt(0, 9))
        ),
      },
    },
    {
      id: `${inputKey}-mutation`,
      label: "Mutate current",
      kind: "mutation",
      summary: "Reorder or extend the current input just enough to see whether the same invariant still holds.",
      values: {
        [inputKey]: stringifyNumberList(
          Math.random() > 0.5 ? ascending : mutated
        ),
      },
    },
  ];
}

export function buildReplayVariations(
  problem: Problem,
  inputs: Record<string, string>,
  defaultInputs: Record<string, string>
): ReplayVariation[] {
  const mergedInputs = { ...defaultInputs, ...inputs };

  if (problem.id === "array-string:best-time-to-buy-and-sell-stock-ii") {
    return buildStockIIReplayVariations(mergedInputs);
  }

  if (problem.id === "array-string:zigzag-conversion") {
    return buildZigzagReplayVariations(mergedInputs);
  }

  if (problem.id === "backtracking:word-search") {
    return buildWordSearchReplayVariations(mergedInputs);
  }

  const arrayLikeKey = Object.keys(mergedInputs).find((key) =>
    /prices|nums|array|arr|ratings|citations|gas|cost|heights?/i.test(key)
  );

  if (arrayLikeKey) {
    return buildGenericArrayVariations(arrayLikeKey, mergedInputs);
  }

  return [];
}
