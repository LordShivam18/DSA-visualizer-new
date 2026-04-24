import { parseNumberList } from "../shared/parsers";
import type { TeachingTraceFrame } from "../shared/types";

type JumpGameIIState = {
  nums: number[];
  farthest: number;
  currentEnd: number;
  jumps: number;
  reachFromCurrent: number | null;
  result: number | null;
};

type JumpGameIIPointers = {
  index: number | null;
  currentEnd: number | null;
};

export type JumpGameIITraceStep = TeachingTraceFrame & {
  state: JumpGameIIState;
  pointers: JumpGameIIPointers;
};

function pointerValue(value: number | null) {
  return value === null ? "done" : String(value);
}

export function generateTrace(rawNums: string) {
  const nums = parseNumberList(rawNums);
  const trace: JumpGameIITraceStep[] = [];

  let index: number | null = 0;
  let farthest = 0;
  let currentEnd = 0;
  let jumps = nums.length <= 1 ? 0 : 0;
  let reachFromCurrent: number | null = null;
  let result: number | null = null;

  function pushStep(
    action: string,
    actionKind: string,
    actionTone: JumpGameIITraceStep["actionTone"],
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
        { label: "Jumps", value: jumps, tone: "green" },
        { label: "Current End", value: currentEnd, tone: "purple" },
        { label: "Farthest", value: farthest, tone: "cyan" },
      ],
      pointerChips: [
        { label: "index", value: pointerValue(index), tone: "yellow" },
        { label: "window end", value: String(currentEnd), tone: "purple" },
        { label: "farthest", value: String(farthest), tone: "cyan" },
      ],
      done,
      state: {
        nums: [...nums],
        farthest,
        currentEnd,
        jumps,
        reachFromCurrent,
        result,
      },
      pointers: {
        index,
        currentEnd,
      },
    });
  }

  pushStep(
    "Treat the scan like BFS by layers. currentEnd is the right edge of the current jump window, and farthest collects the next window.",
    "initialize",
    "slate",
    [1, 2, 3],
    "We do not choose the next jump immediately. We first learn how far the entire current window can reach.",
    "The greedy invariant is: currentEnd bounds all indices reachable with the current number of jumps; farthest accumulates the next layer.",
    "A new jump is committed only when the current window is fully scanned.",
    [
      "This is a greedy BFS over array positions.",
      "jumps counts how many windows have been committed.",
      "farthest stores the next layer boundary.",
    ]
  );

  while (index !== null && index < Math.max(nums.length - 1, 0)) {
    reachFromCurrent = index + nums[index];

    pushStep(
      `Index ${index} can reach ${reachFromCurrent}. Compare it with the current farthest boundary ${farthest}.`,
      "inspect",
      "yellow",
      [4, 5],
      "The current index contributes one possible extension for the next jump window.",
      "Each index inside the current BFS layer can expand the boundary of the next layer.",
      "The next jump should cover as far as any index in the current window can reach.",
      [
        "Only indices before the last index need scanning.",
        "The best next boundary is the maximum reach among the current layer.",
        "Greedy commitment waits until the window end.",
      ]
    );

    if (reachFromCurrent > farthest) {
      farthest = reachFromCurrent;
      pushStep(
        `Update farthest to ${farthest}.`,
        "extend",
        "cyan",
        [5],
        "This index expands the next jump window.",
        "farthest is the maximum reach over all indices processed in the current layer.",
        "The next layer boundary can only move rightward.",
        [
          "This does not spend a jump yet.",
          "The algorithm is still scanning the current layer.",
          "A later index in the same layer could extend it even more.",
        ]
      );
    }

    if (index === currentEnd) {
      jumps += 1;
      currentEnd = farthest;

      pushStep(
        `The current layer ends at index ${index}, so commit jump ${jumps} and move the window end to ${currentEnd}.`,
        "commit-jump",
        "green",
        [6, 7],
        "Once the current jump window is exhausted, one more jump is required to enter the next window.",
        "Reaching i == currentEnd means the whole current layer has been processed, so the greedy choice is to commit the farthest next boundary discovered.",
        "Each committed jump advances the BFS layer to currentEnd = farthest.",
        [
          "The jump count increases exactly when the window closes.",
          "The next window may cover many indices at once.",
          "This is why the algorithm returns the minimum number of jumps.",
        ]
      );

      if (currentEnd >= nums.length - 1) {
        result = jumps;
        index = null;
        pushStep(
          `The new window reaches the last index, so the minimum jumps required is ${jumps}.`,
          "done",
          "green",
          [9],
          "The destination is inside the newly committed window, so the answer is final.",
          "As soon as currentEnd reaches n - 1, the BFS depth stored in jumps is optimal.",
          "The first window to cover the last index gives the minimum jumps.",
          [
            "The scan can stop immediately.",
            "Later indices belong to a deeper layer and would only increase jumps.",
            "Time complexity stays O(n).",
          ],
          true
        );
        return trace;
      }
    }

    index += 1;
  }

  result = jumps;
  index = null;

  pushStep(
    `The scan is complete. The minimum jumps required is ${jumps}.`,
    "done",
    "green",
    [9],
    "The stored jump count is the answer.",
    "Each committed layer corresponds to one jump, so jumps equals the shortest path depth.",
    "The greedy layer expansion has already found the optimal answer.",
    [
      "Time complexity is O(n).",
      "Extra space is O(1).",
      "The problem guarantees the last index is reachable.",
    ],
    true
  );

  return trace;
}
