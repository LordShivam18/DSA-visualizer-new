"use client";

import Link from "next/link";

import type { CompletionFeedbackInsight } from "@/lib/academy/completionFeedbackEngine";

import { lightPanelClassName } from "../array-string/shared/ui";

const toneClass = {
  cyan: "border-cyan-200 bg-cyan-50 text-cyan-800",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  violet: "border-violet-200 bg-violet-50 text-violet-800",
  rose: "border-rose-200 bg-rose-50 text-rose-800",
} as const;

export default function CompletionFeedbackPanel({
  insight,
}: {
  insight: CompletionFeedbackInsight | null;
}) {
  if (!insight) {
    return null;
  }

  return (
    <section className={`${lightPanelClassName} p-5`}>
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-emerald-400" />
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Completion Feedback
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {insight.headline}
          </h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-700">{insight.summary}</p>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {insight.metrics.map((metric) => (
          <div
            key={metric.label}
            className={`rounded-[1rem] border px-4 py-3 ${toneClass[metric.tone]}`}
          >
            <p className="text-xs uppercase tracking-[0.18em] opacity-75">
              {metric.label}
            </p>
            <p className="mt-2 text-lg font-semibold">{metric.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[1.15rem] border border-slate-200 bg-slate-50/80 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Confirmation
        </p>
        <div className="mt-3 space-y-2">
          {insight.confirmations.map((item) => (
            <p key={item} className="text-sm leading-6 text-slate-700">
              {item}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        {insight.nextSteps.map((item) => {
          const content = (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-75">
                {item.label}
              </p>
              <p className="mt-2 text-base font-semibold">{item.title}</p>
              <p className="mt-3 text-sm leading-6 opacity-90">{item.detail}</p>
            </>
          );
          const className = `block rounded-[1.1rem] border px-4 py-4 ${toneClass[item.tone]}`;

          return item.href ? (
            <Link key={item.label} href={item.href} className={className}>
              {content}
            </Link>
          ) : (
            <div key={item.label} className={className}>
              {content}
            </div>
          );
        })}
      </div>
    </section>
  );
}
