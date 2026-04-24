import { parseNumberList } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type ProductState = {
  nums: number[];
  answer: number[];
  prefix: number;
  suffix: number;
  currentValue: number | null;
  phase: "prefix" | "suffix" | "done";
  result: number[] | null;
};

type ProductPointers = {
  index: number | null;
};

export type ProductExceptSelfTraceStep = TeachingTraceFrame & {
  state: ProductState;
  pointers: ProductPointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(rawNums: string) {
  const nums = parseNumberList(rawNums);
  const answer = new Array(nums.length).fill(1);
  const trace: ProductExceptSelfTraceStep[] = [];

  let index: number | null = nums.length === 0 ? null : 0;
  let prefix = 1;
  let suffix = 1;
  let currentValue: number | null = null;
  let phase: ProductState["phase"] = "prefix";
  let result: number[] | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: ProductExceptSelfTraceStep["actionTone"],
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
        { label: "Phase", value: phase, tone: "purple" },
        { label: "Prefix", value: prefix, tone: "cyan" },
        { label: "Suffix", value: suffix, tone: "green" },
      ],
      pointerChips: [
        { label: "index", value: pointerValue(index), tone: "yellow" },
        { label: "phase", value: phase, tone: "purple" },
      ],
      done,
      state: {
        nums: [...nums],
        answer: [...answer],
        prefix,
        suffix,
        currentValue,
        phase,
        result: result ? [...result] : null,
      },
      pointers: {
        index,
      },
    });
  }

  pushStep(
    "Start with an answer array full of 1s. The first pass writes products of everything to the left of each index.",
    "initialize",
    "slate",
    [1, 2, 3, 4],
    "Each slot will first learn its left-side product, then a second pass will multiply in the right-side product.",
    "The invariant after the prefix pass is answer[i] = product of nums[0..i-1]. The suffix pass completes the missing right contribution.",
    "Split the problem into left context and right context so division is never needed.",
    [
      "Prefix starts at 1 because nothing exists to the left of index 0.",
      "Suffix also starts at 1 for the same reason on the right edge.",
      "The answer array is reused so extra space stays minimal.",
    ]
  );

  while (index !== null && index < nums.length) {
    currentValue = nums[index];
    const storedPrefix = prefix;
    answer[index] = storedPrefix;
    prefix *= currentValue;

    pushStep(
      `Write left product ${storedPrefix} into answer[${index}], then absorb nums[${index}] = ${currentValue} into prefix so it becomes ${prefix}.`,
      "prefix-write",
      "cyan",
      [5, 6, 7],
      "The current slot stores everything before it, then prefix grows so the next slot sees one more value on its left.",
      "Because prefix is updated after the write, answer[i] receives exactly the product of elements strictly left of i.",
      "The write uses the old prefix; the multiplication prepares the next iteration.",
      [
        "answer[i] never includes nums[i] during the prefix write.",
        "This pass alone is not enough because right-side values are still missing.",
        "Every index is visited once from left to right.",
      ]
    );

    index += 1;
  }

  phase = "suffix";
  currentValue = null;
  index = nums.length === 0 ? null : nums.length - 1;

  pushStep(
    "The left products are ready. Reverse direction and multiply each slot by the product of everything to its right.",
    "switch-pass",
    "purple",
    [9, 10],
    "Now the answer array already knows the left side, so suffix will finish each slot with the right side.",
    "During the suffix pass, answer[i] becomes leftProduct[i] * rightProduct[i], which is the full product except self.",
    "A single running suffix is enough because the loop moves right to left.",
    [
      "Suffix begins at 1 on the far right.",
      "Indices processed during this pass become final immediately.",
      "No division is ever used.",
    ]
  );

  while (index !== null && index >= 0) {
    currentValue = nums[index];
    const suffixBeforeWrite = suffix;
    answer[index] *= suffixBeforeWrite;
    suffix *= currentValue;

    pushStep(
      `Multiply answer[${index}] by right product ${suffixBeforeWrite}, then absorb nums[${index}] = ${currentValue} into suffix so it becomes ${suffix}.`,
      "suffix-write",
      "green",
      [10, 11, 12],
      "The current slot already holds the left product. Multiplying by suffix adds the missing right-side contribution.",
      "Because suffix is updated after the multiplication, answer[i] uses the product of elements strictly right of i.",
      "Each suffix step finalizes one answer slot from right to left.",
      [
        "The suffix value belongs to indices strictly to the right.",
        "Processed cells are now complete and will not change again.",
        "The answer is built in O(n) time with O(1) auxiliary algorithmic space.",
      ]
    );

    index -= 1;
  }

  phase = "done";
  currentValue = null;
  index = null;
  result = [...answer];

  pushStep(
    "Both passes are complete, so every slot now equals the product of all other elements.",
    "done",
    "green",
    [14],
    "The two running products met in the middle through the answer array.",
    "Each answer slot is leftProduct[i] multiplied by rightProduct[i], exactly matching the problem definition.",
    "Two linear sweeps are enough to reconstruct the full answer without division.",
    [
      "Time complexity is O(n).",
      "Auxiliary algorithmic space is O(1) beyond the output array.",
      "Zeros are handled naturally because prefix and suffix carry them through the correct ranges.",
    ],
    true
  );

  return trace;
}
