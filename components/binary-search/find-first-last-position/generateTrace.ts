export type RangePhase = "first" | "last" | "done";

export type RangeSearchState = {
  input: string;
  inputTarget: string;
  nums: number[];
  target: number | null;
  left: number;
  right: number;
  mid: number | null;
  midValue: number | null;
  firstCandidate: number | null;
  lastCandidate: number | null;
  phase: RangePhase;
  result: [number, number] | null;
  valid: boolean;
  message: string | null;
};

export type RangeSearchPointers = {
  left: number | null;
  mid: number | null;
  right: number | null;
  phase: RangePhase;
};

export type RangeSearchActionKind =
  | "parsed"
  | "invalid"
  | "start-first"
  | "start-last"
  | "choose-mid"
  | "record-first"
  | "record-last"
  | "move-left"
  | "move-right"
  | "done";

export type RangeSearchTraceStep = {
  step: number;
  action: string;
  actionKind: RangeSearchActionKind;
  codeLines: number[];
  state: RangeSearchState;
  pointers: RangeSearchPointers;
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

export function generateTrace(
  rawInput: string,
  rawTargetInput: string
): RangeSearchTraceStep[] {
  const nums = parseNumberArray(rawInput);
  const target = Number(rawTargetInput.trim());
  const valid = Number.isFinite(target);

  const trace: RangeSearchTraceStep[] = [];

  let left = 0;
  let right = nums.length - 1;
  let mid: number | null = null;
  let midValue: number | null = null;
  let firstCandidate: number | null = null;
  let lastCandidate: number | null = null;
  let phase: RangePhase = "first";
  let result: [number, number] | null = null;
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
    actionKind: RangeSearchActionKind;
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
        firstCandidate,
        lastCandidate,
        phase,
        result,
        valid,
        message,
      },
      pointers: {
        left: nums.length > 0 ? left : null,
        mid,
        right: nums.length > 0 ? right : null,
        phase,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action: valid
      ? `Search for the first and last positions of ${target} in [${nums.join(", ")}].`
      : "Parse the array and target before searching for the range.",
    actionKind: "parsed",
    codeLines: [27],
    done: false,
    explanationBeginner: valid
      ? "This problem runs binary search twice: once to find the earliest match and once to find the latest match."
      : "The visualizer needs a numeric target before it can build the trace.",
    explanationExpert: valid
      ? "The left boundary search behaves like a lower_bound, and the right boundary search behaves like an upper_bound that still records matches."
      : "Trace generation halts for invalid target input.",
  });

  if (!valid) {
    result = [-1, -1];
    message = "Enter a numeric target.";

    pushStep({
      action: message,
      actionKind: "invalid",
      codeLines: [27],
      done: true,
      explanationBeginner:
        "A missing or invalid target means there is nothing to search for.",
      explanationExpert:
        "Boundary searches require a concrete comparison value.",
    });

    return trace;
  }

  pushStep({
    action: "Start the first pass, which searches for the earliest possible target index.",
    actionKind: "start-first",
    codeLines: [1, 2],
    done: false,
    explanationBeginner:
      "The first pass keeps leaning left whenever it sees the target, because it wants the earliest copy.",
    explanationExpert:
      "The lower-bound style pass records matches but still contracts the right edge to search for an earlier occurrence.",
  });

  while (left <= right) {
    mid = left + Math.floor((right - left) / 2);
    midValue = nums[mid];

    pushStep({
      action: `First-pass midpoint: index ${mid} with value ${midValue}.`,
      actionKind: "choose-mid",
      codeLines: [3, 4],
      done: false,
      explanationBeginner:
        "The first pass checks the middle value and asks whether the first target could still be to the left.",
      explanationExpert:
        "This midpoint participates in the lower-bound invariant for the first occurrence.",
    });

    if (midValue >= target) {
      if (midValue === target) {
        firstCandidate = mid;

        pushStep({
          action: `Record index ${mid} as a first-position candidate, then keep searching left.`,
          actionKind: "record-first",
          codeLines: [5, 6],
          done: false,
          explanationBeginner:
            "This index works, but there might be another copy earlier in the array.",
          explanationExpert:
            "A match updates the best lower-bound candidate while the search continues toward smaller indices.",
        });
      }

      right = mid - 1;

      pushStep({
        action: `Move right to ${right} to continue the first-position search on the left side.`,
        actionKind: "move-right",
        codeLines: [7],
        done: false,
        explanationBeginner:
          "The earliest target, if it exists, must be at mid or somewhere before it.",
        explanationExpert:
          "Because nums[mid] >= target, the lower bound cannot lie to the right of mid.",
      });
    } else {
      left = mid + 1;

      pushStep({
        action: `Value ${midValue} is too small, so move left to ${left}.`,
        actionKind: "move-left",
        codeLines: [8, 9],
        done: false,
        explanationBeginner:
          "Anything smaller than the target cannot be part of the final range.",
        explanationExpert:
          "When nums[mid] < target, all indices <= mid are excluded from the lower-bound search.",
      });
    }
  }

  if (firstCandidate === null) {
    phase = "done";
    result = [-1, -1];
    mid = null;
    midValue = null;
    message = `Target ${target} never appeared, so the final range is [-1, -1].`;

    pushStep({
      action: message,
      actionKind: "done",
      codeLines: [28],
      done: true,
      explanationBeginner:
        "If the first pass never finds even one copy, the answer is immediately [-1, -1].",
      explanationExpert:
        "No lower-bound candidate means the target is absent, so the second pass is unnecessary.",
    });

    return trace;
  }

  phase = "last";
  left = 0;
  right = nums.length - 1;
  mid = null;
  midValue = null;

  pushStep({
    action: "Start the second pass, which searches for the latest possible target index.",
    actionKind: "start-last",
    codeLines: [14, 15],
    done: false,
    explanationBeginner:
      "Now the search flips direction: it keeps leaning right whenever it sees the target.",
    explanationExpert:
      "The second pass mirrors an upper-bound search while recording the last confirmed match.",
  });

  while (left <= right) {
    mid = left + Math.floor((right - left) / 2);
    midValue = nums[mid];

    pushStep({
      action: `Last-pass midpoint: index ${mid} with value ${midValue}.`,
      actionKind: "choose-mid",
      codeLines: [16, 17],
      done: false,
      explanationBeginner:
        "The second pass asks whether the last target could still be to the right.",
      explanationExpert:
        "This midpoint participates in the upper-bound style search for the last occurrence.",
    });

    if (midValue <= target) {
      if (midValue === target) {
        lastCandidate = mid;

        pushStep({
          action: `Record index ${mid} as a last-position candidate, then keep searching right.`,
          actionKind: "record-last",
          codeLines: [18, 19],
          done: false,
          explanationBeginner:
            "This index works, but there might be another copy later in the array.",
          explanationExpert:
            "A match updates the best upper-bound candidate while the search continues toward larger indices.",
        });
      }

      left = mid + 1;

      pushStep({
        action: `Move left to ${left} to continue the last-position search on the right side.`,
        actionKind: "move-left",
        codeLines: [20],
        done: false,
        explanationBeginner:
          "The last target, if it exists, must be at mid or somewhere after it.",
        explanationExpert:
          "Because nums[mid] <= target, the final occurrence cannot lie strictly left of mid.",
      });
    } else {
      right = mid - 1;

      pushStep({
        action: `Value ${midValue} is too large, so move right to ${right}.`,
        actionKind: "move-right",
        codeLines: [21, 22],
        done: false,
        explanationBeginner:
          "Values larger than the target cannot belong to the final range.",
        explanationExpert:
          "When nums[mid] > target, all indices >= mid are excluded from the upper-bound search.",
      });
    }
  }

  phase = "done";
  mid = null;
  midValue = null;
  result = [firstCandidate, lastCandidate ?? firstCandidate];
  message = `The target range is [${result[0]}, ${result[1]}].`;

  pushStep({
    action: message,
    actionKind: "done",
    codeLines: [27, 28],
    done: true,
    explanationBeginner:
      "The first pass found the left edge, the second pass found the right edge, and together they form the final range.",
    explanationExpert:
      "Two O(log n) boundary searches yield the final interval in O(log n) total time and O(1) extra space.",
  });

  return trace;
}
