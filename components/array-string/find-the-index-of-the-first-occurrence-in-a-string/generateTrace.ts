import type { TeachingTraceFrame } from "../shared/types";

type Attempt = {
  start: number;
  status: "checking" | "mismatch" | "match";
  matched: number;
};

type FirstOccurrenceState = {
  haystack: string;
  needle: string;
  start: number | null;
  compareIndex: number | null;
  matched: number;
  attempts: Attempt[];
  result: number | null;
};

type FirstOccurrencePointers = {
  start: number | null;
  compareIndex: number | null;
};

export type FirstOccurrenceTraceStep = TeachingTraceFrame & {
  state: FirstOccurrenceState;
  pointers: FirstOccurrencePointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(haystack: string, needle: string) {
  const trace: FirstOccurrenceTraceStep[] = [];
  const attempts: Attempt[] = [];

  let start: number | null =
    needle.length === 0 || haystack.length >= needle.length ? 0 : null;
  let compareIndex: number | null = null;
  let matched = 0;
  let result: number | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: FirstOccurrenceTraceStep["actionTone"],
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
        { label: "Candidate Start", value: pointerValue(start), tone: "cyan" },
        { label: "Matched Prefix", value: matched, tone: "green" },
        { label: "Needle Length", value: needle.length, tone: "purple" },
      ],
      pointerChips: [
        { label: "start", value: pointerValue(start), tone: "cyan" },
        { label: "j", value: pointerValue(compareIndex), tone: "yellow" },
      ],
      done,
      state: {
        haystack,
        needle,
        start,
        compareIndex,
        matched,
        attempts: attempts.map((attempt) => ({ ...attempt })),
        result,
      },
      pointers: {
        start,
        compareIndex,
      },
    });
  }

  pushStep(
    needle.length === 0
      ? "The needle is empty, so the first valid occurrence is index 0."
      : "Slide the needle across the haystack and compare one aligned character at a time.",
    "initialize",
    "slate",
    [1, 2],
    needle.length === 0
      ? "An empty pattern matches immediately at the beginning."
      : "Each candidate start tries to match the needle from left to right before we move on.",
    needle.length === 0
      ? "By convention, the empty substring occurs at index 0."
      : "The naive matcher maintains a simple invariant: only the current start and current prefix match count matter.",
    needle.length === 0
      ? "No comparisons are needed."
      : "The current candidate window is the only active alignment.",
    needle.length === 0
      ? [
          "The answer is immediate.",
          "No alignment loop runs.",
          "No mismatch can occur.",
        ]
      : [
          "The scan stops on the first full match.",
          "A mismatch resets the matched count for the next start.",
          "Only one candidate window is active at any time.",
        ]
  );

  if (needle.length === 0) {
    result = 0;
    start = null;

    pushStep(
      "Because the needle is empty, return 0 immediately.",
      "done",
      "green",
      [7],
      "No search is needed when the pattern is empty.",
      "The empty string is found at the beginning by definition.",
      "The answer is resolved before scanning any characters.",
      [
        "This is a standard substring-search edge case.",
        "No mismatch states are possible.",
        "Time complexity becomes O(1).",
      ],
      true
    );

    return trace;
  }

  for (let candidate = 0; candidate + needle.length <= haystack.length; candidate += 1) {
    start = candidate;
    compareIndex = 0;
    matched = 0;
    attempts.push({ start: candidate, status: "checking", matched: 0 });

    pushStep(
      `Try aligning the needle at haystack index ${candidate}.`,
      "candidate",
      "purple",
      [2, 3],
      "A new candidate window starts here.",
      "Every outer-loop iteration fixes a start index and resets the inner comparison pointer.",
      "The needle is now aligned under the current haystack window.",
      [
        "All earlier candidates have already failed.",
        "The first success ends the search.",
        "The next steps compare characters inside this window.",
      ]
    );

    let fullMatch = true;

    for (let j = 0; j < needle.length; j += 1) {
      compareIndex = j;

      pushStep(
        `Compare haystack[${candidate + j}] = '${haystack[candidate + j]}' with needle[${j}] = '${needle[j]}'.`,
        "compare",
        "yellow",
        [4],
        "We are checking whether the next aligned characters agree.",
        "The inner loop advances only while the aligned prefix remains equal.",
        "A single mismatched pair invalidates this entire candidate start.",
        [
          "Matched characters extend the current prefix length.",
          "A mismatch stops the inner loop immediately.",
          "The haystack window stays fixed during this inner comparison.",
        ]
      );

      if (haystack[candidate + j] !== needle[j]) {
        fullMatch = false;
        matched = j;
        attempts[attempts.length - 1] = {
          start: candidate,
          status: "mismatch",
          matched: j,
        };

        pushStep(
          `Mismatch at offset ${j}, so candidate start ${candidate} fails and the scan must shift right.`,
          "mismatch",
          "red",
          [4, 5],
          "These characters do not match, so this window cannot contain the answer.",
          "The naive matcher rejects the current candidate as soon as the matched-prefix invariant breaks.",
          "This candidate is finished; the next start will be tested instead.",
          [
            "Earlier matched characters for this candidate no longer matter.",
            "The needle realigns one position to the right on the next outer step.",
            "The matched counter resets for the new candidate.",
          ]
        );
        break;
      }

      matched = j + 1;

      pushStep(
        `The characters match, so the aligned prefix grows to length ${matched}.`,
        "match",
        "green",
        [4, 5],
        "This aligned character pair agrees, so the current candidate is still alive.",
        "The matched prefix length is the only inner-loop state that needs to survive between comparisons.",
        "The candidate window remains valid until a mismatch appears.",
        [
          "The next comparison checks the following aligned characters.",
          "Matched prefix length increases monotonically inside one candidate.",
          "A full needle-length match ends the whole search.",
        ]
      );
    }

    if (fullMatch && matched === needle.length) {
      attempts[attempts.length - 1] = {
        start: candidate,
        status: "match",
        matched,
      };
      result = candidate;

      pushStep(
        `All ${needle.length} characters matched, so the first occurrence is index ${candidate}.`,
        "found",
        "green",
        [7],
        "This window matched the whole needle, so we can return its starting index immediately.",
        "The first full inner-loop success proves minimality because candidates are tested in increasing start order.",
        "The search stops at the earliest successful alignment.",
        [
          "No later candidate can be the first occurrence anymore.",
          "The result is returned immediately.",
          "The trace highlights the winning alignment.",
        ]
      );
      break;
    }
  }

  start = null;
  compareIndex = null;

  if (result === null) {
    result = -1;
    matched = 0;

    pushStep(
      "Every candidate alignment failed, so the needle does not occur in the haystack.",
      "done",
      "red",
      [9],
      "We checked every possible starting window and none matched fully.",
      "Exhausting the candidate range without a full inner-loop success proves absence of the needle.",
      "No valid occurrence exists.",
      [
        "The return value becomes -1.",
        "All attempts in the ledger are failures.",
        "Time complexity is O((n - m + 1) * m) in the worst case.",
      ],
      true
    );
  } else {
    pushStep(
      `Search complete. Return the first occurrence index ${result}.`,
      "done",
      "green",
      [7],
      "The earliest full match has already been found.",
      "The search terminates at the first successful candidate because the outer loop moves left to right.",
      "The first occurrence is fully resolved.",
      [
        "No later match can replace the first one.",
        "The winning attempt remains marked in the ledger.",
        "Worst-case time is still O((n - m + 1) * m).",
      ],
      true
    );
  }

  return trace;
}
