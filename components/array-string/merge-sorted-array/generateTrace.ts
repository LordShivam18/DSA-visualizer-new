import { formatArray, parseInteger, parseNumberList } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type MergeState = {
  originalNums1: number[];
  nums2: number[];
  working: number[];
  m: number;
  n: number;
  comparison: string;
  result: number[] | null;
};

type MergePointers = {
  i: number | null;
  j: number | null;
  write: number | null;
  source: "nums1" | "nums2" | null;
};

export type MergeSortedArrayTraceStep = TeachingTraceFrame & {
  state: MergeState;
  pointers: MergePointers;
};

function normalizeNums1(values: number[], length: number) {
  const normalized = [...values.slice(0, length)];
  while (normalized.length < length) {
    normalized.push(0);
  }
  return normalized;
}

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(
  rawNums1: string,
  rawM: string,
  rawNums2: string,
  rawN: string
) {
  const nums1Input = parseNumberList(rawNums1);
  const nums2Input = parseNumberList(rawNums2);
  const m = Math.max(0, parseInteger(rawM, nums1Input.length));
  const n = Math.max(0, parseInteger(rawN, nums2Input.length));
  const nums2 = nums2Input.slice(0, n);
  const working = normalizeNums1(nums1Input, m + n);
  const originalNums1 = [...working];
  const trace: MergeSortedArrayTraceStep[] = [];

  let i: number | null = m - 1;
  let j: number | null = n - 1;
  let write: number | null = m + n - 1;
  let source: "nums1" | "nums2" | null = null;
  let comparison = "Pointers are ready to compare the largest remaining values.";
  let result: number[] | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: MergeSortedArrayTraceStep["actionTone"],
    codeLines: number[],
    beginnerNote: string,
    expertNote: string,
    focus: string,
    hints: string[],
    done = false
  ) {
    const placedSlots = write === null ? working.length : Math.max(0, working.length - 1 - write);

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
        { label: "Placed Slots", value: placedSlots, tone: "green" },
        {
          label: "nums1 Values Left",
          value: i === null ? 0 : Math.max(i + 1, 0),
          tone: "purple",
        },
        {
          label: "nums2 Values Left",
          value: j === null ? 0 : Math.max(j + 1, 0),
          tone: "cyan",
        },
      ],
      pointerChips: [
        { label: "i", value: pointerValue(i), tone: "purple" },
        { label: "j", value: pointerValue(j), tone: "cyan" },
        { label: "write", value: pointerValue(write), tone: "yellow" },
        {
          label: "source",
          value: source ?? "pending",
          tone: source === "nums1" ? "purple" : source === "nums2" ? "cyan" : "slate",
        },
      ],
      done,
      state: {
        originalNums1: [...originalNums1],
        nums2: [...nums2],
        working: [...working],
        m,
        n,
        comparison,
        result: result ? [...result] : null,
      },
      pointers: {
        i,
        j,
        write,
        source,
      },
    });
  }

  pushStep(
    `Initialize three pointers on nums1 and nums2. nums1 will be filled from the back into ${formatArray(working)}.`,
    "initialize",
    "slate",
    [1, 2],
    "We begin at the largest valid values because the back of nums1 is safe buffer space.",
    "Backward merging avoids shifting elements. Every write lands in a free or already-consumed slot.",
    "The write pointer always marks the next final position in nums1.",
    [
      "Only the first m values of nums1 are real input values.",
      "The last n slots of nums1 are spare capacity for the merge.",
      "Comparing from the back preserves sorted order in-place.",
    ]
  );

  while (j !== null && j >= 0 && write !== null) {
    source = null;
    if (i !== null && i >= 0) {
      comparison = `Compare nums1[${i}] = ${working[i]} with nums2[${j}] = ${nums2[j]}.`;
      pushStep(
        comparison,
        "compare",
        "yellow",
        [3, 4],
        "The algorithm looks at the biggest unused value from each array.",
        "Because both arrays are sorted, the larger tail value must occupy nums1[write].",
        "Whichever tail value is larger must be written next into the final merged suffix.",
        [
          "No earlier value can be larger than the current tail of a sorted array.",
          "The write pointer moves only after a value is placed.",
          "The compared values are still untouched when this snapshot is taken.",
        ]
      );
    } else {
      comparison = `nums1 is exhausted, so the remaining nums2 value ${nums2[j]} must be copied into slot ${write}.`;
      pushStep(
        comparison,
        "compare",
        "yellow",
        [3, 7, 8],
        "Once nums1 runs out, every remaining nums2 value slides straight into the front slots.",
        "The loop condition is driven by j because leftover nums1 values are already in correct order.",
        "Only nums2 leftovers require explicit copying; nums1 leftovers are already placed.",
        [
          "When i drops below 0, the only unseen values live in nums2.",
          "The merge still writes from the back to avoid collisions.",
          "The array stays sorted after each write.",
        ]
      );
    }

    if (i !== null && i >= 0 && working[i] > nums2[j]) {
      source = "nums1";
      working[write] = working[i];
      comparison = `nums1[${i}] = ${working[write]} is larger, so it takes final slot ${write}.`;
      i -= 1;
      write -= 1;

      pushStep(
        comparison,
        "write",
        "purple",
        [4, 5, 6, 11],
        "The larger nums1 value locks into place at the end, and both i and write move left.",
        "Writing the larger tail value preserves sorted order in the completed suffix.",
        "Everything to the right of write is already final and never changes again.",
        [
          "The moved value now belongs to the finished merged suffix.",
          "Only i moves because nums2[j] is still waiting for comparison.",
          "The suffix grows from right to left one slot at a time.",
        ]
      );
    } else {
      source = "nums2";
      working[write] = nums2[j];
      comparison = `nums2[${j}] = ${working[write]} is chosen for final slot ${write}.`;
      j -= 1;
      write -= 1;

      pushStep(
        comparison,
        "write",
        "cyan",
        [7, 8, 9, 11],
        "The nums2 value is at least as large, so it belongs at the current write slot.",
        "Choosing nums2 on ties keeps the invariant intact because both values are valid for the current tail position.",
        "After the write, the merged suffix remains sorted and permanently fixed.",
        [
          "Only j moves because nums1[i] still has not been used.",
          "Ties may come from either array without breaking the final order.",
          "The write pointer always advances left after a placement.",
        ]
      );
    }
  }

  source = null;
  write = null;
  result = [...working];

  pushStep(
    `nums2 is fully consumed. nums1 now stores the merged answer ${formatArray(result)}.`,
    "done",
    "green",
    [3, 13],
    "The merge stops as soon as every nums2 value has been placed.",
    "Any leftover nums1 prefix is already correctly positioned, so the in-place merge is complete.",
    "The final nums1 array is sorted because every write fixed the next largest remaining value.",
    [
      "The loop ends when j becomes -1.",
      "Leftover nums1 values never need extra work.",
      "Time complexity is O(m + n) with O(1) extra space.",
    ],
    true
  );

  return trace;
}
