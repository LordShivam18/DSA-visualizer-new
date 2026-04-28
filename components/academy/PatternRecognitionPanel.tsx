"use client";

import Link from "next/link";

import type { PatternRecognitionInsight } from "@/lib/academy/patternEngine";

import { lightPanelClassName } from "../array-string/shared/ui";

export default function PatternRecognitionPanel({
  insight,
}: {
  insight: PatternRecognitionInsight | null;
}) {
  if (!insight) {
    return null;
  }

  return (
    <section className={`${lightPanelClassName} p-5`}>
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400" />
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Pattern Recognition
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {insight.label}
          </h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-700">{insight.summary}</p>

      <div className="mt-4 rounded-[1.15rem] border border-cyan-200 bg-cyan-50/70 px-4 py-4">
        <p className="text-xs uppercase tracking-[0.18em] text-cyan-700">
          Why this pattern fits
        </p>
        <p className="mt-3 text-sm leading-7 text-slate-800">{insight.whyItFits}</p>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.15rem] border border-slate-200 bg-slate-50/80 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Use when
          </p>
          <div className="mt-3 space-y-2">
            {insight.whenToUse.map((item) => (
              <p key={item} className="text-sm leading-6 text-slate-700">
                {item}
              </p>
            ))}
          </div>
        </div>

        <div className="rounded-[1.15rem] border border-slate-200 bg-slate-50/80 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Watch for
          </p>
          <div className="mt-3 space-y-2">
            {insight.watchFor.map((item) => (
              <p key={item} className="text-sm leading-6 text-slate-700">
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
          Similar problems
        </p>
        <div className="mt-3 space-y-3">
          {insight.similarProblems.map((problem) => (
            <Link
              key={problem.id}
              href={problem.path}
              className="block rounded-[1rem] border border-slate-200 bg-slate-50/80 px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white"
            >
              <p className="text-sm font-semibold text-slate-900">{problem.title}</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {problem.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
