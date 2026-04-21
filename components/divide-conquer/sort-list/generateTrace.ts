export type Mode = "beginner" | "expert";

export type ListToken = {
  id: string;
  value: number;
};

export type MergeSortFrame = {
  label: string;
  depth: number;
  values: ListToken[];
  stage: "split" | "merge" | "base";
};

export type ResolvedSegment = {
  label: string;
  depth: number;
  values: ListToken[];
  kind: "base" | "merged";
};

export type SortListState = {
  input: string;
  original: ListToken[];
  activeSegment: ListToken[];
  leftSegment: ListToken[];
  rightSegment: ListToken[];
  mergedSegment: ListToken[];
  frames: MergeSortFrame[];
  resolvedSegments: ResolvedSegment[];
  result: ListToken[] | null;
  comparisons: number;
  splitCount: number;
  mergeCount: number;
};

export type SortListPointers = {
  activeLabel: string | null;
  slowId: string | null;
  fastId: string | null;
  leftHeadId: string | null;
  rightHeadId: string | null;
  mergeTailId: string | null;
};

export type SortListActionKind =
  | "parsed"
  | "enter-sort"
  | "find-middle"
  | "split"
  | "base-case"
  | "begin-merge"
  | "compare-heads"
  | "take-left"
  | "take-right"
  | "append-rest"
  | "merge-complete"
  | "done";

export type SortListTraceStep = {
  step: number;
  action: string;
  actionKind: SortListActionKind;
  codeLines: number[];
  state: SortListState;
  pointers: SortListPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function parseNumbers(rawInput: string) {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    if (Array.isArray(parsed)) {
      return parsed
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value));
    }
  } catch {
    // Fallback parsing handles comma and space separated values.
  }

  return trimmed
    .split(/[\s,|]+/)
    .map((token) => Number(token.trim()))
    .filter((value) => Number.isFinite(value));
}

function cloneTokens(tokens: ListToken[]) {
  return tokens.map((token) => ({ ...token }));
}

function cloneFrames(frames: MergeSortFrame[]) {
  return frames.map((frame) => ({
    ...frame,
    values: cloneTokens(frame.values),
  }));
}

function cloneResolvedSegments(entries: ResolvedSegment[]) {
  return entries.map((entry) => ({
    ...entry,
    values: cloneTokens(entry.values),
  }));
}

export function formatList(tokens: ListToken[] | null) {
  if (!tokens || tokens.length === 0) {
    return "[]";
  }

  return `[${tokens.map((token) => token.value).join(", ")}]`;
}

export function generateTrace(rawInput: string): SortListTraceStep[] {
  const values = parseNumbers(rawInput);
  const original = values.map((value, index) => ({
    id: `node-${index}`,
    value,
  }));

  const trace: SortListTraceStep[] = [];
  const frames: MergeSortFrame[] = [];
  const resolvedMap = new Map<string, ResolvedSegment>();

  let activeSegment: ListToken[] = [];
  let leftSegment: ListToken[] = [];
  let rightSegment: ListToken[] = [];
  let mergedSegment: ListToken[] = [];
  let result: ListToken[] | null = null;
  let comparisons = 0;
  let splitCount = 0;
  let mergeCount = 0;

  let activeLabel: string | null = null;
  let slowId: string | null = null;
  let fastId: string | null = null;
  let leftHeadId: string | null = null;
  let rightHeadId: string | null = null;
  let mergeTailId: string | null = null;

  function resolvedSegments() {
    return [...resolvedMap.values()].sort((left, right) => {
      if (left.depth !== right.depth) {
        return left.depth - right.depth;
      }

      return left.label.localeCompare(right.label);
    });
  }

  function pushStep({
    action,
    actionKind,
    codeLines,
    explanationBeginner,
    explanationExpert,
    done,
  }: {
    action: string;
    actionKind: SortListActionKind;
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
        input: rawInput,
        original: cloneTokens(original),
        activeSegment: cloneTokens(activeSegment),
        leftSegment: cloneTokens(leftSegment),
        rightSegment: cloneTokens(rightSegment),
        mergedSegment: cloneTokens(mergedSegment),
        frames: cloneFrames(frames),
        resolvedSegments: cloneResolvedSegments(resolvedSegments()),
        result: result ? cloneTokens(result) : null,
        comparisons,
        splitCount,
        mergeCount,
      },
      pointers: {
        activeLabel,
        slowId,
        fastId,
        leftHeadId,
        rightHeadId,
        mergeTailId,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      original.length === 0
        ? "Parse the input list. It is empty, so no sorting work is needed."
        : "Parse the linked list and prepare to split it into smaller runs.",
    actionKind: "parsed",
    codeLines: [1, 2],
    explanationBeginner:
      original.length === 0
        ? "An empty list is already sorted."
        : "Merge sort keeps cutting the list into smaller pieces until every piece is easy to sort.",
    explanationExpert:
      original.length === 0
        ? "The null-head base case returns immediately."
        : "The divide-and-conquer strategy recursively sorts two halves, then merges them in linear time.",
    done: false,
  });

  function updateFromParentFrame() {
    const parent = frames[frames.length - 1];
    if (!parent) {
      activeLabel = null;
      activeSegment = [];
      slowId = null;
      fastId = null;
      return;
    }

    activeLabel = parent.label;
    activeSegment = cloneTokens(parent.values);
    slowId = null;
    fastId = null;
  }

  function sortSegment(tokens: ListToken[], label: string, depth: number): ListToken[] {
    const frame: MergeSortFrame = {
      label,
      depth,
      values: cloneTokens(tokens),
      stage: "split",
    };
    frames.push(frame);

    activeLabel = label;
    activeSegment = cloneTokens(tokens);
    leftSegment = [];
    rightSegment = [];
    mergedSegment = [];
    leftHeadId = null;
    rightHeadId = null;
    mergeTailId = null;
    slowId = null;
    fastId = null;

    pushStep({
      action: `Enter segment ${label} with values ${formatList(tokens)}.`,
      actionKind: "enter-sort",
      codeLines: [1, 2],
      explanationBeginner:
        "This recursive call is responsible for sorting exactly this portion of the linked list.",
      explanationExpert:
        "Each frame receives one sublist and returns the head of the sorted version of that same subproblem.",
      done: false,
    });

    if (tokens.length <= 1) {
      frame.stage = "base";
      resolvedMap.set(label, {
        label,
        depth,
        values: cloneTokens(tokens),
        kind: "base",
      });

      pushStep({
        action: `Segment ${label} has length ${tokens.length}, so it is already sorted.`,
        actionKind: "base-case",
        codeLines: [2],
        explanationBeginner:
          "A list with zero or one node cannot be out of order.",
        explanationExpert:
          "The recursion bottoms out on size 0 or 1, which are trivially sorted linked lists.",
        done: false,
      });

      frames.pop();
      updateFromParentFrame();
      return cloneTokens(tokens);
    }

    let slow = 0;
    let fast = 1;
    while (fast < tokens.length - 1 && fast + 1 < tokens.length) {
      slow += 1;
      fast += 2;
    }
    const splitIndex = slow + 1;
    slowId = tokens[slow]?.id ?? null;
    fastId = tokens[Math.min(fast, tokens.length - 1)]?.id ?? null;

    pushStep({
      action: `Use slow/fast pointers on ${label}. Slow stops at value ${tokens[slow].value}, so the split happens after it.`,
      actionKind: "find-middle",
      codeLines: [3, 4, 5, 6, 7, 9, 10],
      explanationBeginner:
        "The slow pointer finds the midpoint while the fast pointer jumps twice as quickly.",
      explanationExpert:
        "This is the standard tortoise-hare split that isolates the two halves without extra indexing structures.",
      done: false,
    });

    const left = cloneTokens(tokens.slice(0, splitIndex));
    const right = cloneTokens(tokens.slice(splitIndex));
    splitCount += 1;
    leftSegment = cloneTokens(left);
    rightSegment = cloneTokens(right);

    pushStep({
      action: `Cut segment ${label} into left ${formatList(left)} and right ${formatList(right)}.`,
      actionKind: "split",
      codeLines: [9, 10, 11, 12],
      explanationBeginner:
        "Breaking the list into two smaller lists makes the big sorting job easier to solve.",
      explanationExpert:
        "Severing the list at slow->next converts one sort problem into two independent recursive subproblems.",
      done: false,
    });

    const sortedLeft = sortSegment(left, `${label}.L`, depth + 1);
    const sortedRight = sortSegment(right, `${label}.R`, depth + 1);

    frame.stage = "merge";
    activeLabel = label;
    activeSegment = cloneTokens(tokens);
    leftSegment = cloneTokens(sortedLeft);
    rightSegment = cloneTokens(sortedRight);
    mergedSegment = [];
    leftHeadId = sortedLeft[0]?.id ?? null;
    rightHeadId = sortedRight[0]?.id ?? null;
    mergeTailId = null;
    slowId = null;
    fastId = null;

    pushStep({
      action: `Both halves of ${label} are sorted. Start merging ${formatList(sortedLeft)} and ${formatList(sortedRight)}.`,
      actionKind: "begin-merge",
      codeLines: [13, 14, 15],
      explanationBeginner:
        "Now the algorithm weaves the two sorted halves together into one bigger sorted list.",
      explanationExpert:
        "The conquer step is a linear merge of two already sorted linked-list runs.",
      done: false,
    });

    const merged: ListToken[] = [];
    let leftIndex = 0;
    let rightIndex = 0;

    while (leftIndex < sortedLeft.length && rightIndex < sortedRight.length) {
      leftHeadId = sortedLeft[leftIndex]?.id ?? null;
      rightHeadId = sortedRight[rightIndex]?.id ?? null;
      mergeTailId = merged[merged.length - 1]?.id ?? null;
      mergedSegment = cloneTokens(merged);

      pushStep({
        action: `Compare left head ${sortedLeft[leftIndex].value} with right head ${sortedRight[rightIndex].value}.`,
        actionKind: "compare-heads",
        codeLines: [15],
        explanationBeginner:
          "Only the two front nodes matter because both halves are already internally sorted.",
        explanationExpert:
          "Merge compares the minimal remaining elements of both runs to preserve sorted order globally.",
        done: false,
      });

      comparisons += 1;

      if (sortedLeft[leftIndex].value <= sortedRight[rightIndex].value) {
        merged.push(sortedLeft[leftIndex]);
        mergeTailId = sortedLeft[leftIndex].id;
        leftIndex += 1;
        mergedSegment = cloneTokens(merged);
        leftHeadId = sortedLeft[leftIndex]?.id ?? null;

        pushStep({
          action: `Take ${merged[merged.length - 1].value} from the left run because it is smaller or equal.`,
          actionKind: "take-left",
          codeLines: [16, 18],
          explanationBeginner:
            "The smaller front value must come next in the final sorted list.",
          explanationExpert:
            "Stability is preserved by preferring the left run when values tie.",
          done: false,
        });
      } else {
        merged.push(sortedRight[rightIndex]);
        mergeTailId = sortedRight[rightIndex].id;
        rightIndex += 1;
        mergedSegment = cloneTokens(merged);
        rightHeadId = sortedRight[rightIndex]?.id ?? null;

        pushStep({
          action: `Take ${merged[merged.length - 1].value} from the right run because it is smaller.`,
          actionKind: "take-right",
          codeLines: [17, 18],
          explanationBeginner:
            "The right-side value wins this comparison, so it gets attached next.",
          explanationExpert:
            "The lower right-run head maintains the global nondecreasing merge invariant.",
          done: false,
        });
      }
    }

    while (leftIndex < sortedLeft.length) {
      merged.push(sortedLeft[leftIndex]);
      mergeTailId = sortedLeft[leftIndex].id;
      leftIndex += 1;
      mergedSegment = cloneTokens(merged);
      leftHeadId = sortedLeft[leftIndex]?.id ?? null;

      pushStep({
        action: `Append the remaining left value ${merged[merged.length - 1].value}.`,
        actionKind: "append-rest",
        codeLines: [20],
        explanationBeginner:
          "Once the other run is empty, the leftover nodes can be attached as-is.",
        explanationExpert:
          "The remainder is already sorted, so it links directly to the merge tail.",
        done: false,
      });
    }

    while (rightIndex < sortedRight.length) {
      merged.push(sortedRight[rightIndex]);
      mergeTailId = sortedRight[rightIndex].id;
      rightIndex += 1;
      mergedSegment = cloneTokens(merged);
      rightHeadId = sortedRight[rightIndex]?.id ?? null;

      pushStep({
        action: `Append the remaining right value ${merged[merged.length - 1].value}.`,
        actionKind: "append-rest",
        codeLines: [20],
        explanationBeginner:
          "With one side exhausted, the rest of the other side is already in sorted order.",
        explanationExpert:
          "No more comparisons are necessary once one run has been fully consumed.",
        done: false,
      });
    }

    mergeCount += 1;
    resolvedMap.set(label, {
      label,
      depth,
      values: cloneTokens(merged),
      kind: "merged",
    });
    mergedSegment = cloneTokens(merged);

    pushStep({
      action: `Merge complete for ${label}. The sorted run is ${formatList(merged)}.`,
      actionKind: "merge-complete",
      codeLines: [21],
      explanationBeginner:
        "Two smaller sorted lists have turned into one larger sorted list.",
      explanationExpert:
        "The conquer phase returns a single sorted run whose length equals the sum of both child runs.",
      done: false,
    });

    frames.pop();
    updateFromParentFrame();
    return cloneTokens(merged);
  }

  if (original.length === 0) {
    result = [];
    pushStep({
      action: "The list is empty, so the final sorted output is also empty.",
      actionKind: "done",
      codeLines: [1, 2],
      explanationBeginner:
        "Nothing needs to move because there are no nodes.",
      explanationExpert:
        "The null input returns immediately with O(1) work.",
      done: true,
    });

    return trace;
  }

  result = sortSegment(original, "root", 0);
  activeLabel = null;
  activeSegment = [];
  leftSegment = [];
  rightSegment = [];
  mergedSegment = [];
  slowId = null;
  fastId = null;
  leftHeadId = null;
  rightHeadId = null;
  mergeTailId = result[result.length - 1]?.id ?? null;

  pushStep({
    action: `All recursive calls are finished. The list is now sorted as ${formatList(result)}.`,
    actionKind: "done",
    codeLines: [1, 21],
    explanationBeginner:
      "Each level sorted tiny pieces, then merged them into larger sorted pieces until the full list was sorted.",
    explanationExpert:
      "Merge sort on a linked list runs in O(n log n) time and uses O(log n) recursion depth for the split tree.",
    done: true,
  });

  return trace;
}
