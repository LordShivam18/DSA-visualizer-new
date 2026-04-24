import type {
  DpTraceStep,
  InputFieldConfig,
  PresetConfig,
  VisualCell,
  VisualTone,
} from "@/components/dp/shared/types";
import { formatArray, parseNumberList } from "@/components/dp/shared/parsers";
import { createTraceRecorder } from "@/components/dp/shared/trace";

export const inputFields: InputFieldConfig[] = [
  {
    key: "nums",
    label: "nums",
    placeholder: "[10,9,2,5,3,7,101,18]",
    help: "Sequence to scan for increasing subsequences.",
  },
];

export const defaultInputs = {
  nums: "[10,9,2,5,3,7,101,18]",
};

export type LisInputs = typeof defaultInputs;

export const presets: PresetConfig<LisInputs>[] = [
  {
    name: "Example 1",
    summary: "=> 4",
    values: { nums: "[10,9,2,5,3,7,101,18]" },
  },
  {
    name: "Example 2",
    summary: "=> 4",
    values: { nums: "[0,1,0,3,2,3]" },
  },
  {
    name: "Flat",
    summary: "=> 1",
    values: { nums: "[7,7,7,7,7]" },
  },
];

export const code = [
  "function lengthOfLIS(nums: number[]): number {",
  "  const dp = Array(nums.length).fill(1);",
  "  let best = nums.length > 0 ? 1 : 0;",
  "  for (let i = 0; i < nums.length; i += 1) {",
  "    for (let j = 0; j < i; j += 1) {",
  "      if (nums[j] < nums[i]) {",
  "        dp[i] = Math.max(dp[i], dp[j] + 1);",
  "      }",
  "    }",
  "    best = Math.max(best, dp[i]);",
  "  }",
  "  return best;",
  "}",
];

export const complexity = ["Time O(n²)", "Space O(n)", "Pattern: Subsequence extension"];

function valueTone(index: number, i: number | null, j: number | null): VisualTone {
  if (index === i) {
    return "sky";
  }

  if (index === j) {
    return "amber";
  }

  if (i !== null && index < i) {
    return "emerald";
  }

  return "slate";
}

export function generateTrace(inputs: LisInputs): DpTraceStep[] {
  const nums = parseNumberList(inputs.nums);
  const n = nums.length;
  const dp = Array.from({ length: n }, () => 1);
  const parent = Array.from({ length: n }, () => -1);
  const { trace, pushStep } = createTraceRecorder();
  let best = n > 0 ? 1 : 0;

  function buildValueCells(i: number | null, j: number | null): VisualCell[] {
    return nums.map((value, index) => ({
      id: `num-${index}`,
      label: `idx ${index}`,
      value,
      tone: valueTone(index, i, j),
      tags:
        index === i ? ["i"] : index === j ? ["j"] : index < (i ?? Infinity) ? ["settled"] : [],
      variant: "skyline",
      caption: `len ${dp[index] ?? 1}`,
    }));
  }

  function buildDpCells(i: number | null): VisualCell[] {
    return dp.map((value, index) => ({
      id: `dp-${index}`,
      label: `end @ ${index}`,
      value,
      tone: index === i ? "sky" : index < (i ?? Infinity) ? "emerald" : "slate",
      tags: parent[index] >= 0 ? [`from ${parent[index]}`] : [],
    }));
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
        "dp[i] means the best increasing subsequence length that ends exactly at index i.",
        "Index j can extend i only when nums[j] < nums[i].",
        "The global answer is the maximum dp value seen anywhere.",
      ],
      metrics: [
        { label: "Best LIS", value: best, tone: "emerald" },
        { label: "Current i", value: i === null ? "-" : i, tone: "sky" },
        { label: "Current j", value: j === null ? "-" : j, tone: "amber" },
      ],
      pointerChips: [
        { label: "i", value: i === null ? "done" : String(i), tone: "sky" },
        { label: "j", value: j === null ? "-" : String(j), tone: "amber" },
      ],
      done,
      resultLabel: "lisLength",
      resultValue: String(best),
      animation: {
        type: done ? "highlight" : "update",
        targets:
          i === null
            ? ["dp-result"]
            : [`num-${i}`, `dp-${i}`, ...(j !== null ? [`num-${j}`, `dp-${j}`] : [])],
        duration: 790,
      },
      highlights: {
        primaryIds:
          i === null
            ? ["dp-result"]
            : [`num-${i}`, `dp-${i}`, ...(j !== null ? [`num-${j}`, `dp-${j}`] : [])],
      },
      state: {
        scene: "skyline",
        headline: "Each index tries to rise from a smaller earlier tower",
        subheadline:
          "The skyline view shows how every number looks left for a lower launch pad and grows its own subsequence length.",
        sequences: [
          {
            id: "values",
            title: "Input skyline",
            subtitle: "Blue is the destination tower i, amber is the candidate predecessor j.",
            variant: "skyline",
            cells: buildValueCells(i, j),
          },
          {
            id: "dp",
            title: "LIS lengths by ending index",
            subtitle: "Each DP slot says how long the best increasing subsequence is when it must end at that index.",
            cells: buildDpCells(i),
          },
        ],
        ledgers: [
          {
            id: "parents",
            title: "Best predecessor links",
            subtitle: "Green rows show where the current best chain for an index comes from.",
            items: parent
              .map((value, index) =>
                value >= 0
                  ? {
                      id: `parent-${index}`,
                      label: `end @ ${index}`,
                      value: `${value} -> ${index}`,
                      tone: "emerald" as const,
                    }
                  : null
              )
              .filter((entry): entry is { id: string; label: string; value: string; tone: "emerald" } => entry !== null),
            emptyLabel: "No improving predecessor has been recorded yet.",
          },
        ],
        callouts: [
          {
            id: "sequence",
            label: "Array",
            value: formatArray(nums),
            tone: "violet",
          },
        ],
        result: {
          label: "Longest increasing subsequence length",
          value: String(best),
          tone: done ? "emerald" : "sky",
        },
      },
    });
  }

  pushFrame(
    n > 0 ? 0 : null,
    null,
    n === 0
      ? "An empty array has LIS length 0."
      : "Start every index at subsequence length 1 because a single value is always an increasing subsequence.",
    "initialize",
    "slate",
    [1, 2, 3],
    "Before comparing indices, every number can at least stand alone.",
    "The base value of 1 captures the trivial subsequence containing only nums[i].",
    "Initialization guarantees each index already has a valid subsequence ending at itself.",
    n === 0
  );

  for (let i = 0; i < n; i += 1) {
    pushFrame(
      i,
      null,
      `Lock onto index ${i}. Search left for smaller values that can extend into ${nums[i]}.`,
      "inspect",
      "sky",
      [4],
      "The solver fixes an end index and asks which earlier numbers can lead into it.",
      "Because dp[i] is defined as a subsequence ending exactly at i, every valid predecessor must be to the left of i.",
      "This frame isolates one destination index before checking all possible incoming links."
    );

    for (let j = 0; j < i; j += 1) {
      pushFrame(
        i,
        j,
        `Compare nums[${j}] = ${nums[j]} against nums[${i}] = ${nums[i]}.`,
        "compare",
        nums[j] < nums[i] ? "amber" : "rose",
        [5, 6],
        "The candidate predecessor only works if its value is strictly smaller than the destination value.",
        "The increasing-subsequence constraint is enforced locally by the comparison nums[j] < nums[i].",
        "A valid predecessor must preserve strict monotonic growth."
      );

      if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
        dp[i] = dp[j] + 1;
        parent[i] = j;

        pushFrame(
          i,
          j,
          `Update dp[${i}] to ${dp[i]} using predecessor ${j}.`,
          "update",
          "sky",
          [6, 7],
          "This predecessor creates a longer increasing subsequence ending at the current index.",
          "Taking the max over all valid predecessors guarantees dp[i] is the best subsequence length ending at i.",
          "The destination index inherits the best chain seen so far.",
        );
      }
    }

    best = Math.max(best, dp[i]);

    pushFrame(
      i,
      parent[i] >= 0 ? parent[i] : null,
      `Finish index ${i}. The best subsequence ending here has length ${dp[i]}.`,
      "settle",
      "emerald",
      [9, 10],
      "Once all left candidates are checked, the current index becomes final.",
      "No future index can change dp[i] because the definition only depends on earlier positions.",
      "Settling an index means its subsequence length is now safe to reuse downstream."
    );
  }

  pushFrame(
    null,
    null,
    `All indices are settled. The longest increasing subsequence length is ${best}.`,
    "complete",
    "emerald",
    [11, 12],
    "The answer is the maximum DP value across every ending index.",
    "The global optimum may end anywhere, so the algorithm keeps a running maximum while scanning.",
    "The skyline's tallest DP tower is the LIS length.",
    true
  );

  return trace;
}
