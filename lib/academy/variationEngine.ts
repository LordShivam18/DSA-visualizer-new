import type { Problem } from "./problemRegistry";

export type ReplayVariationKind = "minimal" | "edge" | "adversarial" | "mutation";

export type ReplayVariation = {
  id: string;
  label: string;
  kind: ReplayVariationKind;
  summary: string;
  values: Record<string, string>;
};

function parseNumberList(raw: string) {
  return raw.match(/-?\d+/g)?.map(Number) ?? [];
}

function stringifyNumberList(values: number[]) {
  return `[${values.join(",")}]`;
}

function sanitizeLetters(raw: string) {
  return raw.replace(/[^A-Za-z]/g, "").toUpperCase();
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function insertPlateau(values: number[], fallback: number[]) {
  const seed = values.length > 0 ? [...values] : [...fallback];
  const index = clamp(seed.length - 1, 1, 4);

  seed.splice(index, 0, seed[index - 1]);
  return seed;
}

function buildStockIIReplayVariations(
  inputs: Record<string, string>
): ReplayVariation[] {
  const base = parseNumberList(inputs.prices ?? "");

  return [
    {
      id: "stock-minimal",
      label: "Minimal case",
      kind: "minimal",
      summary: "Use one price so the no-transaction base case is impossible to miss.",
      values: {
        prices: "[5]",
      },
    },
    {
      id: "stock-edge",
      label: "Edge case",
      kind: "edge",
      summary: "Use a descending market to prove that profit stays at zero.",
      values: {
        prices: "[9,7,4,3,1]",
      },
    },
    {
      id: "stock-adversarial",
      label: "Adversarial case",
      kind: "adversarial",
      summary: "Mix plateaus, dips, and gains so only positive adjacent deltas count.",
      values: {
        prices: "[1,3,3,2,5,5,4,8]",
      },
    },
    {
      id: "stock-mutation",
      label: "Mutate current",
      kind: "mutation",
      summary: "Insert a flat plateau into the current series and ignore the zero delta.",
      values: {
        prices: stringifyNumberList(insertPlateau(base, [7, 1, 5, 3, 6, 4])),
      },
    },
  ];
}

function buildZigzagReplayVariations(
  inputs: Record<string, string>
): ReplayVariation[] {
  const source = sanitizeLetters(inputs.s ?? "") || "PAYPALISHIRING";
  const rows = clamp(Number.parseInt(inputs.numRows ?? "3", 10) || 3, 1, 8);
  const shortSource = source.slice(0, Math.max(1, Math.min(source.length, 3)));

  return [
    {
      id: "zigzag-minimal",
      label: "Minimal case",
      kind: "minimal",
      summary: "Use one character and one row so the identity path is explicit.",
      values: {
        s: source.slice(0, 1),
        numRows: "1",
      },
    },
    {
      id: "zigzag-edge",
      label: "Edge case",
      kind: "edge",
      summary: "Use more rows than characters so every character stays in place.",
      values: {
        s: shortSource,
        numRows: String(shortSource.length + 1),
      },
    },
    {
      id: "zigzag-adversarial",
      label: "Adversarial case",
      kind: "adversarial",
      summary: "Use a two-row bounce where direction flips almost every step.",
      values: {
        s: "ABCDEABCDE",
        numRows: "2",
      },
    },
    {
      id: "zigzag-mutation",
      label: "Mutate current",
      kind: "mutation",
      summary: "Keep the same characters but change the bounce depth by one row.",
      values: {
        s: source,
        numRows: String(clamp(rows + (rows > 2 ? -1 : 1), 1, source.length)),
      },
    },
  ];
}

function boardToInput(board: string[][]) {
  return board.map((row) => row.join(" ")).join("\n");
}

function chooseMissingLetter(boardRaw: string) {
  const seen = new Set(sanitizeLetters(boardRaw).split(""));
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  return alphabet.split("").find((letter) => !seen.has(letter)) ?? "Z";
}

function buildWordSearchReplayVariations(
  inputs: Record<string, string>
): ReplayVariation[] {
  const currentBoard = inputs.board ?? "A B C E\nS F C S\nA D E E";
  const currentWord = sanitizeLetters(inputs.word ?? "") || "ABCCED";
  const missingLetter = chooseMissingLetter(currentBoard);
  const impossibleWord = `${currentWord.slice(
    0,
    Math.max(1, currentWord.length - 1)
  )}${missingLetter}`;

  return [
    {
      id: "word-search-minimal",
      label: "Minimal case",
      kind: "minimal",
      summary: "Reduce the board to one matching cell so the base case is obvious.",
      values: {
        board: "A",
        word: "A",
      },
    },
    {
      id: "word-search-edge",
      label: "Edge case",
      kind: "edge",
      summary: "Use a single row so adjacency is legal in only one direction.",
      values: {
        board: boardToInput([["A", "B", "C", "D"]]),
        word: "ABCD",
      },
    },
    {
      id: "word-search-adversarial",
      label: "Adversarial case",
      kind: "adversarial",
      summary: "Overload the board with repeated letters so visited-cell discipline matters.",
      values: {
        board: "A A A\nA A A\nA A A",
        word: "AAAAAAAAAA",
      },
    },
    {
      id: "word-search-mutation",
      label: "Mutate current",
      kind: "mutation",
      summary: "Keep the same prefix but swap in a missing final letter.",
      values: {
        board: currentBoard,
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

  const sortedDescending = [...base].sort((left, right) => right - left);
  const largest = Math.max(...base.map((value) => Math.abs(value)), 1);
  const mutated = insertPlateau(base, [1, 2, 2, 3]);

  return [
    {
      id: `${inputKey}-minimal`,
      label: "Minimal case",
      kind: "minimal",
      summary: "Strip the input to one value before replaying the boundary logic.",
      values: {
        [inputKey]: stringifyNumberList([base[0]]),
      },
    },
    {
      id: `${inputKey}-edge`,
      label: "Edge case",
      kind: "edge",
      summary: "Sort the current values into a monotone boundary case.",
      values: {
        [inputKey]: stringifyNumberList(sortedDescending),
      },
    },
    {
      id: `${inputKey}-adversarial`,
      label: "Adversarial case",
      kind: "adversarial",
      summary: "Use repeated extremes and zeros to expose assumptions about duplicates.",
      values: {
        [inputKey]: stringifyNumberList([0, largest, 0, largest, 0]),
      },
    },
    {
      id: `${inputKey}-mutation`,
      label: "Mutate current",
      kind: "mutation",
      summary: "Insert a duplicate near the front and check whether the invariant survives.",
      values: {
        [inputKey]: stringifyNumberList(mutated),
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
