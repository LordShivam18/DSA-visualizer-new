import type {
  DpTraceStep,
  InputFieldConfig,
  PresetConfig,
  VisualCell,
  VisualMatrix,
} from "@/components/dp/shared/types";
import { createTraceRecorder } from "@/components/dp/shared/trace";

export const inputFields: InputFieldConfig[] = [
  {
    key: "s",
    label: "s",
    placeholder: "babad",
    help: "String to scan for palindromic substrings.",
  },
];

export const defaultInputs = {
  s: "babad",
};

export type LongestPalindromeInputs = typeof defaultInputs;

export const presets: PresetConfig<LongestPalindromeInputs>[] = [
  { name: "Example 1", summary: "=> bab", values: { s: "babad" } },
  { name: "Example 2", summary: "=> bb", values: { s: "cbbd" } },
  { name: "Centered", summary: "=> racecar", values: { s: "racecar" } },
];

export const code = [
  "function longestPalindrome(s: string): string {",
  "  const n = s.length;",
  "  const dp = Array.from({ length: n }, () => Array(n).fill(false));",
  "  let bestStart = 0;",
  "  let bestLength = 1;",
  "  for (let length = 1; length <= n; length += 1) {",
  "    for (let start = 0; start + length - 1 < n; start += 1) {",
  "      const end = start + length - 1;",
  "      const innerValid = length <= 2 || dp[start + 1][end - 1];",
  "      if (s[start] === s[end] && innerValid) {",
  "        dp[start][end] = true;",
  "        if (length > bestLength) {",
  "          bestStart = start;",
  "          bestLength = length;",
  "        }",
  "      }",
  "    }",
  "  }",
  "  return s.slice(bestStart, bestStart + bestLength);",
  "}",
];

export const complexity = ["Time O(n²)", "Space O(n²)", "Pattern: Palindrome window DP"];

export function generateTrace(inputs: LongestPalindromeInputs): DpTraceStep[] {
  const s = inputs.s;
  const n = s.length;
  const dp = Array.from({ length: n }, () => Array.from({ length: n }, () => false));
  const { trace, pushStep } = createTraceRecorder();
  let bestStart = 0;
  let bestLength = n > 0 ? 1 : 0;

  function buildChars(start: number | null, end: number | null): VisualCell[] {
    return s.split("").map((char, index) => ({
      id: `char-${index}`,
      label: String(index),
      value: char,
      tone:
        start !== null && end !== null && index >= start && index <= end
          ? "sky"
          : dp[index][index]
          ? "emerald"
          : "slate",
      tags:
        start !== null && end !== null && index === start
          ? ["start"]
          : start !== null && end !== null && index === end
          ? ["end"]
          : [],
      variant: "char",
    }));
  }

  function buildMatrix(start: number | null, end: number | null): VisualMatrix {
    return {
      id: "pal-table",
      title: "Palindrome table",
      subtitle:
        "dp[start][end] is true when the substring from start to end is a palindrome.",
      variant: "grid",
      rows: dp.map((row, rowIndex) => ({
        id: `row-${rowIndex}`,
        label: String(rowIndex),
        cells: row.map((value, colIndex) => ({
          id: `dp-${rowIndex}-${colIndex}`,
          value: value ? "T" : "F",
          tone:
            start === rowIndex && end === colIndex
              ? "sky"
              : value
              ? "emerald"
              : rowIndex > colIndex
              ? "slate"
              : "rose",
          tags:
            start === rowIndex && end === colIndex
              ? ["window"]
              : value
              ? ["pal"]
              : [],
          variant: "square",
          ghost: rowIndex > colIndex,
        })),
      })),
    };
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
    done = false
  ) {
    const best = s.slice(bestStart, bestStart + bestLength);

    pushStep({
      action,
      actionKind,
      actionTone,
      codeLines,
      beginnerNote,
      expertNote,
      focus,
      hints: [
        "A substring is a palindrome when its endpoints match and the inner substring is also palindromic.",
        "Windows are processed by increasing length so inner states are ready in time.",
        "The current best substring updates only when a longer palindrome appears.",
      ],
      metrics: [
        { label: "Length", value: n, tone: "slate" },
        { label: "Best length", value: bestLength, tone: "emerald" },
        { label: "Best substring", value: best || "-", tone: "sky" },
      ],
      pointerChips: [
        { label: "start", value: start === null ? "done" : String(start), tone: "sky" },
        { label: "end", value: end === null ? "-" : String(end), tone: "sky" },
      ],
      done,
      resultLabel: "longestPalindrome",
      resultValue: best || "",
      animation: {
        type: done ? "highlight" : "highlight",
        targets:
          start === null || end === null
            ? ["result"]
            : [`char-${start}`, `char-${end}`, `dp-${start}-${end}`],
        duration: 820,
      },
      highlights: {
        primaryIds:
          start === null || end === null
            ? ["result"]
            : [`char-${start}`, `char-${end}`, `dp-${start}-${end}`],
      },
      state: {
        scene: "palindrome",
        headline: "Mirrored endpoints unlock glowing palindrome windows",
        subheadline:
          "The resonance table only marks a window true when the outer characters match and its inner window is already stable.",
        sequences: [
          {
            id: "chars",
            title: "String window",
            subtitle: "Blue highlights the substring currently being tested.",
            variant: "char",
            cells: buildChars(start, end),
          },
        ],
        matrices: [buildMatrix(start, end)],
        result: {
          label: "Longest palindromic substring",
          value: best || "",
          tone: done ? "emerald" : "sky",
        },
      },
    });
  }

  if (n === 0) {
    return [
      {
        step: 0,
        action: "The string is empty, so the longest palindrome is an empty string.",
        actionKind: "initialize",
        actionTone: "slate",
        codeLines: [1],
        beginnerNote: "No characters means no non-empty palindrome window.",
        expertNote: "The empty string is the neutral base case for the palindrome search.",
        focus: "There are no DP windows to evaluate.",
        hints: ["Provide a non-empty string to animate the palindrome table."],
        metrics: [{ label: "Length", value: 0, tone: "slate" }],
        pointerChips: [],
        done: true,
        resultLabel: "longestPalindrome",
        resultValue: "",
        animation: { type: "highlight", targets: [], duration: 400 },
        highlights: {},
        state: {
          scene: "palindrome",
          headline: "No resonance",
          subheadline: "An empty string yields an empty palindrome result.",
          result: { label: "Longest palindrome", value: "", tone: "slate" },
        },
      },
    ];
  }

  for (let length = 1; length <= n; length += 1) {
    for (let start = 0; start + length - 1 < n; start += 1) {
      const end = start + length - 1;
      const innerValid = length <= 2 || dp[start + 1][end - 1];

      pushFrame(
        start,
        end,
        `Test window s[${start}..${end}] = "${s.slice(start, end + 1)}".`,
        "inspect",
        "amber",
        [6, 7, 8, 9, 10],
        "The table checks the current substring window from both ends inward.",
        "Processing by window length guarantees the inner window has already been solved when needed.",
        "The endpoints and the inner window together determine whether this substring is palindromic."
      );

      if (s[start] === s[end] && innerValid) {
        dp[start][end] = true;

        if (length > bestLength) {
          bestStart = start;
          bestLength = length;
        }

        pushFrame(
          start,
          end,
          `The endpoints match and the inner window is valid, so "${s.slice(
            start,
            end + 1
          )}" is a palindrome.`,
          "update",
          "sky",
          [10, 11, 12, 13, 14],
          "This window glows true because its mirrored ends agree and its inside is already known to be palindromic.",
          "Palindrome DP uses smaller palindromes to certify larger ones, making the table grow outward safely.",
          "A true cell may also promote the current best substring when its window is longer."
        );
      }
    }
  }

  pushFrame(
    null,
    null,
    `The longest glowing palindrome is "${s.slice(bestStart, bestStart + bestLength)}".`,
    "complete",
    "emerald",
    [18],
    "The saved best window becomes the final answer.",
    "The DP table explored every substring once, so the longest true window is guaranteed optimal.",
    "The resonance table is complete when all window lengths have been processed.",
    true
  );

  return trace;
}
