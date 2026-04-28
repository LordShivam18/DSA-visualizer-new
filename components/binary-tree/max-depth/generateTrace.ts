import { NODES_BY_ID, TREE_STRUCTURE } from "./TreeView";

export type MaxDepthTraceState = {
  depth: number;
  queue: string[];
  levelRemaining: number;
  currentId: string | null;
  visited: string[];
  activeLine: number;
  status: "ready" | "running" | "done";
};

export type MaxDepthTraceStep = {
  step: number;
  action: string;
  actionKind: "init" | "start-level" | "visit-node" | "done";
  state: MaxDepthTraceState;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

export function generateTrace(): MaxDepthTraceStep[] {
  const steps: MaxDepthTraceStep[] = [];
  let depth = 0;
  let queue = ["root"];
  const visited: string[] = [];

  function push(
    actionKind: MaxDepthTraceStep["actionKind"],
    state: MaxDepthTraceState,
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
        queue: [...state.queue],
        visited: [...state.visited],
      },
      explanationBeginner: beginner,
      explanationExpert: expert,
      done,
    });
  }

  push(
    "init",
    {
      depth,
      queue,
      levelRemaining: queue.length,
      currentId: null,
      visited,
      activeLine: 3,
      status: "ready",
    },
    "Initialize BFS queue",
    "Put the root in the queue. Each complete queue layer adds one to the depth.",
    "BFS level order traversal computes tree height by frontiers."
  );

  while (queue.length > 0) {
    const levelSize = queue.length;
    depth += 1;
    push(
      "start-level",
      {
        depth,
        queue,
        levelRemaining: levelSize,
        currentId: null,
        visited,
        activeLine: 8,
        status: "running",
      },
      `Start level ${depth}`,
      `All ${levelSize} node(s) currently in the queue belong to depth ${depth}.`,
      `Process exactly ${levelSize} nodes before incrementing depth again.`
    );

    for (let index = 0; index < levelSize; index += 1) {
      const currentId = queue.shift()!;
      const children = [
        TREE_STRUCTURE[currentId]?.left,
        TREE_STRUCTURE[currentId]?.right,
      ].filter((child): child is string => Boolean(child));
      queue = [...queue, ...children];
      visited.push(currentId);
      const label = NODES_BY_ID[currentId]?.label ?? currentId;

      push(
        "visit-node",
        {
          depth,
          queue,
          levelRemaining: levelSize - index - 1,
          currentId,
          visited,
          activeLine: children.length === 0 ? 10 : children.length === 1 ? 11 : 12,
          status: "running",
        },
        `Visit node ${label}`,
        children.length === 0
          ? `Node ${label} has no children, so the next level queue is unchanged.`
          : `Visit ${label} and enqueue its child node(s).`,
        `Pop ${label}; append children [${children
          .map((id) => NODES_BY_ID[id]?.label ?? id)
          .join(", ")}].`
      );
    }
  }

  push(
    "done",
    {
      depth,
      queue,
      levelRemaining: 0,
      currentId: null,
      visited,
      activeLine: 15,
      status: "done",
    },
    "Return maximum depth",
    `The queue is empty, so the maximum depth is ${depth}.`,
    "Traversal ended after the deepest frontier was processed.",
    true
  );

  return steps;
}
