import type { LevelOrderTreeNode } from "./generateTrace";

type Accent = "cyan" | "violet" | "yellow" | "green" | "rose";

type Props = {
  title: string;
  ids: string[];
  nodes: LevelOrderTreeNode[];
  accent: Accent;
  emptyLabel: string;
  helperText?: string;
  frontId?: string | null;
  highlightId?: string | null;
};

const accentClasses: Record<
  Accent,
  {
    pill: string;
    item: string;
    glow: string;
    chip: string;
  }
> = {
  cyan: {
    pill: "border-cyan-400/30 bg-cyan-500/10 text-cyan-100",
    item: "border-cyan-400/40 bg-cyan-500/10 text-cyan-50",
    glow: "shadow-[0_0_22px_rgba(34,211,238,0.18)]",
    chip: "border-cyan-400/50 bg-cyan-500/14 text-cyan-100",
  },
  violet: {
    pill: "border-violet-400/30 bg-violet-500/10 text-violet-100",
    item: "border-violet-400/40 bg-violet-500/10 text-violet-50",
    glow: "shadow-[0_0_22px_rgba(167,139,250,0.18)]",
    chip: "border-violet-400/50 bg-violet-500/14 text-violet-100",
  },
  yellow: {
    pill: "border-yellow-400/30 bg-yellow-500/10 text-yellow-100",
    item: "border-yellow-400/40 bg-yellow-500/10 text-yellow-50",
    glow: "shadow-[0_0_22px_rgba(250,204,21,0.18)]",
    chip: "border-yellow-400/50 bg-yellow-500/14 text-yellow-100",
  },
  green: {
    pill: "border-emerald-400/30 bg-emerald-500/10 text-emerald-100",
    item: "border-emerald-400/40 bg-emerald-500/10 text-emerald-50",
    glow: "shadow-[0_0_22px_rgba(52,211,153,0.18)]",
    chip: "border-emerald-400/50 bg-emerald-500/14 text-emerald-100",
  },
  rose: {
    pill: "border-rose-400/30 bg-rose-500/10 text-rose-100",
    item: "border-rose-400/40 bg-rose-500/10 text-rose-50",
    glow: "shadow-[0_0_22px_rgba(251,113,133,0.18)]",
    chip: "border-rose-400/50 bg-rose-500/14 text-rose-100",
  },
};

export default function QueueStrip({
  title,
  ids,
  nodes,
  accent,
  emptyLabel,
  helperText,
  frontId = null,
  highlightId = null,
}: Props) {
  const styles = accentClasses[accent];
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] ${styles.pill}`}
        >
          {ids.length} item{ids.length === 1 ? "" : "s"}
        </span>
      </div>

      {helperText ? (
        <p className="mt-2 text-xs leading-6 text-slate-400">{helperText}</p>
      ) : null}

      {ids.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {ids.map((id, index) => {
            const node = nodesById.get(id);
            const isFront = frontId === id;
            const isHighlight = highlightId === id;

            return (
              <div
                key={`${title}-${id}`}
                className={[
                  "rounded-xl border px-3 py-2 transition-all duration-300",
                  isFront || isHighlight
                    ? `${styles.item} ${styles.glow}`
                    : "border-slate-800/80 bg-slate-950/70 text-slate-200",
                ].join(" ")}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    {index}
                  </span>
                  <span className="font-mono text-sm">{node?.value ?? "?"}</span>
                  {isFront ? (
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] ${styles.chip}`}
                    >
                      front
                    </span>
                  ) : null}
                  {!isFront && isHighlight ? (
                    <span
                      className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] ${styles.chip}`}
                    >
                      focus
                    </span>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
