export type PeakSearchState = {
  input: string;
  nums: number[];
  left: number;
  right: number;
  mid: number | null;
  nextIndex: number | null;
  midValue: number | null;
  nextValue: number | null;
  resultIndex: number | null;
  resultValue: number | null;
  valid: boolean;
  message: string | null;
};

export type PeakSearchPointers = {
  left: number | null;
  mid: number | null;
  next: number | null;
  right: number | null;
};

export type PeakSearchActionKind =
  | "parsed"
  | "invalid"
  | "choose-mid"
  | "move-left"
  | "move-right"
  | "done";

export type PeakSearchTraceStep = {
  step: number;
  action: string;
  actionKind: PeakSearchActionKind;
  codeLines: number[];
  state: PeakSearchState;
  pointers: PeakSearchPointers;
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

function cloneArray(nums: number[]) {
  return [...nums];
}

export function generateTrace(rawInput: string): PeakSearchTraceStep[] {
  const nums = parseNumberArray(rawInput);
  const valid = nums.length > 0;

  const trace: PeakSearchTraceStep[] = [];

  let left = 0;
  let right = valid ? nums.length - 1 : -1;
  let mid: number | null = null;
  let nextIndex: number | null = null;
  let midValue: number | null = null;
  let nextValue: number | null = null;
  let resultIndex: number | null = null;
  let resultValue: number | null = null;
  let message: string | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: PeakSearchActionKind;
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
        nextIndex,
        midValue,
        nextValue,
        resultIndex,
        resultValue,
        valid,
        message,
      },
      pointers: {
        left: valid ? left : null,
        mid,
        next: nextIndex,
        right: valid ? right : null,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action: valid
      ? `Search for a peak inside the array [${nums.join(", ")}].`
      : "Parse the array before looking for a peak.",
    actionKind: "parsed",
    codeLines: [1, 2],
    done: false,
    explanationBeginner: valid
      ? "A peak is any value that is bigger than its neighbors, and binary search can move toward one without checking every element."
      : "The visualizer needs at least one number to search.",
    explanationExpert: valid
      ? "Comparing nums[mid] with nums[mid + 1] reveals which side must still contain a peak."
      : "The search requires a non-empty array input.",
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
        "Without any numbers, there is no peak to find.",
      explanationExpert:
        "The trace terminates immediately for the empty-array edge case.",
    });

    return trace;
  }

  while (left < right) {
    mid = left + Math.floor((right - left) / 2);
    nextIndex = mid + 1;
    midValue = nums[mid];
    nextValue = nums[nextIndex];

    pushStep({
      action: `Compare nums[${mid}] = ${midValue} with nums[${nextIndex}] = ${nextValue}.`,
      actionKind: "choose-mid",
      codeLines: [3, 4, 5],
      done: false,
      explanationBeginner:
        "The algorithm looks at a slope made by the midpoint and the value right after it.",
      explanationExpert:
        "The sign of nums[mid] - nums[mid + 1] tells us whether the local slope is descending or ascending.",
    });

    if (midValue > nextValue) {
      right = mid;

      pushStep({
        action: `The slope falls at index ${mid}, so a peak must exist in the left half including ${mid}. Move right to ${right}.`,
        actionKind: "move-left",
        codeLines: [5, 6],
        done: false,
        explanationBeginner:
          "When the array is going down, a peak is already on the left side or exactly at mid.",
        explanationExpert:
          "A descending slope guarantees a peak in [left, mid], so keeping right = mid preserves a valid answer.",
      });
      continue;
    }

    left = mid + 1;

    pushStep({
      action: `The slope rises at index ${mid}, so a peak must exist to the right. Move left to ${left}.`,
      actionKind: "move-right",
      codeLines: [7, 8],
      done: false,
      explanationBeginner:
        "When the array is climbing upward, we should follow the climb because a peak lies further right.",
      explanationExpert:
        "An ascending slope guarantees a peak in [mid + 1, right], so setting left = mid + 1 maintains the invariant.",
    });
  }

  mid = left;
  nextIndex = null;
  midValue = nums[left];
  nextValue = null;
  resultIndex = left;
  resultValue = nums[left];
  message = `Peak found at index ${left}.`;

  pushStep({
    action: `The window collapsed to index ${left}, so nums[${left}] = ${nums[left]} is a peak.`,
    actionKind: "done",
    codeLines: [10, 11],
    done: true,
    explanationBeginner:
      "Once only one index remains, that position must be a peak.",
    explanationExpert:
      "Binary search converges to one valid peak in O(log n) time with O(1) extra space.",
  });

  return trace;
}
