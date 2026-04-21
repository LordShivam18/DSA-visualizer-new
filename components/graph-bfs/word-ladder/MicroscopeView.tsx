import type {
  WordLadderActionKind,
  WordLadderTraceStep,
} from "./generateTrace";

type Props = {
  step: WordLadderTraceStep;
  mode: "beginner" | "expert";
};

function beginnerFocus(kind: WordLadderActionKind) {
  switch (kind) {
    case "parsed":
      return "We are turning the dictionary into a graph where one-letter changes become edges.";
    case "missing-target":
      return "The end word is missing from the dictionary, so the ladder cannot exist.";
    case "seed":
      return "BFS starts with the begin word, which already counts as ladder length 1.";
    case "dequeue":
      return "This is the next word BFS should expand because it belongs to the shortest unfinished ladder layer.";
    case "inspect":
      return "We compare one dictionary word against the current word to see whether they differ by exactly one letter.";
    case "enqueue":
      return "A valid unseen one-letter neighbor joins the next BFS layer.";
    case "skip":
      return "We skip words that are already known or break the one-letter rule.";
    default:
      return "The first time BFS reaches the end word, that ladder length is the shortest possible answer.";
  }
}

function expertFocus(kind: WordLadderActionKind) {
  switch (kind) {
    case "parsed":
      return "The dictionary induces an implicit unweighted graph whose edges connect Hamming-distance-1 words.";
    case "missing-target":
      return "If endWord is absent from the valid vertex set, the source-target query fails immediately.";
    case "seed":
      return "Depth starts at 1 because the problem measures path length in words, not edges.";
    case "dequeue":
      return "Dequeuing expands one BFS state whose shortest transformation length is already fixed.";
    case "inspect":
      return "Adjacency is computed on demand by a Hamming-distance-1 predicate over dictionary words.";
    case "enqueue":
      return "The first discovery of a neighbor fixes its shortest ladder length as currentDepth + 1.";
    case "skip":
      return "The seen set and neighbor predicate prune duplicate states and non-edges.";
    default:
      return "BFS optimality guarantees the first dequeued target has minimal transformation length.";
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
            Focus on the one-letter neighbor invariant that powers the ladder graph.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current
          </p>
          <p className="mt-2 font-mono text-lg font-semibold text-cyan-200">
            {step.pointers.currentWord ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Candidate
          </p>
          <p className="mt-2 font-mono text-lg font-semibold text-yellow-200">
            {step.pointers.candidateWord ?? "none"}
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
            Ladder Length
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
              "No candidate word is active in this snapshot."
            )}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Queue Front
          </p>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {step.pointers.queueFront
              ? `Next word waiting in line: ${step.pointers.queueFront}.`
              : "The BFS queue is empty right now."}
          </p>
        </div>
      </div>
    </div>
  );
}
