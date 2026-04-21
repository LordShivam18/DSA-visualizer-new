export type TreeToken = number | null;
export type ZigzagDirection = "left-to-right" | "right-to-left";

export type ZigzagTreeNode = {
  id: string;
  value: number;
  arrayIndex: number;
  depth: number;
  order: number;
  leftId: string | null;
  rightId: string | null;
};

export type ZigzagSummary = {
  level: number;
  nodeIds: string[];
  values: number[];
  width: number;
  direction: ZigzagDirection;
};

export type ZigzagPointers = {
  level: number;
  levelSize: number;
  indexInLevel: number;
  writeIndex: number | null;
  currentId: string | null;
  queueFrontId: string | null;
  enqueuedChildId: string | null;
  enqueuedSide: "left" | "right" | null;
  direction: ZigzagDirection;
};

export type ZigzagState = {
  input: string;
  tokens: TreeToken[];
  rootId: string | null;
  nodes: ZigzagTreeNode[];
  queueIds: string[];
  currentLevelIds: string[];
  processedLevelIds: string[];
  remainingLevelIds: string[];
  nextLevelIds: string[];
  visitedIds: string[];
  completedLevelIds: string[];
  activeLevelSlots: Array<number | null>;
  activeBfsValues: number[];
  levelSummaries: ZigzagSummary[];
  resultLevels: number[][];
};

export type ZigzagActionKind =
  | "parsed"
  | "empty"
  | "init"
  | "start-level"
  | "pop-node"
  | "write-value"
  | "enqueue-left"
  | "skip-left"
  | "enqueue-right"
  | "skip-right"
  | "commit-level"
  | "flip-direction"
  | "done";

export type ZigzagTraceStep = {
  step: number;
  state: ZigzagState;
  pointers: ZigzagPointers;
  action: string;
  actionKind: ZigzagActionKind;
  codeLines: number[];
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

type MutableNode = ZigzagTreeNode;

function nodeIdFromIndex(index: number) {
  return `node-${index}`;
}

function cloneNodes(nodes: Map<string, MutableNode>) {
  return [...nodes.values()].sort(
    (a, b) => a.depth - b.depth || a.order - b.order || a.arrayIndex - b.arrayIndex
  );
}

function cloneSummaries(levelSummaries: ZigzagSummary[]) {
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

function oppositeDirection(direction: ZigzagDirection): ZigzagDirection {
  return direction === "left-to-right" ? "right-to-left" : "left-to-right";
}

export function formatDirection(direction: ZigzagDirection) {
  return direction === "left-to-right" ? "left to right" : "right to left";
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

export function formatSlotArray(values: Array<number | null>) {
  if (values.length === 0) {
    return "[]";
  }

  return `[${values.map((value) => (value === null ? "_" : value)).join(", ")}]`;
}

export function formatNestedLevels(levels: number[][]) {
  if (levels.length === 0) {
    return "[]";
  }

  return `[${levels.map((level) => formatValueArray(level)).join(", ")}]`;
}

export function generateTrace(rawInput: string): ZigzagTraceStep[] {
  const tokens = parseTreeInput(rawInput);
  const nodes = buildNodes(tokens);
  const rootId = nodes.has(nodeIdFromIndex(0)) ? nodeIdFromIndex(0) : null;

  const trace: ZigzagTraceStep[] = [];
  const queueIds: string[] = [];
  const currentLevelIds: string[] = [];
  const processedLevelIds: string[] = [];
  const remainingLevelIds: string[] = [];
  const nextLevelIds: string[] = [];
  const visitedIds: string[] = [];
  const completedLevelIds: string[] = [];
  const activeLevelSlots: Array<number | null> = [];
  const activeBfsValues: number[] = [];
  const levelSummaries: ZigzagSummary[] = [];
  const resultLevels: number[][] = [];

  let level = 0;
  let levelSize = 0;
  let indexInLevel = -1;
  let writeIndex: number | null = null;
  let currentId: string | null = null;
  let queueFrontId: string | null = null;
  let enqueuedChildId: string | null = null;
  let enqueuedSide: "left" | "right" | null = null;
  let direction: ZigzagDirection = "left-to-right";

  function resetLevelBuffers(nextCurrentLevelIds: string[]) {
    currentLevelIds.splice(0, currentLevelIds.length, ...nextCurrentLevelIds);
    processedLevelIds.splice(0, processedLevelIds.length);
    remainingLevelIds.splice(0, remainingLevelIds.length, ...nextCurrentLevelIds);
    nextLevelIds.splice(0, nextLevelIds.length);
    activeLevelSlots.splice(
      0,
      activeLevelSlots.length,
      ...Array.from({ length: nextCurrentLevelIds.length }, () => null)
    );
    activeBfsValues.splice(0, activeBfsValues.length);
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
    actionKind: ZigzagActionKind;
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
        activeLevelSlots: [...activeLevelSlots],
        activeBfsValues: [...activeBfsValues],
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
        direction,
      },
    });
  }

  pushStep({
    action:
      tokens.length === 0
        ? "Parse the level-order input. The tree is empty."
        : "Parse the level-order input and build the tree for zigzag BFS.",
    actionKind: "parsed",
    codeLines: [1],
    explanationBeginner:
      tokens.length === 0
        ? "There are no nodes, so there are no zigzag rows to return."
        : "We first build the tree. Then BFS will read one row at a time while the output direction alternates.",
    explanationExpert:
      tokens.length === 0
        ? "The empty-input guard terminates immediately."
        : "The trace starts from a deserialized tree and keeps BFS queue order separate from each level's write direction.",
    done: false,
  });

  if (!rootId) {
    pushStep({
      action: "The root is null, so the zigzag level order traversal is an empty list.",
      actionKind: "empty",
      codeLines: [2],
      explanationBeginner:
        "An empty tree has no rows, so the answer stays empty.",
      explanationExpert:
        "`root == nullptr` returns before the queue and direction flag matter.",
      done: true,
    });

    return trace;
  }

  queueIds.push(rootId);
  queueFrontId = rootId;
  levelSize = queueIds.length;

  pushStep({
    action: `Initialize the queue with the root node ${labelOf(nodes, rootId)} and start moving left to right.`,
    actionKind: "init",
    codeLines: [3, 4, 5, 6],
    explanationBeginner:
      "The root is the first row, and the first row is read normally from left to right.",
    explanationExpert:
      "`leftToRight` starts true while the queue is seeded with the root frontier.",
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
      action: `Start level ${level + 1}. Freeze ${levelSize} node${levelSize === 1 ? "" : "s"} and prepare to write ${formatDirection(direction)}.`,
      actionKind: "start-level",
      codeLines: [7, 8, 9],
      explanationBeginner:
        direction === "left-to-right"
          ? "This row writes values into the output from left to right."
          : "This row writes values into the output from right to left, so the first popped node goes near the end.",
      explanationExpert:
        "`levelSize` freezes the frontier and `vector<int> level(levelSize)` creates indexed slots for directional writes.",
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
        action: `Pop node ${currentNode.value} from the queue as BFS item ${index + 1} of level ${level + 1}.`,
        actionKind: "pop-node",
        codeLines: [10, 11, 12],
        explanationBeginner:
          "The queue still pops nodes left to right. Zigzag changes where the value is written, not how the tree is visited.",
        explanationExpert:
          "FIFO queue order remains normal BFS; only the per-level write index changes with `leftToRight`.",
        done: false,
      });

      writeIndex =
        direction === "left-to-right" ? index : levelSize - 1 - index;
      activeLevelSlots[writeIndex] = currentNode.value;
      activeBfsValues.push(currentNode.value);

      pushStep({
        action: `Write value ${currentNode.value} into slot ${writeIndex}. The zigzag row is now ${formatSlotArray(activeLevelSlots)}.`,
        actionKind: "write-value",
        codeLines: [13, 14],
        explanationBeginner:
          direction === "left-to-right"
            ? "Because this row moves left to right, the value goes into the next open slot from the front."
            : "Because this row moves right to left, the value is placed into a mirrored slot from the back.",
        explanationExpert:
          "`writeIndex = leftToRight ? index : levelSize - 1 - index` maps the BFS pop order into the requested zigzag output order.",
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
          codeLines: [15],
          explanationBeginner:
            "Children still enter the queue in normal left-child then right-child order.",
          explanationExpert:
            "The queue ordering remains standard BFS even while output slots alternate direction.",
          done: false,
        });
      } else {
        enqueuedChildId = null;
        enqueuedSide = "left";

        pushStep({
          action: `Node ${currentNode.value} has no left child, so no left-side node is queued.`,
          actionKind: "skip-left",
          codeLines: [15],
          explanationBeginner:
            "There is no left child to place in the next row.",
          explanationExpert:
            "The `if (node->left)` branch is skipped because the pointer is null.",
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
          codeLines: [16],
          explanationBeginner:
            "The right child joins the queue after the left child, ready for the next row.",
          explanationExpert:
            "Appending right after left preserves the natural next-frontier order.",
          done: false,
        });
      } else {
        enqueuedChildId = null;
        enqueuedSide = "right";

        pushStep({
          action: `Node ${currentNode.value} has no right child, so the queue stays unchanged on that side.`,
          actionKind: "skip-right",
          codeLines: [16],
          explanationBeginner:
            "No right child means this branch adds nothing else for later.",
          explanationExpert:
            "The `if (node->right)` branch is skipped because the pointer is null.",
          done: false,
        });
      }
    }

    const committedValues = activeLevelSlots.map((value) => value ?? 0);
    const committedDirection = direction;
    addManyUnique(completedLevelIds, activeLevelIds);
    levelSummaries.push({
      level: level + 1,
      nodeIds: [...activeLevelIds],
      values: committedValues,
      width: levelSize,
      direction: committedDirection,
    });
    resultLevels.push(committedValues);
    currentId = activeLevelIds[activeLevelIds.length - 1] ?? null;
    writeIndex = null;
    enqueuedChildId = null;
    enqueuedSide = null;

    pushStep({
      action: `Commit level ${level + 1} as ${formatValueArray(committedValues)} after writing ${formatDirection(committedDirection)}.`,
      actionKind: "commit-level",
      codeLines: [18],
      explanationBeginner:
        "The row is full, so we save it in the answer exactly as the zigzag direction arranged it.",
      explanationExpert:
        "`answer.push_back(level)` commits the indexed row after all mirrored writes are complete.",
      done: false,
    });

    direction = oppositeDirection(direction);
    currentId = null;
    queueFrontId = queueIds[0] ?? null;
    enqueuedChildId = null;
    enqueuedSide = null;
    activeLevelSlots.splice(0, activeLevelSlots.length);
    activeBfsValues.splice(0, activeBfsValues.length);

    pushStep({
      action:
        queueIds.length > 0
          ? `Flip direction. The next level will write ${formatDirection(direction)} and the queue now holds ${formatValueArray(valuesFromIds(nodes, queueIds))}.`
          : `Flip direction after the final level. The queue is empty, so traversal is complete.`,
      actionKind: "flip-direction",
      codeLines: [19],
      explanationBeginner:
        queueIds.length > 0
          ? "Zigzag alternates every row, so the next row will write in the opposite direction."
          : "There is no next row, but the alternating rule has finished cleanly.",
      explanationExpert:
        queueIds.length > 0
          ? "`leftToRight = !leftToRight` toggles the write-index formula for the next frozen frontier."
          : "The toggle executes after the row commit; the outer loop then terminates because the queue is empty.",
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
  activeLevelSlots.splice(0, activeLevelSlots.length);
  activeBfsValues.splice(0, activeBfsValues.length);

  pushStep({
    action: `Return the completed zigzag level order traversal ${formatNestedLevels(resultLevels)}.`,
    actionKind: "done",
    codeLines: [21],
    explanationBeginner:
      "Every row has been saved, alternating direction each time, so the zigzag answer is complete.",
    explanationExpert:
      "Each node is visited once, producing O(n) time and O(w) queue plus row-buffer space for maximum width `w`.",
    done: true,
  });

  return trace;
}
