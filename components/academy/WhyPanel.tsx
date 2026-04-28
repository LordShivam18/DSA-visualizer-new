"use client";

import type { WhyExplanation } from "@/lib/academy/whyEngine";

import { lightPanelClassName } from "../array-string/shared/ui";

export default function WhyPanel({
  insight,
}: {
  insight: WhyExplanation | null;
}) {
  if (!insight) {
    return (
      <section className={`${lightPanelClassName} p-5`}>
        <div className="flex items-center gap-3">
          <span className="h-4 w-1.5 rounded-full bg-blue-400" />
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Why This Step</h2>
            <p className="text-sm text-slate-500">
              Step-level reasoning appears here as the timeline advances.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`${lightPanelClassName} p-5`}>
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-blue-400" />
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Why Panel
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {insight.title}
          </h2>
        </div>
      </div>

      <div className="mt-5 rounded-[1.2rem] border border-blue-200 bg-blue-50/75 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-700">
          Current step
        </p>
        <p className="mt-2 text-sm leading-7 text-slate-800">{insight.summary}</p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-200 bg-slate-50/80 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Why now
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-700">{insight.reason}</p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-200 bg-slate-50/80 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Teaching lens
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-700">{insight.detail}</p>
        </div>
      </div>

      <div className="mt-4 rounded-[1.15rem] border border-slate-200 bg-slate-50/80 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Focus
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-700">{insight.nextFocus}</p>
      </div>

      {insight.evidence.length > 0 ? (
        <div className="mt-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Evidence
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {insight.evidence.map((item) => (
              <div
                key={`${item.label}-${item.value}`}
                className="rounded-[1rem] border border-slate-200 bg-white px-4 py-3"
              >
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {insight.hints.length > 0 ? (
        <div className="mt-4 rounded-[1.15rem] border border-slate-200 bg-slate-50/80 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Reinforcement
          </p>
          <div className="mt-3 space-y-2 text-sm leading-7 text-slate-700">
            {insight.hints.map((hint) => (
              <p key={hint}>{hint}</p>
            ))}
          </div>
        </div>
      ) : null}

      {insight.alternatives.length > 0 ? (
        <div className="mt-4 rounded-[1.15rem] border border-slate-200 bg-slate-50/80 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Alternatives
          </p>
          <div className="mt-3 space-y-3">
            {insight.alternatives.map((alternative) => (
              <div
                key={alternative.label}
                className="rounded-[1rem] border border-white bg-white px-4 py-3"
              >
                <p className="text-sm font-semibold text-slate-900">
                  {alternative.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {alternative.reason}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {alternative.whenToUse}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
