export type Mode = "beginner" | "expert";

export type RangePointer = {
  left: number;
  right: number;
};

export type BSTBuildNode = {
  id: string;
  value: number;
  index: number;
  depth: number;
  path: string;
  parentId: string | null;
  side: "root" | "left" | "right";
  rangeLeft: number;
  rangeRight: number;
  leftId: string | null;
  rightId: string | null;
  completed: boolean;
};

export type BuildFrame = {
  id: string;
  left: number;
  right: number;
  depth: number;
  path: string;
  side: "root" | "left" | "right";
  nodeId: string | null;
};

export type SortedArrayToBSTState = {
  input: string;
  nums: number[];
  nodes: BSTBuildNode[];
  frames: BuildFrame[];
  rootId: string | null;
  builtCount: number;
  height: number;
  result: (number | null)[] | null;
};

export type SortedArrayToBSTPointers = {
  activeRange: RangePointer | null;
  midIndex: number | null;
  focusNodeId: string | null;
  parentId: string | null;
  activeFrameId: string | null;
};

export type SortedArrayToBSTActionKind =
  | "parsed"
  | "enter-range"
  | "empty-range"
  | "choose-mid"
  | "create-node"
  | "recurse-left"
  | "recurse-right"
  | "return-node"
  | "done";

export type SortedArrayToBSTTraceStep = {
  step: number;
  action: string;
  actionKind: SortedArrayToBSTActionKind;
  codeLines: number[];
  state: SortedArrayToBSTState;
  pointers: SortedArrayToBSTPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function cloneNodes(nodes: BSTBuildNode[]) {
  return nodes.map((node) => ({ ...node }));
}

function cloneFrames(frames: BuildFrame[]) {
  return frames.map((frame) => ({ ...frame }));
}

function parseNumberArray(rawInput: string) {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    if (Array.isArray(parsed)) {
      return parsed
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value));
    }
  } catch {
    // Fallback parsing handles comma or space separated input.
  }

  return trimmed
    .split(/[\s,|]+/)
    .map((token) => Number(token.trim()))
    .filter((value) => Number.isFinite(value));
}

function heightOf(nodes: BSTBuildNode[]) {
  if (nodes.length === 0) {
    return 0;
  }

  return Math.max(...nodes.map((node) => node.depth)) + 1;
}

export function formatRange(range: RangePointer | null) {
  if (!range) {
    return "none";
  }

  return `[${range.left}, ${range.right}]`;
}

export function serializeLevelOrder(
  rootId: string | null,
  nodes: BSTBuildNode[]
): (number | null)[] {
  if (!rootId) {
    return [];
  }

  const map = new Map(nodes.map((node) => [node.id, node]));
  const queue: Array<string | null> = [rootId];
  const order: Array<number | null> = [];

  while (queue.length > 0) {
    const id = queue.shift() ?? null;
    if (!id) {
      order.push(null);
      continue;
    }

    const node = map.get(id);
    if (!node) {
      order.push(null);
      continue;
    }

    order.push(node.value);
    if (node.leftId || node.rightId) {
      queue.push(node.leftId);
      queue.push(node.rightId);
    }
  }

  while (order.length > 0 && order[order.length - 1] === null) {
    order.pop();
  }

  return order;
}

export function formatLevelOrder(values: (number | null)[] | null) {
  if (!values || values.length === 0) {
    return "[]";
  }

  return `[${values.map((value) => (value === null ? "null" : String(value))).join(", ")}]`;
}

export function generateTrace(rawInput: string): SortedArrayToBSTTraceStep[] {
  const nums = parseNumberArray(rawInput);
  const trace: SortedArrayToBSTTraceStep[] = [];
  const nodes: BSTBuildNode[] = [];
  const frames: BuildFrame[] = [];

  let rootId: string | null = null;
  let result: (number | null)[] | null = null;
  let activeRange: RangePointer | null = null;
  let midIndex: number | null = null;
  let focusNodeId: string | null = null;
  let parentId: string | null = null;
  let activeFrameId: string | null = null;

  let nodeCounter = 0;
  let frameCounter = 0;

  function pushStep({
    action,
    actionKind,
    codeLines,
    explanationBeginner,
    explanationExpert,
    done,
  }: {
    action: string;
    actionKind: SortedArrayToBSTActionKind;
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
      state: {
        input: rawInput,
        nums: [...nums],
        nodes: cloneNodes(nodes),
        frames: cloneFrames(frames),
        rootId,
        builtCount: nodes.length,
        height: heightOf(nodes),
        result: result ? [...result] : null,
      },
      pointers: {
        activeRange: activeRange ? { ...activeRange } : null,
        midIndex,
        focusNodeId,
        parentId,
        activeFrameId,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      nums.length === 0
        ? "Parse the input array. There are no numbers, so the tree will stay empty."
        : "Parse the sorted array and prepare the first recursive call over the full range.",
    actionKind: "parsed",
    codeLines: [1, 2],
    explanationBeginner:
      nums.length === 0
        ? "An empty sorted array produces an empty tree."
        : "The whole array is the first problem, and every recursive call will solve a smaller slice.",
    explanationExpert:
      nums.length === 0
        ? "The empty-input base case returns a null root."
        : "The algorithm delegates all work to a helper that receives inclusive left and right bounds.",
    done: false,
  });

  function build(
    left: number,
    right: number,
    depth: number,
    nextParentId: string | null,
    side: "root" | "left" | "right",
    path: string
  ): string | null {
    const frame: BuildFrame = {
      id: `frame-${frameCounter}`,
      left,
      right,
      depth,
      path,
      side,
      nodeId: null,
    };
    frameCounter += 1;

    frames.push(frame);
    activeRange = { left, right };
    midIndex = null;
    focusNodeId = nextParentId;
    parentId = nextParentId;
    activeFrameId = frame.id;

    pushStep({
      action:
        left <= right
          ? `Enter range [${left}, ${right}] and look for the middle element that will become this subtree root.`
          : `Enter range [${left}, ${right}], which is already empty.`,
      actionKind: "enter-range",
      codeLines: [4, 5],
      explanationBeginner:
        left <= right
          ? "Each recursive call works on one slice of the array and tries to turn that slice into a balanced subtree."
          : "An empty slice means there is no node to create in this direction.",
      explanationExpert:
        left <= right
          ? "The helper treats the current inclusive interval as one subtree construction problem."
          : "The recursion has crossed over, so this branch returns null immediately.",
      done: false,
    });

    if (left > right) {
      pushStep({
        action: `Because left > right, this branch returns null and attaches no child node.`,
        actionKind: "empty-range",
        codeLines: [5],
        explanationBeginner:
          "No numbers are left in this slice, so the subtree is empty.",
        explanationExpert:
          "This is the stopping condition that terminates recursion on exhausted intervals.",
        done: false,
      });

      frames.pop();
      activeRange = frames.length
        ? { left: frames[frames.length - 1].left, right: frames[frames.length - 1].right }
        : null;
      activeFrameId = frames.length ? frames[frames.length - 1].id : null;
      focusNodeId = frames.length ? frames[frames.length - 1].nodeId : null;
      parentId = frames.length ? frames[frames.length - 1].nodeId : null;
      midIndex = null;

      return null;
    }

    const mid = left + Math.floor((right - left) / 2);
    midIndex = mid;

    pushStep({
      action: `Choose index ${mid} (value ${nums[mid]}) as the middle of range [${left}, ${right}].`,
      actionKind: "choose-mid",
      codeLines: [6],
      explanationBeginner:
        "Picking the middle keeps the left and right halves as even as possible, which keeps the tree balanced.",
      explanationExpert:
        "The midpoint minimizes subtree height difference, preserving the height-balanced invariant.",
      done: false,
    });

    const nodeId = `node-${nodeCounter}`;
    nodeCounter += 1;

    const node: BSTBuildNode = {
      id: nodeId,
      value: nums[mid],
      index: mid,
      depth,
      path,
      parentId: nextParentId,
      side,
      rangeLeft: left,
      rangeRight: right,
      leftId: null,
      rightId: null,
      completed: false,
    };

    nodes.push(node);
    frame.nodeId = nodeId;
    focusNodeId = nodeId;
    parentId = nextParentId;

    if (!nextParentId) {
      rootId = nodeId;
    } else {
      const parent = nodes.find((candidate) => candidate.id === nextParentId);
      if (parent) {
        if (side === "left") {
          parent.leftId = nodeId;
        }
        if (side === "right") {
          parent.rightId = nodeId;
        }
      }
    }

    pushStep({
      action:
        side === "root"
          ? `Create the root node ${nums[mid]} from the middle element.`
          : `Create node ${nums[mid]} and attach it as the ${side} child of its parent.`,
      actionKind: "create-node",
      codeLines: [7],
      explanationBeginner:
        "The chosen middle element becomes one tree node, and everything smaller or larger will hang underneath it.",
      explanationExpert:
        "Node creation commits the midpoint as the subtree root before recursive child construction.",
      done: false,
    });

    pushStep({
      action: `Recurse into the left half [${left}, ${mid - 1}] to build values smaller than ${nums[mid]}.`,
      actionKind: "recurse-left",
      codeLines: [8],
      explanationBeginner:
        "Everything to the left of the middle is smaller, so it belongs in the left subtree.",
      explanationExpert:
        "The helper solves the strictly smaller interval for the left child pointer.",
      done: false,
    });

    const leftId = build(left, mid - 1, depth + 1, nodeId, "left", `${path}L`);
    node.leftId = leftId;
    focusNodeId = nodeId;
    parentId = node.parentId;
    activeRange = { left, right };
    activeFrameId = frame.id;
    midIndex = mid;

    pushStep({
      action: `The left subtree of ${nums[mid]} is ready. Now recurse into the right half [${mid + 1}, ${right}].`,
      actionKind: "recurse-right",
      codeLines: [9],
      explanationBeginner:
        "After the smaller values are placed, the larger values build the right subtree.",
      explanationExpert:
        "Control returns to the current frame, then the helper evaluates the strictly larger interval for the right child.",
      done: false,
    });

    const rightId = build(mid + 1, right, depth + 1, nodeId, "right", `${path}R`);
    node.rightId = rightId;
    node.completed = true;
    focusNodeId = nodeId;
    parentId = node.parentId;
    activeRange = { left, right };
    activeFrameId = frame.id;
    midIndex = mid;

    pushStep({
      action: `Return node ${nums[mid]} upward now that both child branches for range [${left}, ${right}] are finished.`,
      actionKind: "return-node",
      codeLines: [10],
      explanationBeginner:
        "This subtree is complete, so recursion hands the finished root node back to its parent call.",
      explanationExpert:
        "The helper returns the fully constructed subtree root after both recursive assignments resolve.",
      done: false,
    });

    frames.pop();
    activeRange = frames.length
      ? { left: frames[frames.length - 1].left, right: frames[frames.length - 1].right }
      : null;
    activeFrameId = frames.length ? frames[frames.length - 1].id : null;
    focusNodeId = frames.length ? frames[frames.length - 1].nodeId : nodeId;
    parentId = frames.length ? nodes.find((candidate) => candidate.id === frames[frames.length - 1].nodeId)?.parentId ?? null : null;
    midIndex = frames.length
      ? nodes.find((candidate) => candidate.id === frames[frames.length - 1].nodeId)?.index ?? null
      : null;

    return nodeId;
  }

  if (nums.length === 0) {
    result = [];
    pushStep({
      action: "There is no midpoint to choose, so the final BST is empty.",
      actionKind: "done",
      codeLines: [1, 2],
      explanationBeginner:
        "An empty array means there is nothing to place in the tree.",
      explanationExpert:
        "The helper never recurses because the initial interval is empty.",
      done: true,
    });

    return trace;
  }

  build(0, nums.length - 1, 0, null, "root", "");
  result = serializeLevelOrder(rootId, nodes);
  activeRange = null;
  midIndex = null;
  activeFrameId = null;
  focusNodeId = rootId;
  parentId = null;

  pushStep({
    action: `The recursion is finished. One valid height-balanced BST has level-order form ${formatLevelOrder(result)}.`,
    actionKind: "done",
    codeLines: [1, 2],
    explanationBeginner:
      "Every slice picked its own middle, so the finished tree stays as balanced as possible.",
    explanationExpert:
      "Each element becomes exactly one node, yielding O(n) construction time and O(log n) recursion depth on balanced splits.",
    done: true,
  });

  return trace;
}
