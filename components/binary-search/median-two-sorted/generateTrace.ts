export type MedianRelation = "balanced" | "move-left" | "move-right" | "none";
export type MedianStatus = "ready" | "processing" | "done";

export type MedianTraceState = {
  nums1: number[];
  nums2: number[];
  i: number | null;
  j: number | null;
  low: number;
  high: number;
  relation: MedianRelation;
  status: MedianStatus;
  median: number | null;
  activeLine: number;
};

export type MedianTraceStep = {
  step: number;
  action: string;
  actionKind: "parsed" | "partition" | "move-left" | "move-right" | "done";
  state: MedianTraceState;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function parseNumbers(raw: string) {
  const values = raw
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(/[\s,]+/)
    .map((token) => Number(token.trim()))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  return values;
}

function sideValue(nums: number[], index: number, leftSide: boolean) {
  if (leftSide) {
    return index > 0 ? nums[index - 1] : Number.NEGATIVE_INFINITY;
  }

  return index < nums.length ? nums[index] : Number.POSITIVE_INFINITY;
}

export function generateTrace(
  rawNums1: string,
  rawNums2: string
): MedianTraceStep[] {
  const parsedA = parseNumbers(rawNums1);
  const parsedB = parseNumbers(rawNums2);
  const originalA = parsedA.length > 0 ? parsedA : [1, 3];
  const originalB = parsedB.length > 0 ? parsedB : [2];
  const nums1 = originalA.length <= originalB.length ? originalA : originalB;
  const nums2 = originalA.length <= originalB.length ? originalB : originalA;
  const total = nums1.length + nums2.length;
  const half = Math.floor((total + 1) / 2);
  const steps: MedianTraceStep[] = [];

  function push(
    actionKind: MedianTraceStep["actionKind"],
    state: MedianTraceState,
    action: string,
    beginner: string,
    expert = beginner,
    done = false
  ) {
    steps.push({
      step: steps.length,
      action,
      actionKind,
      state: {
        ...state,
        nums1: [...state.nums1],
        nums2: [...state.nums2],
      },
      explanationBeginner: beginner,
      explanationExpert: expert,
      done,
    });
  }

  let low = 0;
  let high = nums1.length;

  push(
    "parsed",
    {
      nums1,
      nums2,
      i: null,
      j: null,
      low,
      high,
      relation: "none",
      status: "ready",
      median: null,
      activeLine: 1,
    },
    "Binary search the smaller array",
    "We choose a cut in the smaller array and derive the matching cut in the larger array.",
    "Maintain i + j = half while binary-searching i."
  );

  while (low <= high) {
    const i = Math.floor((low + high) / 2);
    const j = half - i;
    const leftA = sideValue(nums1, i, true);
    const rightA = sideValue(nums1, i, false);
    const leftB = sideValue(nums2, j, true);
    const rightB = sideValue(nums2, j, false);

    push(
      "partition",
      {
        nums1,
        nums2,
        i,
        j,
        low,
        high,
        relation: "none",
        status: "processing",
        median: null,
        activeLine: 12,
      },
      `Test partition i=${i}, j=${j}`,
      "Check whether every value on the left side is less than or equal to every value on the right side."
    );

    if (leftA <= rightB && leftB <= rightA) {
      const leftMax = Math.max(leftA, leftB);
      const rightMin = Math.min(rightA, rightB);
      const median =
        total % 2 === 1 ? leftMax : (leftMax + rightMin) / 2;

      push(
        "done",
        {
          nums1,
          nums2,
          i,
          j,
          low,
          high,
          relation: "balanced",
          status: "done",
          median,
          activeLine: total % 2 === 1 ? 14 : 16,
        },
        "Balanced partition found",
        `The cuts are valid, so the median is ${median}.`,
        "Both cross inequalities hold, so derive the median from boundary values.",
        true
      );
      return steps;
    }

    if (leftA > rightB) {
      high = i - 1;
      push(
        "move-left",
        {
          nums1,
          nums2,
          i,
          j,
          low,
          high,
          relation: "move-left",
          status: "processing",
          median: null,
          activeLine: 18,
        },
        "Move cut left",
        "The left side from A is too large, so shift i left.",
        "leftA > rightB, so reduce high."
      );
    } else {
      low = i + 1;
      push(
        "move-right",
        {
          nums1,
          nums2,
          i,
          j,
          low,
          high,
          relation: "move-right",
          status: "processing",
          median: null,
          activeLine: 20,
        },
        "Move cut right",
        "The left side from B is too large, so shift i right.",
        "leftB > rightA, so increase low."
      );
    }
  }

  push(
    "done",
    {
      nums1,
      nums2,
      i: null,
      j: null,
      low,
      high,
      relation: "none",
      status: "done",
      median: null,
      activeLine: 22,
    },
    "No valid partition",
    "The input arrays could not produce a valid median partition.",
    "This should not happen for sorted numeric arrays.",
    true
  );

  return steps;
}
