import { formatArray, parseNumberList } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type RemoveDuplicatesState = {
  original: number[];
  working: number[];
  uniqueLength: number;
  comparison: string;
  result: number[] | null;
};

type RemoveDuplicatesPointers = {
  read: number | null;
  write: number | null;
};

export type RemoveDuplicatesTraceStep = TeachingTraceFrame & {
  state: RemoveDuplicatesState;
  pointers: RemoveDuplicatesPointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(rawNums: string) {
  const values = parseNumberList(rawNums);
  const working = [...values];
  const trace: RemoveDuplicatesTraceStep[] = [];

  let read: number | null = values.length > 0 ? 1 : null;
  let write: number | null = values.length > 0 ? 1 : 0;
  let comparison = values.length > 0 ? "The first value is always unique." : "The array is empty.";
  let result: number[] | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: RemoveDuplicatesTraceStep["actionTone"],
    codeLines: number[],
    beginnerNote: string,
    expertNote: string,
    focus: string,
    hints: string[],
    done = false
  ) {
    const uniqueLength = typeof write === "number" ? write : values.length;
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
        { label: "Unique Length", value: uniqueLength, tone: "green" },
        { label: "Read Pointer", value: pointerValue(read), tone: "cyan" },
        { label: "Write Pointer", value: pointerValue(write), tone: "purple" },
      ],
      pointerChips: [
        { label: "read", value: pointerValue(read), tone: "cyan" },
        { label: "write", value: pointerValue(write), tone: "purple" },
      ],
      done,
      state: {
        original: [...values],
        working: [...working],
        uniqueLength,
        comparison,
        result: result ? [...result] : null,
      },
      pointers: {
        read,
        write,
      },
    });
  }

  if (values.length === 0) {
    result = [];
    pushStep(
      "The input array is empty, so the unique length is 0.",
      "done",
      "green",
      [1],
      "With no values, there are no unique elements to keep.",
      "The empty-array edge case returns 0 immediately.",
      "No scan is needed when the input length is 0.",
      [
        "The answer prefix is empty.",
        "Time complexity is still O(1) for this edge case.",
        "The in-place invariant is vacuously true.",
      ],
      true
    );
    return trace;
  }

  pushStep(
    `Start with the first value ${working[0]} as the unique prefix.`,
    "initialize",
    "slate",
    [1, 2],
    "A sorted array always keeps its first element, because nothing before it can duplicate it.",
    "The prefix [0, write) stores the deduplicated array in sorted order.",
    "The unique prefix begins with the first element.",
    [
      "Read starts at index 1 because index 0 is already committed.",
      "Write marks the next slot for a new unique value.",
      "Sorted order means duplicates appear in a block.",
    ]
  );

  while (read !== null && write !== null && read < working.length) {
    comparison = `Compare nums[${read}] = ${working[read]} with nums[${write - 1}] = ${working[write - 1]}.`;
    pushStep(
      comparison,
      "compare",
      "yellow",
      [3, 4],
      "The current value is checked against the last committed unique value.",
      "In a sorted array, equality with nums[write - 1] means this value is a duplicate of the current block.",
      "The last committed unique value is always at index write - 1.",
      [
        "No earlier element needs to be checked.",
        "Sorted order collapses duplicate detection to one comparison.",
        "Only new unique values should advance write.",
      ]
    );

    if (working[read] !== working[write - 1]) {
      working[write] = working[read];
      write += 1;

      pushStep(
        `nums[${read}] is new, so copy ${working[write - 1]} into unique slot ${write - 1}.`,
        "keep",
        "green",
        [4, 5, 6],
        "A new value extends the unique prefix by one slot.",
        "Copying nums[read] into nums[write] preserves the sorted unique prefix.",
        "The unique prefix grows only when the current value differs from the last committed unique value.",
        [
          "Write now points to the next free slot after the unique prefix.",
          "The prefix [0, write) contains no duplicates.",
          "Read still moves one step at a time.",
        ]
      );
    } else {
      pushStep(
        `nums[${read}] matches the last unique value, so it is skipped as a duplicate.`,
        "skip",
        "red",
        [4],
        "Duplicates do not change the unique prefix, so write stays put.",
        "Equal adjacent values belong to the same duplicate block in a sorted array.",
        "Skipping a duplicate keeps the unique prefix compact and ordered.",
        [
          "Only read moves forward after a duplicate.",
          "The answer length does not change.",
          "The next distinct value, if any, will eventually be copied into write.",
        ]
      );
    }

    read += 1;
  }

  read = null;
  result = working.slice(0, write ?? 0);

  pushStep(
    `The scan is complete. The first ${(write ?? 0)} slots now store ${formatArray(result)}.`,
    "done",
    "green",
    [8],
    "The answer is the length of the deduplicated prefix.",
    "The algorithm returns write, which equals the number of distinct values copied into the prefix.",
    "The deduplicated array lives entirely in the first write positions.",
    [
      "Every duplicate block contributed exactly one value to the prefix.",
      "Time complexity is O(n) with O(1) extra space.",
      "The prefix remains sorted because only forward copies are used.",
    ],
    true
  );

  return trace;
}
