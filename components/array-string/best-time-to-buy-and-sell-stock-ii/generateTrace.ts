import { parseNumberList } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";
import type { TimelineAnimation } from "@/components/core/animation/TimelineEngine";
import type { PredictionCheckpoint } from "@/lib/academy/models";

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

type StockIIHighlights = {
  activeIndices: number[];
  collected: boolean;
  summary: string;
};

export type StockIITraceStep = TeachingTraceFrame & {
  action: string;
  state: StockIIState;
  highlights: StockIIHighlights;
  animation: TimelineAnimation;
  pointers: StockIIPointers;
  checkpoint?: PredictionCheckpoint;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

function buildNumericChoices(correctValue: number, alternatives: number[]) {
  const values = Array.from(new Set([correctValue, ...alternatives])).slice(0, 4);

  return values.map((value) => ({
    id: `value-${value}`,
    label: String(value),
    detail: value === correctValue ? "Matches the greedy state transition." : "A plausible but incorrect intermediate value.",
    isCorrect: value === correctValue,
  }));
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
    done = false,
    checkpoint?: PredictionCheckpoint
  ) {
    const prevDay = day === null ? null : day - 1;
    const activeIndices = [prevDay, day].filter(
      (value): value is number => typeof value === "number" && value >= 0
    );
    const collected =
      prevDay !== null &&
      day !== null &&
      prices[day] > prices[prevDay] &&
      actionKind === "collect";
    const animation: TimelineAnimation = {
      type:
        actionKind === "collect"
          ? "insert"
          : actionKind === "skip"
          ? "highlight"
          : actionKind === "done"
          ? "update"
          : "move",
      targets: activeIndices.map((index) => `day-${index}`),
      duration:
        actionKind === "collect"
          ? 860
          : actionKind === "done"
          ? 980
          : 720,
    };

    trace.push({
      step: trace.length,
      action,
      animation,
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
      highlights: {
        activeIndices,
        collected,
        summary: focus,
      },
      pointers: {
        prevDay,
        day,
      },
      checkpoint,
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
    const inspectCheckpoint: PredictionCheckpoint = {
      id: `stock-ii-inspect-${day}`,
      skill: "Compute the local greedy signal",
      prompt: `Before revealing the comparison, what is the delta between day ${day - 1} (${prices[day - 1]}) and day ${day} (${prices[day]})?`,
      explanation:
        "Prediction mode trains the learner to compute the next local signal mentally before the animation does it for them.",
      choices: buildNumericChoices(delta, [Math.abs(delta), totalProfit, 0]),
    };

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
      ],
      false,
      inspectCheckpoint
    );

    if (delta > 0) {
      totalProfit += delta;
      transactions.push(`${day - 1}->${day} (+${delta})`);
      const collectCheckpoint: PredictionCheckpoint = {
        id: `stock-ii-collect-${day}`,
        skill: "Commit the greedy action",
        prompt: `The delta is positive. What should the algorithm do next?`,
        explanation:
          "In this problem, every positive adjacent rise is safe to collect immediately because transactions are unlimited and non-overlapping.",
        choices: [
          {
            id: `collect-${day}`,
            label: `Add +${delta} profit and keep scanning`,
            detail: `The running total becomes ${totalProfit}.`,
            isCorrect: true,
          },
          {
            id: `skip-${day}`,
            label: "Ignore the rise and wait for a larger window",
            detail: "This wastes profit that can already be locked in safely.",
            isCorrect: false,
          },
          {
            id: `return-${day}`,
            label: "Return immediately because a profit exists",
            detail: "The scan must continue to harvest later rises too.",
            isCorrect: false,
          },
          {
            id: `reset-${day}`,
            label: "Reset total profit to zero",
            detail: "There is no restart condition in this greedy loop.",
            isCorrect: false,
          },
        ],
      };

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
        ],
        false,
        collectCheckpoint
      );
    } else {
      const skipCheckpoint: PredictionCheckpoint = {
        id: `stock-ii-skip-${day}`,
        skill: "Protect the invariant",
        prompt: "The delta is non-positive. What happens to the running profit?",
        explanation:
          "Flat or negative day-to-day changes are ignored because only positive gains belong in the optimal greedy sum.",
        choices: [
          {
            id: `unchanged-${day}`,
            label: `It stays ${totalProfit} and the scan advances`,
            detail: "Ignoring non-positive deltas preserves the optimal answer.",
            isCorrect: true,
          },
          {
            id: `subtract-${day}`,
            label: `Subtract ${Math.abs(delta)} to account for the drop`,
            detail: "Losses are never added into the profit tally.",
            isCorrect: false,
          },
          {
            id: `absorb-${day}`,
            label: "Merge it into a future transaction by lowering the answer now",
            detail: "The algorithm simply skips non-positive edges.",
            isCorrect: false,
          },
          {
            id: `done-${day}`,
            label: "Stop early because this pair is unprofitable",
            detail: "The loop still needs to inspect future pairs.",
            isCorrect: false,
          },
        ],
      };

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
        ],
        false,
        skipCheckpoint
      );
    }

    day += 1;
  }

  day = null;
  delta = 0;
  result = totalProfit;
  const doneCheckpoint: PredictionCheckpoint = {
    id: "stock-ii-final-answer",
    skill: "Close the loop with the final invariant",
    prompt: "The scan is over. What final profit should be returned?",
    explanation:
      "The result equals the sum of every positive adjacent rise collected during the scan.",
    choices: buildNumericChoices(totalProfit, [Math.max(totalProfit - 1, 0), totalProfit + 2, transactions.length]),
  };

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
    true,
    doneCheckpoint
  );

  return trace;
}
