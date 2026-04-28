"use client";

import Link from "next/link";

import type { GuidedLearningPath } from "@/lib/academy/learningPathEngine";

import { lightPanelClassName } from "../array-string/shared/ui";

const statusTone = {
  foundation: "border-slate-200 bg-slate-50 text-slate-700",
  current: "border-cyan-200 bg-cyan-50 text-cyan-700",
  next: "border-emerald-200 bg-emerald-50 text-emerald-700",
  stretch: "border-violet-200 bg-violet-50 text-violet-700",
  later: "border-amber-200 bg-amber-50 text-amber-700",
} as const;

export default function GuidedLearningPathPanel({
  path,
}: {
  path: GuidedLearningPath | null;
}) {
  if (!path) {
    return null;
  }

  return (
    <section className={`${lightPanelClassName} p-5`}>
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-emerald-400" />
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Guided Learning Path
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {path.title}
          </h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-700">{path.summary}</p>

      <div className="mt-4 space-y-3">
        {path.nodes.map((node) => (
          <Link
            key={node.problemId}
            href={node.route}
            className="block rounded-[1.1rem] border border-slate-200 bg-slate-50/80 px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-slate-900">
                    {node.title}
                  </p>
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${statusTone[node.status]}`}
                  >
                    {node.status}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {node.summary}
                </p>
              </div>
              <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] uppercase tracking-[0.18em] text-slate-500">
                {node.difficulty}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {path.recommendations.length > 0 ? (
        <div className="mt-4 rounded-[1.15rem] border border-slate-200 bg-slate-50/80 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Recommended next
          </p>
          <div className="mt-3 space-y-3">
            {path.recommendations.map((item) => (
              <Link
                key={item.problemId}
                href={item.route}
                className="block rounded-[1rem] border border-white bg-white px-4 py-3 transition-all hover:border-cyan-200"
              >
                <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.reason}</p>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
