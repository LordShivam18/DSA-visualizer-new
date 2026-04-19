export type TreeToken = number | null;

export type ConnectTreeNode = {
  id: string;
  value: number;
  arrayIndex: number;
  depth: number;
  order: number;
  leftId: string | null;
  rightId: string | null;
  nextId: string | null;
};

export type ConnectPointers = {
  level: number;
  levelStartId: string | null;
  currentId: string | null;
  tailId: string | null;
  nextLevelHeadId: string | null;
  inspectingChildId: string | null;
  inspectingSide: "left" | "right" | null;
};

export type ConnectState = {
  input: string;
  tokens: TreeToken[];
  nodes: ConnectTreeNode[];
  currentLevelIds: string[];
  remainingCurrentIds: string[];
  nextLevelIds: string[];
  serializedOutput: string[];
};

export type ConnectActionKind =
  | "parsed"
  | "empty"
  | "init"
  | "start-level"
  | "visit"
  | "skip-left"
  | "skip-right"
  | "attach-left"
  | "attach-right"
  | "connect-left"
  | "connect-right"
  | "move-tail"
  | "advance-current"
  | "end-level"
  | "move-level-start"
  | "done";

export type ConnectTraceStep = {
  step: number;
  state: ConnectState;
  pointers: ConnectPointers;
  action: string;
  actionKind: ConnectActionKind;
  codeLines: number[];
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

type MutableNode = ConnectTreeNode;

function nodeIdFromIndex(index: number) {
  return `node-${index}`;
}

function cloneNodes(nodes: Map<string, MutableNode>) {
  return [...nodes.values()].sort((a, b) => a.arrayIndex - b.arrayIndex);
}

function followNextChain(nodes: Map<string, MutableNode>, startId: string | null) {
  const chain: string[] = [];
  const seen = new Set<string>();
  let cursor = startId;

  while (cursor && nodes.has(cursor) && !seen.has(cursor)) {
    chain.push(cursor);
    seen.add(cursor);
    cursor = nodes.get(cursor)?.nextId ?? null;
  }

  return chain;
}

function serializeConnectedLevels(nodes: Map<string, MutableNode>) {
  if (nodes.size === 0) {
    return [];
  }

  const byDepth = new Map<number, MutableNode[]>();
  cloneNodes(nodes).forEach((node) => {
    const bucket = byDepth.get(node.depth) ?? [];
    bucket.push(node);
    byDepth.set(node.depth, bucket);
  });

  const output: string[] = [];
  [...byDepth.keys()]
    .sort((a, b) => a - b)
    .forEach((depth) => {
      const levelNodes = (byDepth.get(depth) ?? []).sort(
        (a, b) => a.arrayIndex - b.arrayIndex
      );

      if (levelNodes.length === 0) {
        return;
      }

      const chain = followNextChain(nodes, levelNodes[0].id);
      chain.forEach((id) => {
        output.push(String(nodes.get(id)?.value ?? ""));
      });
      output.push("#");
    });

  return output;
}

function buildNodes(tokens: TreeToken[]) {
  const nodes = new Map<string, MutableNode>();

  tokens.forEach((token, index) => {
    if (token === null) {
      return;
    }

    const depth = Math.floor(Math.log2(index + 1));
    const levelStartIndex = 2 ** depth - 1;

    nodes.set(nodeIdFromIndex(index), {
      id: nodeIdFromIndex(index),
      value: token,
      arrayIndex: index,
      depth,
      order: index - levelStartIndex,
      leftId: null,
      rightId: null,
      nextId: null,
    });
  });

  nodes.forEach((node) => {
    const leftIndex = node.arrayIndex * 2 + 1;
    const rightIndex = node.arrayIndex * 2 + 2;

    node.leftId =
      leftIndex < tokens.length && tokens[leftIndex] !== null
        ? nodeIdFromIndex(leftIndex)
        : null;
    node.rightId =
      rightIndex < tokens.length && tokens[rightIndex] !== null
        ? nodeIdFromIndex(rightIndex)
        : null;
  });

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

export function formatSerializedOutput(serializedOutput: string[]) {
  if (serializedOutput.length === 0) {
    return "[]";
  }

  return `[${serializedOutput.join(",")}]`;
}

export function generateTrace(rawInput: string): ConnectTraceStep[] {
  const tokens = parseTreeInput(rawInput);
  const nodes = buildNodes(tokens);
  const rootId = nodes.has(nodeIdFromIndex(0)) ? nodeIdFromIndex(0) : null;

  const trace: ConnectTraceStep[] = [];

  let level = 0;
  let levelStartId = rootId;
  let currentId: string | null = null;
  let tailId: string | null = null;
  let nextLevelHeadId: string | null = null;
  let inspectingChildId: string | null = null;
  let inspectingSide: "left" | "right" | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: ConnectActionKind;
    codeLines: number[];
    done: boolean;
    explanationBeginner: string;
    explanationExpert: string;
  }) {
    trace.push({
      step: trace.length,
      state: {
        input: rawInput,
        tokens,
        nodes: cloneNodes(nodes),
        currentLevelIds: followNextChain(nodes, levelStartId),
        remainingCurrentIds: followNextChain(nodes, currentId),
        nextLevelIds: followNextChain(nodes, nextLevelHeadId),
        serializedOutput: serializeConnectedLevels(nodes),
      },
      pointers: {
        level,
        levelStartId,
        currentId,
        tailId,
        nextLevelHeadId,
        inspectingChildId,
        inspectingSide,
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
        ? "Parse the input. The tree is empty."
        : "Parse the level-order input and build the tree nodes.",
    actionKind: "parsed",
    codeLines: [2, 3],
    done: false,
    explanationBeginner:
      tokens.length === 0
        ? "There are no nodes to connect, so the visualizer starts with an empty tree."
        : "First we turn the input array into real tree nodes so we can connect their next pointers level by level.",
    explanationExpert:
      tokens.length === 0
        ? "The parsed level-order array is empty, so the algorithm will return immediately."
        : "Deserialize the level-order representation into a sparse binary tree whose next pointers are initially null.",
  });

  if (!rootId) {
    levelStartId = null;
    currentId = null;
    tailId = null;
    nextLevelHeadId = null;
    inspectingChildId = null;
    inspectingSide = null;

    pushStep({
      action: "The root is null, so return immediately.",
      actionKind: "empty",
      codeLines: [2],
      done: true,
      explanationBeginner:
        "An empty tree already satisfies the problem because there are no next pointers to fill in.",
      explanationExpert:
        "The guard clause handles the null root in O(1) time.",
    });

    return trace;
  }

  pushStep({
    action: `Initialize levelStart at the root node ${nodes.get(rootId)?.value}.`,
    actionKind: "init",
    codeLines: [3, 4],
    done: false,
    explanationBeginner:
      "levelStart points to the first node of the level we are currently scanning.",
    explanationExpert:
      "The outer loop is anchored by levelStart, which always references the leftmost reachable node of the current level.",
  });

  while (levelStartId) {
    currentId = levelStartId;
    tailId = null;
    nextLevelHeadId = null;
    inspectingChildId = null;
    inspectingSide = null;

    pushStep({
      action: `Start level ${level + 1}. Reset the dummy chain for the next level.`,
      actionKind: "start-level",
      codeLines: [4, 5, 6],
      done: false,
      explanationBeginner:
        "Each level gets a fresh temporary chain. tail will grow that chain one child at a time.",
      explanationExpert:
        "Reinitialize the dummy head and tail so the next frontier can be constructed in O(1) extra space.",
    });

    while (currentId) {
      const currentNode = nodes.get(currentId);
      if (!currentNode) {
        break;
      }

      inspectingChildId = null;
      inspectingSide = null;

      pushStep({
        action: `Visit node ${currentNode.value} on the current level.`,
        actionKind: "visit",
        codeLines: [7],
        done: false,
        explanationBeginner:
          "We look at one node on the current level and try to add its children to the next level chain.",
        explanationExpert:
          "The inner loop walks the already-connected current frontier using current.next.",
      });

      const childChecks: Array<["left" | "right", string | null]> = [
        ["left", currentNode.leftId],
        ["right", currentNode.rightId],
      ];

      childChecks.forEach(([side, childId]) => {
        const childLine = side === "left" ? [8] : [12];
        const connectLines = side === "left" ? [8, 9] : [12, 13];
        const moveTailLines = side === "left" ? [10] : [14];
        const humanSide = side === "left" ? "left" : "right";

        inspectingSide = side;
        inspectingChildId = childId;

        if (!childId) {
          pushStep({
            action: `Node ${currentNode.value} has no ${humanSide} child, so nothing is linked.`,
            actionKind: side === "left" ? "skip-left" : "skip-right",
            codeLines: childLine,
            done: false,
            explanationBeginner:
              "Missing children are simply skipped. Only real nodes get next pointers.",
            explanationExpert:
              "Null children do not participate in the next-level frontier, so the tail remains unchanged.",
          });
          return;
        }

        const childNode = nodes.get(childId);
        if (!childNode) {
          return;
        }

        if (!nextLevelHeadId) {
          nextLevelHeadId = childId;

          pushStep({
            action: `${childNode.value} becomes the first node of the next level.`,
            actionKind: side === "left" ? "attach-left" : "attach-right",
            codeLines: [...connectLines, ...moveTailLines],
            done: false,
            explanationBeginner:
              "The first child we discover becomes the head of the next level.",
            explanationExpert:
              "dummy.next is established by the first reachable child, which becomes the anchor for the next outer-loop iteration.",
          });
        } else if (tailId) {
          const previousTail = nodes.get(tailId);
          if (previousTail) {
            previousTail.nextId = childId;
          }

          pushStep({
            action: `Connect ${nodes.get(tailId)?.value} -> ${childNode.value} with a next pointer.`,
            actionKind: side === "left" ? "connect-left" : "connect-right",
            codeLines: connectLines,
            done: false,
            explanationBeginner:
              "Because we already found another child on this next level, we connect that older child directly to this one.",
            explanationExpert:
              "Link the previous tail to the newly discovered child so the next frontier stays left-to-right contiguous.",
          });
        }

        tailId = childId;

        pushStep({
          action: `Move tail to ${childNode.value}, the newest node in the next-level chain.`,
          actionKind: "move-tail",
          codeLines: moveTailLines,
          done: false,
          explanationBeginner:
            "tail always points to the last child already connected on the next level.",
          explanationExpert:
            "Advance tail after each attachment so subsequent children append in O(1) time.",
        });
      });

      const nextOnLevel = currentNode.nextId;

      if (nextOnLevel) {
        currentId = nextOnLevel;
        inspectingChildId = null;
        inspectingSide = null;

        pushStep({
          action: `Move current across the level to node ${nodes.get(nextOnLevel)?.value}.`,
          actionKind: "advance-current",
          codeLines: [7],
          done: false,
          explanationBeginner:
            "Instead of going down the tree immediately, we keep walking sideways across the current level with current.next.",
          explanationExpert:
            "The current frontier is traversed purely through next pointers, eliminating the need for an auxiliary queue.",
        });
      } else {
        currentId = null;
        inspectingChildId = null;
        inspectingSide = null;

        pushStep({
          action: `Reached the end of level ${level + 1}.`,
          actionKind: "end-level",
          codeLines: [7, 16],
          done: false,
          explanationBeginner:
            "There are no more nodes on this level, so the next step is to drop to the level we just built.",
          explanationExpert:
            "The inner scan terminates when current becomes null, meaning the present frontier is fully processed.",
        });
      }
    }

    levelStartId = nextLevelHeadId;
    currentId = null;
    tailId = null;
    inspectingChildId = null;
    inspectingSide = null;

    pushStep({
      action: levelStartId
        ? `Move levelStart down to node ${nodes.get(levelStartId)?.value}.`
        : "No children were added, so there is no next level to scan.",
      actionKind: "move-level-start",
      codeLines: [17],
      done: false,
      explanationBeginner: levelStartId
        ? "The next level is ready, so levelStart jumps to its first node."
        : "Because we found no children, the algorithm is finished.",
      explanationExpert: levelStartId
        ? "Set levelStart to dummy.next so the outer loop can process the next frontier."
        : "dummy.next is null, so the outer loop will terminate after this transition.",
    });

    level += 1;
  }

  pushStep({
    action: "All next pointers are populated. Return the root.",
    actionKind: "done",
    codeLines: [19],
    done: true,
    explanationBeginner:
      "Every level now points left-to-right through next pointers, and each level ends with NULL.",
    explanationExpert:
      "The traversal touched each node once, yielding O(n) time and O(1) auxiliary space beyond the recursion-free pointers.",
  });

  return trace;
}
