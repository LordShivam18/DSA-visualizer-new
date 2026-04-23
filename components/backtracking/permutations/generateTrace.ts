export type PermutationFrame = {
  depth: number;
  path: number[];
  usedIndices: number[];
  status: "active" | "complete" | "backtracking";
};

export type PermutationsState = {
  rawInput: string;
  nums: number[];
  path: number[];
  used: boolean[];
  results: number[][];
  stack: PermutationFrame[];
  exploredChoices: number;
};

export type PermutationsPointers = {
  candidateIndex: number | null;
  candidateValue: number | null;
  depth: number;
};

export type PermutationsActionKind =
  | "parsed"
  | "empty"
  | "enter-depth"
  | "choose-number"
  | "complete"
  | "backtrack"
  | "done";

export type PermutationsTraceStep = {
  step: number;
  action: string;
  actionKind: PermutationsActionKind;
  codeLines: number[];
  state: PermutationsState;
  pointers: PermutationsPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function parseNumberArray(rawInput: string) {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    if (Array.isArray(parsed)) {
      return parsed
        .map((value) => (typeof value === "number" ? value : Number(value)))
        .filter((value) => Number.isFinite(value));
    }
  } catch {
    // Fallback below.
  }

  return trimmed
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(",")
    .map((piece) => Number(piece.trim()))
    .filter((value) => Number.isFinite(value));
}

function cloneResults(results: number[][]) {
  return results.map((entry) => [...entry]);
}

function cloneStack(stack: PermutationFrame[]) {
  return stack.map((frame) => ({
    ...frame,
    path: [...frame.path],
    usedIndices: [...frame.usedIndices],
  }));
}

export function parsePermutationsInput(rawInput: string) {
  return parseNumberArray(rawInput);
}

export function formatPermutationResults(values: number[][]) {
  if (values.length === 0) {
    return "[]";
  }
  return `[${values.map((value) => `[${value.join(",")}]`).join(", ")}]`;
}

export function generateTrace(rawInput: string): PermutationsTraceStep[] {
  const nums = parsePermutationsInput(rawInput);
  const used = Array.from({ length: nums.length }, () => false);
  const path: number[] = [];
  const results: number[][] = [];
  const stack: PermutationFrame[] = [];
  const trace: PermutationsTraceStep[] = [];

  let exploredChoices = 0;
  let candidateIndex: number | null = null;
  let candidateValue: number | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: PermutationsActionKind;
    codeLines: number[];
    done: boolean;
    explanationBeginner: string;
    explanationExpert: string;
  }) {
    trace.push({
      step: trace.length,
      action,
      actionKind,
      codeLines,
      state: {
        rawInput,
        nums: [...nums],
        path: [...path],
        used: [...used],
        results: cloneResults(results),
        stack: cloneStack(stack),
        exploredChoices,
      },
      pointers: {
        candidateIndex,
        candidateValue,
        depth: stack.length,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      nums.length === 0
        ? "Parse the input. There are no numbers to arrange."
        : `Parse the input array [${nums.join(", ")}] and prepare the used-mask for slot filling.`,
    actionKind: "parsed",
    codeLines: [1, 2, 3, 4, 5],
    done: false,
    explanationBeginner:
      nums.length === 0
        ? "Without numbers, there is no permutation to build."
        : "Permutations fill one slot at a time, and the used array remembers which numbers are already taken.",
    explanationExpert:
      nums.length === 0
        ? "The empty-input edge case stops before DFS."
        : "The recursion state is the current path plus a boolean mask over indices.",
  });

  if (nums.length === 0) {
    pushStep({
      action: "The input array is empty, so the visualizer returns no permutations.",
      actionKind: "empty",
      codeLines: [1, 20],
      done: true,
      explanationBeginner:
        "There are no values to place into any slots.",
      explanationExpert:
        "No branching occurs because the search space is empty.",
    });

    return trace;
  }

  function dfs() {
    const frame: PermutationFrame = {
      depth: stack.length,
      path: [...path],
      usedIndices: used
        .map((flag, index) => (flag ? index : -1))
        .filter((index) => index >= 0),
      status: "active",
    };
    stack.push(frame);
    candidateIndex = null;
    candidateValue = null;

    pushStep({
      action: `Enter depth ${path.length}. ${nums.length - path.length} slot${nums.length - path.length === 1 ? "" : "s"} remain to be filled.`,
      actionKind: "enter-depth",
      codeLines: [5, 6, 10],
      done: false,
      explanationBeginner:
        "The recursion is about to choose which unused number should go in the next open position.",
      explanationExpert:
        "Every frame iterates over all indices and only branches on entries where `used[i]` is false.",
    });

    if (path.length === nums.length) {
      results.push([...path]);
      frame.status = "complete";

      pushStep({
        action: `All slots are filled, so [${path.join(", ")}] is stored as one complete permutation.`,
        actionKind: "complete",
        codeLines: [6, 7, 8],
        done: false,
        explanationBeginner:
          "A permutation is finished only when every position already contains a number.",
        explanationExpert:
          "The base case copies the full arrangement into the answer vector when `path.size() == nums.size()`.",
      });

      stack.pop();
      candidateIndex = null;
      candidateValue = null;
      return;
    }

    for (let index = 0; index < nums.length; index += 1) {
      if (used[index]) {
        continue;
      }

      exploredChoices += 1;
      used[index] = true;
      path.push(nums[index]);
      frame.path = [...path];
      frame.usedIndices = used
        .map((flag, innerIndex) => (flag ? innerIndex : -1))
        .filter((innerIndex) => innerIndex >= 0);
      candidateIndex = index;
      candidateValue = nums[index];

      pushStep({
        action: `Choose value ${nums[index]} from index ${index}. The partial permutation becomes [${path.join(", ")}].`,
        actionKind: "choose-number",
        codeLines: [10, 11, 12, 13, 14],
        done: false,
        explanationBeginner:
          "An unused number is placed into the next slot, and that number is marked as taken.",
        explanationExpert:
          "The mask flips before recursion so the same index cannot be chosen twice on one branch.",
      });

      dfs();

      const removed = path.pop() ?? nums[index];
      used[index] = false;
      frame.status = "backtracking";
      frame.path = [...path];
      frame.usedIndices = used
        .map((flag, innerIndex) => (flag ? innerIndex : -1))
        .filter((innerIndex) => innerIndex >= 0);
      candidateIndex = index;
      candidateValue = removed;

      pushStep({
        action: `Backtrack by removing ${removed} and clearing index ${index} in the used-mask.`,
        actionKind: "backtrack",
        codeLines: [15, 16],
        done: false,
        explanationBeginner:
          "Undoing the placement frees that number so it can appear in a different position on another branch.",
        explanationExpert:
          "The path pop and mask reset restore the exact caller state before the loop advances.",
      });

      frame.status = "active";
    }

    stack.pop();
    candidateIndex = null;
    candidateValue = null;
  }

  dfs();

  pushStep({
    action: `All branches are done. The array has ${results.length} distinct permutations.`,
    actionKind: "done",
    codeLines: [19, 20],
    done: true,
    explanationBeginner:
      "The answer list now contains every valid ordering of the numbers.",
    explanationExpert:
      "The DFS explores each unused index choice at each depth, yielding O(n * n!) time in the worst case.",
  });

  return trace;
}
