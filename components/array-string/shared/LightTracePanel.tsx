import type { TeachingTraceFrame } from "./types";
import { lightPanelClassName, MetricGrid, PointerGrid } from "./ui";

export default function LightTracePanel({
  step,
  title = "Trace Panel",
  subtitle = "Each step captures one logical state change.",
}: {
  step: TeachingTraceFrame;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className={`${lightPanelClassName} p-5`}>
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-amber-400 shadow-[0_0_16px_rgba(245,158,11,0.35)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-slate-700">
          Step <span className="font-mono font-semibold">{step.step + 1}</span>
        </span>
        <span
          className={`rounded-full border px-3 py-1 font-medium ${
            step.actionTone === "cyan"
              ? "border-cyan-200 bg-cyan-50 text-cyan-700"
              : step.actionTone === "green"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : step.actionTone === "red"
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : step.actionTone === "purple"
              ? "border-violet-200 bg-violet-50 text-violet-700"
              : step.actionTone === "yellow"
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-slate-200 bg-slate-50 text-slate-700"
          }`}
        >
          {step.actionKind}
        </span>
        <span
          className={`rounded-full border px-3 py-1 ${
            step.done
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-violet-200 bg-violet-50 text-violet-700"
          }`}
        >
          {step.done ? "Complete" : "In Progress"}
        </span>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          Current Action
        </p>
        <p className="mt-2 text-sm leading-7 text-slate-700">{step.action}</p>
      </div>

      <div className="mt-5">
        <MetricGrid items={step.metrics} />
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          Active Pointers
        </p>
        <div className="mt-3">
          <PointerGrid items={step.pointerChips} />
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-7 text-slate-700">
        <span className="font-semibold text-slate-900">Invariant:</span>{" "}
        {step.expertNote}
      </div>
    </div>
  );
}
