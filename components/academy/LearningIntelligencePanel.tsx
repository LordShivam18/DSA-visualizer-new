"use client";

import type { LessonIntelligenceInsight } from "@/lib/academy/lessonCoachEngine";

import { lightPanelClassName } from "../array-string/shared/ui";

const actionTone = {
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-800",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  violet: "border-violet-200 bg-violet-50 text-violet-800",
  rose: "border-rose-200 bg-rose-50 text-rose-800",
} as const;

export default function LearningIntelligencePanel({
  insight,
}: {
  insight: LessonIntelligenceInsight | null;
}) {
  if (!insight) {
    return null;
  }

  return (
    <section className={`${lightPanelClassName} p-5`}>
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-rose-400" />
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Learning Intelligence
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {insight.headline}
          </h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-700">{insight.summary}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {insight.metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-[1rem] border border-slate-200 bg-slate-50/80 px-4 py-3"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              {metric.label}
            </p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        {insight.actions.map((action) => (
          <div
            key={action.label}
            className={`rounded-[1.1rem] border px-4 py-4 ${actionTone[action.tone]}`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-75">
              {action.label}
            </p>
            <p className="mt-2 text-base font-semibold">{action.title}</p>
            <p className="mt-3 text-sm leading-6 opacity-90">{action.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
