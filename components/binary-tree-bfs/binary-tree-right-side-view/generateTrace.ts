export type TreeToken = number | null;

export type RightViewTreeNode = {
  id: string;
  value: number;
  arrayIndex: number;
  depth: number;
  order: number;
  leftId: string | null;
  rightId: string | null;
};

export type RightViewLevelSummary = {
  level: number;
  visibleId: string;
  visibleValue: number;
  width: number;
};

export type RightViewPointers = {
  level: number;
  levelSize: number;
  indexInLevel: number;
  currentId: string | null;
  queueFrontId: string | null;
  candidateId: string | null;
  enqueuedChildId: string | null;
  enqueuedSide: "left" | "right" | null;
};

export type RightViewState = {
  input: string;
  tokens: TreeToken[];
  rootId: string | null;
  nodes: RightViewTreeNode[];
  queueIds: string[];
  currentLevelIds: string[];
  processedLevelIds: string[];
  remainingLevelIds: string[];
  nextLevelIds: string[];
  rightViewIds: string[];
  visitedIds: string[];
  levelSummaries: RightViewLevelSummary[];
  resultValues: number[];
};

export type RightViewActionKind =
  | "parsed"
  | "empty"
  | "init"
  | "start-level"
  | "pop-node"
  | "enqueue-left"
  | "skip-left"
  | "enqueue-right"
  | "skip-right"
  | "capture-rightmost"
  | "finish-level"
  | "done";

export type RightViewTraceStep = {
  step: number;
  state: RightViewState;
  pointers: RightViewPointers;
  action: string;
  actionKind: RightViewActionKind;
  codeLines: number[];
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

type MutableNode = RightViewTreeNode;

function nodeIdFromIndex(index: number) {
  return `node-${index}`;
}

function cloneNodes(nodes: Map<string, MutableNode>) {
  return [...nodes.values()].sort((a, b) => a.arrayIndex - b.arrayIndex);
}

function cloneLevelSummaries(levelSummaries: RightViewLevelSummary[]) {
  return levelSummaries.map((summary) => ({ ...summary }));
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

function valuesFromIds(nodes: Map<string, MutableNode>, ids: string[]) {
  return ids
    .map((id) => nodes.get(id)?.value)
    .filter((value): value is number => value !== undefined);
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

export function formatRightView(values: number[]) {
  if (values.length === 0) {
    return "[]";
  }

  return `[${values.join(", ")}]`;
}

export function generateTrace(rawInput: string): RightViewTraceStep[] {
  const tokens = parseTreeInput(rawInput);
  const nodes = buildNodes(tokens);
  const rootId = nodes.has(nodeIdFromIndex(0)) ? nodeIdFromIndex(0) : null;

  const trace: RightViewTraceStep[] = [];
  const queueIds: string[] = [];
  const currentLevelIds: string[] = [];
  const processedLevelIds: string[] = [];
  const remainingLevelIds: string[] = [];
  const nextLevelIds: string[] = [];
  const rightViewIds: string[] = [];
  const visitedIds: string[] = [];
  const levelSummaries: RightViewLevelSummary[] = [];

  let level = 0;
  let levelSize = 0;
  let indexInLevel = -1;
  let currentId: string | null = null;
  let queueFrontId: string | null = null;
  let candidateId: string | null = null;
  let enqueuedChildId: string | null = null;
  let enqueuedSide: "left" | "right" | null = null;

  function addUnique(collection: string[], value: string) {
    if (!collection.includes(value)) {
      collection.push(value);
    }
  }

  function resetLevelBuffers(nextCurrentLevelIds: string[]) {
    currentLevelIds.splice(0, currentLevelIds.length, ...nextCurrentLevelIds);
    processedLevelIds.splice(0, processedLevelIds.length);
    remainingLevelIds.splice(0, remainingLevelIds.length, ...nextCurrentLevelIds);
    nextLevelIds.splice(0, nextLevelIds.length);
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
    actionKind: RightViewActionKind;
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
        rightViewIds: [...rightViewIds],
        visitedIds: [...visitedIds],
        levelSummaries: cloneLevelSummaries(levelSummaries),
        resultValues: valuesFromIds(nodes, rightViewIds),
      },
      pointers: {
        level,
        levelSize,
        indexInLevel,
        currentId,
        queueFrontId,
        candidateId,
        enqueuedChildId,
        enqueuedSide,
      },
    });
  }

  pushStep({
    action:
      tokens.length === 0
        ? "Parse the level-order input. The tree is empty."
        : "Parse the level-order input and build the tree for BFS scanning.",
    actionKind: "parsed",
    codeLines: [1],
    explanationBeginner:
      tokens.length === 0
        ? "There are no nodes, so there is nothing to look at from the right side."
        : "We first turn the input array into a real tree so the queue can visit it level by level.",
    explanationExpert:
      tokens.length === 0
        ? "The empty-input guard will terminate immediately."
        : "The trace starts from a deserialized sparse binary tree whose nodes will be consumed by a standard breadth-first traversal.",
    done: false,
  });

  if (!rootId) {
    pushStep({
      action: "The root is null, so the right side view is an empty list.",
      actionKind: "empty",
      codeLines: [2],
      explanationBeginner:
        "An empty tree has no visible nodes at all.",
      explanationExpert:
        "The BFS never starts because `root == nullptr`, so the answer is an empty vector.",
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
      "BFS begins with just the root in the queue.",
    explanationExpert:
      "The queue holds the current frontier. Starting with only the root guarantees a clean level-order traversal.",
    done: false,
  });

  while (queueIds.length > 0) {
    const activeLevelIds = queueIds.slice();
    levelSize = activeLevelIds.length;
    indexInLevel = -1;
    currentId = null;
    queueFrontId = queueIds[0] ?? null;
    candidateId = activeLevelIds[levelSize - 1] ?? null;
    enqueuedChildId = null;
    enqueuedSide = null;
    resetLevelBuffers(activeLevelIds);

    pushStep({
      action: `Start level ${level + 1}. This level has ${levelSize} node${levelSize === 1 ? "" : "s"}, and the last one popped will become visible from the right side.`,
      actionKind: "start-level",
      codeLines: [6, 7, 8],
      explanationBeginner:
        "We freeze the level size first so we know which node will be the last one on this row.",
      explanationExpert:
        "Capturing `levelSize = q.size()` isolates the current frontier, preventing newly enqueued children from leaking into this level's scan.",
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
        codeLines: [8, 9, 10],
        explanationBeginner:
          "The queue always removes nodes from left to right inside the current level.",
        explanationExpert:
          "After `q.front()` and `q.pop()`, the traversal has exclusive access to the next node in level-order.",
        done: false,
      });

      if (currentNode.leftId) {
        queueIds.push(currentNode.leftId);
        nextLevelIds.push(currentNode.leftId);
        queueFrontId = queueIds[0] ?? null;
        enqueuedChildId = currentNode.leftId;
        enqueuedSide = "left";

        pushStep({
          action: `Enqueue the left child ${labelOf(nodes, currentNode.leftId)} so it will be processed on the next level.`,
          actionKind: "enqueue-left",
          codeLines: [11],
          explanationBeginner:
            "Children are saved for later. They do not belong to the current level anymore.",
          explanationExpert:
            "Appending the left child preserves the queue's left-to-right ordering for the next frontier.",
          done: false,
        });
      } else {
        enqueuedChildId = null;
        enqueuedSide = "left";

        pushStep({
          action: `Node ${currentNode.value} has no left child, so nothing is added for that side.`,
          actionKind: "skip-left",
          codeLines: [11],
          explanationBeginner:
            "A missing left child simply means there is one less node on the next level.",
          explanationExpert:
            "The left-child branch is skipped because `node->left` is null.",
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
          action: `Enqueue the right child ${labelOf(nodes, currentNode.rightId)} to keep the next level in left-to-right order.`,
          actionKind: "enqueue-right",
          codeLines: [12],
          explanationBeginner:
            "The right child also joins the queue, but it waits until the current level finishes.",
          explanationExpert:
            "The queue order remains stable because every node contributes its children after it is popped.",
          done: false,
        });
      } else {
        enqueuedChildId = null;
        enqueuedSide = "right";

        pushStep({
          action: `Node ${currentNode.value} has no right child, so the queue stays unchanged on that side.`,
          actionKind: "skip-right",
          codeLines: [12],
          explanationBeginner:
            "No right child means there is nothing more to add from this branch.",
          explanationExpert:
            "The right-child enqueue branch is skipped when `node->right` is null.",
          done: false,
        });
      }

      if (index === levelSize - 1) {
        rightViewIds.push(currentId);
        levelSummaries.push({
          level: level + 1,
          visibleId: currentId,
          visibleValue: currentNode.value,
          width: levelSize,
        });
        candidateId = currentId;
        enqueuedChildId = null;
        enqueuedSide = null;

        pushStep({
          action: `This is index ${index} of ${levelSize - 1}, so node ${currentNode.value} is the rightmost visible node for level ${level + 1}. Add it to the answer.`,
          actionKind: "capture-rightmost",
          codeLines: [13, 14],
          explanationBeginner:
            "Because this is the last node removed from the level, it is the one you can see from the right side.",
          explanationExpert:
            "The condition `index == levelSize - 1` identifies the rightmost node of the frozen frontier, so its value is appended to the output.",
          done: false,
        });
      }
    }

    currentId = null;
    indexInLevel = levelSize - 1;
    queueFrontId = queueIds[0] ?? null;
    enqueuedChildId = null;
    enqueuedSide = null;

    pushStep({
      action: queueIds.length > 0
        ? `Finish level ${level + 1}. The queue now holds the next level: ${formatRightView(valuesFromIds(nodes, queueIds))}.`
        : `Finish level ${level + 1}. The queue is empty, so BFS is complete.`,
      actionKind: "finish-level",
      codeLines: [16, 17],
      explanationBeginner:
        queueIds.length > 0
          ? "The current row is done, so the queued children become the next row."
          : "There are no more queued nodes, so the traversal is about to end.",
      explanationExpert:
        queueIds.length > 0
          ? "After exactly `levelSize` pops, the queue contains only the next frontier."
          : "The outer `while (!q.empty())` loop will terminate because the frontier is exhausted.",
      done: false,
    });

    level += 1;
  }

  levelSize = 0;
  indexInLevel = -1;
  currentId = null;
  queueFrontId = null;
  candidateId = rightViewIds[rightViewIds.length - 1] ?? null;
  enqueuedChildId = null;
  enqueuedSide = null;
  currentLevelIds.splice(0, currentLevelIds.length);
  processedLevelIds.splice(0, processedLevelIds.length);
  remainingLevelIds.splice(0, remainingLevelIds.length);
  nextLevelIds.splice(0, nextLevelIds.length);

  pushStep({
    action: `Return the completed right side view ${formatRightView(valuesFromIds(nodes, rightViewIds))}.`,
    actionKind: "done",
    codeLines: [18],
    explanationBeginner:
      "One node was saved from each level, so the answer shows exactly what is visible from the right side.",
    explanationExpert:
      "Each node was processed once, yielding O(n) time and O(w) queue space where `w` is the maximum level width.",
    done: true,
  });

  return trace;
}
