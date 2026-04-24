import type {
  DpTraceStep,
  InputFieldConfig,
  PresetConfig,
  VisualCell,
  VisualTone,
} from "@/components/dp/shared/types";
import { parseInteger } from "@/components/dp/shared/parsers";
import { createTraceRecorder } from "@/components/dp/shared/trace";

export const inputFields: InputFieldConfig[] = [
  {
    key: "n",
    label: "n",
    placeholder: "5",
    help: "Number of steps in the staircase.",
  },
];

export const defaultInputs = {
  n: "5",
};

export type ClimbingStairsInputs = typeof defaultInputs;

export const presets: PresetConfig<ClimbingStairsInputs>[] = [
  { name: "Example 1", summary: "n = 2 => 2", values: { n: "2" } },
  { name: "Example 2", summary: "n = 3 => 3", values: { n: "3" } },
  { name: "Classic", summary: "n = 5 => 8", values: { n: "5" } },
];

export const code = [
  "function climbStairs(n: number): number {",
  "  if (n <= 1) return 1;",
  "  const dp = Array(n + 1).fill(0);",
  "  dp[0] = 1;",
  "  dp[1] = 1;",
  "  for (let step = 2; step <= n; step += 1) {",
  "    dp[step] = dp[step - 1] + dp[step - 2];",
  "  }",
  "  return dp[n];",
  "}",
];

export const complexity = ["Time O(n)", "Space O(n)", "Pattern: Fibonacci DP"];

function toneForIndex(index: number, current: number | null, n: number): VisualTone {
  if (current !== null && index === current) {
    return "sky";
  }

  if (current !== null && index === current - 1) {
    return "violet";
  }

  if (current !== null && index === current - 2) {
    return "amber";
  }

  if (index <= n) {
    return "emerald";
  }

  return "slate";
}

export function generateTrace(inputs: ClimbingStairsInputs): DpTraceStep[] {
  const n = Math.max(0, parseInteger(inputs.n, 5));
  const dp = Array.from({ length: n + 1 }, () => null as number | null);
  const formulas: string[] = [];
  const { trace, pushStep } = createTraceRecorder();

  dp[0] = 1;
  if (n >= 1) {
    dp[1] = 1;
  }

  function buildCells(current: number | null): VisualCell[] {
    return Array.from({ length: n + 1 }, (_, index) => ({
      id: `dp-${index}`,
      label: `step ${index}`,
      value: dp[index] ?? "?",
      caption:
        index === 0 ? "ground" : index === n ? "top" : index === 1 ? "first" : undefined,
      tone: toneForIndex(index, current, dp[index] === null ? index - 1 : n),
      tags:
        current === index
          ? ["target"]
          : current !== null && index === current - 1
          ? ["one-step"]
          : current !== null && index === current - 2
          ? ["two-step"]
          : dp[index] !== null
          ? ["known"]
          : [],
      variant: "stairs",
    }));
  }

  function pushFrame(
    current: number | null,
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
        "Each landing can be reached from the previous landing or the one two levels below.",
        "The DP table stores complete answers for smaller staircases.",
        "Once a landing is resolved, it never changes again.",
      ],
      metrics: [
        { label: "n", value: n, tone: "slate" },
        { label: "Resolved", value: dp.filter((value) => value !== null).length, tone: "emerald" },
        {
          label: "Current Ways",
          value: current !== null ? String(dp[current] ?? "?") : String(dp[n] ?? 1),
          tone: "sky",
        },
      ],
      pointerChips: [
        { label: "step", value: current === null ? "done" : String(current), tone: "sky" },
        {
          label: "step-1",
          value: current !== null && current - 1 >= 0 ? String(current - 1) : "-",
          tone: "violet",
        },
        {
          label: "step-2",
          value: current !== null && current - 2 >= 0 ? String(current - 2) : "-",
          tone: "amber",
        },
      ],
      done,
      resultLabel: "waysToTop",
      resultValue: String(dp[n] ?? 1),
      animation: {
        type: done ? "highlight" : current === null ? "insert" : "update",
        targets:
          current === null
            ? ["dp-0", ...(n >= 1 ? ["dp-1"] : [])]
            : [`dp-${current}`],
        duration: 760,
      },
      highlights: {
        primaryIds:
          current === null ? ["dp-0", ...(n >= 1 ? ["dp-1"] : [])] : [`dp-${current}`],
        secondaryIds:
          current !== null
            ? [`dp-${Math.max(current - 1, 0)}`, `dp-${Math.max(current - 2, 0)}`]
            : [],
      },
      state: {
        scene: "stairs",
        headline: "Ways accumulate one landing at a time",
        subheadline:
          "This staircase is a Fibonacci corridor: every new landing inherits paths from one step back and two steps back.",
        sequences: [
          {
            id: "stairs",
            title: "Stairway DP",
            subtitle:
              "Blue marks the landing being solved, violet and amber are the contributing landings beneath it.",
            variant: "stairs",
            cells: buildCells(current),
          },
        ],
        ledgers: [
          {
            id: "formula-ledger",
            title: "Resolved formulas",
            subtitle: "Each line records the recurrence used for a landing.",
            items: formulas.map((formula, index) => ({
              id: `formula-${index}`,
              label: `f(${index + 2})`,
              value: formula,
              tone: "emerald",
            })),
            emptyLabel: "Base cases are ready. The recurrence has not expanded yet.",
          },
        ],
        callouts: [
          {
            id: "recurrence",
            label: "Recurrence",
            value:
              current !== null && current >= 2
                ? `f(${current}) = f(${current - 1}) + f(${current - 2})`
                : "f(step) = f(step-1) + f(step-2)",
            tone: "sky",
          },
          {
            id: "top",
            label: "Top landing",
            value: String(n),
            tone: "violet",
          },
        ],
        result: {
          label: "Distinct ways",
          value: String(dp[n] ?? 1),
          tone: done ? "emerald" : "sky",
        },
      },
    });
  }

  pushFrame(
    n <= 1 ? null : 1,
    n <= 1
      ? "With zero or one stair, there is exactly one way to stand at the top."
      : "Seed the staircase with base cases: one way to stand on the ground and one way to reach the first step.",
    "initialize",
    "slate",
    [1, 2, 3, 4, 5],
    "We start by filling the tiny staircases that can be answered without any recurrence.",
    "The DP base states anchor the recurrence and make every later state well-defined.",
    "Base cases are the only places where the recurrence does not look backward.",
    n <= 1
  );

  for (let stepIndex = 2; stepIndex <= n; stepIndex += 1) {
    pushFrame(
      stepIndex,
      `Inspect landing ${stepIndex}. It can be reached from landing ${stepIndex - 1} or landing ${stepIndex - 2}.`,
      "inspect",
      "amber",
      [6],
      "The solver focuses on one landing and looks at the only two jumps allowed into it.",
      "Because moves are restricted to 1 or 2 steps, the transition fan-in is always exactly two states.",
      "Every legal path into this landing must end at one of the two preceding landings."
    );

    const resolvedValue = (dp[stepIndex - 1] ?? 0) + (dp[stepIndex - 2] ?? 0);
    dp[stepIndex] = resolvedValue;
    formulas.push(`${dp[stepIndex - 1]} + ${dp[stepIndex - 2]} = ${resolvedValue}`);

    pushFrame(
      stepIndex,
      `Resolve landing ${stepIndex}: ${dp[stepIndex - 1]} + ${dp[stepIndex - 2]} = ${resolvedValue}.`,
      "update",
      "sky",
      [6, 7],
      "The two incoming path counts merge into the answer for this landing.",
      "DP works here because counting paths is additive across disjoint final moves.",
      "Once this sum is written, every larger landing can trust it as a complete sub-answer."
    );
  }

  pushFrame(
    null,
    `All landings are resolved. The staircase with ${n} steps has ${dp[n] ?? 1} distinct climbing plans.`,
    "complete",
    "emerald",
    [8, 9],
    "The answer sits in the last landing of the DP table.",
    "The algorithm finishes after a single forward pass because each state depends only on already-computed smaller states.",
    "The final landing stores the complete answer for the original problem.",
    true
  );

  return trace;
}
