export type ParenthesesFrame = {
  depth: number;
  current: string;
  openUsed: number;
  closeUsed: number;
  status: "active" | "complete" | "backtracking";
};

export type GenerateParenthesesState = {
  rawN: string;
  n: number;
  current: string;
  openUsed: number;
  closeUsed: number;
  balance: number;
  results: string[];
  stack: ParenthesesFrame[];
  exploredChoices: number;
};

export type GenerateParenthesesPointers = {
  nextChar: "(" | ")" | null;
  depth: number;
  remainingOpen: number;
  remainingClose: number;
};

export type GenerateParenthesesActionKind =
  | "parsed"
  | "invalid"
  | "enter-depth"
  | "add-open"
  | "add-close"
  | "complete"
  | "backtrack"
  | "done";

export type GenerateParenthesesTraceStep = {
  step: number;
  action: string;
  actionKind: GenerateParenthesesActionKind;
  codeLines: number[];
  state: GenerateParenthesesState;
  pointers: GenerateParenthesesPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function parseCount(rawInput: string) {
  const trimmed = rawInput.trim();
  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed);
  }
  return 0;
}

function cloneStack(stack: ParenthesesFrame[]) {
  return stack.map((frame) => ({ ...frame }));
}

export function parseParenthesesInput(rawN: string) {
  return Math.max(0, parseCount(rawN));
}

export function formatParenthesesResults(values: string[]) {
  if (values.length === 0) {
    return "[]";
  }
  return `[${values.map((value) => `"${value}"`).join(", ")}]`;
}

export function generateTrace(rawN: string): GenerateParenthesesTraceStep[] {
  const n = parseParenthesesInput(rawN);
  const trace: GenerateParenthesesTraceStep[] = [];
  const stack: ParenthesesFrame[] = [];
  const path: string[] = [];
  const results: string[] = [];

  let exploredChoices = 0;
  let nextChar: "(" | ")" | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: GenerateParenthesesActionKind;
    codeLines: number[];
    done: boolean;
    explanationBeginner: string;
    explanationExpert: string;
  }) {
    const current = path.join("");
    const openUsed = current.split("").filter((char) => char === "(").length;
    const closeUsed = current.length - openUsed;

    trace.push({
      step: trace.length,
      action,
      actionKind,
      codeLines,
      state: {
        rawN,
        n,
        current,
        openUsed,
        closeUsed,
        balance: openUsed - closeUsed,
        results: [...results],
        stack: cloneStack(stack),
        exploredChoices,
      },
      pointers: {
        nextChar,
        depth: stack.length,
        remainingOpen: Math.max(n - openUsed, 0),
        remainingClose: Math.max(n - closeUsed, 0),
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action: `Parse n = ${n} and prepare the bracket builder.`,
    actionKind: "parsed",
    codeLines: [1, 2, 3, 4],
    done: false,
    explanationBeginner:
      "The search will grow one bracket at a time, but it must stay balanced enough to become valid later.",
    explanationExpert:
      "The state is `(openUsed, closeUsed)` with the invariant `closeUsed <= openUsed <= n`.",
  });

  if (n === 0) {
    results.push("");

    pushStep({
      action: "With zero pairs, the empty string is the only valid answer.",
      actionKind: "invalid",
      codeLines: [5, 6, 7, 16],
      done: true,
      explanationBeginner:
        "No brackets are needed, so the answer is one empty string.",
      explanationExpert:
        "The empty prefix already satisfies the target size and validity constraint.",
    });

    return trace;
  }

  function dfs(openUsed: number, closeUsed: number) {
    const frame: ParenthesesFrame = {
      depth: stack.length,
      current: path.join(""),
      openUsed,
      closeUsed,
      status: "active",
    };
    stack.push(frame);
    nextChar = null;

    pushStep({
      action: `Enter depth ${path.length}. The current prefix is "${path.join("")}" with balance ${openUsed - closeUsed}.`,
      actionKind: "enter-depth",
      codeLines: [4, 5, 8, 11],
      done: false,
      explanationBeginner:
        "The current prefix is still valid so far, so the search can decide which bracket may come next.",
      explanationExpert:
        "Only prefixes that can still be completed into a balanced string are explored.",
    });

    if (path.length === n * 2) {
      results.push(path.join(""));
      frame.status = "complete";

      pushStep({
        action: `The prefix "${path.join("")}" already has ${n * 2} characters, so it is a complete valid string.`,
        actionKind: "complete",
        codeLines: [5, 6, 7],
        done: false,
        explanationBeginner:
          "A string is finished when it uses all n opening and n closing brackets.",
        explanationExpert:
          "The base case occurs at length `2 * n`, and validity is guaranteed by the prefix constraints.",
      });

      stack.pop();
      nextChar = null;
      return;
    }

    if (openUsed < n) {
      exploredChoices += 1;
      nextChar = "(";
      path.push("(");
      frame.current = path.join("");

      pushStep({
        action: `Add '(' because ${openUsed} opening brackets have been used and the limit is ${n}.`,
        actionKind: "add-open",
        codeLines: [8, 9],
        done: false,
        explanationBeginner:
          "An opening bracket is always safe while there are still unused opening brackets left.",
        explanationExpert:
          "The branch condition `openUsed < n` maintains the upper bound on opening characters.",
      });

      dfs(openUsed + 1, closeUsed);

      path.pop();
      frame.status = "backtracking";
      frame.current = path.join("");
      nextChar = "(";

      pushStep({
        action: "Backtrack after exploring the '(' branch so the same prefix can try another valid next character.",
        actionKind: "backtrack",
        codeLines: [10],
        done: false,
        explanationBeginner:
          "The opening bracket is removed so the search can try the closing-bracket option next.",
        explanationExpert:
          "Undoing the mutable path buffer restores the caller state after the open-branch recursion returns.",
      });

      frame.status = "active";
    }

    if (closeUsed < openUsed) {
      exploredChoices += 1;
      nextChar = ")";
      path.push(")");
      frame.current = path.join("");

      pushStep({
        action: `Add ')' because there are still more opens than closes in the prefix.`,
        actionKind: "add-close",
        codeLines: [11, 12],
        done: false,
        explanationBeginner:
          "A closing bracket is only safe when there is an earlier unmatched opening bracket to pair with it.",
        explanationExpert:
          "The condition `closeUsed < openUsed` preserves prefix validity and prevents negative balance.",
      });

      dfs(openUsed, closeUsed + 1);

      path.pop();
      frame.status = "backtracking";
      frame.current = path.join("");
      nextChar = ")";

      pushStep({
        action: "Backtrack after exploring the ')' branch so the recursion can unwind to the previous prefix.",
        actionKind: "backtrack",
        codeLines: [13],
        done: false,
        explanationBeginner:
          "The closing bracket is removed because that branch is fully explored now.",
        explanationExpert:
          "The path pop restores the caller prefix after the close-branch recursion returns.",
      });

      frame.status = "active";
    }

    stack.pop();
    nextChar = null;
  }

  dfs(0, 0);

  pushStep({
    action: `All valid prefixes have been explored. There are ${results.length} well-formed strings for n = ${n}.`,
    actionKind: "done",
    codeLines: [15, 16],
    done: true,
    explanationBeginner:
      "The answer list now contains every valid way to arrange n pairs of parentheses.",
    explanationExpert:
      "The recursion explores only Catalan-valid prefixes, so invalid strings are pruned before they are ever completed.",
  });

  return trace;
}
