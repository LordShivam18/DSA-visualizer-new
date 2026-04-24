import { parseNumberList } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type MajorityState = {
  nums: number[];
  currentValue: number | null;
  candidate: number | null;
  count: number;
  result: number | null;
};

type MajorityPointers = {
  index: number | null;
};

export type MajorityElementTraceStep = TeachingTraceFrame & {
  state: MajorityState;
  pointers: MajorityPointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(rawNums: string) {
  const nums = parseNumberList(rawNums);
  const trace: MajorityElementTraceStep[] = [];

  let index = 0;
  let currentValue: number | null = null;
  let candidate: number | null = null;
  let count = 0;
  let result: number | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: MajorityElementTraceStep["actionTone"],
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
        { label: "Index", value: pointerValue(index), tone: "cyan" },
        { label: "Candidate", value: candidate ?? "none", tone: "purple" },
        { label: "Vote Count", value: count, tone: "green" },
      ],
      pointerChips: [
        { label: "index", value: pointerValue(index), tone: "cyan" },
        { label: "candidate", value: candidate ?? "none", tone: "purple" },
      ],
      done,
      state: {
        nums: [...nums],
        currentValue,
        candidate,
        count,
        result,
      },
      pointers: {
        index,
      },
    });
  }

  pushStep(
    "Start with an empty candidate and zero votes. The scan will let matching values reinforce the candidate and mismatches cancel votes.",
    "initialize",
    "slate",
    [1, 2],
    "Boyer-Moore behaves like a running vote. A strong majority can survive all cancellations.",
    "The invariant is that the remaining vote count tracks an uncompensated surplus for the current candidate.",
    "Count measures how far ahead the current candidate is inside the processed prefix.",
    [
      "When count reaches 0, the previous surplus is fully canceled out.",
      "The next value is free to become the new candidate.",
      "A true majority survives every cancellation round.",
    ]
  );

  while (index < nums.length) {
    currentValue = nums[index];

    if (count === 0) {
      candidate = currentValue;
      count = 1;

      pushStep(
        `Votes dropped to zero, so choose ${candidate} as the new candidate and restart the count at 1.`,
        "choose-candidate",
        "purple",
        [3, 4],
        "With no surviving votes left, the current value becomes the new leader.",
        "A zero count means the processed prefix is fully canceled, so any next value can safely seed a new candidate.",
        "The candidate only changes when the prior vote surplus has been neutralized.",
        [
          "This step does not prove the candidate is the final answer yet.",
          "It simply becomes the best survivor of the remaining suffix.",
          "The new candidate begins with one supporting vote from the current value.",
        ]
      );
    } else if (candidate === currentValue) {
      count += 1;

      pushStep(
        `${currentValue} matches the current candidate, so increase the vote count to ${count}.`,
        "reinforce",
        "green",
        [5, 6],
        "A matching value strengthens the candidate because it adds one more supporting vote.",
        "Equal values increase the candidate's surplus within the processed prefix.",
        "Matching values accumulate uncompensated votes for the candidate.",
        [
          "The candidate stays the same.",
          "A larger count means more mismatches are needed to cancel it out.",
          "This is the " +
            "reason the majority element survives the whole scan.",
        ]
      );
    } else {
      count -= 1;

      pushStep(
        `${currentValue} disagrees with candidate ${candidate}, so one vote is canceled and the count drops to ${count}.`,
        "cancel",
        "red",
        [7, 8],
        "A different value can cancel one existing vote for the candidate.",
        "A mismatch removes one unit of the candidate's current surplus, modeling pairwise cancellation.",
        "Only unmatched surplus votes matter for the final survivor.",
        [
          "The candidate may remain the same even after the count shrinks.",
          "If count reaches zero, the next value can start a new round.",
          "Pairwise cancellation cannot eliminate a true majority.",
        ]
      );
    }

    index += 1;
  }

  index = null;
  currentValue = null;
  result = candidate;

  pushStep(
    `The scan is complete. Candidate ${candidate} survives as the majority element.`,
    "done",
    "green",
    [10],
    "The final surviving candidate is the answer because the problem guarantees a majority element exists.",
    "Given the majority existence guarantee, the Boyer-Moore survivor must be the majority element.",
    "A real majority cannot be fully canceled by all other values combined.",
    [
      "The algorithm uses O(1) extra space.",
      "The scan is linear because each value is processed once.",
      "If the guarantee did not exist, a verification pass would be needed.",
    ],
    true
  );

  return trace;
}
