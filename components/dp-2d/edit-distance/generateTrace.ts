import type {
  DpTraceStep,
  InputFieldConfig,
  PresetConfig,
  VisualMatrix,
  VisualTone,
} from "@/components/dp/shared/types";
import { createTraceRecorder } from "@/components/dp/shared/trace";

export const inputFields: InputFieldConfig[] = [
  { key: "word1", label: "word1", placeholder: "horse" },
  { key: "word2", label: "word2", placeholder: "ros" },
];

export const defaultInputs = {
  word1: "horse",
  word2: "ros",
};

export type EditDistanceInputs = typeof defaultInputs;

export const presets: PresetConfig<EditDistanceInputs>[] = [
  { name: "Example 1", summary: "=> 3", values: { word1: "horse", word2: "ros" } },
  {
    name: "Example 2",
    summary: "=> 5",
    values: { word1: "intention", word2: "execution" },
  },
  { name: "Short", summary: "=> 1", values: { word1: "cat", word2: "cut" } },
];

export const code = [
  "function minDistance(word1: string, word2: string): number {",
  "  const dp = Array.from({ length: word1.length + 1 }, () => Array(word2.length + 1).fill(0));",
  "  for (let i = 0; i <= word1.length; i += 1) dp[i][0] = i;",
  "  for (let j = 0; j <= word2.length; j += 1) dp[0][j] = j;",
  "  for (let i = 1; i <= word1.length; i += 1) {",
  "    for (let j = 1; j <= word2.length; j += 1) {",
  "      if (word1[i - 1] === word2[j - 1]) {",
  "        dp[i][j] = dp[i - 1][j - 1];",
  "      } else {",
  "        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);",
  "      }",
  "    }",
  "  }",
  "  return dp[word1.length][word2.length];",
  "}",
];

export const complexity = ["Time O(m*n)", "Space O(m*n)", "Pattern: Edit operation matrix"];

export function generateTrace(inputs: EditDistanceInputs): DpTraceStep[] {
  const word1 = inputs.word1;
  const word2 = inputs.word2;
  const m = word1.length;
  const n = word2.length;
  const dp = Array.from({ length: m + 1 }, () => Array.from({ length: n + 1 }, () => 0));
  const { trace, pushStep } = createTraceRecorder();

  for (let i = 0; i <= m; i += 1) {
    dp[i][0] = i;
  }

  for (let j = 0; j <= n; j += 1) {
    dp[0][j] = j;
  }

  function buildWordCells(
    word: string,
    key: string,
    active: number | null,
    tone: "sky" | "amber"
  ) {
    return word.split("").map((char, index) => ({
      id: `${key}-${index}`,
      label: String(index),
      value: char,
      tone: (active === index
        ? tone
        : index < (active ?? 0)
        ? "emerald"
        : "slate") as VisualTone,
      tags: active === index ? ["focus"] : [],
      variant: "char" as const,
    }));
  }

  function buildMatrix(i: number | null, j: number | null): VisualMatrix {
    return {
      id: "edit-grid",
      title: "Edit distance matrix",
      subtitle:
        "Each cell stores the minimum edits needed to convert the first i chars of word1 into the first j chars of word2.",
      variant: "grid",
      rows: dp.map((row, rowIndex) => ({
        id: `row-${rowIndex}`,
        label: String(rowIndex),
        cells: row.map((value, colIndex) => ({
          id: `dp-${rowIndex}-${colIndex}`,
          value,
          tone:
            i === rowIndex && j === colIndex
              ? "sky"
              : rowIndex <= (i ?? m) && colIndex <= (j ?? n)
              ? "emerald"
              : "slate",
          tags: i === rowIndex && j === colIndex ? ["cell"] : [],
          variant: "square",
        })),
      })),
    };
  }

  function pushFrame(
    i: number | null,
    j: number | null,
    action: string,
    actionKind: DpTraceStep["actionKind"],
    actionTone: DpTraceStep["actionTone"],
    codeLines: number[],
    beginnerNote: string,
    expertNote: string,
    focus: string,
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
        "The first row and first column represent pure insertions or deletions.",
        "Matching characters copy the diagonal value with no new cost.",
        "Non-matching characters pay one plus the cheapest delete, insert, or replace predecessor.",
      ],
      metrics: [
        { label: "m", value: m, tone: "slate" },
        { label: "n", value: n, tone: "slate" },
        { label: "Current distance", value: i !== null && j !== null ? dp[i][j] : dp[m][n], tone: "sky" },
      ],
      pointerChips: [
        { label: "i", value: i === null ? "done" : String(i), tone: "sky" },
        { label: "j", value: j === null ? "-" : String(j), tone: "amber" },
      ],
      done,
      resultLabel: "editDistance",
      resultValue: String(dp[m][n]),
      animation: {
        type: done ? "highlight" : "update",
        targets: i === null || j === null ? ["result"] : [`dp-${i}-${j}`],
        duration: 820,
      },
      highlights: {
        primaryIds: i === null || j === null ? ["result"] : [`dp-${i}-${j}`],
      },
      state: {
        scene: "edit",
        headline: "Every cell prices the cheapest way to align two prefixes",
        subheadline:
          "The edit lab compares deletion, insertion, and replacement costs while the matrix gradually stabilizes from top-left to bottom-right.",
        sequences: [
          {
            id: "word1",
            title: "word1",
            subtitle: "Blue tracks the active character from the source word.",
            variant: "char",
            cells: buildWordCells(word1, "w1", i !== null && i > 0 ? i - 1 : null, "sky"),
          },
          {
            id: "word2",
            title: "word2",
            subtitle: "Amber tracks the active character from the target word.",
            variant: "char",
            cells: buildWordCells(word2, "w2", j !== null && j > 0 ? j - 1 : null, "amber"),
          },
        ],
        matrices: [buildMatrix(i, j)],
        result: {
          label: "Minimum edits",
          value: String(dp[m][n]),
          tone: done ? "emerald" : "sky",
        },
      },
    });
  }

  pushFrame(
    0,
    0,
    "Seed the matrix borders with insertion and deletion counts.",
    "initialize",
    "slate",
    [1, 2, 3, 4],
    "Turning a word prefix into an empty string needs deletions, and turning an empty string into a prefix needs insertions.",
    "The first row and column encode all pure one-operation chains needed to anchor the full DP matrix.",
    "Base borders are the only cells that do not compare three predecessor operations."
  );

  for (let i = 1; i <= m; i += 1) {
    for (let j = 1; j <= n; j += 1) {
      pushFrame(
        i,
        j,
        `Inspect dp[${i}][${j}] for "${word1[i - 1]}" -> "${word2[j - 1]}".`,
        "inspect",
        "amber",
        [5, 6, 7, 8, 9, 10],
        "This cell asks how much work it takes to align the current source and target prefixes.",
        "The matrix state depends only on already-resolved neighboring prefixes, which is why the row-major fill order works.",
        "The active characters decide whether the diagonal can be copied or a new edit must be paid."
      );

      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];

        pushFrame(
          i,
          j,
          `Characters match, so dp[${i}][${j}] copies the diagonal value ${dp[i][j]}.`,
          "update",
          "sky",
          [7, 8],
          "Matching letters need no new edit, so the diagonal answer carries forward unchanged.",
          "Character equality collapses the transition to the diagonal predecessor because no operation is required.",
          "A match lets the prefixes advance together for free."
        );
      } else {
        dp[i][j] =
          1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);

        pushFrame(
          i,
          j,
          `Mismatch: choose 1 + min(delete ${dp[i - 1][j]}, insert ${dp[i][j - 1]}, replace ${dp[i - 1][j - 1]}) = ${dp[i][j]}.`,
          "update",
          "rose",
          [9, 10],
          "A mismatch pays exactly one new edit on top of the cheapest predecessor operation.",
          "The recurrence unifies delete, insert, and replace by taking the minimum of their predecessor costs and adding one.",
          "The edit lab keeps only the cheapest repair path for this prefix pair."
        );
      }
    }
  }

  pushFrame(
    null,
    null,
    `The bottom-right cell settles at ${dp[m][n]}, so that is the minimum edit distance.`,
    "complete",
    "emerald",
    [13, 14],
    "The destination cell answers the full transformation from word1 to word2.",
    "Because it represents both complete prefixes, dp[m][n] is the global optimum edit count.",
    "The edit matrix is fully solved once the bottom-right cell stabilizes.",
    true
  );

  return trace;
}
