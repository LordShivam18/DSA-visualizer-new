export type TwoSumSortedStatus = "ready" | "searching" | "found" | "not-found";

export type TwoSumSortedState = {
  nums: number[];
  target: number;
  left: number;
  right: number;
  status: TwoSumSortedStatus;
  currentSum: number | null;
  activeLine: number;
};

export type TwoSumSortedTraceStep = {
  step: number;
  action: string;
  actionKind: "init" | "compare" | "move-left" | "move-right" | "found" | "not-found";
  state: TwoSumSortedState;
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

  return values.length >= 2 ? values : [1, 2, 3, 4, 6, 8, 11];
}

export function generateTrace(rawNums: string, rawTarget: string) {
  const nums = parseNumbers(rawNums);
  const parsedTarget = Number(rawTarget.trim());
  const target = Number.isFinite(parsedTarget) ? parsedTarget : 10;
  const steps: TwoSumSortedTraceStep[] = [];
  let left = 0;
  let right = nums.length - 1;

  function push(
    actionKind: TwoSumSortedTraceStep["actionKind"],
    status: TwoSumSortedStatus,
    activeLine: number,
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
        nums: [...nums],
        target,
        left,
        right,
        status,
        currentSum: left < right ? nums[left] + nums[right] : null,
        activeLine,
      },
      explanationBeginner: beginner,
      explanationExpert: expert,
      done,
    });
  }

  push(
    "init",
    "ready",
    1,
    "Initialize two pointers",
    "Start with the smallest value on the left and largest value on the right.",
    "Sorted order tells us which pointer can safely move."
  );

  while (left < right) {
    const sum = nums[left] + nums[right];
    push(
      "compare",
      "searching",
      3,
      `Compare sum ${sum}`,
      `Check nums[${left}] + nums[${right}] = ${sum} against target ${target}.`
    );

    if (sum === target) {
      push(
        "found",
        "found",
        4,
        "Pair found",
        `Found indices ${left} and ${right}.`,
        "Return the current pair.",
        true
      );
      return steps;
    }

    if (sum < target) {
      left += 1;
      push(
        "move-left",
        "searching",
        5,
        "Move left pointer",
        "The sum is too small, so move left rightward to increase it.",
        "All pairs using the old left with smaller right values are too small."
      );
    } else {
      right -= 1;
      push(
        "move-right",
        "searching",
        6,
        "Move right pointer",
        "The sum is too large, so move right leftward to decrease it.",
        "All pairs using the old right with larger left values are too large."
      );
    }
  }

  push(
    "not-found",
    "not-found",
    8,
    "No pair found",
    "The pointers crossed without finding the target sum.",
    "The remaining search interval is empty.",
    true
  );

  return steps;
}
