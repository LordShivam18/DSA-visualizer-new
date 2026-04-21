export type TreeToken = number | null;

export type CompleteTreeNode = {
  id: string;
  value: number;
  arrayIndex: number;
  depth: number;
  order: number;
  leftId: string | null;
  rightId: string | null;
  isLeaf: boolean;
};

export type CountLedgerEntry = {
  nodeId: string;
  count: number;
  strategy: "perfect" | "combined";
  leftHeight: number;
  rightHeight: number;
  subtreeIds: string[];
};

export type CountStackFrame = {
  id: string;
  value: number;
  depth: number;
  relation: "root" | "left" | "right";
  leftHeight: number | null;
  rightHeight: number | null;
  leftBoundaryIds: string[];
  rightBoundaryIds: string[];
  leftCount: number | null;
  rightCount: number | null;
  resultCount: number | null;
  status: "active" | "perfect" | "split" | "combined";
};

export type CountPointers = {
  currentId: string | null;
  parentId: string | null;
  probeId: string | null;
  probeDirection: "left" | "right" | null;
  nextChildId: string | null;
  nextDirection: "left" | "right" | null;
  leftHeight: number | null;
  rightHeight: number | null;
  latestReturn: number | null;
  focusNodeId: string | null;
  callDepth: number;
};

export type CountState = {
  input: string;
  tokens: TreeToken[];
  rootId: string | null;
  nodes: CompleteTreeNode[];
  currentPathIds: string[];
  activeSubtreeIds: string[];
  leftBoundaryIds: string[];
  rightBoundaryIds: string[];
  resolvedNodeIds: string[];
  perfectNodeIds: string[];
  splitNodeIds: string[];
  visitedSubtreeIds: string[];
  stack: CountStackFrame[];
  ledger: CountLedgerEntry[];
  result: number | null;
  subtreeCalls: number;
  heightVisits: number;
  shortcutCount: number;
  resolvedCount: number;
};

export type CountActionKind =
  | "parsed"
  | "empty"
  | "init"
  | "enter-subtree"
  | "scan-left"
  | "scan-right"
  | "perfect-subtree"
  | "recurse-left"
  | "recurse-right"
  | "hit-null"
  | "combine"
  | "done";

export type CountTraceStep = {
  step: number;
  action: string;
  actionKind: CountActionKind;
  codeLines: number[];
  state: CountState;
  pointers: CountPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

type MutableNode = CompleteTreeNode;
type MutableFrame = CountStackFrame;

function nodeIdFromIndex(index: number) {
  return `node-${index}`;
}

function cloneNodes(nodes: Map<string, MutableNode>) {
  return [...nodes.values()].sort((a, b) => a.arrayIndex - b.arrayIndex);
}

function cloneStack(stack: MutableFrame[]) {
  return stack.map((frame) => ({
    ...frame,
    leftBoundaryIds: [...frame.leftBoundaryIds],
    rightBoundaryIds: [...frame.rightBoundaryIds],
  }));
}

function cloneLedger(entries: CountLedgerEntry[]) {
  return entries.map((entry) => ({
    ...entry,
    subtreeIds: [...entry.subtreeIds],
  }));
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

function buildSubtreeIdMap(nodes: Map<string, MutableNode>) {
  const memo = new Map<string, string[]>();

  function collect(nodeId: string | null): string[] {
    if (!nodeId) {
      return [];
    }

    const cached = memo.get(nodeId);
    if (cached) {
      return cached;
    }

    const node = nodes.get(nodeId);
    if (!node) {
      return [];
    }

    const ids = [
      nodeId,
      ...collect(node.leftId),
      ...collect(node.rightId),
    ];
    memo.set(nodeId, ids);
    return ids;
  }

  for (const nodeId of nodes.keys()) {
    collect(nodeId);
  }

  return memo;
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

export function formatCountResult(value: number | null) {
  if (value === null) {
    return "counting";
  }

  return String(value);
}

export function formatPathValues(ids: string[], nodes: CompleteTreeNode[]) {
  if (ids.length === 0) {
    return "[]";
  }

  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const values = ids.map((id) => nodesById.get(id)?.value ?? "?");
  return `[${values.join(" -> ")}]`;
}

function codeLinesForMeasure(direction: "left" | "right") {
  return direction === "left"
    ? [3, 11, 12, 13, 14, 15, 17]
    : [4, 20, 21, 22, 23, 24, 26];
}

export function generateTrace(rawInput: string): CountTraceStep[] {
  const tokens = parseTreeInput(rawInput);
  const nodes = buildNodes(tokens);
  const subtreeIdMap = buildSubtreeIdMap(nodes);
  const rootId = nodes.has(nodeIdFromIndex(0)) ? nodeIdFromIndex(0) : null;
  const trace: CountTraceStep[] = [];

  let currentId: string | null = rootId;
  let parentId: string | null = null;
  let probeId: string | null = null;
  let probeDirection: "left" | "right" | null = null;
  let nextChildId: string | null = null;
  let nextDirection: "left" | "right" | null = null;
  let latestReturn: number | null = null;
  let focusNodeId: string | null = null;
  let result: number | null = null;
  let subtreeCalls = 0;
  let heightVisits = 0;
  let shortcutCount = 0;

  const stack: MutableFrame[] = [];
  const ledger: CountLedgerEntry[] = [];
  const visitedSubtreeIds: string[] = [];
  const resolvedNodeIds: string[] = [];
  const perfectNodeIds: string[] = [];
  const splitNodeIds: string[] = [];

  function addUnique(collection: string[], value: string) {
    if (!collection.includes(value)) {
      collection.push(value);
    }
  }

  function addManyUnique(collection: string[], values: string[]) {
    values.forEach((value) => addUnique(collection, value));
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

  function upsertLedger(
    nodeId: string,
    count: number,
    strategy: "perfect" | "combined",
    leftHeight: number,
    rightHeight: number
  ) {
    const subtreeIds = [...(subtreeIdMap.get(nodeId) ?? [nodeId])];
    const existing = ledger.find((entry) => entry.nodeId === nodeId);

    if (existing) {
      existing.count = count;
      existing.strategy = strategy;
      existing.leftHeight = leftHeight;
      existing.rightHeight = rightHeight;
      existing.subtreeIds = subtreeIds;
      return;
    }

    ledger.push({
      nodeId,
      count,
      strategy,
      leftHeight,
      rightHeight,
      subtreeIds,
    });
  }

  function resolveSubtree(
    nodeId: string,
    count: number,
    strategy: "perfect" | "combined",
    leftHeight: number,
    rightHeight: number
  ) {
    const subtreeIds = subtreeIdMap.get(nodeId) ?? [nodeId];
    addManyUnique(resolvedNodeIds, subtreeIds);

    if (strategy === "perfect") {
      addManyUnique(perfectNodeIds, subtreeIds);
    }

    upsertLedger(nodeId, count, strategy, leftHeight, rightHeight);
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
    actionKind: CountActionKind;
    codeLines: number[];
    done: boolean;
    explanationBeginner: string;
    explanationExpert: string;
  }) {
    const activeFrame = stack[stack.length - 1] ?? null;
    const activeRootId = activeFrame?.id ?? currentId;

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
        activeSubtreeIds: activeRootId
          ? [...(subtreeIdMap.get(activeRootId) ?? [activeRootId])]
          : [],
        leftBoundaryIds: [...(activeFrame?.leftBoundaryIds ?? [])],
        rightBoundaryIds: [...(activeFrame?.rightBoundaryIds ?? [])],
        resolvedNodeIds: [...resolvedNodeIds],
        perfectNodeIds: [...perfectNodeIds],
        splitNodeIds: [...splitNodeIds],
        visitedSubtreeIds: [...visitedSubtreeIds],
        stack: cloneStack(stack),
        ledger: cloneLedger(ledger),
        result,
        subtreeCalls,
        heightVisits,
        shortcutCount,
        resolvedCount: resolvedNodeIds.length,
      },
      pointers: {
        currentId,
        parentId,
        probeId,
        probeDirection,
        nextChildId,
        nextDirection,
        leftHeight: activeFrame?.leftHeight ?? null,
        rightHeight: activeFrame?.rightHeight ?? null,
        latestReturn,
        focusNodeId,
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
        ? "Parse the level-order input. The tree is empty."
        : "Parse the complete binary tree and prepare the subtree counter.",
    actionKind: "parsed",
    codeLines: [1],
    done: false,
    explanationBeginner:
      tokens.length === 0
        ? "There are no nodes to count."
        : "Instead of visiting every node one by one, the algorithm first checks whether a whole subtree is already perfect.",
    explanationExpert:
      tokens.length === 0
        ? "The null-root case resolves immediately."
        : "The core optimization compares the extreme left and right heights of each subtree to detect perfect subtrees in O(log n).",
  });

  if (!rootId) {
    currentId = null;
    parentId = null;
    result = 0;
    latestReturn = 0;

    pushStep({
      action: "The root is null, so the tree contains 0 nodes.",
      actionKind: "empty",
      codeLines: [2],
      done: true,
      explanationBeginner:
        "An empty tree has zero nodes by definition.",
      explanationExpert:
        "The base case `if (!root) return 0;` handles the empty input in O(1).",
    });

    return trace;
  }

  currentId = rootId;
  parentId = null;
  nextChildId = rootId;
  nextDirection = null;

  pushStep({
    action: `Start counting from the root node ${nodes.get(rootId)?.value}.`,
    actionKind: "init",
    codeLines: [1, 2, 3, 4],
    done: false,
    explanationBeginner:
      "Every recursive call looks at one subtree root and asks: can I count this whole part instantly, or do I need to split into children?",
    explanationExpert:
      "Each call to `countNodes` either closes immediately with the perfect-tree formula or recurses to smaller complete subtrees.",
  });

  function measureBoundary(
    frame: MutableFrame,
    direction: "left" | "right"
  ) {
    const boundaryLabel = direction === "left" ? "left" : "right";
    let cursorId: string | null = frame.id;
    const pathIds: string[] = [];

    while (cursorId) {
      const node = nodes.get(cursorId);
      if (!node) {
        break;
      }

      pathIds.push(cursorId);
      heightVisits += 1;

      if (direction === "left") {
        frame.leftBoundaryIds = [...pathIds];
        frame.leftHeight = pathIds.length;
      } else {
        frame.rightBoundaryIds = [...pathIds];
        frame.rightHeight = pathIds.length;
      }

      currentId = frame.id;
      parentId = findParentId(frame.id);
      probeId = cursorId;
      probeDirection = direction;
      nextChildId = null;
      nextDirection = null;
      focusNodeId = null;
      latestReturn = frame.resultCount;

      pushStep({
        action: `Walk down the ${boundaryLabel} boundary and visit node ${node.value}. ${boundaryLabel[0].toUpperCase() + boundaryLabel.slice(1)} height becomes ${pathIds.length}.`,
        actionKind: direction === "left" ? "scan-left" : "scan-right",
        codeLines: codeLinesForMeasure(direction),
        done: false,
        explanationBeginner:
          direction === "left"
            ? "Keep stepping to the far-left child to measure how tall this subtree is on its left edge."
            : "Keep stepping to the far-right child to measure the height on the opposite edge.",
        explanationExpert:
          direction === "left"
            ? "This simulates `leftDepth(root)` by following only `node->left` pointers."
            : "This simulates `rightDepth(root)` by following only `node->right` pointers.",
      });

      cursorId = direction === "left" ? node.leftId : node.rightId;
    }

    currentId = frame.id;
    parentId = findParentId(frame.id);
    probeId = null;
    probeDirection = null;
    nextChildId = null;
    nextDirection = null;
    focusNodeId = null;

    const finalHeight =
      direction === "left" ? frame.leftHeight ?? 0 : frame.rightHeight ?? 0;

    pushStep({
      action: `Finished measuring the ${boundaryLabel} boundary for subtree ${frame.value}. ${boundaryLabel[0].toUpperCase() + boundaryLabel.slice(1)} height = ${finalHeight}.`,
      actionKind: direction === "left" ? "scan-left" : "scan-right",
      codeLines: codeLinesForMeasure(direction),
      done: false,
      explanationBeginner:
        direction === "left"
          ? "Now we know how many levels appear on the far-left side of this subtree."
          : "With both extreme heights measured, the algorithm can decide whether this subtree is perfect.",
      explanationExpert:
        direction === "left"
          ? "The measured left height will be compared against the right height from the same subtree root."
          : "In a complete tree, equal extreme heights imply every level is full, so the subtree is perfect.",
    });
  }

  function countNodes(
    nodeId: string | null,
    relation: "root" | "left" | "right"
  ): number {
    if (!nodeId) {
      currentId = stack[stack.length - 1]?.id ?? null;
      parentId = findParentId(currentId);
      probeId = null;
      probeDirection = null;
      nextChildId = null;
      nextDirection = null;
      focusNodeId = null;
      latestReturn = 0;

      pushStep({
        action: "This child pointer is null, so that subtree contributes 0 nodes.",
        actionKind: "hit-null",
        codeLines: [2],
        done: false,
        explanationBeginner:
          "A missing child means there is no subtree to count there.",
        explanationExpert:
          "The recursive base case returns 0 for a null subtree.",
      });

      return 0;
    }

    const node = nodes.get(nodeId);
    if (!node) {
      return 0;
    }

    subtreeCalls += 1;

    const frame: MutableFrame = {
      id: nodeId,
      value: node.value,
      depth: stack.length,
      relation,
      leftHeight: null,
      rightHeight: null,
      leftBoundaryIds: [],
      rightBoundaryIds: [],
      leftCount: null,
      rightCount: null,
      resultCount: null,
      status: "active",
    };

    stack.push(frame);
    addUnique(visitedSubtreeIds, nodeId);

    currentId = nodeId;
    parentId = findParentId(nodeId);
    probeId = null;
    probeDirection = null;
    nextChildId = null;
    nextDirection = null;
    focusNodeId = null;
    latestReturn = null;

    pushStep({
      action: `Enter the subtree rooted at ${node.value}. Measure both extreme heights before choosing the counting rule.`,
      actionKind: "enter-subtree",
      codeLines: [1, 2, 3, 4],
      done: false,
      explanationBeginner:
        "This subtree might already be full. If it is, we can count every node in one shot.",
      explanationExpert:
        "The optimization hinges on testing whether `leftDepth(root) == rightDepth(root)` for the current subtree.",
    });

    measureBoundary(frame, "left");
    measureBoundary(frame, "right");

    const leftHeight = frame.leftHeight ?? 0;
    const rightHeight = frame.rightHeight ?? 0;

    if (leftHeight === rightHeight) {
      const quickCount = 2 ** leftHeight - 1;

      frame.status = "perfect";
      frame.resultCount = quickCount;
      shortcutCount += 1;
      latestReturn = quickCount;
      focusNodeId = nodeId;
      currentId = nodeId;
      parentId = findParentId(nodeId);

      resolveSubtree(nodeId, quickCount, "perfect", leftHeight, rightHeight);

      pushStep({
        action: `Left height and right height are both ${leftHeight}, so subtree ${node.value} is perfect. Count it instantly with 2^${leftHeight} - 1 = ${quickCount}.`,
        actionKind: "perfect-subtree",
        codeLines: [5, 6],
        done: false,
        explanationBeginner:
          "Matching outer heights mean this whole subtree is completely full, so there is no need to recurse inside it.",
        explanationExpert:
          "For a complete tree, equal extreme heights prove perfect fullness, so the subtree size is `2^h - 1`.",
      });

      stack.pop();
      return quickCount;
    }

    frame.status = "split";
    addUnique(splitNodeIds, nodeId);
    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = node.leftId;
    nextDirection = "left";
    focusNodeId = nodeId;
    latestReturn = null;

    pushStep({
      action: `Heights differ (${leftHeight} vs ${rightHeight}), so subtree ${node.value} is not perfect. Count the left subtree next.`,
      actionKind: "recurse-left",
      codeLines: [8],
      done: false,
      explanationBeginner:
        "Because one side is shorter, this subtree is not completely full. We have to break the job into smaller subtrees.",
      explanationExpert:
        "The algorithm falls through to the recursive case when `leftHeight != rightHeight`.",
    });

    const leftCount = countNodes(node.leftId, "left");
    frame.leftCount = leftCount;

    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = node.rightId;
    nextDirection = "right";
    focusNodeId = nodeId;
    latestReturn = leftCount;

    pushStep({
      action: node.rightId
        ? `The left subtree returned ${leftCount}. Now count the right subtree of ${node.value}.`
        : `The left subtree returned ${leftCount}. The right child is missing, so the next recursive call will return 0.`,
      actionKind: "recurse-right",
      codeLines: [8],
      done: false,
      explanationBeginner:
        "After counting the left side, the algorithm checks the right side and then adds everything together with the root.",
      explanationExpert:
        "This mirrors `1 + countNodes(root->left) + countNodes(root->right)` for the current subtree root.",
    });

    const rightCount = countNodes(node.rightId, "right");
    frame.rightCount = rightCount;
    frame.resultCount = 1 + leftCount + rightCount;
    frame.status = "combined";

    latestReturn = frame.resultCount;
    focusNodeId = nodeId;
    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = null;
    nextDirection = null;

    resolveSubtree(nodeId, frame.resultCount, "combined", leftHeight, rightHeight);

    pushStep({
      action: `Combine the current root and both subtree counts: 1 + ${leftCount} + ${rightCount} = ${frame.resultCount}.`,
      actionKind: "combine",
      codeLines: [8],
      done: false,
      explanationBeginner:
        "The root contributes 1 node, then the left and right subtree counts are added on top of it.",
      explanationExpert:
        "Only the incomplete side keeps recursing deeply, so the complete-tree recurrence stays below O(n) and resolves in O(log^2 n).",
    });

    stack.pop();
    return frame.resultCount;
  }

  result = countNodes(rootId, "root");
  currentId = rootId;
  parentId = null;
  probeId = null;
  probeDirection = null;
  nextChildId = null;
  nextDirection = null;
  focusNodeId = rootId;
  latestReturn = result;

  pushStep({
    action: `Counting is finished. The complete binary tree contains ${result} nodes.`,
    actionKind: "done",
    codeLines: [1, 8],
    done: true,
    explanationBeginner:
      "Perfect subtrees were counted instantly, and only the uneven parts needed extra recursion.",
    explanationExpert:
      "Each level performs O(log n) height work, and only one incomplete branch survives per level, giving O(log^2 n) time with O(log n) recursion depth.",
  });

  return trace;
}
