export type TreeToken = number | null;

export type LevelOrderTreeNode = {
  id: string;
  value: number;
  arrayIndex: number;
  depth: number;
  order: number;
  leftId: string | null;
  rightId: string | null;
};

export type LevelOrderSummary = {
  level: number;
  nodeIds: string[];
  values: number[];
  width: number;
};

export type LevelOrderPointers = {
  level: number;
  levelSize: number;
  indexInLevel: number;
  writeIndex: number | null;
  currentId: string | null;
  queueFrontId: string | null;
  enqueuedChildId: string | null;
  enqueuedSide: "left" | "right" | null;
};

export type LevelOrderState = {
  input: string;
  tokens: TreeToken[];
  rootId: string | null;
  nodes: LevelOrderTreeNode[];
  queueIds: string[];
  currentLevelIds: string[];
  processedLevelIds: string[];
  remainingLevelIds: string[];
  nextLevelIds: string[];
  visitedIds: string[];
  completedLevelIds: string[];
  activeLevelValues: number[];
  levelSummaries: LevelOrderSummary[];
  resultLevels: number[][];
};

export type LevelOrderActionKind =
  | "parsed"
  | "empty"
  | "init"
  | "start-level"
  | "pop-node"
  | "collect-value"
  | "enqueue-left"
  | "skip-left"
  | "enqueue-right"
  | "skip-right"
  | "commit-level"
  | "finish-level"
  | "done";

export type LevelOrderTraceStep = {
  step: number;
  state: LevelOrderState;
  pointers: LevelOrderPointers;
  action: string;
  actionKind: LevelOrderActionKind;
  codeLines: number[];
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

type MutableNode = LevelOrderTreeNode;

function nodeIdFromIndex(index: number) {
  return `node-${index}`;
}

function cloneNodes(nodes: Map<string, MutableNode>) {
  return [...nodes.values()].sort(
    (a, b) => a.depth - b.depth || a.order - b.order || a.arrayIndex - b.arrayIndex
  );
}

function cloneSummaries(levelSummaries: LevelOrderSummary[]) {
  return levelSummaries.map((summary) => ({
    ...summary,
    nodeIds: [...summary.nodeIds],
    values: [...summary.values],
  }));
}

function cloneNested(values: number[][]) {
  return values.map((level) => [...level]);
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

function labelOf(nodes: Map<string, MutableNode>, nodeId: string | null) {
  if (!nodeId) {
    return "none";
  }

  return String(nodes.get(nodeId)?.value ?? "none");
}

function valuesFromIds(nodes: Map<string, MutableNode>, ids: string[]) {
  return ids
    .map((id) => nodes.get(id)?.value)
    .filter((value): value is number => value !== undefined);
}

function addUnique(collection: string[], value: string) {
  if (!collection.includes(value)) {
    collection.push(value);
  }
}

function addManyUnique(collection: string[], values: string[]) {
  values.forEach((value) => addUnique(collection, value));
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

export function formatValueArray(values: number[]) {
  if (values.length === 0) {
    return "[]";
  }

  return `[${values.join(", ")}]`;
}

export function formatNestedLevels(levels: number[][]) {
  if (levels.length === 0) {
    return "[]";
  }

  return `[${levels.map((level) => formatValueArray(level)).join(", ")}]`;
}

export function generateTrace(rawInput: string): LevelOrderTraceStep[] {
  const tokens = parseTreeInput(rawInput);
  const nodes = buildNodes(tokens);
  const rootId = nodes.has(nodeIdFromIndex(0)) ? nodeIdFromIndex(0) : null;

  const trace: LevelOrderTraceStep[] = [];
  const queueIds: string[] = [];
  const currentLevelIds: string[] = [];
  const processedLevelIds: string[] = [];
  const remainingLevelIds: string[] = [];
  const nextLevelIds: string[] = [];
  const visitedIds: string[] = [];
  const completedLevelIds: string[] = [];
  const activeLevelValues: number[] = [];
  const levelSummaries: LevelOrderSummary[] = [];
  const resultLevels: number[][] = [];

  let level = 0;
  let levelSize = 0;
  let indexInLevel = -1;
  let writeIndex: number | null = null;
  let currentId: string | null = null;
  let queueFrontId: string | null = null;
  let enqueuedChildId: string | null = null;
  let enqueuedSide: "left" | "right" | null = null;

  function resetLevelBuffers(nextCurrentLevelIds: string[]) {
    currentLevelIds.splice(0, currentLevelIds.length, ...nextCurrentLevelIds);
    processedLevelIds.splice(0, processedLevelIds.length);
    remainingLevelIds.splice(0, remainingLevelIds.length, ...nextCurrentLevelIds);
    nextLevelIds.splice(0, nextLevelIds.length);
    activeLevelValues.splice(0, activeLevelValues.length);
  }

  function pushStep({
    action,
    actionKind,
    codeLines,
    explanationBeginner,
    explanationExpert,
    done,
  }: {
    action: string;
    actionKind: LevelOrderActionKind;
    codeLines: number[];
    explanationBeginner: string;
    explanationExpert: string;
    done: boolean;
  }) {
    trace.push({
      step: trace.length,
      action,
      actionKind,
      codeLines,
      explanationBeginner,
      explanationExpert,
      done,
      state: {
        input: rawInput,
        tokens: [...tokens],
        rootId,
        nodes: cloneNodes(nodes),
        queueIds: [...queueIds],
        currentLevelIds: [...currentLevelIds],
        processedLevelIds: [...processedLevelIds],
        remainingLevelIds: [...remainingLevelIds],
        nextLevelIds: [...nextLevelIds],
        visitedIds: [...visitedIds],
        completedLevelIds: [...completedLevelIds],
        activeLevelValues: [...activeLevelValues],
        levelSummaries: cloneSummaries(levelSummaries),
        resultLevels: cloneNested(resultLevels),
      },
      pointers: {
        level,
        levelSize,
        indexInLevel,
        writeIndex,
        currentId,
        queueFrontId,
        enqueuedChildId,
        enqueuedSide,
      },
    });
  }

  pushStep({
    action:
      tokens.length === 0
        ? "Parse the level-order input. The tree is empty."
        : "Parse the level-order input and build the tree for breadth-first traversal.",
    actionKind: "parsed",
    codeLines: [1],
    explanationBeginner:
      tokens.length === 0
        ? "There are no nodes, so the level order result will be empty."
        : "We first turn the input list into a tree. Then the queue will visit it one row at a time.",
    explanationExpert:
      tokens.length === 0
        ? "The empty-input guard terminates before BFS starts."
        : "The trace starts from a deserialized binary tree and will preserve the BFS frontier invariant at every level.",
    done: false,
  });

  if (!rootId) {
    pushStep({
      action: "The root is null, so the level order traversal is an empty list.",
      actionKind: "empty",
      codeLines: [2],
      explanationBeginner:
        "An empty tree has no rows to read, so the answer stays empty.",
      explanationExpert:
        "Because `root == nullptr`, the function returns before allocating the traversal queue.",
      done: true,
    });

    return trace;
  }

  queueIds.push(rootId);
  queueFrontId = rootId;
  levelSize = queueIds.length;

  pushStep({
    action: `Initialize the queue with the root node ${labelOf(nodes, rootId)}.`,
    actionKind: "init",
    codeLines: [3, 4, 5],
    explanationBeginner:
      "BFS always begins with the root because it is the first row by itself.",
    explanationExpert:
      "Seeding the queue with `root` establishes the first frontier and starts level-order traversal.",
    done: false,
  });

  while (queueIds.length > 0) {
    const activeLevelIds = queueIds.slice();
    levelSize = activeLevelIds.length;
    indexInLevel = -1;
    writeIndex = null;
    currentId = null;
    queueFrontId = queueIds[0] ?? null;
    enqueuedChildId = null;
    enqueuedSide = null;
    resetLevelBuffers(activeLevelIds);

    pushStep({
      action: `Start level ${level + 1}. Freeze the queue size at ${levelSize} so exactly this row is collected.`,
      actionKind: "start-level",
      codeLines: [6, 7, 8],
      explanationBeginner:
        "We count how many nodes are currently in the queue. That number tells us how many nodes belong to this row.",
      explanationExpert:
        "`levelSize = q.size()` isolates the current frontier, so children enqueued during the loop cannot leak into the active level vector.",
      done: false,
    });

    for (let index = 0; index < levelSize; index += 1) {
      indexInLevel = index;
      writeIndex = null;
      currentId = queueIds.shift() ?? null;

      if (!currentId) {
        continue;
      }

      addUnique(visitedIds, currentId);
      processedLevelIds.push(currentId);
      remainingLevelIds.splice(0, 1);
      queueFrontId = queueIds[0] ?? null;
      enqueuedChildId = null;
      enqueuedSide = null;

      const currentNode = nodes.get(currentId);
      if (!currentNode) {
        continue;
      }

      pushStep({
        action: `Pop node ${currentNode.value} from the queue and inspect it as item ${index + 1} of level ${level + 1}.`,
        actionKind: "pop-node",
        codeLines: [9, 10, 11],
        explanationBeginner:
          "The queue gives us the next node from left to right on the current row.",
        explanationExpert:
          "After `q.front()` and `q.pop()`, the algorithm owns the next node from the frozen frontier.",
        done: false,
      });

      activeLevelValues.push(currentNode.value);
      writeIndex = activeLevelValues.length - 1;

      pushStep({
        action: `Collect value ${currentNode.value}. The current level vector is now ${formatValueArray(activeLevelValues)}.`,
        actionKind: "collect-value",
        codeLines: [8, 12],
        explanationBeginner:
          "We copy the node's value into the answer row we are building right now.",
        explanationExpert:
          "`level.push_back(node->val)` appends in BFS order, which is exactly left-to-right order for the frozen level.",
        done: false,
      });

      if (currentNode.leftId) {
        queueIds.push(currentNode.leftId);
        nextLevelIds.push(currentNode.leftId);
        queueFrontId = queueIds[0] ?? null;
        enqueuedChildId = currentNode.leftId;
        enqueuedSide = "left";

        pushStep({
          action: `Enqueue the left child ${labelOf(nodes, currentNode.leftId)} for the next level.`,
          actionKind: "enqueue-left",
          codeLines: [13],
          explanationBeginner:
            "Children wait their turn. This left child will appear on the next row, not the current one.",
          explanationExpert:
            "Appending the left child preserves BFS order in the next frontier.",
          done: false,
        });
      } else {
        enqueuedChildId = null;
        enqueuedSide = "left";

        pushStep({
          action: `Node ${currentNode.value} has no left child, so no left-side node enters the queue.`,
          actionKind: "skip-left",
          codeLines: [13],
          explanationBeginner:
            "There is no left child to save for the next row.",
          explanationExpert:
            "The `if (node->left)` branch is skipped because the child pointer is null.",
          done: false,
        });
      }

      if (currentNode.rightId) {
        queueIds.push(currentNode.rightId);
        nextLevelIds.push(currentNode.rightId);
        queueFrontId = queueIds[0] ?? null;
        enqueuedChildId = currentNode.rightId;
        enqueuedSide = "right";

        pushStep({
          action: `Enqueue the right child ${labelOf(nodes, currentNode.rightId)} for the next level.`,
          actionKind: "enqueue-right",
          codeLines: [14],
          explanationBeginner:
            "The right child also waits in the queue until this row is done.",
          explanationExpert:
            "Appending right after left keeps the next frontier in natural left-to-right order.",
          done: false,
        });
      } else {
        enqueuedChildId = null;
        enqueuedSide = "right";

        pushStep({
          action: `Node ${currentNode.value} has no right child, so the queue stays unchanged on that side.`,
          actionKind: "skip-right",
          codeLines: [14],
          explanationBeginner:
            "No right child means this branch adds nothing else for later.",
          explanationExpert:
            "The `if (node->right)` branch is skipped because the child pointer is null.",
          done: false,
        });
      }
    }

    const committedValues = [...activeLevelValues];
    addManyUnique(completedLevelIds, activeLevelIds);
    levelSummaries.push({
      level: level + 1,
      nodeIds: [...activeLevelIds],
      values: committedValues,
      width: levelSize,
    });
    resultLevels.push(committedValues);
    currentId = activeLevelIds[activeLevelIds.length - 1] ?? null;
    writeIndex = committedValues.length - 1;
    enqueuedChildId = null;
    enqueuedSide = null;

    pushStep({
      action: `Commit level ${level + 1} as ${formatValueArray(committedValues)} in the final answer.`,
      actionKind: "commit-level",
      codeLines: [16],
      explanationBeginner:
        "The whole row has been copied, so we save it as one nested list in the answer.",
      explanationExpert:
        "`answer.push_back(level)` commits exactly the values collected from the frozen frontier.",
      done: false,
    });

    currentId = null;
    writeIndex = null;
    queueFrontId = queueIds[0] ?? null;
    enqueuedChildId = null;
    enqueuedSide = null;

    pushStep({
      action:
        queueIds.length > 0
          ? `Finish level ${level + 1}. The queue now holds the next level ${formatValueArray(valuesFromIds(nodes, queueIds))}.`
          : `Finish level ${level + 1}. The queue is empty, so BFS has collected every level.`,
      actionKind: "finish-level",
      codeLines: [6, 7, 16],
      explanationBeginner:
        queueIds.length > 0
          ? "The current row is done. The children waiting in the queue are the next row."
          : "There are no more nodes waiting, so the traversal is ready to return.",
      explanationExpert:
        queueIds.length > 0
          ? "After exactly `levelSize` pops, the queue contains only the next frontier."
          : "The frontier is exhausted, so the outer `while (!q.empty())` loop terminates.",
      done: false,
    });

    level += 1;
  }

  levelSize = 0;
  indexInLevel = -1;
  writeIndex = null;
  currentId = null;
  queueFrontId = null;
  enqueuedChildId = null;
  enqueuedSide = null;
  currentLevelIds.splice(0, currentLevelIds.length);
  processedLevelIds.splice(0, processedLevelIds.length);
  remainingLevelIds.splice(0, remainingLevelIds.length);
  nextLevelIds.splice(0, nextLevelIds.length);
  activeLevelValues.splice(0, activeLevelValues.length);

  pushStep({
    action: `Return the completed level order traversal ${formatNestedLevels(resultLevels)}.`,
    actionKind: "done",
    codeLines: [18],
    explanationBeginner:
      "Every row has been saved from top to bottom, so the nested answer is complete.",
    explanationExpert:
      "Each node is visited once, giving O(n) time and O(w) auxiliary queue space where `w` is the maximum tree width.",
    done: true,
  });

  return trace;
}
