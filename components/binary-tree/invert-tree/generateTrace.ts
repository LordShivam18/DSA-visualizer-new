export type Node = {
  val: number;
  left?: Node | null;
  right?: Node | null;
};

export type Trace = {
  type:
    | "null"
    | "visit"
    | "swap-left"
    | "swap-right"
    | "recurse-left"
    | "recurse-right"
    | "return";
  depth: number;
  value?: number;
  explanation: string;
  codeLine: number;
};

export function generateInvertTrace(): Trace[] {
  const steps: Trace[] = [];

  function invert(node: Node | null, depth = 0): Node | null {
    if (!node) {
      steps.push({
        type: "null",
        depth,
        explanation: "Hit a null node, so this recursive call returns immediately.",
        codeLine: 2,
      });
      return null;
    }

    steps.push({
      type: "visit",
      depth,
      value: node.val,
      explanation: `Visit node ${node.val} and prepare to swap its left and right children.`,
      codeLine: 3,
    });

    steps.push({
      type: "swap-left",
      depth,
      value: node.val,
      explanation: `Store the current left child of node ${node.val} in a temporary pointer.`,
      codeLine: 3,
    });

    steps.push({
      type: "swap-right",
      depth,
      value: node.val,
      explanation: `Swap the child pointers of node ${node.val}.`,
      codeLine: 4,
    });

    steps.push({
      type: "recurse-left",
      depth,
      value: node.val,
      explanation: `Recurse into the new left subtree of node ${node.val}.`,
      codeLine: 6,
    });
    const left = invert(node.right ?? null, depth + 1);

    steps.push({
      type: "recurse-right",
      depth,
      value: node.val,
      explanation: `Recurse into the new right subtree of node ${node.val}.`,
      codeLine: 7,
    });
    const right = invert(node.left ?? null, depth + 1);

    steps.push({
      type: "return",
      depth,
      value: node.val,
      explanation: `Return the inverted subtree rooted at node ${node.val}.`,
      codeLine: 8,
    });

    return { val: node.val, left, right };
  }

  const tree: Node = {
    val: 4,
    left: { val: 2, left: { val: 1 }, right: { val: 3 } },
    right: { val: 7, left: { val: 6 }, right: { val: 9 } },
  };

  invert(tree);
  return steps;
}

export function generateTrace(): Trace[] {
  return generateInvertTrace();
}
