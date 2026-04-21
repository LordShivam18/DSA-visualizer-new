export type TreeToken = number | null;

export type KthTreeNode = {
  id: string;
  value: number;
  arrayIndex: number;
  depth: number;
  order: number;
  leftId: string | null;
  rightId: string | null;
};

export type KthPointers = {
  focusId: string | null;
  cursorId: string | null;
  stackTopId: string | null;
  foundId: string | null;
  rightTargetId: string | null;
};

export type KthState = {
  input: string;
  kInput: string;
  k: number;
  tokens: TreeToken[];
  rootId: string | null;
  nodes: KthTreeNode[];
  stackIds: string[];
  visitedIds: string[];
  inorderValues: number[];
  count: number;
  resultValue: number | null;
  invalidReason: string | null;
};

export type KthActionKind =
  | "parsed"
  | "invalid-k"
  | "empty"
  | "init"
  | "push-left"
  | "pop-node"
  | "count-node"
  | "found"
  | "move-right"
  | "skip-right"
  | "done";

export type KthTraceStep = {
  step: number;
  state: KthState;
  pointers: KthPointers;
  action: string;
  actionKind: KthActionKind;
  codeLines: number[];
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

type MutableNode = KthTreeNode;

function nodeIdFromIndex(index: number) {
  return `node-${index}`;
}

function createNode({
  tokenIndex,
  value,
  depth,
  order,
}: {
  tokenIndex: number;
  value: number;
  depth: number;
  order: number;
}): MutableNode {
  return {
    id: nodeIdFromIndex(tokenIndex),
    value,
    arrayIndex: tokenIndex,
    depth,
    order,
    leftId: null,
    rightId: null,
  };
}

function buildNodes(tokens: TreeToken[]) {
  const nodes = new Map<string, MutableNode>();

  if (tokens.length === 0 || tokens[0] === null) {
    return nodes;
  }

  const root = createNode({
    tokenIndex: 0,
    value: tokens[0],
    depth: 0,
    order: 0,
  });

  nodes.set(root.id, root);

  const queue: MutableNode[] = [root];
  let tokenIndex = 1;

  while (queue.length > 0 && tokenIndex < tokens.length) {
    const parent = queue.shift();

    if (!parent) {
      continue;
    }

    const leftToken = tokens[tokenIndex];
    if (leftToken !== undefined && leftToken !== null) {
      const left = createNode({
        tokenIndex,
        value: leftToken,
        depth: parent.depth + 1,
        order: parent.order * 2,
      });
      parent.leftId = left.id;
      nodes.set(left.id, left);
      queue.push(left);
    }
    tokenIndex += 1;

    if (tokenIndex >= tokens.length) {
      break;
    }

    const rightToken = tokens[tokenIndex];
    if (rightToken !== undefined && rightToken !== null) {
      const right = createNode({
        tokenIndex,
        value: rightToken,
        depth: parent.depth + 1,
        order: parent.order * 2 + 1,
      });
      parent.rightId = right.id;
      nodes.set(right.id, right);
      queue.push(right);
    }
    tokenIndex += 1;
  }

  return nodes;
}

function cloneNodes(nodes: Map<string, MutableNode>) {
  return [...nodes.values()].sort(
    (a, b) => a.depth - b.depth || a.order - b.order || a.arrayIndex - b.arrayIndex
  );
}

function stackTop(stackIds: string[]) {
  return stackIds.length > 0 ? stackIds[stackIds.length - 1] : null;
}

function labelOf(nodes: Map<string, MutableNode>, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(nodes.get(id)?.value ?? "none");
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

export function parseK(rawInput: string) {
  const value = Number(rawInput.trim());
  return Number.isInteger(value) ? value : Number.NaN;
}

export function formatNumberList(values: number[]) {
  if (values.length === 0) {
    return "[]";
  }

  return `[${values.join(", ")}]`;
}

export function formatResult(value: number | null) {
  return value === null ? "pending" : String(value);
}

export function generateTrace(rawInput: string, rawK: string): KthTraceStep[] {
  const tokens = parseTreeInput(rawInput);
  const k = parseK(rawK);
  const nodes = buildNodes(tokens);
  const rootId = nodes.has(nodeIdFromIndex(0)) ? nodeIdFromIndex(0) : null;

  const trace: KthTraceStep[] = [];
  const stackIds: string[] = [];
  const visitedIds: string[] = [];
  const inorderValues: number[] = [];

  let cursorId: string | null = rootId;
  let focusId: string | null = null;
  let foundId: string | null = null;
  let rightTargetId: string | null = null;
  let count = 0;
  let resultValue: number | null = null;
  let invalidReason: string | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    explanationBeginner,
    explanationExpert,
    done,
  }: {
    action: string;
    actionKind: KthActionKind;
    codeLines: number[];
    explanationBeginner: string;
    explanationExpert: string;
    done: boolean;
  }) {
    trace.push({
      step: trace.length,
      state: {
        input: rawInput,
        kInput: rawK,
        k: Number.isNaN(k) ? 0 : k,
        tokens: [...tokens],
        rootId,
        nodes: cloneNodes(nodes),
        stackIds: [...stackIds],
        visitedIds: [...visitedIds],
        inorderValues: [...inorderValues],
        count,
        resultValue,
        invalidReason,
      },
      pointers: {
        focusId,
        cursorId,
        stackTopId: stackTop(stackIds),
        foundId,
        rightTargetId,
      },
      action,
      actionKind,
      codeLines,
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      tokens.length === 0
        ? "Parse the BST input. The tree is empty."
        : `Parse the BST input and prepare to find k = ${rawK.trim() || "?"}.`,
    actionKind: "parsed",
    codeLines: [1],
    explanationBeginner:
      "A BST gives values in sorted order when we walk inorder, so the kth visited value is the answer.",
    explanationExpert:
      "The algorithm performs an inorder traversal and stops once the rank counter reaches k.",
    done: false,
  });

  if (!Number.isInteger(k) || k <= 0) {
    invalidReason = "k must be a positive integer.";
    pushStep({
      action: "The provided k is not a positive integer, so the visualizer cannot select a kth value.",
      actionKind: "invalid-k",
      codeLines: [1],
      explanationBeginner:
        "k is counted starting at 1, so it must be 1 or larger.",
      explanationExpert:
        "The rank query is undefined for non-positive or non-integer k.",
      done: true,
    });

    return trace;
  }

  if (!rootId) {
    invalidReason = "The BST is empty.";
    pushStep({
      action: "The root is null, so no kth smallest value exists.",
      actionKind: "empty",
      codeLines: [10],
      explanationBeginner:
        "There are no nodes to count.",
      explanationExpert:
        "The traversal loop never starts because both cursor and stack are empty.",
      done: true,
    });

    return trace;
  }

  focusId = rootId;
  pushStep({
    action: `Start at root node ${labelOf(nodes, rootId)}. The first inorder value will be the smallest.`,
    actionKind: "init",
    codeLines: [2, 3, 4],
    explanationBeginner:
      "We begin at the root and keep going left to reach the smallest value first.",
    explanationExpert:
      "The explicit stack simulates recursive inorder traversal with early termination at rank k.",
    done: false,
  });

  while ((cursorId || stackIds.length > 0) && resultValue === null) {
    while (cursorId) {
      const node = nodes.get(cursorId);
      if (!node) {
        break;
      }

      stackIds.push(node.id);
      focusId = node.id;
      cursorId = node.leftId;
      rightTargetId = null;

      pushStep({
        action: node.leftId
          ? `Push node ${node.value} and continue left to node ${labelOf(nodes, node.leftId)}.`
          : `Push node ${node.value}. No left child remains, so the stack top is next.`,
        actionKind: "push-left",
        codeLines: [5],
        explanationBeginner:
          "Going left reaches smaller values first, while the stack remembers how to come back.",
        explanationExpert:
          "The inner loop pushes the current left spine, preserving the inorder frontier.",
        done: false,
      });
    }

    const nodeId = stackIds.pop();
    if (!nodeId) {
      continue;
    }

    const node = nodes.get(nodeId);
    if (!node) {
      continue;
    }

    focusId = node.id;
    cursorId = null;
    rightTargetId = null;

    pushStep({
      action: `Pop node ${node.value}. It is the next smallest unvisited value.`,
      actionKind: "pop-node",
      codeLines: [6],
      explanationBeginner:
        "The stack top is always the next value in sorted order.",
      explanationExpert:
        "Popping advances the inorder traversal by exactly one rank.",
      done: false,
    });

    count += 1;
    visitedIds.push(node.id);
    inorderValues.push(node.value);

    pushStep({
      action: `Count node ${node.value} as rank ${count}. We are looking for rank ${k}.`,
      actionKind: "count-node",
      codeLines: [7],
      explanationBeginner:
        count === k
          ? "This count matches k, so this value is the answer."
          : "This value is sorted before the answer, so we keep counting.",
      explanationExpert:
        "`--k == 0` in the compact solution is equivalent to incrementing this rank counter until it equals the target k.",
      done: false,
    });

    if (count === k) {
      resultValue = node.value;
      foundId = node.id;

      pushStep({
        action: `Rank ${count} equals k, so return ${node.value}.`,
        actionKind: "found",
        codeLines: [7],
        explanationBeginner:
          "The kth sorted value has been found, so the traversal can stop immediately.",
        explanationExpert:
          "Early termination is valid because inorder emits values in strictly sorted rank order for a BST.",
        done: true,
      });

      break;
    }

    cursorId = node.rightId;
    rightTargetId = node.rightId;

    if (node.rightId) {
      pushStep({
        action: `Move to right child ${labelOf(nodes, node.rightId)} to continue with larger values.`,
        actionKind: "move-right",
        codeLines: [8],
        explanationBeginner:
          "After visiting this value, the next larger values live on the right side.",
        explanationExpert:
          "The traversal resumes at `curr->right` before descending that subtree leftward.",
        done: false,
      });
    } else {
      pushStep({
        action: `Node ${node.value} has no right child, so return to the stack.`,
        actionKind: "skip-right",
        codeLines: [8],
        explanationBeginner:
          "There is no right branch here, so the next saved ancestor is checked.",
        explanationExpert:
          "With no right subtree, the next inorder candidate is already in the stack if one exists.",
        done: false,
      });
    }
  }

  if (resultValue === null) {
    invalidReason = `k = ${k} is larger than the number of nodes.`;
    focusId = null;
    cursorId = null;
    rightTargetId = null;

    pushStep({
      action: `The traversal ended after ${count} node${count === 1 ? "" : "s"}, so k = ${k} is out of range.`,
      actionKind: "done",
      codeLines: [10],
      explanationBeginner:
        "We counted every value, but there were not enough nodes to reach k.",
      explanationExpert:
        "LeetCode guarantees valid k; the visualizer reports this custom-input boundary case.",
      done: true,
    });
  }

  return trace;
}
