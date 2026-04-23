import PanelShell from "../shared/PanelShell";
import StatCard from "../shared/StatCard";
import type {
  GenerateParenthesesActionKind,
  GenerateParenthesesTraceStep,
} from "./generateTrace";

type Props = {
  step: GenerateParenthesesTraceStep;
};

const actionTone: Record<GenerateParenthesesActionKind, string> = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  invalid: "border-rose-400/40 bg-rose-500/10 text-rose-200",
  "enter-depth": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "add-open": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "add-close": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  complete: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  backtrack: "border-yellow-400/40 bg-yellow-500/10 text-yellow-200",
  done: "border-emerald-400/50 bg-emerald-500/12 text-emerald-100",
};

export default function TracePanel({ step }: Props) {
  return (
    <PanelShell
      title="Trace Panel"
      subtitle="Each snapshot records one bracket decision or one undo."
      accent="amber"
    >
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
          Step <span className="font-mono text-slate-50">{step.step + 1}</span>
        </span>
        <span className={`rounded-full border px-3 py-1 ${actionTone[step.actionKind]}`}>
          {step.actionKind}
        </span>
        <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-cyan-100">
          &quot;{step.state.current}&quot;
        </span>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-[#061020] p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Current Action
        </p>
        <p className="mt-2 text-sm leading-7 text-slate-100">{step.action}</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <StatCard label="Length" value={step.state.current.length} tone="cyan" />
        <StatCard label="Balance" value={step.state.balance} tone="amber" />
        <StatCard label="Opens" value={step.state.openUsed} tone="violet" />
        <StatCard
          label="Results"
          value={step.state.results.length}
          tone="emerald"
        />
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm text-slate-300">
        <span className="font-semibold text-slate-100">Invariant:</span>{" "}
        {step.explanationExpert}
      </div>
    </PanelShell>
  );
}
