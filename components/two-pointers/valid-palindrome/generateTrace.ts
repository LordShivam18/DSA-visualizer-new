export interface ComparedPair {
  leftIndex: number | null;
  rightIndex: number | null;
  leftChar: string | null;
  rightChar: string | null;
  matches: boolean | null;
}

export interface ValidPalindromeTraceStep {
  headline: string;
  phase: "normalize" | "compare" | "match" | "mismatch" | "done";
  raw: string;
  cleaned: string;
  leftIndex: number | null;
  rightIndex: number | null;
  activeLines: number[];
  comparedPair: ComparedPair;
  matchedIndices: number[];
  mismatchIndices: number[];
  result: boolean | null;
  statusLabel: string;
  stepNumber: number;
  iteration: number;
  explanationBeginner: string;
  explanationExpert: string;
}

export function normalizePalindromeInput(raw: string) {
  return raw.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function generatePalindromeTrace(raw: string): ValidPalindromeTraceStep[] {
  const cleaned = normalizePalindromeInput(raw);
  const steps: ValidPalindromeTraceStep[] = [];
  const matchedIndices = new Set<number>();

  const makeStep = (
    step: Omit<
      ValidPalindromeTraceStep,
      "raw" | "cleaned" | "matchedIndices" | "mismatchIndices" | "stepNumber"
    > & {
      mismatchIndices?: number[];
    }
  ) => {
    steps.push({
      ...step,
      raw,
      cleaned,
      matchedIndices: [...matchedIndices].sort((a, b) => a - b),
      mismatchIndices: step.mismatchIndices ?? [],
      stepNumber: steps.length,
    });
  };

  makeStep({
    headline: "Normalize the string",
    phase: "normalize",
    leftIndex: cleaned.length > 0 ? 0 : null,
    rightIndex: cleaned.length > 0 ? cleaned.length - 1 : null,
    activeLines: [2, 3, 4],
    comparedPair: {
      leftIndex: null,
      rightIndex: null,
      leftChar: null,
      rightChar: null,
      matches: null,
    },
    result: null,
    statusLabel: cleaned.length === 0 ? "Ready: empty after cleaning" : "Ready",
    iteration: 0,
    explanationBeginner:
      cleaned.length === 0
        ? "After removing spaces, punctuation, and case differences, nothing is left. An empty cleaned string is still a palindrome."
        : "First we lowercase the input and remove everything except letters and digits. Then we place one pointer at each end of the cleaned string.",
    explanationExpert:
      cleaned.length === 0
        ? "Normalization yields the empty string, so the loop never runs and the predicate is vacuously true."
        : "Normalize once into an alphanumeric lowercase buffer, then initialize symmetric boundary pointers for an O(n) scan.",
  });

  if (cleaned.length <= 1) {
    makeStep({
      headline: "Palindrome confirmed",
      phase: "done",
      leftIndex: cleaned.length === 1 ? 0 : null,
      rightIndex: cleaned.length === 1 ? 0 : null,
      activeLines: [5, 12],
      comparedPair: {
        leftIndex: cleaned.length === 1 ? 0 : null,
        rightIndex: cleaned.length === 1 ? 0 : null,
        leftChar: cleaned.length === 1 ? cleaned[0] : null,
        rightChar: cleaned.length === 1 ? cleaned[0] : null,
        matches: true,
      },
      result: true,
      statusLabel: "Palindrome confirmed",
      iteration: 0,
      explanationBeginner:
        cleaned.length === 1
          ? "There is only one cleaned character, so it reads the same forward and backward."
          : "There are no cleaned characters to compare, so the answer is true immediately.",
      explanationExpert:
        cleaned.length === 1
          ? "A single normalized character is trivially palindromic."
          : "The while condition fails immediately, so the function returns true in constant time after normalization.",
    });

    return steps;
  }

  let left = 0;
  let right = cleaned.length - 1;
  let iteration = 1;

  while (left < right) {
    const leftChar = cleaned[left];
    const rightChar = cleaned[right];

    makeStep({
      headline: `Compare pair ${iteration}`,
      phase: "compare",
      leftIndex: left,
      rightIndex: right,
      activeLines: [5, 6],
      comparedPair: {
        leftIndex: left,
        rightIndex: right,
        leftChar,
        rightChar,
        matches: leftChar === rightChar,
      },
      result: null,
      statusLabel: `Inspecting pair ${iteration}`,
      iteration,
      explanationBeginner: `We compare the outer characters '${leftChar}' and '${rightChar}'. If they match, both pointers can move inward.`,
      explanationExpert: `Check the invariant boundary: cleaned[left] and cleaned[right] must match for the substring to remain a palindrome candidate.`,
    });

    if (leftChar !== rightChar) {
      makeStep({
        headline: "Mismatch found",
        phase: "mismatch",
        leftIndex: left,
        rightIndex: right,
        activeLines: [6, 7],
        comparedPair: {
          leftIndex: left,
          rightIndex: right,
          leftChar,
          rightChar,
          matches: false,
        },
        mismatchIndices: [left, right],
        result: false,
        statusLabel: "Stopped on mismatch",
        iteration,
        explanationBeginner: `The characters '${leftChar}' and '${rightChar}' do not match, so the cleaned string cannot be a palindrome.`,
        explanationExpert: `A single asymmetric boundary pair disproves palindromicity, so we can short-circuit and return false.`,
      });

      return steps;
    }

    matchedIndices.add(left);
    matchedIndices.add(right);

    makeStep({
      headline: "Match, move inward",
      phase: "match",
      leftIndex: left,
      rightIndex: right,
      activeLines: [9, 10],
      comparedPair: {
        leftIndex: left,
        rightIndex: right,
        leftChar,
        rightChar,
        matches: true,
      },
      result: null,
      statusLabel: "Pair matched",
      iteration,
      explanationBeginner: `Both sides match on '${leftChar}', so we keep going by moving the left pointer rightward and the right pointer leftward.`,
      explanationExpert: `The outer pair satisfies symmetry, so shrink the search window with left++ and right-- while preserving correctness.`,
    });

    left += 1;
    right -= 1;
    iteration += 1;
  }

  if (left === right) {
    matchedIndices.add(left);
  }

  makeStep({
    headline: "Palindrome confirmed",
    phase: "done",
    leftIndex: left <= right ? left : null,
    rightIndex: left <= right ? right : null,
    activeLines: [12],
    comparedPair: {
      leftIndex: left <= right ? left : null,
      rightIndex: left <= right ? right : null,
      leftChar: left < cleaned.length ? cleaned[left] : null,
      rightChar: right >= 0 ? cleaned[right] : null,
      matches: true,
    },
    result: true,
    statusLabel: "Palindrome confirmed",
    iteration: iteration - 1,
    explanationBeginner:
      left === right
        ? "The pointers met in the middle, and every pair we checked matched. That means the string is a valid palindrome."
        : "The pointers crossed after matching every pair, so the cleaned string reads the same in both directions.",
    explanationExpert:
      left === right
        ? "The scan converged on the center after validating every mirrored pair, so the normalized string is palindromic."
        : "All symmetric pairs were validated before the window collapsed, so the algorithm returns true.",
  });

  return steps;
}
