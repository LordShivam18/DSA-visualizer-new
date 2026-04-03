// components/binary-tree/construct-from-pre-in/layoutEngine.ts
export type NodeLayout = {
  id: string;
  value: number;
  preorderIndex: number | null;
  inorderIndex: number | null;
  parentId?: string | null;
  x: number; // canvas x
  y: number; // canvas y
};

type BarsLayout = {
  preorderCellCenters: number[]; // x positions
  inorderCellCenters: number[]; // x positions
  leftPadding: number;
  cellWidth: number;
};

export function computeBarsLayout(
  containerWidth: number,
  count: number,
  options?: { leftPadding?: number; minCellWidth?: number }
): BarsLayout {
  const leftPadding = options?.leftPadding ?? 40;
  const minCellWidth = options?.minCellWidth ?? 56;
  const available = Math.max(0, containerWidth - leftPadding * 2);
  const cellWidth = Math.max(minCellWidth, available / Math.max(count, 1));
  const preorderCellCenters: number[] = [];
  const inorderCellCenters: number[] = [];
  for (let i = 0; i < count; i++) {
    const x = leftPadding + cellWidth * i + cellWidth / 2;
    preorderCellCenters.push(x);
    inorderCellCenters.push(x); // same for alignment
  }
  return { preorderCellCenters, inorderCellCenters, leftPadding, cellWidth };
}

/**
 * Build node layouts for nodes discovered in the trace.
 * We place nodes along a lower canvas area and distribute them horizontally according
 * to preorder/inorder cell centers when known. Y is set by tree depth.
 */
export function buildNodeLayouts(
  nodes: { id: string; value: number; preorderIndex?: number | null; inorderIndex?: number | null; depth?: number }[],
  bars: BarsLayout,
  baseY = 220,
  layerSpacing = 72
): NodeLayout[] {
  // If node has both indexes prefer average; else fallback to whichever exists.
  return nodes.map((n) => {
    const p = n.preorderIndex != null && n.preorderIndex >= 0 ? bars.preorderCellCenters[n.preorderIndex] : null;
    const q = n.inorderIndex != null && n.inorderIndex >= 0 ? bars.inorderCellCenters[n.inorderIndex] : null;
    const x = p != null && q != null ? (p + q) / 2 : p != null ? p : q != null ? q : bars.leftPadding + bars.cellWidth * 0.5;
    const y = baseY + (n.depth ?? 0) * layerSpacing;
    return { id: n.id, value: n.value, preorderIndex: n.preorderIndex ?? null, inorderIndex: n.inorderIndex ?? null, x, y };
  });
}
