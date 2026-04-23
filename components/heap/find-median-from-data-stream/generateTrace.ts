export type HeapSide = "lower" | "upper";

export type StreamOperation =
  | { kind: "add"; value: number; label: string }
  | { kind: "median"; label: string };

export type MedianStreamState = {
  operations: StreamOperation[];
  currentOpIndex: number | null;
  lowerHeap: number[];
  upperHeap: number[];
  streamValues: number[];
  outputs: (number | null)[];
  lastAdded: number | null;
  lastMedian: number | null;
};

export type MedianStreamPointers = {
  opIndex: number | null;
  lowerIndex: number | null;
  upperIndex: number | null;
  heapSide: HeapSide | null;
  fromHeap: HeapSide | null;
  toHeap: HeapSide | null;
};

export type MedianStreamActionKind =
  | "parsed"
  | "inspect"
  | "push"
  | "bubble-up"
  | "rebalance"
  | "bubble-down"
  | "median"
  | "done";

export type MedianStreamTraceStep = {
  step: number;
  state: MedianStreamState;
  pointers: MedianStreamPointers;
  action: string;
  actionKind: MedianStreamActionKind;
  codeLines: number[];
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function formatOperationLabel(kind: string, value?: number) {
  if (kind === "add") {
    return `add ${value}`;
  }

  return "median";
}

export function parseOperations(rawInput: string) {
  const normalized = rawInput
    .split(/\r?\n|\|/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const operations: StreamOperation[] = [];

  for (const line of normalized) {
    const lower = line.toLowerCase();

    if (lower === "median" || lower === "findmedian") {
      operations.push({ kind: "median", label: "median" });
      continue;
    }

    const match = lower.match(/^(add|addnum)\s+(-?\d+)$/);
    if (match) {
      const value = Number(match[2]);
      operations.push({
        kind: "add",
        value,
        label: formatOperationLabel("add", value),
      });
    }
  }

  return operations;
}

function cloneHeap(heap: number[]) {
  return [...heap];
}

function maxBetter(left: number, right: number) {
  return left >= right;
}

function minBetter(left: number, right: number) {
  return left <= right;
}

function formatNumber(value: number | null) {
  if (value === null) {
    return "null";
  }

  if (Number.isInteger(value)) {
    return String(value);
  }

  return String(Number(value.toFixed(5)));
}

export function formatOutputs(outputs: (number | null)[]) {
  return `[${outputs.map((value) => formatNumber(value)).join(", ")}]`;
}

export function generateTrace(rawInput: string): MedianStreamTraceStep[] {
  const operations = parseOperations(rawInput);
  const lowerHeap: number[] = [];
  const upperHeap: number[] = [];
  const streamValues: number[] = [];
  const outputs: (number | null)[] = [];
  const trace: MedianStreamTraceStep[] = [];

  let currentOpIndex: number | null = null;
  let lastAdded: number | null = null;
  let lastMedian: number | null = null;

  let lowerIndexPointer: number | null = null;
  let upperIndexPointer: number | null = null;
  let heapSidePointer: HeapSide | null = null;
  let fromHeapPointer: HeapSide | null = null;
  let toHeapPointer: HeapSide | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    explanationBeginner,
    explanationExpert,
    done,
  }: {
    action: string;
    actionKind: MedianStreamActionKind;
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
        operations: [...operations],
        currentOpIndex,
        lowerHeap: cloneHeap(lowerHeap),
        upperHeap: cloneHeap(upperHeap),
        streamValues: [...streamValues],
        outputs: [...outputs],
        lastAdded,
        lastMedian,
      },
      pointers: {
        opIndex: currentOpIndex,
        lowerIndex: lowerIndexPointer,
        upperIndex: upperIndexPointer,
        heapSide: heapSidePointer,
        fromHeap: fromHeapPointer,
        toHeap: toHeapPointer,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      operations.length === 0
        ? "Parse the operation list. No valid add or median commands were found."
        : "Parse the operation stream and prepare two heaps: a max-heap for the lower half and a min-heap for the upper half.",
    actionKind: "parsed",
    codeLines: [1, 2, 3, 4],
    explanationBeginner:
      operations.length === 0
        ? "Add commands like 'add 5' or 'median' to drive the visualizer."
        : "The lower heap stores the smaller half, and the upper heap stores the bigger half.",
    explanationExpert:
      operations.length === 0
        ? "Without operations, the data structure remains in its initial empty state."
        : "The invariant is size(lower) >= size(upper) and size(lower) - size(upper) <= 1, with every lower value <= every upper value.",
    done: false,
  });

  if (operations.length === 0) {
    pushStep({
      action: "The trace finishes immediately because there are no operations to execute.",
      actionKind: "done",
      codeLines: [18],
      explanationBeginner:
        "Nothing changes until the first add command appears.",
      explanationExpert:
        "No transition fires, so both heaps stay empty.",
      done: true,
    });
    return trace;
  }

  function bubbleUp(heap: number[], side: HeapSide) {
    const compare = side === "lower" ? maxBetter : minBetter;
    let child = heap.length - 1;

    while (child > 0) {
      const parent = Math.floor((child - 1) / 2);

      lowerIndexPointer = side === "lower" ? child : null;
      upperIndexPointer = side === "upper" ? child : null;

      if (side === "lower") {
        upperIndexPointer = null;
      } else {
        lowerIndexPointer = null;
      }

      if (compare(heap[parent], heap[child])) {
        pushStep({
          action: `Compare child ${heap[child]} with parent ${heap[parent]} inside the ${side} heap. The heap order already holds, so bubbling stops.`,
          actionKind: "bubble-up",
          codeLines: [6, 7, 9, 11],
          explanationBeginner:
            "The new value already sits in a valid heap position.",
          explanationExpert:
            "Bubble-up stops once the local heap ordering relation is satisfied on the insertion path.",
          done: false,
        });
        break;
      }

      [heap[parent], heap[child]] = [heap[child], heap[parent]];

      lowerIndexPointer = side === "lower" ? parent : null;
      upperIndexPointer = side === "upper" ? parent : null;

      pushStep({
        action: `Swap values in the ${side} heap so its root keeps the correct extreme value.`,
        actionKind: "bubble-up",
        codeLines: [6, 7, 9, 11],
        explanationBeginner:
          side === "lower"
            ? "The max-heap lifts larger values upward."
            : "The min-heap lifts smaller values upward.",
        explanationExpert:
          side === "lower"
            ? "Max-heap insertion repair keeps the largest lower-half value at the root."
            : "Min-heap insertion repair keeps the smallest upper-half value at the root.",
        done: false,
      });

      child = parent;
    }
  }

  function bubbleDown(heap: number[], side: HeapSide) {
    const compare = side === "lower" ? maxBetter : minBetter;
    let parent = 0;

    while (parent < heap.length) {
      const left = parent * 2 + 1;
      const right = parent * 2 + 2;

      if (left >= heap.length) {
        break;
      }

      let next = left;
      if (right < heap.length && !compare(heap[left], heap[right])) {
        next = right;
      }

      lowerIndexPointer = side === "lower" ? parent : null;
      upperIndexPointer = side === "upper" ? parent : null;

      if (compare(heap[parent], heap[next])) {
        pushStep({
          action: `Compare root-side value ${heap[parent]} with child ${heap[next]} in the ${side} heap. The heap order already holds.`,
          actionKind: "bubble-down",
          codeLines: [9, 11],
          explanationBeginner:
            "The replacement root is already in the right spot.",
          explanationExpert:
            "Deletion repair halts once the local heap invariant is restored.",
          done: false,
        });
        break;
      }

      [heap[parent], heap[next]] = [heap[next], heap[parent]];

      lowerIndexPointer = side === "lower" ? next : null;
      upperIndexPointer = side === "upper" ? next : null;

      pushStep({
        action: `Swap values in the ${side} heap so its extreme element returns toward the root.`,
        actionKind: "bubble-down",
        codeLines: [9, 11],
        explanationBeginner:
          side === "lower"
            ? "The max-heap moves the larger child upward."
            : "The min-heap moves the smaller child upward.",
        explanationExpert:
          "Bubble-down follows one descendant path, keeping rebalancing logarithmic.",
        done: false,
      });

      parent = next;
    }
  }

  function insertInto(heap: number[], side: HeapSide, value: number) {
    heap.push(value);
    heapSidePointer = side;
    fromHeapPointer = null;
    toHeapPointer = null;
    lowerIndexPointer = side === "lower" ? heap.length - 1 : null;
    upperIndexPointer = side === "upper" ? heap.length - 1 : null;

    pushStep({
      action: `Insert ${value} into the ${side} heap.`,
      actionKind: "push",
      codeLines: side === "lower" ? [5, 6] : [5, 7],
      explanationBeginner:
        side === "lower"
          ? "Smaller-half values belong in the lower heap unless they are bigger than the current split."
          : "Larger-half values belong in the upper heap.",
      explanationExpert:
        side === "lower"
          ? "The lower max-heap stores values at or below the split point."
          : "The upper min-heap stores values strictly above the split point.",
      done: false,
    });

    bubbleUp(heap, side);
  }

  function extractRoot(heap: number[], side: HeapSide) {
    const root = heap[0];

    if (heap.length === 1) {
      heap.pop();
      lowerIndexPointer = null;
      upperIndexPointer = null;
      return root;
    }

    const tail = heap.pop() as number;
    heap[0] = tail;
    lowerIndexPointer = side === "lower" ? 0 : null;
    upperIndexPointer = side === "upper" ? 0 : null;
    bubbleDown(heap, side);
    return root;
  }

  function rebalanceIfNeeded() {
    if (lowerHeap.length > upperHeap.length + 1) {
      heapSidePointer = null;
      fromHeapPointer = "lower";
      toHeapPointer = "upper";
      const moved = extractRoot(lowerHeap, "lower");

      pushStep({
        action: `Lower heap is too heavy, so move top value ${moved} into the upper heap.`,
        actionKind: "rebalance",
        codeLines: [8, 9],
        explanationBeginner:
          "If the lower heap gets more than one item ahead, one value moves across to restore balance.",
        explanationExpert:
          "The size invariant requires lower.size <= upper.size + 1.",
        done: false,
      });

      insertInto(upperHeap, "upper", moved);
      return;
    }

    if (upperHeap.length > lowerHeap.length) {
      heapSidePointer = null;
      fromHeapPointer = "upper";
      toHeapPointer = "lower";
      const moved = extractRoot(upperHeap, "upper");

      pushStep({
        action: `Upper heap got larger, so move top value ${moved} into the lower heap.`,
        actionKind: "rebalance",
        codeLines: [10, 11],
        explanationBeginner:
          "The lower heap is allowed to hold one extra item, so a value moves back from the upper heap.",
        explanationExpert:
          "The median is easiest to read when lower.size >= upper.size.",
        done: false,
      });

      insertInto(lowerHeap, "lower", moved);
    }
  }

  for (let index = 0; index < operations.length; index += 1) {
    const operation = operations[index];
    currentOpIndex = index;
    heapSidePointer = null;
    fromHeapPointer = null;
    toHeapPointer = null;
    lowerIndexPointer = null;
    upperIndexPointer = null;

    if (operation.kind === "add") {
      outputs.push(null);
      const value = operation.value;
      lastAdded = value;
      streamValues.push(value);

      pushStep({
        action: `Execute add ${value}. Compare the new value against the lower heap root to decide which half it belongs to.`,
        actionKind: "inspect",
        codeLines: [5, 6, 7],
        explanationBeginner:
          "Every new number first chooses a side: lower half or upper half.",
        explanationExpert:
          "The split decision uses the lower root as the boundary between halves.",
        done: false,
      });

      if (lowerHeap.length === 0 || value <= lowerHeap[0]) {
        insertInto(lowerHeap, "lower", value);
      } else {
        insertInto(upperHeap, "upper", value);
      }

      rebalanceIfNeeded();
      continue;
    }

    let median: number | null = null;
    if (lowerHeap.length === 0 && upperHeap.length === 0) {
      median = null;
    } else if (lowerHeap.length === upperHeap.length) {
      median = (lowerHeap[0] + upperHeap[0]) / 2;
    } else {
      median = lowerHeap[0];
    }

    outputs.push(median);
    lastMedian = median;
    pushStep({
      action:
        median === null
          ? "Execute median. Both heaps are empty, so there is no median yet."
          : lowerHeap.length === upperHeap.length
          ? `Execute median. The heaps are balanced, so average ${lowerHeap[0]} and ${upperHeap[0]} to get ${formatNumber(median)}.`
          : `Execute median. Lower heap has one extra value, so its root ${lowerHeap[0]} is the median.`,
      actionKind: "median",
      codeLines:
        median === null
          ? [14]
          : lowerHeap.length === upperHeap.length
          ? [14, 15]
          : [14, 16],
      explanationBeginner:
        median === null
          ? "You need at least one added number before a median exists."
          : lowerHeap.length === upperHeap.length
          ? "With an even count, the median is the average of the two middle values."
          : "With an odd count, the extra value in the lower heap is the middle of the stream.",
      explanationExpert:
        median === null
          ? "The structure is empty, so no order statistic can be returned."
          : lowerHeap.length === upperHeap.length
          ? "Balanced heaps expose the two middle elements directly at their roots."
          : "Because lower.size = upper.size + 1, the lower root is the unique middle element.",
      done: false,
    });
  }

  currentOpIndex = null;
  heapSidePointer = null;
  fromHeapPointer = null;
  toHeapPointer = null;
  lowerIndexPointer = null;
  upperIndexPointer = null;

  pushStep({
    action: "All operations have been executed.",
    actionKind: "done",
    codeLines: [18],
    explanationBeginner:
      "The heaps now fully describe the stream seen so far.",
    explanationExpert:
      "The two-heap representation is stable and can answer future median queries in O(1).",
    done: true,
  });

  return trace;
}
