import type { KthTreeNode } from "./generateTrace";

type Props = {
  title: string;
  ids: string[];
  nodes: KthTreeNode[];
  emptyLabel: string;
  helperText?: string;
  highlightId?: string | null;
  reverse?: boolean;
};

export default function StackStrip({
  title,
  ids,
  nodes,
  emptyLabel,
  helperText,
  highlightId = null,
  reverse = false,
}: Props) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const displayIds = reverse ? [...ids].reverse() : ids;

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-amber-100">
          {ids.length} saved
        </span>
      </div>
      {helperText ? (
        <p className="mt-2 text-xs leading-6 text-slate-400">{helperText}</p>
      ) : null}
      {displayIds.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {displayIds.map((id, index) => {
            const active = id === highlightId;
            return (
              <span
                key={`${title}-${id}-${index}`}
                className={[
                  "rounded-xl border px-3 py-2 font-mono text-sm transition-all duration-300",
                  active
                    ? "border-amber-400/50 bg-amber-500/10 text-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.16)]"
                    : "border-slate-800/80 bg-slate-950/70 text-slate-200",
                ].join(" ")}
              >
                {reverse && index === 0 ? "top " : ""}
                {nodesById.get(id)?.value ?? "?"}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
