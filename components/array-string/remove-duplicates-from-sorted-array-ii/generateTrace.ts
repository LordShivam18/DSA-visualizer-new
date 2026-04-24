import { formatArray, parseNumberList } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type RemoveDuplicatesIIState = {
  original: number[];
  working: number[];
  keptLength: number;
  comparison: string;
  result: number[] | null;
};

type RemoveDuplicatesIIPointers = {
  read: number | null;
  write: number | null;
};

export type RemoveDuplicatesIITraceStep = TeachingTraceFrame & {
  state: RemoveDuplicatesIIState;
  pointers: RemoveDuplicatesIIPointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(rawNums: string) {
  const values = parseNumberList(rawNums);
  const working = [...values];
  const trace: RemoveDuplicatesIITraceStep[] = [];

  let read: number | null = values.length > 2 ? 2 : values.length;
  let write: number | null = Math.min(values.length, 2);
  let comparison =
    values.length <= 2
      ? "Arrays of length 0, 1, or 2 are already valid."
      : "The first two values are always allowed.";
  let result: number[] | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: RemoveDuplicatesIITraceStep["actionTone"],
    codeLines: number[],
    beginnerNote: string,
    expertNote: string,
    focus: string,
    hints: string[],
    done = false
  ) {
    const keptLength = typeof write === "number" ? write : values.length;
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
        { label: "Kept Length", value: keptLength, tone: "green" },
        { label: "Read Pointer", value: pointerValue(read), tone: "cyan" },
        { label: "Write Pointer", value: pointerValue(write), tone: "purple" },
      ],
      pointerChips: [
        { label: "read", value: pointerValue(read), tone: "cyan" },
        { label: "write", value: pointerValue(write), tone: "purple" },
        {
          label: "lookback",
          value:
            typeof write === "number" && write >= 2
              ? String(working[write - 2])
              : "n/a",
          tone: "yellow",
        },
      ],
      done,
      state: {
        original: [...values],
        working: [...working],
        keptLength,
        comparison,
        result: result ? [...result] : null,
      },
      pointers: {
        read,
        write,
      },
    });
  }

  pushStep(
    values.length <= 2
      ? `The array length is ${values.length}, so it already satisfies the "at most twice" rule.`
      : `Keep the first two values, then test each next value against nums[write - 2].`,
    "initialize",
    "slate",
    [1, 2],
    values.length <= 2
      ? "Any value can appear at most twice when the array has two or fewer elements."
      : "The first two values are automatically safe because no number has appeared more than twice yet.",
    values.length <= 2
      ? "The base case returns the full length immediately."
      : "The prefix [0, write) always satisfies the constraint that each value appears at most twice.",
    "The comparison target is nums[write - 2], not the immediate last value.",
    [
      "Looking back two slots tells us whether the current value would create a third copy.",
      "The kept prefix remains sorted and compact.",
      "Only values that do not violate the two-copy limit advance write.",
    ],
    values.length <= 2
  );

  while (read !== null && write !== null && read < working.length) {
    comparison = `Compare nums[${read}] = ${working[read]} with nums[${write - 2}] = ${working[write - 2]}.`;
    pushStep(
      comparison,
      "compare",
      "yellow",
      [3, 4],
      "The current value is allowed only if it differs from the value two spots behind the write pointer.",
      "Equality with nums[write - 2] means the current value would create a third occurrence in the kept prefix.",
      "The write - 2 lookback is the precise test for " +
        "whether a third duplicate would appear.",
      [
        "Sorted order groups identical values together.",
        "If nums[read] differs from nums[write - 2], it is still safe to keep.",
        "The first two copies of a number remain valid.",
      ]
    );

    if (working[read] !== working[write - 2]) {
      working[write] = working[read];
      write += 1;

      pushStep(
        `Keep ${working[write - 1]} because it does not create a third copy.`,
        "keep",
        "green",
        [4, 5, 6],
        "This value is safe, so it extends the valid prefix.",
        "Copying nums[read] into nums[write] preserves the sorted prefix with at most two copies per value.",
        "The kept prefix remains valid after each accepted value.",
        [
          "A value may appear once or twice in the prefix, but never three times.",
          "Write advances only after an allowed value is copied.",
          "The answer length is always write.",
        ]
      );
    } else {
      pushStep(
        `Skip ${working[read]} because it would become a third copy in the kept prefix.`,
        "skip",
        "red",
        [4],
        "A third duplicate is not allowed, so the write pointer stays where it is.",
        "The comparison against nums[write - 2] directly blocks any third occurrence from entering the prefix.",
        "Rejecting the value preserves the at-most-two invariant.",
        [
          "Only read advances after a rejected third copy.",
          "The current kept prefix remains unchanged.",
          "Future distinct values can still be copied into write.",
        ]
      );
    }

    read += 1;
  }

  read = null;
  result = working.slice(0, write ?? values.length);

  pushStep(
    `The scan is complete. The first ${(write ?? values.length)} slots now store ${formatArray(result)}.`,
    "done",
    "green",
    [8],
    "The answer is the length of the valid prefix where every value appears at most twice.",
    "The algorithm returns write because the kept prefix [0, write) is the final in-place answer.",
    "The two-copy constraint holds for the entire prefix.",
    [
      "Time complexity is O(n) with O(1) extra space.",
      "Sorted order makes a two-slot lookback sufficient.",
      "The remaining tail beyond write does not matter to the judge.",
    ],
    true
  );

  return trace;
}
