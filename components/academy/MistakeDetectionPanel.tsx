"use client";

import type { LessonMistakeInsight } from "./hooks/useLessonLearningExperience";
import { lightPanelClassName } from "../array-string/shared/ui";

export default function MistakeDetectionPanel({
  insight,
}: {
  insight: LessonMistakeInsight | null;
}) {
  if (!insight) {
    return null;
  }

  const toneClassName =
    insight.state === "repair"
      ? "border-rose-200 bg-rose-50"
      : insight.state === "correct"
      ? "border-emerald-200 bg-emerald-50"
      : "border-amber-200 bg-amber-50";
  const accentClassName =
    insight.state === "repair"
      ? "bg-rose-400"
      : insight.state === "correct"
      ? "bg-emerald-400"
      : "bg-amber-400";

  return (
    <section className={`${lightPanelClassName} p-5`}>
      <div className="flex items-center gap-3">
        <span className={`h-4 w-1.5 rounded-full ${accentClassName}`} />
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Mistake Detection
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {insight.title}
          </h2>
        </div>
      </div>

      <div className={`mt-4 rounded-[1.15rem] border px-4 py-4 ${toneClassName}`}>
        {insight.patternLabel ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            {insight.patternLabel}
            {insight.confidence ? ` - ${Math.round(insight.confidence * 100)}%` : ""}
          </p>
        ) : null}
        <p className="text-sm leading-7 text-slate-800">{insight.detail}</p>
      </div>

      <div className="mt-4 rounded-[1.15rem] border border-slate-200 bg-slate-50/80 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Coaching move
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700">{insight.support}</p>
        {insight.evidence && insight.evidence.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {insight.evidence.map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
              >
                {item}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
