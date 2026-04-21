export type TreeToken = number | null;
export type BoundValue = number | null;
export type FrameSide = "root" | "left" | "right";

export type ValidateTreeNode = {
  id: string;
  value: number;
  arrayIndex: number;
  depth: number;
  order: number;
  leftId: string | null;
  rightId: string | null;
};

export type ValidationFrame = {
  id: string;
  low: BoundValue;
  high: BoundValue;
  side: FrameSide;
};

export type ValidationRecord = {
  id: string;
  value: number;
  low: BoundValue;
  high: BoundValue;
  valid: boolean;
  reason: string;
};

export type ValidatePointers = {
  focusId: string | null;
  scheduledChildId: string | null;
  scheduledSide: "left" | "right" | null;
  lowerBound: BoundValue;
  upperBound: BoundValue;
  failedBound: "low" | "high" | null;
};

export type ValidateState = {
  input: string;
  tokens: TreeToken[];
  rootId: string | null;
  nodes: ValidateTreeNode[];
  frames: ValidationFrame[];
  validatedIds: string[];
  invalidId: string | null;
  records: ValidationRecord[];
  result: boolean | null;
};

export type ValidateActionKind =
  | "parsed"
  | "empty"
  | "init"
  | "pop-frame"
  | "check-valid"
  | "check-invalid"
  | "schedule-right"
  | "skip-right"
  | "schedule-left"
  | "skip-left"
  | "done";

export type ValidateTraceStep = {
  step: number;
  state: ValidateState;
  pointers: ValidatePointers;
  action: string;
  actionKind: ValidateActionKind;
  codeLines: number[];
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

type MutableNode = ValidateTreeNode;

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

function cloneFrames(frames: ValidationFrame[]) {
  return frames.map((frame) => ({ ...frame }));
}

function cloneRecords(records: ValidationRecord[]) {
  return records.map((record) => ({ ...record }));
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

export function formatBound(value: BoundValue) {
  return value === null ? "open" : String(value);
}

export function formatRange(low: BoundValue, high: BoundValue) {
  return `(${formatBound(low)}, ${formatBound(high)})`;
}

export function formatResult(value: boolean | null) {
  if (value === null) {
    return "pending";
  }

  return value ? "true" : "false";
}

function validationReason(value: number, low: BoundValue, high: BoundValue) {
  if (low !== null && value <= low) {
    return `${value} is not greater than lower bound ${low}.`;
  }

  if (high !== null && value >= high) {
    return `${value} is not less than upper bound ${high}.`;
  }

  return `${value} is inside range ${formatRange(low, high)}.`;
}

export function generateTrace(rawInput: string): ValidateTraceStep[] {
  const tokens = parseTreeInput(rawInput);
  const nodes = buildNodes(tokens);
  const rootId = nodes.has(nodeIdFromIndex(0)) ? nodeIdFromIndex(0) : null;

  const trace: ValidateTraceStep[] = [];
  const frames: ValidationFrame[] = [];
  const validatedIds: string[] = [];
  const records: ValidationRecord[] = [];

  let focusId: string | null = null;
  let scheduledChildId: string | null = null;
  let scheduledSide: "left" | "right" | null = null;
  let lowerBound: BoundValue = null;
  let upperBound: BoundValue = null;
  let failedBound: "low" | "high" | null = null;
  let invalidId: string | null = null;
  let result: boolean | null = null;

  function pushStep({
    action,
    actionKind,
    codeLines,
    explanationBeginner,
    explanationExpert,
    done,
  }: {
    action: string;
    actionKind: ValidateActionKind;
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
        frames: cloneFrames(frames),
        validatedIds: [...validatedIds],
        invalidId,
        records: cloneRecords(records),
        result,
      },
      pointers: {
        focusId,
        scheduledChildId,
        scheduledSide,
        lowerBound,
        upperBound,
        failedBound,
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
        ? "Parse the level-order input. The tree is empty."
        : "Parse the level-order input and prepare strict BST range checks.",
    actionKind: "parsed",
    codeLines: [1],
    explanationBeginner:
      "Every node must fit inside a range. The root starts with no lower or upper limit.",
    explanationExpert:
      "The validator propagates an exclusive lower and upper bound to every subtree.",
    done: false,
  });

  if (!rootId) {
    result = true;
    pushStep({
      action: "An empty tree is valid because it violates no BST rule.",
      actionKind: "empty",
      codeLines: [5],
      explanationBeginner:
        "No node breaks the rules, so the empty tree counts as valid.",
      explanationExpert:
        "The base case `if (!node) return true` accepts empty subtrees.",
      done: true,
    });

    return trace;
  }

  frames.push({ id: rootId, low: null, high: null, side: "root" });
  focusId = rootId;

  pushStep({
    action: `Start with root node ${labelOf(nodes, rootId)} in the open range ${formatRange(null, null)}.`,
    actionKind: "init",
    codeLines: [2, 4],
    explanationBeginner:
      "The root may be any value. Its children will get stricter limits.",
    explanationExpert:
      "The root frame begins with no exclusive lower or upper bound.",
    done: false,
  });

  while (frames.length > 0 && result === null) {
    const frame = frames.pop();
    if (!frame) {
      continue;
    }

    const node = nodes.get(frame.id);
    if (!node) {
      continue;
    }

    focusId = node.id;
    scheduledChildId = null;
    scheduledSide = null;
    lowerBound = frame.low;
    upperBound = frame.high;
    failedBound = null;

    pushStep({
      action: `Check node ${node.value} against allowed range ${formatRange(frame.low, frame.high)}.`,
      actionKind: "pop-frame",
      codeLines: [4, 6],
      explanationBeginner:
        "This node must be bigger than the lower limit and smaller than the upper limit.",
      explanationExpert:
        "The active frame encodes all ancestor constraints that apply to this node.",
      done: false,
    });

    const lowOk = frame.low === null || node.value > frame.low;
    const highOk = frame.high === null || node.value < frame.high;
    const valid = lowOk && highOk;
    const reason = validationReason(node.value, frame.low, frame.high);

    records.push({
      id: node.id,
      value: node.value,
      low: frame.low,
      high: frame.high,
      valid,
      reason,
    });

    if (!valid) {
      invalidId = node.id;
      result = false;
      failedBound = lowOk ? "high" : "low";

      pushStep({
        action: `Node ${node.value} fails the BST rule: ${reason}`,
        actionKind: "check-invalid",
        codeLines: [6],
        explanationBeginner:
          "A single node outside its allowed range means the whole tree is not a valid BST.",
        explanationExpert:
          "The range invariant failed, so the validator can immediately return false.",
        done: true,
      });

      break;
    }

    validatedIds.push(node.id);

    pushStep({
      action: `Node ${node.value} is valid inside ${formatRange(frame.low, frame.high)}.`,
      actionKind: "check-valid",
      codeLines: [6],
      explanationBeginner:
        "This node obeys all limits from its ancestors, so we can check its children.",
      explanationExpert:
        "The strict inequality check passed for both inherited bounds.",
      done: false,
    });

    if (node.rightId) {
      frames.push({
        id: node.rightId,
        low: node.value,
        high: frame.high,
        side: "right",
      });
      scheduledChildId = node.rightId;
      scheduledSide = "right";

      pushStep({
        action: `Schedule right child ${labelOf(nodes, node.rightId)} with range ${formatRange(node.value, frame.high)}.`,
        actionKind: "schedule-right",
        codeLines: [8],
        explanationBeginner:
          "Everything on the right must be greater than the current node and still obey the old upper limit.",
        explanationExpert:
          "The right subtree inherits `low = node->val` and the previous upper bound.",
        done: false,
      });
    } else {
      scheduledChildId = null;
      scheduledSide = "right";

      pushStep({
        action: `Node ${node.value} has no right child, so no right range check is scheduled.`,
        actionKind: "skip-right",
        codeLines: [8],
        explanationBeginner:
          "There is no right branch to validate.",
        explanationExpert:
          "The right recursive call would hit the null base case.",
        done: false,
      });
    }

    if (node.leftId) {
      frames.push({
        id: node.leftId,
        low: frame.low,
        high: node.value,
        side: "left",
      });
      scheduledChildId = node.leftId;
      scheduledSide = "left";

      pushStep({
        action: `Schedule left child ${labelOf(nodes, node.leftId)} with range ${formatRange(frame.low, node.value)}.`,
        actionKind: "schedule-left",
        codeLines: [7],
        explanationBeginner:
          "Everything on the left must be less than the current node and still obey the old lower limit.",
        explanationExpert:
          "The left subtree inherits the previous lower bound and `high = node->val`.",
        done: false,
      });
    } else {
      scheduledChildId = null;
      scheduledSide = "left";

      pushStep({
        action: `Node ${node.value} has no left child, so no left range check is scheduled.`,
        actionKind: "skip-left",
        codeLines: [7],
        explanationBeginner:
          "There is no left branch to validate.",
        explanationExpert:
          "The left recursive call would hit the null base case.",
        done: false,
      });
    }
  }

  if (result === null) {
    result = true;
    focusId = null;
    scheduledChildId = null;
    scheduledSide = null;
    lowerBound = null;
    upperBound = null;
    failedBound = null;

    pushStep({
      action: "Every scheduled node passed its strict range check, so the tree is a valid BST.",
      actionKind: "done",
      codeLines: [7, 8],
      explanationBeginner:
        "All nodes stayed inside their allowed ranges.",
      explanationExpert:
        "All recursive range constraints were satisfied, so the validator returns true.",
      done: true,
    });
  }

  return trace;
}
