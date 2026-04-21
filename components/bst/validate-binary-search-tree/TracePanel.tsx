import FrameStack from "./FrameStack";
import ValidationLedger from "./ValidationLedger";
import {
  formatRange,
  formatResult,
  type ValidateActionKind,
  type ValidateTraceStep,
} from "./generateTrace";

type Props = {
  step: ValidateTraceStep;
};

const actionTone: Record<ValidateActionKind, string> = {
  parsed: "border-slate-600 bg-slate-900/70 text-slate-300",
  empty: "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  init: "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "pop-frame": "border-cyan-400/40 bg-cyan-500/10 text-cyan-200",
  "check-valid": "border-emerald-400/40 bg-emerald-500/10 text-emerald-200",
  "check-invalid": "border-rose-400/40 bg-rose-500/10 text-rose-200",
  "schedule-right": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "skip-right": "border-slate-600 bg-slate-900/70 text-slate-300",
  "schedule-left": "border-violet-400/40 bg-violet-500/10 text-violet-200",
  "skip-left": "border-slate-600 bg-slate-900/70 text-slate-300",
  done: "border-emerald-400/50 bg-emerald-500/12 text-emerald-100",
};

function labelOf(step: ValidateTraceStep, id: string | null) {
  if (!id) {
    return "none";
  }

  return String(step.state.nodes.find((node) => node.id === id)?.value ?? "none");
}

export default function TracePanel({ step }: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-amber-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Trace Panel</h2>
          <p className="text-sm text-slate-400">
            Follow each node range, scheduled subtree frame, and validation result.
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
        <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
          Frames{" "}
          <span className="font-mono text-violet-200">
            {step.state.frames.length}
          </span>
        </span>
        <span
          className={`rounded-full border px-3 py-1 ${
            step.state.result === false
              ? "border-rose-400/40 bg-rose-500/10 text-rose-200"
              : step.state.result === true
              ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200"
              : "border-cyan-400/40 bg-cyan-500/10 text-cyan-200"
          }`}
        >
          {formatResult(step.state.result)}
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
            Input
          </p>
          <p className="mt-2 break-words font-mono text-sm text-cyan-200">
            {step.state.input.trim() || "[]"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Active Node and Range
          </p>
          <p className="mt-2 break-words font-mono text-sm text-emerald-200">
            {labelOf(step, step.pointers.focusId)} in{" "}
            {formatRange(step.pointers.lowerBound, step.pointers.upperBound)}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Validated
          </p>
          <p className="mt-2 font-mono text-2xl text-emerald-200">
            {step.state.validatedIds.length}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Invalid Node
          </p>
          <p className="mt-2 font-mono text-2xl text-rose-200">
            {labelOf(step, step.state.invalidId)}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Result
          </p>
          <p className="mt-2 font-mono text-2xl text-cyan-200">
            {formatResult(step.state.result)}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <FrameStack
          frames={step.state.frames}
          nodes={step.state.nodes}
          emptyLabel="No scheduled range checks remain."
        />
        <ValidationLedger
          records={step.state.records}
          nodes={step.state.nodes}
          invalidId={step.state.invalidId}
        />
      </div>
    </div>
  );
}
