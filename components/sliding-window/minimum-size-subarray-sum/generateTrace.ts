import { parseNumberArray } from "../shared/parsers";
import { createTraceRecorder } from "../shared/trace";
import type {
  SlidingWindowState,
  SlidingWindowTraceStep,
  WindowGroup,
} from "../shared/types";

export type MinimumSizeSubarraySumTraceStep = SlidingWindowTraceStep;

function formatWindow(values: number[]) {
  return values.length === 0 ? "[]" : `[${values.join(", ")}]`;
}

function buildGroups(
  nums: number[],
  left: number,
  right: number,
  bestStart: number | null,
  bestEnd: number | null
): WindowGroup[] {
  const current =
    right >= left && left >= 0 ? nums.slice(left, right + 1) : [];
  const best =
    bestStart !== null && bestEnd !== null
      ? nums.slice(bestStart, bestEnd + 1)
      : [];

  return [
    {
      id: "group-current",
      title: "Current Window",
      subtitle: "the live sum under the pointers",
      items: current.map((value) => String(value)),
      tone: "cyan",
    },
    {
      id: "group-best",
      title: "Best Window",
      subtitle: "smallest valid answer seen so far",
      items: best.map((value) => String(value)),
      tone: "yellow",
    },
  ];
}

export function generateTrace(
  inputs: Record<string, string>
): MinimumSizeSubarraySumTraceStep[] {
  const nums = parseNumberArray(inputs.nums ?? "");
  const target = Number(inputs.target ?? 0);

  let left = 0;
  let currentSum = 0;
  let bestLength = Number.POSITIVE_INFINITY;
  let bestStart: number | null = null;
  let bestEnd: number | null = null;

  const initialState: SlidingWindowState = {
    hero:
      "Because all numbers are positive, the window sum only increases when the right edge expands and only decreases when the left edge contracts.",
    primaryLabel: "Array Rail",
    primaryItems: [],
    primarySpan: {
      start: null,
      end: null,
      tone: "emerald",
      label: "Live window",
    },
    bestSpan: {
      start: null,
      end: null,
      tone: "yellow",
      label: "Best answer",
    },
    ledgerLabel: "Window Contribution Ledger",
    ledgerEntries: [],
    groupsLabel: "Window Comparison",
    groups: [],
    stats: [],
    resultLabel: "minimal length",
    resultValue: "building",
    resultTone: "emerald",
    summary:
      "Positive values guarantee a monotonic window: when the sum is too small, only moving right can help; when it is large enough, moving left is the only way to shrink safely.",
    footer:
      "The positivity constraint is the reason this sliding-window solution works. Without it, shrinking the left edge would not be monotonic.",
  };

  const { state, trace, pointers, pushStep } = createTraceRecorder(initialState);

  function syncState(right: number | null) {
    const activeRight = right ?? -1;
    const activeWindow =
      activeRight >= left && left >= 0 ? nums.slice(left, activeRight + 1) : [];

    state.hero =
      activeRight >= left && activeWindow.length > 0
        ? `Window ${formatWindow(activeWindow)} has sum ${currentSum}. ${
            currentSum >= target
              ? "It is valid, so the left edge can try to shrink it."
              : "It is still below the target, so the right edge must keep expanding."
          }`
        : "The next expansion will add one more positive number into the live window.";

    state.primaryItems = nums.map((value, index) => ({
      id: `num-${index}`,
      label: `${value}`,
      sublabel: `index ${index}`,
      tone:
        index === pointers.right
          ? "emerald"
          : index === pointers.left
          ? "cyan"
          : bestStart !== null && bestEnd !== null && index >= bestStart && index <= bestEnd
          ? "yellow"
          : activeRight >= left && index >= left && index <= activeRight
          ? "purple"
          : "slate",
      tags:
        index === pointers.left && index === pointers.right
          ? ["L", "R"]
          : index === pointers.left
          ? ["L"]
          : index === pointers.right
          ? ["R"]
          : bestStart !== null && bestEnd !== null && index >= bestStart && index <= bestEnd
          ? ["best"]
          : activeRight >= left && index >= left && index <= activeRight
          ? ["live"]
          : undefined,
    }));

    state.primarySpan =
      activeRight >= left && activeRight >= 0
        ? {
            start: left,
            end: activeRight,
            tone: "emerald",
            label: `sum ${currentSum}`,
          }
        : {
            start: null,
            end: null,
            tone: "emerald",
            label: "Live window",
          };

    state.bestSpan =
      bestStart !== null && bestEnd !== null
        ? {
            start: bestStart,
            end: bestEnd,
            tone: "yellow",
            label: `best len ${bestLength}`,
          }
        : {
            start: null,
            end: null,
            tone: "yellow",
            label: "Best answer",
          };

    let running = 0;
    state.ledgerEntries = activeWindow.map((value, offset) => {
      const index = left + offset;
      running += value;
      return {
        id: `entry-${index}`,
        key: `nums[${index}]`,
        need: `>= ${target}`,
        have: `${value}`,
        delta: `partial ${running}`,
        note:
          index === left
            ? "left boundary contribution"
            : index === activeRight
            ? "right boundary contribution"
            : "middle contribution",
        tone:
          index === pointers.left
            ? "cyan"
            : index === pointers.right
            ? "emerald"
            : "purple",
      };
    });

    state.groups = buildGroups(nums, left, activeRight, bestStart, bestEnd);
    state.stats = [
      { label: "Target", value: `${target}`, tone: "yellow" },
      { label: "Window Sum", value: `${currentSum}`, tone: currentSum >= target ? "emerald" : "cyan" },
      {
        label: "Window Length",
        value:
          activeRight >= left && activeRight >= 0
            ? `${activeRight - left + 1}`
            : "0",
        tone: "cyan",
      },
      {
        label: "Best Length",
        value: Number.isFinite(bestLength) ? `${bestLength}` : "none",
        tone: Number.isFinite(bestLength) ? "yellow" : "slate",
      },
    ];

    state.resultValue = Number.isFinite(bestLength) ? `${bestLength}` : "building";
    state.resultTone = Number.isFinite(bestLength) ? "yellow" : "emerald";
    state.summary = Number.isFinite(bestLength)
      ? `Best valid window so far is ${formatWindow(
          nums.slice(bestStart ?? 0, (bestEnd ?? -1) + 1)
        )} with length ${bestLength}.`
      : "No valid window has reached the target yet.";
  }

  syncState(null);

  pushStep({
    action:
      "Parse the positive array and target, then prepare a live window that will expand to the right and shrink from the left.",
    actionKind: "parsed",
    codeLines: [1, 2],
    explanationBeginner:
      "Because all numbers are positive, the window gets bigger in only one direction when we add elements and smaller in only one direction when we remove them.",
    explanationExpert:
      "Positivity gives the sum monotonicity required for a valid two-pointer shrink-and-expand strategy.",
    done: false,
  });

  for (let right = 0; right < nums.length; right += 1) {
    currentSum += nums[right];
    pointers.left = left;
    pointers.right = right;
    pointers.focusKey = `add nums[${right}]`;
    pointers.focusValue = `${nums[right]}`;
    pointers.activeEntryId = `entry-${right}`;
    syncState(right);

    pushStep({
      action: `Expand the window to the right by including nums[${right}] = ${nums[right]}, raising the sum to ${currentSum}.`,
      actionKind: "expand-window",
      codeLines: [3, 4],
      explanationBeginner:
        "The right edge moves first so the window can accumulate enough total to possibly hit the target.",
      explanationExpert:
        "The outer loop grows the window until the sum becomes feasible for contraction.",
      done: false,
    });

    while (currentSum >= target) {
      pointers.left = left;
      pointers.right = right;
      pointers.focusKey = "window valid";
      pointers.focusValue = `${currentSum} >= ${target}`;
      pointers.activeEntryId = `entry-${left}`;
      syncState(right);

      pushStep({
        action: `The live sum ${currentSum} now meets the target ${target}, so the window is valid and can be tested as a candidate answer.`,
        actionKind: "window-valid",
        codeLines: [5],
        explanationBeginner:
          "Now that the target is reached, the algorithm tries to make the window as short as possible without losing validity.",
        explanationExpert:
          "Once feasible, the invariant shifts: contract greedily from the left while feasibility holds.",
        done: false,
      });

      const windowLength = right - left + 1;
      if (windowLength < bestLength) {
        bestLength = windowLength;
        bestStart = left;
        bestEnd = right;
        pointers.activeGroupId = "group-best";
        syncState(right);

        pushStep({
          action: `Update the best answer because the valid window length ${windowLength} is smaller than every valid window seen earlier.`,
          actionKind: "update-best",
          codeLines: [6],
          explanationBeginner:
            "A shorter valid window is always better, so it becomes the new answer immediately.",
          explanationExpert:
            "The optimum is updated only at feasibility points, and only when strict improvement occurs.",
          done: false,
        });
      }

      const removed = nums[left];
      currentSum -= removed;
      left += 1;
      pointers.left = left;
      pointers.right = right;
      pointers.focusKey = `remove nums[${left - 1}]`;
      pointers.focusValue = `${removed}`;
      pointers.activeEntryId = `entry-${left - 1}`;
      syncState(right);

      pushStep({
        action: `Shrink from the left by removing ${removed}, which lowers the sum to ${currentSum} and advances left to index ${left}.`,
        actionKind: "shrink-window",
        codeLines: [7, 8],
        explanationBeginner:
          "The window is already valid, so removing from the left is the only way to test whether an even smaller valid window exists.",
        explanationExpert:
          "Greedy contraction is safe because all values are positive; removing elements cannot increase the sum.",
        done: false,
      });
    }
  }

  pointers.left = null;
  pointers.right = null;
  pointers.focusKey = null;
  pointers.focusValue = null;
  pointers.activeEntryId = null;
  pointers.activeGroupId = null;
  state.resultValue = Number.isFinite(bestLength) ? `${bestLength}` : "0";
  state.resultTone = Number.isFinite(bestLength) ? "yellow" : "rose";
  state.summary = Number.isFinite(bestLength)
    ? `The minimum valid window is ${formatWindow(
        nums.slice(bestStart ?? 0, (bestEnd ?? -1) + 1)
      )}, so the answer is ${bestLength}.`
    : "No subarray ever reached the target, so the answer is 0.";
  syncState(nums.length - 1);
  state.resultValue = Number.isFinite(bestLength) ? `${bestLength}` : "0";
  state.resultTone = Number.isFinite(bestLength) ? "yellow" : "rose";

  pushStep({
    action: Number.isFinite(bestLength)
      ? `The scan is complete. The smallest valid subarray length is ${bestLength}.`
      : "The scan is complete, and no subarray reached the target, so the answer is 0.",
    actionKind: "done",
    codeLines: [11],
    explanationBeginner: Number.isFinite(bestLength)
      ? "The best short valid window survived every later comparison, so it becomes the final answer."
      : "Even the largest windows were not enough, so no solution exists for this input.",
    explanationExpert: Number.isFinite(bestLength)
      ? "The greedy contraction process guarantees that every feasible right boundary tested its minimal feasible left boundary."
      : "No feasible window was ever discovered, so the sentinel best value correctly maps to output 0.",
    done: true,
  });

  return trace;
}
