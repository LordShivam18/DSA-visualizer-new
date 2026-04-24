import type { TeachingTraceFrame } from "./types";
import {
  DarkMetricGrid,
  DarkPointerGrid,
  darkPanelClassName,
  getDarkToneClasses,
} from "./darkUi";

export default function DarkTracePanel({
  step,
  title = "Trace Panel",
  subtitle = "Each step captures one logical state change.",
}: {
  step: TeachingTraceFrame;
  title?: string;
  subtitle?: string;
}) {
  const tone = getDarkToneClasses(step.actionTone);

  return (
    <div className={`${darkPanelClassName} p-5`}>
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.42)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-slate-300">
          Step <span className="font-mono font-semibold">{step.step + 1}</span>
        </span>
        <span className={`rounded-full border px-3 py-1 font-medium ${tone.soft}`}>
          {step.actionKind}
        </span>
        <span
          className={`rounded-full border px-3 py-1 ${
            step.done
              ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
              : "border-violet-400/30 bg-violet-500/10 text-violet-100"
          }`}
        >
          {step.done ? "Complete" : "In Progress"}
        </span>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          Current Action
        </p>
        <p className="mt-2 text-sm leading-7 text-slate-300">{step.action}</p>
      </div>

      <div className="mt-5">
        <DarkMetricGrid items={step.metrics} />
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          Active Pointers
        </p>
        <div className="mt-3">
          <DarkPointerGrid items={step.pointerChips} />
        </div>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4 text-sm leading-7 text-slate-300">
        <span className="font-semibold text-slate-50">Invariant:</span>{" "}
        {step.expertNote}
      </div>
    </div>
  );
}
