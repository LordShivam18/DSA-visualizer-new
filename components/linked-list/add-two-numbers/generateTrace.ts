export type AddTwoNumbersState = {
  l1: number[];
  l2: number[];
  i1: number;
  i2: number;
  carry: number;
  result: number[];
  x: number;
  y: number;
  sum: number;
};

export type AddTwoNumbersTraceStep = {
  step: number;
  action: string;
  actionKind: "init" | "add" | "done";
  state: AddTwoNumbersState;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function parseList(raw: string, fallback: number[]) {
  const values = raw
    .split(/[\s,]+/)
    .map((token) => Number(token.trim()))
    .filter((value) => Number.isFinite(value))
    .map((value) => Math.abs(Math.trunc(value)) % 10);

  return values.length > 0 ? values : fallback;
}

export function generateTrace(rawL1: string, rawL2: string) {
  const l1 = parseList(rawL1, [2, 4, 3]);
  const l2 = parseList(rawL2, [5, 6, 4]);
  const steps: AddTwoNumbersTraceStep[] = [];
  let i1 = 0;
  let i2 = 0;
  let carry = 0;
  const result: number[] = [];

  function push(
    actionKind: AddTwoNumbersTraceStep["actionKind"],
    state: AddTwoNumbersState,
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
        ...state,
        l1: [...state.l1],
        l2: [...state.l2],
        result: [...state.result],
      },
      explanationBeginner: beginner,
      explanationExpert: expert,
      done,
    });
  }

  push(
    "init",
    { l1, l2, i1, i2, carry, result, x: 0, y: 0, sum: 0 },
    "Initialize addition",
    "Read both linked lists from least significant digit to most significant digit.",
    "Iterate while either list has a digit or carry remains."
  );

  while (i1 < l1.length || i2 < l2.length || carry > 0) {
    const x = i1 < l1.length ? l1[i1] : 0;
    const y = i2 < l2.length ? l2[i2] : 0;
    const sum = x + y + carry;
    const digit = sum % 10;
    const nextCarry = Math.floor(sum / 10);
    result.push(digit);

    push(
      "add",
      { l1, l2, i1, i2, carry: nextCarry, result, x, y, sum },
      `Write digit ${digit}`,
      `${x} + ${y} + carry ${carry} = ${sum}. Write ${digit} and carry ${nextCarry}.`,
      `sum = ${sum}; node value = sum % 10; carry = floor(sum / 10).`
    );

    if (i1 < l1.length) i1 += 1;
    if (i2 < l2.length) i2 += 1;
    carry = nextCarry;
  }

  push(
    "done",
    { l1, l2, i1, i2, carry, result, x: 0, y: 0, sum: 0 },
    "Return result list",
    `All digits are consumed. The result list is [${result.join(", ")}].`,
    "No inputs and no carry remain.",
    true
  );

  return steps;
}
