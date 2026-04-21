export type TreeToken = number | null;

export type MinDiffTreeNode = {
  id: string;
  value: number;
  arrayIndex: number;
  depth: number;
  order: number;
  leftId: string | null;
  rightId: string | null;
};

export type DifferenceRecord = {
  prevId: string;
  currentId: string;
  diff: number;
  bestAfter: number;
};

export type MinDiffPointers = {
  focusId: string | null;
  cursorId: string | null;
  prevId: string | null;
  compareWithId: string | null;
  stackTopId: string | null;
  rightTargetId: string | null;
  bestPairIds: [string, string] | null;
};

export type MinDiffState = {
  input: string;
  tokens: TreeToken[];
  rootId: string | null;
  nodes: MinDiffTreeNode[];
  stackIds: string[];
  visitedIds: string[];
  inorderValues: number[];
  differences: DifferenceRecord[];
  bestDiff: number | null;
};

export type MinDiffActionKind =
  | "parsed"
  | "empty"
  | "init"
  | "push-left"
  | "pop-node"
  | "first-value"
  | "compare"
  | "update-best"
  | "keep-best"
  | "move-right"
  | "skip-right"
  | "done";

export type MinDiffTraceStep = {
  step: number;
  state: MinDiffState;
  pointers: MinDiffPointers;
  action: string;
  actionKind: MinDiffActionKind;
  codeLines: number[];
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

type MutableNode = MinDiffTreeNode;

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

function cloneDifferences(records: DifferenceRecord[]) {
  return records.map((record) => ({ ...record }));
}

function labelOf(nodes: Map<string, MutableNode>, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(nodes.get(id)?.value ?? "none");
}

function stackTop(stackIds: string[]) {
  return stackIds.length > 0 ? stackIds[stackIds.length - 1] : null;
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

export function formatNumberList(values: number[]) {
  if (values.length === 0) {
    return "[]";
  }

  return `[${values.join(", ")}]`;
}

export function formatDiff(value: number | null) {
  return value === null ? "pending" : String(value);
}

export function generateTrace(rawInput: string): MinDiffTraceStep[] {
  const tokens = parseTreeInput(rawInput);
  const nodes = buildNodes(tokens);
  const rootId = nodes.has(nodeIdFromIndex(0)) ? nodeIdFromIndex(0) : null;

  const trace: MinDiffTraceStep[] = [];
  const stackIds: string[] = [];
  const visitedIds: string[] = [];
  const inorderValues: number[] = [];
  const differences: DifferenceRecord[] = [];

  let cursorId: string | null = rootId;
  let focusId: string | null = null;
  let prevId: string | null = null;
  let compareWithId: string | null = null;
  let rightTargetId: string | null = null;
  let bestPairIds: [string, string] | null = null;
  let bestDiff: number | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    explanationBeginner,
    explanationExpert,
    done,
  }: {
    action: string;
    actionKind: MinDiffActionKind;
    codeLines: number[];
    explanationBeginner: string;
    explanationExpert: string;
    done: boolean;
  }) {
    trace.push({
      step: trace.length,
      state: {
        input: rawInput,
        tokens: [...tokens],
        rootId,
        nodes: cloneNodes(nodes),
        stackIds: [...stackIds],
        visitedIds: [...visitedIds],
        inorderValues: [...inorderValues],
        differences: cloneDifferences(differences),
        bestDiff,
      },
      pointers: {
        focusId,
        cursorId,
        prevId,
        compareWithId,
        stackTopId: stackTop(stackIds),
        rightTargetId,
        bestPairIds,
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
        ? "Parse the level-order input. The BST is empty."
        : "Parse the level-order input and build the BST shape.",
    actionKind: "parsed",
    codeLines: [1],
    explanationBeginner:
      tokens.length === 0
        ? "There are no values to compare."
        : "We first rebuild the tree. Then an inorder walk will read BST values in sorted order.",
    explanationExpert:
      tokens.length === 0
        ? "The null-root guard terminates before traversal."
        : "For a BST, inorder traversal produces a sorted sequence, so the minimum absolute difference must be between adjacent inorder values.",
    done: false,
  });

  if (!rootId) {
    pushStep({
      action: "The root is null, so no node pair exists and the answer is 0 for this visualization.",
      actionKind: "empty",
      codeLines: [10, 12],
      explanationBeginner:
        "An empty tree has no pair of values, so there is nothing to compare.",
      explanationExpert:
        "The LeetCode constraints include at least two nodes, but the visualizer handles empty input defensively.",
      done: true,
    });

    return trace;
  }

  focusId = rootId;
  pushStep({
    action: `Start at the root node ${labelOf(nodes, rootId)} and prepare for inorder traversal.`,
    actionKind: "init",
    codeLines: [10, 11],
    explanationBeginner:
      "Inorder means we always go left first, then visit the node, then go right.",
    explanationExpert:
      "The traversal will maintain one previous inorder node and one best adjacent difference.",
    done: false,
  });

  while (cursorId || stackIds.length > 0) {
    while (cursorId) {
      const node = nodes.get(cursorId);
      if (!node) {
        break;
      }

      stackIds.push(node.id);
      focusId = node.id;
      cursorId = node.leftId;
      compareWithId = null;
      rightTargetId = null;

      pushStep({
        action: node.leftId
          ? `Push node ${node.value} and keep walking left to node ${labelOf(nodes, node.leftId)}.`
          : `Push node ${node.value}. It has no left child, so the next step will visit the stack top.`,
        actionKind: "push-left",
        codeLines: [6],
        explanationBeginner:
          "We store the node before going left so we can come back to it after the smaller values are done.",
        explanationExpert:
          "This mirrors the recursive `inorder(node->left)` call and preserves the next ancestor on the explicit stack.",
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
    compareWithId = prevId;
    rightTargetId = null;

    pushStep({
      action: `Pop node ${node.value}. All smaller nodes in its left subtree have already been handled.`,
      actionKind: "pop-node",
      codeLines: [6, 7],
      explanationBeginner:
        "Now it is safe to read this node because everything to its left has already appeared.",
      explanationExpert:
        "The node is the next value in sorted inorder order.",
      done: false,
    });

    visitedIds.push(node.id);
    inorderValues.push(node.value);

    if (!prevId) {
      prevId = node.id;
      compareWithId = null;

      pushStep({
        action: `Node ${node.value} is the first inorder value, so it becomes previous for the next comparison.`,
        actionKind: "first-value",
        codeLines: [7, 8],
        explanationBeginner:
          "A first value cannot make a difference by itself. We wait for the next value.",
        explanationExpert:
          "`prev` is initialized after the first inorder visit; no adjacent pair exists yet.",
        done: false,
      });
    } else {
      const previous = nodes.get(prevId);
      if (previous) {
        const diff: number = node.value - previous.value;
        const nextBest: number =
          bestDiff === null ? diff : Math.min(bestDiff, diff);
        const improved: boolean = bestDiff === null || diff < bestDiff;

        bestDiff = nextBest;
        if (improved) {
          bestPairIds = [previous.id, node.id];
        }

        differences.push({
          prevId: previous.id,
          currentId: node.id,
          diff,
          bestAfter: nextBest,
        });
        compareWithId = previous.id;

        pushStep({
          action: improved
            ? `Compare ${node.value} - ${previous.value} = ${diff}. This is the best difference so far.`
            : `Compare ${node.value} - ${previous.value} = ${diff}. Keep the best difference at ${bestDiff}.`,
          actionKind: improved ? "update-best" : "keep-best",
          codeLines: [7],
          explanationBeginner: improved
            ? "These two neighboring sorted values are closer than any pair we have seen."
            : "This pair is not closer than the best pair we already found.",
          explanationExpert: improved
            ? "Adjacent inorder values form the only candidate pairs needed; this one lowers the running minimum."
            : "The running minimum remains unchanged because the adjacent gap is larger.",
          done: false,
        });
      }

      prevId = node.id;
      pushStep({
        action: `Set previous to node ${node.value} before moving to the right subtree.`,
        actionKind: "compare",
        codeLines: [8],
        explanationBeginner:
          "The current value becomes the one we compare against the next sorted value.",
        explanationExpert:
          "`prev = node` advances the adjacent-pair window by one inorder value.",
        done: false,
      });
    }

    cursorId = node.rightId;
    rightTargetId = node.rightId;
    compareWithId = null;

    if (node.rightId) {
      pushStep({
        action: `Move to the right child ${labelOf(nodes, node.rightId)}. Its left spine will be explored next.`,
        actionKind: "move-right",
        codeLines: [9],
        explanationBeginner:
          "After a node is visited, inorder traversal goes to the right side.",
        explanationExpert:
          "`inorder(node->right)` resumes the sorted traversal after the current value.",
        done: false,
      });
    } else {
      pushStep({
        action: `Node ${node.value} has no right child, so the traversal returns to the stack.`,
        actionKind: "skip-right",
        codeLines: [9],
        explanationBeginner:
          "There is no right branch here, so we go back to the nearest saved ancestor.",
        explanationExpert:
          "With no right subtree, the next inorder candidate is already on the explicit stack if one exists.",
        done: false,
      });
    }
  }

  focusId = null;
  cursorId = null;
  compareWithId = null;
  rightTargetId = null;

  pushStep({
    action: `Return the minimum absolute difference ${formatDiff(bestDiff)} from the adjacent inorder comparisons.`,
    actionKind: "done",
    codeLines: [12],
    explanationBeginner:
      "The inorder list is sorted, so the closest pair was found by checking neighbors only.",
    explanationExpert:
      "The traversal visits each node once for O(n) time and uses O(h) stack space for tree height h.",
    done: true,
  });

  return trace;
}
