import { formatArray, parseNumberList } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type HIndexState = {
  original: number[];
  sorted: number[];
  currentCitation: number | null;
  requirement: number | null;
  h: number;
  result: number | null;
};

type HIndexPointers = {
  index: number | null;
};

export type HIndexTraceStep = TeachingTraceFrame & {
  state: HIndexState;
  pointers: HIndexPointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(rawCitations: string) {
  const original = parseNumberList(rawCitations);
  const sorted = [...original].sort((left, right) => right - left);
  const trace: HIndexTraceStep[] = [];

  let index: number | null = 0;
  let currentCitation: number | null = null;
  let requirement: number | null = null;
  let h = 0;
  let result: number | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: HIndexTraceStep["actionTone"],
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
        {
          label: "Requirement",
          value: requirement === null ? "n/a" : String(requirement),
          tone: "yellow",
        },
        { label: "Current h", value: h, tone: "green" },
      ],
      pointerChips: [
        { label: "index", value: pointerValue(index), tone: "cyan" },
        {
          label: "requirement",
          value: requirement === null ? "n/a" : String(requirement),
          tone: "yellow",
        },
      ],
      done,
      state: {
        original: [...original],
        sorted: [...sorted],
        currentCitation,
        requirement,
        h,
        result,
      },
      pointers: {
        index,
      },
    });
  }

  pushStep(
    `Sort the citations in descending order: ${formatArray(sorted)}.`,
    "sort",
    "purple",
    [1, 2],
    "After sorting from largest to smallest, each index directly suggests a candidate h-value.",
    "Descending order makes the predicate citations[i] >= i + 1 monotone until it fails.",
    "The first failure point determines the maximum valid h.",
    [
      "Index i asks whether there are at least i + 1 papers with at least i + 1 citations.",
      "Once the condition fails, it cannot recover later in descending order.",
      "Sorting costs O(n log n).",
    ]
  );

  while (index !== null && index < sorted.length) {
    currentCitation = sorted[index];
    requirement = index + 1;

    pushStep(
      `Paper ${index} has ${currentCitation} citations. Test whether ${currentCitation} >= ${requirement}.`,
      "inspect",
      "yellow",
      [4, 5],
      "This paper is helping test whether h can be at least index + 1.",
      "The condition citations[i] >= i + 1 is the exact threshold for a valid h candidate after sorting.",
      "Each sorted position proposes one candidate h = i + 1.",
      [
        "The requirement grows by one each step.",
        "The citations are non-increasing after sorting.",
        "A failure stops the scan immediately.",
      ]
    );

    if (currentCitation >= requirement) {
      h = requirement;
      pushStep(
        `The threshold holds, so update h to ${h}.`,
        "accept",
        "green",
        [5],
        "There are at least h papers with at least h citations so far.",
        "Because the sorted prefix length is requirement and the current citation still meets that threshold, h = requirement is valid.",
        "h tracks the largest threshold confirmed so far.",
        [
          "A later paper may still increase h further.",
          "The accepted prefix now has length h.",
          "The scan continues to the next candidate threshold.",
        ]
      );
    } else {
      result = h;
      pushStep(
        `The threshold fails because ${currentCitation} < ${requirement}, so the h-index stays at ${h}.`,
        "stop",
        "red",
        [6],
        "This is the first point where the next bigger h-value stops being possible.",
        "Failure is final in descending order: later citations are no larger, so they cannot satisfy a higher threshold either.",
        "The first failed threshold locks the answer at the previous valid h.",
        [
          "No later index can recover the condition.",
          "The scan can stop immediately.",
          "The answer is the last accepted h.",
        ],
        true
      );
      return trace;
    }

    index += 1;
  }

  index = null;
  currentCitation = null;
  requirement = null;
  result = h;

  pushStep(
    `All papers passed their threshold checks. The h-index is ${h}.`,
    "done",
    "green",
    [8],
    "The final confirmed threshold is the answer.",
    "After the full scan, h is the largest index-based threshold satisfied by the sorted citation counts.",
    "The descending threshold test has identified the maximum valid h.",
    [
      "The algorithm returns h after the loop.",
      "Time complexity is dominated by sorting.",
      "The interpretation is still the same: h papers have at least h citations.",
    ],
    true
  );

  return trace;
}
