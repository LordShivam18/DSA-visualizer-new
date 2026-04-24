import { chipTone } from "./tone";
import type { SlidingWindowTraceStep } from "./types";

export default function SlidingWindowTracePanel({
  step,
  description,
}: {
  step: SlidingWindowTraceStep;
  description: string;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-yellow-400 shadow-[0_0_18px_rgba(250,204,21,0.6)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Trace Panel</h2>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <span className={`rounded-full border px-3 py-1 ${chipTone("slate")}`}>
          Step {step.step + 1}
        </span>
        <span className={`rounded-full border px-3 py-1 ${chipTone("yellow")}`}>
          {step.actionKind}
        </span>
        <span
          className={`rounded-full border px-3 py-1 ${chipTone(
            step.done ? "emerald" : "cyan"
          )}`}
        >
          {step.done ? "Complete" : "Live Window"}
        </span>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-[#06131a] p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Current Action
        </p>
        <p className="mt-2 text-sm leading-7 text-slate-100">{step.action}</p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Left Pointer
          </p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {step.pointers.left ?? "-"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Right Pointer
          </p>
          <p className="mt-2 text-2xl font-semibold text-emerald-200">
            {step.pointers.right ?? "-"}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Focus Key
          </p>
          <p className="mt-2 break-words text-xl font-semibold text-yellow-200">
            {step.pointers.focusKey ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Focus Value
          </p>
          <p className="mt-2 break-words text-xl font-semibold text-violet-200">
            {step.pointers.focusValue ?? "none"}
          </p>
        </div>
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Result
          </p>
          <p className="mt-2 break-words text-xl font-semibold text-emerald-200">
            {step.state.resultValue}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Invariant Snapshot
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          {step.explanationExpert}
        </p>
      </div>
    </div>
  );
}
