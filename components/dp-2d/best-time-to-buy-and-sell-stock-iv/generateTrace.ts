import type {
  DpTraceStep,
  InputFieldConfig,
  PresetConfig,
  VisualCell,
  VisualMatrix,
} from "@/components/dp/shared/types";
import { parseInteger, parseNumberList } from "@/components/dp/shared/parsers";
import { createTraceRecorder } from "@/components/dp/shared/trace";

export const inputFields: InputFieldConfig[] = [
  { key: "k", label: "k", placeholder: "2", help: "Maximum number of transactions." },
  {
    key: "prices",
    label: "prices",
    placeholder: "[2,4,1]",
    help: "Daily stock prices.",
  },
];

export const defaultInputs = {
  k: "2",
  prices: "[2,4,1]",
};

export type StockIVInputs = typeof defaultInputs;

export const presets: PresetConfig<StockIVInputs>[] = [
  { name: "Example 1", summary: "=> 2", values: { k: "2", prices: "[2,4,1]" } },
  { name: "Example 2", summary: "=> 7", values: { k: "2", prices: "[3,2,6,5,0,3]" } },
  { name: "Three trades", summary: "=> 11", values: { k: "3", prices: "[1,4,2,7,2,9]" } },
];

export const code = [
  "function maxProfit(k: number, prices: number[]): number {",
  "  const buy = Array(k + 1).fill(Number.NEGATIVE_INFINITY);",
  "  const sell = Array(k + 1).fill(0);",
  "  for (const price of prices) {",
  "    for (let trade = 1; trade <= k; trade += 1) {",
  "      buy[trade] = Math.max(buy[trade], sell[trade - 1] - price);",
  "      sell[trade] = Math.max(sell[trade], buy[trade] + price);",
  "    }",
  "  }",
  "  return sell[k];",
  "}",
];

export const complexity = ["Time O(k*n)", "Space O(k)", "Pattern: Layered transaction DP"];

export function generateTrace(inputs: StockIVInputs): DpTraceStep[] {
  const k = Math.max(0, parseInteger(inputs.k, 2));
  const prices = parseNumberList(inputs.prices);
  const buy = Array.from({ length: k + 1 }, () => Number.NEGATIVE_INFINITY);
  const sell = Array.from({ length: k + 1 }, () => 0);
  const { trace, pushStep } = createTraceRecorder();

  function buildPriceCells(day: number | null): VisualCell[] {
    return prices.map((price, index) => ({
      id: `price-${index}`,
      label: `day ${index + 1}`,
      value: price,
      tone: day === index ? "sky" : index < (day ?? 0) ? "emerald" : "slate",
      tags: day === index ? ["live"] : [],
      variant: "price",
    }));
  }

  function buildStateMatrix(trade: number | null): VisualMatrix {
    return {
      id: "trade-layers",
      title: "Transaction layers",
      subtitle:
        "Each row tracks the best buy balance and sell profit for a fixed transaction count.",
      variant: "grid",
      rows: [
        {
          id: "buy-row",
          label: "buy",
          cells: Array.from({ length: k + 1 }, (_, index) => ({
            id: `buy-${index}`,
            value: index === 0 ? "-" : buy[index],
            tone: trade === index ? "amber" : index === 0 ? "slate" : "violet",
            tags: trade === index ? ["trade"] : [],
            variant: "square",
          })),
        },
        {
          id: "sell-row",
          label: "sell",
          cells: Array.from({ length: k + 1 }, (_, index) => ({
            id: `sell-${index}`,
            value: sell[index],
            tone: trade === index ? "sky" : index === 0 ? "slate" : "emerald",
            tags: trade === index ? ["trade"] : [],
            variant: "square",
          })),
        },
      ],
    };
  }

  function pushFrame(
    day: number | null,
    trade: number | null,
    action: string,
    actionKind: DpTraceStep["actionKind"],
    actionTone: DpTraceStep["actionTone"],
    codeLines: number[],
    beginnerNote: string,
    expertNote: string,
    focus: string,
    done = false
  ) {
    pushStep({
      action,
      actionKind,
      actionTone,
      codeLines,
      beginnerNote,
      expertNote,
      focus,
      hints: [
        "buy[t] is the best balance after starting the t-th transaction.",
        "sell[t] is the best profit after completing the t-th transaction.",
        "Each trade layer only depends on itself and the previous sell layer.",
      ],
      metrics: [
        { label: "k", value: k, tone: "slate" },
        { label: "Day", value: day === null ? "done" : day + 1, tone: "sky" },
        { label: "Best profit", value: sell[k] ?? 0, tone: "emerald" },
      ],
      pointerChips: [
        { label: "day", value: day === null ? "done" : String(day), tone: "sky" },
        { label: "trade", value: trade === null ? "-" : String(trade), tone: "amber" },
      ],
      done,
      resultLabel: "maxProfit",
      resultValue: String(sell[k] ?? 0),
      animation: {
        type: done ? "highlight" : "update",
        targets:
          day === null
            ? [`sell-${k}`]
            : [`price-${day}`, ...(trade !== null ? [`buy-${trade}`, `sell-${trade}`] : [])],
        duration: 840,
      },
      highlights: {
        primaryIds:
          day === null
            ? [`sell-${k}`]
            : [`price-${day}`, ...(trade !== null ? [`buy-${trade}`, `sell-${trade}`] : [])],
      },
      state: {
        scene: "trading",
        headline: "Profit climbs a ladder of transaction layers",
        subheadline:
          "Each layer represents one more allowable transaction, and every price tick tries to improve both the buy and sell state on that layer.",
        sequences: [
          {
            id: "prices",
            title: "Price tape",
            subtitle: "Blue marks the day currently flowing through the trading ladder.",
            variant: "price",
            cells: buildPriceCells(day),
          },
        ],
        matrices: [buildStateMatrix(trade)],
        result: {
          label: `Maximum profit with ${k} transaction${k === 1 ? "" : "s"}`,
          value: String(sell[k] ?? 0),
          tone: done ? "emerald" : "sky",
        },
      },
    });
  }

  pushFrame(
    null,
    null,
    "Initialize every transaction layer with impossible buy states and zero sell profit.",
    "initialize",
    "slate",
    [1, 2, 3],
    "Before the first price arrives, every buy state is impossible and every sell state has zero profit.",
    "The layered DP starts from a neutral sell baseline and unreachable buy balances.",
    "Each transaction layer waits for price ticks to become meaningful."
  );

  for (let day = 0; day < prices.length; day += 1) {
    const price = prices[day];

    for (let trade = 1; trade <= k; trade += 1) {
      pushFrame(
        day,
        trade,
        `Process price ${price} on day ${day + 1} for transaction layer ${trade}.`,
        "inspect",
        "amber",
        [4, 5],
        "The active layer decides whether today's price improves its buy or sell state.",
        "Every layer reuses the previous sell layer for buys and its own buy state for sells.",
        "The trading ladder updates one layer at a time for the current day."
      );

      buy[trade] = Math.max(buy[trade], sell[trade - 1] - price);
      sell[trade] = Math.max(sell[trade], buy[trade] + price);

      pushFrame(
        day,
        trade,
        `Update buy[${trade}] and sell[${trade}] with price ${price}. Layer ${trade} now tops out at ${sell[trade]} profit.`,
        "update",
        "sky",
        [5, 6, 7],
        "The layer keeps whichever buy balance and sell profit are better after seeing today's price.",
        "This compressed DP is equivalent to a full transaction-by-day table, but it only stores the frontier states.",
        "After the update, the layer is ready to support later days and higher layers."
      );
    }
  }

  pushFrame(
    null,
    null,
    `The final sell layer settles at ${sell[k] ?? 0}.`,
    "complete",
    "emerald",
    [9, 10],
    "The answer is the sell state on the highest transaction layer.",
    "sell[k] represents the best profit after completing at most k transactions, which is exactly the target objective.",
    "The trading ladder is complete after the last day and last layer are processed.",
    true
  );

  return trace;
}
