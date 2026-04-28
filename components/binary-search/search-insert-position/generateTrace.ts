import type { Status } from "./types";

export type SearchInsertState = {
  nums: number[];
  target: number;
  left: number;
  right: number;
  mid: number | null;
  insertPos: number | null;
  status: Status;
  activeLine: number;
};

export type SearchInsertTraceStep = {
  step: number;
  action: string;
  actionKind:
    | "parsed"
    | "compare"
    | "found"
    | "move-left"
    | "move-right"
    | "done";
  state: SearchInsertState;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function parseNumbers(raw: string) {
  const parsed = raw
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(/[\s,]+/)
    .map((token) => Number(token.trim()))
    .filter((value) => Number.isFinite(value));

  return parsed.length > 0 ? parsed : [1, 3, 5, 6];
}

export function generateTrace(
  rawNums: string,
  rawTarget: string
): SearchInsertTraceStep[] {
  const nums = parseNumbers(rawNums).sort((a, b) => a - b);
  const target = Number(rawTarget.trim());
  const safeTarget = Number.isFinite(target) ? target : 5;
  const steps: SearchInsertTraceStep[] = [];

  function push(
    actionKind: SearchInsertTraceStep["actionKind"],
    state: SearchInsertState,
    action: string,
    beginner: string,
    expert = beginner,
    done = false
  ) {
    steps.push({
      step: steps.length,
      action,
      actionKind,
      state: { ...state, nums: [...state.nums] },
      explanationBeginner: beginner,
      explanationExpert: expert,
      done,
    });
  }

  let left = 0;
  let right = nums.length - 1;

  push(
    "parsed",
    {
      nums,
      target: safeTarget,
      left,
      right,
      mid: null,
      insertPos: null,
      status: "ready",
      activeLine: 1,
    },
    "Initialize binary search window",
    "Start with left at 0 and right at the final index. The insertion point will be left when the window closes.",
    "Invariant: the answer lies in [left, right + 1)."
  );

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    const value = nums[mid];

    push(
      "compare",
      {
        nums,
        target: safeTarget,
        left,
        right,
        mid,
        insertPos: null,
        status: "running",
        activeLine: 4,
      },
      `Compare nums[${mid}] with target`,
      `Middle value ${value} is compared with target ${safeTarget}.`
    );

    if (value === safeTarget) {
      push(
        "found",
        {
          nums,
          target: safeTarget,
          left,
          right,
          mid,
          insertPos: mid,
          status: "done",
          activeLine: 5,
        },
        "Target found",
        `The target is already present at index ${mid}.`,
        `nums[mid] == target, so return ${mid}.`,
        true
      );
      return steps;
    }

    if (value < safeTarget) {
      left = mid + 1;
      push(
        "move-left",
        {
          nums,
          target: safeTarget,
          left,
          right,
          mid,
          insertPos: null,
          status: "running",
          activeLine: 6,
        },
        "Move left boundary right",
        `${value} is smaller than ${safeTarget}, so every index through ${mid} is too early.`,
        "Discard the left half by setting left = mid + 1."
      );
    } else {
      right = mid - 1;
      push(
        "move-right",
        {
          nums,
          target: safeTarget,
          left,
          right,
          mid,
          insertPos: null,
          status: "running",
          activeLine: 7,
        },
        "Move right boundary left",
        `${value} is larger than ${safeTarget}, so the insertion point must be at mid or before it.`,
        "Discard the right half by setting right = mid - 1."
      );
    }
  }

  push(
    "done",
    {
      nums,
      target: safeTarget,
      left,
      right,
      mid: null,
      insertPos: left,
      status: "done",
      activeLine: 9,
    },
    "Return insertion point",
    `The window is empty. Insert the target at index ${left}.`,
    `Loop ended with left = ${left}, the lower bound position.`,
    true
  );

  return steps;
}
