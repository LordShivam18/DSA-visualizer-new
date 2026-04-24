import { parseNestedNumberList, parseStringList } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type RandomizedSetState = {
  operations: string[];
  args: number[][];
  values: number[];
  positions: Record<string, number>;
  currentOp: string | null;
  currentArg: number | null;
  chosenIndex: number | null;
  returns: string[];
  lastReturn: string | null;
};

type RandomizedSetPointers = {
  opIndex: number | null;
  valueIndex: number | null;
};

export type RandomizedSetTraceStep = TeachingTraceFrame & {
  state: RandomizedSetState;
  pointers: RandomizedSetPointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

function makeDeterministicPick(length: number, opIndex: number) {
  if (length === 0) {
    return 0;
  }
  return opIndex % length;
}

export function generateTrace(rawOperations: string, rawArgs: string) {
  const operationsInput = parseStringList(rawOperations);
  const argsInput = parseNestedNumberList(rawArgs);
  const operations =
    operationsInput.length > 0 ? operationsInput : ["RandomizedSet"];
  const args =
    argsInput.length > 0
      ? argsInput
      : operations.map(() => []);

  const trace: RandomizedSetTraceStep[] = [];
  const values: number[] = [];
  const positions = new Map<number, number>();
  const returns: string[] = [];

  let opIndex: number | null = 0;
  let valueIndex: number | null = null;
  let currentOp: string | null = null;
  let currentArg: number | null = null;
  let chosenIndex: number | null = null;
  let lastReturn: string | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: RandomizedSetTraceStep["actionTone"],
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
        { label: "Array Size", value: values.length, tone: "cyan" },
        { label: "Map Size", value: positions.size, tone: "purple" },
        { label: "Returns", value: returns.length, tone: "green" },
      ],
      pointerChips: [
        { label: "op", value: pointerValue(opIndex), tone: "yellow" },
        { label: "value index", value: pointerValue(valueIndex), tone: "cyan" },
        { label: "random index", value: pointerValue(chosenIndex), tone: "purple" },
      ],
      done,
      state: {
        operations: [...operations],
        args: args.map((row) => [...row]),
        values: [...values],
        positions: Object.fromEntries(
          [...positions.entries()].map(([key, value]) => [String(key), value])
        ),
        currentOp,
        currentArg,
        chosenIndex,
        returns: [...returns],
        lastReturn,
      },
      pointers: {
        opIndex,
        valueIndex,
      },
    });
  }

  pushStep(
    "Initialize an empty dynamic array plus a hashmap from value -> index.",
    "initialize",
    "slate",
    [1, 2, 3],
    "The array stores the actual values. The hashmap remembers where each value currently lives.",
    "Combining an array with a value-to-index hashmap enables average O(1) insert, remove, and random access.",
    "The core invariant is that every value's stored index matches its position inside the values array.",
    [
      "insert appends to the array and records the new index.",
      "remove swaps with the last value so deletion stays O(1).",
      "getRandom picks an array index directly.",
    ]
  );

  while (opIndex !== null && opIndex < operations.length) {
    currentOp = operations[opIndex];
    currentArg = args[opIndex]?.[0] ?? null;
    chosenIndex = null;
    valueIndex = currentArg === null ? null : positions.get(currentArg) ?? null;

    pushStep(
      `Process operation ${opIndex}: ${currentOp}${
        currentArg === null ? "" : `(${currentArg})`
      }.`,
      "inspect",
      "yellow",
      [4],
      "Each operation updates either the array, the hashmap, or both.",
      "Before executing the operation, the array and hashmap still agree on every stored value.",
      "The next step must preserve the array-to-map index consistency.",
      [
        "The constructor does not change the set after initialization.",
        "insert and remove touch both structures.",
        "getRandom reads only from the array.",
      ]
    );

    if (currentOp === "RandomizedSet") {
      lastReturn = "null";
      returns.push(lastReturn);

      pushStep(
        "Constructor call: keep the set empty and record a null return value.",
        "constructor",
        "slate",
        [4],
        "The constructor just prepares the empty data structure.",
        "No values are stored yet, so both the array and the hashmap remain empty.",
        "The initialization invariant already holds.",
        [
          "This mirrors the first item in the LeetCode operation sequence.",
          "The return value is shown as null for completeness.",
          "Subsequent operations work on the same shared state.",
        ]
      );
    } else if (currentOp === "insert") {
      if (currentArg === null) {
        lastReturn = "false";
        returns.push(lastReturn);
        pushStep(
          "Insert is missing an argument, so the operation is treated as unsuccessful.",
          "insert-fail",
          "red",
          [5, 6],
          "An insert without a value cannot add anything to the set.",
          "Malformed input is safely rejected in the visualizer.",
          "The array and hashmap remain unchanged.",
          [
            "The operation returns false here.",
            "State stays consistent because nothing changes.",
            "Input parsing is resilient to incomplete rows.",
          ]
        );
      } else if (positions.has(currentArg)) {
        lastReturn = "false";
        returns.push(lastReturn);
        pushStep(
          `${currentArg} already exists, so insert returns false.`,
          "insert-fail",
          "red",
          [5, 6],
          "Sets cannot hold duplicate values.",
          "The hashmap tells us in O(1) average time whether the value already exists.",
          "Duplicate inserts must leave both structures unchanged.",
          [
            "The values array is untouched.",
            "The stored index mapping is untouched.",
            "The method reports failure with false.",
          ]
        );
      } else {
        positions.set(currentArg, values.length);
        valueIndex = values.length;
        values.push(currentArg);
        lastReturn = "true";
        returns.push(lastReturn);

        pushStep(
          `Append ${currentArg} to the array and record its index ${valueIndex} in the hashmap.`,
          "insert-success",
          "green",
          [7, 8, 9],
          "A new value simply joins the end of the array, and the hashmap remembers where it went.",
          "Appending keeps array insertion O(1) amortized while the hashmap provides the reverse lookup.",
          "After insertion, positions[val] must equal the value's array index.",
          [
            "The array grows by one slot.",
            "The hashmap gains one key.",
            "The method returns true for a new value.",
          ]
        );
      }
    } else if (currentOp === "remove") {
      if (currentArg === null || !positions.has(currentArg)) {
        lastReturn = "false";
        returns.push(lastReturn);
        pushStep(
          currentArg === null
            ? "Remove is missing an argument, so it fails."
            : `${currentArg} is not present, so remove returns false.`,
          "remove-fail",
          "red",
          [11, 12],
          "You can only remove a value that currently exists in the set.",
          "The hashmap provides O(1) average membership testing before removal.",
          "Failed removals leave both structures unchanged.",
          [
            "The values array is untouched.",
            "The hashmap is untouched.",
            "The method reports false.",
          ]
        );
      } else {
        const removeIndex = positions.get(currentArg) as number;
        const lastValue = values[values.length - 1];
        valueIndex = removeIndex;

        pushStep(
          `Remove ${currentArg} from index ${removeIndex}. Swap in the last value ${lastValue} so deletion stays O(1).`,
          "remove-swap",
          "yellow",
          [13, 14, 15],
          "Instead of shifting many elements left, the structure moves the last value into the removed slot.",
          "Swap-delete preserves O(1) average removal because only one array position and one hashmap entry need adjustment.",
          "If a value is removed from the middle, the last value must inherit its old index.",
          [
            "This is the key trick behind constant-time removal.",
            "The moved last value must get a new hashmap index.",
            "The array can then pop its final slot safely.",
          ]
        );

        values[removeIndex] = lastValue;
        positions.set(lastValue, removeIndex);
        values.pop();
        positions.delete(currentArg);
        lastReturn = "true";
        returns.push(lastReturn);
        valueIndex = positions.get(lastValue) ?? null;

        pushStep(
          `The swap-delete is complete. ${currentArg} is gone, and the array plus hashmap are back in sync.`,
          "remove-success",
          "green",
          [16, 17, 18],
          "The removed value disappears without shifting every later element.",
          "After pop and erase, every remaining key again points to its exact array index.",
          "The index-consistency invariant is fully restored after the swap-delete.",
          [
            "Removing the last element is a special case of the same idea.",
            "The array shrinks by one.",
            "The method returns true for a successful removal.",
          ]
        );
      }
    } else if (currentOp === "getRandom") {
      chosenIndex = makeDeterministicPick(values.length, opIndex);
      const pickedValue = values[chosenIndex];
      lastReturn = String(pickedValue);
      returns.push(lastReturn);

      pushStep(
        `Pick index ${chosenIndex} from the array and return value ${pickedValue}.`,
        "get-random",
        "cyan",
        [20, 21],
        "The visualizer uses a deterministic demo pick so the animation is repeatable, but the real structure may return any valid index uniformly.",
        "The algorithmic point is that direct array indexing gives O(1) average random selection once the array stores all values compactly.",
        "Random access works because the set's values live in a dense array with no gaps.",
        [
          "The hashmap is not needed for getRandom.",
          "Any valid array index would be a correct random candidate.",
          "The deterministic choice only keeps the teaching trace stable.",
        ]
      );
    } else {
      lastReturn = "unsupported";
      returns.push(lastReturn);
      pushStep(
        `Operation "${currentOp}" is not recognized by this visualizer.`,
        "unsupported",
        "red",
        [4],
        "Unknown operations are ignored safely.",
        "Only constructor, insert, remove, and getRandom are part of the supported API.",
        "Unsupported commands leave the array and hashmap unchanged.",
        [
          "The visualizer records the unsupported return label.",
          "State safety matters more than forcing an invalid operation.",
          "The next operation can still proceed normally.",
        ]
      );
    }

    opIndex += 1;
  }

  opIndex = null;
  currentOp = null;
  currentArg = null;
  valueIndex = null;
  chosenIndex = null;

  pushStep(
    "All operations have been processed. The final array and hashmap remain perfectly aligned.",
    "done",
    "green",
    [23],
    "The visualizer has finished replaying the whole operation log.",
    "The dense-array plus hashmap invariant still holds at the end of the sequence.",
    "Every remaining value can still be inserted, removed, or selected in average O(1) time.",
    [
      "The return history mirrors the LeetCode-style outputs.",
      "The array stores only active values.",
      "The hashmap stores each active value's current index.",
    ],
    true
  );

  return trace;
}
