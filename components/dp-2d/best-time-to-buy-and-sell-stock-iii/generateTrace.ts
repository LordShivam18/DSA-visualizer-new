import type {
  DpTraceStep,
  InputFieldConfig,
  PresetConfig,
  VisualCell,
  VisualNode,
} from "@/components/dp/shared/types";
import { parseNumberList } from "@/components/dp/shared/parsers";
import { createTraceRecorder } from "@/components/dp/shared/trace";

export const inputFields: InputFieldConfig[] = [
  {
    key: "prices",
    label: "prices",
    placeholder: "[3,3,5,0,0,3,1,4]",
    help: "Daily stock prices.",
  },
];

export const defaultInputs = {
  prices: "[3,3,5,0,0,3,1,4]",
};

export type StockIIIInputs = typeof defaultInputs;

export const presets: PresetConfig<StockIIIInputs>[] = [
  {
    name: "Example 1",
    summary: "=> 6",
    values: { prices: "[3,3,5,0,0,3,1,4]" },
  },
  {
    name: "Example 2",
    summary: "=> 4",
    values: { prices: "[1,2,3,4,5]" },
  },
  {
    name: "Flat",
    summary: "=> 0",
    values: { prices: "[7,6,4,3,1]" },
  },
];

export const code = [
  "function maxProfit(prices: number[]): number {",
  "  let buy1 = Number.NEGATIVE_INFINITY;",
  "  let sell1 = 0;",
  "  let buy2 = Number.NEGATIVE_INFINITY;",
  "  let sell2 = 0;",
  "  for (const price of prices) {",
  "    buy1 = Math.max(buy1, -price);",
  "    sell1 = Math.max(sell1, buy1 + price);",
  "    buy2 = Math.max(buy2, sell1 - price);",
  "    sell2 = Math.max(sell2, buy2 + price);",
  "  }",
  "  return sell2;",
  "}",
];

export const complexity = ["Time O(n)", "Space O(1)", "Pattern: Transaction state machine"];

export function generateTrace(inputs: StockIIIInputs): DpTraceStep[] {
  const prices = parseNumberList(inputs.prices);
  const { trace, pushStep } = createTraceRecorder();
  let buy1 = Number.NEGATIVE_INFINITY;
  let sell1 = 0;
  let buy2 = Number.NEGATIVE_INFINITY;
  let sell2 = 0;

  function buildPriceCells(day: number | null): VisualCell[] {
    return prices.map((price, index) => ({
      id: `price-${index}`,
      label: `day ${index + 1}`,
      value: price,
      caption: "$",
      tone: day === index ? "sky" : index < (day ?? 0) ? "emerald" : "slate",
      tags: day === index ? ["live"] : [],
      variant: "price",
    }));
  }

  function buildNodes(): VisualNode[] {
    return [
      { id: "buy1", label: "Buy #1", value: buy1, tone: "amber", note: "Best balance after the first buy." },
      { id: "sell1", label: "Sell #1", value: sell1, tone: "emerald", note: "Best profit after the first completed sale." },
      { id: "buy2", label: "Buy #2", value: buy2, tone: "violet", note: "Best balance after starting the second trade." },
      { id: "sell2", label: "Sell #2", value: sell2, tone: "sky", note: "Best total profit after finishing both trades." },
    ];
  }

  function pushFrame(
    day: number | null,
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
        "Each variable tracks the best balance or profit after a specific trade phase.",
        "The updates must happen in order because later phases depend on earlier ones from the same day.",
        "sell2 is the answer because it represents two completed transactions.",
      ],
      metrics: [
        { label: "Day", value: day === null ? "done" : day + 1, tone: "slate" },
        { label: "Price", value: day === null ? "-" : prices[day], tone: "sky" },
        { label: "Best profit", value: sell2, tone: "emerald" },
      ],
      pointerChips: [
        { label: "day", value: day === null ? "done" : String(day), tone: "sky" },
      ],
      done,
      resultLabel: "maxProfit",
      resultValue: String(sell2),
      animation: {
        type: done ? "highlight" : "update",
        targets: day === null ? ["sell2"] : [`price-${day}`, "buy1", "sell1", "buy2", "sell2"],
        duration: 840,
      },
      highlights: {
        primaryIds: day === null ? ["sell2"] : [`price-${day}`, "buy1", "sell1", "buy2", "sell2"],
      },
      state: {
        scene: "trading",
        headline: "Profit flows through four transaction states",
        subheadline:
          "The control room tracks the best balance after each buy and the best profit after each sell, all in one scan.",
        sequences: [
          {
            id: "prices",
            title: "Price tape",
            subtitle: "Blue marks the active trading day while earlier prices fade into the tape history.",
            variant: "price",
            cells: buildPriceCells(day),
          },
        ],
        nodeGroups: [
          {
            id: "trade-states",
            title: "Two-transaction state machine",
            subtitle: "The values update in order from the first buy to the second sell every day.",
            nodes: buildNodes(),
          },
        ],
        result: {
          label: "Maximum profit with two trades",
          value: String(sell2),
          tone: done ? "emerald" : "sky",
        },
      },
    });
  }

  pushFrame(
    null,
    "Initialize the trading desk with impossible buy states and zero completed profit.",
    "initialize",
    "slate",
    [1, 2, 3, 4, 5],
    "Before reading prices, the algorithm has not bought anything yet and has made zero profit.",
    "Negative infinity marks states that cannot exist until a valid price arrives.",
    "The trading machine needs a neutral starting balance before the first price tick."
  );

  for (let day = 0; day < prices.length; day += 1) {
    const price = prices[day];

    pushFrame(
      day,
      `Read price ${price} on day ${day + 1} and propagate it through every trade phase.`,
      "inspect",
      "amber",
      [6],
      "The current price may improve one or more trade states.",
      "Each state update considers whether using today's price creates a better balance or profit than all previous days.",
      "One price tick can ripple through the entire transaction pipeline."
    );

    buy1 = Math.max(buy1, -price);
    sell1 = Math.max(sell1, buy1 + price);
    buy2 = Math.max(buy2, sell1 - price);
    sell2 = Math.max(sell2, buy2 + price);

    pushFrame(
      day,
      `Update buy1, sell1, buy2, and sell2 using price ${price}. The best two-trade profit is now ${sell2}.`,
      "update",
      "sky",
      [6, 7, 8, 9, 10],
      "The desk keeps whichever version of each state is more profitable after seeing today's price.",
      "The ordered state updates compress a full DP table into four rolling variables without losing correctness.",
      "At the end of the day, each state holds the best achievable outcome for its phase."
    );
  }

  pushFrame(
    null,
    `The trading desk closes with sell2 = ${sell2}.`,
    "complete",
    "emerald",
    [11, 12],
    "The second sell state is the best profit after at most two complete transactions.",
    "Because every feasible two-trade plan must end in the second sell phase, sell2 is the final optimum.",
    "The control room stabilizes once the last price has been processed.",
    true
  );

  return trace;
}
