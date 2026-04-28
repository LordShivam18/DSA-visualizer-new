export type MergeTwoListsState = {
  l1: number[];
  l2: number[];
  i1: number;
  i2: number;
  result: number[];
  pickedFrom: "l1" | "l2" | null;
  pickedValue: number | null;
};

export type MergeTwoListsTraceStep = {
  step: number;
  action: string;
  actionKind: "init" | "pick-l1" | "pick-l2" | "done";
  state: MergeTwoListsState;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function parseList(raw: string, fallback: number[]) {
  const values = raw
    .split(/[\s,]+/)
    .map((token) => Number(token.trim()))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  return values.length > 0 ? values : fallback;
}

export function generateTrace(rawL1: string, rawL2: string) {
  const l1 = parseList(rawL1, [1, 3, 5]);
  const l2 = parseList(rawL2, [2, 4, 6]);
  const result: number[] = [];
  const steps: MergeTwoListsTraceStep[] = [];
  let i1 = 0;
  let i2 = 0;

  function push(
    actionKind: MergeTwoListsTraceStep["actionKind"],
    state: MergeTwoListsState,
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
    { l1, l2, i1, i2, result, pickedFrom: null, pickedValue: null },
    "Initialize merge",
    "Compare the front nodes of both sorted lists and append the smaller one.",
    "Maintain a tail pointer on the merged output."
  );

  while (i1 < l1.length || i2 < l2.length) {
    const x = i1 < l1.length ? l1[i1] : Number.POSITIVE_INFINITY;
    const y = i2 < l2.length ? l2[i2] : Number.POSITIVE_INFINITY;
    const pickL1 = x <= y;
    const value = pickL1 ? x : y;
    result.push(value);
    if (pickL1) i1 += 1;
    else i2 += 1;

    push(
      pickL1 ? "pick-l1" : "pick-l2",
      {
        l1,
        l2,
        i1,
        i2,
        result,
        pickedFrom: pickL1 ? "l1" : "l2",
        pickedValue: value,
      },
      `Append ${value}`,
      `Pick ${value} from ${pickL1 ? "list 1" : "list 2"} because it is the smaller current node.`,
      "Append the smaller head and advance that list pointer."
    );
  }

  push(
    "done",
    { l1, l2, i1, i2, result, pickedFrom: null, pickedValue: null },
    "Merged list complete",
    `The merged result is [${result.join(", ")}].`,
    "Both input pointers are exhausted.",
    true
  );

  return steps;
}
