export type CycleTraceState = {
  nodes: number[];
  cyclePos: number;
  hasCycle: boolean;
  slowIndex: number;
  fastIndex: number;
  cycleFound: boolean;
  noCycle: boolean;
};

export type CycleTraceStep = {
  step: number;
  action: string;
  actionKind: "init" | "move" | "found" | "no-cycle";
  state: CycleTraceState;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function parseNodes(raw: string) {
  const values = raw
    .split(/[\s,]+/)
    .map((token) => Number(token.trim()))
    .filter((value) => Number.isFinite(value));

  return values.length > 0 ? values : [1, 2, 3, 4, 5];
}

export function generateTrace(rawNodes: string, rawCyclePos: string) {
  const nodes = parseNodes(rawNodes);
  const parsedPos = Math.trunc(Number(rawCyclePos.trim()));
  const cyclePos = Number.isFinite(parsedPos) ? parsedPos : -1;
  const hasCycle = cyclePos >= 0 && cyclePos < nodes.length;
  const steps: CycleTraceStep[] = [];

  function push(
    actionKind: CycleTraceStep["actionKind"],
    state: CycleTraceState,
    action: string,
    beginner: string,
    expert = beginner,
    done = false
  ) {
    steps.push({
      step: steps.length,
      action,
      actionKind,
      state: { ...state, nodes: [...state.nodes] },
      explanationBeginner: beginner,
      explanationExpert: expert,
      done,
    });
  }

  let slowIndex = 0;
  let fastIndex = 0;

  push(
    "init",
    {
      nodes,
      cyclePos,
      hasCycle,
      slowIndex,
      fastIndex,
      cycleFound: false,
      noCycle: false,
    },
    "Place slow and fast pointers",
    "Slow moves one node at a time while fast moves two nodes at a time.",
    "Floyd's cycle detection compares slow and fast positions after each move."
  );

  for (let guard = 0; guard < nodes.length * 2 + 2; guard += 1) {
    if (!hasCycle) {
      const nextSlow = slowIndex + 1;
      const nextFast = fastIndex + 2;
      if (nextFast >= nodes.length) {
        push(
          "no-cycle",
          {
            nodes,
            cyclePos,
            hasCycle,
            slowIndex: Math.min(nextSlow, nodes.length - 1),
            fastIndex: nodes.length - 1,
            cycleFound: false,
            noCycle: true,
          },
          "Fast reached the end",
          "The fast pointer reached the list end, so no cycle exists.",
          "Acyclic lists terminate fast before slow can meet it.",
          true
        );
        return steps;
      }

      slowIndex = nextSlow;
      fastIndex = nextFast;
      push(
        "move",
        {
          nodes,
          cyclePos,
          hasCycle,
          slowIndex,
          fastIndex,
          cycleFound: false,
          noCycle: false,
        },
        "Advance pointers",
        `Slow moves to index ${slowIndex}; fast moves to index ${fastIndex}.`
      );
    } else {
      slowIndex = (slowIndex + 1) % nodes.length;
      fastIndex = (fastIndex + 2) % nodes.length;
      const found = slowIndex === fastIndex;
      push(
        found ? "found" : "move",
        {
          nodes,
          cyclePos,
          hasCycle,
          slowIndex,
          fastIndex,
          cycleFound: found,
          noCycle: false,
        },
        found ? "Pointers met" : "Advance pointers",
        found
          ? `Slow and fast meet at index ${slowIndex}, proving a cycle.`
          : `Slow moves to index ${slowIndex}; fast moves to index ${fastIndex}.`,
        found
          ? "Equal pointer identities imply a cycle."
          : "Continue until the pointers meet.",
        found
      );

      if (found) return steps;
    }
  }

  return steps;
}
