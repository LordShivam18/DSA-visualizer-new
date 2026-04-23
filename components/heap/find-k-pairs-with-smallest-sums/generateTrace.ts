export type PairCandidate = {
  id: string;
  i: number;
  j: number;
  leftValue: number;
  rightValue: number;
  sum: number;
};

export type KSmallestPairsState = {
  nums1: number[];
  nums2: number[];
  k: number;
  heap: PairCandidate[];
  resultPairs: PairCandidate[];
  currentPair: PairCandidate | null;
  lastPushed: PairCandidate | null;
  lastPopped: PairCandidate | null;
  seedLimit: number;
  answer: number[][];
};

export type KSmallestPairsPointers = {
  row: number | null;
  col: number | null;
  heapIndex: number | null;
  compareIndex: number | null;
  nextCol: number | null;
};

export type KSmallestPairsActionKind =
  | "parsed"
  | "seed"
  | "bubble-up"
  | "pop"
  | "append"
  | "push-next"
  | "bubble-down"
  | "done";

export type KSmallestPairsTraceStep = {
  step: number;
  state: KSmallestPairsState;
  pointers: KSmallestPairsPointers;
  action: string;
  actionKind: KSmallestPairsActionKind;
  codeLines: number[];
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function parseNumberList(rawInput: string) {
  return rawInput
    .split(/[\s,]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 0)
    .map((token) => Number(token))
    .filter((value) => Number.isFinite(value));
}

export function parsePairInput(rawNums1: string, rawNums2: string, rawK: string) {
  const nums1 = parseNumberList(rawNums1).map((value) => Math.floor(value));
  const nums2 = parseNumberList(rawNums2).map((value) => Math.floor(value));
  const k = Math.max(0, Math.floor(Number(rawK.trim()) || 0));

  return { nums1, nums2, k };
}

export function formatPairs(pairs: number[][]) {
  if (pairs.length === 0) {
    return "[]";
  }

  return `[${pairs.map((pair) => `[${pair.join(", ")}]`).join(", ")}]`;
}

function candidateOf(nums1: number[], nums2: number[], i: number, j: number): PairCandidate {
  return {
    id: `${i}-${j}`,
    i,
    j,
    leftValue: nums1[i],
    rightValue: nums2[j],
    sum: nums1[i] + nums2[j],
  };
}

function cloneCandidates(candidates: PairCandidate[]) {
  return candidates.map((candidate) => ({ ...candidate }));
}

function betterMin(left: PairCandidate, right: PairCandidate) {
  if (left.sum !== right.sum) {
    return left.sum < right.sum;
  }

  if (left.i !== right.i) {
    return left.i < right.i;
  }

  return left.j < right.j;
}

export function generateTrace(
  rawNums1: string,
  rawNums2: string,
  rawK: string
): KSmallestPairsTraceStep[] {
  const { nums1, nums2, k } = parsePairInput(rawNums1, rawNums2, rawK);
  const seedLimit = Math.min(k, nums1.length);
  const heap: PairCandidate[] = [];
  const resultPairs: PairCandidate[] = [];
  const trace: KSmallestPairsTraceStep[] = [];

  let currentPair: PairCandidate | null = null;
  let lastPushed: PairCandidate | null = null;
  let lastPopped: PairCandidate | null = null;
  let answer: number[][] = [];

  let rowPointer: number | null = null;
  let colPointer: number | null = null;
  let heapIndexPointer: number | null = null;
  let compareIndexPointer: number | null = null;
  let nextColPointer: number | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    explanationBeginner,
    explanationExpert,
    done,
  }: {
    action: string;
    actionKind: KSmallestPairsActionKind;
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
        nums1: [...nums1],
        nums2: [...nums2],
        k,
        heap: cloneCandidates(heap),
        resultPairs: cloneCandidates(resultPairs),
        currentPair: currentPair ? { ...currentPair } : null,
        lastPushed: lastPushed ? { ...lastPushed } : null,
        lastPopped: lastPopped ? { ...lastPopped } : null,
        seedLimit,
        answer: answer.map((pair) => [...pair]),
      },
      pointers: {
        row: rowPointer,
        col: colPointer,
        heapIndex: heapIndexPointer,
        compareIndex: compareIndexPointer,
        nextCol: nextColPointer,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      nums1.length === 0 || nums2.length === 0 || k === 0
        ? "Parse the inputs. Without two non-empty arrays and a positive k, there are no pairs to enumerate."
        : "Parse both sorted arrays and prepare a min-heap frontier seeded from the first column of the pair grid.",
    actionKind: "parsed",
    codeLines: [1, 2, 3, 4],
    explanationBeginner:
      nums1.length === 0 || nums2.length === 0 || k === 0
        ? "An empty array or zero k means the answer is just an empty list."
        : "We do not push every pair. We begin with the cheapest candidate in each row.",
    explanationExpert:
      nums1.length === 0 || nums2.length === 0 || k === 0
        ? "The empty-output edge case short-circuits immediately."
        : "Because rows are sorted by j, seeding column 0 is sufficient to build a monotone frontier.",
    done: false,
  });

  if (nums1.length === 0 || nums2.length === 0 || k === 0) {
    pushStep({
      action: "The trace finishes immediately with an empty answer.",
      actionKind: "done",
      codeLines: [15],
      explanationBeginner:
        "There are no valid pairs to choose from.",
      explanationExpert:
        "No candidate frontier exists, so the result remains empty.",
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

      if (betterMin(heap[parent], heap[child])) {
        pushStep({
          action: `Compare pair sum ${heap[child].sum} with parent sum ${heap[parent].sum}. The smaller sum is already above, so bubbling stops.`,
          actionKind: "bubble-up",
          codeLines: [5, 12],
          explanationBeginner:
            "The heap already has the cheaper pair closer to the top.",
          explanationExpert:
            "Bubble-up terminates when the min-heap ordering relation is satisfied.",
          done: false,
        });
        break;
      }

      [heap[parent], heap[child]] = [heap[child], heap[parent]];
      heapIndexPointer = parent;
      compareIndexPointer = child;

      pushStep({
        action: `Swap pair [${heap[parent].leftValue}, ${heap[parent].rightValue}] upward because sum ${heap[parent].sum} is cheaper.`,
        actionKind: "bubble-up",
        codeLines: [5, 12],
        explanationBeginner:
          "A cheaper pair rises toward the root so it can be popped sooner.",
        explanationExpert:
          "Insertion repair keeps the next minimum accessible in O(1) at the root.",
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
      if (right < heap.length && betterMin(heap[right], heap[left])) {
        next = right;
      }

      heapIndexPointer = parent;
      compareIndexPointer = next;

      if (betterMin(heap[parent], heap[next])) {
        pushStep({
          action: `Compare root sum ${heap[parent].sum} with child sum ${heap[next].sum}. The smaller pair is already on top, so bubbling stops.`,
          actionKind: "bubble-down",
          codeLines: [9],
          explanationBeginner:
            "The replacement root is already cheaper than its children.",
          explanationExpert:
            "Bubble-down stops once parent <= smallest child under the heap ordering relation.",
          done: false,
        });
        break;
      }

      [heap[parent], heap[next]] = [heap[next], heap[parent]];
      heapIndexPointer = next;
      compareIndexPointer = parent;

      pushStep({
        action: `Swap a cheaper child upward so the min-heap keeps the best pair at the root.`,
        actionKind: "bubble-down",
        codeLines: [9],
        explanationBeginner:
          "After removing the root, the heap fixes itself by lifting the cheaper child.",
        explanationExpert:
          "Deletion repair follows one descendant path, so pop remains O(log k).",
        done: false,
      });

      parent = next;
    }
  }

  function popBestPair() {
    const best = heap[0];
    lastPopped = best;
    currentPair = best;
    rowPointer = best.i;
    colPointer = best.j;
    nextColPointer = best.j + 1 < nums2.length ? best.j + 1 : null;

    if (heap.length === 1) {
      heap.pop();
      heapIndexPointer = null;
      compareIndexPointer = null;
      pushStep({
        action: `Pop pair [${best.leftValue}, ${best.rightValue}] from the root because sum ${best.sum} is the smallest available frontier value.`,
        actionKind: "pop",
        codeLines: [8, 9],
        explanationBeginner:
          "The root is always the cheapest pair waiting in the heap.",
        explanationExpert:
          "The min-heap root is the current global minimum over the frontier.",
        done: false,
      });
      return best;
    }

    const tail = heap.pop() as PairCandidate;
    heap[0] = tail;
    heapIndexPointer = 0;
    compareIndexPointer = null;

    pushStep({
      action: `Pop pair [${best.leftValue}, ${best.rightValue}] from the root, then move [${tail.leftValue}, ${tail.rightValue}] to the top temporarily for repair.`,
      actionKind: "pop",
      codeLines: [8, 9],
      explanationBeginner:
        "We remove the cheapest pair first, then let the heap reorder the replacement.",
      explanationExpert:
        "Root extraction returns the minimum frontier node before restoring heap order.",
      done: false,
    });

    bubbleDownFromRoot();
    return best;
  }

  for (let i = 0; i < seedLimit; i += 1) {
    const candidate = candidateOf(nums1, nums2, i, 0);
    currentPair = candidate;
    lastPushed = candidate;
    rowPointer = i;
    colPointer = 0;
    nextColPointer = 1 < nums2.length ? 1 : null;

    pushStep({
      action: `Seed row ${i} with pair [${candidate.leftValue}, ${candidate.rightValue}] so every row contributes its cheapest available candidate.`,
      actionKind: "seed",
      codeLines: [4, 5],
      explanationBeginner:
        "Only the first column of each row needs to enter the heap at the start.",
      explanationExpert:
        "Rows are sorted, so (i, 0) dominates every other unseen pair in row i as the initial frontier representative.",
      done: false,
    });

    heap.push(candidate);
    heapIndexPointer = heap.length - 1;
    compareIndexPointer = null;
    bubbleUp(heap.length - 1);
  }

  while (resultPairs.length < k && heap.length > 0) {
    const best = popBestPair();
    resultPairs.push(best);
    answer = resultPairs.map((pair) => [pair.leftValue, pair.rightValue]);
    heapIndexPointer = null;
    compareIndexPointer = null;

    pushStep({
      action: `Append pair [${best.leftValue}, ${best.rightValue}] to the answer. It is the next smallest sum in sorted order.`,
      actionKind: "append",
      codeLines: [10],
      explanationBeginner:
        "Each pop produces the next answer pair in order.",
      explanationExpert:
        "Because the frontier is monotone and the heap stores its minimum, output order is globally sorted by pair sum.",
      done: false,
    });

    if (best.j + 1 < nums2.length) {
      const candidate = candidateOf(nums1, nums2, best.i, best.j + 1);
      currentPair = candidate;
      lastPushed = candidate;
      rowPointer = candidate.i;
      colPointer = candidate.j;
      nextColPointer = candidate.j + 1 < nums2.length ? candidate.j + 1 : null;

      pushStep({
        action: `Advance row ${best.i} to pair [${candidate.leftValue}, ${candidate.rightValue}] and push that next-column candidate into the heap.`,
        actionKind: "push-next",
        codeLines: [11, 12],
        explanationBeginner:
          "Once a row's cheapest pair is used, the next pair in that same row becomes the new frontier candidate.",
        explanationExpert:
          "Only (i, j + 1) needs to be enqueued after popping (i, j); every later pair in the row is still dominated.",
        done: false,
      });

      heap.push(candidate);
      heapIndexPointer = heap.length - 1;
      compareIndexPointer = null;
      bubbleUp(heap.length - 1);
    }
  }

  currentPair = null;
  rowPointer = null;
  colPointer = null;
  heapIndexPointer = null;
  compareIndexPointer = null;
  nextColPointer = null;

  pushStep({
    action: `The heap frontier is exhausted or ${k} pairs have been collected, so the answer is complete.`,
    actionKind: "done",
    codeLines: [15],
    explanationBeginner:
      "The collected list now contains the smallest pairs in order.",
    explanationExpert:
      "Each row contributes at most one active frontier node at a time, keeping the heap bounded by O(min(k, nums1.size())).",
    done: true,
  });

  return trace;
}
