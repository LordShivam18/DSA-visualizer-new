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
    placeholder: "[2,7,9,3,1]",
    help: "Cash available in each house along the street.",
  },
];

export const defaultInputs = {
  nums: "[2,7,9,3,1]",
};

export type HouseRobberInputs = typeof defaultInputs;

export const presets: PresetConfig<HouseRobberInputs>[] = [
  { name: "Example 1", summary: "=> 4", values: { nums: "[1,2,3,1]" } },
  { name: "Example 2", summary: "=> 12", values: { nums: "[2,7,9,3,1]" } },
  { name: "Spread out", summary: "=> 16", values: { nums: "[4,1,2,9,1,5]" } },
];

export const code = [
  "function rob(nums: number[]): number {",
  "  const dp = Array(nums.length + 1).fill(0);",
  "  dp[1] = nums[0] ?? 0;",
  "  for (let i = 2; i <= nums.length; i += 1) {",
  "    const take = nums[i - 1] + dp[i - 2];",
  "    const skip = dp[i - 1];",
  "    dp[i] = Math.max(take, skip);",
  "  }",
  "  return dp[nums.length];",
  "}",
];

export const complexity = ["Time O(n)", "Space O(n)", "Pattern: Take or skip"];

function toneForHouse(index: number, currentHouse: number | null): VisualTone {
  if (currentHouse === index) {
    return "sky";
  }

  if (currentHouse !== null && index === currentHouse - 1) {
    return "rose";
  }

  if (currentHouse !== null && index === currentHouse - 2) {
    return "amber";
  }

  return "slate";
}

export function generateTrace(inputs: HouseRobberInputs): DpTraceStep[] {
  const nums = parseNumberList(inputs.nums);
  const n = nums.length;
  const dp = Array.from({ length: n + 1 }, () => 0);
  const decisions: Array<{ prefix: number; take: number; skip: number; best: number }> = [];
  const { trace, pushStep } = createTraceRecorder();

  if (n >= 1) {
    dp[1] = nums[0];
  }

  function buildHouseCells(currentHouse: number | null): VisualCell[] {
    return nums.map((value, index) => ({
      id: `house-${index}`,
      label: `house ${index + 1}`,
      value,
      caption: "$ cash",
      tone: toneForHouse(index, currentHouse),
      tags:
        currentHouse === index
          ? ["inspect"]
          : currentHouse !== null && index === currentHouse - 1
          ? ["blocked"]
          : [],
      variant: "house",
    }));
  }

  function buildPrefixCells(currentPrefix: number | null): VisualCell[] {
    return Array.from({ length: n + 1 }, (_, prefix) => ({
      id: `dp-${prefix}`,
      label: `first ${prefix}`,
      value: dp[prefix],
      caption: prefix === 0 ? "none" : "best haul",
      tone:
        currentPrefix === prefix
          ? "sky"
          : prefix < (currentPrefix ?? Infinity)
          ? "emerald"
          : "slate",
      tags:
        currentPrefix === prefix
          ? ["write"]
          : prefix < (currentPrefix ?? Infinity)
          ? ["locked"]
          : [],
    }));
  }

  function pushFrame(
    prefix: number | null,
    action: string,
    actionKind: DpTraceStep["actionKind"],
    actionTone: DpTraceStep["actionTone"],
    codeLines: number[],
    beginnerNote: string,
    expertNote: string,
    focus: string,
    take = 0,
    skip = 0,
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
        "The robber can never take adjacent houses in the same plan.",
        "dp[i] means the best haul using only the first i houses.",
        "Each new prefix compares two safe options: rob this house or leave it.",
      ],
      metrics: [
        { label: "Houses", value: n, tone: "slate" },
        { label: "Take", value: take, tone: "amber" },
        { label: "Skip", value: skip, tone: "rose" },
      ],
      pointerChips: [
        { label: "prefix", value: prefix === null ? "done" : String(prefix), tone: "sky" },
        {
          label: "house",
          value: prefix === null || prefix === 0 ? "-" : String(prefix - 1),
          tone: "amber",
        },
      ],
      done,
      resultLabel: "maxLoot",
      resultValue: String(dp[n]),
      animation: {
        type: prefix === null ? "highlight" : "update",
        targets:
          prefix === null
            ? ["dp-result"]
            : [`house-${Math.max(prefix - 1, 0)}`, `dp-${prefix}`],
        duration: 780,
      },
      highlights: {
        primaryIds:
          prefix === null
            ? ["dp-result"]
            : [`house-${Math.max(prefix - 1, 0)}`, `dp-${prefix}`],
        secondaryIds:
          prefix !== null
            ? [`dp-${Math.max(prefix - 1, 0)}`, `dp-${Math.max(prefix - 2, 0)}`]
            : [],
      },
      state: {
        scene: "heist",
        headline: "Each house triggers a take-vs-skip showdown",
        subheadline:
          "The safe plan is always the better of robbing the current house with a gap or preserving the previous best prefix.",
        sequences: [
          {
            id: "houses",
            title: "Street of houses",
            subtitle: "The active house glows blue. Its left neighbor is marked red because it cannot be robbed together.",
            variant: "house",
            cells: buildHouseCells(prefix === null ? null : Math.max(prefix - 1, 0)),
          },
          {
            id: "prefix-dp",
            title: "Best haul by prefix",
            subtitle: "Each DP slot stores the most money that can be stolen from the first i houses.",
            cells: buildPrefixCells(prefix),
          },
        ],
        ledgers: [
          {
            id: "decision-ledger",
            title: "Heist decisions",
            subtitle: "Each prefix locks in the better of robbing or skipping.",
            items: decisions.map((decision) => ({
              id: `decision-${decision.prefix}`,
              label: `first ${decision.prefix} houses`,
              value: `max(${decision.take}, ${decision.skip}) = ${decision.best}`,
              tone: "emerald",
              note: decision.best === decision.take ? "rob current" : "skip current",
            })),
            emptyLabel: "The planner has not evaluated any house beyond the base case yet.",
          },
        ],
        callouts: [
          {
            id: "street",
            label: "Street",
            value: formatArray(nums),
            tone: "violet",
          },
          {
            id: "best",
            label: "Best haul so far",
            value: String(prefix === null ? dp[n] : dp[prefix]),
            tone: "emerald",
          },
        ],
        result: {
          label: "Maximum safe loot",
          value: String(dp[n]),
          tone: done ? "emerald" : "sky",
        },
      },
    });
  }

  pushFrame(
    n >= 1 ? 1 : 0,
    n === 0
      ? "The street is empty, so the best safe loot is 0."
      : `Start with the first house: robbing it yields ${dp[1]}, while robbing nothing yields 0.`,
    "initialize",
    "slate",
    [1, 2, 3],
    "The DP table starts by answering the tiniest street prefixes.",
    "Base prefixes avoid edge cases in the loop and make the recurrence uniform.",
    "Before comparing choices, the solver seeds the empty street and first house.",
    nums[0] ?? 0,
    0,
    n === 0
  );

  for (let prefix = 2; prefix <= n; prefix += 1) {
    const take = nums[prefix - 1] + dp[prefix - 2];
    const skip = dp[prefix - 1];

    pushFrame(
      prefix,
      `For house ${prefix}, compare robbing it (${nums[prefix - 1]} + ${dp[prefix - 2]} = ${take}) against skipping it (${skip}).`,
      "inspect",
      "amber",
      [4, 5, 6],
      "The planner computes the value of taking this house and the value of leaving it.",
      "Every valid plan for the first i houses must end in exactly one of these two mutually exclusive cases.",
      "This prefix is the first moment where the street branches into a rob-or-skip decision.",
      take,
      skip
    );

    dp[prefix] = Math.max(take, skip);
    decisions.push({ prefix, take, skip, best: dp[prefix] });

    pushFrame(
      prefix,
      `Write dp[${prefix}] = ${dp[prefix]}. The best plan for the first ${prefix} houses is now locked.`,
      "update",
      "sky",
      [5, 6, 7],
      "Whichever choice is larger becomes the permanent answer for this prefix.",
      "Optimal substructure holds because the chosen branch already contains the best safe plan for the smaller prefix it depends on.",
      "Once the best prefix value is stored, later houses can build on it without revisiting old choices.",
      take,
      skip
    );
  }

  pushFrame(
    null,
    `The planner reaches the end of the street. The maximum safe haul is ${dp[n]}.`,
    "complete",
    "emerald",
    [8, 9],
    "The final DP slot holds the best robbery plan for the entire street.",
    "A single left-to-right pass is enough because each prefix depends only on the previous two prefix answers.",
    "The street-wide answer is the final stabilized prefix value.",
    n >= 1 ? nums[n - 1] : 0,
    n >= 1 ? dp[Math.max(n - 1, 0)] : 0,
    true
  );

  return trace;
}
