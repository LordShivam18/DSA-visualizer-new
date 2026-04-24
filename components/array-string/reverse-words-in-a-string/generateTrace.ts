import type { TeachingTraceFrame } from "../shared/types";

type ReverseWordsState = {
  source: string;
  allTokens: string[];
  sourceIndex: number | null;
  buildIndex: number | null;
  extracted: string[];
  reversedWords: string[];
  currentWord: string;
  output: string;
  phase: "extract" | "build" | "done";
  result: string | null;
};

type ReverseWordsPointers = {
  sourceIndex: number | null;
  buildIndex: number | null;
};

export type ReverseWordsTraceStep = TeachingTraceFrame & {
  state: ReverseWordsState;
  pointers: ReverseWordsPointers;
};

function normalizeTokens(source: string) {
  return source.trim().split(/\s+/).filter(Boolean);
}

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(source: string) {
  const allTokens = normalizeTokens(source);
  const trace: ReverseWordsTraceStep[] = [];

  let sourceIndex: number | null = allTokens.length > 0 ? 0 : null;
  let buildIndex: number | null = null;
  let extracted: string[] = [];
  let reversedWords: string[] = [];
  let currentWord = "";
  let output = "";
  let phase: ReverseWordsState["phase"] = "extract";
  let result: string | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: ReverseWordsTraceStep["actionTone"],
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
        { label: "Parsed Words", value: extracted.length, tone: "cyan" },
        { label: "Output Words", value: reversedWords.length, tone: "green" },
        { label: "Output Length", value: output.length, tone: "purple" },
      ],
      pointerChips: [
        {
          label: "extract",
          value: pointerValue(sourceIndex),
          tone: "cyan",
        },
        {
          label: "build",
          value: pointerValue(buildIndex),
          tone: "yellow",
        },
      ],
      done,
      state: {
        source,
        allTokens: [...allTokens],
        sourceIndex,
        buildIndex,
        extracted: [...extracted],
        reversedWords: [...reversedWords],
        currentWord,
        output,
        phase,
        result,
      },
      pointers: {
        sourceIndex,
        buildIndex,
      },
    });
  }

  pushStep(
    allTokens.length === 0
      ? "The sentence has no words after whitespace is normalized, so the reversed result is empty."
      : "First extract clean words from the sentence, then rebuild the answer from the last word to the first.",
    "initialize",
    "slate",
    [1, 2, 3],
    allTokens.length === 0
      ? "After trimming and collapsing spaces, nothing remains to reverse."
      : "We separate the problem into two phases: collect words cleanly, then append them in reverse order.",
    allTokens.length === 0
      ? "Whitespace normalization can collapse the entire input to the empty sequence."
      : "Stream extraction removes redundant spaces automatically, and reverse assembly restores the answer with single-space separators.",
    allTokens.length === 0
      ? "There are no normalized tokens to inspect."
      : "Only clean words matter; extra spaces are ignored by design.",
    allTokens.length === 0
      ? [
          "The result is the empty string.",
          "No extraction phase is needed.",
          "No build phase is needed.",
        ]
      : [
          "Multiple spaces collapse into one separator in the final answer.",
          "Leading and trailing spaces disappear entirely.",
          "The extracted word list becomes the source for the reverse build.",
        ]
  );

  for (let index = 0; index < allTokens.length; index += 1) {
    phase = "extract";
    sourceIndex = index;
    currentWord = allTokens[index];
    extracted = [...extracted, currentWord];

    pushStep(
      `Extract word ${index}: "${currentWord}" from the normalized sentence stream.`,
      "extract",
      "cyan",
      [4, 5],
      "One clean word has been pulled out and stored.",
      "Each extraction step skips arbitrary whitespace and records exactly one token.",
      "The parser is collecting a normalized word list.",
      [
        "Words are stored in their original order first.",
        "Whitespace is not copied into the token list.",
        "The reverse build starts only after extraction completes.",
      ]
    );
  }

  phase = "build";
  sourceIndex = null;

  if (allTokens.length > 0) {
    pushStep(
      "Extraction is complete, so switch to the reverse assembly phase.",
      "phase-shift",
      "purple",
      [6, 7],
      "Now that all words are collected, we can rebuild the sentence from back to front.",
      "Separating extraction from assembly keeps whitespace normalization independent from ordering logic.",
      "The token list is ready to be consumed in reverse.",
      [
        "The next pointer walks from the last word down to the first.",
        "Single spaces are inserted only while rebuilding.",
        "The original spacing no longer matters.",
      ]
    );
  }

  for (let index = allTokens.length - 1; index >= 0; index -= 1) {
    buildIndex = index;
    currentWord = allTokens[index];
    reversedWords = [...reversedWords, currentWord];
    output = reversedWords.join(" ");

    pushStep(
      `Append "${currentWord}" to the rebuilt sentence. The output becomes "${output}".`,
      "append",
      "green",
      [8, 9, 10, 11],
      "We are rebuilding the sentence from the back, using exactly one space between words.",
      "Reverse iteration over the token list produces the required word order while preserving normalized spacing.",
      "The output grows one reversed word at a time.",
      [
        "Words already appended keep their reversed order.",
        "Only a single space is used between output words.",
        "No leading or trailing spaces are introduced.",
      ]
    );
  }

  phase = "done";
  buildIndex = null;
  result = output;

  pushStep(
    `The reverse assembly is complete. The final sentence is "${output}".`,
    "done",
    "green",
    [12],
    "All words have been placed in reverse order with clean spacing.",
    "The final string is the reversed token sequence joined by single spaces, which satisfies the normalization requirement.",
    "The output already reflects the full reversed word order.",
    [
      "Time complexity is O(n).",
      "Extra space is O(k) for the extracted words.",
      "Whitespace normalization happens naturally during extraction.",
    ],
    true
  );

  return trace;
}
