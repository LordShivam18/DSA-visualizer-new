import { clamp, parseInteger } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

const DENOMINATIONS = [
  { value: 1000, symbol: "M" },
  { value: 900, symbol: "CM" },
  { value: 500, symbol: "D" },
  { value: 400, symbol: "CD" },
  { value: 100, symbol: "C" },
  { value: 90, symbol: "XC" },
  { value: 50, symbol: "L" },
  { value: 40, symbol: "XL" },
  { value: 10, symbol: "X" },
  { value: 9, symbol: "IX" },
  { value: 5, symbol: "V" },
  { value: 4, symbol: "IV" },
  { value: 1, symbol: "I" },
] as const;

type Fragment = {
  symbol: string;
  value: number;
  remainingAfter: number;
};

type IntegerToRomanState = {
  input: number;
  remaining: number;
  denominationIndex: number | null;
  activeValue: number;
  activeSymbol: string;
  output: string;
  fragments: Fragment[];
  result: string | null;
};

type IntegerToRomanPointers = {
  denominationIndex: number | null;
};

export type IntegerToRomanTraceStep = TeachingTraceFrame & {
  state: IntegerToRomanState;
  pointers: IntegerToRomanPointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(rawNumber: string) {
  const input = clamp(parseInteger(rawNumber, 1), 1, 3999);
  const trace: IntegerToRomanTraceStep[] = [];

  let remaining = input;
  let denominationIndex: number | null = 0;
  let activeValue: number = DENOMINATIONS[0].value;
  let activeSymbol: string = DENOMINATIONS[0].symbol;
  let output = "";
  let result: string | null = null;
  const fragments: Fragment[] = [];

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: IntegerToRomanTraceStep["actionTone"],
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
        { label: "Remaining", value: remaining, tone: "cyan" },
        { label: "Output Size", value: output.length, tone: "green" },
        { label: "Fragments Minted", value: fragments.length, tone: "purple" },
      ],
      pointerChips: [
        {
          label: "denom",
          value: pointerValue(denominationIndex),
          tone: "cyan",
        },
        {
          label: "symbol",
          value: denominationIndex === null ? "done" : activeSymbol,
          tone: "yellow",
        },
      ],
      done,
      state: {
        input,
        remaining,
        denominationIndex,
        activeValue,
        activeSymbol,
        output,
        fragments: fragments.map((fragment) => ({ ...fragment })),
        result,
      },
      pointers: {
        denominationIndex,
      },
    });
  }

  pushStep(
    `Start with ${input} and scan the Roman denomination table from largest to smallest.`,
    "initialize",
    "slate",
    [1, 2, 3],
    "We repeatedly grab the biggest Roman piece that still fits inside the remaining number.",
    "The greedy table is canonical for Roman numerals, so choosing the largest available denomination is always safe.",
    "Keep subtracting the largest legal denomination until nothing remains.",
    [
      "Roman numerals are built from largest place-value chunk to smallest.",
      "Special subtractive forms like CM and IV are already included in the table.",
      "The remainder shrinks monotonically.",
    ]
  );

  while (denominationIndex !== null && denominationIndex < DENOMINATIONS.length) {
    activeValue = DENOMINATIONS[denominationIndex].value;
    activeSymbol = DENOMINATIONS[denominationIndex].symbol;

    pushStep(
      `Check whether ${activeValue} (${activeSymbol}) fits into the current remainder ${remaining}.`,
      "inspect",
      "yellow",
      [4, 5],
      "This step asks whether the current Roman chunk can be minted right now.",
      "The pointer walks the descending denomination table. The first value that fits is the next greedy choice.",
      "Only one denomination is under consideration at a time.",
      [
        "If the value fits, we append its symbol and subtract it.",
        "If it does not fit, we advance to the next smaller denomination.",
        "The output string is always a valid Roman prefix.",
      ]
    );

    if (remaining >= activeValue) {
      remaining -= activeValue;
      output += activeSymbol;
      fragments.push({
        symbol: activeSymbol,
        value: activeValue,
        remainingAfter: remaining,
      });

      pushStep(
        `${activeSymbol} fits, so append it to the answer and reduce the remainder to ${remaining}.`,
        "append",
        "green",
        [5, 6, 7],
        "Because this chunk fits, it becomes the next piece of the Roman numeral.",
        "Greedy correctness holds because the Roman denomination table already encodes the optimal subtractive forms.",
        "The output stays valid and the remainder strictly decreases.",
        [
          "The same denomination may be used again if it still fits.",
          "Remainder zero means the numeral is complete.",
          "Each append extends the answer from left to right.",
        ]
      );

      if (remaining === 0) {
        break;
      }
    } else {
      denominationIndex += 1;

      if (denominationIndex < DENOMINATIONS.length) {
        activeValue = DENOMINATIONS[denominationIndex].value;
        activeSymbol = DENOMINATIONS[denominationIndex].symbol;
      }

      pushStep(
        `This denomination is too large, so move down to the next option in the table.`,
        "advance",
        "purple",
        [8],
        "The current Roman chunk is too big, so we slide to a smaller one.",
        "Advancing preserves correctness because all larger denominations are already proven impossible for this remainder.",
        "The table pointer only moves downward.",
        [
          "No backtracking is needed.",
          "Once a value is too large, every earlier larger value is also too large.",
          "The remainder stays unchanged on advance steps.",
        ]
      );
    }
  }

  denominationIndex = null;
  activeValue = 0;
  activeSymbol = "-";
  result = output;

  pushStep(
    `The remainder is exhausted, so the final Roman numeral is ${output}.`,
    "done",
    "green",
    [10],
    "Once nothing is left to convert, the built string is the final Roman numeral.",
    "The greedy denomination ledger exactly covers the original number without overlap or omission.",
    "The completed output concatenates every chosen denomination in descending order.",
    [
      "Time complexity is O(1) because the denomination table is fixed.",
      "Extra space is O(1) outside of the answer string and teaching trace.",
      "Inputs are clamped to the standard Roman range 1..3999.",
    ],
    true
  );

  return trace;
}
