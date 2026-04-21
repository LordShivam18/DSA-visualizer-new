import type { MinDiffTreeNode } from "./generateTrace";

type Accent = "cyan" | "amber" | "emerald" | "rose" | "violet";

type Props = {
  title: string;
  ids: string[];
  nodes: MinDiffTreeNode[];
  accent: Accent;
  emptyLabel: string;
  helperText?: string;
  highlightId?: string | null;
  reverse?: boolean;
};

const accentClasses: Record<Accent, string> = {
  cyan: "border-cyan-400/40 bg-cyan-500/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]",
  amber: "border-amber-400/40 bg-amber-500/10 text-amber-100 shadow-[0_0_18px_rgba(251,191,36,0.12)]",
  emerald:
    "border-emerald-400/40 bg-emerald-500/10 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]",
  rose: "border-rose-400/40 bg-rose-500/10 text-rose-100 shadow-[0_0_18px_rgba(251,113,133,0.12)]",
  violet:
    "border-violet-400/40 bg-violet-500/10 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]",
};

export default function StackStrip({
  title,
  ids,
  nodes,
  accent,
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
        <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-300">
          {ids.length} item{ids.length === 1 ? "" : "s"}
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
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {displayIds.map((id, index) => {
            const node = nodesById.get(id);
            const active = highlightId === id;

            return (
              <div
                key={`${title}-${id}-${index}`}
                className={[
                  "rounded-xl border px-3 py-2 font-mono text-sm transition-all duration-300",
                  active
                    ? accentClasses[accent]
                    : "border-slate-800/80 bg-slate-950/70 text-slate-200",
                ].join(" ")}
              >
                {reverse && index === 0 ? "top " : ""}
                {node?.value ?? "?"}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
