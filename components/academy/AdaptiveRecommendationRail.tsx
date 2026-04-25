"use client";

import Link from "next/link";

import type { AdaptiveRecommendation } from "@/lib/academy/models";

import { lightPanelClassName } from "../array-string/shared/ui";

const trackTone = {
  repair: "border-rose-200 bg-rose-50 text-rose-700",
  reinforce: "border-cyan-200 bg-cyan-50 text-cyan-700",
  stretch: "border-violet-200 bg-violet-50 text-violet-700",
} as const;

export default function AdaptiveRecommendationRail({
  items,
  title = "Adaptive Next Steps",
}: {
  items: AdaptiveRecommendation[];
  title?: string;
}) {
  return (
    <section className={`${lightPanelClassName} p-5`}>
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-violet-400 shadow-[0_0_16px_rgba(139,92,246,0.3)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
          <p className="text-sm text-slate-500">
            Recommendations shift as your accuracy, speed, and hint usage change.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {items.length === 0 ? (
          <div className="rounded-[1.2rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
            Finish a lesson to unlock personalized recommendations.
          </div>
        ) : (
          items.map((item) => (
            <Link
              key={item.problemId}
              href={item.route}
              className="block rounded-[1.25rem] border border-slate-200 bg-slate-50/80 p-4 transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:bg-white"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${trackTone[item.track]}`}
                    >
                      {item.track}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.reason}
                  </p>
                </div>
                <div className="text-right text-xs uppercase tracking-[0.18em] text-slate-500">
                  <div>{item.topicLabel}</div>
                  <div className="mt-1">{item.difficulty}</div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
