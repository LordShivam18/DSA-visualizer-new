import type { TeachingTraceFrame } from "../shared/types";

const ROMAN_VALUES: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

type Contribution = {
  symbol: string;
  signedValue: number;
  reason: string;
};

type RomanToIntegerState = {
  roman: string[];
  values: number[];
  index: number | null;
  currentValue: number;
  nextValue: number;
  total: number;
  contributions: Contribution[];
  result: number | null;
};

type RomanToIntegerPointers = {
  index: number | null;
  lookahead: number | null;
};

export type RomanToIntegerTraceStep = TeachingTraceFrame & {
  state: RomanToIntegerState;
  pointers: RomanToIntegerPointers;
};

function sanitizeRoman(raw: string) {
  return raw.toUpperCase().replace(/[^IVXLCDM]/g, "");
}

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(rawRoman: string) {
  const roman = sanitizeRoman(rawRoman).split("");
  const values = roman.map((symbol) => ROMAN_VALUES[symbol] ?? 0);
  const trace: RomanToIntegerTraceStep[] = [];

  let index: number | null = roman.length > 0 ? 0 : null;
  let currentValue = index === null ? 0 : values[index];
  let nextValue =
    index === null || index + 1 >= values.length ? 0 : values[index + 1];
  let total = 0;
  let result: number | null = null;
  const contributions: Contribution[] = [];

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: RomanToIntegerTraceStep["actionTone"],
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
        { label: "Running Total", value: total, tone: "green" },
        { label: "Current Value", value: currentValue, tone: "cyan" },
        { label: "Lookahead Value", value: nextValue, tone: "yellow" },
      ],
      pointerChips: [
        { label: "i", value: pointerValue(index), tone: "cyan" },
        {
          label: "next",
          value: pointerValue(
            index === null || index + 1 >= roman.length ? null : index + 1
          ),
          tone: "yellow",
        },
      ],
      done,
      state: {
        roman: [...roman],
        values: [...values],
        index,
        currentValue,
        nextValue,
        total,
        contributions: contributions.map((entry) => ({ ...entry })),
        result,
      },
      pointers: {
        index,
        lookahead:
          index === null || index + 1 >= roman.length ? null : index + 1,
      },
    });
  }

  pushStep(
    roman.length === 0
      ? "The input is empty after cleaning, so the numeral contributes no value."
      : "Scan the numeral from left to right and compare each symbol to the one after it.",
    "initialize",
    "slate",
    [1, 2, 3],
    roman.length === 0
      ? "There are no Roman symbols to process, so the answer starts and ends at 0."
      : "Each symbol either adds itself or subtracts itself if a bigger symbol sits immediately to its right.",
    roman.length === 0
      ? "An empty sanitized string yields the neutral additive identity 0."
      : "Roman parsing with lookahead works because only six subtractive patterns exist, and each is encoded as a smaller symbol before a larger one.",
    roman.length === 0
      ? "No symbols remain after filtering invalid characters."
      : "The only question at each position is whether the current value is smaller than the next value.",
    roman.length === 0
      ? [
          "Only I, V, X, L, C, D, and M are kept.",
          "Everything else is ignored for safety.",
          "The running total remains 0.",
        ]
      : [
          "Lookahead tells us whether to add or subtract.",
          "A smaller value before a larger one means subtraction.",
          "Otherwise the symbol contributes positively.",
        ]
  );

  while (index !== null && index < roman.length) {
    currentValue = values[index];
    nextValue = index + 1 < roman.length ? values[index + 1] : 0;

    pushStep(
      `Inspect ${roman[index]} at index ${index}. Its value is ${currentValue}, and the next value is ${nextValue}.`,
      "inspect",
      "yellow",
      [4, 5, 6],
      "We are deciding whether this symbol stands on its own or forms the front half of a subtractive pair.",
      "The local invariant is simple: compare current and next values before committing the current contribution.",
      "Only the current symbol can change the total in this step.",
      [
        "The next symbol is read only as context.",
        "A larger lookahead triggers subtraction.",
        "The running total changes once per index.",
      ]
    );

    if (currentValue < nextValue) {
      total -= currentValue;
      contributions.push({
        symbol: roman[index],
        signedValue: -currentValue,
        reason: `${roman[index]} before ${roman[index + 1]}`,
      });

      pushStep(
        `${roman[index]} is smaller than ${roman[index + 1]}, so subtract ${currentValue} from the total.`,
        "subtract",
        "red",
        [7, 8],
        "A smaller symbol before a bigger one means this amount should be taken away.",
        "Subtractive notation encodes pairs like IV, IX, XL, XC, CD, and CM by letting the smaller symbol contribute negatively.",
        "This symbol participates as a negative contribution.",
        [
          "Examples: IV uses -1 + 5, and CM uses -100 + 1000.",
          "We still move only one index at a time.",
          "The next symbol will be processed normally on the following step.",
        ]
      );
    } else {
      total += currentValue;
      contributions.push({
        symbol: roman[index],
        signedValue: currentValue,
        reason: "additive symbol",
      });

      pushStep(
        `${roman[index]} is not smaller than the next symbol, so add ${currentValue} to the total.`,
        "add",
        "green",
        [9, 10],
        "This symbol stands on its own, so its value joins the answer.",
        "When current >= next, the symbol cannot be the subtractive half of a valid Roman pair and must contribute positively.",
        "Additive symbols push the total upward directly.",
        [
          "A trailing symbol always adds because its lookahead is 0.",
          "Equal neighbors also add normally.",
          "The running total now includes this symbol's full value.",
        ]
      );
    }

    index += 1;
  }

  index = null;
  currentValue = 0;
  nextValue = 0;
  result = total;

  pushStep(
    `The scan is complete. The Roman numeral evaluates to ${total}.`,
    "done",
    "green",
    [13],
    "After every symbol has contributed, the running total is the final answer.",
    "Because each index commits exactly one signed contribution, the final accumulator equals the integer value of the numeral.",
    "The finished total already includes all additive and subtractive effects.",
    [
      "Time complexity is O(n).",
      "Extra space is O(1) outside of the teaching ledger.",
      "The contribution rail below is only for explanation.",
    ],
    true
  );

  return trace;
}
