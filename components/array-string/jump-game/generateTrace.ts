import { parseNumberList } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type JumpGameState = {
  nums: number[];
  maxReach: number;
  reachFromCurrent: number | null;
  result: boolean | null;
};

type JumpGamePointers = {
  index: number | null;
  maxReach: number | null;
};

export type JumpGameTraceStep = TeachingTraceFrame & {
  state: JumpGameState;
  pointers: JumpGamePointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(rawNums: string) {
  const nums = parseNumberList(rawNums);
  const trace: JumpGameTraceStep[] = [];

  let index: number | null = 0;
  let maxReach = 0;
  let reachFromCurrent: number | null = null;
  let result: boolean | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: JumpGameTraceStep["actionTone"],
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
        { label: "Index", value: pointerValue(index), tone: "cyan" },
        { label: "Max Reach", value: maxReach, tone: "green" },
        { label: "Current Reach", value: reachFromCurrent ?? "n/a", tone: "purple" },
      ],
      pointerChips: [
        { label: "index", value: pointerValue(index), tone: "cyan" },
        { label: "maxReach", value: String(maxReach), tone: "green" },
      ],
      done,
      state: {
        nums: [...nums],
        maxReach,
        reachFromCurrent,
        result,
      },
      pointers: {
        index,
        maxReach,
      },
    });
  }

  pushStep(
    "Start at index 0 with maxReach = 0. Every visited index can try to push the frontier farther right.",
    "initialize",
    "slate",
    [1, 2],
    "The algorithm only needs to know the farthest reachable index so far.",
    "If the scan never falls behind the farthest frontier, then the last index is reachable exactly when maxReach reaches it.",
    "maxReach summarizes all earlier jumps in one number.",
    [
      "Each index is useful only if it lies within the current frontier.",
      "A farther reach can rescue future positions.",
      "If the scan reaches an index beyond maxReach, the path is blocked.",
    ]
  );

  while (index !== null && index < nums.length) {
    if (index > maxReach) {
      result = false;
      pushStep(
        `Index ${index} is beyond maxReach ${maxReach}, so the path is blocked before reaching the end.`,
        "stuck",
        "red",
        [4],
        "You cannot stand on this index, so no more jumps are possible.",
        "Encountering i > maxReach violates the traversal invariant and proves the last index is unreachable.",
        "The scan must always stay inside the current reachable frontier.",
        [
          "No later index can be reached either.",
          "The algorithm can stop immediately.",
          "This is the only failure condition in the greedy scan.",
        ],
        true
      );
      return trace;
    }

    reachFromCurrent = index + nums[index];
    pushStep(
      `From index ${index}, jump length ${nums[index]} can reach as far as ${reachFromCurrent}.`,
      "inspect",
      "yellow",
      [3, 5],
      "The current cell contributes one candidate frontier.",
      "The greedy scan compares maxReach with i + nums[i] to see whether the reachable frontier expands.",
      "Each index offers a local reach candidate for the global frontier.",
      [
        "The index is valid because it does not exceed maxReach.",
        "A larger reach extends the frontier.",
        "A smaller reach changes nothing.",
      ]
    );

    if (reachFromCurrent > maxReach) {
      maxReach = reachFromCurrent;
      pushStep(
        `Extend maxReach to ${maxReach}.`,
        "extend",
        "green",
        [5],
        "This jump pushes the reachable frontier farther to the right.",
        "maxReach keeps the best frontier discovered anywhere in the processed prefix.",
        "The frontier only moves rightward, never leftward.",
        [
          "A larger frontier may unlock future indices.",
          "The algorithm never needs to remember which earlier index caused it.",
          "Only the farthest boundary matters.",
        ]
      );
    } else {
      pushStep(
        `maxReach stays at ${maxReach} because the current jump does not go farther.`,
        "hold",
        "cyan",
        [5],
        "This index is reachable, but it does not improve the frontier.",
        "The greedy invariant is unchanged when i + nums[i] <= maxReach.",
        "Earlier jumps already cover everything this index can cover.",
        [
          "The scan still continues to the next index.",
          "A later index may yet extend the frontier.",
          "No backtracking is required.",
        ]
      );
    }

    if (maxReach >= nums.length - 1) {
      result = true;
      pushStep(
        `maxReach = ${maxReach} reaches the last index, so the answer is true.`,
        "done",
        "green",
        [7],
        "Once the frontier touches the final index, the path is guaranteed.",
        "The success condition is maxReach >= n - 1.",
        "No later scan step can invalidate reachability after the last index is covered.",
        [
          "The algorithm can stop early.",
          "The last index is now inside the reachable frontier.",
          "Time complexity remains O(n).",
        ],
        true
      );
      return trace;
    }

    index += 1;
  }

  index = null;
  result = nums.length === 0;

  pushStep(
    `The scan finished. The answer is ${String(result)}.`,
    "done",
    result ? "green" : "red",
    [7],
    "The final reachability result depends on whether the frontier covered the last index.",
    "The scan ends only after testing every reachable position.",
    "Reachability is fully summarized by the final maxReach value.",
    [
      "An empty array is treated as trivially reachable here.",
      "The greedy proof depends on the monotone frontier.",
      "No dynamic programming table is needed.",
    ],
    true
  );

  return trace;
}
