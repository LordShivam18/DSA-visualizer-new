export type CombinationFrame = {
  depth: number;
  start: number;
  path: number[];
  status: "active" | "complete" | "backtracking";
};

export type CombinationsState = {
  rawN: string;
  rawK: string;
  n: number;
  k: number;
  path: number[];
  results: number[][];
  stack: CombinationFrame[];
  exploredChoices: number;
  candidateWindow: number[];
};

export type CombinationsPointers = {
  start: number | null;
  candidate: number | null;
  depth: number;
};

export type CombinationsActionKind =
  | "parsed"
  | "invalid"
  | "enter-depth"
  | "choose-number"
  | "complete"
  | "backtrack"
  | "done";

export type CombinationsTraceStep = {
  step: number;
  action: string;
  actionKind: CombinationsActionKind;
  codeLines: number[];
  state: CombinationsState;
  pointers: CombinationsPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function parsePositiveInt(rawValue: string, fallback: number) {
  const trimmed = rawValue.trim();
  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed);
  }
  return fallback;
}

function cloneStack(stack: CombinationFrame[]) {
  return stack.map((frame) => ({
    ...frame,
    path: [...frame.path],
  }));
}

function cloneResults(results: number[][]) {
  return results.map((entry) => [...entry]);
}

export function parseCombinationsInput(rawN: string, rawK: string) {
  const n = Math.max(0, parsePositiveInt(rawN, 4));
  const k = Math.max(0, parsePositiveInt(rawK, 2));
  return { n, k };
}

export function formatCombinationResults(values: number[][]) {
  if (values.length === 0) {
    return "[]";
  }

  return `[${values.map((value) => `[${value.join(",")}]`).join(", ")}]`;
}

export function generateTrace(rawN: string, rawK: string): CombinationsTraceStep[] {
  const { n, k } = parseCombinationsInput(rawN, rawK);
  const trace: CombinationsTraceStep[] = [];
  const stack: CombinationFrame[] = [];
  const path: number[] = [];
  const results: number[][] = [];

  let exploredChoices = 0;
  let start: number | null = 1;
  let candidate: number | null = null;

  function buildCandidateWindow(currentStart: number | null) {
    if (currentStart === null || currentStart > n) {
      return [];
    }
    return Array.from({ length: n - currentStart + 1 }, (_, index) => currentStart + index);
  }

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: CombinationsActionKind;
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
        rawN,
        rawK,
        n,
        k,
        path: [...path],
        results: cloneResults(results),
        stack: cloneStack(stack),
        exploredChoices,
        candidateWindow: buildCandidateWindow(start),
      },
      pointers: {
        start,
        candidate,
        depth: stack.length,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action: `Parse n = ${n} and k = ${k}, then prepare the subset builder.`,
    actionKind: "parsed",
    codeLines: [1, 2, 3, 4],
    done: false,
    explanationBeginner:
      "The algorithm will grow one combination step by step until it contains exactly k numbers.",
    explanationExpert:
      "The recursion state is a strictly increasing path plus the next valid start value.",
  });

  if (k === 0 || n === 0 || k > n) {
    start = null;
    candidate = null;

    if (k === 0) {
      results.push([]);
    }

    pushStep({
      action:
        k === 0
          ? "A size-0 combination is just the empty subset."
          : `The search space is invalid for n = ${n} and k = ${k}, so no combinations can be formed.`,
      actionKind: "invalid",
      codeLines: [5, 6, 7, 16],
      done: true,
      explanationBeginner:
        k === 0
          ? "Choosing nothing still counts as one valid combination."
          : "You cannot choose more numbers than exist in the range.",
      explanationExpert:
        k === 0
          ? "The empty path already satisfies the target size."
          : "When `k > n`, the recursion has no feasible branch.",
    });

    return trace;
  }

  function dfs(currentStart: number) {
    start = currentStart;
    candidate = null;

    const frame: CombinationFrame = {
      depth: stack.length,
      start: currentStart,
      path: [...path],
      status: "active",
    };
    stack.push(frame);

    pushStep({
      action: `Enter depth ${path.length}. The next pick must come from the range [${currentStart}, ${n}].`,
      actionKind: "enter-depth",
      codeLines: [4, 5, 9],
      done: false,
      explanationBeginner:
        "Because combinations ignore order, the next number is only allowed to come from the unused numbers to the right.",
      explanationExpert:
        "The monotonic start pointer enforces increasing paths and removes permutation duplicates.",
    });

    if (path.length === k) {
      results.push([...path]);
      frame.status = "complete";

      pushStep({
        action: `The path [${path.join(", ")}] has size ${k}, so it becomes one finished combination.`,
        actionKind: "complete",
        codeLines: [5, 6, 7],
        done: false,
        explanationBeginner:
          "Once the path is long enough, it is saved exactly as one answer.",
        explanationExpert:
          "The base case triggers when `path.size() == k`, so the current prefix is copied into the result set.",
      });

      stack.pop();
      start = currentStart;
      candidate = null;
      return;
    }

    for (let value = currentStart; value <= n; value += 1) {
      exploredChoices += 1;
      candidate = value;
      path.push(value);
      frame.path = [...path];

      pushStep({
        action: `Choose ${value}. The partial combination becomes [${path.join(", ")}].`,
        actionKind: "choose-number",
        codeLines: [9, 10, 11],
        done: false,
        explanationBeginner:
          "Picking a number locks it into the subset and moves the search to the next open slot.",
        explanationExpert:
          "Recursing with `value + 1` ensures all later picks stay strictly larger than the current one.",
      });

      dfs(value + 1);

      const removed = path.pop() ?? value;
      frame.status = "backtracking";
      frame.path = [...path];
      start = currentStart;
      candidate = removed;

      pushStep({
        action: `Backtrack by removing ${removed}. The algorithm returns to start ${currentStart} to test a new branch.`,
        actionKind: "backtrack",
        codeLines: [12],
        done: false,
        explanationBeginner:
          "Undoing the last choice reopens that slot so another number can be tried.",
        explanationExpert:
          "The in-place pop restores the caller's prefix before the loop advances.",
      });

      frame.status = "active";
    }

    stack.pop();
    start = currentStart;
    candidate = null;
  }

  dfs(1);
  start = null;
  candidate = null;

  pushStep({
    action: `Every increasing subset of size ${k} has been explored. The search produced ${results.length} combinations.`,
    actionKind: "done",
    codeLines: [15, 16],
    done: true,
    explanationBeginner:
      "The answer list now contains every way to choose k numbers from 1 through n.",
    explanationExpert:
      "Each leaf corresponds to one k-combination, and the start pointer prevents duplicate orderings.",
  });

  return trace;
}
