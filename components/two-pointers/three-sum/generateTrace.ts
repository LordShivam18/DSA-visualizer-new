export type ThreeSumTriplet = {
  values: [number, number, number];
  indices: [number, number, number];
};

export type ThreeSumState = {
  nums: number[];
  i: number;
  left: number;
  right: number;
  phase: "init" | "scanning" | "done";
  triplets: ThreeSumTriplet[];
  currentSum: number | null;
  activeLine: number;
};

export type ThreeSumTraceStep = {
  step: number;
  action: string;
  actionKind:
    | "init"
    | "start"
    | "compare"
    | "move-left"
    | "move-right"
    | "found"
    | "advance-i"
    | "done";
  state: ThreeSumState;
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

  return values.length >= 3 ? values : [-4, -1, -1, 0, 1, 2];
}

export function generateTrace(rawNums: string) {
  const nums = parseNumbers(rawNums);
  const triplets: ThreeSumTriplet[] = [];
  const steps: ThreeSumTraceStep[] = [];
  const n = nums.length;

  function push(
    actionKind: ThreeSumTraceStep["actionKind"],
    i: number,
    left: number,
    right: number,
    activeLine: number,
    action: string,
    beginner: string,
    expert = beginner,
    done = false
  ) {
    const currentSum =
      i >= 0 && left >= 0 && right >= 0 && left < n && right < n
        ? nums[i] + nums[left] + nums[right]
        : null;
    steps.push({
      step: steps.length,
      action,
      actionKind,
      state: {
        nums: [...nums],
        i,
        left,
        right,
        phase: done ? "done" : i < 0 ? "init" : "scanning",
        triplets: triplets.map((item) => ({
          values: [...item.values] as [number, number, number],
          indices: [...item.indices] as [number, number, number],
        })),
        currentSum,
        activeLine,
      },
      explanationBeginner: beginner,
      explanationExpert: expert,
      done,
    });
  }

  push(
    "init",
    -1,
    -1,
    -1,
    1,
    "Sort input",
    "Sort the array, then fix one pivot and use two pointers for the remaining pair.",
    "3Sum reduces to repeated two-sum sweeps on sorted suffixes."
  );

  for (let i = 0; i < n - 2; i += 1) {
    if (i > 0 && nums[i] === nums[i - 1]) {
      continue;
    }

    let left = i + 1;
    let right = n - 1;
    push(
      "start",
      i,
      left,
      right,
      2,
      `Fix pivot ${nums[i]}`,
      `Use ${nums[i]} as the pivot and search the suffix with L and R.`
    );

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      push(
        "compare",
        i,
        left,
        right,
        6,
        `Compare sum ${sum}`,
        `Test ${nums[i]} + ${nums[left]} + ${nums[right]} = ${sum}.`
      );

      if (sum === 0) {
        const values: [number, number, number] = [
          nums[i],
          nums[left],
          nums[right],
        ];
        triplets.push({ values, indices: [i, left, right] });
        push(
          "found",
          i,
          left,
          right,
          8,
          "Record triplet",
          `Found [${values.join(", ")}], then skip duplicate neighbors.`
        );

        const leftValue = nums[left];
        const rightValue = nums[right];
        while (left < right && nums[left] === leftValue) left += 1;
        while (left < right && nums[right] === rightValue) right -= 1;
      } else if (sum < 0) {
        left += 1;
        push(
          "move-left",
          i,
          left,
          right,
          11,
          "Move left pointer",
          "The sum is too small, so increase L to use a larger value."
        );
      } else {
        right -= 1;
        push(
          "move-right",
          i,
          left,
          right,
          13,
          "Move right pointer",
          "The sum is too large, so decrease R to use a smaller value."
        );
      }
    }

    push(
      "advance-i",
      i,
      left,
      right,
      2,
      "Advance pivot",
      "This pivot's window is exhausted; move to the next distinct pivot."
    );
  }

  push(
    "done",
    -1,
    -1,
    -1,
    16,
    "Return triplets",
    `Found ${triplets.length} unique triplet(s).`,
    "All pivot suffixes have been swept.",
    true
  );

  return steps;
}
