export type ReverseKGroupStage =
  | "scan"
  | "reverse-loop"
  | "apply-reverse"
  | "connect"
  | "done";

export type ReverseKGroupState = {
  originalNodes: number[];
  nodes: number[];
  k: number;
  groupIndex: number;
  totalGroups: number;
  stage: ReverseKGroupStage;
  loopStep: number;
  start: number;
  end: number;
  currentChunk: number[];
};

export type ReverseKGroupTraceStep = {
  step: number;
  action: string;
  actionKind: ReverseKGroupStage;
  state: ReverseKGroupState;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function parseNodes(raw: string) {
  const values = raw
    .split(/[\s,]+/)
    .map((token) => Number(token.trim()))
    .filter((value) => Number.isFinite(value));

  return values.length > 0 ? values : [1, 2, 3, 4, 5, 6];
}

export function generateTrace(rawNodes: string, rawK: string) {
  const originalNodes = parseNodes(rawNodes);
  const parsedK = Math.max(1, Math.trunc(Number(rawK.trim()) || 2));
  const k = Math.min(parsedK, Math.max(1, originalNodes.length));
  const nodes = [...originalNodes];
  const totalGroups = Math.floor(nodes.length / k);
  const steps: ReverseKGroupTraceStep[] = [];

  function snapshot(
    stage: ReverseKGroupStage,
    groupIndex: number,
    loopStep: number
  ): ReverseKGroupState {
    const start = groupIndex * k;
    const end = start + k;
    return {
      originalNodes,
      nodes: [...nodes],
      k,
      groupIndex,
      totalGroups,
      stage,
      loopStep,
      start,
      end,
      currentChunk: nodes.slice(start, end),
    };
  }

  function push(
    stage: ReverseKGroupStage,
    groupIndex: number,
    loopStep: number,
    action: string,
    beginner: string,
    expert = beginner,
    done = false
  ) {
    steps.push({
      step: steps.length,
      action,
      actionKind: stage,
      state: snapshot(stage, groupIndex, loopStep),
      explanationBeginner: beginner,
      explanationExpert: expert,
      done,
    });
  }

  if (totalGroups === 0) {
    push(
      "done",
      0,
      0,
      "No full group",
      "There is no complete k-sized group to reverse.",
      "Return the list unchanged.",
      true
    );
    return steps;
  }

  for (let groupIndex = 0; groupIndex < totalGroups; groupIndex += 1) {
    const start = groupIndex * k;
    const end = start + k;
    push(
      "scan",
      groupIndex,
      0,
      `Scan group ${groupIndex + 1}`,
      `Confirm that positions ${start + 1} through ${end} form a complete group of ${k}.`,
      "Locate the kth node before reversing the segment."
    );

    for (let loopStep = 0; loopStep < k; loopStep += 1) {
      push(
        "reverse-loop",
        groupIndex,
        loopStep,
        "Reverse one pointer",
        `Run reversal loop iteration ${loopStep + 1} of ${k} for this group.`,
        "Classic prev-curr-next pointer reversal inside the isolated segment."
      );
    }

    push(
      "apply-reverse",
      groupIndex,
      k - 1,
      "Apply reversed group",
      "The local reversal is complete; write the reversed block back into the list snapshot.",
      "Segment reversal is now visible in the output order."
    );
    nodes.splice(start, k, ...nodes.slice(start, end).reverse());

    push(
      "connect",
      groupIndex,
      k - 1,
      "Connect group",
      "Stitch the reversed group to the previous and next parts of the list.",
      "Reconnect groupPrev and groupNext around the reversed block."
    );
  }

  push(
    "done",
    totalGroups - 1,
    0,
    "All groups processed",
    `Every complete group of ${k} has been reversed. Leftover nodes stay unchanged.`,
    "Return the new head after segment reconnections.",
    true
  );

  return steps;
}
