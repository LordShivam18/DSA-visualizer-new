import type { CompleteTreeNode } from "./generateTrace";

type Accent = "yellow" | "violet" | "emerald" | "cyan";

type Props = {
  title: string;
  ids: string[];
  nodes: CompleteTreeNode[];
  accent: Accent;
  heightLabel: string;
  emptyLabel: string;
  helperText: string;
};

const accentMap: Record<
  Accent,
  {
    badge: string;
    node: string;
    arrow: string;
  }
> = {
  yellow: {
    badge: "border-yellow-400/35 bg-yellow-500/10 text-yellow-100",
    node: "border-yellow-400/45 bg-yellow-500/10 text-yellow-50",
    arrow: "text-yellow-300",
  },
  violet: {
    badge: "border-violet-400/35 bg-violet-500/10 text-violet-100",
    node: "border-violet-400/45 bg-violet-500/10 text-violet-50",
    arrow: "text-violet-300",
  },
  emerald: {
    badge: "border-emerald-400/35 bg-emerald-500/10 text-emerald-100",
    node: "border-emerald-400/45 bg-emerald-500/10 text-emerald-50",
    arrow: "text-emerald-300",
  },
  cyan: {
    badge: "border-cyan-400/35 bg-cyan-500/10 text-cyan-100",
    node: "border-cyan-400/45 bg-cyan-500/10 text-cyan-50",
    arrow: "text-cyan-300",
  },
};

export default function BoundaryStrip({
  title,
  ids,
  nodes,
  accent,
  heightLabel,
  emptyLabel,
  helperText,
}: Props) {
  const tones = accentMap[accent];
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            {title}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-400">{helperText}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs ${tones.badge}`}>
          {heightLabel}
        </span>
      </div>

      {ids.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-4 py-5 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {ids.map((id, index) => (
            <div key={id} className="flex items-center gap-2">
              <div
                className={`rounded-xl border px-3 py-2 text-sm font-semibold shadow-[0_0_18px_rgba(15,23,42,0.2)] ${tones.node}`}
              >
                {nodesById.get(id)?.value ?? "?"}
              </div>
              {index < ids.length - 1 ? (
                <span className={`text-sm ${tones.arrow}`}>&rarr;</span>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
