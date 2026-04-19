import type { ConnectTreeNode } from "./generateTrace";

type Accent = "cyan" | "green" | "purple" | "yellow";

type Props = {
  title: string;
  ids: string[];
  nodes: ConnectTreeNode[];
  accent: Accent;
  emptyLabel: string;
};

const accentClasses: Record<Accent, string> = {
  cyan: "border-cyan-400/40 bg-cyan-500/10 text-cyan-100",
  green: "border-emerald-400/40 bg-emerald-500/10 text-emerald-100",
  purple: "border-violet-400/40 bg-violet-500/10 text-violet-100",
  yellow: "border-amber-400/40 bg-amber-500/10 text-amber-100",
};

export default function LevelChainStrip({
  title,
  ids,
  nodes,
  accent,
  emptyLabel,
}: Props) {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="mb-3 flex items-center gap-2">
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] ${accentClasses[accent]}`}
        >
          {title}
        </span>
      </div>

      {ids.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          {ids.map((id, index) => (
            <div key={id} className="flex items-center gap-2">
              <div
                className={`min-w-10 rounded-xl border px-3 py-2 text-center font-mono text-sm shadow-[0_0_18px_rgba(15,23,42,0.55)] ${accentClasses[accent]}`}
              >
                {nodeMap.get(id)?.value ?? "?"}
              </div>

              {index < ids.length - 1 ? (
                <span className="text-sm text-slate-500">-&gt;</span>
              ) : (
                <span className="text-xs font-mono text-slate-500">NULL</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
