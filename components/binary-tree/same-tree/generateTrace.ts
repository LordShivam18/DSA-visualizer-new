// components/binary-tree/same-tree/generateTrace.ts

export type TraceStep = {
  type: string;
  text: string;
  leftNodes: number[];
  rightNodes: number[];
  comparePair?: { leftVal?: number; rightVal?: number };
  result?: "equal" | "diff" | "continue";
};

export type Node = {
  val: number;
  left: Node | null;
  right: Node | null;
};

/**
 * Safely builds a binary tree from a level-order array.
 * Fully typed & TS-safe.
 */
function makeTreeFromArray(arr: Array<number | null>): Node | null {
  if (!arr.length) return null;

  const nodes: Array<Node | null> = arr.map((v) =>
    v === null ? null : { val: v, left: null, right: null }
  );

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!node) continue;

    const li = 2 * i + 1;
    const ri = 2 * i + 2;

    node.left = li < nodes.length ? nodes[li] : null;
    node.right = ri < nodes.length ? nodes[ri] : null;
  }

  return nodes[0];
}

/**
 * MAIN TRACE GENERATOR (Same Tree Visualization)
 * Fully typed — no more implicit any warnings.
 */
export function generateSameTreeTrace(): TraceStep[] {
  const steps: TraceStep[] = [];

  const aArr = [1, 2, 3];  // left tree
  const bArr = [1, 2, 3];  // right tree (same)

  const A = makeTreeFromArray(aArr);
  const B = makeTreeFromArray(bArr);

  function pushStep(step: TraceStep): void {
    steps.push({ ...step });
  }

  /**
   * Typed recursion for isSameTree, producing trace steps.
   */
  function recurse(
    p: Node | null,
    q: Node | null,
    leftSnapshot: number[],
    rightSnapshot: number[]
  ): boolean {
    if (!p && !q) {
      pushStep({
        type: "null-null",
        text: "Both nodes null → equal",
        leftNodes: [...leftSnapshot],
        rightNodes: [...rightSnapshot],
        result: "equal",
      });
      return true;
    }

    if (!p || !q) {
      pushStep({
        type: "one-null",
        text: "One node null, one not → different",
        leftNodes: [...leftSnapshot],
        rightNodes: [...rightSnapshot],
        comparePair: { leftVal: p?.val, rightVal: q?.val },
        result: "diff",
      });
      return false;
    }

    // Compare values
    pushStep({
      type: "compare-root",
      text: `Compare values: ${p.val} vs ${q.val}`,
      leftNodes: [...leftSnapshot, p.val],
      rightNodes: [...rightSnapshot, q.val],
      comparePair: { leftVal: p.val, rightVal: q.val },
      result: p.val === q.val ? "equal" : "diff",
    });

    if (p.val !== q.val) {
      pushStep({
        type: "compare-val",
        text: `Mismatch at ${p.val} and ${q.val}`,
        leftNodes: [...leftSnapshot, p.val],
        rightNodes: [...rightSnapshot, q.val],
        result: "diff",
      });
      return false;
    }

    // Recurse left
    pushStep({
      type: "recurse-left",
      text: "Values match → checking left subtree",
      leftNodes: [...leftSnapshot, p.val],
      rightNodes: [...rightSnapshot, q.val],
      result: "continue",
    });

    const leftOK: boolean = recurse(
      p.left,
      q.left,
      [...leftSnapshot, p.val],
      [...rightSnapshot, q.val]
    );
    if (!leftOK) return false;

    // Recurse right
    pushStep({
      type: "recurse-right",
      text: "Left equal → checking right subtree",
      leftNodes: [...leftSnapshot, p.val],
      rightNodes: [...rightSnapshot, q.val],
      result: "continue",
    });

    const rightOK: boolean = recurse(
      p.right,
      q.right,
      [...leftSnapshot, p.val],
      [...rightSnapshot, q.val]
    );

    return rightOK;
  }

  pushStep({
    type: "start",
    text: "Start comparing trees",
    leftNodes: [],
    rightNodes: [],
    result: "continue",
  });

  const finalResult: boolean = recurse(A, B, [], []);

  pushStep({
    type: "end",
    text: finalResult ? "Trees are SAME ✓" : "Trees are DIFFERENT ✗",
    leftNodes: [],
    rightNodes: [],
    result: finalResult ? "equal" : "diff",
  });

  return steps;
}

export function generateTrace(): TraceStep[] {
  return generateSameTreeTrace();
}
