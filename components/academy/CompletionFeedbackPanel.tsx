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
  variant = "default",
}: {
  insight: CompletionFeedbackInsight | null;
  variant?: "default" | "guided";
}) {
  if (!insight) {
    return null;
  }

  if (variant === "guided") {
    return (
      <section className={`${lightPanelClassName} p-5`}>
        <div className="flex items-center gap-3">
          <span className="h-4 w-1.5 rounded-full bg-emerald-400" />
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Lesson complete
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">
              {insight.headline}
            </h2>
          </div>
        </div>

        <div className="mt-4 rounded-[1.2rem] border border-emerald-200 bg-emerald-50 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-emerald-700">
            Key insight
          </p>
          <p className="mt-2 text-sm leading-7 text-emerald-950">
            {insight.beginnerInsight}
          </p>
        </div>

        <div className="mt-4 rounded-[1.2rem] border border-violet-200 bg-violet-50 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-violet-700">
            Next up
          </p>
          <p className="mt-2 text-sm leading-7 text-violet-950">
            {insight.beginnerSuggestion}
          </p>
        </div>

        {insight.continueHref ? (
          <Link
            href={insight.continueHref}
            className="mt-5 inline-flex rounded-xl border border-cyan-200 bg-cyan-500 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(34,211,238,0.22)] transition-all hover:-translate-y-0.5 hover:bg-cyan-600"
          >
            Continue Learning
          </Link>
        ) : null}
      </section>
    );
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
