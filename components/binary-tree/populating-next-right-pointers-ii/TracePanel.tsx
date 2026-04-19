import LevelChainStrip from "./LevelChainStrip";
import type { ConnectTraceStep } from "./generateTrace";

type Props = {
  step: ConnectTraceStep;
};

const actionTone: Record<string, string> = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  empty: "border-rose-400/40 bg-rose-500/10 text-rose-200",
  init: "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "start-level": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  visit: "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "skip-left": "border-slate-600 bg-slate-900/70 text-slate-300",
  "skip-right": "border-slate-600 bg-slate-900/70 text-slate-300",
  "attach-left": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  "attach-right": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  "connect-left": "border-rose-400/40 bg-rose-500/10 text-rose-200",
  "connect-right": "border-rose-400/40 bg-rose-500/10 text-rose-200",
  "move-tail": "border-amber-400/40 bg-amber-500/10 text-amber-200",
  "advance-current": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "end-level": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "move-level-start": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  done: "border-emerald-400/50 bg-emerald-500/12 text-emerald-100",
};

export default function TracePanel({ step }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-violet-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Trace Panel</h2>
          <p className="text-sm text-slate-400">
            Each step is a frozen snapshot of the algorithm&apos;s internal state.
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
          Step <span className="font-mono text-slate-50">{step.step + 1}</span>
        </span>
        <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
          Level{" "}
          <span className="font-mono text-slate-50">{step.pointers.level + 1}</span>
        </span>
        <span
          className={`rounded-full border px-3 py-1 ${actionTone[step.actionKind]}`}
        >
          {step.actionKind}
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

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Input
          </p>
          <p className="mt-2 break-words font-mono text-sm text-cyan-200">
            {step.state.input.trim() || "[]"}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Tokens
          </p>
          <p className="mt-2 font-mono text-sm text-slate-100">
            {step.state.tokens.length === 0
              ? "[]"
              : `[${step.state.tokens
                  .map((token) => (token === null ? "null" : String(token)))
                  .join(", ")}]`}
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Connected Output
          </p>
          <p className="mt-2 font-mono text-sm text-rose-200">
            {step.state.serializedOutput.length === 0
              ? "[]"
              : `[${step.state.serializedOutput.join(",")}]`}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <LevelChainStrip
          title="Current Level"
          ids={step.state.currentLevelIds}
          nodes={step.state.nodes}
          accent="purple"
          emptyLabel="No active level remains."
        />
        <LevelChainStrip
          title="Remaining Scan"
          ids={step.state.remainingCurrentIds}
          nodes={step.state.nodes}
          accent="cyan"
          emptyLabel="The current level scan is finished."
        />
      </div>
    </div>
  );
}
