import type { EvaluateDivisionTraceStep } from "./generateTrace";

type Props = {
  step: EvaluateDivisionTraceStep;
  mode: "beginner" | "expert";
};

function buildBeginnerFocus(step: EvaluateDivisionTraceStep) {
  switch (step.actionKind) {
    case "add-equation":
      return "The graph is learning one relationship between two variables, and it stores both the forward and backward version.";
    case "start-query":
      return "A new question starts now, so the search clears old visited nodes and begins fresh.";
    case "missing-variable":
      return "One of the variables never appeared before, so the graph has no information to answer this query.";
    case "answer-self":
      return "A known variable divided by itself is always 1, so no search is needed.";
    case "seed-search":
      return "The search starts at the numerator with a ratio of 1 because we have not crossed any edges yet.";
    case "pop-node":
      return "DFS is taking one variable off the stack and asking, 'Can the target be reached from here?'";
    case "inspect-neighbor":
      return "The algorithm is checking one possible next step out of the current variable.";
    case "push-neighbor":
      return "This neighbor becomes a new search state, and the ratio grows by multiplying the edge weight.";
    case "skip-neighbor":
      return "The search already saw this variable, so it skips it to avoid getting trapped in cycles.";
    case "found-answer":
      return "The target variable was reached, so the running product is now the answer.";
    case "query-failed":
      return "The search ran out of paths before finding the target, so the answer is -1.";
    default:
      return "Once every query finishes, the answer list is complete.";
  }
}

function buildExpertFocus(step: EvaluateDivisionTraceStep) {
  switch (step.actionKind) {
    case "add-equation":
      return "Every equation contributes reciprocal directed edges, converting division relationships into multiplicative path constraints.";
    case "start-query":
      return "Each query is an independent graph reachability problem over a static weighted adjacency map.";
    case "missing-variable":
      return "Undefined endpoints are absent from the graph, so the solver returns the sentinel value without traversal.";
    case "answer-self":
      return "For a known variable, the identity ratio x / x = 1 short-circuits the search.";
    case "seed-search":
      return "DFS seeds the stack with (src, 1.0), establishing the invariant that product = src / current along the stored path.";
    case "pop-node":
      return "A popped frame restores one candidate path prefix and its accumulated ratio.";
    case "inspect-neighbor":
      return "Exploring an outgoing edge extends the invariant by multiplying with its weight.";
    case "push-neighbor":
      return "The new stack frame stores the exact ratio from source to that neighbor via the chosen path.";
    case "skip-neighbor":
      return "The seen set prevents duplicate expansions and bounds each query to O(V + E).";
    case "found-answer":
      return "When current == destination, the accumulated product is the desired quotient.";
    case "query-failed":
      return "Failure means the destination lies outside the source's reachable component.";
    default:
      return "Overall cost is O(E) to build the graph plus O(Q * (V + E)) in the worst case to answer all queries.";
  }
}

export default function MicroscopeView({ step, mode }: Props) {
  const activePath = step.state.activePath?.join(" -> ") ?? "none";
  const successfulPath = step.state.successfulPath?.join(" -> ") ?? "none";

  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">
            Focus on the ratio invariant carried through the graph while DFS explores.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Query Cursor
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.state.currentQueryIndex === null
              ? "done"
              : step.state.currentQueryIndex + 1}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Current Variable
          </p>
          <p className="mt-2 font-mono text-xl font-semibold text-cyan-200">
            {step.pointers.currentVariable ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Neighbor
          </p>
          <p className="mt-2 font-mono text-xl font-semibold text-yellow-200">
            {step.pointers.neighborVariable ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Running Ratio
          </p>
          <p className="mt-2 font-mono text-xl font-semibold text-emerald-200">
            {step.pointers.currentProduct === null
              ? "none"
              : step.pointers.currentProduct.toFixed(5)}
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
            Path Snapshot
          </p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Active Path
              </p>
              <p className="mt-2 font-mono text-sm text-violet-100">{activePath}</p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-3">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Successful Path
              </p>
              <p className="mt-2 font-mono text-sm text-emerald-100">
                {successfulPath}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            Search Snapshot
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Stack
              </p>
              <p className="mt-1 font-mono text-sm text-violet-200">
                {step.state.searchStack.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Visited
              </p>
              <p className="mt-1 font-mono text-sm text-cyan-200">
                {step.state.visited.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/70 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                Answers Ready
              </p>
              <p className="mt-1 font-mono text-sm text-emerald-200">
                {step.state.answers.filter((value) => value !== null).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
