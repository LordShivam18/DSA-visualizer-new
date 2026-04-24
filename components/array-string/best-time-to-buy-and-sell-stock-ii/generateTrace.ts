import { parseNumberList } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type StockIIState = {
  prices: number[];
  day: number | null;
  delta: number;
  totalProfit: number;
  transactions: string[];
  result: number | null;
};

type StockIIPointers = {
  prevDay: number | null;
  day: number | null;
};

export type StockIITraceStep = TeachingTraceFrame & {
  state: StockIIState;
  pointers: StockIIPointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(rawPrices: string) {
  const prices = parseNumberList(rawPrices);
  const trace: StockIITraceStep[] = [];

  let day: number | null = prices.length > 1 ? 1 : null;
  let delta = 0;
  let totalProfit = 0;
  const transactions: string[] = [];
  let result: number | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: StockIITraceStep["actionTone"],
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
        { label: "Total Profit", value: totalProfit, tone: "green" },
        { label: "Current Delta", value: delta, tone: delta > 0 ? "cyan" : "red" },
        { label: "Trades Count", value: transactions.length, tone: "purple" },
      ],
      pointerChips: [
        { label: "prev", value: pointerValue(day === null ? null : day - 1), tone: "purple" },
        { label: "day", value: pointerValue(day), tone: "cyan" },
      ],
      done,
      state: {
        prices: [...prices],
        day,
        delta,
        totalProfit,
        transactions: [...transactions],
        result,
      },
      pointers: {
        prevDay: day === null ? null : day - 1,
        day,
      },
    });
  }

  pushStep(
    "Scan every adjacent pair of days. Any positive price increase can be harvested as profit.",
    "initialize",
    "slate",
    [1, 2],
    "Instead of hunting one giant trade, this version adds every upward step.",
    "Summing all positive day-to-day gains equals the optimal profit when unlimited transactions are allowed without overlapping holds.",
    "Every positive slope contributes directly to the answer.",
    [
      "You may buy and sell multiple times.",
      "You can hold at most one share at a time.",
      "Positive adjacent differences are enough to reconstruct every rising segment.",
    ]
  );

  while (day !== null && day < prices.length) {
    delta = prices[day] - prices[day - 1];

    pushStep(
      `Compare day ${day - 1} (${prices[day - 1]}) to day ${day} (${prices[day]}). Delta = ${delta}.`,
      "inspect",
      "yellow",
      [3, 4],
      "This step asks whether today's price rise is worth collecting.",
      "The greedy insight is local: only positive adjacent deltas increase total achievable profit.",
      "A rising edge can be safely added to the answer.",
      [
        "Negative deltas should be ignored.",
        "Positive deltas extend a profitable upward segment.",
        "No global backtracking is needed.",
      ]
    );

    if (delta > 0) {
      totalProfit += delta;
      transactions.push(`${day - 1}->${day} (+${delta})`);

      pushStep(
        `Because the price increased, collect +${delta} profit from the move ${day - 1} -> ${day}.`,
        "collect",
        "green",
        [4, 5],
        "A positive rise is pure profit, so it joins the answer immediately.",
        "Adding every positive delta is equivalent to buying at each local valley and selling at each local peak.",
        "The accumulated profit equals the sum of all rising edges seen so far.",
        [
          "This may represent extending an existing trade or starting a new one.",
          "The total profit increases by exactly this delta.",
          "The greedy choice is always safe for unlimited transactions.",
        ]
      );
    } else {
      pushStep(
        "The price did not rise, so no profit is collected from this pair of days.",
        "skip",
        "red",
        [4],
        "A flat or falling move cannot help the answer, so it is ignored.",
        "Non-positive deltas do not belong in the greedy sum because they would never increase profit.",
        "Ignoring a non-positive edge preserves the optimal answer.",
        [
          "The total profit stays unchanged.",
          "A future rising edge may still start a profitable segment.",
          "The scan simply advances to the next pair.",
        ]
      );
    }

    day += 1;
  }

  day = null;
  delta = 0;
  result = totalProfit;

  pushStep(
    `The scan is complete. The total accumulated profit is ${totalProfit}.`,
    "done",
    "green",
    [7],
    "The answer is the sum of every positive day-to-day increase.",
    "For unlimited transactions, decomposing every rising segment into adjacent gains preserves the optimal total profit.",
    "All profitable upward moves have already been included.",
    [
      "Time complexity is O(n).",
      "Extra space is O(1) aside from the teaching trace ledger.",
      "The transaction list is shown only for explanation.",
    ],
    true
  );

  return trace;
}
