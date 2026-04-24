import type {
  DpTraceStep,
  InputFieldConfig,
  PresetConfig,
  VisualCell,
  VisualTone,
} from "@/components/dp/shared/types";
import { formatInfinity, createTraceRecorder } from "@/components/dp/shared/trace";
import { parseInteger, parseNumberList } from "@/components/dp/shared/parsers";

export const inputFields: InputFieldConfig[] = [
  {
    key: "coins",
    label: "coins",
    placeholder: "[1,2,5]",
    help: "Available coin denominations.",
  },
  {
    key: "amount",
    label: "amount",
    placeholder: "11",
    help: "Target amount to assemble.",
  },
];

export const defaultInputs = {
  coins: "[1,2,5]",
  amount: "11",
};

export type CoinChangeInputs = typeof defaultInputs;

export const presets: PresetConfig<CoinChangeInputs>[] = [
  {
    name: "Example 1",
    summary: "=> 3",
    values: { coins: "[1,2,5]", amount: "11" },
  },
  {
    name: "Example 2",
    summary: "=> -1",
    values: { coins: "[2]", amount: "3" },
  },
  {
    name: "Zero target",
    summary: "=> 0",
    values: { coins: "[1]", amount: "0" },
  },
];

export const code = [
  "function coinChange(coins: number[], amount: number): number {",
  "  const dp = Array(amount + 1).fill(Infinity);",
  "  dp[0] = 0;",
  "  for (const coin of coins) {",
  "    for (let value = coin; value <= amount; value += 1) {",
  "      dp[value] = Math.min(dp[value], dp[value - coin] + 1);",
  "    }",
  "  }",
  "  return Number.isFinite(dp[amount]) ? dp[amount] : -1;",
  "}",
];

export const complexity = ["Time O(coins * amount)", "Space O(amount)", "Pattern: Unbounded knapsack"];

function amountTone(index: number, current: number | null, source: number | null, dp: number[]): VisualTone {
  if (current === index) {
    return "sky";
  }

  if (source === index) {
    return "amber";
  }

  if (Number.isFinite(dp[index])) {
    return "emerald";
  }

  return "slate";
}

export function generateTrace(inputs: CoinChangeInputs): DpTraceStep[] {
  const coins = parseNumberList(inputs.coins).filter((value) => value > 0);
  const amount = Math.max(0, parseInteger(inputs.amount, 11));
  const dp = Array.from({ length: amount + 1 }, () => Number.POSITIVE_INFINITY);
  const updates: Array<{ coin: number; value: number; result: number }> = [];
  const { trace, pushStep } = createTraceRecorder();

  dp[0] = 0;

  function buildCoinCells(activeCoin: number | null): VisualCell[] {
    return coins.map((coin) => ({
      id: `coin-${coin}`,
      label: `coin`,
      value: coin,
      caption: "value",
      tone: activeCoin === coin ? "amber" : "slate",
      tags: activeCoin === coin ? ["active"] : [],
      variant: "coin",
    }));
  }

  function buildAmountCells(current: number | null, source: number | null): VisualCell[] {
    return dp.map((value, index) => ({
      id: `amount-${index}`,
      label: `$${index}`,
      value: formatInfinity(value),
      tone: amountTone(index, current, source, dp),
      tags:
        current === index
          ? ["target"]
          : source === index
          ? ["reuse"]
          : Number.isFinite(value)
          ? ["known"]
          : [],
    }));
  }

  function pushFrame(
    activeCoin: number | null,
    current: number | null,
    source: number | null,
    action: string,
    actionKind: DpTraceStep["actionKind"],
    actionTone: DpTraceStep["actionTone"],
    codeLines: number[],
    beginnerNote: string,
    expertNote: string,
    focus: string,
    candidate = Number.POSITIVE_INFINITY,
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
        "dp[value] stores the minimum number of coins needed to form that amount.",
        "Each denomination can be reused because the inner loop moves forward.",
        "Infinity means the amount has not been assembled yet.",
      ],
      metrics: [
        { label: "Target", value: amount, tone: "slate" },
        { label: "Candidate", value: formatInfinity(candidate), tone: "amber" },
        { label: "Best target", value: formatInfinity(dp[amount]), tone: "emerald" },
      ],
      pointerChips: [
        { label: "coin", value: activeCoin === null ? "-" : String(activeCoin), tone: "amber" },
        { label: "value", value: current === null ? "done" : String(current), tone: "sky" },
      ],
      done,
      resultLabel: "fewestCoins",
      resultValue: String(Number.isFinite(dp[amount]) ? dp[amount] : -1),
      animation: {
        type: done ? "highlight" : "update",
        targets:
          current === null
            ? ["amount-result"]
            : [`amount-${current}`, ...(source !== null ? [`amount-${source}`] : [])],
        duration: 820,
      },
      highlights: {
        primaryIds:
          current === null
            ? ["amount-result"]
            : [`amount-${current}`, ...(source !== null ? [`amount-${source}`] : [])],
        secondaryIds: activeCoin !== null ? [`coin-${activeCoin}`] : [],
      },
      state: {
        scene: "coinforge",
        headline: "Every denomination forges cheaper totals forward",
        subheadline:
          "The table remembers the fewest coins for each amount, then asks whether the active coin can reduce a larger total.",
        sequences: [
          {
            id: "coins",
            title: "Coin rack",
            subtitle: "The amber coin is currently sweeping across the DP table.",
            variant: "coin",
            cells: buildCoinCells(activeCoin),
          },
          {
            id: "amounts",
            title: "Minimum coins by amount",
            subtitle: "Blue is the amount being updated. Amber is the amount reused after subtracting the current coin.",
            cells: buildAmountCells(current, source),
          },
        ],
        ledgers: [
          {
            id: "improvements",
            title: "Successful improvements",
            subtitle: "Only green rows reflect real DP improvements.",
            items: updates.map((update, index) => ({
              id: `update-${index}`,
              label: `$${update.value} with coin ${update.coin}`,
              value: `${update.result} coin(s)`,
              tone: "emerald",
            })),
            emptyLabel: "No amount has been improved yet.",
          },
        ],
        callouts: [
          {
            id: "formula",
            label: "Transition",
            value:
              current !== null && source !== null
                ? `dp[${current}] vs dp[${source}] + 1`
                : "dp[value] = min(dp[value], dp[value-coin] + 1)",
            tone: "sky",
          },
        ],
        result: {
          label: "Fewest coins for target",
          value: String(Number.isFinite(dp[amount]) ? dp[amount] : -1),
          tone: done ? (Number.isFinite(dp[amount]) ? "emerald" : "rose") : "sky",
        },
      },
    });
  }

  pushFrame(
    null,
    0,
    null,
    "Initialize the forge: amount 0 needs 0 coins, and every other amount starts as unreachable.",
    "initialize",
    "slate",
    [1, 2, 3],
    "The DP table begins with a single solved amount: zero money needs zero coins.",
    "Infinity is a safe sentinel because any real candidate will be smaller.",
    "Every reachable amount must be built by extending a smaller reachable amount."
  );

  for (const coin of coins) {
    pushFrame(
      coin,
      null,
      null,
      `Activate coin ${coin}. Sweep forward so this denomination can be reused multiple times.`,
      "coin-pass",
      "amber",
      [4],
      "The current coin now tries to improve every amount it can contribute to.",
      "Forward iteration is what makes the transition unbounded: updated states may be reused later in the same pass.",
      "Each coin pass is a full wave over the reachable amounts."
    );

    for (let value = coin; value <= amount; value += 1) {
      const source = value - coin;
      const candidate =
        Number.isFinite(dp[source]) ? dp[source] + 1 : Number.POSITIVE_INFINITY;

      pushFrame(
        coin,
        value,
        source,
        `Try forming ${value} by adding coin ${coin} on top of amount ${source}.`,
        "inspect",
        "amber",
        [5, 6],
        "The forge checks whether the smaller amount is already reachable and whether adding one coin is better.",
        "The transition compares the current best answer with a candidate that reuses the active denomination.",
        "If amount value-coin is known, it can launch a new candidate for the current amount.",
        candidate
      );

      if (candidate < dp[value]) {
        dp[value] = candidate;
        updates.push({ coin, value, result: candidate });

        pushFrame(
          coin,
          value,
          source,
          `Update dp[${value}] to ${candidate}. Coin ${coin} created a cheaper assembly.`,
          "update",
          "sky",
          [5, 6],
          "The candidate beats the previous best, so the table records a cheaper coin count.",
          "Monotonic improvement is safe because any future candidate will compare against this smaller answer.",
          "This amount is now reachable with fewer coins than before.",
          candidate
        );
      }
    }
  }

  pushFrame(
    null,
    null,
    null,
    Number.isFinite(dp[amount])
      ? `The forge stabilizes with dp[${amount}] = ${dp[amount]}.`
      : `The forge never reaches amount ${amount}, so the answer is -1.`,
    "complete",
    Number.isFinite(dp[amount]) ? "emerald" : "rose",
    [8, 9],
    "The final target cell tells us whether the amount is reachable and how many coins it takes.",
    "The minimum-coin DP is complete after every denomination has had a chance to improve each amount.",
    "The target slot is the only value that matters to answer the original question.",
    Number.isFinite(dp[amount]) ? dp[amount] : Number.POSITIVE_INFINITY,
    true
  );

  return trace;
}
