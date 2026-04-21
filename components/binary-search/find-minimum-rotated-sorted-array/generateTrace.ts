export type MinComparison = "mid-greater" | "mid-smaller-equal" | null;

export type FindMinState = {
  input: string;
  nums: number[];
  left: number;
  right: number;
  mid: number | null;
  midValue: number | null;
  rightValue: number | null;
  resultIndex: number | null;
  resultValue: number | null;
  valid: boolean;
  message: string | null;
  pivotIndex: number | null;
  comparison: MinComparison;
};

export type FindMinPointers = {
  left: number | null;
  mid: number | null;
  right: number | null;
};

export type FindMinActionKind =
  | "parsed"
  | "invalid"
  | "choose-mid"
  | "move-left"
  | "move-right"
  | "done";

export type FindMinTraceStep = {
  step: number;
  action: string;
  actionKind: FindMinActionKind;
  codeLines: number[];
  state: FindMinState;
  pointers: FindMinPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function parseNumberArray(rawInput: string) {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    if (Array.isArray(parsed)) {
      return parsed
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value));
    }
  } catch {
    // Fall back to plain text parsing.
  }

  return trimmed
    .split(/[\s,\n|]+/)
    .filter(Boolean)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));
}

function findPivotIndex(nums: number[]) {
  if (nums.length === 0) {
    return null;
  }

  let pivot = 0;
  for (let index = 1; index < nums.length; index += 1) {
    if (nums[index] < nums[pivot]) {
      pivot = index;
    }
  }

  return pivot;
}

function cloneArray(nums: number[]) {
  return [...nums];
}

export function generateTrace(rawInput: string): FindMinTraceStep[] {
  const nums = parseNumberArray(rawInput);
  const valid = nums.length > 0;
  const pivotIndex = findPivotIndex(nums);

  const trace: FindMinTraceStep[] = [];

  let left = 0;
  let right = valid ? nums.length - 1 : -1;
  let mid: number | null = null;
  let midValue: number | null = null;
  let rightValue: number | null = valid ? nums[right] : null;
  let resultIndex: number | null = null;
  let resultValue: number | null = null;
  let message: string | null = null;
  let comparison: MinComparison = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: FindMinActionKind;
    codeLines: number[];
    done: boolean;
    explanationBeginner: string;
    explanationExpert: string;
  }) {
    trace.push({
      step: trace.length,
      action,
      actionKind,
      codeLines,
      state: {
        input: rawInput,
        nums: cloneArray(nums),
        left,
        right,
        mid,
        midValue,
        rightValue,
        resultIndex,
        resultValue,
        valid,
        message,
        pivotIndex,
        comparison,
      },
      pointers: {
        left: valid ? left : null,
        mid,
        right: valid ? right : null,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action: valid
      ? `Search for the minimum inside the rotated array [${nums.join(", ")}].`
      : "Parse the rotated array before searching for the minimum.",
    actionKind: "parsed",
    codeLines: [1, 2],
    done: false,
    explanationBeginner: valid
      ? "The algorithm never needs to fully unrotate the array. It only keeps the half that could still contain the minimum."
      : "The visualizer needs at least one number to search.",
    explanationExpert: valid
      ? "Comparing nums[mid] with nums[right] tells us whether the rotation break lies to the right of mid or at/before mid."
      : "Trace generation stops immediately for empty input.",
  });

  if (!valid) {
    resultIndex = -1;
    message = "Enter at least one numeric value.";

    pushStep({
      action: message,
      actionKind: "invalid",
      codeLines: [1],
      done: true,
      explanationBeginner:
        "There is no minimum to report without any numbers.",
      explanationExpert:
        "The search interval cannot be created for an empty array.",
    });

    return trace;
  }

  while (left < right) {
    mid = left + Math.floor((right - left) / 2);
    midValue = nums[mid];
    rightValue = nums[right];
    comparison = null;

    pushStep({
      action: `Choose mid = ${mid}. Compare nums[mid] = ${midValue} with nums[right] = ${rightValue}.`,
      actionKind: "choose-mid",
      codeLines: [3, 4, 5],
      done: false,
      explanationBeginner:
        "The midpoint is measured against the right edge because the minimum must be on one side of the rotation break.",
      explanationExpert:
        "The rightmost value acts as a reference for which side of the rotated order mid belongs to.",
    });

    if (midValue > rightValue) {
      comparison = "mid-greater";
      left = mid + 1;
      rightValue = nums[right];

      pushStep({
        action: `nums[mid] is greater than nums[right], so the minimum must be to the right of mid. Move left to ${left}.`,
        actionKind: "move-left",
        codeLines: [5, 6],
        done: false,
        explanationBeginner:
          "A larger midpoint means mid is still sitting in the high rotated segment, so the minimum is further right.",
        explanationExpert:
          "If nums[mid] > nums[right], the pivot lies in (mid, right], so the invariant shrinks to [mid + 1, right].",
      });
      continue;
    }

    comparison = "mid-smaller-equal";
    right = mid;
    rightValue = nums[right];

    pushStep({
      action: `nums[mid] is less than or equal to nums[right], so the minimum is at mid or to its left. Move right to ${right}.`,
      actionKind: "move-right",
      codeLines: [7, 8],
      done: false,
      explanationBeginner:
        "This means the right side is already ordered, so the minimum cannot be beyond mid.",
      explanationExpert:
        "When nums[mid] <= nums[right], the pivot is in [left, mid], so setting right = mid preserves the candidate minimum.",
    });
  }

  mid = left;
  midValue = nums[left];
  rightValue = nums[right];
  resultIndex = left;
  resultValue = nums[left];
  message = `The minimum value is ${nums[left]} at index ${left}.`;

  pushStep({
    action: message,
    actionKind: "done",
    codeLines: [10, 11],
    done: true,
    explanationBeginner:
      "Once left and right meet, that single remaining index must hold the minimum.",
    explanationExpert:
      "The search converges in O(log n) time because each comparison discards half of the remaining interval while using O(1) extra space.",
  });

  return trace;
}
