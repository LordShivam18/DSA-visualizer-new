import type { TeachingTraceFrame } from "../shared/types";

type LengthOfLastWordState = {
  source: string;
  chars: string[];
  index: number | null;
  phase: "trim" | "count" | "done";
  length: number;
  wordStart: number | null;
  wordEnd: number | null;
  lastWord: string;
  result: number | null;
};

type LengthOfLastWordPointers = {
  index: number | null;
};

export type LengthOfLastWordTraceStep = TeachingTraceFrame & {
  state: LengthOfLastWordState;
  pointers: LengthOfLastWordPointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

function extractWord(chars: string[], start: number | null, end: number | null) {
  if (start === null || end === null || start > end) {
    return "";
  }
  return chars.slice(start, end + 1).join("");
}

export function generateTrace(source: string) {
  const chars = [...source];
  const trace: LengthOfLastWordTraceStep[] = [];

  let index: number | null = chars.length > 0 ? chars.length - 1 : null;
  let phase: LengthOfLastWordState["phase"] = "trim";
  let length = 0;
  let wordStart: number | null = null;
  let wordEnd: number | null = null;
  let result: number | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: LengthOfLastWordTraceStep["actionTone"],
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
        { label: "Length", value: length, tone: "green" },
        { label: "Cursor", value: pointerValue(index), tone: "cyan" },
        { label: "Phase", value: phase.toUpperCase(), tone: "purple" },
      ],
      pointerChips: [{ label: "i", value: pointerValue(index), tone: "cyan" }],
      done,
      state: {
        source,
        chars: [...chars],
        index,
        phase,
        length,
        wordStart,
        wordEnd,
        lastWord: extractWord(chars, wordStart, wordEnd),
        result,
      },
      pointers: {
        index,
      },
    });
  }

  pushStep(
    chars.length === 0
      ? "The string is empty, so there is no last word to count."
      : "Start from the end of the string, skip trailing spaces, then count the final word backward.",
    "initialize",
    "slate",
    [1, 2],
    chars.length === 0
      ? "There are no characters to scan, so the answer is 0."
      : "We work from the right because the last word lives at the end after trailing spaces are ignored.",
    chars.length === 0
      ? "An empty string has no non-space suffix, so the last-word length is 0."
      : "Reverse scanning isolates the suffix word without needing to split the entire string.",
    chars.length === 0
      ? "Nothing remains to inspect."
      : "The first task is trimming away any spaces at the tail.",
    chars.length === 0
      ? [
          "The cursor is already done.",
          "Length remains 0.",
          "The result is immediate.",
        ]
      : [
          "Trailing spaces do not belong to the last word.",
          "Once a letter is found, switch into counting mode.",
          "Counting stops at the next space or the beginning of the string.",
        ]
  );

  while (index !== null && index >= 0 && chars[index] === " ") {
    phase = "trim";

    pushStep(
      `Index ${index} is a trailing space, so skip it.`,
      "trim",
      "red",
      [3, 4],
      "This space sits after the last word, so it should not count.",
      "The trim loop discards the maximal suffix of spaces before any word-length counting starts.",
      "Only trailing spaces are being removed right now.",
      [
        "The answer stays unchanged while trimming.",
        "The cursor moves left after every skipped space.",
        "Once a non-space appears, counting begins.",
      ]
    );

    index -= 1;
  }

  while (index !== null && index >= 0 && chars[index] !== " ") {
    phase = "count";
    if (wordEnd === null) {
      wordEnd = index;
    }
    wordStart = index;
    length += 1;

    pushStep(
      `Index ${index} holds '${chars[index]}', so it belongs to the last word. Increase the length to ${length}.`,
      "count",
      "green",
      [7, 8, 9],
      "This character is part of the last word, so the count grows by one.",
      "The count loop spans the maximal suffix of non-space characters immediately before the trimmed tail.",
      "Every non-space visited in count mode belongs to the answer.",
      [
        "The first counted character marks the word's end.",
        "The word expands leftward one character at a time.",
        "Counting ends at the previous space or the front of the string.",
      ]
    );

    index -= 1;
  }

  phase = "done";
  index = null;
  result = length;

  pushStep(
    `The reverse scan stopped, so the last word length is ${length}.`,
    "done",
    "green",
    [11],
    "Once we hit a space or the start of the string, the count is complete.",
    "The algorithm returns the size of the final contiguous non-space suffix after trimming trailing spaces.",
    "The counted window already spans the entire last word.",
    [
      "Time complexity is O(n).",
      "Extra space is O(1) outside of the teaching trace.",
      "No splitting or extra word array is required.",
    ],
    true
  );

  return trace;
}
