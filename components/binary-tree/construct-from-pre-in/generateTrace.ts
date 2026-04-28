export type ConstructTraceStep = {
  step: number;
  type: "pick-root" | "empty-range" | "recurse-left" | "recurse-right" | "backtrack" | "done";
  action: string;
  actionKind: ConstructTraceStep["type"];
  state: {
    preorder: number[];
    inorder: number[];
  };
  preIndex?: number;
  inRange?: [number, number];
  rootInIndex?: number;
  nodeId?: string;
  snapshot?: {
    depth?: number;
    rootVal?: number;
    root?: number;
    leftSize?: number;
  };
  explanationBeginner: string;
  explanationExpert: string;
  done: boolean;
};

function parseNumbers(raw: string, fallback: number[]) {
  const values = raw
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .split(/[\s,]+/)
    .map((token) => Number(token.trim()))
    .filter((value) => Number.isFinite(value));

  return values.length > 0 ? values : fallback;
}

export function generateTrace(rawPreorder: string, rawInorder: string) {
  const preorder = parseNumbers(rawPreorder, [3, 9, 20, 15, 7]);
  const inorder = parseNumbers(rawInorder, [9, 3, 15, 20, 7]);
  const steps: ConstructTraceStep[] = [];
  const indexMap = new Map<number, number>();
  inorder.forEach((value, index) => indexMap.set(value, index));

  function push(
    type: ConstructTraceStep["type"],
    partial: Omit<
      ConstructTraceStep,
      | "step"
      | "type"
      | "actionKind"
      | "state"
      | "done"
    >,
    done = false
  ) {
    steps.push({
      step: steps.length,
      type,
      actionKind: type,
      state: { preorder: [...preorder], inorder: [...inorder] },
      done,
      ...partial,
    });
  }

  function build(
    preL: number,
    preR: number,
    inL: number,
    inR: number,
    depth = 0
  ) {
    if (preL > preR || inL > inR) {
      push("empty-range", {
        action: "Return empty subtree",
        preIndex: preL,
        inRange: [inL, inR],
        explanationBeginner: "This range is empty, so the recursive call returns null.",
        explanationExpert: "Base case: preorder or inorder window is empty.",
      });
      return;
    }

    const rootVal = preorder[preL];
    const rootInIndex = indexMap.get(rootVal) ?? inL;
    const leftSize = Math.max(0, rootInIndex - inL);
    const nodeId = `node-${rootVal}-${preL}`;

    push("pick-root", {
      action: `Pick ${rootVal} as root`,
      preIndex: preL,
      rootInIndex,
      inRange: [inL, inR],
      nodeId,
      snapshot: { depth, rootVal },
      explanationBeginner: `Preorder gives ${rootVal} as the next root, and inorder splits its left and right subtrees.`,
      explanationExpert: `root = preorder[${preL}], rootInIndex = ${rootInIndex}, leftSize = ${leftSize}.`,
    });

    push("recurse-left", {
      action: "Build left subtree",
      preIndex: preL + 1,
      rootInIndex,
      inRange: [inL, rootInIndex - 1],
      nodeId,
      snapshot: { root: rootVal, leftSize },
      explanationBeginner: "Values left of the root in inorder belong to the left subtree.",
      explanationExpert: "Recurse into preorder left segment and inorder [inL, rootInIndex - 1].",
    });
    build(preL + 1, preL + leftSize, inL, rootInIndex - 1, depth + 1);

    push("recurse-right", {
      action: "Build right subtree",
      preIndex: preL + leftSize + 1,
      rootInIndex,
      inRange: [rootInIndex + 1, inR],
      nodeId,
      snapshot: { root: rootVal },
      explanationBeginner: "Values right of the root in inorder belong to the right subtree.",
      explanationExpert: "Recurse into the remaining preorder segment and inorder [rootInIndex + 1, inR].",
    });
    build(preL + leftSize + 1, preR, rootInIndex + 1, inR, depth + 1);

    push("backtrack", {
      action: `Return subtree rooted at ${rootVal}`,
      preIndex: preL,
      rootInIndex,
      inRange: [inL, inR],
      nodeId,
      snapshot: { depth, rootVal },
      explanationBeginner: `Both children of ${rootVal} are resolved, so this subtree returns to its parent.`,
      explanationExpert: "Postorder return from recursive construction.",
    });
  }

  build(0, preorder.length - 1, 0, inorder.length - 1);

  push(
    "done",
    {
      action: "Tree construction complete",
      explanationBeginner: "All preorder roots have been placed into the tree.",
      explanationExpert: "The recursive decomposition has consumed every valid segment.",
    },
    true
  );

  return steps;
}
