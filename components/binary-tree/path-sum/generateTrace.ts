export type TreeToken = number | null;

export type PathSumTreeNode = {
  id: string;
  value: number;
  arrayIndex: number;
  depth: number;
  order: number;
  leftId: string | null;
  rightId: string | null;
  isLeaf: boolean;
};

export type PathStackFrame = {
  id: string;
  value: number;
  depth: number;
  callTarget: number;
  runningSum: number;
  remainingTarget: number;
  relation: "root" | "left" | "right";
  status: "active" | "success" | "failed";
};

export type PathSumPointers = {
  currentId: string | null;
  parentId: string | null;
  nextChildId: string | null;
  nextDirection: "left" | "right" | null;
  focusLeafId: string | null;
  currentSum: number;
  remainingTarget: number | null;
  callDepth: number;
};

export type PathSumState = {
  input: string;
  targetInput: string;
  targetSum: number;
  tokens: TreeToken[];
  rootId: string | null;
  nodes: PathSumTreeNode[];
  currentPathIds: string[];
  successPathIds: string[];
  exploredIds: string[];
  visitOrderIds: string[];
  checkedLeafIds: string[];
  deadEndLeafIds: string[];
  stack: PathStackFrame[];
  result: boolean | null;
  visitedCount: number;
};

export type PathSumActionKind =
  | "parsed"
  | "empty"
  | "init"
  | "enter-node"
  | "check-leaf"
  | "leaf-success"
  | "leaf-fail"
  | "explore-left"
  | "explore-right"
  | "hit-null"
  | "backtrack"
  | "bubble-success"
  | "done";

export type PathSumTraceStep = {
  step: number;
  action: string;
  actionKind: PathSumActionKind;
  codeLines: number[];
  state: PathSumState;
  pointers: PathSumPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

type MutableNode = PathSumTreeNode;
type MutableFrame = PathStackFrame;

function nodeIdFromIndex(index: number) {
  return `node-${index}`;
}

function cloneNodes(nodes: Map<string, MutableNode>) {
  return [...nodes.values()].sort((a, b) => a.arrayIndex - b.arrayIndex);
}

function cloneStack(stack: MutableFrame[]) {
  return stack.map((frame) => ({ ...frame }));
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

export function parseTargetInput(rawTarget: string) {
  const trimmed = rawTarget.trim();
  if (/^-?\d+$/.test(trimmed)) {
    return Number(trimmed);
  }
  return 0;
}

export function formatBooleanResult(value: boolean | null) {
  if (value === null) {
    return "searching";
  }
  return value ? "true" : "false";
}

export function formatPathValues(ids: string[], nodes: PathSumTreeNode[]) {
  if (ids.length === 0) {
    return "[]";
  }

  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const values = ids.map((id) => nodesById.get(id)?.value ?? "?");
  return `[${values.join(" -> ")}]`;
}

export function generateTrace(
  rawInput: string,
  rawTargetInput: string
): PathSumTraceStep[] {
  const tokens = parseTreeInput(rawInput);
  const targetSum = parseTargetInput(rawTargetInput);
  const nodes = buildNodes(tokens);
  const rootId = nodes.has(nodeIdFromIndex(0)) ? nodeIdFromIndex(0) : null;
  const trace: PathSumTraceStep[] = [];

  let currentId: string | null = null;
  let parentId: string | null = null;
  let nextChildId: string | null = null;
  let nextDirection: "left" | "right" | null = null;
  let focusLeafId: string | null = null;
  let result: boolean | null = null;

  const stack: MutableFrame[] = [];
  const exploredIds: string[] = [];
  const visitOrderIds: string[] = [];
  const checkedLeafIds: string[] = [];
  const deadEndLeafIds: string[] = [];
  const successPathIds: string[] = [];

  function addUnique(collection: string[], value: string) {
    if (!collection.includes(value)) {
      collection.push(value);
    }
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
    actionKind: PathSumActionKind;
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
        targetInput: rawTargetInput,
        targetSum,
        tokens,
        rootId,
        nodes: cloneNodes(nodes),
        currentPathIds: stack.map((frame) => frame.id),
        successPathIds: [...successPathIds],
        exploredIds: [...exploredIds],
        visitOrderIds: [...visitOrderIds],
        checkedLeafIds: [...checkedLeafIds],
        deadEndLeafIds: [...deadEndLeafIds],
        stack: cloneStack(stack),
        result,
        visitedCount: exploredIds.length,
      },
      pointers: {
        currentId,
        parentId,
        nextChildId,
        nextDirection,
        focusLeafId,
        currentSum: pointerFrame?.runningSum ?? 0,
        remainingTarget: pointerFrame?.remainingTarget ?? null,
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
        : `Parse the level-order tree and set the target sum to ${targetSum}.`,
    actionKind: "parsed",
    codeLines: [1],
    done: false,
    explanationBeginner:
      tokens.length === 0
        ? "There is no tree to search, so the answer will be false."
        : "We first build the tree and remember the target sum before the DFS begins.",
    explanationExpert:
      tokens.length === 0
        ? "Null root short-circuits the recursion immediately."
        : "The trace will follow the recursive DFS that subtracts each node from the remaining target.",
  });

  if (!rootId) {
    result = false;
    pushStep({
      action: "The root is null, so no root-to-leaf path can exist.",
      actionKind: "empty",
      codeLines: [2],
      done: true,
      explanationBeginner:
        "An empty tree has no path from the root to any leaf.",
      explanationExpert:
        "The base case `if (!root) return false;` decides the empty-input case in O(1).",
    });

    return trace;
  }

  currentId = rootId;
  parentId = null;
  nextChildId = rootId;
  nextDirection = null;

  pushStep({
    action: `Start the DFS at the root node ${nodes.get(rootId)?.value}.`,
    actionKind: "init",
    codeLines: [1, 2, 3],
    done: false,
    explanationBeginner:
      "We will walk from the root down to leaves, keeping track of how much sum is still needed.",
    explanationExpert:
      "Each recursive call carries a reduced target equal to the original target minus the prefix sum so far.",
  });

  function dfs(
    nodeId: string | null,
    callTarget: number,
    runningSumBefore: number,
    relation: "root" | "left" | "right"
  ): boolean {
    const callerFrame = stack[stack.length - 1] ?? null;

    if (!nodeId) {
      currentId = null;
      parentId = callerFrame?.id ?? null;
      focusLeafId = null;

      pushStep({
        action: "Reached a null child, so this branch returns false immediately.",
        actionKind: "hit-null",
        codeLines: [2],
        done: false,
        explanationBeginner:
          "A missing child cannot continue the path to a leaf, so this route stops here.",
        explanationExpert:
          "This is the null-node base case that returns false without modifying the remaining target.",
      });

      return false;
    }

    const node = nodes.get(nodeId);
    if (!node) {
      return false;
    }

    const runningSum = runningSumBefore + node.value;
    const remainingTarget = callTarget - node.value;
    const frame: MutableFrame = {
      id: nodeId,
      value: node.value,
      depth: stack.length,
      callTarget,
      runningSum,
      remainingTarget,
      relation,
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
      action: `Enter node ${node.value}. Running sum becomes ${runningSum}, so the remaining target becomes ${remainingTarget}.`,
      actionKind: "enter-node",
      codeLines: [3],
      done: false,
      explanationBeginner:
        "We include this node in the path and update how much total is still needed.",
      explanationExpert:
        "The recursion transforms the problem into `hasPathSum(child, target - node->val)` for each child.",
    });

    if (node.isLeaf) {
      focusLeafId = nodeId;
      addUnique(checkedLeafIds, nodeId);

      pushStep({
        action: `Node ${node.value} is a leaf, so compare the remaining target ${remainingTarget} with zero.`,
        actionKind: "check-leaf",
        codeLines: [4, 5],
        done: false,
        explanationBeginner:
          "At a leaf, the search succeeds only if the path sum exactly matches the target.",
        explanationExpert:
          "The leaf condition converts the recursive state into the terminal predicate `remaining == 0`.",
      });

      if (remainingTarget === 0) {
        frame.status = "success";
        successPathIds.splice(0, successPathIds.length, ...stack.map((item) => item.id));
        result = true;

        pushStep({
          action: `Success: the path ending at leaf ${node.value} hits the target sum exactly.`,
          actionKind: "leaf-success",
          codeLines: [5],
          done: false,
          explanationBeginner:
            "This root-to-leaf path adds up perfectly, so the algorithm can stop searching.",
          explanationExpert:
            "A true leaf predicate short-circuits all pending callers because the OR chain has been satisfied.",
        });

        return true;
      }

      frame.status = "failed";
      addUnique(deadEndLeafIds, nodeId);

      pushStep({
        action: `Leaf ${node.value} misses the target, so this branch returns false.`,
        actionKind: "leaf-fail",
        codeLines: [5],
        done: false,
        explanationBeginner:
          "We reached a leaf, but the total does not match the target, so this path is a dead end.",
        explanationExpert:
          "The leaf predicate fails because `remaining != 0`, so this call unwinds with false.",
      });

      stack.pop();
      currentId = stack[stack.length - 1]?.id ?? null;
      parentId = findParentId(currentId);
      nextChildId = null;
      nextDirection = null;
      focusLeafId = nodeId;

      return false;
    }

    nextChildId = node.leftId;
    nextDirection = "left";
    currentId = nodeId;
    focusLeafId = null;

    pushStep({
      action: node.leftId
        ? `Explore the left child of node ${node.value} first.`
        : `Node ${node.value} has no left child, but the recursive code still checks that side first.`,
      actionKind: "explore-left",
      codeLines: [7],
      done: false,
      explanationBeginner:
        "DFS tries the left branch before the right branch.",
      explanationExpert:
        "The explicit left recursive call is evaluated before the short-circuit check for an early true return.",
    });

    const leftHasPath = dfs(node.leftId, remainingTarget, runningSum, "left");
    if (leftHasPath) {
      frame.status = "success";
      currentId = nodeId;
      parentId = findParentId(nodeId);
      nextChildId = node.leftId;
      nextDirection = "left";
      result = true;

      pushStep({
        action: `A valid path was found in the left subtree of node ${node.value}, so this call also returns true.`,
        actionKind: "bubble-success",
        codeLines: [8, 9],
        done: false,
        explanationBeginner:
          "Once the left side finds a matching path, we do not need to search anywhere else.",
        explanationExpert:
          "The function short-circuits on `leftHasPath`, preserving O(n) worst-case time but potentially stopping earlier.",
      });

      return true;
    }

    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = node.rightId;
    nextDirection = "right";
    focusLeafId = null;

    pushStep({
      action: node.rightId
        ? `The left branch failed, so now explore the right child of node ${node.value}.`
        : `The left branch failed and there is no right child, so the final recursive call will also hit null.`,
      actionKind: "explore-right",
      codeLines: [11],
      done: false,
      explanationBeginner:
        "If the left branch does not work, DFS tries the right branch next.",
      explanationExpert:
        "The right recursive call is only evaluated after the left side has already returned false.",
    });

    const rightHasPath = dfs(node.rightId, remainingTarget, runningSum, "right");
    if (rightHasPath) {
      frame.status = "success";
      currentId = nodeId;
      parentId = findParentId(nodeId);
      nextChildId = node.rightId;
      nextDirection = "right";
      result = true;

      pushStep({
        action: `A valid path was found in the right subtree of node ${node.value}, so this call returns true as well.`,
        actionKind: "bubble-success",
        codeLines: [11],
        done: false,
        explanationBeginner:
          "The right branch found the answer, so the success now bubbles back to the root.",
        explanationExpert:
          "The final return expression resolves to true because the right recursive call succeeded.",
      });

      return true;
    }

    frame.status = "failed";
    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = null;
    nextDirection = null;
    focusLeafId = null;

    pushStep({
      action: `Both branches under node ${node.value} failed, so return false to its parent.`,
      actionKind: "backtrack",
      codeLines: [11],
      done: false,
      explanationBeginner:
        "Neither child produced a matching root-to-leaf sum, so we backtrack upward.",
      explanationExpert:
        "This call returns false only after both recursive branches have been exhausted.",
    });

    stack.pop();
    currentId = stack[stack.length - 1]?.id ?? null;
    parentId = findParentId(currentId);
    nextChildId = null;
    nextDirection = null;

    return false;
  }

  result = dfs(rootId, targetSum, 0, "root");

  if (result) {
    focusLeafId = successPathIds[successPathIds.length - 1] ?? null;
    currentId = focusLeafId;
    parentId =
      successPathIds.length > 1
        ? successPathIds[successPathIds.length - 2]
        : null;
    nextChildId = null;
    nextDirection = null;
  } else {
    currentId = null;
    parentId = null;
    nextChildId = null;
    nextDirection = null;
    focusLeafId = deadEndLeafIds[deadEndLeafIds.length - 1] ?? null;
  }

  pushStep({
    action: result
      ? "The DFS found a valid root-to-leaf path whose sum equals the target."
      : "The DFS exhausted every root-to-leaf path without matching the target.",
    actionKind: "done",
    codeLines: [1, 12],
    done: true,
    explanationBeginner: result
      ? "At least one full path matches the target sum, so the answer is true."
      : "Every possible root-to-leaf path was checked, and none reached the target sum.",
    explanationExpert: result
      ? "The recursion short-circuited after discovering a witness path. Time is O(n) in the worst case with O(h) call-stack space."
      : "All reachable root-to-leaf paths were explored. Worst-case complexity remains O(n) time and O(h) stack space.",
  });

  return trace;
}
