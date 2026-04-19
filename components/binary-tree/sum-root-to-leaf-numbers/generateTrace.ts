export type TreeToken = number | null;

export type SumRootTreeNode = {
  id: string;
  value: number;
  arrayIndex: number;
  depth: number;
  order: number;
  leftId: string | null;
  rightId: string | null;
  isLeaf: boolean;
};

export type CompletedPath = {
  ids: string[];
  value: number;
  leafId: string;
};

export type SubtreeReturnValue = {
  nodeId: string;
  value: number;
};

export type SumRootStackFrame = {
  id: string;
  value: number;
  depth: number;
  relation: "root" | "left" | "right";
  incomingNumber: number;
  formedNumber: number;
  leftReturn: number | null;
  rightReturn: number | null;
  totalReturn: number | null;
  status: "active" | "leaf" | "combined";
};

export type SumRootPointers = {
  currentId: string | null;
  parentId: string | null;
  nextChildId: string | null;
  nextDirection: "left" | "right" | null;
  focusLeafId: string | null;
  currentNumber: number;
  latestReturn: number | null;
  totalSoFar: number;
  callDepth: number;
};

export type SumRootState = {
  input: string;
  tokens: TreeToken[];
  rootId: string | null;
  nodes: SumRootTreeNode[];
  currentPathIds: string[];
  completedPaths: CompletedPath[];
  exploredIds: string[];
  visitOrderIds: string[];
  checkedLeafIds: string[];
  stack: SumRootStackFrame[];
  returnedSums: SubtreeReturnValue[];
  totalSumSoFar: number;
  result: number | null;
  visitedCount: number;
  nullHits: number;
};

export type SumRootActionKind =
  | "parsed"
  | "empty"
  | "init"
  | "enter-node"
  | "check-leaf"
  | "leaf-complete"
  | "explore-left"
  | "explore-right"
  | "hit-null"
  | "combine"
  | "done";

export type SumRootTraceStep = {
  step: number;
  action: string;
  actionKind: SumRootActionKind;
  codeLines: number[];
  state: SumRootState;
  pointers: SumRootPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

type MutableNode = SumRootTreeNode;
type MutableFrame = SumRootStackFrame;

function nodeIdFromIndex(index: number) {
  return `node-${index}`;
}

function cloneNodes(nodes: Map<string, MutableNode>) {
  return [...nodes.values()].sort((a, b) => a.arrayIndex - b.arrayIndex);
}

function cloneStack(stack: MutableFrame[]) {
  return stack.map((frame) => ({ ...frame }));
}

function cloneCompletedPaths(paths: CompletedPath[]) {
  return paths.map((path) => ({
    ids: [...path.ids],
    value: path.value,
    leafId: path.leafId,
  }));
}

function cloneReturnedSums(values: SubtreeReturnValue[]) {
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

export function formatSumResult(value: number | null) {
  if (value === null) {
    return "building";
  }

  return String(value);
}

export function formatDigitPath(ids: string[], nodes: SumRootTreeNode[]) {
  if (ids.length === 0) {
    return "[]";
  }

  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  return ids.map((id) => nodesById.get(id)?.value ?? "?").join("->");
}

export function formatPathNumber(ids: string[], nodes: SumRootTreeNode[]) {
  if (ids.length === 0) {
    return "0";
  }

  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  return ids.map((id) => String(nodesById.get(id)?.value ?? "?")).join("");
}

export function generateTrace(rawInput: string): SumRootTraceStep[] {
  const tokens = parseTreeInput(rawInput);
  const nodes = buildNodes(tokens);
  const rootId = nodes.has(nodeIdFromIndex(0)) ? nodeIdFromIndex(0) : null;
  const trace: SumRootTraceStep[] = [];

  let currentId: string | null = null;
  let parentId: string | null = null;
  let nextChildId: string | null = null;
  let nextDirection: "left" | "right" | null = null;
  let focusLeafId: string | null = null;
  let result: number | null = null;
  let totalSumSoFar = 0;
  let nullHits = 0;

  const stack: MutableFrame[] = [];
  const completedPaths: CompletedPath[] = [];
  const returnedSums: SubtreeReturnValue[] = [];
  const exploredIds: string[] = [];
  const visitOrderIds: string[] = [];
  const checkedLeafIds: string[] = [];

  function addUnique(collection: string[], value: string) {
    if (!collection.includes(value)) {
      collection.push(value);
    }
  }

  function addOrUpdateReturn(nodeId: string, value: number) {
    const existing = returnedSums.find((item) => item.nodeId === nodeId);
    if (existing) {
      existing.value = value;
      return;
    }

    returnedSums.push({ nodeId, value });
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

  function getPointerFrame() {
    if (!currentId) {
      return stack[stack.length - 1];
    }

    for (let index = stack.length - 1; index >= 0; index -= 1) {
      if (stack[index].id === currentId) {
        return stack[index];
      }
    }

    return stack[stack.length - 1];
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
    actionKind: SumRootActionKind;
    codeLines: number[];
    done: boolean;
    explanationBeginner: string;
    explanationExpert: string;
  }) {
    const pointerFrame = getPointerFrame();

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
        completedPaths: cloneCompletedPaths(completedPaths),
        exploredIds: [...exploredIds],
        visitOrderIds: [...visitOrderIds],
        checkedLeafIds: [...checkedLeafIds],
        stack: cloneStack(stack),
        returnedSums: cloneReturnedSums(returnedSums),
        totalSumSoFar,
        result,
        visitedCount: exploredIds.length,
        nullHits,
      },
      pointers: {
        currentId,
        parentId,
        nextChildId,
        nextDirection,
        focusLeafId,
        currentNumber: pointerFrame?.formedNumber ?? 0,
        latestReturn: pointerFrame?.totalReturn ?? null,
        totalSoFar: totalSumSoFar,
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
        : "Parse the level-order tree of digits and prepare the DFS.",
    actionKind: "parsed",
    codeLines: [1, 2],
    done: false,
    explanationBeginner:
      tokens.length === 0
        ? "There are no root-to-leaf paths, so the total will be zero."
        : "Each root-to-leaf path will be read like a number made from its digits.",
    explanationExpert:
      tokens.length === 0
        ? "A null root yields the additive identity 0."
        : "The DFS will propagate a prefix number downward using `next = current * 10 + digit`.",
  });

  if (!rootId) {
    result = 0;

    pushStep({
      action: "The root is null, so the total sum of all root-to-leaf numbers is 0.",
      actionKind: "empty",
      codeLines: [6],
      done: true,
      explanationBeginner:
        "An empty tree contributes no numbers at all.",
      explanationExpert:
        "The recursion returns 0 immediately for the null-root case.",
    });

    return trace;
  }

  currentId = rootId;
  parentId = null;
  nextChildId = rootId;
  nextDirection = null;

  pushStep({
    action: `Start the DFS at the root digit ${nodes.get(rootId)?.value}.`,
    actionKind: "init",
    codeLines: [1, 2, 5],
    done: false,
    explanationBeginner:
      "The running number starts at 0, and each step appends one more digit.",
    explanationExpert:
      "The helper begins with `currentNumber = 0` so the root digit becomes the first decimal place.",
  });

  function dfs(
    nodeId: string | null,
    currentNumberBefore: number,
    relation: "root" | "left" | "right"
  ): number {
    const callerFrame = stack[stack.length - 1] ?? null;

    if (!nodeId) {
      nullHits += 1;
      currentId = null;
      parentId = callerFrame?.id ?? null;
      nextChildId = null;
      nextDirection = null;
      focusLeafId = null;

      pushStep({
        action: "Reached a null child, so this branch contributes 0 to the total.",
        actionKind: "hit-null",
        codeLines: [6],
        done: false,
        explanationBeginner:
          "A missing child does not make a number, so it adds nothing.",
        explanationExpert:
          "The null-node base case returns the additive identity 0.",
      });

      return 0;
    }

    const node = nodes.get(nodeId);
    if (!node) {
      return 0;
    }

    const formedNumber = currentNumberBefore * 10 + node.value;
    const frame: MutableFrame = {
      id: nodeId,
      value: node.value,
      depth: stack.length,
      relation,
      incomingNumber: currentNumberBefore,
      formedNumber,
      leftReturn: null,
      rightReturn: null,
      totalReturn: null,
      status: "active",
    };

    stack.push(frame);
    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = null;
    nextDirection = null;
    focusLeafId = null;

    addUnique(exploredIds, nodeId);
    addUnique(visitOrderIds, nodeId);

    pushStep({
      action: `Enter node ${node.value}. Append it to ${currentNumberBefore} to form ${formedNumber}.`,
      actionKind: "enter-node",
      codeLines: [7],
      done: false,
      explanationBeginner:
        "Moving from a parent to a child shifts the old number left by one digit, then adds the new digit.",
      explanationExpert:
        "Decimal concatenation is encoded as `current * 10 + digit`, which preserves prefix order.",
    });

    if (node.isLeaf) {
      focusLeafId = nodeId;
      addUnique(checkedLeafIds, nodeId);

      pushStep({
        action: `Node ${node.value} is a leaf, so the completed root-to-leaf number is ${formedNumber}.`,
        actionKind: "check-leaf",
        codeLines: [8, 9],
        done: false,
        explanationBeginner:
          "At a leaf, the digits collected so far make one full number to add into the answer.",
        explanationExpert:
          "A leaf returns its fully constructed prefix number without further recursion.",
      });

      frame.status = "leaf";
      frame.totalReturn = formedNumber;
      totalSumSoFar += formedNumber;
      addOrUpdateReturn(nodeId, formedNumber);
      completedPaths.push({
        ids: stack.map((item) => item.id),
        value: formedNumber,
        leafId: nodeId,
      });

      pushStep({
        action: `Add ${formedNumber} into the running total. The accumulated sum is now ${totalSumSoFar}.`,
        actionKind: "leaf-complete",
        codeLines: [9],
        done: false,
        explanationBeginner:
          "Every leaf contributes exactly one number to the final sum.",
        explanationExpert:
          "The global total increases only at leaves, while callers receive the same value through recursive returns.",
      });

      if (relation !== "root") {
        stack.pop();
        currentId = stack[stack.length - 1]?.id ?? null;
        parentId = findParentId(currentId);
      } else {
        currentId = nodeId;
        parentId = null;
      }

      nextChildId = null;
      nextDirection = null;
      focusLeafId = nodeId;

      return formedNumber;
    }

    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = node.leftId;
    nextDirection = "left";
    focusLeafId = null;

    pushStep({
      action: node.leftId
        ? `Recurse into the left child of node ${node.value} with prefix ${formedNumber}.`
        : `Node ${node.value} has no left child, but the left recursive call still returns 0.`,
      actionKind: "explore-left",
      codeLines: [11],
      done: false,
      explanationBeginner:
        "The left branch is explored first using the new number as its prefix.",
      explanationExpert:
        "The helper evaluates `dfs(node->left, nextNumber)` before the right branch.",
    });

    const leftSum = dfs(node.leftId, formedNumber, "left");
    frame.leftReturn = leftSum;

    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = node.rightId;
    nextDirection = "right";
    focusLeafId = completedPaths[completedPaths.length - 1]?.leafId ?? null;

    pushStep({
      action: node.rightId
        ? `The left subtree returned ${leftSum}. Now recurse into the right child of node ${node.value}.`
        : `The left subtree returned ${leftSum}, and there is no right child, so the right recursive call will contribute 0.`,
      actionKind: "explore-right",
      codeLines: [12],
      done: false,
      explanationBeginner:
        "After finishing the left side, DFS checks the right side and adds both results together later.",
      explanationExpert:
        "The right recursive call is independent and uses the same prefix number as the left call.",
    });

    const rightSum = dfs(node.rightId, formedNumber, "right");
    frame.rightReturn = rightSum;
    frame.totalReturn = leftSum + rightSum;
    frame.status = "combined";
    addOrUpdateReturn(nodeId, frame.totalReturn);

    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = null;
    nextDirection = null;
    focusLeafId = completedPaths[completedPaths.length - 1]?.leafId ?? null;

    pushStep({
      action: `Combine the subtree results at node ${node.value}: ${leftSum} + ${rightSum} = ${frame.totalReturn}.`,
      actionKind: "combine",
      codeLines: [13],
      done: false,
      explanationBeginner:
        "An internal node does not create a number itself. It just adds the totals returned by its left and right subtrees.",
      explanationExpert:
        "The recursive invariant is additive: each call returns the sum of all completed root-to-leaf numbers below that node.",
    });

    if (relation !== "root") {
      stack.pop();
      currentId = stack[stack.length - 1]?.id ?? null;
      parentId = findParentId(currentId);
    } else {
      currentId = nodeId;
      parentId = null;
    }

    return frame.totalReturn;
  }

  result = dfs(rootId, 0, "root");
  currentId = rootId;
  parentId = null;
  nextChildId = null;
  nextDirection = null;
  focusLeafId = completedPaths[completedPaths.length - 1]?.leafId ?? null;

  pushStep({
    action: `The DFS has finished. The sum of all root-to-leaf numbers is ${result}.`,
    actionKind: "done",
    codeLines: [1, 2, 13],
    done: true,
    explanationBeginner:
      "Each leaf produced one number, and the algorithm added them all together.",
    explanationExpert:
      "Every node was visited once, giving O(n) time and O(h) recursive stack space, where h is the tree height.",
  });

  return trace;
}
