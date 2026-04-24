import { parseNumberList } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type GasStationState = {
  gas: number[];
  cost: number[];
  net: number[];
  tank: number;
  total: number;
  start: number;
  currentDiff: number | null;
  result: number | null;
};

type GasStationPointers = {
  index: number | null;
  start: number | null;
};

export type GasStationTraceStep = TeachingTraceFrame & {
  state: GasStationState;
  pointers: GasStationPointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(rawGas: string, rawCost: string) {
  const gasInput = parseNumberList(rawGas);
  const costInput = parseNumberList(rawCost);
  const length = Math.min(gasInput.length, costInput.length);
  const gas = gasInput.slice(0, length);
  const cost = costInput.slice(0, length);
  const net = gas.map((value, index) => value - cost[index]);
  const trace: GasStationTraceStep[] = [];

  let index: number | null = length === 0 ? null : 0;
  let tank = 0;
  let total = 0;
  let start = 0;
  let currentDiff: number | null = null;
  let result: number | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: GasStationTraceStep["actionTone"],
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
        { label: "Tank", value: tank, tone: "cyan" },
        { label: "Total Net", value: total, tone: "green" },
        { label: "Start", value: start, tone: "purple" },
      ],
      pointerChips: [
        { label: "index", value: pointerValue(index), tone: "yellow" },
        { label: "start", value: String(start), tone: "purple" },
      ],
      done,
      state: {
        gas: [...gas],
        cost: [...cost],
        net: [...net],
        tank,
        total,
        start,
        currentDiff,
        result,
      },
      pointers: {
        index,
        start: length === 0 ? null : start,
      },
    });
  }

  pushStep(
    "Scan the circle once. total checks whether a solution exists at all, and tank tests whether the current start candidate survives to the next station.",
    "initialize",
    "slate",
    [1, 2],
    "If the running tank ever drops below zero, the current start cannot work, so the next station becomes the new candidate.",
    "The greedy invariant is: any station between the old start and the failure point also fails, so the next index is the earliest possible new candidate.",
    "Separate global feasibility from local survivability.",
    [
      "total tracks gas minus cost over the whole route.",
      "tank tracks gas minus cost since the current start candidate.",
      "A negative tank eliminates the whole current segment as a valid starting zone.",
    ]
  );

  while (index !== null && index < length) {
    currentDiff = net[index];
    total += currentDiff;
    tank += currentDiff;

    pushStep(
      `Station ${index} contributes gas ${gas[index]} and costs ${cost[index]}, so the local net is ${currentDiff}. total becomes ${total} and tank becomes ${tank}.`,
      "accumulate",
      currentDiff >= 0 ? "cyan" : "yellow",
      [3, 4, 5, 6],
      "The current station either strengthens the route from the current start or weakens it.",
      "tank is the prefix sum of net values starting at the current candidate start. total is the prefix sum over the full scan.",
      "A candidate start stays alive only while its segment sum never dips below zero.",
      [
        "Positive net creates buffer for later stations.",
        "Negative net may be okay if earlier surplus covers it.",
        "The total sum decides final existence only after the full pass.",
      ]
    );

    if (tank < 0) {
      start = index + 1;
      tank = 0;

      pushStep(
        `tank fell below zero at station ${index}, so no start in the current segment can work. Reset the candidate start to ${start} and clear tank back to 0.`,
        "reset-start",
        "red",
        [7, 8, 9],
        "Running out of gas before the next station proves the current candidate start fails.",
        "If the segment from start to i has negative sum, then every station inside that segment has an even worse prefix before reaching i + 1, so they all fail too.",
        "A negative running sum lets us discard an entire block of impossible starts at once.",
        [
          "Resetting tank forgets the failed segment.",
          "The next station is the first remaining candidate.",
          "This greedy jump is what keeps the solution linear.",
        ]
      );
    }

    index += 1;
  }

  index = null;
  currentDiff = null;
  result = length === 0 ? -1 : total >= 0 ? start : -1;

  if (length === 0) {
    pushStep(
      "No aligned stations were available, so the visualizer returns -1.",
      "done",
      "red",
      [12],
      "An empty route has no valid start.",
      "Without any stations, no feasible circuit exists.",
      "Valid input normally contains at least one station.",
      [
        "The parser trims mismatched arrays to the shared length.",
        "Here that shared length is zero.",
        "The visualizer still returns a stable result.",
      ],
      true
    );
    return trace;
  }

  if (total >= 0) {
    pushStep(
      `The total net gas is ${total}, which is enough to complete the circuit. Start index ${start} is the unique valid answer.`,
      "done",
      "green",
      [12],
      "Because the total balance is non-negative and every failed segment was discarded correctly, the surviving start works.",
      "total >= 0 guarantees existence, and the greedy resets guarantee that the final surviving candidate is the first feasible start.",
      "The last surviving candidate is valid exactly when the full route has enough gas overall.",
      [
        "The answer is unique for this problem.",
        "The scan used O(1) extra space.",
        "Every station was processed once.",
      ],
      true
    );
  } else {
    pushStep(
      `The total net gas is ${total}, so the route is globally impossible and the answer is -1.`,
      "done",
      "red",
      [12],
      "Even the best start cannot beat a negative total balance.",
      "A negative sum of all net values means no starting point can complete the circuit.",
      "Global infeasibility overrides every local candidate.",
      [
        "Reset logic can identify candidates, but total decides existence.",
        "If total is negative, every candidate eventually fails.",
        "Time complexity is still O(n).",
      ],
      true
    );
  }

  return trace;
}
