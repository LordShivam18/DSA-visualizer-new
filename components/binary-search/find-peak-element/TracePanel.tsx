import { type PeakSearchTraceStep } from "./generateTrace";

type Props = {
  step: PeakSearchTraceStep;
};

const toneByAction = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  invalid: "border-rose-400/40 bg-rose-500/10 text-rose-200",
  "choose-mid": "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  "move-left": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "move-right": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  done: "border-emerald-400/45 bg-emerald-500/10 text-emerald-200",
} as const;

export default function TracePanel({ step }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-violet-400 shadow-[0_0_18px_rgba(167,139,250,0.55)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Trace Panel</h2>
          <p className="text-sm text-slate-400">
            Track the local slope comparison that cuts the search window in
            half.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
          Step <span className="font-mono text-slate-50">{step.step + 1}</span>
        </span>
        <span
          className={`rounded-full border px-3 py-1 ${toneByAction[step.actionKind]}`}
        >
          {step.actionKind}
        </span>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-200">
          Peak {step.state.resultIndex ?? "pending"}
        </span>
        <span
          className={`rounded-full border px-3 py-1 ${
            step.done
              ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
              : "border-slate-700/80 bg-slate-950/70 text-slate-300"
          }`}
        >
          {step.done ? "Resolved" : "Searching"}
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
            Mid
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.state.mid ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Next
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.state.nextIndex ?? "none"}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Left Value
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.state.left <= step.state.right
              ? step.state.nums[step.state.left]
              : "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Mid Value
          </p>
          <p className="mt-2 text-2xl font-semibold text-yellow-200">
            {step.state.midValue ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Next Value
          </p>
          <p className="mt-2 text-2xl font-semibold text-violet-200">
            {step.state.nextValue ?? "none"}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Expert lens:</span>{" "}
        {step.explanationExpert}
      </div>
    </div>
  );
}
