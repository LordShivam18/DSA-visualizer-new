export type ContainerActionKind =
  | "init"
  | "compare"
  | "update-best"
  | "move-left"
  | "move-right"
  | "done";

export type LastAction = {
  kind: Exclude<ContainerActionKind, "init">;
  left: number;
  right: number;
  area: number;
  maxArea: number;
} | null;

export type ContainerMostWaterState = {
  heights: number[];
  left: number;
  right: number;
  maxArea: number;
  bestLeft: number | null;
  bestRight: number | null;
  currentArea: number;
  lastAction: LastAction;
  activeLine: number;
};

export type ContainerMostWaterTraceStep = {
  step: number;
  action: string;
  actionKind: ContainerActionKind;
  state: ContainerMostWaterState;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function parseHeights(raw: string) {
  const values = raw
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(/[\s,]+/)
    .map((token) => Number(token.trim()))
    .filter((value) => Number.isFinite(value) && value >= 0);

  return values.length > 1 ? values : [1, 8, 6, 2, 5, 4, 8, 3, 7];
}

export function generateTrace(rawHeights: string) {
  const heights = parseHeights(rawHeights);
  const steps: ContainerMostWaterTraceStep[] = [];
  let left = 0;
  let right = heights.length - 1;
  let maxArea = 0;
  let bestLeft: number | null = null;
  let bestRight: number | null = null;

  function area(l: number, r: number) {
    return Math.max(r - l, 0) * Math.min(heights[l] ?? 0, heights[r] ?? 0);
  }

  function push(
    actionKind: ContainerActionKind,
    lastAction: LastAction,
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
        heights: [...heights],
        left,
        right,
        maxArea,
        bestLeft,
        bestRight,
        currentArea: left < right ? area(left, right) : 0,
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
    null,
    3,
    "Initialize two pointers",
    "Place one pointer at each end of the height array.",
    "Start with the widest possible container."
  );

  while (left < right) {
    const currentArea = area(left, right);
    const nextMax = Math.max(maxArea, currentArea);
    const updated = currentArea > maxArea;

    if (updated) {
      maxArea = currentArea;
      bestLeft = left;
      bestRight = right;
      push(
        "update-best",
        { kind: "update-best", left, right, area: currentArea, maxArea },
        8,
        "Update best area",
        `Area ${currentArea} beats the previous best, so record this pair.`
      );
    } else {
      push(
        "compare",
        { kind: "compare", left, right, area: currentArea, maxArea: nextMax },
        6,
        "Compare current container",
        `Current area is ${currentArea}; best remains ${maxArea}.`
      );
    }

    if (heights[left] <= heights[right]) {
      left += 1;
      push(
        "move-left",
        { kind: "move-left", left, right, area: currentArea, maxArea },
        10,
        "Move left pointer",
        "The left wall is the limiting height, so move it inward.",
        "Discard the shorter side; keeping it cannot improve area as width shrinks."
      );
    } else {
      right -= 1;
      push(
        "move-right",
        { kind: "move-right", left, right, area: currentArea, maxArea },
        12,
        "Move right pointer",
        "The right wall is the limiting height, so move it inward.",
        "Discard the shorter side; keeping it cannot improve area as width shrinks."
      );
    }
  }

  push(
    "done",
    { kind: "done", left, right, area: 0, maxArea },
    15,
    "Return maximum area",
    `Pointers met. The maximum water area is ${maxArea}.`,
    "All viable limiting-wall candidates have been considered.",
    true
  );

  return steps;
}
