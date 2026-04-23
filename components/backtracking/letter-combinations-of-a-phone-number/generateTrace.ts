export type PhoneEntry = {
  digit: string;
  letters: string;
};

export type PhoneFrame = {
  depth: number;
  digitIndex: number;
  digit: string | null;
  letters: string;
  partial: string;
  activeLetter: string | null;
  status: "active" | "complete" | "backtracking";
};

export type LetterCombinationsState = {
  input: string;
  digits: string;
  phoneEntries: PhoneEntry[];
  partial: string;
  results: string[];
  stack: PhoneFrame[];
  exploredChoices: number;
  completedCount: number;
};

export type LetterCombinationsPointers = {
  digitIndex: number | null;
  activeDigit: string | null;
  activeLetter: string | null;
  callDepth: number;
};

export type LetterCombinationsActionKind =
  | "parsed"
  | "empty"
  | "enter-depth"
  | "choose-letter"
  | "complete"
  | "backtrack"
  | "done";

export type LetterCombinationsTraceStep = {
  step: number;
  action: string;
  actionKind: LetterCombinationsActionKind;
  codeLines: number[];
  state: LetterCombinationsState;
  pointers: LetterCombinationsPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

const phoneMap: Record<string, string> = {
  "2": "abc",
  "3": "def",
  "4": "ghi",
  "5": "jkl",
  "6": "mno",
  "7": "pqrs",
  "8": "tuv",
  "9": "wxyz",
};

function cloneStack(stack: PhoneFrame[]) {
  return stack.map((frame) => ({ ...frame }));
}

export function parseDigitsInput(rawInput: string) {
  return rawInput.replace(/[^2-9]/g, "");
}

export function formatResultList(values: string[]) {
  if (values.length === 0) {
    return "[]";
  }

  return `[${values.map((value) => `"${value}"`).join(", ")}]`;
}

export function generateTrace(rawInput: string): LetterCombinationsTraceStep[] {
  const digits = parseDigitsInput(rawInput);
  const phoneEntries = digits.split("").map((digit) => ({
    digit,
    letters: phoneMap[digit] ?? "",
  }));
  const trace: LetterCombinationsTraceStep[] = [];
  const stack: PhoneFrame[] = [];
  const path: string[] = [];
  const results: string[] = [];

  let exploredChoices = 0;
  let digitIndex: number | null = 0;
  let activeDigit: string | null = digits[0] ?? null;
  let activeLetter: string | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: LetterCombinationsActionKind;
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
        input: rawInput,
        digits,
        phoneEntries,
        partial: path.join(""),
        results: [...results],
        stack: cloneStack(stack),
        exploredChoices,
        completedCount: results.length,
      },
      pointers: {
        digitIndex,
        activeDigit,
        activeLetter,
        callDepth: stack.length,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      digits.length === 0
        ? "Parse the input. There are no valid digits from 2 to 9 to expand."
        : `Parse the digit string ${digits} and load the phone keypad mappings for each position.`,
    actionKind: "parsed",
    codeLines: [1, 2, 3, 4, 5],
    done: false,
    explanationBeginner:
      digits.length === 0
        ? "Only digits 2 through 9 have letters, so an empty usable input means there are no combinations."
        : "Each digit becomes a small group of letters, and backtracking will pick one letter from each group.",
    explanationExpert:
      digits.length === 0
        ? "The empty-input guard returns an empty vector before DFS starts."
        : "DFS state is just the index in the digit string plus the mutable path buffer.",
  });

  if (digits.length === 0) {
    digitIndex = null;
    activeDigit = null;
    activeLetter = null;

    pushStep({
      action: "The usable digit string is empty, so the answer is an empty list.",
      actionKind: "empty",
      codeLines: [2],
      done: true,
      explanationBeginner:
        "There is nothing to choose, so there are no finished phone words to return.",
      explanationExpert:
        "This matches the standard early return for an empty `digits` string.",
    });

    return trace;
  }

  function dfs(index: number) {
    digitIndex = index;
    activeDigit = digits[index] ?? null;
    activeLetter = null;

    const frame: PhoneFrame = {
      depth: stack.length,
      digitIndex: index,
      digit: digits[index] ?? null,
      letters: digits[index] ? phoneMap[digits[index]] : "",
      partial: path.join(""),
      activeLetter: null,
      status: "active",
    };
    stack.push(frame);

    pushStep({
      action:
        index === digits.length
          ? `All ${digits.length} positions are filled, so the current path ${path.join("")} is a finished combination.`
          : `Enter depth ${index}. The next digit is ${digits[index]}, so DFS will try each letter in ${phoneMap[digits[index]]}.`,
      actionKind: "enter-depth",
      codeLines: index === digits.length ? [7, 8, 9] : [6, 7, 11],
      done: false,
      explanationBeginner:
        index === digits.length
          ? "A full phone word is ready because every digit already chose one letter."
          : "The search has reached one digit position and is about to test all letters for that slot.",
      explanationExpert:
        index === digits.length
          ? "The base case fires when the recursion index reaches `digits.size()`."
          : "Each frame owns exactly one digit index and iterates over that digit's branching factor.",
    });

    if (index === digits.length) {
      results.push(path.join(""));
      frame.status = "complete";

      pushStep({
        action: `Store ${path.join("")} in the answer list before the recursion unwinds.`,
        actionKind: "complete",
        codeLines: [7, 8, 9],
        done: false,
        explanationBeginner:
          "This branch produced one valid combination, so it gets saved permanently.",
        explanationExpert:
          "The current path buffer is copied into the result vector at the base case.",
      });

      stack.pop();
      digitIndex = index - 1 >= 0 ? index - 1 : 0;
      activeDigit = digits[digitIndex] ?? digits[0] ?? null;
      activeLetter = null;
      return;
    }

    const digit = digits[index];
    const letters = phoneMap[digit];

    for (const letter of letters) {
      exploredChoices += 1;
      activeLetter = letter;
      frame.activeLetter = letter;
      path.push(letter);
      frame.partial = path.join("");

      pushStep({
        action: `Choose letter ${letter} for digit ${digit}. The partial combination becomes ${path.join("")}.`,
        actionKind: "choose-letter",
        codeLines: [11, 12, 13],
        done: false,
        explanationBeginner:
          "Backtracking locks one letter into the current slot and then moves to the next digit.",
        explanationExpert:
          "This is the branch expansion step: mutate the path, recurse to `index + 1`, then later undo the mutation.",
      });

      dfs(index + 1);

      const removed = path.pop() ?? "";
      frame.status = "backtracking";
      frame.partial = path.join("");
      frame.activeLetter = null;
      digitIndex = index;
      activeDigit = digit;
      activeLetter = removed;

      pushStep({
        action: `Backtrack by removing ${removed}. The search returns to digit ${digit} to try the next letter.`,
        actionKind: "backtrack",
        codeLines: [14],
        done: false,
        explanationBeginner:
          "Undoing the last choice keeps the next branch clean before another letter is tested.",
        explanationExpert:
          "Path mutation is reversed in-place, preserving O(digits.length) auxiliary path storage.",
      });

      frame.status = "active";
    }

    stack.pop();
    digitIndex = index - 1 >= 0 ? index - 1 : 0;
    activeDigit = digits[digitIndex] ?? digits[0] ?? null;
    activeLetter = null;
  }

  dfs(0);
  digitIndex = null;
  activeDigit = null;
  activeLetter = null;

  pushStep({
    action: `All branches are finished. The digit string ${digits} produces ${results.length} combinations.`,
    actionKind: "done",
    codeLines: [17, 18],
    done: true,
    explanationBeginner:
      "The answer list now contains every possible letter choice sequence for the phone number.",
    explanationExpert:
      "The search explores the full Cartesian product of the letter sets, so time is proportional to the number of generated strings.",
  });

  return trace;
}
