import { formatArray, parseNumberList } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type StockState = {
  prices: number[];
  currentPrice: number | null;
  minPrice: number | null;
  minIndex: number | null;
  currentProfit: number;
  maxProfit: number;
  bestBuy: number | null;
  bestSell: number | null;
  result: number | null;
};

type StockPointers = {
  day: number | null;
  minIndex: number | null;
  bestSell: number | null;
};

export type StockTraceStep = TeachingTraceFrame & {
  state: StockState;
  pointers: StockPointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(rawPrices: string) {
  const prices = parseNumberList(rawPrices);
  const trace: StockTraceStep[] = [];

  let day = 0;
  let currentPrice: number | null = null;
  let minPrice: number | null = null;
  let minIndex: number | null = null;
  let currentProfit = 0;
  let maxProfit = 0;
  let bestBuy: number | null = null;
  let bestSell: number | null = null;
  let result: number | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: StockTraceStep["actionTone"],
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
        { label: "Best Profit", value: maxProfit, tone: "green" },
        { label: "Min Price", value: minPrice ?? "n/a", tone: "purple" },
        { label: "Current Profit", value: currentProfit, tone: "cyan" },
      ],
      pointerChips: [
        { label: "day", value: pointerValue(day), tone: "cyan" },
        { label: "buy", value: pointerValue(minIndex), tone: "purple" },
        { label: "best sell", value: pointerValue(bestSell), tone: "green" },
      ],
      done,
      state: {
        prices: [...prices],
        currentPrice,
        minPrice,
        minIndex,
        currentProfit,
        maxProfit,
        bestBuy,
        bestSell,
        result,
      },
      pointers: {
        day,
        minIndex,
        bestSell,
      },
    });
  }

  pushStep(
    `Start scanning prices ${formatArray(prices)}. The algorithm keeps the cheapest buy price seen so far and the best profit found so far.`,
    "initialize",
    "slate",
    [1, 2, 3],
    "At every day, we ask two questions: is this a new cheapest buy, and how much profit would selling today create?",
    "The invariant is minPrice = minimum price in the processed prefix, so prices[day] - minPrice is the best profit ending today.",
    "A single running minimum is enough to evaluate every possible sell day.",
    [
      "The buy day must happen before the sell day.",
      "Scanning left to right naturally enforces that rule.",
      "The best profit starts at 0 because doing nothing is allowed.",
    ]
  );

  while (day < prices.length) {
    currentPrice = prices[day];

    pushStep(
      `Inspect day ${day} with price ${currentPrice}.`,
      "inspect",
      "yellow",
      [4],
      "The current day is a possible sell day and maybe a better buy day too.",
      "Each day contributes one new candidate for minPrice and one new profit against the running minimum.",
      "The scan updates the running minimum before finalizing profit logic for the next days.",
      [
        "The algorithm never revisits earlier prices.",
        "Every profit calculation uses the cheapest earlier buy seen so far.",
        "Only O(1) extra state is needed.",
      ]
    );

    if (minPrice === null || currentPrice < minPrice) {
      minPrice = currentPrice;
      minIndex = day;
      currentProfit = 0;

      pushStep(
        `Price ${currentPrice} is the cheapest so far, so move the buy marker to day ${day}.`,
        "new-min",
        "purple",
        [5],
        "A lower price is a better buying opportunity for every future sell day.",
        "Updating minPrice tightens the lower bound for all future profit comparisons.",
        "The buy marker should always point to the minimum price seen in the processed prefix.",
        [
          "Best profit may stay unchanged.",
          "A cheaper buy can only help future transactions.",
          "Selling on the same day yields 0 profit, so currentProfit resets here.",
        ]
      );
    } else {
      currentProfit = currentPrice - minPrice;

      if (currentProfit > maxProfit) {
        maxProfit = currentProfit;
        bestBuy = minIndex;
        bestSell = day;

        pushStep(
          `Selling on day ${day} after buying on day ${minIndex} creates a new best profit of ${maxProfit}.`,
          "update-profit",
          "green",
          [6],
          "Today forms the strongest profit seen so far with the cheapest earlier buy.",
          "Because minPrice is the cheapest prefix value, prices[day] - minPrice is the best possible profit that ends today.",
          "bestProfit stores the maximum over all sell days processed so far.",
          [
            "The buy day stays at the running minimum location.",
            "The sell day moves to the current day.",
            "This best transaction can still be beaten by a future day.",
          ]
        );
      } else {
        pushStep(
          `Selling on day ${day} would make profit ${currentProfit}, which does not beat the current best ${maxProfit}.`,
          "keep-profit",
          "cyan",
          [6],
          "The current price is not strong enough to improve the answer.",
          "The best-so-far invariant stays intact when currentProfit <= maxProfit.",
          "Only strictly larger profits should replace the stored answer.",
          [
            "The running minimum still matters for later days.",
            "The best answer remains unchanged.",
            "The scan simply moves to the next price.",
          ]
        );
      }
    }

    day += 1;
  }

  day = null;
  currentPrice = null;
  result = maxProfit;

  pushStep(
    `The scan is complete. The maximum achievable profit is ${maxProfit}.`,
    "done",
    "green",
    [8],
    "The best stored transaction is the final answer.",
    "After one pass, maxProfit equals the maximum value of prices[sell] - minPricePrefix[sell] over the entire array.",
    "Every sell day has already been tested against the cheapest earlier buy.",
    [
      "Time complexity is O(n).",
      "Extra space is O(1).",
      "If prices only fall, the answer stays 0.",
    ],
    true
  );

  return trace;
}
