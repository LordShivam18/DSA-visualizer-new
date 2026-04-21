import type { LcaStackFrame, LcaTreeNode } from "./generateTrace";

type Props = {
  stack: LcaStackFrame[];
  nodes: LcaTreeNode[];
};

const statusTone: Record<LcaStackFrame["status"], string> = {
  active: "border-cyan-400/35 bg-cyan-500/10 text-cyan-100",
  "matched-p": "border-yellow-400/35 bg-yellow-500/10 text-yellow-100",
  "matched-q": "border-violet-400/35 bg-violet-500/10 text-violet-100",
  "split-lca": "border-emerald-400/35 bg-emerald-500/10 text-emerald-100",
  "bubble-left": "border-cyan-400/35 bg-cyan-500/10 text-cyan-100",
  "bubble-right": "border-cyan-400/35 bg-cyan-500/10 text-cyan-100",
  "no-hit": "border-slate-700/80 bg-slate-900/70 text-slate-300",
};

function labelOf(nodesById: Map<string, LcaTreeNode>, id: string | null) {
  if (!id) {
    return "null";
  }

  return String(nodesById.get(id)?.value ?? "?");
}

export default function RecursionStack({ stack, nodes }: Props) {
  const frames = [...stack].reverse();
  const nodesById = new Map(nodes.map((node) => [node.id, node]));

  return (
    <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Recursion Stack
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            These live frames show which subtree is active, what each child has
            returned, and what this frame will bubble upward.
          </p>
        </div>
        <span className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1 text-xs text-slate-300">
          Frames <span className="font-mono text-slate-100">{stack.length}</span>
        </span>
      </div>

      {frames.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-4 py-5 text-sm text-slate-500">
          No recursive frames are active right now.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {frames.map((frame) => (
            <div
              key={frame.id}
              className="rounded-[1rem] border border-slate-800/80 bg-[#07101d] p-4"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1 text-xs text-slate-300">
                  Node <span className="font-mono text-slate-100">{frame.value}</span>
                </span>
                <span className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1 text-xs text-slate-300">
                  Depth <span className="font-mono text-slate-100">{frame.depth}</span>
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs ${statusTone[frame.status]}`}
                >
                  {frame.status}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Match
                  </p>
                  <p className="mt-1 font-mono text-sm text-slate-100">
                    {frame.matchedTarget ?? "none"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Left
                  </p>
                  <p className="mt-1 font-mono text-sm text-slate-100">
                    {labelOf(nodesById, frame.leftReturnId)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Right
                  </p>
                  <p className="mt-1 font-mono text-sm text-slate-100">
                    {labelOf(nodesById, frame.rightReturnId)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                    Return
                  </p>
                  <p className="mt-1 font-mono text-sm text-emerald-200">
                    {labelOf(nodesById, frame.resultId)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
