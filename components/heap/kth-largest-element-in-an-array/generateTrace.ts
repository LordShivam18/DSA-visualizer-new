export type HeapEntry = {
  id: string;
  value: number;
  sourceIndex: number;
};

export type KthLargestState = {
  nums: number[];
  k: number;
  heap: HeapEntry[];
  processedIndices: number[];
  currentIndex: number | null;
  currentValue: number | null;
  lastInserted: HeapEntry | null;
  lastRemoved: HeapEntry | null;
  answer: number | null;
  heapTop: HeapEntry | null;
};

export type KthLargestPointers = {
  scan: number | null;
  heapIndex: number | null;
  compareIndex: number | null;
  topIndex: number | null;
};

export type KthLargestActionKind =
  | "parsed"
  | "inspect"
  | "push"
  | "bubble-up"
  | "size-check"
  | "trim"
  | "bubble-down"
  | "done";

export type KthLargestTraceStep = {
  step: number;
  state: KthLargestState;
  pointers: KthLargestPointers;
  action: string;
  actionKind: KthLargestActionKind;
  codeLines: number[];
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

export function parseNumberList(rawInput: string) {
  return rawInput
    .split(/[\s,]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map((token) => Number(token))
    .filter((value) => Number.isFinite(value));
}

export function parseKValue(rawInput: string, numsLength: number) {
  const parsed = Number(rawInput.trim());
  if (!Number.isFinite(parsed)) {
    return numsLength > 0 ? 1 : 0;
  }

  const floored = Math.max(1, Math.floor(parsed));
  if (numsLength === 0) {
    return 0;
  }

  return Math.min(floored, numsLength);
}

export function formatAnswer(value: number | null) {
  return value === null ? "n/a" : String(value);
}

function cloneHeap(heap: HeapEntry[]) {
  return heap.map((entry) => ({ ...entry }));
}

function createEntry(value: number, sourceIndex: number): HeapEntry {
  return {
    id: `${sourceIndex}-${value}`,
    value,
    sourceIndex,
  };
}

export function generateTrace(
  rawNumbers: string,
  rawK: string
): KthLargestTraceStep[] {
  const nums = parseNumberList(rawNumbers);
  const k = parseKValue(rawK, nums.length);
  const heap: HeapEntry[] = [];
  const processedIndices: number[] = [];
  const trace: KthLargestTraceStep[] = [];

  let currentIndex: number | null = null;
  let currentValue: number | null = null;
  let lastInserted: HeapEntry | null = null;
  let lastRemoved: HeapEntry | null = null;
  let answer: number | null = null;

  let scanPointer: number | null = null;
  let heapIndexPointer: number | null = null;
  let compareIndexPointer: number | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    explanationBeginner,
    explanationExpert,
    done,
  }: {
    action: string;
    actionKind: KthLargestActionKind;
    codeLines: number[];
    explanationBeginner: string;
    explanationExpert: string;
    done: boolean;
  }) {
    trace.push({
      step: trace.length,
      action,
      actionKind,
      codeLines,
      state: {
        nums: [...nums],
        k,
        heap: cloneHeap(heap),
        processedIndices: [...processedIndices],
        currentIndex,
        currentValue,
        lastInserted: lastInserted ? { ...lastInserted } : null,
        lastRemoved: lastRemoved ? { ...lastRemoved } : null,
        answer,
        heapTop: heap.length > 0 ? { ...heap[0] } : null,
      },
      pointers: {
        scan: scanPointer,
        heapIndex: heapIndexPointer,
        compareIndex: compareIndexPointer,
        topIndex: heap.length > 0 ? 0 : null,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      nums.length === 0
        ? "Parse the input. There are no numbers yet, so the heap cannot produce a kth largest value."
        : `Parse the array and prepare a min-heap that will keep only the ${k} largest values seen so far.`,
    actionKind: "parsed",
    codeLines: [1, 2],
    explanationBeginner:
      nums.length === 0
        ? "Enter at least one number so the heap has something to rank."
        : "The trick is to keep only k survivors. The smallest survivor sits at the root.",
    explanationExpert:
      nums.length === 0
        ? "The empty-input edge case has no valid order statistic."
        : "A size-k min-heap stores the current k largest values. Its root is the kth largest among processed elements.",
    done: false,
  });

  if (nums.length === 0 || k === 0) {
    pushStep({
      action: "The trace stops immediately because a valid kth largest value cannot be formed from an empty stream.",
      actionKind: "done",
      codeLines: [9],
      explanationBeginner:
        "There is nothing to compare yet, so the answer stays unavailable.",
      explanationExpert:
        "Without elements, the order statistic is undefined.",
      done: true,
    });
    return trace;
  }

  function bubbleUp(insertIndex: number) {
    let child = insertIndex;

    while (child > 0) {
      const parent = Math.floor((child - 1) / 2);
      heapIndexPointer = child;
      compareIndexPointer = parent;

      if (heap[parent].value <= heap[child].value) {
        pushStep({
          action: `Compare heap[${child}] = ${heap[child].value} with parent heap[${parent}] = ${heap[parent].value}. The min-heap order already holds, so bubbling stops.`,
          actionKind: "bubble-up",
          codeLines: [4],
          explanationBeginner:
            "Smaller values should stay closer to the top. This new value is already in a safe spot.",
          explanationExpert:
            "Bubble-up terminates once parent <= child, which restores the heap invariant on the insertion path.",
          done: false,
        });
        break;
      }

      [heap[parent], heap[child]] = [heap[child], heap[parent]];
      heapIndexPointer = parent;
      compareIndexPointer = child;

      pushStep({
        action: `Swap ${heap[parent].value} upward with ${heap[child].value} so the smaller value rises toward the root.`,
        actionKind: "bubble-up",
        codeLines: [4],
        explanationBeginner:
          "The heap fixes itself by moving the smaller value upward.",
        explanationExpert:
          "Insertion repair swaps along one ancestor chain, keeping push at O(log k).",
        done: false,
      });

      child = parent;
    }
  }

  function bubbleDownFromRoot() {
    let parent = 0;

    while (parent < heap.length) {
      const left = parent * 2 + 1;
      const right = parent * 2 + 2;

      if (left >= heap.length) {
        break;
      }

      let next = left;
      if (right < heap.length && heap[right].value < heap[left].value) {
        next = right;
      }

      heapIndexPointer = parent;
      compareIndexPointer = next;

      if (heap[parent].value <= heap[next].value) {
        pushStep({
          action: `Root repair compares ${heap[parent].value} with child ${heap[next].value}. The smaller value is already on top, so bubbling stops.`,
          actionKind: "bubble-down",
          codeLines: [6],
          explanationBeginner:
            "The replacement root is already smaller than both children, so the heap is stable again.",
          explanationExpert:
            "Bubble-down stops once parent <= smallest child, re-establishing the min-heap invariant.",
          done: false,
        });
        break;
      }

      [heap[parent], heap[next]] = [heap[next], heap[parent]];
      heapIndexPointer = next;
      compareIndexPointer = parent;

      pushStep({
        action: `Swap ${heap[next].value} downward with child ${heap[parent].value} so the smallest available value returns to the root.`,
        actionKind: "bubble-down",
        codeLines: [6],
        explanationBeginner:
          "After a pop, the heap slides the smaller child upward until the order is fixed.",
        explanationExpert:
          "Deletion repair follows one descendant chain, so the trim step stays O(log k).",
        done: false,
      });

      parent = next;
    }
  }

  function trimHeap() {
    lastRemoved = heap[0];

    if (heap.length === 1) {
      heap.pop();
      heapIndexPointer = null;
      compareIndexPointer = null;

      pushStep({
        action: `Heap size exceeded ${k}, so remove the only root value ${lastRemoved.value}.`,
        actionKind: "trim",
        codeLines: [5, 6],
        explanationBeginner:
          "When the heap grows past k, the smallest survivor gets pushed out.",
        explanationExpert:
          "Trimming keeps the data structure bounded at size k, which is the key invariant of the approach.",
        done: false,
      });
      return;
    }

    const tail = heap.pop() as HeapEntry;
    heap[0] = tail;
    heapIndexPointer = 0;
    compareIndexPointer = null;

    pushStep({
      action: `Heap size exceeded ${k}, so eject the root ${lastRemoved.value} and move tail value ${tail.value} to the top temporarily.`,
      actionKind: "trim",
      codeLines: [5, 6],
      explanationBeginner:
        "The root is the smallest survivor, so it is the one we throw away.",
      explanationExpert:
        "Because the heap stores the top k values, any overflow is resolved by removing the minimum element at the root.",
      done: false,
    });

    bubbleDownFromRoot();
  }

  for (let index = 0; index < nums.length; index += 1) {
    const value = nums[index];
    currentIndex = index;
    currentValue = value;
    scanPointer = index;
    heapIndexPointer = null;
    compareIndexPointer = null;
    lastInserted = null;
    lastRemoved = null;

    pushStep({
      action: `Inspect nums[${index}] = ${value}. Every number gets one chance to join the top-${k} club.`,
      actionKind: "inspect",
      codeLines: [3],
      explanationBeginner:
        "We read the array left to right and decide whether this number deserves to stay among the best k so far.",
      explanationExpert:
        "Each stream element is inserted first; the size constraint is enforced immediately afterward.",
      done: false,
    });

    const entry = createEntry(value, index);
    heap.push(entry);
    lastInserted = entry;
    heapIndexPointer = heap.length - 1;
    compareIndexPointer = null;

    pushStep({
      action: `Push ${value} into the min-heap. It enters at index ${heap.length - 1} before heap repair starts.`,
      actionKind: "push",
      codeLines: [4],
      explanationBeginner:
        "New values always enter at the bottom of the heap first.",
      explanationExpert:
        "Binary heap insertion appends first, then restores order along the ancestor chain.",
      done: false,
    });

    bubbleUp(heap.length - 1);
    processedIndices.push(index);
    heapIndexPointer = null;
    compareIndexPointer = null;

    if (heap.length > k) {
      pushStep({
        action: `The heap now has ${heap.length} values, which is too many for k = ${k}. Remove the smallest survivor.`,
        actionKind: "size-check",
        codeLines: [5, 6],
        explanationBeginner:
          "Only k numbers are allowed to stay. The heap throws out the smallest one.",
        explanationExpert:
          "Overflow means the root cannot belong to the final answer set, so it is discarded.",
        done: false,
      });

      trimHeap();
    } else {
      pushStep({
        action: `Heap size is ${heap.length}, so no trim is needed. All current survivors still fit inside the top-${k} window.`,
        actionKind: "size-check",
        codeLines: [5],
        explanationBeginner:
          "The heap has not reached capacity yet, so every processed value can stay for now.",
        explanationExpert:
          "Before size exceeds k, the heap is just accumulating the candidate set.",
        done: false,
      });
    }
  }

  currentIndex = null;
  currentValue = null;
  scanPointer = null;
  heapIndexPointer = 0;
  compareIndexPointer = null;
  answer = heap[0]?.value ?? null;

  pushStep({
    action: `All values are processed. The root ${answer} is the kth largest element because exactly ${k - 1} survivors in the heap are larger than it.`,
    actionKind: "done",
    codeLines: [9],
    explanationBeginner:
      "The answer lives at the top because the heap kept only the biggest k numbers.",
    explanationExpert:
      "After processing n elements, the size-k min-heap stores the k largest values and its minimum is the kth order statistic.",
    done: true,
  });

  return trace;
}
