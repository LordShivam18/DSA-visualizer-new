export type Mode = "beginner" | "expert";

export type MergeKToken = {
  id: string;
  value: number;
  sourceList: number;
};

export type MergeKState = {
  input: string;
  currentRound: number;
  workingLists: MergeKToken[][];
  nextRoundLists: MergeKToken[][];
  leftList: MergeKToken[];
  rightList: MergeKToken[];
  mergedList: MergeKToken[];
  result: MergeKToken[] | null;
  comparisons: number;
  mergesCompleted: number;
  roundsCompleted: number;
};

export type MergeKPointers = {
  activePairIndex: number | null;
  carryListIndex: number | null;
  leftHeadId: string | null;
  rightHeadId: string | null;
  mergeTailId: string | null;
};

export type MergeKActionKind =
  | "parsed"
  | "start-round"
  | "carry-list"
  | "begin-merge"
  | "compare-heads"
  | "take-left"
  | "take-right"
  | "append-rest"
  | "merge-complete"
  | "advance-round"
  | "done";

export type MergeKTraceStep = {
  step: number;
  action: string;
  actionKind: MergeKActionKind;
  codeLines: number[];
  state: MergeKState;
  pointers: MergeKPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function cloneLists(lists: MergeKToken[][]) {
  return lists.map((list) => list.map((token) => ({ ...token })));
}

function parseNestedLists(rawInput: string) {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    if (Array.isArray(parsed)) {
      return parsed
        .map((list) =>
          Array.isArray(list)
            ? list
                .map((value) => Number(value))
                .filter((value) => Number.isFinite(value))
            : []
        );
    }
  } catch {
    // Fallback parsing handles pipe-separated rows.
  }

  return trimmed
    .split(/\r?\n|\|/)
    .map((row) =>
      row
        .split(/[\s,]+/)
        .map((token) => Number(token.trim()))
        .filter((value) => Number.isFinite(value))
    );
}

export function formatList(list: MergeKToken[] | null) {
  if (!list || list.length === 0) {
    return "[]";
  }

  return `[${list.map((token) => token.value).join(", ")}]`;
}

export function formatLists(lists: MergeKToken[][]) {
  if (lists.length === 0) {
    return "[]";
  }

  return `[${lists.map((list) => formatList(list)).join(", ")}]`;
}

export function generateTrace(rawInput: string): MergeKTraceStep[] {
  const parsedLists = parseNestedLists(rawInput);
  const initialLists = parsedLists.map((list, listIndex) =>
    list.map((value, index) => ({
      id: `list-${listIndex}-node-${index}`,
      value,
      sourceList: listIndex,
    }))
  );

  const trace: MergeKTraceStep[] = [];
  let currentRound = 0;
  let workingLists = cloneLists(initialLists);
  let nextRoundLists: MergeKToken[][] = [];
  let leftList: MergeKToken[] = [];
  let rightList: MergeKToken[] = [];
  let mergedList: MergeKToken[] = [];
  let result: MergeKToken[] | null = null;
  let comparisons = 0;
  let mergesCompleted = 0;
  let roundsCompleted = 0;

  let activePairIndex: number | null = null;
  let carryListIndex: number | null = null;
  let leftHeadId: string | null = null;
  let rightHeadId: string | null = null;
  let mergeTailId: string | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    explanationBeginner,
    explanationExpert,
    done,
  }: {
    action: string;
    actionKind: MergeKActionKind;
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
        currentRound,
        workingLists: cloneLists(workingLists),
        nextRoundLists: cloneLists(nextRoundLists),
        leftList: cloneLists([leftList])[0] ?? [],
        rightList: cloneLists([rightList])[0] ?? [],
        mergedList: cloneLists([mergedList])[0] ?? [],
        result: result ? cloneLists([result])[0] : null,
        comparisons,
        mergesCompleted,
        roundsCompleted,
      },
      pointers: {
        activePairIndex,
        carryListIndex,
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
      initialLists.length === 0
        ? "Parse the list of lists. There are no lists to merge."
        : `Parse ${initialLists.length} sorted list${initialLists.length === 1 ? "" : "s"} and prepare the first merge round.`,
    actionKind: "parsed",
    codeLines: [1, 2, 3],
    explanationBeginner:
      initialLists.length === 0
        ? "With no lists, the answer is just an empty list."
        : "Divide and conquer merges the lists in rounds, like a tournament bracket.",
    explanationExpert:
      initialLists.length === 0
        ? "The empty vector case returns null immediately."
        : "Pairwise merging halves the number of active lists each round, giving O(n log k) total work.",
    done: false,
  });

  if (initialLists.length === 0) {
    result = [];
    pushStep({
      action: "No lists were provided, so the merged output is [].",
      actionKind: "done",
      codeLines: [1, 2],
      explanationBeginner:
        "There is nothing to combine.",
      explanationExpert:
        "The algorithm terminates before any merge round starts.",
      done: true,
    });

    return trace;
  }

  while (workingLists.length > 1) {
    nextRoundLists = [];
    leftList = [];
    rightList = [];
    mergedList = [];
    activePairIndex = null;
    carryListIndex = null;
    leftHeadId = null;
    rightHeadId = null;
    mergeTailId = null;

    pushStep({
      action: `Start round ${currentRound + 1}. There are ${workingLists.length} active lists waiting to be paired.`,
      actionKind: "start-round",
      codeLines: [3, 4, 5],
      explanationBeginner:
        "Each round pairs nearby lists, merges them, and sends the winners forward.",
      explanationExpert:
        "The outer loop shrinks the frontier of active lists until only one sorted run remains.",
      done: false,
    });

    const newLists: MergeKToken[][] = [];

    for (let index = 0; index < workingLists.length; index += 2) {
      activePairIndex = Math.floor(index / 2);
      carryListIndex = null;
      leftHeadId = null;
      rightHeadId = null;
      mergeTailId = null;

      const left = workingLists[index];
      const right = workingLists[index + 1];

      if (!right) {
        nextRoundLists.push(left);
        newLists.push(left);
        carryListIndex = index;
        leftList = cloneLists([left])[0] ?? [];
        rightList = [];
        mergedList = cloneLists([left])[0] ?? [];

        pushStep({
          action: `List ${index + 1} has no partner this round, so it advances unchanged to the next round.`,
          actionKind: "carry-list",
          codeLines: [5, 8],
          explanationBeginner:
            "Odd numbers of lists leave one list unpaired, so that list gets a free pass.",
          explanationExpert:
            "When the round has an unmatched tail list, it is copied forward without extra comparisons.",
          done: false,
        });

        continue;
      }

      leftList = cloneLists([left])[0] ?? [];
      rightList = cloneLists([right])[0] ?? [];
      mergedList = [];
      leftHeadId = left[0]?.id ?? null;
      rightHeadId = right[0]?.id ?? null;
      mergeTailId = null;

      pushStep({
        action: `Merge pair ${activePairIndex + 1}: ${formatList(left)} with ${formatList(right)}.`,
        actionKind: "begin-merge",
        codeLines: [6, 12, 13, 14, 15],
        explanationBeginner:
          "This pair enters the two-list merge that builds one bigger sorted winner.",
        explanationExpert:
          "Each pairwise match delegates to the standard linear merge of two sorted linked lists.",
        done: false,
      });

      const merged: MergeKToken[] = [];
      let leftIndex = 0;
      let rightIndex = 0;

      while (leftIndex < left.length && rightIndex < right.length) {
        leftHeadId = left[leftIndex]?.id ?? null;
        rightHeadId = right[rightIndex]?.id ?? null;
        mergeTailId = merged[merged.length - 1]?.id ?? null;
        mergedList = cloneLists([merged])[0] ?? [];

        pushStep({
          action: `Compare ${left[leftIndex].value} from the left list with ${right[rightIndex].value} from the right list.`,
          actionKind: "compare-heads",
          codeLines: [15],
          explanationBeginner:
            "The two front values compete because whichever is smaller must be next in the sorted answer.",
          explanationExpert:
            "The head comparison selects the globally smallest remaining node across both sorted runs.",
          done: false,
        });

        comparisons += 1;

        if (left[leftIndex].value <= right[rightIndex].value) {
          merged.push(left[leftIndex]);
          mergeTailId = left[leftIndex].id;
          leftIndex += 1;
          mergedList = cloneLists([merged])[0] ?? [];
          leftHeadId = left[leftIndex]?.id ?? null;

          pushStep({
            action: `Take ${merged[merged.length - 1].value} from the left list.`,
            actionKind: "take-left",
            codeLines: [16, 18],
            explanationBeginner:
              "The left value wins, so it gets linked onto the merged output.",
            explanationExpert:
              "Choosing the smaller left head preserves sorted order and advances only that run.",
            done: false,
          });
        } else {
          merged.push(right[rightIndex]);
          mergeTailId = right[rightIndex].id;
          rightIndex += 1;
          mergedList = cloneLists([merged])[0] ?? [];
          rightHeadId = right[rightIndex]?.id ?? null;

          pushStep({
            action: `Take ${merged[merged.length - 1].value} from the right list.`,
            actionKind: "take-right",
            codeLines: [17, 18],
            explanationBeginner:
              "The right value is smaller, so it comes next in the merge.",
            explanationExpert:
              "The lower right head keeps the merge tail globally sorted.",
            done: false,
          });
        }
      }

      while (leftIndex < left.length) {
        merged.push(left[leftIndex]);
        mergeTailId = left[leftIndex].id;
        leftIndex += 1;
        mergedList = cloneLists([merged])[0] ?? [];
        leftHeadId = left[leftIndex]?.id ?? null;

        pushStep({
          action: `Append the remaining left value ${merged[merged.length - 1].value}.`,
          actionKind: "append-rest",
          codeLines: [20],
          explanationBeginner:
            "Once the right list is empty, the left list can finish without more comparisons.",
          explanationExpert:
            "The remainder of a sorted run attaches directly to tail->next.",
          done: false,
        });
      }

      while (rightIndex < right.length) {
        merged.push(right[rightIndex]);
        mergeTailId = right[rightIndex].id;
        rightIndex += 1;
        mergedList = cloneLists([merged])[0] ?? [];
        rightHeadId = right[rightIndex]?.id ?? null;

        pushStep({
          action: `Append the remaining right value ${merged[merged.length - 1].value}.`,
          actionKind: "append-rest",
          codeLines: [20],
          explanationBeginner:
            "Only the right list has nodes left, so they slide straight into the result.",
          explanationExpert:
            "No further comparisons are needed once one run is exhausted.",
          done: false,
        });
      }

      mergesCompleted += 1;
      mergedList = cloneLists([merged])[0] ?? [];
      nextRoundLists.push(merged);
      newLists.push(merged);

      pushStep({
        action: `Pair ${activePairIndex + 1} is complete. The merged winner is ${formatList(merged)}.`,
        actionKind: "merge-complete",
        codeLines: [21],
        explanationBeginner:
          "Two sorted lists became one bigger sorted list that moves to the next round.",
        explanationExpert:
          "Each successful pairwise merge reduces the number of active sorted runs by one.",
        done: false,
      });
    }

    workingLists = cloneLists(newLists);
    roundsCompleted += 1;
    currentRound += 1;
    activePairIndex = null;
    carryListIndex = null;
    leftList = [];
    rightList = [];
    mergedList = [];
    leftHeadId = null;
    rightHeadId = null;
    mergeTailId = null;

    pushStep({
      action: `Round ${roundsCompleted} finishes with ${workingLists.length} list${workingLists.length === 1 ? "" : "s"} remaining.`,
      actionKind: "advance-round",
      codeLines: [8],
      explanationBeginner:
        "The number of active lists keeps shrinking after every round.",
      explanationExpert:
        "The divide step reduces k by roughly half each round, producing logarithmic round depth.",
      done: false,
    });
  }

  result = workingLists[0] ?? [];
  leftList = [];
  rightList = [];
  mergedList = cloneLists([result])[0] ?? [];
  activePairIndex = null;
  carryListIndex = null;
  leftHeadId = null;
  rightHeadId = null;
  mergeTailId = result[result.length - 1]?.id ?? null;

  pushStep({
    action: `All rounds are complete. The final merged list is ${formatList(result)}.`,
    actionKind: "done",
    codeLines: [10],
    explanationBeginner:
      "Every round merged the winners forward until only one sorted list remained.",
    explanationExpert:
      "Pairwise divide-and-conquer merging yields O(n log k) total time for n nodes across k input lists.",
    done: true,
  });

  return trace;
}
