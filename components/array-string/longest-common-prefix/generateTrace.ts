import { parseStringList } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type LongestCommonPrefixState = {
  words: string[];
  column: number | null;
  compareWord: number | null;
  prefix: string;
  candidateChar: string;
  mismatchWordIndex: number | null;
  result: string | null;
};

type LongestCommonPrefixPointers = {
  column: number | null;
  compareWord: number | null;
};

export type LongestCommonPrefixTraceStep = TeachingTraceFrame & {
  state: LongestCommonPrefixState;
  pointers: LongestCommonPrefixPointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(rawWords: string) {
  const words = parseStringList(rawWords);
  const trace: LongestCommonPrefixTraceStep[] = [];

  const reference = words[0] ?? "";
  let column: number | null = reference.length > 0 ? 0 : null;
  let compareWord: number | null = words.length > 1 ? 1 : null;
  let prefix = "";
  let candidateChar = column === null ? "" : reference[column] ?? "";
  let mismatchWordIndex: number | null = null;
  let result: string | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: LongestCommonPrefixTraceStep["actionTone"],
    codeLines: number[],
    beginnerNote: string,
    expertNote: string,
    focus: string,
    hints: string[],
    done = false
  ) {
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
        { label: "Prefix Length", value: prefix.length, tone: "green" },
        { label: "Column", value: pointerValue(column), tone: "cyan" },
        { label: "Words", value: words.length, tone: "purple" },
      ],
      pointerChips: [
        { label: "col", value: pointerValue(column), tone: "cyan" },
        { label: "word", value: pointerValue(compareWord), tone: "yellow" },
      ],
      done,
      state: {
        words: [...words],
        column,
        compareWord,
        prefix,
        candidateChar,
        mismatchWordIndex,
        result,
      },
      pointers: {
        column,
        compareWord,
      },
    });
  }

  pushStep(
    words.length === 0
      ? "No words were provided, so the common prefix is empty."
      : "Use the first word as the reference and compare one character column at a time.",
    "initialize",
    "slate",
    [1, 2],
    words.length === 0
      ? "An empty list cannot share any prefix."
      : "Every word must agree with the reference character in the current column, or the prefix stops immediately.",
    words.length === 0
      ? "With zero strings, the longest common prefix is the empty string by definition."
      : "Column-wise comparison preserves a growing invariant: every accepted column matches across all words seen so far.",
    words.length === 0
      ? "There is nothing to compare."
      : "The reference word supplies the candidate character for each column.",
    words.length === 0
      ? [
          "The prefix is empty.",
          "No comparison loop is needed.",
          "The result is immediate.",
        ]
      : [
          "The prefix grows only after every word passes the current column.",
          "A short word can end the prefix just as surely as a mismatched character.",
          "The scan stops at the first failure.",
        ]
  );

  let stop = false;

  for (let col = 0; col < reference.length && !stop; col += 1) {
    column = col;
    candidateChar = reference[col] ?? "";
    mismatchWordIndex = null;

    for (let wordIndex = 1; wordIndex < words.length; wordIndex += 1) {
      compareWord = wordIndex;

      pushStep(
        `Compare column ${col} (${candidateChar}) from the reference word against word ${wordIndex}.`,
        "compare",
        "yellow",
        [3, 4, 5],
        "We are checking whether this word agrees with the current prefix candidate.",
        "The current column survives only if every remaining word has the same character at this index.",
        "One mismatch is enough to end the search.",
        [
          "A word that runs out of characters also breaks the prefix.",
          "So far accepted columns stay locked in the prefix.",
          "Only the active comparison word matters in this step.",
        ]
      );

      if (col >= words[wordIndex].length || words[wordIndex][col] !== candidateChar) {
        mismatchWordIndex = wordIndex;
        stop = true;

        pushStep(
          `Word ${wordIndex} fails at column ${col}, so the prefix must stop at ${prefix || '""'}.`,
          "mismatch",
          "red",
          [5, 6],
          "This word disagrees at the current column, so no longer prefix is possible.",
          "The longest common prefix is maximal: the first failed column proves that every longer prefix is impossible.",
          "Failure at one word halts the entire scan.",
          [
            "The accepted prefix from earlier columns remains valid.",
            "No future column can fix a mismatch that happens now.",
            "The algorithm stops immediately on the first failure.",
          ]
        );
        break;
      }
    }

    if (stop) {
      break;
    }

    prefix += candidateChar;
    compareWord = null;

    pushStep(
      `All words matched column ${col}, so extend the prefix to ${prefix}.`,
      "extend",
      "green",
      [7],
      "Since every word agreed on this column, the common prefix grows by one character.",
      "Every successful column strengthens the invariant that prefix is shared by all words processed so far.",
      "The prefix can grow only after a full column passes.",
      [
        "The next step moves to the following column.",
        "The current prefix is guaranteed common to every word.",
        "The prefix always appears at the beginning of each string.",
      ]
    );
  }

  column = null;
  compareWord = null;
  candidateChar = "";
  result = prefix;

  pushStep(
    `The column scan is complete. The longest common prefix is ${prefix || '""'}.`,
    "done",
    "green",
    [9],
    "When the scan stops, the built prefix is the longest one every word shares.",
    "The algorithm returns the maximal prefix validated across all words before the first failed column.",
    "Nothing beyond the current prefix can be common anymore.",
    [
      "Time complexity is O(total compared characters).",
      "Extra space is O(1) besides the returned prefix and teaching trace.",
      "An empty result means the first column already failed.",
    ],
    true
  );

  return trace;
}
