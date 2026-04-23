import type {
  KSmallestPairsActionKind,
  KSmallestPairsTraceStep,
} from "./generateTrace";

type Props = {
  step: KSmallestPairsTraceStep;
};

const actionTone: Record<KSmallestPairsActionKind, string> = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  seed: "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "bubble-up": "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  pop: "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  append: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  "push-next": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "bubble-down": "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  done: "border-emerald-400/50 bg-emerald-500/12 text-emerald-100",
};

export default function TracePanel({ step }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-amber-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Trace Panel</h2>
          <p className="text-sm text-slate-400">
            Each snapshot shows the frontier minimum or the next row expansion.
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
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-200">
          output {step.state.resultPairs.length}
        </span>
        <span
          className={`rounded-full border px-3 py-1 ${
            step.done
              ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
              : "border-violet-400/40 bg-violet-500/10 text-violet-200"
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
            Current Pair
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.state.currentPair
              ? `[${step.state.currentPair.leftValue}, ${step.state.currentPair.rightValue}]`
              : "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Heap Root
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.state.heap[0]
              ? `[${step.state.heap[0].leftValue}, ${step.state.heap[0].rightValue}]`
              : "none"}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Last Popped
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.state.lastPopped
              ? `[${step.state.lastPopped.leftValue}, ${step.state.lastPopped.rightValue}]`
              : "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Last Pushed
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.state.lastPushed
              ? `[${step.state.lastPushed.leftValue}, ${step.state.lastPushed.rightValue}]`
              : "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Heap Size
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.state.heap.length}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Output Order
        </p>
        {step.state.resultPairs.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
            No answer pairs have been produced yet.
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {step.state.resultPairs.map((candidate, index) => (
              <div
                key={`${candidate.id}-${index}`}
                className="rounded-xl border border-emerald-400/45 bg-emerald-500/10 px-3 py-2 text-emerald-100"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">#{index + 1}</span>
                  <span className="font-mono text-sm">
                    [{candidate.leftValue}, {candidate.rightValue}] = {candidate.sum}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Invariant:</span>{" "}
        {step.explanationExpert}
      </div>
    </div>
  );
}
