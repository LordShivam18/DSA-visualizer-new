export type Mode = "beginner" | "expert";

export type GridValue = 0 | 1;

export type RegionPointer = {
  row: number;
  col: number;
  size: number;
};

export type QuadTreeNodeRecord = {
  id: string;
  path: string;
  depth: number;
  row: number;
  col: number;
  size: number;
  val: boolean;
  isLeaf: boolean;
  parentId: string | null;
  quadrant: "root" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  topLeftId: string | null;
  topRightId: string | null;
  bottomLeftId: string | null;
  bottomRightId: string | null;
};

export type QuadFrame = {
  id: string;
  row: number;
  col: number;
  size: number;
  depth: number;
  quadrant: "root" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  nodeId: string | null;
};

export type QuadTreeState = {
  input: string;
  grid: GridValue[][];
  nodes: QuadTreeNodeRecord[];
  frames: QuadFrame[];
  rootId: string | null;
  leafCount: number;
  internalCount: number;
  result: [number, number][] | null;
  valid: boolean;
  note: string | null;
};

export type QuadTreePointers = {
  activeRegion: RegionPointer | null;
  childRegion: RegionPointer | null;
  childQuadrant:
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight"
    | null;
  focusNodeId: string | null;
  uniformValue: GridValue | null;
  activeFrameId: string | null;
};

export type QuadTreeActionKind =
  | "parsed"
  | "enter-region"
  | "inspect-region"
  | "create-leaf"
  | "split-region"
  | "recurse-child"
  | "return-node"
  | "invalid"
  | "done";

export type QuadTreeTraceStep = {
  step: number;
  action: string;
  actionKind: QuadTreeActionKind;
  codeLines: number[];
  state: QuadTreeState;
  pointers: QuadTreePointers;
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function cloneGrid(grid: GridValue[][]) {
  return grid.map((row) => [...row]);
}

function cloneNodes(nodes: QuadTreeNodeRecord[]) {
  return nodes.map((node) => ({ ...node }));
}

function cloneFrames(frames: QuadFrame[]) {
  return frames.map((frame) => ({ ...frame }));
}

function parseGrid(rawInput: string): GridValue[][] {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed.replace(/'/g, '"'));
    if (Array.isArray(parsed)) {
      return parsed
        .map((row) =>
          Array.isArray(row)
            ? row
                .map((value) => Number(value))
                .filter((value) => value === 0 || value === 1)
                .map((value) => value as GridValue)
            : []
        )
        .filter((row) => row.length > 0);
    }
  } catch {
    // Fallback parsing handles plain text rows.
  }

  return trimmed
    .split(/\r?\n|\|/)
    .map((row) =>
      row
        .replace(/[^01]/g, "")
        .split("")
        .filter((char) => char === "0" || char === "1")
        .map((char) => Number(char) as GridValue)
    )
    .filter((row) => row.length > 0);
}

function isPowerOfTwo(value: number) {
  return value > 0 && (value & (value - 1)) === 0;
}

function isValidQuadGrid(grid: GridValue[][]) {
  const size = grid.length;
  if (size === 0) {
    return true;
  }

  return grid.every((row) => row.length === size) && isPowerOfTwo(size);
}

function leafCount(nodes: QuadTreeNodeRecord[]) {
  return nodes.filter((node) => node.isLeaf).length;
}

function internalCount(nodes: QuadTreeNodeRecord[]) {
  return nodes.filter((node) => !node.isLeaf).length;
}

export function formatRegion(region: RegionPointer | null) {
  if (!region) {
    return "none";
  }

  return `r${region.row}-c${region.col} / size ${region.size}`;
}

export function serializeQuadTree(
  rootId: string | null,
  nodes: QuadTreeNodeRecord[]
): [number, number][] {
  if (!rootId) {
    return [];
  }

  const map = new Map(nodes.map((node) => [node.id, node]));
  const queue: string[] = [rootId];
  const order: [number, number][] = [];

  while (queue.length > 0) {
    const id = queue.shift() as string;
    const node = map.get(id);
    if (!node) {
      continue;
    }

    order.push([node.isLeaf ? 1 : 0, node.val ? 1 : 0]);

    if (!node.isLeaf) {
      if (node.topLeftId) {
        queue.push(node.topLeftId);
      }
      if (node.topRightId) {
        queue.push(node.topRightId);
      }
      if (node.bottomLeftId) {
        queue.push(node.bottomLeftId);
      }
      if (node.bottomRightId) {
        queue.push(node.bottomRightId);
      }
    }
  }

  return order;
}

export function formatSerializedQuad(result: [number, number][] | null) {
  if (!result || result.length === 0) {
    return "[]";
  }

  return `[${result.map((entry) => `[${entry[0]}, ${entry[1]}]`).join(", ")}]`;
}

export function generateTrace(rawInput: string): QuadTreeTraceStep[] {
  const grid = parseGrid(rawInput);
  const valid = isValidQuadGrid(grid);
  const trace: QuadTreeTraceStep[] = [];
  const nodes: QuadTreeNodeRecord[] = [];
  const frames: QuadFrame[] = [];

  let rootId: string | null = null;
  let result: [number, number][] | null = null;
  let note: string | null = null;
  let activeRegion: RegionPointer | null = null;
  let childRegion: RegionPointer | null = null;
  let childQuadrant:
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight"
    | null = null;
  let focusNodeId: string | null = null;
  let uniformValue: GridValue | null = null;
  let activeFrameId: string | null = null;

  let frameCounter = 0;
  let nodeCounter = 0;

  function pushStep({
    action,
    actionKind,
    codeLines,
    explanationBeginner,
    explanationExpert,
    done,
  }: {
    action: string;
    actionKind: QuadTreeActionKind;
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
        grid: cloneGrid(grid),
        nodes: cloneNodes(nodes),
        frames: cloneFrames(frames),
        rootId,
        leafCount: leafCount(nodes),
        internalCount: internalCount(nodes),
        result: result ? [...result] : null,
        valid,
        note,
      },
      pointers: {
        activeRegion: activeRegion ? { ...activeRegion } : null,
        childRegion: childRegion ? { ...childRegion } : null,
        childQuadrant,
        focusNodeId,
        uniformValue,
        activeFrameId,
      },
      explanationBeginner,
      explanationExpert,
      done,
    });
  }

  if (!valid) {
    note =
      "Provide an n x n grid whose side length is a power of two, such as 1, 2, 4, or 8.";
  }

  pushStep({
    action:
      grid.length === 0
        ? "Parse the grid. It is empty, so the quad tree has no nodes."
        : valid
        ? "Parse the grid and prepare the root region that covers the whole board."
        : "Parse the grid, but the input is not a power-of-two square, so the quad-tree rules cannot be applied cleanly.",
    actionKind: valid ? "parsed" : "invalid",
    codeLines: [1, 2],
    explanationBeginner:
      grid.length === 0
        ? "No cells means there is nothing to compress into tree nodes."
        : valid
        ? "The first region is always the whole grid. The algorithm will keep shrinking regions only when they are mixed."
        : "This problem expects a square board that can split evenly into four equal quadrants every time.",
    explanationExpert:
      grid.length === 0
        ? "The empty grid returns an empty structure."
        : valid
        ? "Construction begins from one root region and recursively partitions only non-uniform subregions."
        : "Equal 4-way subdivision requires a square whose side length is a power of two.",
    done: false,
  });

  if (!valid) {
    pushStep({
      action: note as string,
      actionKind: "done",
      codeLines: [1, 2],
      explanationBeginner:
        "Fix the shape first, then rerun the visualizer.",
      explanationExpert:
        "Without valid equal quadrants, the recursive decomposition is ill-defined for this problem statement.",
      done: true,
    });

    return trace;
  }

  if (grid.length === 0) {
    result = [];
    pushStep({
      action: "The grid is empty, so the serialized quad tree is [].",
      actionKind: "done",
      codeLines: [1, 2],
      explanationBeginner:
        "No regions means no tree nodes.",
      explanationExpert:
        "The root pointer remains null.",
      done: true,
    });

    return trace;
  }

  function analyzeRegion(row: number, col: number, size: number) {
    const first = grid[row][col];
    let uniform = true;

    for (let r = row; r < row + size; r += 1) {
      for (let c = col; c < col + size; c += 1) {
        if (grid[r][c] !== first) {
          uniform = false;
          return { uniform, value: first };
        }
      }
    }

    return { uniform, value: first };
  }

  function build(
    row: number,
    col: number,
    size: number,
    depth: number,
    parentId: string | null,
    quadrant: "root" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight",
    path: string
  ): string | null {
    const frame: QuadFrame = {
      id: `frame-${frameCounter}`,
      row,
      col,
      size,
      depth,
      quadrant,
      nodeId: null,
    };
    frameCounter += 1;

    frames.push(frame);
    activeRegion = { row, col, size };
    childRegion = null;
    childQuadrant = null;
    focusNodeId = parentId;
    uniformValue = null;
    activeFrameId = frame.id;

    pushStep({
      action: `Enter region (${row}, ${col}) with side length ${size}.`,
      actionKind: "enter-region",
      codeLines: [4, 5],
      explanationBeginner:
        "The algorithm is zooming into one square chunk of the grid to decide whether it can collapse into one leaf.",
      explanationExpert:
        "Each frame owns a square subregion and returns the quad-tree node that represents it.",
      done: false,
    });

    const info = analyzeRegion(row, col, size);
    uniformValue = info.value;

    pushStep({
      action: info.uniform
        ? `All cells in this region match value ${info.value}, so the region is uniform.`
        : `This region mixes 0s and 1s, so it cannot be compressed into a single leaf.`,
      actionKind: "inspect-region",
      codeLines: [5],
      explanationBeginner: info.uniform
        ? "Because every cell matches, one leaf node can summarize the whole square."
        : "Mixed values mean we must cut the square into four smaller quadrants.",
      explanationExpert: info.uniform
        ? "Uniformity satisfies the leaf-node condition immediately."
        : "A non-uniform region violates the compression predicate and must recurse on equal quadrants.",
      done: false,
    });

    if (info.uniform) {
      const nodeId = `node-${nodeCounter}`;
      nodeCounter += 1;

      const node: QuadTreeNodeRecord = {
        id: nodeId,
        path,
        depth,
        row,
        col,
        size,
        val: info.value === 1,
        isLeaf: true,
        parentId,
        quadrant,
        topLeftId: null,
        topRightId: null,
        bottomLeftId: null,
        bottomRightId: null,
      };

      nodes.push(node);
      frame.nodeId = nodeId;
      focusNodeId = nodeId;

      if (!parentId) {
        rootId = nodeId;
      } else {
        const parent = nodes.find((candidate) => candidate.id === parentId);
        if (parent) {
          if (quadrant === "topLeft") parent.topLeftId = nodeId;
          if (quadrant === "topRight") parent.topRightId = nodeId;
          if (quadrant === "bottomLeft") parent.bottomLeftId = nodeId;
          if (quadrant === "bottomRight") parent.bottomRightId = nodeId;
        }
      }

      pushStep({
        action: `Create leaf node [isLeaf=1, val=${info.value}] for region (${row}, ${col}) size ${size}.`,
        actionKind: "create-leaf",
        codeLines: [5, 6],
        explanationBeginner:
          "One leaf node now stands in for every cell inside this square.",
        explanationExpert:
          "A uniform region compresses to one leaf with val equal to the shared cell value.",
        done: false,
      });

      frames.pop();
      activeRegion = frames.length
        ? {
            row: frames[frames.length - 1].row,
            col: frames[frames.length - 1].col,
            size: frames[frames.length - 1].size,
          }
        : null;
      childRegion = null;
      childQuadrant = null;
      activeFrameId = frames.length ? frames[frames.length - 1].id : null;
      focusNodeId = frames.length ? frames[frames.length - 1].nodeId : nodeId;
      uniformValue = null;

      return nodeId;
    }

    const nodeId = `node-${nodeCounter}`;
    nodeCounter += 1;

    const node: QuadTreeNodeRecord = {
      id: nodeId,
      path,
      depth,
      row,
      col,
      size,
      val: true,
      isLeaf: false,
      parentId,
      quadrant,
      topLeftId: null,
      topRightId: null,
      bottomLeftId: null,
      bottomRightId: null,
    };

    nodes.push(node);
    frame.nodeId = nodeId;
    focusNodeId = nodeId;

    if (!parentId) {
      rootId = nodeId;
    } else {
      const parent = nodes.find((candidate) => candidate.id === parentId);
      if (parent) {
        if (quadrant === "topLeft") parent.topLeftId = nodeId;
        if (quadrant === "topRight") parent.topRightId = nodeId;
        if (quadrant === "bottomLeft") parent.bottomLeftId = nodeId;
        if (quadrant === "bottomRight") parent.bottomRightId = nodeId;
      }
    }

    pushStep({
      action: `Create an internal node and split region (${row}, ${col}) size ${size} into four equal quadrants.`,
      actionKind: "split-region",
      codeLines: [8, 9],
      explanationBeginner:
        "Because the square is mixed, one node is not enough. We need four smaller subproblems.",
      explanationExpert:
        "The internal node becomes a branching point whose four children each represent one quadrant.",
      done: false,
    });

    const half = size / 2;
    const children = [
      {
        quadrant: "topLeft" as const,
        row,
        col,
        path: `${path}0`,
        codeLines: [10],
      },
      {
        quadrant: "topRight" as const,
        row,
        col: col + half,
        path: `${path}1`,
        codeLines: [11],
      },
      {
        quadrant: "bottomLeft" as const,
        row: row + half,
        col,
        path: `${path}2`,
        codeLines: [12],
      },
      {
        quadrant: "bottomRight" as const,
        row: row + half,
        col: col + half,
        path: `${path}3`,
        codeLines: [13],
      },
    ];

    for (const child of children) {
      childQuadrant = child.quadrant;
      childRegion = { row: child.row, col: child.col, size: half };
      activeRegion = { row, col, size };
      focusNodeId = nodeId;

      pushStep({
        action: `Recurse into the ${child.quadrant} quadrant at (${child.row}, ${child.col}) with side length ${half}.`,
        actionKind: "recurse-child",
        codeLines: child.codeLines,
        explanationBeginner:
          "The parent square hands one smaller quadrant to a child recursive call.",
        explanationExpert:
          "Child construction follows a fixed top-left, top-right, bottom-left, bottom-right order.",
        done: false,
      });

      const childId = build(
        child.row,
        child.col,
        half,
        depth + 1,
        nodeId,
        child.quadrant,
        child.path
      );

      if (child.quadrant === "topLeft") node.topLeftId = childId;
      if (child.quadrant === "topRight") node.topRightId = childId;
      if (child.quadrant === "bottomLeft") node.bottomLeftId = childId;
      if (child.quadrant === "bottomRight") node.bottomRightId = childId;
    }

    childRegion = null;
    childQuadrant = null;
    activeRegion = { row, col, size };
    focusNodeId = nodeId;
    uniformValue = null;
    activeFrameId = frame.id;

    pushStep({
      action: `Return the completed internal node for region (${row}, ${col}) size ${size}.`,
      actionKind: "return-node",
      codeLines: [14],
      explanationBeginner:
        "All four children are ready, so this parent region is fully represented now.",
      explanationExpert:
        "The frame returns once every quadrant child pointer has been assigned.",
      done: false,
    });

    frames.pop();
    activeRegion = frames.length
      ? {
          row: frames[frames.length - 1].row,
          col: frames[frames.length - 1].col,
          size: frames[frames.length - 1].size,
        }
      : null;
    activeFrameId = frames.length ? frames[frames.length - 1].id : null;
    focusNodeId = frames.length ? frames[frames.length - 1].nodeId : nodeId;
    childRegion = null;
    childQuadrant = null;

    return nodeId;
  }

  build(0, 0, grid.length, 0, null, "root", "");
  result = serializeQuadTree(rootId, nodes);
  activeRegion = null;
  childRegion = null;
  childQuadrant = null;
  focusNodeId = rootId;
  uniformValue = null;
  activeFrameId = null;

  pushStep({
    action: `Construction finished. One valid serialized quad tree is ${formatSerializedQuad(result)}.`,
    actionKind: "done",
    codeLines: [1, 2],
    explanationBeginner:
      "Uniform regions became leaves, and mixed regions became internal nodes with four children.",
    explanationExpert:
      "The recursion visits each region once and terminates exactly when the uniformity predicate succeeds.",
    done: true,
  });

  return trace;
}
