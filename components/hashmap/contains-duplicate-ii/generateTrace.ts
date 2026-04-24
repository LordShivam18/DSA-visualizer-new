import { parseNumberArray } from "../shared/parsers";
import { createTraceRecorder } from "../shared/trace";
import type { HashmapTraceState, HashmapTraceStep } from "../shared/types";

export type ContainsDuplicateIITraceStep = HashmapTraceStep;

export function generateTrace(
  inputs: Record<string, string>
): ContainsDuplicateIITraceStep[] {
  const nums = parseNumberArray(inputs.nums ?? "");
  const k = Number(inputs.k ?? 0);
  const lastSeen = new Map<number, number>();

  let processed = 0;
  let verdict: boolean | null = null;
  let gapNote = "Distance window is waiting for the first repeat.";

  const initialState: HashmapTraceState = {
    hero:
      "The hash map remembers the most recent index for each value so the current index can measure the distance to its last occurrence immediately.",
    primaryLabel: "Number Stream",
    primaryItems: [],
    secondaryLabel: "Distance Probe",
    secondaryItems: [],
    mapLabel: "Last Seen Index",
    mapEntries: [],
    stats: [],
    resultLabel: "containsNearbyDuplicate",
    resultValue: "building",
    resultTone: "cyan",
    summary:
      "Only the latest index matters, because it gives the smallest possible distance to any future duplicate.",
    footer:
      "This is a pure hash-map distance check: previous index lookup, compare against k, then refresh the last-seen position.",
  };

  const { state, trace, pointers, pushStep } = createTraceRecorder(initialState);

  function syncState(distance: number | null = null) {
    state.hero =
      verdict === true
        ? gapNote
        : verdict === false
        ? "Every duplicate found so far was too far away, so no pair satisfied the distance limit."
        : "The current value compares its index with the most recent index stored in the hash map.";

    state.primaryItems = nums.map((value, index) => {
      const last = lastSeen.get(value);
      const isActive = pointers.primaryIndex === index;

      return {
        id: `num-${index}`,
        label: `${value}`,
        sublabel: `index ${index}`,
        tone: isActive ? "cyan" : index < processed ? "purple" : "slate",
        tags:
          isActive
            ? ["active"]
            : last === index
            ? ["latest"]
            : index < processed
            ? ["seen"]
            : undefined,
      };
    });

    state.secondaryItems =
      distance === null
        ? []
        : [
            {
              id: "distance",
              label: `${distance}`,
              sublabel: `gap <= ${k} ?`,
              tone:
                verdict === true
                  ? "green"
                  : distance <= k
                  ? "yellow"
                  : "red",
              tags:
                verdict === true
                  ? ["works"]
                  : distance <= k
                  ? ["candidate"]
                  : ["too far"],
            },
          ];

    state.mapEntries = [...lastSeen.entries()]
      .sort((left, right) => left[0] - right[0])
      .map(([value, index]) => ({
        id: `last-${value}`,
        key: `${value}`,
        value: `index ${index}`,
        note: "most recent position",
        tone:
          pointers.activeEntryId === `last-${value}`
            ? verdict === true
              ? "green"
              : "yellow"
            : "purple",
      }));

    state.stats = [
      { label: "Processed", value: `${processed}/${nums.length}`, tone: "cyan" },
      { label: "Map Size", value: `${lastSeen.size}`, tone: "purple" },
      { label: "k", value: `${k}`, tone: "yellow" },
      {
        label: "Result",
        value: verdict === null ? "building" : String(verdict),
        tone: verdict === null ? "cyan" : verdict ? "green" : "red",
      },
    ];

    state.resultValue = verdict === null ? "building" : String(verdict);
    state.resultTone = verdict === null ? "cyan" : verdict ? "green" : "red";
    state.verdict = verdict;
    state.summary =
      verdict === null
        ? gapNote
        : verdict
        ? gapNote
        : "The hash map kept revealing repeats, but none of their distances were within k.";
  }

  syncState();

  pushStep({
    action:
      "Parse the array and k, then create a hash map that will track the most recent index for each value.",
    actionKind: "parsed",
    codeLines: [1, 2],
    explanationBeginner:
      "When a number appears again, we only need to know where we last saw it.",
    explanationExpert:
      "Tracking the latest occurrence minimizes the future distance to that value, which is the only distance relevant to the predicate.",
    done: false,
  });

  for (let index = 0; index < nums.length; index += 1) {
    const value = nums[index];
    pointers.primaryIndex = index;
    pointers.focusKey = `${value}`;
    pointers.focusValue = `${index}`;
    pointers.activeEntryId = `last-${value}`;
    syncState();

    pushStep({
      action: `Inspect value ${value} at index ${index} and ask the hash map for its latest previous index.`,
      actionKind: "inspect-number",
      codeLines: [3, 4],
      explanationBeginner:
        "If the number was seen before, we can measure the distance right away.",
      explanationExpert:
        "A single map lookup exposes the nearest relevant predecessor because older duplicates are never better than the latest one.",
      done: false,
    });

    const previousIndex = lastSeen.get(value);
    if (previousIndex !== undefined) {
      const distance = index - previousIndex;
      gapNote = `Value ${value} repeats between indices ${previousIndex} and ${index}, giving distance ${distance}.`;
      pointers.focusValue = `${previousIndex} -> ${index}`;
      syncState(distance);

      pushStep({
        action: gapNote,
        actionKind: "measure-distance",
        codeLines: [4],
        explanationBeginner:
          "Now we compare that gap with k to see whether the duplicate is close enough.",
        explanationExpert:
          "The predicate reduces to a constant-time distance test once the latest predecessor is known.",
        done: false,
      });

      if (distance <= k) {
        verdict = true;
        gapNote = `Distance ${distance} is within k = ${k}, so a nearby duplicate exists.`;
        syncState(distance);

        pushStep({
          action: gapNote,
          actionKind: "duplicate-found",
          codeLines: [4],
          explanationBeginner:
            "The duplicate is close enough, so the answer becomes true immediately.",
          explanationExpert:
            "A single witness pair satisfies the existential condition, so the algorithm short-circuits.",
          done: true,
        });

        return trace;
      }

      gapNote = `Distance ${distance} is larger than k = ${k}, so this repeat does not qualify.`;
      syncState(distance);

      pushStep({
        action: gapNote,
        actionKind: "too-far",
        codeLines: [4],
        explanationBeginner:
          "The same value appeared again, but not close enough to count.",
        explanationExpert:
          "The duplicate exists, yet its index difference violates the problem constraint.",
        done: false,
      });
    }

    lastSeen.set(value, index);
    processed = index + 1;
    pointers.activeEntryId = `last-${value}`;
    syncState();

    pushStep({
      action: `Refresh the hash map so value ${value} now points to its newest index ${index}.`,
      actionKind: "update-last-seen",
      codeLines: [5],
      explanationBeginner:
        "Keeping the newest index gives the best chance for future duplicates to be close enough.",
      explanationExpert:
        "Overwriting with the latest occurrence preserves the minimal future gap for the same value.",
      done: false,
    });
  }

  verdict = false;
  pointers.primaryIndex = null;
  pointers.focusKey = null;
  pointers.focusValue = null;
  pointers.activeEntryId = null;
  syncState();

  pushStep({
    action:
      "The array ended without finding any duplicate pair whose indices differ by at most k.",
    actionKind: "done",
    codeLines: [7],
    explanationBeginner:
      "Some values may repeat, but none repeat close enough.",
    explanationExpert:
      "Every candidate witness pair failed the distance predicate, so the existential condition is false.",
    done: true,
  });

  return trace;
}
