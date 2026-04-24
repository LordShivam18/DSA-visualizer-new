import { formatArray, parseInteger, parseNumberList } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type RemoveElementState = {
  original: number[];
  working: number[];
  target: number;
  keptLength: number;
  currentValue: number | null;
  result: number[] | null;
};

type RemoveElementPointers = {
  read: number | null;
  write: number | null;
};

export type RemoveElementTraceStep = TeachingTraceFrame & {
  state: RemoveElementState;
  pointers: RemoveElementPointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(rawNums: string, rawTarget: string) {
  const values = parseNumberList(rawNums);
  const working = [...values];
  const target = parseInteger(rawTarget, 0);
  const trace: RemoveElementTraceStep[] = [];

  let read: number | null = 0;
  let write: number | null = 0;
  let currentValue: number | null = null;
  let result: number[] | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: RemoveElementTraceStep["actionTone"],
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
        { label: "Read Pointer", value: pointerValue(read), tone: "cyan" },
        { label: "Write Pointer", value: pointerValue(write), tone: "purple" },
        { label: "Kept Length", value: write ?? 0, tone: "green" },
      ],
      pointerChips: [
        { label: "read", value: pointerValue(read), tone: "cyan" },
        { label: "write", value: pointerValue(write), tone: "purple" },
        { label: "target", value: String(target), tone: "red" },
      ],
      done,
      state: {
        original: [...values],
        working: [...working],
        target,
        keptLength: write ?? 0,
        currentValue,
        result: result ? [...result] : null,
      },
      pointers: {
        read,
        write,
      },
    });
  }

  pushStep(
    `Start with read = 0 and write = 0. Values equal to ${target} will be skipped while the kept values are compacted to the front.`,
    "initialize",
    "slate",
    [1, 2],
    "One pointer reads every value. The other pointer marks where the next kept value should go.",
    "The prefix [0, write) is maintained as the compacted array with no target values.",
    "Everything before write is already a valid kept prefix.",
    [
      "Read scans all positions exactly once.",
      "Write grows only when a value survives.",
      "The array is updated in-place.",
    ]
  );

  while (read !== null && write !== null && read < working.length) {
    currentValue = working[read];
    pushStep(
      `Inspect nums[${read}] = ${currentValue}.`,
      "inspect",
      "yellow",
      [3],
      "The read pointer checks whether the current value should stay or disappear.",
      "Each iteration decides whether nums[read] belongs in the compacted prefix.",
      "The decision depends only on whether nums[read] equals the removal target.",
      [
        "The kept prefix has length write before this decision.",
        "The current value has not been copied yet.",
        "The suffix after read is still untouched input.",
      ]
    );

    if (currentValue !== target) {
      working[write] = currentValue;
      write += 1;

      pushStep(
        `Keep ${currentValue}. Write it into slot ${write - 1} and grow the compacted prefix.`,
        "keep",
        "green",
        [4, 5],
        "Because the value is not the target, it joins the answer prefix.",
        "Assigning nums[write] = nums[read] preserves all kept values contiguously in the first write slots.",
        "The range [0, write) always contains exactly the kept values seen so far.",
        [
          "Write may equal read or may lag behind it.",
          "Either way, the front prefix stays correct after the copy.",
          "The answer length becomes the new write value.",
        ]
      );
    } else {
      pushStep(
        `Skip ${currentValue} because it matches the target ${target}.`,
        "skip",
        "red",
        [3],
        "Target values are ignored, so write does not move.",
        "Skipping preserves the invariant that the kept prefix contains no target value.",
        "Only write controls the final length of the compacted prefix.",
        [
          "Read still advances because this index has been processed.",
          "Nothing new is written into the answer prefix.",
          "The current slot may later be overwritten by a kept value.",
        ]
      );
    }

    read += 1;
  }

  currentValue = null;
  read = null;
  result = working.slice(0, write);

  pushStep(
    `The scan is complete. The first ${write} slots now hold the kept values ${formatArray(result)}.`,
    "done",
    "green",
    [7],
    "The answer is the length of the kept prefix at the front of the array.",
    "The algorithm returns write, because that pointer equals the number of non-target values copied into the prefix.",
    "The compacted prefix is the only part the judge cares about.",
    [
      "Indices beyond write are irrelevant to the accepted answer.",
      "Time complexity is O(n) and extra space is O(1).",
      "The order of kept elements stays the same in this version.",
    ],
    true
  );

  return trace;
}
