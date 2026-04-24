import { parseInteger, parseStringList } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type TextJustificationState = {
  words: string[];
  maxWidth: number;
  lineStart: number | null;
  scanIndex: number | null;
  lineEnd: number | null;
  letters: number;
  currentWords: string[];
  gapSizes: number[];
  tailPadding: number;
  currentLine: string;
  builtLines: string[];
  phase: "pack" | "justify" | "done";
  result: string[] | null;
};

type TextJustificationPointers = {
  lineStart: number | null;
  scanIndex: number | null;
};

export type TextJustificationTraceStep = TeachingTraceFrame & {
  state: TextJustificationState;
  pointers: TextJustificationPointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

function makeVisible(text: string) {
  return text.replace(/ /g, "·");
}

export function generateTrace(rawWords: string, rawMaxWidth: string) {
  const parsedWords = parseStringList(rawWords);
  const widestWord = parsedWords.reduce((best, word) => Math.max(best, word.length), 0);
  const maxWidth = Math.max(parseInteger(rawMaxWidth, 16), widestWord, 1);
  const trace: TextJustificationTraceStep[] = [];

  let lineStart: number | null = parsedWords.length > 0 ? 0 : null;
  let scanIndex: number | null = parsedWords.length > 0 ? 0 : null;
  let lineEnd: number | null = null;
  let letters = 0;
  let currentWords: string[] = [];
  let gapSizes: number[] = [];
  let tailPadding = 0;
  let currentLine = "";
  let builtLines: string[] = [];
  let phase: TextJustificationState["phase"] = "pack";
  let result: string[] | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: TextJustificationTraceStep["actionTone"],
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
        { label: "Built Lines", value: builtLines.length, tone: "green" },
        { label: "Letters", value: letters, tone: "cyan" },
        { label: "Width", value: maxWidth, tone: "purple" },
      ],
      pointerChips: [
        { label: "lineStart", value: pointerValue(lineStart), tone: "cyan" },
        { label: "scan", value: pointerValue(scanIndex), tone: "yellow" },
      ],
      done,
      state: {
        words: [...parsedWords],
        maxWidth,
        lineStart,
        scanIndex,
        lineEnd,
        letters,
        currentWords: [...currentWords],
        gapSizes: [...gapSizes],
        tailPadding,
        currentLine,
        builtLines: [...builtLines],
        phase,
        result,
      },
      pointers: {
        lineStart,
        scanIndex,
      },
    });
  }

  pushStep(
    parsedWords.length === 0
      ? "No words were provided, so there are no justified lines to build."
      : `Pack as many words as possible into each line of width ${maxWidth}, then distribute spaces according to the justification rules.`,
    "initialize",
    "slate",
    [1, 2, 3, 4],
    parsedWords.length === 0
      ? "Without words, the result is an empty list."
      : "Each line is built in two phases: pack the words greedily, then decide how the spaces should be spread.",
    parsedWords.length === 0
      ? "The empty input produces the empty output immediately."
      : "Greedy packing is safe because each line must contain the maximal prefix of remaining words that still fits.",
    parsedWords.length === 0
      ? "There is no active line to compose."
      : "Packing words and spacing gaps are separate responsibilities.",
    parsedWords.length === 0
      ? [
          "The result is an empty vector.",
          "No gap distribution is needed.",
          "No lines are committed.",
        ]
      : [
          "The last line is treated differently: it is left-justified.",
          "Extra spaces on full-justified lines go to the leftmost gaps first.",
          "A one-word line is also left-justified.",
        ]
  );

  let i = 0;

  while (i < parsedWords.length) {
    phase = "pack";
    lineStart = i;
    scanIndex = i;
    lineEnd = i;
    letters = 0;
    currentWords = [];
    gapSizes = [];
    tailPadding = 0;
    currentLine = "";

    while (
      scanIndex !== null &&
      scanIndex < parsedWords.length &&
      letters + parsedWords[scanIndex].length + currentWords.length <= maxWidth
    ) {
      currentWords = [...currentWords, parsedWords[scanIndex]];
      letters += parsedWords[scanIndex].length;
      lineEnd = scanIndex + 1;

      pushStep(
        `Add "${parsedWords[scanIndex]}" to the active line candidate.`,
        "pack",
        "cyan",
        [5, 6, 7, 8],
        "This word still fits, so it joins the current line.",
        "The packing loop preserves the invariant that currentWords is the maximal fitting prefix considered so far for this line.",
        "We are filling the current line as tightly as possible before spacing it.",
        [
          "The line must still have room for the mandatory single spaces between packed words.",
          "letters counts only the non-space characters.",
          "The scan pointer advances while the next word still fits.",
        ]
      );

      scanIndex += 1;
    }

    phase = "justify";
    const isLastLine = scanIndex === parsedWords.length;
    const gaps = Math.max(currentWords.length - 1, 0);

    if (isLastLine || gaps === 0) {
      gapSizes = gaps > 0 ? Array.from({ length: gaps }, () => 1) : [];
      const usedByWordsAndBaseGaps = letters + gapSizes.reduce((sum, gap) => sum + gap, 0);
      tailPadding = maxWidth - usedByWordsAndBaseGaps;
      currentLine = currentWords.join(" ") + " ".repeat(tailPadding);

      pushStep(
        isLastLine
          ? "This is the last line, so left-justify it with single spaces and pad the end."
          : "A single-word line is left-justified and padded on the right.",
        "justify",
        "yellow",
        [10, 11, 12, 13],
        "This line does not spread spaces across the middle. It keeps words left-aligned and uses any remaining spaces at the end.",
        "The final line and any one-word line share the same invariant: internal gaps are single spaces and all remaining width is trailing padding.",
        "The active line is being converted from packed words into a width-exact string.",
        [
          "Only one space appears between neighboring words in left-justified lines.",
          "All leftover width moves to the far right.",
          "The finished line will have exactly maxWidth characters.",
        ]
      );
    } else {
      const spaces = maxWidth - letters;
      const even = Math.floor(spaces / gaps);
      const extra = spaces % gaps;
      gapSizes = Array.from({ length: gaps }, (_, index) => even + (index < extra ? 1 : 0));
      tailPadding = 0;
      currentLine = currentWords
        .map((word, index) => {
          if (index === currentWords.length - 1) {
            return word;
          }
          return word + " ".repeat(gapSizes[index]);
        })
        .join("");

      pushStep(
        `Distribute ${spaces} spaces across ${gaps} gaps as [${gapSizes.join(", ")}] and build the justified line.`,
        "justify",
        "green",
        [14, 15, 16, 17],
        "Because this is a full-justified line, the spaces are spread as evenly as possible across the middle gaps.",
        "Gap sizes follow the full-justify invariant: every gap gets floor(spaces/gaps) spaces, and the first extra gaps receive one more.",
        "The line is now using explicit per-gap space widths instead of default single spaces.",
        [
          "Leftmost gaps receive the extra spaces first.",
          "The line has no trailing padding in the full-justify case.",
          "Every committed line must be exactly maxWidth characters long.",
        ]
      );
    }

    builtLines = [...builtLines, currentLine];

    pushStep(
      `Commit the line "${makeVisible(currentLine)}" and move to the next group of words.`,
      "commit",
      "purple",
      [19, 20],
      "The current line is finished, so it joins the output and the next line begins where packing stopped.",
      "Each iteration commits exactly one width-exact line and advances i to the first unplaced word.",
      "The built output is growing one justified line at a time.",
      [
        "Committed lines never change again.",
        "The next line starts at the first word that did not fit.",
        "The output order matches the original reading order.",
      ]
    );

    i = scanIndex ?? parsedWords.length;
  }

  phase = "done";
  lineStart = null;
  scanIndex = null;
  lineEnd = null;
  letters = 0;
  currentWords = [];
  gapSizes = [];
  tailPadding = 0;
  currentLine = "";
  result = [...builtLines];

  pushStep(
    `Justification complete. ${builtLines.length} line${builtLines.length === 1 ? "" : "s"} were produced.`,
    "done",
    "green",
    [22],
    "Every word has been packed and each line now has exactly the required width.",
    "The result list satisfies the greedy packing rule plus the special spacing rules for full and last lines.",
    "All lines are committed and width-correct.",
    [
      "Time complexity is O(total characters).",
      "Extra space is O(total output size) for the result plus the teaching trace.",
      "Visible middots in the panels represent real spaces.",
    ],
    true
  );

  return trace;
}
