import { parseNumberArray } from "../shared/parsers";
import { createTraceRecorder } from "../shared/trace";
import type {
  HashmapTraceState,
  HashmapTraceStep,
  VisualGroup,
} from "../shared/types";

export type LongestConsecutiveSequenceTraceStep = HashmapTraceStep;

function uniqueInsertOrder(values: number[]) {
  const seen = new Set<number>();
  const order: number[] = [];

  values.forEach((value) => {
    if (!seen.has(value)) {
      seen.add(value);
      order.push(value);
    }
  });

  return order;
}

function runGroups(currentRun: number[], bestRun: number[]): VisualGroup[] {
  return [
    {
      id: "group-current",
      title: "Current Run",
      subtitle: "sequence being expanded right now",
      items: currentRun.map((value) => String(value)),
      tone: "cyan",
    },
    {
      id: "group-best",
      title: "Best Run",
      subtitle: "longest sequence found so far",
      items: bestRun.map((value) => String(value)),
      tone: "green",
    },
  ];
}

export function generateTrace(
  inputs: Record<string, string>
): LongestConsecutiveSequenceTraceStep[] {
  const nums = parseNumberArray(inputs.nums ?? "");
  const set = new Set<number>();
  const scanOrder = uniqueInsertOrder(nums);

  let insertedCount = 0;
  let startsChecked = 0;
  let currentRun: number[] = [];
  let bestRun: number[] = [];

  const initialState: HashmapTraceState = {
    hero:
      "The hash set gives O(1) membership checks. A number can start a sequence only if its predecessor is missing.",
    primaryLabel: "Original Input",
    primaryItems: [],
    secondaryLabel: "Unique Start Scan",
    secondaryItems: [],
    tertiaryLabel: "Current Expansion",
    tertiaryItems: [],
    mapLabel: "Hash Set Membership",
    mapEntries: [],
    groupsLabel: "Run Comparison",
    groups: [],
    stats: [],
    resultLabel: "longestConsecutive",
    resultValue: "building",
    resultTone: "cyan",
    summary:
      "The key optimization is skipping numbers that already have a predecessor, because they cannot start a new consecutive run.",
    footer:
      "The trace uses stable insertion order for teaching, but the algorithm's correctness does not depend on any particular set iteration order.",
  };

  const { state, trace, pointers, pushStep } = createTraceRecorder(initialState);

  function syncState() {
    state.hero =
      currentRun.length > 0
        ? `Current run = [${currentRun.join(", ")}], while best run length = ${bestRun.length}.`
        : "The next unique number will check whether it can start a fresh consecutive sequence.";

    state.primaryItems = nums.map((value, index) => ({
      id: `num-${index}`,
      label: `${value}`,
      sublabel: `index ${index}`,
      tone:
        pointers.primaryIndex === index
          ? "cyan"
          : index < insertedCount
          ? "purple"
          : "slate",
      tags:
        pointers.primaryIndex === index
          ? ["insert"]
          : index < insertedCount
          ? ["seen"]
          : undefined,
    }));

    state.secondaryItems = scanOrder.map((value, index) => ({
      id: `scan-${value}-${index}`,
      label: `${value}`,
      sublabel: `unique ${index}`,
      tone:
        pointers.secondaryIndex === index
          ? "yellow"
          : index < startsChecked
          ? "green"
          : "slate",
      tags:
        pointers.secondaryIndex === index
          ? ["start?"]
          : index < startsChecked
          ? ["checked"]
          : undefined,
    }));

    state.tertiaryItems = currentRun.map((value, index) => ({
      id: `run-${value}-${index}`,
      label: `${value}`,
      sublabel: `len ${index + 1}`,
      tone: pointers.tertiaryIndex === index ? "green" : "cyan",
      tags: pointers.tertiaryIndex === index ? ["extend"] : ["run"],
    }));

    state.mapEntries = [...set]
      .sort((left, right) => left - right)
      .map((value) => ({
        id: `set-${value}`,
        key: `${value}`,
        value: "present",
        note: set.has(value - 1) ? "has predecessor" : "possible start",
        tone: pointers.activeEntryId === `set-${value}` ? "yellow" : "purple",
      }));

    state.groups = runGroups(currentRun, bestRun);
    state.stats = [
      { label: "Unique Size", value: `${set.size}`, tone: "purple" },
      { label: "Starts Checked", value: `${startsChecked}/${scanOrder.length}`, tone: "yellow" },
      { label: "Current Length", value: `${currentRun.length}`, tone: "cyan" },
      { label: "Best Length", value: `${bestRun.length}`, tone: "green" },
    ];

    state.resultValue =
      startsChecked === scanOrder.length ? `${bestRun.length}` : "building";
    state.resultTone = startsChecked === scanOrder.length ? "green" : "cyan";
    state.summary =
      startsChecked === scanOrder.length
        ? `The best consecutive run is [${bestRun.join(", ")}].`
        : "A number with no predecessor becomes the seed for a possible run.";
  }

  syncState();

  pushStep({
    action:
      "Parse the array and prepare a hash set for O(1) membership checks.",
    actionKind: "parsed",
    codeLines: [1, 2],
    explanationBeginner:
      "The set lets us ask 'does this number exist?' instantly.",
    explanationExpert:
      "Hash-set membership is what makes both predecessor checks and run extension linear overall.",
    done: false,
  });

  for (let index = 0; index < nums.length; index += 1) {
    const value = nums[index];
    pointers.primaryIndex = index;
    pointers.focusKey = `${value}`;
    pointers.activeEntryId = `set-${value}`;

    if (set.has(value)) {
      syncState();

      pushStep({
        action: `Value ${value} is already present in the hash set, so this duplicate does not change the scan order.`,
        actionKind: "skip-duplicate",
        codeLines: [2],
        explanationBeginner:
          "Duplicates do not create longer consecutive chains, so the set keeps just one copy.",
        explanationExpert:
          "Deduplication preserves correctness and avoids redundant start checks.",
        done: false,
      });

      continue;
    }

    set.add(value);
    insertedCount = index + 1;
    syncState();

    pushStep({
      action: `Insert ${value} into the hash set so future predecessor and successor checks can find it instantly.`,
      actionKind: "insert-set",
      codeLines: [2],
      explanationBeginner:
        "Every unique value joins the lookup set exactly once.",
      explanationExpert:
        "The prebuilt set is the data structure that supports O(1) average membership for both phases of the algorithm.",
      done: false,
    });
  }

  pointers.primaryIndex = null;

  for (let scanIndex = 0; scanIndex < scanOrder.length; scanIndex += 1) {
    const value = scanOrder[scanIndex];
    pointers.secondaryIndex = scanIndex;
    pointers.focusKey = `${value}`;
    pointers.activeEntryId = `set-${value}`;
    currentRun = [];
    syncState();

    pushStep({
      action: `Inspect ${value} as a potential sequence start by checking whether ${value - 1} exists in the set.`,
      actionKind: "inspect-start",
      codeLines: [4, 5],
      explanationBeginner:
        "Only numbers without a predecessor are allowed to start a new run.",
      explanationExpert:
        "The predecessor guard is the crucial pruning step that prevents O(n^2) repeated expansions.",
      done: false,
    });

    if (set.has(value - 1)) {
      startsChecked = scanIndex + 1;
      syncState();

      pushStep({
        action: `${value - 1} is present, so ${value} sits in the middle of a run and cannot be its start.`,
        actionKind: "skip-nonstart",
        codeLines: [5],
        explanationBeginner:
          "If the previous number exists, this run would have already started earlier.",
        explanationExpert:
          "Skipping non-start nodes guarantees every consecutive run is expanded exactly once.",
        done: false,
      });

      continue;
    }

    currentRun = [value];
    pointers.tertiaryIndex = 0;
    syncState();

    pushStep({
      action: `${value} has no predecessor, so it becomes the start of a fresh consecutive run.`,
      actionKind: "start-run",
      codeLines: [6],
      explanationBeginner:
        "This number is the left edge of a possible chain.",
      explanationExpert:
        "A predecessor-free node is a canonical representative of its consecutive component.",
      done: false,
    });

    let length = 1;
    while (set.has(value + length)) {
      currentRun.push(value + length);
      pointers.tertiaryIndex = currentRun.length - 1;
      pointers.focusKey = `${value + length}`;
      pointers.activeEntryId = `set-${value + length}`;
      syncState();

      pushStep({
        action: `${value + length} is present, so the current run extends to length ${
          currentRun.length
        }.`,
        actionKind: "extend-run",
        codeLines: [7, 8],
        explanationBeginner:
          "As long as the next number exists, the consecutive streak keeps growing.",
        explanationExpert:
          "The while loop performs membership tests along one maximal consecutive chain.",
        done: false,
      });

      length += 1;
    }

    startsChecked = scanIndex + 1;
    if (currentRun.length > bestRun.length) {
      bestRun = [...currentRun];
      pointers.activeGroupId = "group-best";
      syncState();

      pushStep({
        action: `Update the best answer because the new run [${bestRun.join(
          ", "
        )}] is longer than any run seen earlier.`,
        actionKind: "update-best",
        codeLines: [10],
        explanationBeginner:
          "Whenever the current streak is longer than the old best, it becomes the new best answer.",
        explanationExpert:
          "The algorithm tracks only the maximal run length found so far, updating it once per expanded start node.",
        done: false,
      });
    } else {
      syncState();
    }
  }

  pointers.secondaryIndex = null;
  pointers.tertiaryIndex = null;
  pointers.focusKey = null;
  pointers.activeEntryId = null;
  pointers.activeGroupId = null;
  currentRun = [...bestRun];
  syncState();

  pushStep({
    action: `All possible starts were checked. The longest consecutive sequence length is ${bestRun.length}.`,
    actionKind: "done",
    codeLines: [12],
    explanationBeginner:
      "The best streak found anywhere in the set is the final answer.",
    explanationExpert:
      "Because each maximal run is expanded once from its unique predecessor-free start, the whole algorithm remains O(n).",
    done: true,
  });

  return trace;
}
