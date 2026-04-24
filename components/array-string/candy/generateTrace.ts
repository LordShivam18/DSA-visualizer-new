import { parseNumberList } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type CandyState = {
  ratings: number[];
  candies: number[];
  phase: "left" | "right" | "done";
  neighborIndex: number | null;
  requiredCandy: number | null;
  result: number | null;
};

type CandyPointers = {
  index: number | null;
  neighborIndex: number | null;
};

export type CandyTraceStep = TeachingTraceFrame & {
  state: CandyState;
  pointers: CandyPointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(rawRatings: string) {
  const ratings = parseNumberList(rawRatings);
  const candies = new Array(ratings.length).fill(1);
  const trace: CandyTraceStep[] = [];

  let phase: CandyState["phase"] = "left";
  let index: number | null = ratings.length <= 1 ? null : 1;
  let neighborIndex: number | null = null;
  let requiredCandy: number | null = null;
  let result: number | null = null;

  function currentTotal() {
    return candies.reduce((sum, value) => sum + value, 0);
  }

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: CandyTraceStep["actionTone"],
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
        { label: "Phase", value: phase, tone: "purple" },
        { label: "Visible Total", value: currentTotal(), tone: "green" },
        {
          label: "Required Candy",
          value: requiredCandy ?? "n/a",
          tone: "cyan",
        },
      ],
      pointerChips: [
        { label: "index", value: pointerValue(index), tone: "yellow" },
        {
          label: "neighbor",
          value: pointerValue(neighborIndex),
          tone: "purple",
        },
        { label: "phase", value: phase, tone: "purple" },
      ],
      done,
      state: {
        ratings: [...ratings],
        candies: [...candies],
        phase,
        neighborIndex,
        requiredCandy,
        result,
      },
      pointers: {
        index,
        neighborIndex,
      },
    });
  }

  pushStep(
    "Start by giving every child one candy. That satisfies the minimum requirement before we enforce rating comparisons.",
    "initialize",
    "slate",
    [1, 2, 3],
    "Everyone gets one candy first because every child must receive at least one.",
    "The baseline all-ones distribution is the minimal feasible starting point before local inequalities are enforced.",
    "Separate the hard constraint into a base assignment plus directional repairs.",
    [
      "The left pass fixes rising slopes from left to right.",
      "The right pass fixes rising slopes from right to left.",
      "Using max in the second pass preserves constraints already satisfied by the first pass.",
    ]
  );

  while (index !== null && index < ratings.length) {
    neighborIndex = index - 1;
    requiredCandy = null;

    if (ratings[index] > ratings[neighborIndex]) {
      requiredCandy = candies[neighborIndex] + 1;
      candies[index] = requiredCandy;

      pushStep(
        `ratings[${index}] = ${ratings[index]} is greater than ratings[${neighborIndex}] = ${ratings[neighborIndex]}, so candies[${index}] becomes ${requiredCandy}.`,
        "left-rise",
        "cyan",
        [4, 5, 6],
        "A child with a higher rating than the left neighbor must get one more candy.",
        "After the left pass, every increasing left-to-right slope satisfies candies[i] > candies[i - 1].",
        "The left pass only reacts to climbs when looking back one position.",
        [
          "Only rising edges need an update here.",
          "Flat or falling ratings can stay at one for now.",
          "This pass does not yet know about right-side constraints.",
        ]
      );
    } else {
      pushStep(
        `ratings[${index}] = ${ratings[index]} is not greater than ratings[${neighborIndex}] = ${ratings[neighborIndex]}, so candies[${index}] stays at ${candies[index]}.`,
        "left-keep",
        "yellow",
        [4, 5],
        "No extra candy is needed from the left-side rule because this child is not higher than the left neighbor.",
        "When ratings[i] <= ratings[i - 1], the left inequality is already satisfied without increasing candies[i].",
        "Only strict increases force extra candy in the left pass.",
        [
          "Keeping the value low helps minimize the total.",
          "Any missing right-side correction will be handled later.",
          "The algorithm never increases a cell unless a rule demands it.",
        ]
      );
    }

    index += 1;
  }

  phase = "right";
  index = ratings.length <= 1 ? null : ratings.length - 2;
  neighborIndex = ratings.length <= 1 ? null : ratings.length - 1;
  requiredCandy = null;

  pushStep(
    "The left pass is done. Sweep back from the right so descending slopes also satisfy the higher-rating rule.",
    "switch-pass",
    "purple",
    [9],
    "Now we compare each child with the neighbor on the right.",
    "The right pass enforces candies[i] > candies[i + 1] on descending slopes while preserving previous left-pass work via max.",
    "A second directional pass completes the local constraints in the opposite direction.",
    [
      "Descending runs are invisible to the left pass.",
      "The right pass only increases values when necessary.",
      "Taking max keeps both directional constraints consistent.",
    ]
  );

  while (index !== null && index >= 0) {
    neighborIndex = index + 1;
    requiredCandy = null;

    if (ratings[index] > ratings[neighborIndex]) {
      const before = candies[index];
      const required = candies[neighborIndex] + 1;
      requiredCandy = required;
      candies[index] = Math.max(candies[index], required);

      pushStep(
        `ratings[${index}] = ${ratings[index]} is greater than ratings[${neighborIndex}] = ${ratings[neighborIndex]}, so candies[${index}] must be at least ${requiredCandy}. It changes from ${before} to ${candies[index]}.`,
        "right-balance",
        "green",
        [9, 10, 11],
        "A higher-rated child on the left must outrank the right neighbor too, so we raise the candy count if needed.",
        "Using max merges the right-side constraint with any stronger value already assigned by the left pass.",
        "The second pass repairs descending slopes without breaking ascending slopes already fixed earlier.",
        [
          "Sometimes the left pass already gave enough candies.",
          "Sometimes the value must increase to satisfy the right-side rule.",
          "This is why the second pass uses max instead of assignment.",
        ]
      );
    } else {
      pushStep(
        `ratings[${index}] = ${ratings[index]} is not greater than ratings[${neighborIndex}] = ${ratings[neighborIndex]}, so the current candy count ${candies[index]} already works from the right.`,
        "right-keep",
        "yellow",
        [9, 10],
        "No right-side increase is needed here.",
        "When ratings[i] <= ratings[i + 1], the right inequality is already satisfied with the existing candies[i].",
        "Only strict descents force extra candy in the right pass.",
        [
          "Keeping values unchanged preserves the minimum total.",
          "The right pass is only a correction layer.",
          "All required increases have local justification.",
        ]
      );
    }

    index -= 1;
  }

  phase = "done";
  index = null;
  neighborIndex = null;
  requiredCandy = null;
  result = currentTotal();

  pushStep(
    `Both passes are complete. The minimum valid candy distribution totals ${result}.`,
    "done",
    "green",
    [14],
    "Every local rule now holds in both directions, and the total is as small as possible.",
    "The two directional constraints are independent local inequalities, so satisfying them with minimal upward corrections yields the global optimum.",
    "Baseline ones plus minimal directional repairs produce the minimum distribution.",
    [
      "Time complexity is O(n).",
      "Extra space is O(n) for the candies array.",
      "Each child is touched in at most two linear passes.",
    ],
    true
  );

  return trace;
}
