import type {
  DpTraceStep,
  InputFieldConfig,
  PresetConfig,
  VisualCell,
  VisualTone,
} from "@/components/dp/shared/types";
import { parseStringList } from "@/components/dp/shared/parsers";
import { createTraceRecorder } from "@/components/dp/shared/trace";

export const inputFields: InputFieldConfig[] = [
  {
    key: "s",
    label: "s",
    placeholder: "leetcode",
    help: "The source string to segment.",
  },
  {
    key: "wordDict",
    label: "wordDict",
    placeholder: "[\"leet\",\"code\"]",
    help: "Dictionary words available for segmentation.",
    multiline: true,
    rows: 4,
  },
];

export const defaultInputs = {
  s: "leetcode",
  wordDict: "[\"leet\",\"code\"]",
};

export type WordBreakInputs = typeof defaultInputs;

export const presets: PresetConfig<WordBreakInputs>[] = [
  {
    name: "Example 1",
    summary: "=> true",
    values: { s: "leetcode", wordDict: "[\"leet\",\"code\"]" },
  },
  {
    name: "Example 2",
    summary: "=> true",
    values: { s: "applepenapple", wordDict: "[\"apple\",\"pen\"]" },
  },
  {
    name: "Example 3",
    summary: "=> false",
    values: { s: "catsandog", wordDict: "[\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]" },
  },
];

export const code = [
  "function wordBreak(s: string, wordDict: string[]): boolean {",
  "  const words = new Set(wordDict);",
  "  const dp = Array(s.length + 1).fill(false);",
  "  dp[0] = true;",
  "  for (let end = 1; end <= s.length; end += 1) {",
  "    for (let start = 0; start < end; start += 1) {",
  "      const piece = s.slice(start, end);",
  "      if (dp[start] && words.has(piece)) {",
  "        dp[end] = true;",
  "        break;",
  "      }",
  "    }",
  "  }",
  "  return dp[s.length];",
  "}",
];

export const complexity = ["Time O(n²)", "Space O(n)", "Pattern: Prefix reachability"];

function charTone(index: number, start: number | null, end: number | null): VisualTone {
  if (start !== null && end !== null && index >= start && index < end) {
    return "sky";
  }

  if (end !== null && index < end) {
    return "emerald";
  }

  return "slate";
}

export function generateTrace(inputs: WordBreakInputs): DpTraceStep[] {
  const s = inputs.s.trim();
  const wordDict = parseStringList(inputs.wordDict);
  const words = new Set(wordDict);
  const dp = Array.from({ length: s.length + 1 }, () => false);
  const matches: Array<{ end: number; piece: string; start: number }> = [];
  const { trace, pushStep } = createTraceRecorder();

  dp[0] = true;

  function buildStringCells(start: number | null, end: number | null): VisualCell[] {
    return s.split("").map((char, index) => ({
      id: `char-${index}`,
      label: `idx ${index}`,
      value: char,
      tone: charTone(index, start, end),
      tags:
        start !== null && end !== null && index >= start && index < end
          ? ["slice"]
          : end !== null && index < end
          ? ["reachable"]
          : [],
      variant: "char",
    }));
  }

  function buildDpCells(end: number | null): VisualCell[] {
    return dp.map((value, index) => ({
      id: `dp-${index}`,
      label: `cut ${index}`,
      value: value ? "T" : "F",
      caption: index === 0 ? "empty prefix" : undefined,
      tone: end === index ? "sky" : value ? "emerald" : "rose",
      tags: end === index ? ["target"] : value ? ["reachable"] : [],
      variant: "char",
    }));
  }

  function pushFrame(
    start: number | null,
    end: number | null,
    action: string,
    actionKind: DpTraceStep["actionKind"],
    actionTone: DpTraceStep["actionTone"],
    codeLines: number[],
    beginnerNote: string,
    expertNote: string,
    focus: string,
    piece = "",
    done = false
  ) {
    pushStep({
      action,
      actionKind,
      actionTone,
      codeLines,
      beginnerNote,
      expertNote,
      focus,
      hints: [
        "dp[end] becomes true if there exists a reachable cut start with a dictionary word between start and end.",
        "The empty prefix is reachable by definition.",
        "The first successful cut for an end position is enough to stop scanning that end.",
      ],
      metrics: [
        { label: "Length", value: s.length, tone: "slate" },
        { label: "Reachable cuts", value: dp.filter(Boolean).length, tone: "emerald" },
        { label: "Current piece", value: piece || "-", tone: "sky" },
      ],
      pointerChips: [
        { label: "start", value: start === null ? "-" : String(start), tone: "amber" },
        { label: "end", value: end === null ? "done" : String(end), tone: "sky" },
      ],
      done,
      resultLabel: "canSegment",
      resultValue: String(dp[s.length]),
      animation: {
        type: done ? "highlight" : "highlight",
        targets:
          end === null
            ? ["dp-result"]
            : [`dp-${end}`, ...(start !== null ? Array.from({ length: end - start }, (_, offset) => `char-${start + offset}`) : [])],
        duration: 780,
      },
      highlights: {
        primaryIds:
          end === null
            ? ["dp-result"]
            : [`dp-${end}`, ...(start !== null ? Array.from({ length: end - start }, (_, offset) => `char-${start + offset}`) : [])],
        secondaryIds: start !== null ? [`dp-${start}`] : [],
      },
      state: {
        scene: "wordbreak",
        headline: "Reachable cuts carve the string into dictionary pieces",
        subheadline:
          "A cut position is alive only if the prefix before it is segmentable and the new slice belongs to the dictionary.",
        sequences: [
          {
            id: "source",
            title: "Source string",
            subtitle: "The active slice glows blue while earlier reachable territory fades emerald.",
            variant: "char",
            cells: buildStringCells(start, end),
          },
          {
            id: "dp-cuts",
            title: "Reachable cuts",
            subtitle: "T means the prefix ending at this cut can be segmented completely.",
            variant: "char",
            cells: buildDpCells(end),
          },
        ],
        ledgers: [
          {
            id: "dictionary",
            title: "Dictionary",
            subtitle: "Reusable words available to the segmentation engine.",
            items: wordDict.map((word) => ({
              id: `dict-${word}`,
              label: word,
              value: words.has(piece) && word === piece ? "match" : "available",
              tone:
                words.has(piece) && word === piece
                  ? "sky"
                  : matches.some((match) => match.piece === word)
                  ? "emerald"
                  : "slate",
            })),
            emptyLabel: "No dictionary entries were provided.",
          },
          {
            id: "matches",
            title: "Successful cuts",
            subtitle: "Each green row records a slice that unlocked a new reachable end position.",
            items: matches.map((match) => ({
              id: `match-${match.start}-${match.end}`,
              label: `${match.start} -> ${match.end}`,
              value: match.piece,
              tone: "emerald",
            })),
            emptyLabel: "No successful segmentation cut has fired yet.",
          },
        ],
        callouts: [
          {
            id: "piece",
            label: "Active piece",
            value: piece || "-",
            tone: words.has(piece) ? "sky" : "slate",
            description:
              piece.length > 0
                ? words.has(piece)
                  ? "This slice exists in the dictionary."
                  : "This slice is not a dictionary word yet."
                : "Scanning for the next piece.",
          },
        ],
        result: {
          label: "Segmentable?",
          value: String(dp[s.length]),
          tone: done ? (dp[s.length] ? "emerald" : "rose") : "sky",
        },
      },
    });
  }

  pushFrame(
    null,
    0,
    "Mark the empty prefix as reachable. Every valid segmentation starts from cut 0.",
    "initialize",
    "slate",
    [1, 2, 3, 4],
    "Before reading any characters, the empty string is already segmented.",
    "dp[0] = true is the seed that allows future dictionary words to attach to the front of the string.",
    "The segmentation engine needs one reachable cut to begin expanding."
  );

  for (let end = 1; end <= s.length; end += 1) {
    let matched = false;

    for (let start = 0; start < end; start += 1) {
      const piece = s.slice(start, end);

      if (!dp[start] && !words.has(piece)) {
        continue;
      }

      pushFrame(
        start,
        end,
        `Test slice "${piece}" from cut ${start} to cut ${end}.`,
        "inspect",
        "amber",
        [5, 6, 7],
        "The solver checks whether this slice is a dictionary word that starts from a reachable cut.",
        "Both conditions are necessary: the prefix before start must already be segmentable, and the new piece must exist in the dictionary.",
        "A cut becomes reachable only when a legal word bridges it from an earlier reachable cut.",
        piece
      );

      if (dp[start] && words.has(piece)) {
        dp[end] = true;
        matched = true;
        matches.push({ end, piece, start });

        pushFrame(
          start,
          end,
          `Success: "${piece}" attaches to a reachable prefix, so cut ${end} becomes reachable.`,
          "update",
          "sky",
          [7, 8, 9, 10],
          "This slice completes a valid segment, so the DP table turns true at the end cut.",
          "The first successful attachment is enough because dp[end] only needs existence, not a count.",
          "A reachable cut means the prefix up to this end can be fully segmented.",
          piece
        );

        break;
      }
    }

    if (!matched) {
      pushFrame(
        null,
        end,
        `No dictionary slice can reach cut ${end}, so dp[${end}] stays false.`,
        "reject",
        "rose",
        [5, 6, 7, 11],
        "Every attempted slice failed to connect this end position to a reachable prefix.",
        "If no valid predecessor cut exists, the prefix ending here cannot be segmented.",
        "This cut remains unreachable until proven otherwise."
      );
    }
  }

  pushFrame(
    null,
    null,
    `The final cut at ${s.length} is ${dp[s.length] ? "reachable" : "not reachable"}, so the answer is ${dp[s.length]}.`,
    "complete",
    dp[s.length] ? "emerald" : "rose",
    [13],
    "The answer is whatever truth value ended up at the last cut.",
    "The DP scan proves segmentation by prefix reachability; the last cut represents the entire string.",
    "If the last cut is reachable, the whole string can be partitioned into dictionary words.",
    "",
    true
  );

  return trace;
}
