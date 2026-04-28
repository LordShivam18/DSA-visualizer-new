"use client";

import type { ReplayVariation } from "@/lib/academy/variationEngine";

import { lightPanelClassName } from "../array-string/shared/ui";

const kindTone = {
  minimal: "border-emerald-200 bg-emerald-50 text-emerald-700",
  edge: "border-amber-200 bg-amber-50 text-amber-700",
  adversarial: "border-rose-200 bg-rose-50 text-rose-700",
  mutation: "border-cyan-200 bg-cyan-50 text-cyan-700",
} as const;

export default function ReplayVariationsPanel({
  items,
  onApply,
  variant = "default",
}: {
  items: ReplayVariation[];
  onApply: (variation: ReplayVariation) => void;
  variant?: "default" | "guided";
}) {
  if (variant === "guided") {
    if (items.length === 0) {
      return null;
    }

    return (
      <section className={`${lightPanelClassName} p-5`}>
        <div className="flex items-center gap-3">
          <span className="h-4 w-1.5 rounded-full bg-amber-400" />
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Try one more case
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              Check the same rule on a new input
            </h2>
          </div>
        </div>

        <p className="mt-4 text-sm leading-7 text-slate-700">
          One variation tests the boundary. One pushes the pattern a little harder.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-[1.1rem] border border-slate-200 bg-slate-50/80 px-4 py-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${kindTone[item.kind]}`}
                >
                  {item.kind}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
              <button
                type="button"
                onClick={() => onApply(item)}
                className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-700"
              >
                Try this case
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className={`${lightPanelClassName} p-5`}>
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-amber-400" />
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Replay With Variations
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            Change the case, keep the pattern
          </h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-700">
        Custom inputs still work. These quick replays target minimal, edge, and
        adversarial cases so the reasoning stops depending on one example.
      </p>

      {items.length === 0 ? (
        <div className="mt-4 rounded-[1.15rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
          This lesson does not ship with auto-generated variations yet, so the
          fastest transfer rep is to edit one input above and rerun the trace.
        </div>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-[1.1rem] border border-slate-200 bg-slate-50/80 px-4 py-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] ${kindTone[item.kind]}`}
                >
                  {item.kind}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.summary}</p>
              <button
                onClick={() => onApply(item)}
                className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:text-cyan-700"
              >
                Apply variation
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
