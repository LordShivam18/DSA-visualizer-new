import { clamp, formatArray, parseInteger, parseNumberList } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type RotateState = {
  original: number[];
  working: number[];
  normalizedK: number;
  phase: "normalize" | "reverse-all" | "reverse-prefix" | "reverse-suffix" | "done";
  comparison: string;
  result: number[] | null;
};

type RotatePointers = {
  left: number | null;
  right: number | null;
};

export type RotateArrayTraceStep = TeachingTraceFrame & {
  state: RotateState;
  pointers: RotatePointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(rawNums: string, rawK: string) {
  const values = parseNumberList(rawNums);
  const working = [...values];
  const rawKValue = parseInteger(rawK, 0);
  const normalizedK =
    working.length === 0 ? 0 : ((rawKValue % working.length) + working.length) % working.length;
  const trace: RotateArrayTraceStep[] = [];

  let left: number | null = null;
  let right: number | null = null;
  let phase: RotateState["phase"] = "normalize";
  let comparison = `Normalize k = ${rawKValue} to ${normalizedK}.`;
  let result: number[] | null = null;

  function codeForPhase(currentPhase: RotateState["phase"]) {
    if (currentPhase === "reverse-all") {
      return [2, 3];
    }
    if (currentPhase === "reverse-prefix") {
      return [4];
    }
    if (currentPhase === "reverse-suffix") {
      return [5];
    }
    return [1];
  }

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: RotateArrayTraceStep["actionTone"],
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
        { label: "k", value: normalizedK, tone: "cyan" },
        { label: "left", value: pointerValue(left), tone: "purple" },
        { label: "right", value: pointerValue(right), tone: "yellow" },
      ],
      pointerChips: [
        { label: "left", value: pointerValue(left), tone: "purple" },
        { label: "right", value: pointerValue(right), tone: "yellow" },
        { label: "phase", value: phase, tone: "cyan" },
      ],
      done,
      state: {
        original: [...values],
        working: [...working],
        normalizedK,
        phase,
        comparison,
        result: result ? [...result] : null,
      },
      pointers: {
        left,
        right,
      },
    });
  }

  pushStep(
    `Normalize the rotation count. Rotating by ${rawKValue} on length ${working.length} is equivalent to rotating by ${normalizedK}.`,
    "normalize",
    "slate",
    [1],
    "Extra full turns do not change the final array, so only k % n matters.",
    "Rotation by k and rotation by k % n are identical because full-length shifts return the array to the same state.",
    "The reversal algorithm runs only on the effective rotation distance.",
    [
      "If the array is empty, the effective rotation is 0.",
      "Negative or oversized k values can be normalized safely.",
      "The reversal strategy still uses O(1) extra space.",
    ]
  );

  function reverseSegment(start: number, end: number, nextPhase: RotateState["phase"]) {
    left = clamp(start, 0, Math.max(working.length - 1, 0));
    right = clamp(end, -1, Math.max(working.length - 1, 0));
    phase = nextPhase;

    pushStep(
      `Reverse the segment from index ${start} to ${end}.`,
      "start-phase",
      "purple",
      codeForPhase(nextPhase),
      "This phase flips one specific section of the array.",
      "Each reversal transforms the array toward the rotated target while staying in-place.",
      "The two-pointer swap loop mirrors the chosen segment around its center.",
      [
        "Reverse all values first.",
        "Then reverse the first k values.",
        "Finally reverse the remaining suffix.",
      ]
    );

    while (left !== null && right !== null && left < right) {
      comparison = `Swap nums[${left}] = ${working[left]} with nums[${right}] = ${working[right]}.`;

      pushStep(
        comparison,
        "swap",
        "yellow",
        [...codeForPhase(nextPhase), 6, 7],
        "The two ends of the current segment trade places.",
        "Each swap moves the segment one step closer to its reversed arrangement.",
        "Only the active segment changes during this phase.",
        [
          "left moves right after the swap.",
          "right moves left after the swap.",
          "The segment outside [left, right] is already fixed for this phase.",
        ]
      );

      const temp = working[left];
      working[left] = working[right];
      working[right] = temp;
      left += 1;
      right -= 1;

      pushStep(
        `The swap is committed. The active segment is now ${formatArray(working)}.`,
        "commit-swap",
        "cyan",
        [...codeForPhase(nextPhase), 6, 7],
        "The selected pair has switched places, shrinking the unfinished middle.",
        "After each swap, the outer part of the segment is already in reversed order.",
        "The unreversed portion shrinks inward around the center.",
        [
          "The next comparison happens strictly inside the previous bounds.",
          "Earlier swaps in this phase never need revisiting.",
          "The array keeps evolving toward the final rotation.",
        ]
      );
    }

    comparison = `Finished ${nextPhase}.`;

    pushStep(
      `This reversal phase is complete.`,
      "finish-phase",
      "green",
      codeForPhase(nextPhase),
      "The chosen segment is fully reversed now.",
      "Exhausting the two-pointer loop proves the current segment has been reversed in-place.",
      "Control can move to the next reversal phase.",
      [
        "The segment boundaries have converged or crossed.",
        "No more swaps are needed for this phase.",
        "The next phase works on a different segment.",
      ]
    );
  }

  if (working.length > 1 && normalizedK > 0) {
    reverseSegment(0, working.length - 1, "reverse-all");
    reverseSegment(0, normalizedK - 1, "reverse-prefix");
    reverseSegment(normalizedK, working.length - 1, "reverse-suffix");
  }

  left = null;
  right = null;
  phase = "done";
  result = [...working];

  pushStep(
    `All reversal phases are done. The rotated array is ${formatArray(result)}.`,
    "done",
    "green",
    [8],
    "The three reversals together rotate the array to the right by k steps.",
    "Reverse-all flips global order, reverse-prefix restores the front block, and reverse-suffix restores the back block.",
    "The final array matches a right rotation by normalizedK.",
    [
      "Time complexity is O(n).",
      "Extra space stays O(1).",
      "When k is 0, the array stays unchanged.",
    ],
    true
  );

  return trace;
}
