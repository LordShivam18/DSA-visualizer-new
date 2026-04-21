export type TreeToken = number | null;

export type LcaTreeNode = {
  id: string;
  value: number;
  arrayIndex: number;
  depth: number;
  order: number;
  leftId: string | null;
  rightId: string | null;
  isLeaf: boolean;
};

export type ReturnReason =
  | "target-self"
  | "split-lca"
  | "bubble-left"
  | "bubble-right"
  | "none";

export type ReturnLedgerEntry = {
  nodeId: string;
  leftReturnId: string | null;
  rightReturnId: string | null;
  resultId: string | null;
  reason: ReturnReason;
};

export type LcaStackFrame = {
  id: string;
  value: number;
  depth: number;
  relation: "root" | "left" | "right";
  matchedTarget: "p" | "q" | null;
  leftReturnId: string | null;
  rightReturnId: string | null;
  resultId: string | null;
  status:
    | "active"
    | "matched-p"
    | "matched-q"
    | "split-lca"
    | "bubble-left"
    | "bubble-right"
    | "no-hit";
};

export type LcaPointers = {
  currentId: string | null;
  parentId: string | null;
  nextChildId: string | null;
  nextDirection: "left" | "right" | null;
  focusNodeId: string | null;
  focusTarget: "p" | "q" | null;
  leftReturnId: string | null;
  rightReturnId: string | null;
  latestReturnId: string | null;
  callDepth: number;
};

export type LcaState = {
  input: string;
  pInput: string;
  qInput: string;
  targetPValue: number | null;
  targetQValue: number | null;
  tokens: TreeToken[];
  rootId: string | null;
  nodes: LcaTreeNode[];
  currentPathIds: string[];
  activeSubtreeIds: string[];
  pId: string | null;
  qId: string | null;
  pPathIds: string[];
  qPathIds: string[];
  sharedPathIds: string[];
  visitedIds: string[];
  resolvedIds: string[];
  matchedTargetIds: string[];
  stack: LcaStackFrame[];
  ledger: ReturnLedgerEntry[];
  resultId: string | null;
  resultValue: number | null;
  nullHits: number;
  visitedCount: number;
};

export type LcaActionKind =
  | "parsed"
  | "empty"
  | "invalid-targets"
  | "missing-targets"
  | "init"
  | "enter-node"
  | "hit-null"
  | "match-p"
  | "match-q"
  | "explore-left"
  | "explore-right"
  | "found-lca"
  | "bubble-left"
  | "bubble-right"
  | "bubble-none"
  | "done";

export type LcaTraceStep = {
  step: number;
  action: string;
  actionKind: LcaActionKind;
  codeLines: number[];
  state: LcaState;
  pointers: LcaPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

type MutableNode = LcaTreeNode;
type MutableFrame = LcaStackFrame;

function nodeIdFromIndex(index: number) {
  return `node-${index}`;
}

function cloneNodes(nodes: Map<string, MutableNode>) {
  return [...nodes.values()].sort((a, b) => a.arrayIndex - b.arrayIndex);
}

function cloneStack(stack: MutableFrame[]) {
  return stack.map((frame) => ({ ...frame }));
}

function cloneLedger(entries: ReturnLedgerEntry[]) {
  return entries.map((entry) => ({ ...entry }));
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
      isLeaf: false,
    };

    nodes.set(id, node);

    const leftId = ensureNode(index * 2 + 1);
    const rightId = ensureNode(index * 2 + 2);

    node.leftId = leftId;
    node.rightId = rightId;
    node.isLeaf = !leftId && !rightId;

    return id;
  }

  ensureNode(0);
  return nodes;
}

function buildSubtreeIdMap(nodes: Map<string, MutableNode>) {
  const memo = new Map<string, string[]>();

  function collect(nodeId: string | null): string[] {
    if (!nodeId) {
      return [];
    }

    const cached = memo.get(nodeId);
    if (cached) {
      return cached;
    }

    const node = nodes.get(nodeId);
    if (!node) {
      return [];
    }

    const ids = [nodeId, ...collect(node.leftId), ...collect(node.rightId)];
    memo.set(nodeId, ids);
    return ids;
  }

  for (const nodeId of nodes.keys()) {
    collect(nodeId);
  }

  return memo;
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

export function parseTargetInput(rawTarget: string) {
  const trimmed = rawTarget.trim();
  if (/^-?\d+$/.test(trimmed)) {
    return Number(trimmed);
  }

  return null;
}

function findPathToValue(
  nodeId: string | null,
  targetValue: number | null,
  nodes: Map<string, MutableNode>,
  path: string[] = []
): string[] {
  if (!nodeId || targetValue === null) {
    return [];
  }

  const node = nodes.get(nodeId);
  if (!node) {
    return [];
  }

  const nextPath = [...path, nodeId];
  if (node.value === targetValue) {
    return nextPath;
  }

  const leftPath = findPathToValue(node.leftId, targetValue, nodes, nextPath);
  if (leftPath.length > 0) {
    return leftPath;
  }

  return findPathToValue(node.rightId, targetValue, nodes, nextPath);
}

function sharedPrefix(idsA: string[], idsB: string[]) {
  const shared: string[] = [];
  const limit = Math.min(idsA.length, idsB.length);

  for (let index = 0; index < limit; index += 1) {
    if (idsA[index] !== idsB[index]) {
      break;
    }

    shared.push(idsA[index]);
  }

  return shared;
}

export function formatLcaResult(value: number | null, pending = false) {
  if (pending) {
    return "searching";
  }

  if (value === null) {
    return "none";
  }

  return String(value);
}

export function formatPathValues(ids: string[], nodes: LcaTreeNode[]) {
  if (ids.length === 0) {
    return "[]";
  }

  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  return `[${ids
    .map((id) => String(nodesById.get(id)?.value ?? "?"))
    .join(" -> ")}]`;
}

export function generateTrace(
  rawInput: string,
  rawPInput: string,
  rawQInput: string
): LcaTraceStep[] {
  const tokens = parseTreeInput(rawInput);
  const targetPValue = parseTargetInput(rawPInput);
  const targetQValue = parseTargetInput(rawQInput);
  const nodes = buildNodes(tokens);
  const subtreeIdMap = buildSubtreeIdMap(nodes);
  const rootId = nodes.has(nodeIdFromIndex(0)) ? nodeIdFromIndex(0) : null;
  const pPathIds = findPathToValue(rootId, targetPValue, nodes);
  const qPathIds = findPathToValue(rootId, targetQValue, nodes);
  const pId = pPathIds[pPathIds.length - 1] ?? null;
  const qId = qPathIds[qPathIds.length - 1] ?? null;
  const sharedPathIds = sharedPrefix(pPathIds, qPathIds);
  const trace: LcaTraceStep[] = [];

  let currentId: string | null = rootId;
  let parentId: string | null = null;
  let nextChildId: string | null = null;
  let nextDirection: "left" | "right" | null = null;
  let focusNodeId: string | null = null;
  let focusTarget: "p" | "q" | null = null;
  let latestReturnId: string | null = null;
  let resultId: string | null = null;
  let resultValue: number | null = null;
  let nullHits = 0;

  const stack: MutableFrame[] = [];
  const visitedIds: string[] = [];
  const resolvedIds: string[] = [];
  const matchedTargetIds: string[] = [];
  const ledger: ReturnLedgerEntry[] = [];

  function addUnique(collection: string[], value: string) {
    if (!collection.includes(value)) {
      collection.push(value);
    }
  }

  function findParentId(childId: string | null) {
    if (!childId) {
      return null;
    }

    for (const node of nodes.values()) {
      if (node.leftId === childId || node.rightId === childId) {
        return node.id;
      }
    }

    return null;
  }

  function upsertLedger(entry: ReturnLedgerEntry) {
    const existingIndex = ledger.findIndex((item) => item.nodeId === entry.nodeId);
    addUnique(resolvedIds, entry.nodeId);

    if (existingIndex >= 0) {
      ledger[existingIndex] = entry;
      return;
    }

    ledger.push(entry);
  }

  function pushStep({
    action,
    actionKind,
    codeLines,
    done,
    explanationBeginner,
    explanationExpert,
  }: {
    action: string;
    actionKind: LcaActionKind;
    codeLines: number[];
    done: boolean;
    explanationBeginner: string;
    explanationExpert: string;
  }) {
    const activeFrame = stack[stack.length - 1] ?? null;
    const activeSubtreeRootId = activeFrame?.id ?? rootId;

    trace.push({
      step: trace.length,
      action,
      actionKind,
      codeLines,
      state: {
        input: rawInput,
        pInput: rawPInput,
        qInput: rawQInput,
        targetPValue,
        targetQValue,
        tokens,
        rootId,
        nodes: cloneNodes(nodes),
        currentPathIds: stack.map((frame) => frame.id),
        activeSubtreeIds: activeSubtreeRootId
          ? [...(subtreeIdMap.get(activeSubtreeRootId) ?? [activeSubtreeRootId])]
          : [],
        pId,
        qId,
        pPathIds: [...pPathIds],
        qPathIds: [...qPathIds],
        sharedPathIds: [...sharedPathIds],
        visitedIds: [...visitedIds],
        resolvedIds: [...resolvedIds],
        matchedTargetIds: [...matchedTargetIds],
        stack: cloneStack(stack),
        ledger: cloneLedger(ledger),
        resultId,
        resultValue,
        nullHits,
        visitedCount: visitedIds.length,
      },
      pointers: {
        currentId,
        parentId,
        nextChildId,
        nextDirection,
        focusNodeId,
        focusTarget,
        leftReturnId: activeFrame?.leftReturnId ?? null,
        rightReturnId: activeFrame?.rightReturnId ?? null,
        latestReturnId,
        callDepth: stack.length,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      tokens.length === 0
        ? "Parse the input tree. It is empty."
        : "Parse the tree and locate the two target values whose lowest common ancestor we want.",
    actionKind: "parsed",
    codeLines: [1],
    done: false,
    explanationBeginner:
      tokens.length === 0
        ? "There is no tree, so there is no ancestor to find."
        : "The visualizer will now follow the recursive rule that bubbles target hits upward until they meet.",
    explanationExpert:
      tokens.length === 0
        ? "The null-root case terminates immediately."
        : "Each recursive call returns one of four things: `null`, `p`, `q`, or the true split-point LCA.",
  });

  if (!rootId) {
    currentId = null;
    parentId = null;
    resultId = null;
    resultValue = null;

    pushStep({
      action: "The root is null, so no lowest common ancestor exists.",
      actionKind: "empty",
      codeLines: [2],
      done: true,
      explanationBeginner:
        "Without any nodes, there is nothing to compare.",
      explanationExpert:
        "The recursive search has no starting node, so the answer is null.",
    });

    return trace;
  }

  if (targetPValue === null || targetQValue === null) {
    currentId = rootId;
    parentId = null;
    resultId = null;
    resultValue = null;

    pushStep({
      action: "At least one target value is not a valid integer input, so the LCA search cannot start.",
      actionKind: "invalid-targets",
      codeLines: [1],
      done: true,
      explanationBeginner:
        "Both target boxes need whole-number node values before the algorithm can compare anything.",
      explanationExpert:
        "Invalid target parsing blocks the pointer-identity comparison that the recursive algorithm relies on.",
    });

    return trace;
  }

  if (!pId || !qId) {
    currentId = rootId;
    parentId = null;
    resultId = null;
    resultValue = null;

    const missing: string[] = [];
    if (!pId) {
      missing.push(`p = ${targetPValue}`);
    }
    if (!qId) {
      missing.push(`q = ${targetQValue}`);
    }

    pushStep({
      action: `The tree does not contain ${missing.join(" and ")}, so a valid LCA cannot be formed.`,
      actionKind: "missing-targets",
      codeLines: [1],
      done: true,
      explanationBeginner:
        "The algorithm needs both target nodes to exist somewhere in the tree.",
      explanationExpert:
        "LeetCode guarantees both targets exist, but custom inputs can violate that precondition and yield no valid answer.",
    });

    return trace;
  }

  currentId = rootId;
  parentId = null;
  nextChildId = rootId;
  nextDirection = null;
  focusNodeId = null;
  focusTarget = null;
  latestReturnId = null;

  pushStep({
    action: `Start the recursive search at the root node ${nodes.get(rootId)?.value}.`,
    actionKind: "init",
    codeLines: [1, 2],
    done: false,
    explanationBeginner:
      "Each subtree will report whether it found `p`, found `q`, found the true ancestor, or found nothing.",
    explanationExpert:
      "The key invariant is the recursive return value, not a global variable: answers bubble upward through return pointers.",
  });

  function dfs(
    nodeId: string | null,
    relation: "root" | "left" | "right"
  ): string | null {
    const callerFrame = stack[stack.length - 1] ?? null;

    if (!nodeId) {
      nullHits += 1;
      currentId = null;
      parentId = callerFrame?.id ?? null;
      nextChildId = null;
      nextDirection = null;
      focusNodeId = null;
      focusTarget = null;
      latestReturnId = null;

      pushStep({
        action: "Reached a null child, so this branch returns null.",
        actionKind: "hit-null",
        codeLines: [2],
        done: false,
        explanationBeginner:
          "An empty branch cannot contain either target node.",
        explanationExpert:
          "The base case returns `nullptr`, which signals that neither target was found in this subtree.",
      });

      return null;
    }

    const node = nodes.get(nodeId);
    if (!node) {
      return null;
    }

    const frame: MutableFrame = {
      id: nodeId,
      value: node.value,
      depth: stack.length,
      relation,
      matchedTarget: null,
      leftReturnId: null,
      rightReturnId: null,
      resultId: null,
      status: "active",
    };

    stack.push(frame);
    addUnique(visitedIds, nodeId);

    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = null;
    nextDirection = null;
    focusNodeId = null;
    focusTarget = null;
    latestReturnId = null;

    pushStep({
      action: `Enter node ${node.value}. Check whether it is null, target p, or target q before exploring children.`,
      actionKind: "enter-node",
      codeLines: [1, 2],
      done: false,
      explanationBeginner:
        "The algorithm always checks the current node first because a target node can count as its own ancestor.",
      explanationExpert:
        "The early-return base case folds three checks together: null, `root == p`, and `root == q`.",
    });

    if (nodeId === pId) {
      frame.matchedTarget = "p";
      frame.resultId = nodeId;
      frame.status = "matched-p";
      latestReturnId = nodeId;
      focusNodeId = nodeId;
      focusTarget = "p";
      addUnique(matchedTargetIds, nodeId);

      upsertLedger({
        nodeId,
        leftReturnId: null,
        rightReturnId: null,
        resultId: nodeId,
        reason: "target-self",
      });

      pushStep({
        action: `Node ${node.value} is target p, so this call returns ${node.value} immediately.`,
        actionKind: "match-p",
        codeLines: [2],
        done: false,
        explanationBeginner:
          "Because a node can be its own descendant, finding p means this subtree already has a valid ancestor candidate.",
        explanationExpert:
          "The early return on `root == p` encodes the descendant-of-self clause from the LCA definition.",
      });

      stack.pop();
      currentId = stack[stack.length - 1]?.id ?? null;
      parentId = findParentId(currentId);
      nextChildId = null;
      nextDirection = null;

      return nodeId;
    }

    if (nodeId === qId) {
      frame.matchedTarget = "q";
      frame.resultId = nodeId;
      frame.status = "matched-q";
      latestReturnId = nodeId;
      focusNodeId = nodeId;
      focusTarget = "q";
      addUnique(matchedTargetIds, nodeId);

      upsertLedger({
        nodeId,
        leftReturnId: null,
        rightReturnId: null,
        resultId: nodeId,
        reason: "target-self",
      });

      pushStep({
        action: `Node ${node.value} is target q, so this call returns ${node.value} immediately.`,
        actionKind: "match-q",
        codeLines: [2],
        done: false,
        explanationBeginner:
          "Finding q means this subtree already has one of the two targets in hand.",
        explanationExpert:
          "The function returns the target pointer itself so callers can detect whether opposite subtrees found the other target.",
      });

      stack.pop();
      currentId = stack[stack.length - 1]?.id ?? null;
      parentId = findParentId(currentId);
      nextChildId = null;
      nextDirection = null;

      return nodeId;
    }

    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = node.leftId;
    nextDirection = "left";
    focusNodeId = null;
    focusTarget = null;
    latestReturnId = null;

    pushStep({
      action: node.leftId
        ? `Node ${node.value} is not a target, so recurse into its left child first.`
        : `Node ${node.value} has no left child, but the recursive algorithm still checks the left branch first.`,
      actionKind: "explore-left",
      codeLines: [3],
      done: false,
      explanationBeginner:
        "The search always explores the left subtree before the right subtree.",
      explanationExpert:
        "This evaluates `lowestCommonAncestor(root->left, p, q)` and stores its return pointer in `left`.",
    });

    const leftReturnId = dfs(node.leftId, "left");
    frame.leftReturnId = leftReturnId;

    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = node.rightId;
    nextDirection = "right";
    focusNodeId = leftReturnId;
    focusTarget = null;
    latestReturnId = leftReturnId;

    pushStep({
      action: node.rightId
        ? `The left subtree returned ${leftReturnId ? nodes.get(leftReturnId)?.value : "null"}. Now recurse into the right child of ${node.value}.`
        : `The left subtree returned ${leftReturnId ? nodes.get(leftReturnId)?.value : "null"}, and the right child is missing, so the next call will return null.`,
      actionKind: "explore-right",
      codeLines: [4],
      done: false,
      explanationBeginner:
        "Once the left side finishes, the algorithm checks the right side and compares the two return values.",
      explanationExpert:
        "The `right` variable will hold the recursive return from the right subtree so the caller can test `left && right`.",
    });

    const rightReturnId = dfs(node.rightId, "right");
    frame.rightReturnId = rightReturnId;

    currentId = nodeId;
    parentId = findParentId(nodeId);
    nextChildId = null;
    nextDirection = null;
    focusTarget = null;

    if (leftReturnId && rightReturnId) {
      frame.resultId = nodeId;
      frame.status = "split-lca";
      latestReturnId = nodeId;
      focusNodeId = nodeId;

      upsertLedger({
        nodeId,
        leftReturnId,
        rightReturnId,
        resultId: nodeId,
        reason: "split-lca",
      });

      pushStep({
        action: `The left subtree returned ${nodes.get(leftReturnId)?.value} and the right subtree returned ${nodes.get(rightReturnId)?.value}, so node ${node.value} is their lowest common ancestor.`,
        actionKind: "found-lca",
        codeLines: [5],
        done: false,
        explanationBeginner:
          "When one target comes from the left side and the other comes from the right side, the current node is the first place they meet.",
        explanationExpert:
          "The split condition `if (left && right)` proves the current root is the lowest node whose subtrees contain both targets.",
      });

      stack.pop();
      currentId = stack[stack.length - 1]?.id ?? null;
      parentId = findParentId(currentId);

      return nodeId;
    }

    if (leftReturnId) {
      frame.resultId = leftReturnId;
      frame.status = "bubble-left";
      latestReturnId = leftReturnId;
      focusNodeId = leftReturnId;

      upsertLedger({
        nodeId,
        leftReturnId,
        rightReturnId,
        resultId: leftReturnId,
        reason: "bubble-left",
      });

      pushStep({
        action: `Only the left subtree returned a candidate (${nodes.get(leftReturnId)?.value}), so node ${node.value} bubbles that answer upward.`,
        actionKind: "bubble-left",
        codeLines: [6],
        done: false,
        explanationBeginner:
          "If only one side finds something useful, the current node just passes that answer to its parent.",
        explanationExpert:
          "The final return falls through to `return left ? left : right`, so the non-null left pointer is preserved.",
      });

      stack.pop();
      currentId = stack[stack.length - 1]?.id ?? null;
      parentId = findParentId(currentId);

      return leftReturnId;
    }

    if (rightReturnId) {
      frame.resultId = rightReturnId;
      frame.status = "bubble-right";
      latestReturnId = rightReturnId;
      focusNodeId = rightReturnId;

      upsertLedger({
        nodeId,
        leftReturnId,
        rightReturnId,
        resultId: rightReturnId,
        reason: "bubble-right",
      });

      pushStep({
        action: `Only the right subtree returned a candidate (${nodes.get(rightReturnId)?.value}), so node ${node.value} bubbles that answer upward.`,
        actionKind: "bubble-right",
        codeLines: [6],
        done: false,
        explanationBeginner:
          "Nothing useful came from the left side, so the right-side answer keeps moving upward.",
        explanationExpert:
          "The right pointer survives the `left ? left : right` expression when `left` is null.",
      });

      stack.pop();
      currentId = stack[stack.length - 1]?.id ?? null;
      parentId = findParentId(currentId);

      return rightReturnId;
    }

    frame.resultId = null;
    frame.status = "no-hit";
    latestReturnId = null;
    focusNodeId = nodeId;

    upsertLedger({
      nodeId,
      leftReturnId,
      rightReturnId,
      resultId: null,
      reason: "none",
    });

    pushStep({
      action: `Neither subtree of node ${node.value} found p or q, so this call returns null.`,
      actionKind: "bubble-none",
      codeLines: [6],
      done: false,
      explanationBeginner:
        "This whole subtree does not help, so it sends back nothing.",
      explanationExpert:
        "A null return means the subtree contains neither target nor a completed LCA result.",
    });

    stack.pop();
    currentId = stack[stack.length - 1]?.id ?? null;
    parentId = findParentId(currentId);

    return null;
  }

  resultId = dfs(rootId, "root");
  resultValue = resultId ? nodes.get(resultId)?.value ?? null : null;
  currentId = resultId;
  parentId = findParentId(resultId);
  nextChildId = null;
  nextDirection = null;
  focusNodeId = resultId;
  focusTarget = null;
  latestReturnId = resultId;

  pushStep({
    action: resultId
      ? `The recursive search is finished. The lowest common ancestor is node ${resultValue}.`
      : "The recursive search finished without finding a valid lowest common ancestor.",
    actionKind: "done",
    codeLines: [1, 5, 6],
    done: true,
    explanationBeginner: resultId
      ? "The final answer is the lowest node where the two target searches come together, or the target itself when one target is an ancestor of the other."
      : "No valid answer was produced for this input.",
    explanationExpert: resultId
      ? "Each node is visited once, so the recursive solution runs in O(n) time with O(h) call-stack space, where h is tree height."
      : "The algorithm returned null because the input violated the usual problem preconditions.",
  });

  return trace;
}
