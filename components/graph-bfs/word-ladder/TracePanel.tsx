import type {
  WordLadderActionKind,
  WordLadderTraceStep,
} from "./generateTrace";

type Props = {
  step: WordLadderTraceStep;
};

const actionTone: Record<WordLadderActionKind, string> = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  "missing-target": "border-rose-400/40 bg-rose-500/10 text-rose-200",
  seed: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  dequeue: "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  inspect: "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  enqueue: "border-violet-400/40 bg-violet-500/10 text-violet-200",
  skip: "border-slate-600 bg-slate-900/70 text-slate-300",
  done: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
};

export default function TracePanel({ step }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-amber-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Trace Panel</h2>
          <p className="text-sm text-slate-400">
            Each snapshot records how BFS grows the shortest transformation frontier.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
          Step <span className="font-mono text-slate-50">{step.step + 1}</span>
        </span>
        <span className={`rounded-full border px-3 py-1 ${actionTone[step.actionKind]}`}>
          {step.actionKind}
        </span>
        <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-violet-200">
          Queue {step.state.queue.length}
        </span>
        <span
          className={`rounded-full border px-3 py-1 ${
            step.done
              ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
              : "border-cyan-400/40 bg-cyan-500/10 text-cyan-200"
          }`}
        >
          {step.done ? "Complete" : "In Progress"}
        </span>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-[#061020] p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Current Action
        </p>
        <p className="mt-2 text-sm leading-7 text-slate-100">{step.action}</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Current Word
          </p>
          <p className="mt-2 font-mono text-lg font-semibold text-cyan-200">
            {step.pointers.currentWord ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Candidate
          </p>
          <p className="mt-2 font-mono text-lg font-semibold text-yellow-200">
            {step.pointers.candidateWord ?? "none"}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Difference Index
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.pointers.differenceIndex ?? "--"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Visited
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.visited.length}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Processed
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.state.processed.length}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Depth Snapshot
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {step.state.depths.map((entry) => (
            <div
              key={entry.word}
              className={`rounded-xl border px-3 py-2 ${
                step.pointers.currentWord === entry.word
                  ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100"
                  : step.pointers.candidateWord === entry.word
                  ? "border-yellow-400/45 bg-yellow-500/10 text-yellow-100"
                  : "border-slate-800/80 bg-slate-950/70 text-slate-300"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-sm">{entry.word}</span>
                <span className="font-mono text-sm">{entry.depth}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Invariant:</span>{" "}
        {step.explanationExpert}
      </div>
    </div>
  );
}
