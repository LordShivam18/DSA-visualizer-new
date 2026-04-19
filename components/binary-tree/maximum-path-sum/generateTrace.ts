export type TreeToken = number | null;

export type MaxPathTreeNode = {
  id: string;
  value: number;
  arrayIndex: number;
  depth: number;
  order: number;
  leftId: string | null;
  rightId: string | null;
  isLeaf: boolean;
};

export type NodeGainRecord = {
  nodeId: string;
  gain: number;
};

export type MaxPathStackFrame = {
  id: string;
  value: number;
  depth: number;
  relation: "root" | "left" | "right";
  leftRawGain: number | null;
  rightRawGain: number | null;
  usableLeft: number;
  usableRight: number;
  throughSum: number | null;
  upwardGain: number | null;
  status: "active" | "evaluated";
};

export type MaxPathPointers = {
  currentId: string | null;
  parentId: string | null;
  nextChildId: string | null;
  nextDirection: "left" | "right" | null;
  focusNodeId: string | null;
  leftGain: number | null;
  rightGain: number | null;
  usableLeft: number;
  usableRight: number;
  throughSum: number | null;
  upwardGain: number | null;
  callDepth: number;
};

export type MaxPathState = {
  input: string;
  tokens: TreeToken[];
  rootId: string | null;
  nodes: MaxPathTreeNode[];
  currentPathIds: string[];
  candidatePathIds: string[];
  returnPathIds: string[];
  bestPathIds: string[];
  exploredIds: string[];
  visitOrderIds: string[];
  evaluatedIds: string[];
  negativeGainIds: string[];
  stack: MaxPathStackFrame[];
  returnedGains: NodeGainRecord[];
  globalBest: number | null;
  visitedCount: number;
  nullHits: number;
};

export type MaxPathActionKind =
  | "parsed"
  | "empty"
  | "init"
  | "enter-node"
  | "explore-left"
  | "receive-left"
  | "explore-right"
  | "receive-right"
  | "hit-null"
  | "evaluate-through"
  | "update-best"
  | "keep-best"
  | "compute-return"
  | "done";

export type MaxPathTraceStep = {
  step: number;
  action: string;
  actionKind: MaxPathActionKind;
  codeLines: number[];
  state: MaxPathState;
  pointers: MaxPathPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

type MutableNode = MaxPathTreeNode;
type MutableFrame = MaxPathStackFrame;

type GainReturn = {
  gain: number;
  pathIds: string[];
};

function nodeIdFromIndex(index: number) {
  return `node-${index}`;
}

function cloneNodes(nodes: Map<string, MutableNode>) {
  return [...nodes.values()].sort((a, b) => a.arrayIndex - b.arrayIndex);
}

function cloneStack(stack: MutableFrame[]) {
  return stack.map((frame) => ({ ...frame }));
}

function cloneReturnedGains(values: NodeGainRecord[]) {
  return values.map((value) => ({ ...value }));
}

function buildNodes(tokens: TreeToken[]) {
  const nodes = new Map<string, MutableNode>();

  function ensureNode(index: number): string | null {
    if (index >= tokens.length || tokens[index] === null) {
      return null;
    }

    const id = nodeIdFromIndex(index);
    const existing = nodes.get(id);
    if (existing) {
      return existing.id;
    }

    const depth = Math.floor(Math.log2(index + 1));
    const levelStartIndex = 2 ** depth - 1;
    const node: MutableNode = {
      id,
      value: tokens[index] as number,
      arrayIndex: index,
      depth,
      order: index - levelStartIndex,
      leftId: null,
      rightId: null,
      isLeaf: false,
    };

    nodes.set(id, node);

    const leftId = ensureNode(index * 2 + 1);
    const rightId = ensureNode(index * 2 + 2);
    node.leftId = leftId;
    node.rightId = rightId;
    node.isLeaf = !leftId && !rightId;

    return id;
  }

  ensureNode(0);
  return nodes;
}

export function parseTreeInput(rawInput: string) {
  const trimmed = rawInput.trim();
  if (!trimmed || trimmed === "[]") {
    return [];
  }

  const withoutBrackets = trimmed.replace(/^\[/, "").replace(/\]$/, "");
  const pieces = withoutBrackets
    .split(",")
    .map((piece) => piece.trim())
    .filter((piece) => piece.length > 0);

  return pieces.map((piece) => {
    if (/^(null|nil|none|#)$/i.test(piece)) {
      return null;
    }

    if (/^-?\d+$/.test(piece)) {
      return Number(piece);
    }

    return null;
  });
}

export function formatBestResult(value: number | null) {
  if (value === null) {
    return "searching";
  }

  return String(value);
}

export function formatPathValues(ids: string[], nodes: MaxPathTreeNode[]) {
  if (ids.length === 0) {
    return "[]";
  }

  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  return `[${ids.map((id) => nodesById.get(id)?.value ?? "?").join(" -> ")}]`;
}

export function generateTrace(rawInput: string): MaxPathTraceStep[] {
  const tokens = parseTreeInput(rawInput);
  const nodes = buildNodes(tokens);
  const rootId = nodes.has(nodeIdFromIndex(0)) ? nodeIdFromIndex(0) : null;
  const trace: MaxPathTraceStep[] = [];

  let currentId: string | null = null;
  let parentId: string | null = null;
  let nextChildId: string | null = null;
  let nextDirection: "left" | "right" | null = null;
  let focusNodeId: string | null = null;
  let leftGain: number | null = null;
  let rightGain: number | null = null;
  let usableLeft = 0;
  let usableRight = 0;
  let throughSum: number | null = null;
  let upwardGain: number | null = null;

  let globalBest: number | null = null;
  let bestPeakId: string | null = null;
  let nullHits = 0;

  let candidatePathIds: string[] = [];
  let returnPathIds: string[] = [];
  let bestPathIds: string[] = [];

  const stack: MutableFrame[] = [];
  const returnedGains: NodeGainRecord[] = [];
  const exploredIds: string[] = [];
  const visitOrderIds: string[] = [];
  const evaluatedIds: string[] = [];
  const negativeGainIds: string[] = [];

  function addUnique(collection: string[], value: string) {
    if (!collection.includes(value)) {
      collection.push(value);
    }
  }

  function addOrUpdateReturn(nodeId: string, gain: number) {
    const existing = returnedGains.find((entry) => entry.nodeId === nodeId);
    if (existing) {
      existing.gain = gain;
      return;
    }

    returnedGains.push({ nodeId, gain });
  }

  function findParentId(childId: string | null) {
    if (!childId) {
      return null;
    }

    for (const node of nodes.values()) {
      if (node.leftId === childId || node.rightId === childId) {
        return node.id;
      }
    }

    return null;
  }

  function resetEvaluationFocus() {
    leftGain = null;
    rightGain = null;
    usableLeft = 0;
    usableRight = 0;
    throughSum = null;
    upwardGain = null;
    candidatePathIds = [];
    returnPathIds = [];
  }

  function buildCandidatePath(
    nodeId: string,
    leftReturn: GainReturn,
    rightReturn: GainReturn,
    leftUse: number,
    rightUse: number
  ) {
    const leftSegment = leftUse > 0 ? [...leftReturn.pathIds].reverse() : [];
    const rightSegment = rightUse > 0 ? [...rightReturn.pathIds] : [];
    return [...leftSegment, nodeId, ...rightSegment];
  }

  function buildReturnPath(
    nodeId: string,
    leftReturn: GainReturn,
    rightReturn: GainReturn,
    leftUse: number,
    rightUse: number
  ) {
    if (leftUse <= 0 && rightUse <= 0) {
      return [nodeId];
    }

    if (leftUse >= rightUse) {
      return [nodeId, ...leftReturn.pathIds];
    }

    return [nodeId, ...rightReturn.pathIds];
  }

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: MaxPathActionKind;
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
        tokens,
        rootId,
        nodes: cloneNodes(nodes),
        currentPathIds: stack.map((frame) => frame.id),
        candidatePathIds: [...candidatePathIds],
        returnPathIds: [...returnPathIds],
        bestPathIds: [...bestPathIds],
        exploredIds: [...exploredIds],
        visitOrderIds: [...visitOrderIds],
        evaluatedIds: [...evaluatedIds],
        negativeGainIds: [...negativeGainIds],
        stack: cloneStack(stack),
        returnedGains: cloneReturnedGains(returnedGains),
        globalBest,
        visitedCount: exploredIds.length,
        nullHits,
      },
      pointers: {
        currentId,
        parentId,
        nextChildId,
        nextDirection,
        focusNodeId,
        leftGain,
        rightGain,
        usableLeft,
        usableRight,
        throughSum,
        upwardGain,
        callDepth: stack.length,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      tokens.length === 0
        ? "Parse the input. The tree is empty."
        : "Parse the level-order tree and prepare the recursive gain computation.",
    actionKind: "parsed",
    codeLines: [1, 2, 7],
    done: false,
    explanationBeginner:
      tokens.length === 0
        ? "There is no path in an empty tree, so the visualizer will finish immediately."
        : "Each recursive call will ask: what is the best upward gain from this node, and does the best overall path pass through it?",
    explanationExpert:
      tokens.length === 0
        ? "The visualizer returns 0 for an empty custom input, even though the original problem assumes a non-empty tree."
        : "The key distinction is between a node's local split-path sum and the single-branch gain it is allowed to return upward.",
  });

  if (!rootId) {
    globalBest = 0;

    pushStep({
      action: "The root is null, so there is no path to evaluate and the visualizer returns 0.",
      actionKind: "empty",
      codeLines: [1, 2, 3, 4],
      done: true,
      explanationBeginner:
        "An empty tree has no non-empty path, so we stop here for the visualizer.",
      explanationExpert:
        "This is a visualization-safe fallback for empty custom input outside the original constraints.",
    });

    return trace;
  }

  currentId = rootId;
  parentId = null;
  nextChildId = rootId;
  nextDirection = null;
  focusNodeId = rootId;

  pushStep({
    action: `Initialize the global best and start DFS at the root node ${nodes.get(rootId)?.value}.`,
    actionKind: "init",
    codeLines: [1, 2, 3],
    done: false,
    explanationBeginner:
      "We will walk the tree bottom-up. Every node will compute a best path through itself and a smaller gain that can travel upward.",
    explanationExpert:
      "The outer function seeds the global optimum and delegates all real work to the postorder `maxGain` recursion.",
  });

  function dfs(
    nodeId: string | null,
    relation: "root" | "left" | "right"
  ): GainReturn {
    const callerFrame = stack[stack.length - 1] ?? null;

    if (!nodeId) {
      nullHits += 1;
      currentId = null;
      parentId = callerFrame?.id ?? null;
      nextChildId = null;
      nextDirection = null;
      focusNodeId = null;
      resetEvaluationFocus();
      upwardGain = 0;

      pushStep({
        action: "Reached a null child, so this branch contributes a gain of 0.",
        actionKind: "hit-null",
        codeLines: [8],
        done: false,
        explanationBeginner:
          "A missing child cannot help any path, so it returns 0.",
        explanationExpert:
          "The null-node base case returns the additive neutral value for gain propagation.",
      });

      return { gain: 0, pathIds: [] };
    }

    const node = nodes.get(nodeId);
    if (!node) {
      return { gain: 0, pathIds: [] };
    }

    const frame: MutableFrame = {
      id: nodeId,
      value: node.value,
      depth: stack.length,
      relation,
      leftRawGain: null,
      rightRawGain: null,
      usableLeft: 0,
      usableRight: 0,
      throughSum: null,
      upwardGain: null,
      status: "active",
    };

    stack.push(frame);
    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = null;
    nextDirection = null;
    focusNodeId = nodeId;
    resetEvaluationFocus();

    addUnique(exploredIds, nodeId);
    addUnique(visitOrderIds, nodeId);

    pushStep({
      action: `Enter node ${node.value}. This call must compute the best path passing through it and the gain it can return upward.`,
      actionKind: "enter-node",
      codeLines: [7, 9, 10],
      done: false,
      explanationBeginner:
        "This node waits for both children first, because the best path through it may use one side, both sides, or neither side.",
      explanationExpert:
        "The recursion is postorder: child gains must be known before evaluating the current node's split-path candidate.",
    });

    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = node.leftId;
    nextDirection = "left";
    focusNodeId = nodeId;
    resetEvaluationFocus();

    pushStep({
      action: node.leftId
        ? `Recurse into the left child of node ${node.value}.`
        : `Node ${node.value} has no left child, so the left recursive call will immediately return 0.`,
      actionKind: "explore-left",
      codeLines: [9],
      done: false,
      explanationBeginner:
        "The left side is explored first so its gain is available before the node is evaluated.",
      explanationExpert:
        "The left gain is computed by `maxGain(node->left)` before any clamping or local path comparison occurs.",
    });

    const leftReturn = dfs(node.leftId, "left");
    frame.leftRawGain = leftReturn.gain;

    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = node.leftId;
    nextDirection = "left";
    focusNodeId = nodeId;
    leftGain = leftReturn.gain;
    rightGain = null;
    usableLeft = Math.max(leftReturn.gain, 0);
    usableRight = 0;
    throughSum = null;
    upwardGain = null;
    candidatePathIds = [];
    returnPathIds = [];

    pushStep({
      action:
        leftReturn.gain > 0
          ? `The left subtree returns gain ${leftReturn.gain}, so it is useful for paths through node ${node.value}.`
          : `The left subtree returns gain ${leftReturn.gain}, so it will be clamped to 0 if using it would hurt the path.`,
      actionKind: "receive-left",
      codeLines: [9, 11],
      done: false,
      explanationBeginner:
        "Negative gains are not worth carrying upward, so they get treated like 0 when we build a path through the current node.",
      explanationExpert:
        "The raw child gain is recorded first, but the split-path formula uses `max(childGain, 0)` to prune harmful branches.",
    });

    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = node.rightId;
    nextDirection = "right";
    focusNodeId = nodeId;
    leftGain = leftReturn.gain;
    rightGain = null;
    usableLeft = Math.max(leftReturn.gain, 0);
    usableRight = 0;
    throughSum = null;
    upwardGain = null;
    candidatePathIds = [];
    returnPathIds = [];

    pushStep({
      action: node.rightId
        ? `Now recurse into the right child of node ${node.value}.`
        : `Node ${node.value} has no right child, so the right recursive call will also return 0.`,
      actionKind: "explore-right",
      codeLines: [10],
      done: false,
      explanationBeginner:
        "After the left gain is known, DFS checks the right side before deciding the best path through this node.",
      explanationExpert:
        "The right gain is computed independently so the current node can compare a split path versus a single upward branch.",
    });

    const rightReturn = dfs(node.rightId, "right");
    frame.rightRawGain = rightReturn.gain;

    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = node.rightId;
    nextDirection = "right";
    focusNodeId = nodeId;
    leftGain = leftReturn.gain;
    rightGain = rightReturn.gain;
    usableLeft = Math.max(leftReturn.gain, 0);
    usableRight = Math.max(rightReturn.gain, 0);
    throughSum = null;
    upwardGain = null;
    candidatePathIds = [];
    returnPathIds = [];

    pushStep({
      action:
        rightReturn.gain > 0
          ? `The right subtree returns gain ${rightReturn.gain}, so it can help the path through node ${node.value}.`
          : `The right subtree returns gain ${rightReturn.gain}, so it will be clamped to 0 if it hurts the total.`,
      actionKind: "receive-right",
      codeLines: [10, 12],
      done: false,
      explanationBeginner:
        "Now both child gains are known, so this node can finally compare path options.",
      explanationExpert:
        "Both raw gains are available; the next step is to clamp negatives and form the split-path candidate through the current node.",
    });

    frame.usableLeft = Math.max(leftReturn.gain, 0);
    frame.usableRight = Math.max(rightReturn.gain, 0);
    frame.throughSum = node.value + frame.usableLeft + frame.usableRight;
    candidatePathIds = buildCandidatePath(
      nodeId,
      leftReturn,
      rightReturn,
      frame.usableLeft,
      frame.usableRight
    );
    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = null;
    nextDirection = null;
    focusNodeId = nodeId;
    leftGain = leftReturn.gain;
    rightGain = rightReturn.gain;
    usableLeft = frame.usableLeft;
    usableRight = frame.usableRight;
    throughSum = frame.throughSum;
    upwardGain = null;
    returnPathIds = [];

    pushStep({
      action: `Evaluate the split path through node ${node.value}: ${node.value} + ${frame.usableLeft} + ${frame.usableRight} = ${frame.throughSum}.`,
      actionKind: "evaluate-through",
      codeLines: [11, 12, 13],
      done: false,
      explanationBeginner:
        "This is the best complete path that uses the current node as the turning point. It may take the left side, the right side, both, or neither.",
      explanationExpert:
        "The split-path candidate is `node->val + max(leftGain, 0) + max(rightGain, 0)`, which is eligible for the global optimum but cannot be returned upward intact.",
    });

    if (globalBest === null || frame.throughSum > globalBest) {
      globalBest = frame.throughSum;
      bestPathIds = [...candidatePathIds];
      bestPeakId = nodeId;

      pushStep({
        action: `Update the global best to ${globalBest} because the path through node ${node.value} is the strongest seen so far.`,
        actionKind: "update-best",
        codeLines: [14],
        done: false,
        explanationBeginner:
          "The answer can pass through any node, not just the root, so every node gets a chance to improve the global best.",
        explanationExpert:
          "The global optimum is updated against the split-path candidate at every node.",
      });
    } else {
      pushStep({
        action: `Keep the global best at ${globalBest}; the path through node ${node.value} is not larger.`,
        actionKind: "keep-best",
        codeLines: [14],
        done: false,
        explanationBeginner:
          "This node's split path is valid, but an even better path was already found earlier.",
        explanationExpert:
          "The global optimum remains unchanged because `throughNode <= best`.",
      });
    }

    frame.upwardGain =
      node.value + Math.max(frame.usableLeft, frame.usableRight);
    returnPathIds = buildReturnPath(
      nodeId,
      leftReturn,
      rightReturn,
      frame.usableLeft,
      frame.usableRight
    );
    frame.status = "evaluated";
    addUnique(evaluatedIds, nodeId);
    addOrUpdateReturn(nodeId, frame.upwardGain);
    if (frame.upwardGain < 0) {
      addUnique(negativeGainIds, nodeId);
    }

    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = null;
    nextDirection = null;
    focusNodeId = nodeId;
    leftGain = leftReturn.gain;
    rightGain = rightReturn.gain;
    usableLeft = frame.usableLeft;
    usableRight = frame.usableRight;
    throughSum = frame.throughSum;
    upwardGain = frame.upwardGain;

    pushStep({
      action: `Return upward gain ${frame.upwardGain} from node ${node.value}. Only one side can continue to the parent.`,
      actionKind: "compute-return",
      codeLines: [15],
      done: false,
      explanationBeginner:
        "A parent can only extend the path through one child, so the returned gain keeps the better of the left and right contributions, not both.",
      explanationExpert:
        "The upward return is `node->val + max(max(leftGain, 0), max(rightGain, 0))`, which is a single-branch gain rather than the split-path total.",
    });

    stack.pop();
    currentId = stack[stack.length - 1]?.id ?? null;
    parentId = findParentId(currentId);
    focusNodeId = currentId;

    return {
      gain: frame.upwardGain,
      pathIds: returnPathIds,
    };
  }

  const rootReturn = dfs(rootId, "root");

  currentId = bestPeakId;
  parentId = findParentId(bestPeakId);
  nextChildId = null;
  nextDirection = null;
  focusNodeId = bestPeakId;
  leftGain = null;
  rightGain = null;
  usableLeft = 0;
  usableRight = 0;
  throughSum = globalBest;
  upwardGain = rootReturn.gain;
  candidatePathIds = [];
  returnPathIds = [];

  pushStep({
    action:
      globalBest === null
        ? "The DFS finished without evaluating any node."
        : `The DFS finished. The maximum path sum is ${globalBest}.`,
    actionKind: "done",
    codeLines: [4],
    done: true,
    explanationBeginner:
      globalBest === null
        ? "No path was found."
        : "The green path is the strongest path anywhere in the tree, even if it does not pass through the root.",
    explanationExpert:
      globalBest === null
        ? "No valid path existed."
        : "The recursion touched each node once, producing O(n) time and O(h) stack space while maintaining a global optimum over split-path candidates.",
  });

  return trace;
}
