export type TreeToken = number | null;

export type IteratorOperationKind = "constructor" | "next" | "hasNext";
export type RuntimeOperationKind = Exclude<IteratorOperationKind, "constructor">;
export type IteratorCallStatus = "done" | "active" | "pending";

export type IteratorTreeNode = {
  id: string;
  value: number;
  arrayIndex: number;
  depth: number;
  order: number;
  leftId: string | null;
  rightId: string | null;
};

export type IteratorCall = {
  id: string;
  kind: IteratorOperationKind;
  label: string;
  status: IteratorCallStatus;
  result: string | null;
  contributesToOutput: boolean;
};

export type IteratorPointers = {
  focusNodeId: string | null;
  returnedNodeId: string | null;
  rightSubtreeRootId: string | null;
  pushPathIds: string[];
  currentCallId: string | null;
  lastCallId: string | null;
};

export type IteratorState = {
  treeInput: string;
  operationsInput: string;
  tokens: TreeToken[];
  rootId: string | null;
  nodes: IteratorTreeNode[];
  inorderIds: string[];
  visitedIds: string[];
  remainingIds: string[];
  stackIds: string[];
  output: string[];
  nextCandidateId: string | null;
  calls: IteratorCall[];
};

export type IteratorActionKind =
  | "parsed"
  | "init"
  | "push-left"
  | "ready"
  | "check"
  | "peek"
  | "pop"
  | "scan-right"
  | "skip-right"
  | "return"
  | "invalid"
  | "done";

export type IteratorTraceStep = {
  step: number;
  state: IteratorState;
  pointers: IteratorPointers;
  action: string;
  actionKind: IteratorActionKind;
  codeLines: number[];
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

type BaseCall = {
  id: string;
  kind: IteratorOperationKind;
  label: string;
  contributesToOutput: boolean;
};

type ParsedOperationInput = {
  includeConstructorCall: boolean;
  operations: RuntimeOperationKind[];
};

function nodeIdFromIndex(index: number) {
  return `node-${index}`;
}

function last<T>(items: T[]) {
  return items.length > 0 ? items[items.length - 1] : null;
}

function cloneNodes(nodes: Map<string, IteratorTreeNode>) {
  return [...nodes.values()].sort((a, b) => a.arrayIndex - b.arrayIndex);
}

function buildNodes(tokens: TreeToken[]) {
  const nodes = new Map<string, IteratorTreeNode>();

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

    const node: IteratorTreeNode = {
      id,
      value: tokens[index] as number,
      arrayIndex: index,
      depth,
      order: index - levelStartIndex,
      leftId: null,
      rightId: null,
    };

    nodes.set(id, node);

    node.leftId = ensureNode(index * 2 + 1);
    node.rightId = ensureNode(index * 2 + 2);

    return id;
  }

  ensureNode(0);

  return nodes;
}

function collectInorder(
  nodes: Map<string, IteratorTreeNode>,
  startId: string | null
) {
  const order: string[] = [];

  function walk(nodeId: string | null) {
    if (!nodeId) {
      return;
    }

    const node = nodes.get(nodeId);
    if (!node) {
      return;
    }

    walk(node.leftId);
    order.push(nodeId);
    walk(node.rightId);
  }

  walk(startId);
  return order;
}

function buildCallsState(
  baseCalls: BaseCall[],
  callResults: Array<string | null>,
  completedCallCount: number,
  activeCallIndex: number | null
): IteratorCall[] {
  return baseCalls.map((call, index) => ({
    ...call,
    status:
      index < completedCallCount
        ? "done"
        : activeCallIndex === index
        ? "active"
        : "pending",
    result: callResults[index],
  }));
}

function normalizeOperationToken(token: string) {
  const normalized = token
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .replace(/\(\s*\)$/g, "")
    .trim()
    .toLowerCase();

  if (!normalized) {
    return null;
  }

  if (
    normalized === "bstiterator" ||
    normalized === "constructor" ||
    normalized === "init"
  ) {
    return "constructor" as const;
  }

  if (normalized === "next") {
    return "next" as const;
  }

  if (normalized === "hasnext") {
    return "hasNext" as const;
  }

  return null;
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

  return pieces
    .map((piece) => {
      if (/^(null|nil|none|#)$/i.test(piece)) {
        return null;
      }

      if (/^-?\d+$/.test(piece)) {
        return Number(piece);
      }

      return undefined;
    })
    .filter((piece): piece is TreeToken => piece !== undefined);
}

export function parseOperationInput(rawInput: string): ParsedOperationInput {
  const trimmed = rawInput.trim();

  if (!trimmed) {
    return {
      includeConstructorCall: false,
      operations: [],
    };
  }

  const withoutBrackets = trimmed.replace(/^\[/, "").replace(/\]$/, "");
  const pieces = withoutBrackets
    .split(/[\n,]+/)
    .map((piece) => piece.trim())
    .filter((piece) => piece.length > 0);

  const normalized = pieces
    .map((piece) => normalizeOperationToken(piece))
    .filter((piece): piece is IteratorOperationKind => piece !== null);

  const includeConstructorCall = normalized[0] === "constructor";
  const operations = includeConstructorCall
    ? normalized.slice(1)
    : normalized;

  return {
    includeConstructorCall,
    operations: operations.filter(
      (operation): operation is RuntimeOperationKind =>
        operation === "next" || operation === "hasNext"
    ),
  };
}

export function formatOutputArray(output: string[]) {
  if (output.length === 0) {
    return "[]";
  }

  return `[${output.join(", ")}]`;
}

export function generateTrace(
  rawTreeInput: string,
  rawOperationsInput: string
): IteratorTraceStep[] {
  const tokens = parseTreeInput(rawTreeInput);
  const nodes = buildNodes(tokens);
  const rootId = nodes.has(nodeIdFromIndex(0)) ? nodeIdFromIndex(0) : null;
  const inorderIds = collectInorder(nodes, rootId);
  const parsedOperations = parseOperationInput(rawOperationsInput);

  const baseCalls: BaseCall[] = [
    {
      id: "call-0",
      kind: "constructor",
      label: "BSTIterator(root)",
      contributesToOutput: parsedOperations.includeConstructorCall,
    },
    ...parsedOperations.operations.map((operation, index) => ({
      id: `call-${index + 1}`,
      kind: operation,
      label: operation === "next" ? "next()" : "hasNext()",
      contributesToOutput: true,
    })),
  ];

  const callResults = new Array<string | null>(baseCalls.length).fill(null);
  const stackIds: string[] = [];
  const visitedIds: string[] = [];
  const output: string[] = [];
  const trace: IteratorTraceStep[] = [];

  let focusNodeId: string | null = null;
  let returnedNodeId: string | null = null;
  let rightSubtreeRootId: string | null = null;
  let pushPathIds: string[] = [];
  let currentCallIndex: number | null = null;
  let lastCallIndex: number | null = null;
  let completedCallCount = 0;

  function pushStep({
    action,
    actionKind,
    codeLines,
    explanationBeginner,
    explanationExpert,
    done,
  }: {
    action: string;
    actionKind: IteratorActionKind;
    codeLines: number[];
    explanationBeginner: string;
    explanationExpert: string;
    done: boolean;
  }) {
    trace.push({
      step: trace.length,
      state: {
        treeInput: rawTreeInput,
        operationsInput: rawOperationsInput,
        tokens,
        rootId,
        nodes: cloneNodes(nodes),
        inorderIds,
        visitedIds: [...visitedIds],
        remainingIds: inorderIds.slice(visitedIds.length),
        stackIds: [...stackIds],
        output: [...output],
        nextCandidateId: last(stackIds),
        calls: buildCallsState(
          baseCalls,
          callResults,
          completedCallCount,
          currentCallIndex
        ),
      },
      pointers: {
        focusNodeId,
        returnedNodeId,
        rightSubtreeRootId,
        pushPathIds: [...pushPathIds],
        currentCallId:
          currentCallIndex === null ? null : baseCalls[currentCallIndex]?.id ?? null,
        lastCallId:
          lastCallIndex === null ? null : baseCalls[lastCallIndex]?.id ?? null,
      },
      action,
      actionKind,
      codeLines,
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  function pushLeftPath(startId: string | null, source: "constructor" | "next") {
    let cursorId = startId;

    while (cursorId) {
      const node = nodes.get(cursorId);
      if (!node) {
        break;
      }

      focusNodeId = node.id;
      pushPathIds = [...pushPathIds, node.id];
      stackIds.push(node.id);

      pushStep({
        action:
          source === "constructor"
            ? `Push node ${node.value} onto the stack, then keep walking left.`
            : `Push node ${node.value} while exploring the right subtree's left spine.`,
        actionKind: "push-left",
        codeLines: [4, 5, 6, 7],
        explanationBeginner:
          source === "constructor"
            ? "The constructor saves the whole left spine so the smallest value ends up on top of the stack."
            : "After visiting a node, the iterator must preload the left spine of its right subtree so the next smallest value is ready.",
        explanationExpert:
          source === "constructor"
            ? "pushLeft(root) stores exactly the ancestors needed to replay the inorder traversal lazily."
            : "Every node is pushed once, so these left-spine expansions keep next() amortized O(1).",
        done: false,
      });

      cursorId = node.leftId;
    }
  }

  pushStep({
    action:
      tokens.length === 0
        ? "Parse the BST input and requested calls. The tree is empty."
        : "Parse the BST input and the iterator operations to simulate.",
    actionKind: "parsed",
    codeLines: [11],
    explanationBeginner:
      tokens.length === 0
        ? "There are no nodes to preload, so the iterator starts with an empty stack."
        : "We first build the tree and line up the method calls so the trace can show exactly how the iterator moves.",
    explanationExpert:
      tokens.length === 0
        ? "A null root produces an empty iterator state immediately."
        : "The visualizer deserializes the level-order BST and then replays constructor, next(), and hasNext() calls against one shared stack.",
    done: false,
  });

  currentCallIndex = 0;
  focusNodeId = rootId;
  returnedNodeId = null;
  rightSubtreeRootId = null;
  pushPathIds = [];

  pushStep({
    action: rootId
      ? `Construct the iterator with root node ${nodes.get(rootId)?.value}.`
      : "Construct the iterator with a null root.",
    actionKind: "init",
    codeLines: [11, 12],
    explanationBeginner:
      "The constructor does not visit nodes yet. It only prepares the stack so the first next() call is ready to return the smallest value.",
    explanationExpert:
      "Initialization delegates the work to pushLeft(root), which eagerly records only the path needed to reach the first inorder element.",
    done: false,
  });

  if (rootId) {
    pushLeftPath(rootId, "constructor");
  } else {
    focusNodeId = null;
    pushPathIds = [];
  }

  if (parsedOperations.includeConstructorCall) {
    callResults[0] = "null";
    output.push("null");
  }

  pushStep({
    action: stackIds.length > 0
      ? `Constructor setup is complete. Node ${nodes.get(last(stackIds) as string)?.value} is now on top of the stack.`
      : "Constructor setup is complete. The stack stays empty because the BST has no nodes.",
    actionKind: "ready",
    codeLines: [11, 12, 13],
    explanationBeginner:
      stackIds.length > 0
        ? "The top of the stack is always the next smallest value waiting to be returned."
        : "An empty tree means both next() and hasNext() have nothing to work with.",
    explanationExpert:
      stackIds.length > 0
        ? "The stack now stores the left spine from the root down to the smallest node, which is exactly the lazy inorder frontier."
        : "The iterator's invariant still holds: the stack contains the remaining inorder frontier, which is empty.",
    done: false,
  });

  completedCallCount = 1;
  lastCallIndex = 0;
  currentCallIndex = null;
  focusNodeId = last(stackIds);
  pushPathIds = [];

  parsedOperations.operations.forEach((operation, operationIndex) => {
    const callIndex = operationIndex + 1;
    currentCallIndex = callIndex;
    rightSubtreeRootId = null;
    returnedNodeId = null;
    pushPathIds = [];

    if (operation === "hasNext") {
      const topId = last(stackIds);
      const exists = topId !== null;
      focusNodeId = topId;
      callResults[callIndex] = exists ? "true" : "false";
      output.push(exists ? "true" : "false");

      pushStep({
        action: exists
          ? `hasNext() checks the stack. It is not empty, so the answer is true and node ${nodes.get(topId)?.value} would be returned next.`
          : "hasNext() checks the stack. It is empty, so the answer is false.",
        actionKind: "check",
        codeLines: [21, 22],
        explanationBeginner:
          exists
            ? "hasNext() is just a stack check. If something is still stored there, another inorder value remains."
            : "Once the stack is empty, the iterator has already returned every reachable node.",
        explanationExpert:
          exists
            ? "The iterator invariant says the stack holds exactly the unvisited inorder frontier, so non-empty implies another value exists."
            : "An empty frontier means the lazy inorder traversal is exhausted.",
        done: false,
      });

      completedCallCount = callIndex + 1;
      lastCallIndex = callIndex;
      currentCallIndex = null;
      focusNodeId = topId;
      return;
    }

    const topId = last(stackIds);

    if (!topId) {
      focusNodeId = null;
      callResults[callIndex] = "invalid";
      output.push("invalid");

      pushStep({
        action:
          "next() was requested while the stack is empty. That violates the problem's validity guarantee, so the visualizer marks the call as invalid.",
        actionKind: "invalid",
        codeLines: [15],
        explanationBeginner:
          "In the real interview problem, next() is only called when another value exists. This custom input breaks that rule.",
        explanationExpert:
          "The implementation would otherwise read from an empty stack; here the trace reports the invalid call instead of crashing.",
        done: false,
      });

      completedCallCount = callIndex + 1;
      lastCallIndex = callIndex;
      currentCallIndex = null;
      return;
    }

    focusNodeId = topId;

    pushStep({
      action: `Start next(). The top of the stack is node ${nodes.get(topId)?.value}, which is the smallest remaining inorder value.`,
      actionKind: "peek",
      codeLines: [14, 15],
      explanationBeginner:
        "Because the stack already stores the left spine, the top node is always the next answer.",
      explanationExpert:
        "The constructor and every right-subtree expansion maintain a monotonic inorder frontier on the stack.",
      done: false,
    });

    const nodeId = stackIds.pop() as string;
    const node = nodes.get(nodeId);

    if (!node) {
      return;
    }

    focusNodeId = nodeId;

    pushStep({
      action: `Pop node ${node.value} from the stack. This node is about to be returned by next().`,
      actionKind: "pop",
      codeLines: [15],
      explanationBeginner:
        "Popping removes the current smallest value from the frontier because we are finally using it.",
      explanationExpert:
        "st.top() / st.pop() advances the lazy inorder traversal to the successor state.",
      done: false,
    });

    if (node.rightId) {
      rightSubtreeRootId = node.rightId;
      focusNodeId = node.rightId;
      pushPathIds = [];

      pushStep({
        action: `Node ${node.value} has right child ${nodes.get(node.rightId)?.value}, so explore that subtree's left spine next.`,
        actionKind: "scan-right",
        codeLines: [16, 17],
        explanationBeginner:
          "After visiting a node, inorder traversal moves into its right subtree, then keeps going left as far as possible.",
        explanationExpert:
          "The successor of a node with a right child is the leftmost node inside that right subtree.",
        done: false,
      });

      pushLeftPath(node.rightId, "next");
    } else {
      rightSubtreeRootId = null;
      focusNodeId = last(stackIds);
      pushPathIds = [];

      pushStep({
        action: `Node ${node.value} has no right child, so no extra nodes are pushed onto the stack.`,
        actionKind: "skip-right",
        codeLines: [16],
        explanationBeginner:
          "When there is no right subtree, the iterator just falls back to the nearest unfinished ancestor already saved in the stack.",
        explanationExpert:
          "No pushLeft call is needed because the successor, if any, is already among the stored ancestors.",
        done: false,
      });
    }

    visitedIds.push(nodeId);
    callResults[callIndex] = String(node.value);
    output.push(String(node.value));
    returnedNodeId = nodeId;
    focusNodeId = last(stackIds);
    rightSubtreeRootId = null;
    pushPathIds = [];

    pushStep({
      action: last(stackIds)
        ? `Return ${node.value}. The new stack top is ${nodes.get(last(stackIds) as string)?.value}, which will be the next inorder candidate.`
        : `Return ${node.value}. The stack is now empty, so every requested node has been consumed so far.`,
      actionKind: "return",
      codeLines: [19],
      explanationBeginner:
        "The returned value joins the inorder output, and the updated stack already knows what comes next.",
      explanationExpert:
        "Each next() call performs one pop and at most one left-spine expansion, giving amortized O(1) time.",
      done: false,
    });

    completedCallCount = callIndex + 1;
    lastCallIndex = callIndex;
    currentCallIndex = null;
  });

  focusNodeId = last(stackIds);
  returnedNodeId = null;
  rightSubtreeRootId = null;
  pushPathIds = [];

  pushStep({
    action:
      parsedOperations.operations.length === 0
        ? "Constructor setup is ready. Add next() or hasNext() calls to keep exploring the iterator."
        : "All requested iterator calls have been executed.",
    actionKind: "done",
    codeLines: [12, 19, 22],
    explanationBeginner:
      parsedOperations.operations.length === 0
        ? "The iterator is ready to answer calls, even though this trace only shows the setup phase."
        : "The output list now matches the exact sequence of requested method calls.",
    explanationExpert:
      parsedOperations.operations.length === 0
        ? "The lazy inorder frontier is initialized and waiting in the stack."
        : "The simulation preserved the standard BST iterator invariants across constructor, next(), and hasNext().",
    done: true,
  });

  return trace;
}
