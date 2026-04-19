export type TreeToken = number | null;

export type FlattenTreeNode = {
  id: string;
  value: number;
  arrayIndex: number;
  depth: number;
  order: number;
  leftId: string | null;
  rightId: string | null;
  originalLeftId: string | null;
  originalRightId: string | null;
};

export type FlattenPointers = {
  currentId: string | null;
  leftHeadId: string | null;
  predecessorId: string | null;
  scanTrailIds: string[];
};

export type FlattenState = {
  input: string;
  tokens: TreeToken[];
  rootId: string | null;
  nodes: FlattenTreeNode[];
  targetPreorderIds: string[];
  flattenedIds: string[];
  remainingIds: string[];
  liveRightChainIds: string[];
  serializedOutput: string[];
};

export type FlattenActionKind =
  | "parsed"
  | "empty"
  | "init"
  | "visit"
  | "no-left"
  | "pick-left"
  | "move-predecessor"
  | "stitch-right"
  | "skip-stitch"
  | "reroute-right"
  | "clear-left"
  | "mark-flat"
  | "advance"
  | "done";

export type FlattenTraceStep = {
  step: number;
  action: string;
  actionKind: FlattenActionKind;
  codeLines: number[];
  state: FlattenState;
  pointers: FlattenPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

type MutableNode = FlattenTreeNode;

function nodeIdFromIndex(index: number) {
  return `node-${index}`;
}

function cloneNodes(nodes: Map<string, MutableNode>) {
  return [...nodes.values()].sort((a, b) => a.arrayIndex - b.arrayIndex);
}

function followRightChain(nodes: Map<string, MutableNode>, startId: string | null) {
  const chain: string[] = [];
  const seen = new Set<string>();
  let cursor = startId;

  while (cursor && nodes.has(cursor) && !seen.has(cursor)) {
    chain.push(cursor);
    seen.add(cursor);
    cursor = nodes.get(cursor)?.rightId ?? null;
  }

  return chain;
}

function collectPreorder(nodes: Map<string, MutableNode>, startId: string | null) {
  const order: string[] = [];
  const seen = new Set<string>();

  function walk(nodeId: string | null) {
    if (!nodeId || !nodes.has(nodeId) || seen.has(nodeId)) {
      return;
    }

    seen.add(nodeId);

    const node = nodes.get(nodeId);
    if (!node) {
      return;
    }

    order.push(nodeId);
    walk(node.leftId);
    walk(node.rightId);
  }

  walk(startId);
  return order;
}

function serializeFlattenedOutput(
  ids: string[],
  nodes: Map<string, MutableNode>
) {
  if (ids.length === 0) {
    return [];
  }

  const output: string[] = [];

  ids.forEach((id, index) => {
    output.push(String(nodes.get(id)?.value ?? ""));

    if (index < ids.length - 1) {
      output.push("null");
    }
  });

  return output;
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
      originalLeftId: null,
      originalRightId: null,
    };

    nodes.set(id, node);

    const leftId = ensureNode(index * 2 + 1);
    const rightId = ensureNode(index * 2 + 2);

    node.leftId = leftId;
    node.rightId = rightId;
    node.originalLeftId = leftId;
    node.originalRightId = rightId;

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

export function formatSerializedOutput(serializedOutput: string[]) {
  if (serializedOutput.length === 0) {
    return "[]";
  }

  return `[${serializedOutput.join(",")}]`;
}

export function generateTrace(rawInput: string): FlattenTraceStep[] {
  const tokens = parseTreeInput(rawInput);
  const nodes = buildNodes(tokens);
  const rootId = nodes.has(nodeIdFromIndex(0)) ? nodeIdFromIndex(0) : null;
  const targetPreorderIds = collectPreorder(nodes, rootId);
  const trace: FlattenTraceStep[] = [];

  let currentId = rootId;
  let leftHeadId: string | null = null;
  let predecessorId: string | null = null;
  let scanTrailIds: string[] = [];
  const flattenedIds: string[] = [];

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: FlattenActionKind;
    codeLines: number[];
    done: boolean;
    explanationBeginner: string;
    explanationExpert: string;
  }) {
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
        targetPreorderIds,
        flattenedIds: [...flattenedIds],
        remainingIds: targetPreorderIds.slice(flattenedIds.length),
        liveRightChainIds: followRightChain(nodes, rootId),
        serializedOutput: serializeFlattenedOutput(flattenedIds, nodes),
      },
      pointers: {
        currentId,
        leftHeadId,
        predecessorId,
        scanTrailIds: [...scanTrailIds],
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
        : "Parse the level-order input and build the connected tree.",
    actionKind: "parsed",
    codeLines: [1, 2],
    done: false,
    explanationBeginner:
      tokens.length === 0
        ? "There is no tree to flatten, so the algorithm will finish immediately."
        : "We first turn the input array into real tree nodes so the pointer rewiring can happen in place.",
    explanationExpert:
      tokens.length === 0
        ? "The deserialized root is null, so the iterative loop never starts."
        : "Deserialize only nodes reachable from the root and keep their child pointers mutable for the trace.",
  });

  if (!rootId) {
    currentId = null;
    leftHeadId = null;
    predecessorId = null;
    scanTrailIds = [];

    pushStep({
      action: "The root is null, so there is nothing to flatten.",
      actionKind: "empty",
      codeLines: [2],
      done: true,
      explanationBeginner:
        "An empty tree already matches the expected output.",
      explanationExpert:
        "The loop guard handles the null-root case in O(1) time.",
    });

    return trace;
  }

  pushStep({
    action: `Initialize current at the root node ${nodes.get(rootId)?.value}.`,
    actionKind: "init",
    codeLines: [2, 3],
    done: false,
    explanationBeginner:
      "current walks the tree in preorder while we rewrite pointers in place.",
    explanationExpert:
      "The iterative solution uses a single moving pointer and reuses the existing tree nodes as list nodes.",
  });

  while (currentId) {
    const currentNode = nodes.get(currentId);

    if (!currentNode) {
      break;
    }

    leftHeadId = currentNode.leftId;
    predecessorId = null;
    scanTrailIds = [];

    pushStep({
      action: `Visit node ${currentNode.value}.`,
      actionKind: "visit",
      codeLines: [3, 4],
      done: false,
      explanationBeginner:
        "At each node we ask one question: does it have a left subtree that needs to be moved into the right chain?",
      explanationExpert:
        "Each iteration locally repairs one node so the prefix of the preorder chain stays correct.",
    });

    if (currentNode.leftId) {
      leftHeadId = currentNode.leftId;
      predecessorId = currentNode.leftId;
      scanTrailIds = [currentNode.leftId];

      pushStep({
        action: `Node ${currentNode.value} has a left subtree, so start predecessor at node ${nodes.get(currentNode.leftId)?.value}.`,
        actionKind: "pick-left",
        codeLines: [4, 5],
        done: false,
        explanationBeginner:
          "predecessor starts at the left child because we need the rightmost node inside that left subtree.",
        explanationExpert:
          "The rightmost node of current.left is where the old right subtree will be appended.",
      });

      while (predecessorId) {
        const predecessorNode = nodes.get(predecessorId);
        const nextPredecessorId = predecessorNode?.rightId ?? null;

        if (!nextPredecessorId) {
          break;
        }

        predecessorId = nextPredecessorId;
        scanTrailIds.push(nextPredecessorId);

        pushStep({
          action: `Move predecessor along the right edge to node ${nodes.get(nextPredecessorId)?.value}.`,
          actionKind: "move-predecessor",
          codeLines: [6, 7],
          done: false,
          explanationBeginner:
            "We keep walking right until we reach the tail of the left subtree.",
          explanationExpert:
            "This loop finds the preorder tail of the left subtree without extra stack or queue storage.",
        });
      }

      const oldRightId = currentNode.rightId;

      if (predecessorId && oldRightId) {
        const predecessorNode = nodes.get(predecessorId);

        if (predecessorNode) {
          predecessorNode.rightId = oldRightId;
        }

        pushStep({
          action: `Append the old right subtree by setting ${nodes.get(predecessorId)?.value}.right -> ${nodes.get(oldRightId)?.value}.`,
          actionKind: "stitch-right",
          codeLines: [9],
          done: false,
          explanationBeginner:
            "The original right subtree is not lost. It gets attached after the tail of the left subtree.",
          explanationExpert:
            "predecessor.right preserves the old current.right so preorder order remains root, left subtree, right subtree.",
        });
      } else {
        pushStep({
          action: `Node ${currentNode.value} has no original right subtree to append after its left side.`,
          actionKind: "skip-stitch",
          codeLines: [9],
          done: false,
          explanationBeginner:
            "Because there was no right subtree, the left subtree can become the whole remainder of the chain.",
          explanationExpert:
            "When current.right is null, predecessor.right stays null and the splice still works.",
        });
      }

      currentNode.rightId = currentNode.leftId;

      pushStep({
        action: `Move the left subtree of node ${currentNode.value} over to the right pointer.`,
        actionKind: "reroute-right",
        codeLines: [10],
        done: false,
        explanationBeginner:
          "This is the key preorder move: the next node after the current root should be its left child.",
        explanationExpert:
          "Assign current.right = current.left so the flattened chain starts following preorder immediately.",
      });

      currentNode.leftId = null;

      pushStep({
        action: `Clear the left pointer of node ${currentNode.value}.`,
        actionKind: "clear-left",
        codeLines: [11],
        done: false,
        explanationBeginner:
          "The linked list must only use right pointers, so every left pointer eventually becomes null.",
        explanationExpert:
          "Nulling current.left enforces the output invariant in place.",
      });
    } else {
      leftHeadId = null;
      predecessorId = null;
      scanTrailIds = [];

      pushStep({
        action: `Node ${currentNode.value} has no left subtree, so its right pointer is already in preorder position.`,
        actionKind: "no-left",
        codeLines: [4],
        done: false,
        explanationBeginner:
          "When the left side is empty, there is nothing to move. This node is already shaped correctly for the list.",
        explanationExpert:
          "The node already satisfies the local flatten invariant: left is null and right already points to the preorder successor.",
      });
    }

    if (!flattenedIds.includes(currentNode.id)) {
      flattenedIds.push(currentNode.id);
    }

    pushStep({
      action: `Node ${currentNode.value} now belongs to the flattened prefix.`,
      actionKind: "mark-flat",
      codeLines: [10, 11, 13],
      done: false,
      explanationBeginner:
        "Everything in the green prefix is already locked into final preorder order.",
      explanationExpert:
        "After the splice, the processed prefix is a valid right-only chain matching preorder.",
    });

    const nextId = currentNode.rightId;
    currentId = nextId;
    leftHeadId = null;
    predecessorId = null;
    scanTrailIds = [];

    pushStep({
      action: nextId
        ? `Advance current to node ${nodes.get(nextId)?.value}.`
        : "Advance current to null because the flattened chain is complete.",
      actionKind: "advance",
      codeLines: [13],
      done: false,
      explanationBeginner: nextId
        ? "We keep walking down the right pointers, which gradually become the linked list."
        : "There is no next node, so the algorithm is about to stop.",
      explanationExpert: nextId
        ? "The loop progresses strictly through right pointers, which represent the evolving preorder chain."
        : "current becomes null after the tail node, terminating the loop.",
    });
  }

  pushStep({
    action: "All nodes now form one right-only linked list in preorder.",
    actionKind: "done",
    codeLines: [15],
    done: true,
    explanationBeginner:
      "The tree has been flattened so every node points right to the next preorder value.",
    explanationExpert:
      "The algorithm runs in O(n) time and O(1) auxiliary space by rewiring pointers in place.",
  });

  return trace;
}
