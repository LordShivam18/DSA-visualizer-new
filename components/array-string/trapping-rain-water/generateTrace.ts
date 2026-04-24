import { parseNumberList } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type TrappingRainWaterState = {
  height: number[];
  trapped: number[];
  leftMax: number;
  rightMax: number;
  water: number;
  side: "left" | "right" | null;
  currentIndex: number | null;
  result: number | null;
};

type TrappingRainWaterPointers = {
  left: number | null;
  right: number | null;
  currentIndex: number | null;
};

export type TrappingRainWaterTraceStep = TeachingTraceFrame & {
  state: TrappingRainWaterState;
  pointers: TrappingRainWaterPointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(rawHeight: string) {
  const height = parseNumberList(rawHeight);
  const trapped = new Array(height.length).fill(0);
  const trace: TrappingRainWaterTraceStep[] = [];

  let left: number | null = height.length === 0 ? null : 0;
  let right: number | null = height.length === 0 ? null : height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;
  let side: TrappingRainWaterState["side"] = null;
  let currentIndex: number | null = null;
  let result: number | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: TrappingRainWaterTraceStep["actionTone"],
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
        { label: "Water", value: water, tone: "green" },
        { label: "Left Max", value: leftMax, tone: "cyan" },
        { label: "Right Max", value: rightMax, tone: "purple" },
      ],
      pointerChips: [
        { label: "left", value: pointerValue(left), tone: "cyan" },
        { label: "right", value: pointerValue(right), tone: "purple" },
        {
          label: "side",
          value: side ?? "idle",
          tone: side === "left" ? "cyan" : side === "right" ? "purple" : "slate",
        },
      ],
      done,
      state: {
        height: [...height],
        trapped: [...trapped],
        leftMax,
        rightMax,
        water,
        side,
        currentIndex,
        result,
      },
      pointers: {
        left,
        right,
        currentIndex,
      },
    });
  }

  pushStep(
    "Start with two pointers on the edges. The shorter side decides which pointer can be resolved safely at each step.",
    "initialize",
    "slate",
    [1, 2, 3],
    "We only need the best wall seen so far from each side and whichever side is currently lower.",
    "If height[left] <= height[right], then rightMax is irrelevant for deciding water at left because the limiting wall is already on the left side's smaller boundary.",
    "The lower edge determines which side can be finalized immediately.",
    [
      "leftMax remembers the tallest bar seen from the left.",
      "rightMax remembers the tallest bar seen from the right.",
      "Water above a bar depends on the smaller of its two boundary maxima.",
    ]
  );

  while (left !== null && right !== null && left < right) {
    if (height[left] <= height[right]) {
      side = "left";
      currentIndex = left;

      if (height[left] >= leftMax) {
        leftMax = height[left];

        pushStep(
          `Left side is the limiting side, and height[${left}] = ${height[left]} raises leftMax to ${leftMax}. No water is trapped here.`,
          "raise-left-max",
          "cyan",
          [4, 5, 6],
          "A taller left wall improves the left boundary for future bars.",
          "When the current left bar meets or exceeds leftMax, it becomes the new left boundary and contributes zero trapped water.",
          "Boundary maxima move only upward; they never shrink.",
          [
            "You cannot trap water on top of a boundary wall itself.",
            "A stronger boundary may help later bars trap water.",
            "The left pointer will move inward after this step.",
          ]
        );
      } else {
        trapped[left] = leftMax - height[left];
        water += trapped[left];

        pushStep(
          `Left side is the limiting side, so bar ${left} traps leftMax - height[${left}] = ${trapped[left]} units. Total water becomes ${water}.`,
          "trap-left",
          "green",
          [4, 5, 7],
          "Because the current bar is below leftMax and the right side is at least as tall as this bar, the left boundary determines trapped water here.",
          "Once height[left] <= height[right], water at left is fixed at leftMax - height[left] whenever leftMax is higher than the current bar.",
          "This bar is finalized now; it will never need to be revisited.",
          [
            "Only the smaller side can be settled safely.",
            "The trapped amount is stored for visualization.",
            "The total water is the running sum of finalized bars.",
          ]
        );
      }

      left += 1;
    } else {
      side = "right";
      currentIndex = right;

      if (height[right] >= rightMax) {
        rightMax = height[right];

        pushStep(
          `Right side is the limiting side, and height[${right}] = ${height[right]} raises rightMax to ${rightMax}. No water is trapped here.`,
          "raise-right-max",
          "purple",
          [4, 9, 10],
          "A taller right wall improves the right boundary for future bars.",
          "When the current right bar meets or exceeds rightMax, it becomes the new right boundary and contributes zero trapped water.",
          "The right boundary only strengthens as the pointer moves inward.",
          [
            "A boundary wall cannot trap water on itself.",
            "A stronger right boundary may help bars farther left.",
            "The right pointer moves inward after the step.",
          ]
        );
      } else {
        trapped[right] = rightMax - height[right];
        water += trapped[right];

        pushStep(
          `Right side is the limiting side, so bar ${right} traps rightMax - height[${right}] = ${trapped[right]} units. Total water becomes ${water}.`,
          "trap-right",
          "green",
          [4, 9, 11],
          "Because the current bar is below rightMax and the left side is taller, the right boundary determines trapped water here.",
          "Once height[right] < height[left], water at right is fixed at rightMax - height[right] whenever rightMax is higher than the current bar.",
          "This right-side bar is finalized immediately and never revisited.",
          [
            "The smaller side is always safe to resolve.",
            "Stored trapped water is for teaching only; the algorithm only needs the total.",
            "Each bar is processed once.",
          ]
        );
      }

      right -= 1;
    }
  }

  side = null;
  currentIndex = null;
  result = water;

  pushStep(
    `The pointers have crossed, so every bar has been finalized. Total trapped water is ${water}.`,
    "done",
    "green",
    [15],
    "All bars have been resolved from one safe side or the other.",
    "Each iteration finalized exactly one bar using the smaller current boundary, so the final running sum equals the total trapped water.",
    "Two moving boundaries are enough to solve the problem in one pass.",
    [
      "Time complexity is O(n).",
      "The optimal algorithm uses O(1) extra space.",
      "The trapped-water row is kept only for visualization clarity.",
    ],
    true
  );

  return trace;
}
