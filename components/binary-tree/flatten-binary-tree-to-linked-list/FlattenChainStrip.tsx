import type { FlattenTreeNode } from "./generateTrace";

type Accent = "amber" | "cyan" | "emerald" | "violet" | "yellow";

type Props = {
  title: string;
  ids: string[];
  nodes: FlattenTreeNode[];
  accent: Accent;
  emptyLabel: string;
  helperText?: string;
};

const accentClasses: Record<
  Accent,
  {
    chip: string;
    box: string;
    arrow: string;
    end: string;
  }
> = {
  amber: {
    chip: "border-amber-400/40 bg-amber-500/10 text-amber-100",
    box: "border-amber-400/40 bg-amber-500/10 text-amber-50 shadow-[0_0_18px_rgba(251,191,36,0.18)]",
    arrow: "text-amber-300/80",
    end: "text-amber-200/70",
  },
  cyan: {
    chip: "border-cyan-400/40 bg-cyan-500/10 text-cyan-100",
    box: "border-cyan-400/40 bg-cyan-500/10 text-cyan-50 shadow-[0_0_18px_rgba(34,211,238,0.18)]",
    arrow: "text-cyan-300/80",
    end: "text-cyan-200/70",
  },
  emerald: {
    chip: "border-emerald-400/40 bg-emerald-500/10 text-emerald-100",
    box: "border-emerald-400/40 bg-emerald-500/10 text-emerald-50 shadow-[0_0_18px_rgba(52,211,153,0.18)]",
    arrow: "text-emerald-300/80",
    end: "text-emerald-200/70",
  },
  violet: {
    chip: "border-violet-400/40 bg-violet-500/10 text-violet-100",
    box: "border-violet-400/40 bg-violet-500/10 text-violet-50 shadow-[0_0_18px_rgba(167,139,250,0.18)]",
    arrow: "text-violet-300/80",
    end: "text-violet-200/70",
  },
  yellow: {
    chip: "border-yellow-400/40 bg-yellow-500/10 text-yellow-100",
    box: "border-yellow-400/40 bg-yellow-500/10 text-yellow-50 shadow-[0_0_18px_rgba(250,204,21,0.18)]",
    arrow: "text-yellow-300/80",
    end: "text-yellow-200/70",
  },
};

export default function FlattenChainStrip({
  title,
  ids,
  nodes,
  accent,
  emptyLabel,
  helperText,
}: Props) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const palette = accentClasses[accent];

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <span
            className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] ${palette.chip}`}
          >
            {title}
          </span>
          {helperText ? (
            <p className="max-w-xl text-xs leading-6 text-slate-400">
              {helperText}
            </p>
          ) : null}
        </div>

        <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-2.5 py-1 text-[11px] font-mono text-slate-300">
          {ids.length}
        </span>
      </div>

      {ids.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {ids.map((id, index) => (
            <div key={`${title}-${id}`} className="flex items-center gap-2">
              <div
                className={`min-w-10 rounded-xl border px-3 py-2 text-center font-mono text-sm transition-all duration-300 ${palette.box}`}
              >
                {nodesById.get(id)?.value ?? "?"}
              </div>

              {index < ids.length - 1 ? (
                <span className={`text-sm ${palette.arrow}`}>-&gt;</span>
              ) : (
                <span className={`text-[11px] font-mono uppercase ${palette.end}`}>
                  End
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
