import type { TeachingTraceFrame } from "./types";
import { matrixPanelClassName, MetricGrid, PointerGrid } from "./ui";

function toneClass(actionTone: TeachingTraceFrame["actionTone"]) {
  if (actionTone === "sky") {
    return "border-sky-200 bg-sky-50 text-sky-700";
  }
  if (actionTone === "emerald") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (actionTone === "rose") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }
  if (actionTone === "indigo") {
    return "border-indigo-200 bg-indigo-50 text-indigo-700";
  }
  if (actionTone === "amber") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  return "border-stone-200 bg-stone-50 text-stone-700";
}

export default function MatrixTracePanel({
  step,
  title = "Trace Panel",
  subtitle = "Each snapshot records one meaningful state change.",
}: {
  step: TeachingTraceFrame;
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className={`${matrixPanelClassName} p-5`}>
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-[#d8a55a]" />
        <div>
          <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
          <p className="text-sm text-stone-500">{subtitle}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-[#eadcc8] bg-[#fffaf5] px-3 py-1 text-stone-700">
          Step <span className="font-mono font-semibold">{step.step + 1}</span>
        </span>
        <span className={`rounded-full border px-3 py-1 font-medium ${toneClass(step.actionTone)}`}>
          {step.actionKind}
        </span>
        <span
          className={`rounded-full border px-3 py-1 ${
            step.done
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-indigo-200 bg-indigo-50 text-indigo-700"
          }`}
        >
          {step.done ? "Complete" : "In Progress"}
        </span>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-[#eadcc8] bg-[#fffaf5] p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
          Current Action
        </p>
        <p className="mt-2 text-sm leading-7 text-stone-700">{step.action}</p>
      </div>

      <div className="mt-5">
        <MetricGrid items={step.metrics} />
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-[#eadcc8] bg-[#fffaf5] p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-stone-500">
          Active Markers
        </p>
        <div className="mt-3">
          <PointerGrid items={step.pointerChips} />
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-[#eadcc8] bg-[#fffaf5] p-4 text-sm leading-7 text-stone-700">
        <span className="font-semibold text-stone-900">Invariant:</span>{" "}
        {step.expertNote}
      </div>
    </div>
  );
}
