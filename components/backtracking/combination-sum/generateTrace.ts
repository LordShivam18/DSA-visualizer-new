export type CombinationSumFrame = {
  depth: number;
  startIndex: number;
  remaining: number;
  path: number[];
  status: "active" | "complete" | "overshoot" | "backtracking";
};

export type CombinationSumState = {
  rawCandidates: string;
  rawTarget: string;
  candidates: number[];
  target: number;
  path: number[];
  currentSum: number;
  remaining: number;
  results: number[][];
  stack: CombinationSumFrame[];
  exploredChoices: number;
};

export type CombinationSumPointers = {
  startIndex: number | null;
  candidateIndex: number | null;
  candidateValue: number | null;
  remaining: number | null;
  depth: number;
};

export type CombinationSumActionKind =
  | "parsed"
  | "invalid"
  | "enter-depth"
  | "choose-candidate"
  | "overshoot"
  | "complete"
  | "backtrack"
  | "done";

export type CombinationSumTraceStep = {
  step: number;
  action: string;
  actionKind: CombinationSumActionKind;
  codeLines: number[];
  state: CombinationSumState;
  pointers: CombinationSumPointers;
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

function cloneStack(stack: CombinationSumFrame[]) {
  return stack.map((frame) => ({
    ...frame,
    path: [...frame.path],
  }));
}

function parseTarget(rawInput: string) {
  const trimmed = rawInput.trim();
  if (/^-?\d+$/.test(trimmed)) {
    return Number(trimmed);
  }
  return 0;
}

export function parseCombinationSumInput(rawCandidates: string, rawTarget: string) {
  const candidates = [...new Set(parseNumberArray(rawCandidates))]
    .filter((value) => value > 0)
    .sort((left, right) => left - right);
  const target = parseTarget(rawTarget);

  return { candidates, target };
}

export function formatCombinationSumResults(values: number[][]) {
  if (values.length === 0) {
    return "[]";
  }

  return `[${values.map((value) => `[${value.join(",")}]`).join(", ")}]`;
}

export function generateTrace(
  rawCandidates: string,
  rawTarget: string
): CombinationSumTraceStep[] {
  const { candidates, target } = parseCombinationSumInput(rawCandidates, rawTarget);
  const trace: CombinationSumTraceStep[] = [];
  const stack: CombinationSumFrame[] = [];
  const path: number[] = [];
  const results: number[][] = [];

  let exploredChoices = 0;
  let startIndex: number | null = 0;
  let candidateIndex: number | null = null;
  let candidateValue: number | null = null;
  let remainingPointer: number | null = target;

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: CombinationSumActionKind;
    codeLines: number[];
    done: boolean;
    explanationBeginner: string;
    explanationExpert: string;
  }) {
    const currentSum = path.reduce((sum, value) => sum + value, 0);

    trace.push({
      step: trace.length,
      action,
      actionKind,
      codeLines,
      state: {
        rawCandidates,
        rawTarget,
        candidates: [...candidates],
        target,
        path: [...path],
        currentSum,
        remaining: target - currentSum,
        results: cloneResults(results),
        stack: cloneStack(stack),
        exploredChoices,
      },
      pointers: {
        startIndex,
        candidateIndex,
        candidateValue,
        remaining: remainingPointer,
        depth: stack.length,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action: `Parse candidates [${candidates.join(", ")}] and target ${target}, then prepare the reusable-choice DFS.`,
    actionKind: "parsed",
    codeLines: [1, 2, 3, 4],
    done: false,
    explanationBeginner:
      "This problem lets the same number be chosen again, so the search may stay on the same candidate index after a pick.",
    explanationExpert:
      "The DFS state is `(startIndex, remaining)` plus the mutable path buffer. Reusing a candidate means recursing with the same index.",
  });

  if (candidates.length === 0 || target < 0) {
    startIndex = null;
    candidateIndex = null;
    candidateValue = null;
    remainingPointer = target;

    pushStep({
      action:
        candidates.length === 0
          ? "There are no positive candidates to choose from, so the search space is empty."
          : "A negative target cannot be reached by adding positive candidate values.",
      actionKind: "invalid",
      codeLines: [4, 16, 17],
      done: true,
      explanationBeginner:
        candidates.length === 0
          ? "Without numbers, no combination can be built."
          : "Positive numbers can only make the sum larger, not climb back up from a negative target.",
      explanationExpert:
        candidates.length === 0
          ? "No branches can be generated."
          : "The feasible region is empty when `target < 0` and all candidates are positive.",
    });

    return trace;
  }

  function dfs(currentStartIndex: number, remaining: number) {
    startIndex = currentStartIndex;
    remainingPointer = remaining;
    candidateIndex = null;
    candidateValue = null;

    const frame: CombinationSumFrame = {
      depth: stack.length,
      startIndex: currentStartIndex,
      remaining,
      path: [...path],
      status: "active",
    };
    stack.push(frame);

    pushStep({
      action: `Enter depth ${path.length} with remaining target ${remaining}. Candidates can start from index ${currentStartIndex}.`,
      actionKind: "enter-depth",
      codeLines: [4, 5, 9],
      done: false,
      explanationBeginner:
        "The branch remembers how much target is still missing and which candidate index is allowed next.",
      explanationExpert:
        "Because reuse is allowed, the next loop begins at `startIndex` instead of `startIndex + 1`.",
    });

    if (remaining === 0) {
      results.push([...path]);
      frame.status = "complete";

      pushStep({
        action: `The remaining target hit 0, so [${path.join(", ")}] is stored as a valid combination.`,
        actionKind: "complete",
        codeLines: [5, 6, 7],
        done: false,
        explanationBeginner:
          "A branch succeeds the moment its chosen numbers add up exactly to the target.",
        explanationExpert:
          "The base case copies the current path when `remaining == 0`.",
      });

      stack.pop();
      startIndex = currentStartIndex;
      remainingPointer = remaining;
      return;
    }

    for (let index = currentStartIndex; index < candidates.length; index += 1) {
      const value = candidates[index];
      const nextRemaining = remaining - value;
      exploredChoices += 1;
      candidateIndex = index;
      candidateValue = value;

      if (nextRemaining < 0) {
        frame.status = "overshoot";
        remainingPointer = nextRemaining;

        pushStep({
          action: `Trying ${value} would drop the remaining target to ${nextRemaining}, so this branch is pruned immediately.`,
          actionKind: "overshoot",
          codeLines: [9, 10],
          done: false,
          explanationBeginner:
            "This number makes the sum too large, so there is no reason to recurse deeper on this branch.",
          explanationExpert:
            "Positive candidates guarantee monotonic growth, so any negative remainder is an irreversible overshoot.",
        });

        frame.status = "active";
        remainingPointer = remaining;
        continue;
      }

      path.push(value);
      frame.path = [...path];
      frame.remaining = nextRemaining;
      remainingPointer = nextRemaining;

      pushStep({
        action: `Choose ${value}. The path becomes [${path.join(", ")}], and the remaining target becomes ${nextRemaining}.`,
        actionKind: "choose-candidate",
        codeLines: [9, 11, 12],
        done: false,
        explanationBeginner:
          "This candidate fits, so the branch keeps it and continues searching for the rest of the target.",
        explanationExpert:
          "The recursive call stays at index `i`, which is the key detail that allows unlimited reuse of the same value.",
      });

      dfs(index, nextRemaining);

      const removed = path.pop() ?? value;
      frame.status = "backtracking";
      frame.path = [...path];
      frame.remaining = remaining;
      startIndex = currentStartIndex;
      candidateIndex = index;
      candidateValue = removed;
      remainingPointer = remaining;

      pushStep({
        action: `Backtrack by removing ${removed}. The branch returns to remaining target ${remaining} and can try the next candidate.`,
        actionKind: "backtrack",
        codeLines: [13],
        done: false,
        explanationBeginner:
          "Undoing the last choice lets the algorithm test a different number from the same state.",
        explanationExpert:
          "The path pop restores the caller frame before the loop advances to the next candidate.",
      });

      frame.status = "active";
    }

    stack.pop();
    startIndex = currentStartIndex;
    remainingPointer = remaining;
    candidateIndex = null;
    candidateValue = null;
  }

  dfs(0, target);
  startIndex = null;
  candidateIndex = null;
  candidateValue = null;
  remainingPointer = 0;

  pushStep({
    action: `All feasible branches are done. The search produced ${results.length} combination${results.length === 1 ? "" : "s"}.`,
    actionKind: "done",
    codeLines: [16, 17],
    done: true,
    explanationBeginner:
      "The answer now contains every unique way to reach the target using the candidate values.",
    explanationExpert:
      "Sorting plus the non-decreasing start index avoids duplicate orderings while still allowing candidate reuse.",
  });

  return trace;
}
