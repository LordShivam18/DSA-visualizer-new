import CloneQueue from "./CloneQueue";
import type { CloneGraphTraceStep } from "./generateTrace";

type Props = {
  step: CloneGraphTraceStep;
  mode: "beginner" | "expert";
};

function buildBeginnerFocus(step: CloneGraphTraceStep) {
  switch (step.actionKind) {
    case "seed":
      return "The first clone node is created before BFS starts so the copy process has a safe place to begin.";
    case "dequeue":
      return "BFS is now processing one original node and copying all of its neighbor links.";
    case "inspect-neighbor":
      return "For each original neighbor, the algorithm checks whether a clone node already exists for it.";
    case "create-clone":
      return "This original node is being copied for the first time, so a brand-new clone node is allocated.";
    case "enqueue-neighbor":
      return "The original neighbor still needs its own neighbor list processed later, so it joins the queue.";
    case "skip-neighbor":
      return "This original node was already discovered earlier, so BFS avoids adding it to the queue again.";
    case "link-edge":
      return "The clone of the current node now points to the clone of the neighbor, matching the original graph's structure.";
    default:
      return "Once every reachable node is processed, the cloned graph matches the original graph's shape but uses brand-new nodes.";
  }
}

function buildExpertFocus(step: CloneGraphTraceStep) {
  switch (step.actionKind) {
    case "seed":
      return "Seeding the map with the start node establishes the identity-preserving lookup that all later edge copies rely on.";
    case "dequeue":
      return "Each dequeue expands one original vertex while the clone map preserves node uniqueness across cycles.";
    case "inspect-neighbor":
      return "The traversal mirrors every adjacency entry, so each original edge endpoint must be resolved through the copy map.";
    case "create-clone":
      return "Lazy allocation ensures O(V) clone creation: each original vertex is allocated once, on first discovery.";
    case "enqueue-neighbor":
      return "Queueing occurs exactly once per discovered original vertex, which is what keeps the traversal linear.";
    case "skip-neighbor":
      return "The visited/discovered guard prevents infinite work on cyclic graphs and duplicated queue entries.";
    case "link-edge":
      return "The structural invariant is `copies[cur]->neighbors.push_back(copies[neighbor])`, which recreates topology without aliasing original nodes.";
    default:
      return "The algorithm runs in O(V + E) time with O(V) auxiliary space for the queue and original-to-clone hash map.";
  }
}

export default function MicroscopeView({ step, mode }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">
            Focus on how the map, queue, and cloned edges cooperate to avoid duplicate nodes.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Original
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.currentOriginal ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Clone
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.currentClone !== null
              ? `${step.pointers.currentClone}'`
              : "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Neighbor
          </p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {step.pointers.neighborOriginal ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Latest Clone
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.pointers.latestCloned !== null
              ? `${step.pointers.latestCloned}'`
              : "none"}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-gradient-to-br from-slate-950/70 via-[#07111f] to-slate-950/65 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {mode === "beginner" ? "What Is Happening" : "Algorithm Invariant"}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          {mode === "beginner"
            ? buildBeginnerFocus(step)
            : buildExpertFocus(step)}
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Clone Progress
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Cloned
              </p>
              <p className="mt-1 font-mono text-sm text-emerald-200">
                {step.state.clonedCount}/{step.state.originalNodes.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Queue
              </p>
              <p className="mt-1 font-mono text-sm text-violet-200">
                {step.state.queue.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Processed
              </p>
              <p className="mt-1 font-mono text-sm text-cyan-200">
                {step.state.processedOriginalIds.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Key Idea
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            The clone map answers the hardest question instantly:
            <span className="text-cyan-200">
              {" "}
              &quot;If I see this original node again inside a cycle, which
              clone should I reuse?&quot;
            </span>
            Without that map, the algorithm would duplicate nodes or lose graph structure.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <CloneQueue
          title="Live BFS Queue"
          queue={step.state.queue}
          active={step.pointers.currentOriginal}
          emptyLabel="No original nodes are waiting in the queue."
        />

        <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Original -&gt; Clone Map
          </p>
          {step.state.mapping.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
              No clone entries exist yet.
            </div>
          ) : (
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {step.state.mapping.map((entry) => (
                <div
                  key={entry.original}
                  className={`rounded-xl border px-3 py-2 ${
                    entry.original === step.pointers.currentOriginal
                      ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100"
                      : entry.clone === step.pointers.latestCloned
                      ? "border-emerald-400/45 bg-emerald-500/10 text-emerald-100"
                      : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-sm">{entry.original}</span>
                    <span className="text-slate-500">-&gt;</span>
                    <span className="font-mono text-sm">
                      {entry.clone}
                      {"'"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
