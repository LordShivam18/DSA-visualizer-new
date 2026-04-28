export type ParenthesesStatus = "ready" | "processing" | "valid" | "invalid";

export type ParenthesesLastAction =
  | { kind: "push"; char: string; index: number }
  | { kind: "pop"; char: string; index: number; expected: string }
  | {
      kind: "mismatch";
      char: string;
      index: number;
      expected: string;
      actualTop: string | null;
    }
  | { kind: "emptyPop"; char: string; index: number }
  | { kind: "done-valid" }
  | { kind: "done-invalid-unclosed" }
  | null;

export type ValidParenthesesState = {
  expression: string;
  idx: number;
  stack: string[];
  status: ParenthesesStatus;
  lastAction: ParenthesesLastAction;
  activeLine: number;
};

export type ValidParenthesesTraceStep = {
  step: number;
  action: string;
  actionKind:
    | "init"
    | "push"
    | "pop"
    | "mismatch"
    | "empty-pop"
    | "done-valid"
    | "done-invalid";
  state: ValidParenthesesState;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

const open = "([{";
const close = ")]}";
const match: Record<string, string> = { ")": "(", "]": "[", "}": "{" };

export function generateTrace(rawExpression: string) {
  const expression = rawExpression.trim() || "({[]})";
  const steps: ValidParenthesesTraceStep[] = [];
  const stack: string[] = [];

  function push(
    actionKind: ValidParenthesesTraceStep["actionKind"],
    idx: number,
    status: ParenthesesStatus,
    lastAction: ParenthesesLastAction,
    activeLine: number,
    action: string,
    beginner: string,
    expert = beginner,
    done = false
  ) {
    steps.push({
      step: steps.length,
      action,
      actionKind,
      state: {
        expression,
        idx,
        stack: [...stack],
        status,
        lastAction,
        activeLine,
      },
      explanationBeginner: beginner,
      explanationExpert: expert,
      done,
    });
  }

  push(
    "init",
    0,
    "ready",
    null,
    1,
    "Initialize stack",
    "Scan the expression from left to right and use a stack for unmatched opening brackets.",
    "The stack contains exactly the opening delimiters not yet matched."
  );

  for (let index = 0; index < expression.length; index += 1) {
    const char = expression[index];
    if (open.includes(char)) {
      stack.push(char);
      push(
        "push",
        index + 1,
        "processing",
        { kind: "push", char, index },
        3,
        `Push ${char}`,
        `'${char}' is an opening bracket, so push it onto the stack.`
      );
      continue;
    }

    if (!close.includes(char)) {
      push(
        "pop",
        index + 1,
        "processing",
        null,
        2,
        "Skip non-bracket character",
        "This character is not a bracket, so it does not affect the stack."
      );
      continue;
    }

    if (stack.length === 0) {
      push(
        "empty-pop",
        index,
        "invalid",
        { kind: "emptyPop", char, index },
        4,
        "Closing bracket without opener",
        `'${char}' has no matching opening bracket on the stack.`,
        "Encountered a close delimiter with an empty stack.",
        true
      );
      return steps;
    }

    const expected = match[char];
    const top = stack[stack.length - 1];
    if (top !== expected) {
      push(
        "mismatch",
        index,
        "invalid",
        { kind: "mismatch", char, index, expected, actualTop: top },
        5,
        "Bracket mismatch",
        `'${char}' expected '${expected}' on top, but found '${top}'.`,
        "Top of stack does not match the current closing delimiter.",
        true
      );
      return steps;
    }

    stack.pop();
    push(
      "pop",
      index + 1,
      "processing",
      { kind: "pop", char, index, expected },
      6,
      `Pop ${expected}`,
      `'${char}' matches the stack top, so pop '${expected}'.`
    );
  }

  if (stack.length === 0) {
    push(
      "done-valid",
      expression.length,
      "valid",
      { kind: "done-valid" },
      8,
      "Expression is valid",
      "All characters were processed and the stack is empty.",
      "Every opening bracket found its matching closing bracket.",
      true
    );
  } else {
    push(
      "done-invalid",
      expression.length,
      "invalid",
      { kind: "done-invalid-unclosed" },
      8,
      "Unclosed brackets remain",
      "The scan ended with unmatched opening brackets still on the stack.",
      "A non-empty stack after traversal means the expression is invalid.",
      true
    );
  }

  return steps;
}
