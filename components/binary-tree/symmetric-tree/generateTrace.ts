// simple trace generator for symmetric check
// returns steps describing comparisons and recursion entries/exits

export type TreeNode = {
  val: number | null;
  left?: TreeNode | null;
  right?: TreeNode | null;
  id?: string;
};

export type TraceStep =
  | { type: "start"; root?: TreeNode }
  | { type: "compare"; leftId?: string; rightId?: string; leftVal?: number | null; rightVal?: number | null; ok?: boolean }
  | { type: "enter"; leftId?: string; rightId?: string }
  | { type: "exit"; leftId?: string; rightId?: string; result?: boolean }
  | { type: "done"; result?: boolean };

function makeTreeFromArray(arr: Array<number | null>): TreeNode | null {
  if (!arr || arr.length === 0) return null;
  const nodes = arr.map((v, i) => (v === null ? null : { val: v, id: `n-${i}` } as TreeNode | null));
  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i]) continue;
    const li = 2 * i + 1;
    const ri = 2 * i + 2;
    nodes[i]!.left = li < nodes.length ? nodes[li] : null;
    nodes[i]!.right = ri < nodes.length ? nodes[ri] : null;
  }
  return nodes[0];
}

export function generateSymmetricTrace(): TraceStep[] {
  // Example balanced tree:
  // change the array to try other inputs
  const arr: Array<number | null> = [1, 2, 2, 3, 4, 4, 3]; // symmetric example
  const root = makeTreeFromArray(arr);
  const steps: TraceStep[] = [{ type: "start", root: root || undefined }];

  function recurse(l: TreeNode | null | undefined, r: TreeNode | null | undefined): boolean {
    const leftId = (l && l.id) || "null";
    const rightId = (r && r.id) || "null";

    steps.push({ type: "enter", leftId, rightId });

    // both null -> symmetric at this branch
    if (!l && !r) {
      steps.push({ type: "compare", leftId, rightId, leftVal: null, rightVal: null, ok: true });
      steps.push({ type: "exit", leftId, rightId, result: true });
      return true;
    }

    // one null -> fail
    if (!l || !r) {
      steps.push({ type: "compare", leftId, rightId, leftVal: l ? l.val : null, rightVal: r ? r.val : null, ok: false });
      steps.push({ type: "exit", leftId, rightId, result: false });
      return false;
    }

    // compare values
    const ok = l.val === r.val;
    steps.push({ type: "compare", leftId, rightId, leftVal: l.val, rightVal: r.val, ok });

    if (!ok) {
      steps.push({ type: "exit", leftId, rightId, result: false });
      return false;
    }

    // recurse left.right vs right.left and left.left vs right.right
    const res1 = recurse(l.left, r.right);
    if (!res1) {
      steps.push({ type: "exit", leftId, rightId, result: false });
      return false;
    }
    const res2 = recurse(l.right, r.left);
    const result = res2;
    steps.push({ type: "exit", leftId, rightId, result });
    return result;
  }

  const final = recurse(root ? root.left : null, root ? root.right : null);
  steps.push({ type: "done", result: final });
  return steps;
}

export function generateTrace(): TraceStep[] {
  return generateSymmetricTrace();
}
