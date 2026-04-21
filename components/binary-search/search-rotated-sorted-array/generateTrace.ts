export type SortedHalf = "left" | "right" | null;

export type RotatedSearchState = {
  input: string;
  inputTarget: string;
  nums: number[];
  target: number | null;
  left: number;
  right: number;
  mid: number | null;
  midValue: number | null;
  resultIndex: number | null;
  valid: boolean;
  message: string | null;
  sortedHalf: SortedHalf;
  targetInSortedHalf: boolean | null;
  pivotIndex: number | null;
};

export type RotatedSearchPointers = {
  left: number | null;
  mid: number | null;
  right: number | null;
};

export type RotatedSearchActionKind =
  | "parsed"
  | "invalid"
  | "choose-mid"
  | "identify-left-sorted"
  | "identify-right-sorted"
  | "move-left"
  | "move-right"
  | "found"
  | "done";

export type RotatedSearchTraceStep = {
  step: number;
  action: string;
  actionKind: RotatedSearchActionKind;
  codeLines: number[];
  state: RotatedSearchState;
  pointers: RotatedSearchPointers;
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

export function generateTrace(
  rawInput: string,
  rawTargetInput: string
): RotatedSearchTraceStep[] {
  const nums = parseNumberArray(rawInput);
  const target = Number(rawTargetInput.trim());
  const valid = nums.length > 0 && Number.isFinite(target);
  const pivotIndex = findPivotIndex(nums);

  const trace: RotatedSearchTraceStep[] = [];

  let left = 0;
  let right = valid ? nums.length - 1 : -1;
  let mid: number | null = null;
  let midValue: number | null = null;
  let resultIndex: number | null = null;
  let message: string | null = null;
  let sortedHalf: SortedHalf = null;
  let targetInSortedHalf: boolean | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: RotatedSearchActionKind;
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
        inputTarget: rawTargetInput,
        nums: cloneArray(nums),
        target: Number.isFinite(target) ? target : null,
        left,
        right,
        mid,
        midValue,
        resultIndex,
        valid,
        message,
        sortedHalf,
        targetInSortedHalf,
        pivotIndex,
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
      ? `Search for ${target} inside the rotated array [${nums.join(", ")}].`
      : "Parse the rotated array and target before searching.",
    actionKind: "parsed",
    codeLines: [1, 2],
    done: false,
    explanationBeginner: valid
      ? "A rotated array still hides one fully sorted half inside every search window."
      : "The visualizer needs a non-empty array and a numeric target.",
    explanationExpert: valid
      ? "Each iteration identifies which half remains sorted, then uses that order information to discard half the window."
      : "Trace generation halts for invalid input.",
  });

  if (!valid) {
    resultIndex = -1;
    message =
      nums.length === 0
        ? "Enter at least one array value."
        : "Enter a numeric target.";

    pushStep({
      action: message,
      actionKind: "invalid",
      codeLines: [1],
      done: true,
      explanationBeginner:
        "The search cannot begin until both inputs are valid.",
      explanationExpert:
        "Without valid input, the invariant over the search interval cannot be formed.",
    });

    return trace;
  }

  while (left <= right) {
    mid = left + Math.floor((right - left) / 2);
    midValue = nums[mid];
    sortedHalf = null;
    targetInSortedHalf = null;

    pushStep({
      action: `Choose mid = ${mid}, where nums[mid] = ${midValue}.`,
      actionKind: "choose-mid",
      codeLines: [3, 4],
      done: false,
      explanationBeginner:
        "Just like normal binary search, the middle index is the first checkpoint.",
      explanationExpert:
        "The midpoint partitions the rotated window into two subranges, one of which must still be sorted.",
    });

    if (midValue === target) {
      resultIndex = mid;
      message = `Target ${target} found at index ${mid}.`;

      pushStep({
        action: `nums[mid] matches ${target}, so the search returns index ${mid}.`,
        actionKind: "found",
        codeLines: [5],
        done: true,
        explanationBeginner:
          "The target is sitting exactly at the midpoint, so the search ends immediately.",
        explanationExpert:
          "The equality case terminates in O(1) for the current iteration.",
      });

      return trace;
    }

    if (nums[left] <= nums[mid]) {
      sortedHalf = "left";
      targetInSortedHalf = nums[left] <= target && target < nums[mid];

      pushStep({
        action: `The left half from index ${left} to ${mid} is sorted. ${
          targetInSortedHalf
            ? `Target ${target} lies inside that ordered range.`
            : `Target ${target} is not inside that ordered range.`
        }`,
        actionKind: "identify-left-sorted",
        codeLines: [6],
        done: false,
        explanationBeginner:
          "Because the left edge is smaller than the midpoint, that half is in clean sorted order.",
        explanationExpert:
          "The condition nums[left] <= nums[mid] proves [left, mid] is monotonic despite the rotation.",
      });

      if (targetInSortedHalf) {
        right = mid - 1;

        pushStep({
          action: `Keep the sorted left half and move right to ${right}.`,
          actionKind: "move-right",
          codeLines: [7],
          done: false,
          explanationBeginner:
            "Since the target fits inside the sorted left range, the search discards everything to the right of mid.",
          explanationExpert:
            "Restricting to [left, mid - 1] preserves the invariant that the target, if present, stays inside the search interval.",
        });
      } else {
        left = mid + 1;

        pushStep({
          action: `Discard the sorted left half and move left to ${left}.`,
          actionKind: "move-left",
          codeLines: [8],
          done: false,
          explanationBeginner:
            "The target cannot be inside the sorted left range, so the search jumps to the other side.",
          explanationExpert:
            "When target falls outside the sorted left interval, the only remaining candidate region is [mid + 1, right].",
        });
      }

      continue;
    }

    sortedHalf = "right";
    targetInSortedHalf = midValue < target && target <= nums[right];

    pushStep({
      action: `The right half from index ${mid} to ${right} is sorted. ${
        targetInSortedHalf
          ? `Target ${target} lies inside that ordered range.`
          : `Target ${target} is not inside that ordered range.`
      }`,
      actionKind: "identify-right-sorted",
      codeLines: [9],
      done: false,
      explanationBeginner:
        "If the left half is not sorted, then the right half must be the ordered one.",
      explanationExpert:
        "The rotated-window invariant guarantees one side remains monotonic. Here it is [mid, right].",
    });

    if (targetInSortedHalf) {
      left = mid + 1;

      pushStep({
        action: `Keep the sorted right half and move left to ${left}.`,
        actionKind: "move-left",
        codeLines: [10],
        done: false,
        explanationBeginner:
          "The target fits the ordered values on the right, so the search follows that side.",
        explanationExpert:
          "Updating left = mid + 1 keeps only the right-side interval that can still contain the target.",
      });
    } else {
      right = mid - 1;

      pushStep({
        action: `Discard the sorted right half and move right to ${right}.`,
        actionKind: "move-right",
        codeLines: [11],
        done: false,
        explanationBeginner:
          "The target does not fit inside the sorted right range, so it must be on the other side.",
        explanationExpert:
          "Excluding the sorted right half preserves the search invariant over [left, mid - 1].",
      });
    }
  }

  mid = null;
  midValue = null;
  resultIndex = -1;
  message = `Target ${target} is not present in the rotated array.`;

  pushStep({
    action: `The window is empty because left = ${left} and right = ${right}. Return -1.`,
    actionKind: "done",
    codeLines: [14],
    done: true,
    explanationBeginner:
      "Once the search window disappears, the target is not anywhere in the array.",
    explanationExpert:
      "The algorithm finishes in O(log n) time by discarding half the interval each iteration and using O(1) auxiliary space.",
  });

  return trace;
}
