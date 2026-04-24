import { createTraceRecorder } from "../shared/trace";
import type { HashmapTraceState, HashmapTraceStep } from "../shared/types";

export type HappyNumberTraceStep = HashmapTraceStep;

function digitsOf(value: number) {
  return String(Math.abs(value))
    .split("")
    .map((digit) => Number(digit));
}

export function generateTrace(inputs: Record<string, string>): HappyNumberTraceStep[] {
  const parsed = Number(inputs.n ?? 19);
  let current = Number.isFinite(parsed) ? Math.max(1, Math.trunc(parsed)) : 19;
  const seen = new Set<number>();
  const trail = [current];

  let digits = digitsOf(current);
  let squares = digits.map((digit) => digit * digit);
  let currentSum = 0;
  let verdict: boolean | null = null;

  const initialState: HashmapTraceState = {
    hero:
      "A happy number eventually reaches 1. The hash set prevents endless looping by remembering every intermediate number already seen.",
    primaryLabel: "Sequence Trail",
    primaryItems: [],
    secondaryLabel: "Digits",
    secondaryItems: [],
    tertiaryLabel: "Squared Digits",
    tertiaryItems: [],
    mapLabel: "Seen States",
    mapEntries: [],
    stats: [],
    resultLabel: "isHappy",
    resultValue: "building",
    resultTone: "cyan",
    summary:
      "Repeated sums reveal a cycle. Reaching 1 ends the process successfully.",
    footer:
      "The hash set turns cycle detection into a simple membership test, so the process stops as soon as an intermediate value repeats.",
  };

  const { state, trace, pointers, pushStep } = createTraceRecorder(initialState);

  function syncState() {
    state.hero =
      verdict === true
        ? "The sequence reached 1, so the process stays at 1 forever and the number is happy."
        : verdict === false
        ? `Value ${current} has appeared before, so the process entered a cycle that will never reach 1.`
        : `Current value ${current} is being expanded into the sum of the squares of its digits.`;

    state.primaryItems = trail.map((value, index) => ({
      id: `trail-${index}-${value}`,
      label: `${value}`,
      sublabel: `step ${index}`,
      tone:
        index === trail.length - 1 && verdict === false
          ? "red"
          : index === trail.length - 1
          ? "cyan"
          : value === 1
          ? "green"
          : "purple",
      tags:
        index === trail.length - 1 && verdict === false
          ? ["cycle"]
          : index === trail.length - 1
          ? ["current"]
          : value === 1
          ? ["happy"]
          : ["seen"],
    }));

    state.secondaryItems = digits.map((digit, index) => ({
      id: `digit-${index}`,
      label: `${digit}`,
      sublabel: `d${index}`,
      tone: pointers.secondaryIndex === index ? "yellow" : "slate",
      tags: pointers.secondaryIndex === index ? ["square"] : undefined,
    }));

    state.tertiaryItems = squares.map((square, index) => ({
      id: `square-${index}`,
      label: `${square}`,
      sublabel: `${digits[index]}^2`,
      tone: pointers.tertiaryIndex === index ? "green" : "slate",
      tags: pointers.tertiaryIndex === index ? ["add"] : undefined,
    }));

    state.mapEntries = [...seen]
      .sort((left, right) => left - right)
      .map((value) => ({
        id: `seen-${value}`,
        key: `${value}`,
        value: "visited",
        note: "cycle guard",
        tone: pointers.activeEntryId === `seen-${value}` ? "yellow" : "purple",
      }));

    state.stats = [
      { label: "Current n", value: `${current}`, tone: "cyan" },
      { label: "Seen Size", value: `${seen.size}`, tone: "purple" },
      { label: "Next Sum", value: `${currentSum}`, tone: "yellow" },
      {
        label: "Verdict",
        value: verdict === null ? "building" : String(verdict),
        tone: verdict === null ? "yellow" : verdict ? "green" : "red",
      },
    ];

    state.resultValue = verdict === null ? "building" : String(verdict);
    state.resultTone = verdict === null ? "cyan" : verdict ? "green" : "red";
    state.verdict = verdict;
    state.summary =
      verdict === null
        ? `The next candidate is currently accumulating to ${currentSum}.`
        : verdict
        ? "Reaching 1 proves happiness."
        : `Repeating ${current} proves the process is trapped in a loop.`;
  }

  currentSum = squares.reduce((sum, value) => sum + value, 0);
  syncState();

  pushStep({
    action:
      "Parse n, prepare the seen set, and get ready to repeatedly replace the number with the sum of the squares of its digits.",
    actionKind: "parsed",
    codeLines: [1, 2, 3],
    explanationBeginner:
      "We keep transforming the number. The set remembers old results so we can detect a loop.",
    explanationExpert:
      "Cycle detection via hashing converts repeated-state discovery into O(1) average membership checks.",
    done: false,
  });

  while (current !== 1 && !seen.has(current)) {
    pointers.primaryIndex = trail.length - 1;
    pointers.activeEntryId = `seen-${current}`;
    seen.add(current);
    syncState();

    pushStep({
      action: `Store ${current} in the seen set before generating the next value.`,
      actionKind: "record-state",
      codeLines: [3, 4],
      explanationBeginner:
        "If we ever come back to this same number again, we will know the process is looping.",
      explanationExpert:
        "The set stores each visited state exactly once, which is sufficient to detect a cycle in the deterministic transition graph.",
      done: false,
    });

    currentSum = 0;
    digits = digitsOf(current);
    squares = digits.map((digit) => digit * digit);
    syncState();

    for (let index = 0; index < digits.length; index += 1) {
      pointers.secondaryIndex = index;
      pointers.tertiaryIndex = index;
      pointers.focusKey = `${digits[index]}`;
      pointers.focusValue = `${squares[index]}`;
      currentSum += squares[index];
      syncState();

      pushStep({
        action: `Square digit ${digits[index]} to get ${squares[index]}, then add it into the running next-sum ${currentSum}.`,
        actionKind: "digit-square",
        codeLines: [5, 6, 7, 8, 9],
        explanationBeginner:
          "Each digit contributes its square to the next number in the sequence.",
        explanationExpert:
          "The inner loop computes the transition function f(n) = sum of squared digits.",
        done: false,
      });
    }

    current = currentSum;
    trail.push(current);
    digits = digitsOf(current);
    squares = digits.map((digit) => digit * digit);
    pointers.secondaryIndex = null;
    pointers.tertiaryIndex = null;
    pointers.focusKey = null;
    pointers.focusValue = null;
    syncState();

    pushStep({
      action: `Replace n with ${current} and continue the process from this new state.`,
      actionKind: "advance-state",
      codeLines: [11],
      explanationBeginner:
        "The sum we just built becomes the next number to test.",
      explanationExpert:
        "The algorithm advances one deterministic transition along the state graph.",
      done: false,
    });
  }

  verdict = current === 1;
  pointers.primaryIndex = trail.length - 1;
  pointers.activeEntryId = verdict ? null : `seen-${current}`;
  syncState();

  pushStep({
    action: verdict
      ? "The sequence reached 1, so the number is happy."
      : `State ${current} reappeared in the seen set, so the sequence is cycling without ever hitting 1.`,
    actionKind: "done",
    codeLines: [13],
    explanationBeginner: verdict
      ? "Landing on 1 is the success condition."
      : "Repeating a number means the same steps will repeat forever.",
    explanationExpert: verdict
      ? "The terminal fixed point 1 proves happiness."
      : "A repeated state implies an infinite cycle in a deterministic system, ruling out eventual convergence to 1.",
    done: true,
  });

  return trace;
}
