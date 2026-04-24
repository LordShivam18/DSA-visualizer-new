import { parseNumberArray } from "../shared/parsers";
import { createTraceRecorder } from "../shared/trace";
import type { HashmapTraceState, HashmapTraceStep } from "../shared/types";

export type TwoSumTraceStep = HashmapTraceStep;

function formatResult(indices: [number, number] | null) {
  return indices ? `[${indices[0]}, ${indices[1]}]` : "building";
}

export function generateTrace(inputs: Record<string, string>): TwoSumTraceStep[] {
  const nums = parseNumberArray(inputs.nums ?? "");
  const target = Number(inputs.target ?? 0);
  const seen = new Map<number, number>();

  let processed = 0;
  let result: [number, number] | null = null;
  let verdict: boolean | null = null;

  const initialState: HashmapTraceState = {
    hero:
      "At each index, compute the complement needed to reach the target. If that complement already lives in the hash map, the answer is found instantly.",
    primaryLabel: "Number Stream",
    primaryItems: [],
    secondaryLabel: "Complement Probe",
    secondaryItems: [],
    mapLabel: "Seen Number -> Index",
    mapEntries: [],
    stats: [],
    resultLabel: "twoSum indices",
    resultValue: "building",
    resultTone: "cyan",
    summary:
      "The hash map stores past numbers so the current number can ask whether its complement has already appeared.",
    footer:
      "This is the canonical single-pass solution: look for the complement first, then store the current value if no pair exists yet.",
  };

  const { state, trace, pointers, pushStep } = createTraceRecorder(initialState);

  function syncState(currentNeed: number | null = null) {
    state.hero =
      verdict === true && result
        ? `Complement ${target - nums[result[1]]} was already stored at index ${result[0]}, so indices ${result[0]} and ${result[1]} solve the target.`
        : verdict === false
        ? "The scan finished without finding a valid pair for this custom input."
        : "The current number asks the hash map whether a previously seen complement can complete the target.";

    state.primaryItems = nums.map((value, index) => {
      const stored = seen.get(value) === index;
      const isAnswer = result ? result.includes(index) : false;

      return {
        id: `num-${index}`,
        label: `${value}`,
        sublabel: `index ${index}`,
        tone:
          pointers.primaryIndex === index
            ? "cyan"
            : isAnswer
            ? "green"
            : stored || index < processed
            ? "purple"
            : "slate",
        tags:
          pointers.primaryIndex === index
            ? ["active"]
            : isAnswer
            ? ["answer"]
            : stored
            ? ["stored"]
            : index < processed
            ? ["checked"]
            : undefined,
      };
    });

    state.secondaryItems = currentNeed === null
      ? []
      : [
          {
            id: "need",
            label: `${currentNeed}`,
            sublabel: `${target} - ${nums[pointers.primaryIndex ?? 0]}`,
            tone: verdict === true ? "green" : "yellow",
            tags: verdict === true ? ["found"] : ["needed"],
          },
        ];

    state.mapEntries = [...seen.entries()]
      .sort((left, right) => left[0] - right[0])
      .map(([value, index]) => ({
        id: `seen-${value}`,
        key: `${value}`,
        value: `index ${index}`,
        note: "earliest usable partner seen so far",
        tone:
          pointers.activeEntryId === `seen-${value}`
            ? verdict === true
              ? "green"
              : "yellow"
            : "purple",
      }));

    state.stats = [
      { label: "Processed", value: `${processed}/${nums.length}`, tone: "cyan" },
      { label: "Seen Size", value: `${seen.size}`, tone: "purple" },
      { label: "Target", value: `${target}`, tone: "yellow" },
      {
        label: "Result",
        value: result ? formatResult(result) : verdict === false ? "none" : "searching",
        tone: result ? "green" : verdict === false ? "red" : "cyan",
      },
    ];

    state.resultValue = result
      ? formatResult(result)
      : verdict === false
      ? "no pair"
      : "building";
    state.resultTone = result ? "green" : verdict === false ? "red" : "cyan";
    state.verdict = result ? true : verdict;
    state.summary =
      result !== null
        ? `The pair uses values ${nums[result[0]]} and ${nums[result[1]]}, which sum to ${target}.`
        : verdict === false
        ? "No earlier value ever provided the complement needed by any later value."
        : "The hash map only stores past values, so the current element never reuses itself.";
  }

  syncState();

  pushStep({
    action:
      "Parse the array and target, then prepare a hash map that will remember each seen number by its index.",
    actionKind: "parsed",
    codeLines: [1, 2],
    explanationBeginner:
      "We will scan left to right. For each number, we ask whether a previous number can finish the target sum with it.",
    explanationExpert:
      "The map turns complement search from O(n) into O(1) average lookup, reducing the full problem to one linear pass.",
    done: false,
  });

  for (let index = 0; index < nums.length; index += 1) {
    const value = nums[index];
    const need = target - value;
    pointers.primaryIndex = index;
    pointers.secondaryIndex = 0;
    pointers.focusKey = `${need}`;
    pointers.focusValue = `${value}`;
    pointers.activeEntryId = `seen-${need}`;
    syncState(need);

    pushStep({
      action: `At index ${index}, value ${value} needs complement ${need}. Probe the hash map for that partner.`,
      actionKind: "inspect-number",
      codeLines: [3, 4, 5],
      explanationBeginner:
        "Instead of testing every older number again, we ask the map directly whether the needed partner already exists.",
      explanationExpert:
        "Each iteration checks the invariant that the map contains exactly the prefix values processed so far.",
      done: false,
    });

    const partnerIndex = seen.get(need);
    if (partnerIndex !== undefined) {
      result = [partnerIndex, index];
      verdict = true;
      pointers.activeEntryId = `seen-${need}`;
      syncState(need);

      pushStep({
        action: `Complement ${need} is already stored at index ${partnerIndex}, so [${partnerIndex}, ${index}] is the answer.`,
        actionKind: "match-found",
        codeLines: [5],
        explanationBeginner:
          "The moment the needed partner appears in the map, the pair is complete.",
        explanationExpert:
          "Because the map only stores prefix indices, the returned pair uses two distinct elements and preserves O(n) total time.",
        done: true,
      });

      return trace;
    }

    seen.set(value, index);
    processed = index + 1;
    pointers.activeEntryId = `seen-${value}`;
    syncState(need);

    pushStep({
      action: `No partner exists yet, so store value ${value} with index ${index} for future complement checks.`,
      actionKind: "store-number",
      codeLines: [6],
      explanationBeginner:
        "This number could become the missing partner for something that appears later.",
      explanationExpert:
        "The insertion happens after the lookup, which prevents the current index from pairing with itself.",
      done: false,
    });
  }

  verdict = false;
  pointers.primaryIndex = null;
  pointers.secondaryIndex = null;
  pointers.focusKey = null;
  pointers.focusValue = null;
  pointers.activeEntryId = null;
  syncState();

  pushStep({
    action:
      "The scan finished without finding any valid pair for this input, so the result remains empty.",
    actionKind: "done",
    codeLines: [8],
    explanationBeginner:
      "This custom input does not contain a matching pair.",
    explanationExpert:
      "No complement lookup ever succeeded, so no two indices satisfy nums[i] + nums[j] = target.",
    done: true,
  });

  return trace;
}
