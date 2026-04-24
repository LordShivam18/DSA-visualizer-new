import type {
  DpTraceStep,
  InputFieldConfig,
  PresetConfig,
  VisualCell,
  VisualMatrix,
  VisualTone,
} from "@/components/dp/shared/types";
import { createTraceRecorder } from "@/components/dp/shared/trace";

export const inputFields: InputFieldConfig[] = [
  { key: "s1", label: "s1", placeholder: "aabcc" },
  { key: "s2", label: "s2", placeholder: "dbbca" },
  { key: "s3", label: "s3", placeholder: "aadbbcbcac" },
];

export const defaultInputs = {
  s1: "aabcc",
  s2: "dbbca",
  s3: "aadbbcbcac",
};

export type InterleavingInputs = typeof defaultInputs;

export const presets: PresetConfig<InterleavingInputs>[] = [
  {
    name: "Example 1",
    summary: "=> true",
    values: { s1: "aabcc", s2: "dbbca", s3: "aadbbcbcac" },
  },
  {
    name: "Example 2",
    summary: "=> false",
    values: { s1: "aabcc", s2: "dbbca", s3: "aadbbbaccc" },
  },
  {
    name: "Short",
    summary: "=> true",
    values: { s1: "ab", s2: "cd", s3: "acbd" },
  },
];

export const code = [
  "function isInterleave(s1: string, s2: string, s3: string): boolean {",
  "  if (s1.length + s2.length !== s3.length) return false;",
  "  const dp = Array.from({ length: s1.length + 1 }, () => Array(s2.length + 1).fill(false));",
  "  dp[0][0] = true;",
  "  for (let i = 0; i <= s1.length; i += 1) {",
  "    for (let j = 0; j <= s2.length; j += 1) {",
  "      if (i === 0 && j === 0) continue;",
  "      const takeS1 = i > 0 && dp[i - 1][j] && s1[i - 1] === s3[i + j - 1];",
  "      const takeS2 = j > 0 && dp[i][j - 1] && s2[j - 1] === s3[i + j - 1];",
  "      dp[i][j] = takeS1 || takeS2;",
  "    }",
  "  }",
  "  return dp[s1.length][s2.length];",
  "}",
];

export const complexity = ["Time O(m*n)", "Space O(m*n)", "Pattern: String weave DP"];

export function generateTrace(inputs: InterleavingInputs): DpTraceStep[] {
  const s1 = inputs.s1;
  const s2 = inputs.s2;
  const s3 = inputs.s3;
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array.from({ length: n + 1 }, () => false));
  const { trace, pushStep } = createTraceRecorder();

  if (m + n !== s3.length) {
    return [
      {
        step: 0,
        action: "The lengths do not add up, so s3 cannot be an interleaving of s1 and s2.",
        actionKind: "reject",
        actionTone: "rose",
        codeLines: [1, 2],
        beginnerNote: "If the total character count is wrong, the weave is impossible before any DP starts.",
        expertNote: "Length mismatch is a necessary-and-sufficient early rejection guard for interleaving DP.",
        focus: "The weave loom stops before creating a grid because the target length is invalid.",
        hints: ["An interleaving must consume every character from s1 and s2 exactly once."],
        metrics: [
          { label: "|s1| + |s2|", value: m + n, tone: "slate" },
          { label: "|s3|", value: s3.length, tone: "rose" },
        ],
        pointerChips: [],
        done: true,
        resultLabel: "isInterleave",
        resultValue: "false",
        animation: { type: "highlight", targets: [], duration: 400 },
        highlights: {},
        state: {
          scene: "interleave",
          headline: "The weave cannot even start",
          subheadline: "The target string has the wrong length, so no interleaving grid can match it.",
          result: { label: "Interleaving possible?", value: "false", tone: "rose" },
        },
      },
    ];
  }

  dp[0][0] = true;

  function buildStringCells(source: string, prefix: number, key: string, tone: VisualTone) {
    return source.split("").map((char, index) => ({
      id: `${key}-${index}`,
      label: String(index),
      value: char,
      tone: index < prefix ? tone : "slate",
      tags: index === prefix - 1 ? ["used"] : [],
      variant: "char" as const,
    }));
  }

  function buildTargetCells(k: number | null): VisualCell[] {
    return s3.split("").map((char, index) => ({
      id: `s3-${index}`,
      label: String(index),
      value: char,
      tone: k !== null && index === k - 1 ? "sky" : index < (k ?? 0) ? "emerald" : "slate",
      tags: k !== null && index === k - 1 ? ["target"] : [],
      variant: "char",
    }));
  }

  function buildMatrix(i: number | null, j: number | null): VisualMatrix {
    return {
      id: "weave-grid",
      title: "Interleaving grid",
      subtitle: "dp[i][j] is true when the first i chars of s1 and first j chars of s2 can weave into the first i+j chars of s3.",
      variant: "grid",
      rows: dp.map((row, rowIndex) => ({
        id: `row-${rowIndex}`,
        label: String(rowIndex),
        cells: row.map((value, colIndex) => ({
          id: `dp-${rowIndex}-${colIndex}`,
          value: value ? "T" : "F",
          tone:
            i === rowIndex && j === colIndex
              ? "sky"
              : value
              ? "emerald"
              : "rose",
          tags: i === rowIndex && j === colIndex ? ["cell"] : value ? ["valid"] : [],
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
    const k = i !== null && j !== null ? i + j : null;

    pushStep({
      action,
      actionKind,
      actionTone,
      codeLines,
      beginnerNote,
      expertNote,
      focus,
      hints: [
        "dp[i][j] means a prefix weave of length i + j is achievable.",
        "A true state can be reached either by taking the next character from s1 or from s2.",
        "The final answer is the bottom-right DP cell.",
      ],
      metrics: [
        { label: "i", value: i ?? "-", tone: "sky" },
        { label: "j", value: j ?? "-", tone: "amber" },
        { label: "Target prefix", value: k ?? s3.length, tone: "violet" },
      ],
      pointerChips: [
        { label: "i", value: i === null ? "done" : String(i), tone: "sky" },
        { label: "j", value: j === null ? "-" : String(j), tone: "amber" },
      ],
      done,
      resultLabel: "isInterleave",
      resultValue: String(dp[m][n]),
      animation: {
        type: done ? "highlight" : "highlight",
        targets:
          i === null || j === null
            ? ["result"]
            : [`dp-${i}-${j}`, ...(k && k > 0 ? [`s3-${k - 1}`] : [])],
        duration: 820,
      },
      highlights: {
        primaryIds:
          i === null || j === null
            ? ["result"]
            : [`dp-${i}-${j}`, ...(k && k > 0 ? [`s3-${k - 1}`] : [])],
      },
      state: {
        scene: "interleave",
        headline: "Two strings weave a single target prefix on the loom",
        subheadline:
          "Each DP cell asks whether the next target character can be claimed from s1 above or s2 from the left.",
        sequences: [
          {
            id: "s1",
            title: "s1 ribbon",
            subtitle: "Emerald characters are already consumed by the current prefix.",
            variant: "char",
            cells: buildStringCells(s1, i ?? m, "s1", "emerald"),
          },
          {
            id: "s2",
            title: "s2 ribbon",
            subtitle: "Amber progress comes from the second source string.",
            variant: "char",
            cells: buildStringCells(s2, j ?? n, "s2", "amber"),
          },
          {
            id: "s3",
            title: "Target ribbon",
            subtitle: "Blue marks the target character currently being matched.",
            variant: "char",
            cells: buildTargetCells(k),
          },
        ],
        matrices: [buildMatrix(i, j)],
        result: {
          label: "Interleaving possible?",
          value: String(dp[m][n]),
          tone: done ? (dp[m][n] ? "emerald" : "rose") : "sky",
        },
      },
    });
  }

  pushFrame(
    0,
    0,
    "Seed the weave grid with dp[0][0] = true. An empty prefix can always weave into an empty target.",
    "initialize",
    "slate",
    [1, 2, 3, 4],
    "The loom starts at the empty weave state.",
    "The origin represents consuming zero characters from every string, which is always valid.",
    "Every reachable weave state descends from the origin."
  );

  for (let i = 0; i <= m; i += 1) {
    for (let j = 0; j <= n; j += 1) {
      if (i === 0 && j === 0) {
        continue;
      }

      pushFrame(
        i,
        j,
        `Inspect weave cell (${i}, ${j}) for target prefix length ${i + j}.`,
        "inspect",
        "amber",
        [5, 6, 7, 8, 9],
        "This state checks whether the next target character can be supplied by s1 or s2.",
        "The DP transition is a logical OR of the two predecessor states that could extend into this cell.",
        "A valid weave at this cell must end by taking one character from exactly one source."
      );

      const takeS1 = i > 0 && dp[i - 1][j] && s1[i - 1] === s3[i + j - 1];
      const takeS2 = j > 0 && dp[i][j - 1] && s2[j - 1] === s3[i + j - 1];
      dp[i][j] = takeS1 || takeS2;

      pushFrame(
        i,
        j,
        `Set dp[${i}][${j}] = ${dp[i][j]} using ${takeS1 ? "s1" : takeS2 ? "s2" : "no matching source"} for "${s3[i + j - 1]}".`,
        "update",
        dp[i][j] ? "sky" : "rose",
        [8, 9, 10],
        "The cell becomes true only if at least one source string can legally supply the next target character.",
        "The grid captures prefix compatibility: each true state certifies a valid interleaving of the consumed prefixes.",
        "Once written, this cell can support larger weave prefixes."
      );
    }
  }

  pushFrame(
    null,
    null,
    `The weave finishes with dp[${m}][${n}] = ${dp[m][n]}.`,
    "complete",
    dp[m][n] ? "emerald" : "rose",
    [12],
    "The final DP cell tells us whether the whole target can be woven from both source strings.",
    "Because the bottom-right cell consumes every character of s1 and s2, it exactly answers the full interleaving question.",
    "The loom is complete once the bottom-right weave state settles.",
    true
  );

  return trace;
}
