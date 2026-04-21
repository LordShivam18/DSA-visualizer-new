import type { MinDiffTreeNode } from "./generateTrace";

type Props = {
  ids: string[];
  nodes: MinDiffTreeNode[];
  prevId?: string | null;
  focusId?: string | null;
};

export default function InorderStrip({
  ids,
  nodes,
  prevId = null,
  focusId = null,
}: Props) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-sm font-semibold text-slate-100">
          Inorder Values
        </h3>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-emerald-100">
          sorted prefix
        </span>
      </div>

      <p className="mt-2 text-xs leading-6 text-slate-400">
        In a BST, inorder traversal emits values in sorted order.
      </p>

      {ids.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          No value has been visited yet.
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {ids.map((id, index) => {
            const node = nodesById.get(id);
            const isPrev = prevId === id;
            const isFocus = focusId === id;

            return (
              <div
                key={`${id}-${index}`}
                className={[
                  "rounded-xl border px-3 py-2 font-mono text-sm transition-all duration-300",
                  isFocus
                    ? "border-cyan-400/50 bg-cyan-500/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.14)]"
                    : isPrev
                    ? "border-yellow-400/50 bg-yellow-500/10 text-yellow-100"
                    : "border-emerald-400/35 bg-emerald-500/10 text-emerald-100",
                ].join(" ")}
              >
                <span className="mr-2 text-[10px] text-slate-500">{index}</span>
                {node?.value ?? "?"}
                {isPrev ? <span className="ml-2 text-[10px]">prev</span> : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
