export type TreeToken = number | null;

export type AverageTreeNode = {
  id: string;
  value: number;
  arrayIndex: number;
  depth: number;
  order: number;
  leftId: string | null;
  rightId: string | null;
};

export type LevelAverageSummary = {
  level: number;
  nodeIds: string[];
  sum: number;
  count: number;
  average: number;
};

export type AveragePointers = {
  level: number;
  levelSize: number;
  indexInLevel: number;
  currentId: string | null;
  queueFrontId: string | null;
  enqueuedChildId: string | null;
  enqueuedSide: "left" | "right" | null;
  runningSum: number;
  runningCount: number;
  runningAverage: number | null;
};

export type AverageState = {
  input: string;
  tokens: TreeToken[];
  rootId: string | null;
  nodes: AverageTreeNode[];
  queueIds: string[];
  currentLevelIds: string[];
  processedLevelIds: string[];
  remainingLevelIds: string[];
  nextLevelIds: string[];
  visitedIds: string[];
  averagedIds: string[];
  levelSummaries: LevelAverageSummary[];
  resultAverages: number[];
};

export type AverageActionKind =
  | "parsed"
  | "empty"
  | "init"
  | "start-level"
  | "pop-node"
  | "add-to-sum"
  | "enqueue-left"
  | "skip-left"
  | "enqueue-right"
  | "skip-right"
  | "capture-average"
  | "finish-level"
  | "done";

export type AverageTraceStep = {
  step: number;
  state: AverageState;
  pointers: AveragePointers;
  action: string;
  actionKind: AverageActionKind;
  codeLines: number[];
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

type MutableNode = AverageTreeNode;

function nodeIdFromIndex(index: number) {
  return `node-${index}`;
}

function cloneNodes(nodes: Map<string, MutableNode>) {
  return [...nodes.values()].sort((a, b) => a.arrayIndex - b.arrayIndex);
}

function cloneSummaries(levelSummaries: LevelAverageSummary[]) {
  return levelSummaries.map((summary) => ({
    ...summary,
    nodeIds: [...summary.nodeIds],
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
    };

    nodes.set(id, node);

    node.leftId = ensureNode(index * 2 + 1);
    node.rightId = ensureNode(index * 2 + 2);

    return id;
  }

  ensureNode(0);
  return nodes;
}

function labelOf(nodes: Map<string, MutableNode>, nodeId: string | null) {
  if (!nodeId) {
    return "none";
  }

  return String(nodes.get(nodeId)?.value ?? "none");
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

export function formatAverage(value: number | null) {
  if (value === null) {
    return "pending";
  }

  return value.toFixed(5);
}

export function formatAverageArray(values: number[]) {
  if (values.length === 0) {
    return "[]";
  }

  return `[${values.map((value) => formatAverage(value)).join(", ")}]`;
}

function formatValueArray(values: number[]) {
  if (values.length === 0) {
    return "[]";
  }

  return `[${values.join(", ")}]`;
}

export function generateTrace(rawInput: string): AverageTraceStep[] {
  const tokens = parseTreeInput(rawInput);
  const nodes = buildNodes(tokens);
  const rootId = nodes.has(nodeIdFromIndex(0)) ? nodeIdFromIndex(0) : null;

  const trace: AverageTraceStep[] = [];
  const queueIds: string[] = [];
  const currentLevelIds: string[] = [];
  const processedLevelIds: string[] = [];
  const remainingLevelIds: string[] = [];
  const nextLevelIds: string[] = [];
  const visitedIds: string[] = [];
  const averagedIds: string[] = [];
  const levelSummaries: LevelAverageSummary[] = [];

  let level = 0;
  let levelSize = 0;
  let indexInLevel = -1;
  let currentId: string | null = null;
  let queueFrontId: string | null = null;
  let enqueuedChildId: string | null = null;
  let enqueuedSide: "left" | "right" | null = null;
  let runningSum = 0;
  let runningCount = 0;
  let runningAverage: number | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    explanationBeginner,
    explanationExpert,
    done,
  }: {
    action: string;
    actionKind: AverageActionKind;
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
        tokens,
        rootId,
        nodes: cloneNodes(nodes),
        queueIds: [...queueIds],
        currentLevelIds: [...currentLevelIds],
        processedLevelIds: [...processedLevelIds],
        remainingLevelIds: [...remainingLevelIds],
        nextLevelIds: [...nextLevelIds],
        visitedIds: [...visitedIds],
        averagedIds: [...averagedIds],
        levelSummaries: cloneSummaries(levelSummaries),
        resultAverages: levelSummaries.map((summary) => summary.average),
      },
      pointers: {
        level,
        levelSize,
        indexInLevel,
        currentId,
        queueFrontId,
        enqueuedChildId,
        enqueuedSide,
        runningSum,
        runningCount,
        runningAverage,
      },
    });
  }

  pushStep({
    action:
      tokens.length === 0
        ? "Parse the level-order input. The tree is empty."
        : "Parse the level-order input and build the tree for BFS level averaging.",
    actionKind: "parsed",
    codeLines: [1],
    explanationBeginner:
      tokens.length === 0
        ? "There are no nodes, so there are no level averages to compute."
        : "We first build the tree, then BFS will walk one level at a time and average the values in that row.",
    explanationExpert:
      tokens.length === 0
        ? "The empty-input guard terminates immediately."
        : "The trace begins from a deserialized sparse binary tree that will be consumed by a standard breadth-first traversal.",
    done: false,
  });

  if (!rootId) {
    pushStep({
      action: "The root is null, so the result is an empty list of averages.",
      actionKind: "empty",
      codeLines: [2],
      explanationBeginner:
        "An empty tree has no levels, so there is nothing to average.",
      explanationExpert:
        "The BFS never begins because `root == nullptr`, so the function returns an empty vector.",
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
      "BFS starts with only the root in the queue.",
    explanationExpert:
      "The queue stores the current frontier. Seeding it with the root establishes level-order traversal.",
    done: false,
  });

  while (queueIds.length > 0) {
    const activeLevelIds = queueIds.slice();

    levelSize = activeLevelIds.length;
    indexInLevel = -1;
    currentId = null;
    queueFrontId = queueIds[0] ?? null;
    enqueuedChildId = null;
    enqueuedSide = null;
    runningSum = 0;
    runningCount = 0;
    runningAverage = null;

    currentLevelIds.splice(0, currentLevelIds.length, ...activeLevelIds);
    processedLevelIds.splice(0, processedLevelIds.length);
    remainingLevelIds.splice(0, remainingLevelIds.length, ...activeLevelIds);
    nextLevelIds.splice(0, nextLevelIds.length);

    pushStep({
      action: `Start level ${level + 1}. Freeze the level size at ${levelSize} so the running sum only uses nodes from this row.`,
      actionKind: "start-level",
      codeLines: [6, 7, 8],
      explanationBeginner:
        "We lock in how many nodes belong to this level before processing anything, so the average only uses this row.",
      explanationExpert:
        "Capturing `levelSize = q.size()` isolates the current frontier and prevents newly enqueued children from leaking into the present average.",
      done: false,
    });

    for (let index = 0; index < levelSize; index += 1) {
      indexInLevel = index;
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
        action: `Pop node ${currentNode.value} from the queue and inspect it inside level ${level + 1}.`,
        actionKind: "pop-node",
        codeLines: [9, 10, 11],
        explanationBeginner:
          "The queue removes nodes from left to right inside the current level.",
        explanationExpert:
          "After `q.front()` and `q.pop()`, the traversal owns the next node in the frozen frontier.",
        done: false,
      });

      runningSum += currentNode.value;
      runningCount = index + 1;
      runningAverage = runningSum / runningCount;

      pushStep({
        action: `Add ${currentNode.value} into the running sum. The level total is now ${runningSum} across ${runningCount} processed node${runningCount === 1 ? "" : "s"}.`,
        actionKind: "add-to-sum",
        codeLines: [8, 12],
        explanationBeginner:
          "Every node on the level contributes its value to the running total. The live average is sum divided by how many nodes we have counted so far.",
        explanationExpert:
          "This mirrors `levelSum += node->val`; the partial average is informative, but only the final `levelSum / levelSize` is committed to the answer.",
        done: false,
      });

      if (currentNode.leftId) {
        queueIds.push(currentNode.leftId);
        nextLevelIds.push(currentNode.leftId);
        queueFrontId = queueIds[0] ?? null;
        enqueuedChildId = currentNode.leftId;
        enqueuedSide = "left";

        pushStep({
          action: `Enqueue the left child ${labelOf(nodes, currentNode.leftId)} so it will be part of the next level.`,
          actionKind: "enqueue-left",
          codeLines: [13],
          explanationBeginner:
            "Children do not affect the current average. They wait in the queue for the next row.",
          explanationExpert:
            "Appending the left child preserves the next frontier's left-to-right BFS order.",
          done: false,
        });
      } else {
        enqueuedChildId = null;
        enqueuedSide = "left";

        pushStep({
          action: `Node ${currentNode.value} has no left child, so nothing is added on that side.`,
          actionKind: "skip-left",
          codeLines: [13],
          explanationBeginner:
            "No left child means there is nothing new to queue from this branch.",
          explanationExpert:
            "The left-child enqueue branch is skipped because `node->left` is null.",
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
          action: `Enqueue the right child ${labelOf(nodes, currentNode.rightId)} so the next level stays in left-to-right order.`,
          actionKind: "enqueue-right",
          codeLines: [14],
          explanationBeginner:
            "The right child also waits for the next level after the current row is done.",
          explanationExpert:
            "The queue order remains stable because each node appends its children only after it is popped.",
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
            "Missing children simply reduce how many nodes appear on the next level.",
          explanationExpert:
            "The right-child enqueue branch is skipped when `node->right` is null.",
          done: false,
        });
      }
    }

    const levelAverage = runningSum / levelSize;
    addManyUnique(averagedIds, activeLevelIds);
    levelSummaries.push({
      level: level + 1,
      nodeIds: [...activeLevelIds],
      sum: runningSum,
      count: levelSize,
      average: levelAverage,
    });

    currentId = activeLevelIds[activeLevelIds.length - 1] ?? null;
    enqueuedChildId = null;
    enqueuedSide = null;
    runningAverage = levelAverage;

    pushStep({
      action: `Finish the math for level ${level + 1}: ${runningSum} / ${levelSize} = ${formatAverage(levelAverage)}. Add that average to the answer.`,
      actionKind: "capture-average",
      codeLines: [16],
      explanationBeginner:
        "Once every node on the row has been counted, divide the row sum by the row size to get the level average.",
      explanationExpert:
        "The committed level average is `static_cast<double>(levelSum) / levelSize`, which guarantees floating-point output.",
      done: false,
    });

    currentId = null;
    queueFrontId = queueIds[0] ?? null;
    enqueuedChildId = null;
    enqueuedSide = null;

    pushStep({
      action: queueIds.length > 0
        ? `Finish level ${level + 1}. The queue now contains the next frontier ${formatValueArray(nextLevelIds.map((id) => nodes.get(id)?.value ?? 0))}.`
        : `Finish level ${level + 1}. The queue is empty, so BFS is complete.`,
      actionKind: "finish-level",
      codeLines: [6, 7, 16],
      explanationBeginner:
        queueIds.length > 0
          ? "The current row is complete, so the queued children become the next row to average."
          : "There are no more queued nodes, so all level averages are ready.",
      explanationExpert:
        queueIds.length > 0
          ? "After exactly `levelSize` pops, the queue contains only the next frontier."
          : "The outer `while (!q.empty())` loop terminates because the frontier is exhausted.",
      done: false,
    });

    level += 1;
  }

  const lastSummary = levelSummaries[levelSummaries.length - 1] ?? null;

  levelSize = 0;
  indexInLevel = -1;
  currentId = null;
  queueFrontId = null;
  enqueuedChildId = null;
  enqueuedSide = null;
  runningSum = lastSummary?.sum ?? 0;
  runningCount = lastSummary?.count ?? 0;
  runningAverage = lastSummary?.average ?? null;
  currentLevelIds.splice(0, currentLevelIds.length);
  processedLevelIds.splice(0, processedLevelIds.length);
  remainingLevelIds.splice(0, remainingLevelIds.length);
  nextLevelIds.splice(0, nextLevelIds.length);

  pushStep({
    action: `Return the completed level averages ${formatAverageArray(levelSummaries.map((summary) => summary.average))}.`,
    actionKind: "done",
    codeLines: [18],
    explanationBeginner:
      "Each level contributed one average, so the output array is finished.",
    explanationExpert:
      "Each node is visited once, yielding O(n) time and O(w) auxiliary queue space where `w` is the maximum level width.",
    done: true,
  });

  return trace;
}
