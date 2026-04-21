import type {
  MinimumGeneticMutationActionKind,
  MinimumGeneticMutationTraceStep,
} from "./generateTrace";

type Props = {
  step: MinimumGeneticMutationTraceStep;
  mode: "beginner" | "expert";
};

function beginnerFocus(kind: MinimumGeneticMutationActionKind) {
  switch (kind) {
    case "parsed":
      return "We are turning the gene bank into BFS states that can be reached with legal one-character mutations.";
    case "missing-target":
      return "The target gene is missing from the bank, so the journey is impossible before BFS even starts.";
    case "seed":
      return "BFS begins with the start gene at mutation count 0.";
    case "dequeue":
      return "This is the next gene to expand because it was reached using the fewest mutations so far.";
    case "inspect":
      return "We compare the current gene with one bank gene and count how many positions differ.";
    case "enqueue":
      return "A valid unseen one-step mutation joins the next BFS layer.";
    case "skip":
      return "We skip genes that are either illegal one-step mutations or already discovered.";
    default:
      return "The first time BFS reaches the target gene, its mutation count is guaranteed to be minimal.";
  }
}

function expertFocus(kind: MinimumGeneticMutationActionKind) {
  switch (kind) {
    case "parsed":
      return "The state graph is implicit: bank genes are vertices and Hamming-distance-1 comparisons determine edges.";
    case "missing-target":
      return "If endGene is absent from the valid-state set, the source-target query is disconnected by definition.";
    case "seed":
      return "The queue stores (gene, distance) pairs with the source initialized at depth 0.";
    case "dequeue":
      return "Dequeuing expands one state whose shortest-path distance is already fixed by BFS ordering.";
    case "inspect":
      return "Adjacency is computed on demand by comparing the current state against every valid bank state.";
    case "enqueue":
      return "The first discovery of a valid neighbor finalizes its shortest distance as currentDepth + 1.";
    case "skip":
      return "The seen-set and Hamming-distance test jointly prune non-neighbors and duplicate states.";
    default:
      return "BFS optimality on an unweighted graph guarantees the first dequeued target has minimal mutation distance.";
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
            Focus on the one-character neighbor rule that drives this BFS.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current
          </p>
          <p className="mt-2 font-mono text-lg font-semibold text-cyan-200">
            {step.pointers.currentGene ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Candidate
          </p>
          <p className="mt-2 font-mono text-lg font-semibold text-yellow-200">
            {step.pointers.candidateGene ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Queue Size
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.state.queue.length}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Target Depth
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.result ?? "--"}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-gradient-to-br from-slate-950/70 via-[#07111f] to-slate-950/65 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          {mode === "beginner" ? "What Is Happening" : "Algorithm Invariant"}
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-200">
          {mode === "beginner"
            ? beginnerFocus(step.actionKind)
            : expertFocus(step.actionKind)}
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Difference Snapshot
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {step.pointers.differenceInfo ? (
              <>
                Difference count:{" "}
                <span className="font-mono text-slate-100">
                  {step.pointers.differenceInfo.count === Number.MAX_SAFE_INTEGER
                    ? "length mismatch"
                    : step.pointers.differenceInfo.count}
                </span>
                {step.pointers.differenceInfo.count !== Number.MAX_SAFE_INTEGER &&
                step.pointers.differenceInfo.indices.length > 0 ? (
                  <>
                    {" "}
                    at indices{" "}
                    <span className="font-mono text-yellow-200">
                      {step.pointers.differenceInfo.indices.join(", ")}
                    </span>
                  </>
                ) : null}
                .
              </>
            ) : (
              "No candidate gene is being compared in this snapshot."
            )}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Queue Front
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {step.pointers.queueFront
              ? `Next gene waiting in line: ${step.pointers.queueFront}.`
              : "The BFS queue is empty right now."}
          </p>
        </div>
      </div>
    </div>
  );
}
