import type { KthTreeNode } from "./generateTrace";

type Props = {
  ids: string[];
  nodes: KthTreeNode[];
  k: number;
  foundId?: string | null;
};

export default function RankStrip({ ids, nodes, k, foundId = null }: Props) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-sm font-semibold text-slate-100">
          Sorted Rank Counter
        </h3>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-cyan-100">
          target k = {k}
        </span>
      </div>

      <p className="mt-2 text-xs leading-6 text-slate-400">
        Each inorder visit receives the next sorted rank.
      </p>

      {ids.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          No value has been counted yet.
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {ids.map((id, index) => {
            const rank = index + 1;
            const isFound = id === foundId;

            return (
              <div
                key={`${id}-${rank}`}
                className={[
                  "rounded-xl border px-3 py-2 transition-all duration-300",
                  isFound
                    ? "border-emerald-400/50 bg-emerald-500/12 text-emerald-100 shadow-[0_0_20px_rgba(52,211,153,0.18)]"
                    : rank === k
                    ? "border-yellow-400/45 bg-yellow-500/10 text-yellow-100"
                    : "border-cyan-400/35 bg-cyan-500/10 text-cyan-100",
                ].join(" ")}
              >
                <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                  rank {rank}
                </div>
                <div className="font-mono text-sm">
                  {nodesById.get(id)?.value ?? "?"}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
