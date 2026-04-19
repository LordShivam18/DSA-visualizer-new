import type { MaxPathTreeNode, NodeGainRecord } from "./generateTrace";

type Props = {
  title: string;
  values: NodeGainRecord[];
  nodes: MaxPathTreeNode[];
  highlightNodeId?: string | null;
  emptyLabel: string;
  helperText?: string;
};

function labelOf(nodesById: Map<string, MaxPathTreeNode>, id: string) {
  return String(nodesById.get(id)?.value ?? "?");
}

export default function ReturnGainTable({
  title,
  values,
  nodes,
  highlightNodeId,
  emptyLabel,
  helperText,
}: Props) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <span className="inline-flex rounded-full border border-violet-400/40 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-100">
            {title}
          </span>
          {helperText ? (
            <p className="max-w-xl text-xs leading-6 text-slate-400">
              {helperText}
            </p>
          ) : null}
        </div>

        <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-2.5 py-1 text-[11px] font-mono text-slate-300">
          {values.length}
        </span>
      </div>

      {values.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="space-y-2">
          {values.map((entry) => {
            const highlighted = highlightNodeId === entry.nodeId;

            return (
              <div
                key={entry.nodeId}
                className={`grid gap-3 rounded-[1rem] border px-3 py-3 text-sm transition-all duration-300 md:grid-cols-[minmax(0,1fr)_100px] ${
                  highlighted
                    ? "border-cyan-400/40 bg-cyan-500/10 shadow-[0_0_18px_rgba(34,211,238,0.14)]"
                    : "border-slate-800/80 bg-slate-950/70"
                }`}
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Node
                  </p>
                  <p className="mt-1 font-mono text-slate-100">
                    {labelOf(nodesById, entry.nodeId)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    Return Gain
                  </p>
                  <p
                    className={`mt-1 font-mono ${
                      entry.gain >= 0 ? "text-emerald-200" : "text-rose-200"
                    }`}
                  >
                    {entry.gain}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
