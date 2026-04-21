export type GraphNodeRecord = {
  value: number;
  neighbors: number[];
};

export type MappingEntry = {
  original: number;
  clone: number;
};

export type EdgeFocus = {
  from: number;
  to: number;
};

export type CloneGraphState = {
  input: string;
  originalNodes: GraphNodeRecord[];
  cloneNodes: GraphNodeRecord[];
  queue: number[];
  discoveredOriginalIds: number[];
  processedOriginalIds: number[];
  mapping: MappingEntry[];
  clonedCount: number;
  result: number[][] | null;
};

export type CloneGraphPointers = {
  currentOriginal: number | null;
  currentClone: number | null;
  neighborOriginal: number | null;
  queueFront: number | null;
  latestCloned: number | null;
  edgeFocus: EdgeFocus | null;
};

export type CloneGraphActionKind =
  | "parsed"
  | "seed"
  | "dequeue"
  | "inspect-neighbor"
  | "create-clone"
  | "enqueue-neighbor"
  | "skip-neighbor"
  | "link-edge"
  | "done";

export type CloneGraphTraceStep = {
  step: number;
  action: string;
  actionKind: CloneGraphActionKind;
  codeLines: number[];
  state: CloneGraphState;
  pointers: CloneGraphPointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

type MutableCloneNode = {
  value: number;
  neighbors: number[];
};

function parseRow(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  const seen = new Set<number>();
  const neighbors: number[] = [];

  for (const item of value) {
    const numeric = Number(item);
    if (Number.isInteger(numeric) && numeric > 0 && !seen.has(numeric)) {
      seen.add(numeric);
      neighbors.push(numeric);
    }
  }

  return neighbors;
}

export function parseAdjacencyInput(rawInput: string) {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    if (Array.isArray(parsed)) {
      return parsed.map((row) => parseRow(row));
    }
  } catch {
    // Fall back to plain text parsing below.
  }

  return trimmed
    .split(/\r?\n|\|/)
    .map((row) =>
      row
        .replace(/[\[\]]/g, "")
        .split(/[\s,]+/)
        .map((item) => Number(item))
        .filter((value) => Number.isInteger(value) && value > 0)
    );
}

function cloneNodeRecords(nodes: GraphNodeRecord[]) {
  return nodes.map((node) => ({
    value: node.value,
    neighbors: [...node.neighbors],
  }));
}

function cloneMutableNodes(nodes: Map<number, MutableCloneNode>) {
  return [...nodes.values()]
    .sort((left, right) => left.value - right.value)
    .map((node) => ({
      value: node.value,
      neighbors: [...node.neighbors],
    }));
}

function cloneMapping(mapping: Map<number, number>) {
  return [...mapping.entries()]
    .sort((left, right) => left[0] - right[0])
    .map(([original, clone]) => ({ original, clone }));
}

function buildOriginalNodes(adjacency: number[][]) {
  const size = adjacency.length;
  return adjacency.map((neighbors, index) => ({
    value: index + 1,
    neighbors: neighbors.filter((neighbor) => neighbor >= 1 && neighbor <= size),
  }));
}

function buildAdjacencyResult(nodes: Map<number, MutableCloneNode>) {
  return [...nodes.values()]
    .sort((left, right) => left.value - right.value)
    .map((node) => [...node.neighbors]);
}

export function formatAdjacency(adjacency: number[][] | null) {
  if (!adjacency || adjacency.length === 0) {
    return "[]";
  }

  return `[${adjacency.map((row) => `[${row.join(",")}]`).join(",")}]`;
}

export function generateTrace(rawInput: string): CloneGraphTraceStep[] {
  const adjacency = parseAdjacencyInput(rawInput);
  const originalNodes = buildOriginalNodes(adjacency);
  const cloneNodes = new Map<number, MutableCloneNode>();
  const mapping = new Map<number, number>();
  const discovered = new Set<number>();
  const processed: number[] = [];
  const queue: number[] = [];
  const trace: CloneGraphTraceStep[] = [];

  let currentOriginal: number | null = null;
  let currentClone: number | null = null;
  let neighborOriginal: number | null = null;
  let latestCloned: number | null = null;
  let edgeFocus: EdgeFocus | null = null;
  let result: number[][] | null = null;

  function ensureClone(value: number) {
    if (!cloneNodes.has(value)) {
      cloneNodes.set(value, { value, neighbors: [] });
      mapping.set(value, value);
      latestCloned = value;
      return true;
    }

    return false;
  }

  function addDirectedEdge(from: number, to: number) {
    const node = cloneNodes.get(from);
    if (!node) {
      return;
    }

    if (!node.neighbors.includes(to)) {
      node.neighbors.push(to);
    }
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
    actionKind: CloneGraphActionKind;
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
        originalNodes: cloneNodeRecords(originalNodes),
        cloneNodes: cloneMutableNodes(cloneNodes),
        queue: [...queue],
        discoveredOriginalIds: [...discovered],
        processedOriginalIds: [...processed],
        mapping: cloneMapping(mapping),
        clonedCount: cloneNodes.size,
        result: result ? result.map((row) => [...row]) : null,
      },
      pointers: {
        currentOriginal,
        currentClone,
        neighborOriginal,
        queueFront: queue.length > 0 ? queue[0] : null,
        latestCloned,
        edgeFocus: edgeFocus ? { ...edgeFocus } : null,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  pushStep({
    action:
      originalNodes.length === 0
        ? "Parse the adjacency list. The graph is empty."
        : "Parse the adjacency list and prepare the BFS queue plus original-to-clone map.",
    actionKind: "parsed",
    codeLines: [1, 2, 3, 4],
    done: false,
    explanationBeginner:
      originalNodes.length === 0
        ? "There is no starting node, so there is nothing to clone."
        : "The algorithm will walk the original graph once and build matching clone nodes as it goes.",
    explanationExpert:
      originalNodes.length === 0
        ? "A null graph returns null immediately."
        : "The map is the key invariant: it records which original vertices already have clone counterparts.",
  });

  if (originalNodes.length === 0) {
    result = [];

    pushStep({
      action: "Because the input graph is empty, the cloned graph is also empty.",
      actionKind: "done",
      codeLines: [2],
      done: true,
      explanationBeginner:
        "No nodes means no clone work is needed.",
      explanationExpert:
        "The null-input base case terminates before any BFS or allocation happens.",
    });

    return trace;
  }

  ensureClone(1);
  discovered.add(1);
  queue.push(1);
  currentClone = 1;

  pushStep({
    action: "Create the first clone node for value 1, store it in the map, and seed BFS with the original start node.",
    actionKind: "seed",
    codeLines: [5, 6],
    done: false,
    explanationBeginner:
      "Cloning starts from node 1, and the map now remembers that original node 1 already has a matching clone.",
    explanationExpert:
      "The root clone is allocated before traversal so every later edge can target an existing clone reference.",
  });

  while (queue.length > 0) {
    const originalValue = queue.shift() as number;
    currentOriginal = originalValue;
    currentClone = originalValue;
    neighborOriginal = null;
    edgeFocus = null;

    pushStep({
      action: `Dequeue original node ${originalValue} and process its neighbor list.`,
      actionKind: "dequeue",
      codeLines: [7, 8, 9],
      done: false,
      explanationBeginner:
        "BFS pulls one original node at a time and makes sure the clone keeps the same outgoing neighbor connections.",
      explanationExpert:
        "Each dequeue expands one original vertex while the map guarantees clone-node identity reuse.",
    });

    const neighbors = originalNodes[originalValue - 1]?.neighbors ?? [];

    for (const neighborValue of neighbors) {
      neighborOriginal = neighborValue;
      edgeFocus = null;

      pushStep({
        action: `Inspect neighbor ${neighborValue} of original node ${originalValue}.`,
        actionKind: "inspect-neighbor",
        codeLines: [10],
        done: false,
        explanationBeginner:
          "The clone of the current node needs a reference to the clone of this neighbor too.",
        explanationExpert:
          "Every original adjacency entry must be mirrored in the cloned adjacency list.",
      });

      const created = ensureClone(neighborValue);

      if (created) {
        pushStep({
          action: `Neighbor ${neighborValue} has no clone yet, so allocate clone node ${neighborValue} and store it in the map.`,
          actionKind: "create-clone",
          codeLines: [11, 12],
          done: false,
          explanationBeginner:
            "A new original node gets its own brand-new clone node the first time BFS sees it.",
          explanationExpert:
            "The map grows lazily: clones are allocated exactly once on first discovery.",
        });
      }

      if (!discovered.has(neighborValue)) {
        discovered.add(neighborValue);
        queue.push(neighborValue);

        pushStep({
          action: `Neighbor ${neighborValue} is newly discovered, so enqueue the original node for later BFS expansion.`,
          actionKind: "enqueue-neighbor",
          codeLines: [13],
          done: false,
          explanationBeginner:
            "BFS still needs to visit that original node later so its own neighbor list can be cloned too.",
          explanationExpert:
            "Discovery and queueing happen once per original vertex, preserving O(V + E) traversal cost.",
        });
      } else {
        pushStep({
          action: `Neighbor ${neighborValue} was already discovered earlier, so BFS does not enqueue it again.`,
          actionKind: "skip-neighbor",
          codeLines: [11],
          done: false,
          explanationBeginner:
            "The graph can point back to nodes that were already seen, and the queue must not revisit them forever.",
          explanationExpert:
            "The visited-map check prevents duplicate expansions in cyclic graphs.",
        });
      }

      addDirectedEdge(originalValue, neighborValue);
      edgeFocus = { from: originalValue, to: neighborValue };

      pushStep({
        action: `Attach clone node ${neighborValue} to clone node ${originalValue}, copying the original edge relationship.`,
        actionKind: "link-edge",
        codeLines: [15],
        done: false,
        explanationBeginner:
          "The clone keeps the same shape by copying each neighbor connection from the original graph.",
        explanationExpert:
          "Edge cloning reuses clone-node identities from the map, which preserves graph structure even in the presence of cycles.",
      });
    }

    processed.push(originalValue);
  }

  currentOriginal = null;
  currentClone = null;
  neighborOriginal = null;
  edgeFocus = null;
  result = buildAdjacencyResult(cloneNodes);

  pushStep({
    action: "BFS has finished. Every reachable original node now has one clone node and all adjacency lists have been copied.",
    actionKind: "done",
    codeLines: [18],
    done: true,
    explanationBeginner:
      "The cloned graph is complete because every original node was copied once and every original connection was recreated.",
    explanationExpert:
      "The traversal touches each vertex and adjacency entry once, yielding O(V + E) time and O(V) extra space for the queue and map.",
  });

  return trace;
}
