import type { ReactNode } from "react";

import type { MetricCard, PointerChip, Tone, VisualRow } from "./types";

export const lightPanelClassName =
  "rounded-[1.5rem] border border-white/70 bg-white/88 shadow-[0_22px_60px_rgba(15,23,42,0.09)] backdrop-blur-xl";

const toneMap: Record<
  Tone,
  {
    card: string;
    soft: string;
    text: string;
  }
> = {
  cyan: {
    card:
      "border-cyan-200 bg-cyan-50/80 text-cyan-800 shadow-[0_0_22px_rgba(34,211,238,0.12)]",
    soft: "border-cyan-100 bg-cyan-50 text-cyan-700",
    text: "text-cyan-700",
  },
  red: {
    card:
      "border-rose-200 bg-rose-50/80 text-rose-800 shadow-[0_0_22px_rgba(244,63,94,0.12)]",
    soft: "border-rose-100 bg-rose-50 text-rose-700",
    text: "text-rose-700",
  },
  green: {
    card:
      "border-emerald-200 bg-emerald-50/80 text-emerald-800 shadow-[0_0_22px_rgba(16,185,129,0.12)]",
    soft: "border-emerald-100 bg-emerald-50 text-emerald-700",
    text: "text-emerald-700",
  },
  purple: {
    card:
      "border-violet-200 bg-violet-50/80 text-violet-800 shadow-[0_0_22px_rgba(139,92,246,0.12)]",
    soft: "border-violet-100 bg-violet-50 text-violet-700",
    text: "text-violet-700",
  },
  yellow: {
    card:
      "border-amber-200 bg-amber-50/80 text-amber-800 shadow-[0_0_22px_rgba(245,158,11,0.12)]",
    soft: "border-amber-100 bg-amber-50 text-amber-700",
    text: "text-amber-700",
  },
  slate: {
    card:
      "border-slate-200 bg-slate-50/90 text-slate-800 shadow-[0_0_18px_rgba(15,23,42,0.06)]",
    soft: "border-slate-200 bg-slate-50 text-slate-700",
    text: "text-slate-700",
  },
};

function resolveTone(tone?: Tone) {
  return toneMap[tone ?? "slate"];
}

export function DifficultyBadge({
  difficulty,
}: {
  difficulty: "Easy" | "Medium" | "Hard";
}) {
  const classes =
    difficulty === "Easy"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : difficulty === "Medium"
      ? "border-amber-200 bg-amber-50 text-amber-700"
      : "border-rose-200 bg-rose-50 text-rose-700";

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${classes}`}
    >
      {difficulty}
    </span>
  );
}

export function MetricGrid({
  items,
  columns = "md:grid-cols-3",
}: {
  items: MetricCard[];
  columns?: string;
}) {
  return (
    <div className={`grid gap-3 ${columns}`}>
      {items.map((item) => {
        const tone = resolveTone(item.tone);
        return (
          <div
            key={item.label}
            className={`rounded-[1.15rem] border px-4 py-3 transition-all ${tone.card}`}
          >
            <p className="text-[11px] uppercase tracking-[0.22em] opacity-70">
              {item.label}
            </p>
            <p className="mt-2 text-2xl font-semibold">{item.value}</p>
          </div>
        );
      })}
    </div>
  );
}

export function PointerGrid({ items }: { items: PointerChip[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-[1.15rem] border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
        No active pointers for this step.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const tone = resolveTone(item.tone);
        return (
          <div
            key={`${item.label}-${item.value}`}
            className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${tone.card}`}
          >
            <span className="opacity-75">{item.label}:</span>{" "}
            <span className="font-mono">{item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

export function ArrayRowsView({
  rows,
  showIndex = true,
}: {
  rows: VisualRow[];
  showIndex?: boolean;
}) {
  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div
          key={row.label}
          className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 p-4"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-700">
                {row.label}
              </h3>
              {row.description ? (
                <p className="mt-1 text-sm text-slate-500">{row.description}</p>
              ) : null}
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500">
              {row.cells.length} slot{row.cells.length === 1 ? "" : "s"}
            </span>
          </div>

          {row.cells.length === 0 ? (
            <div className="rounded-[1rem] border border-dashed border-slate-200 bg-white px-4 py-5 text-sm text-slate-500">
              {row.emptyLabel ?? "No values to show yet."}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {row.cells.map((cell, index) => {
                const tone = resolveTone(cell.tone);

                return (
                  <div
                    key={`${row.label}-${index}-${cell.value}`}
                    className={`min-w-[84px] flex-1 rounded-[1rem] border px-3 py-3 transition-all duration-300 ${
                      cell.ghost ? "opacity-55" : ""
                    } ${tone.card}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      {showIndex ? (
                        <span className="rounded-full border border-white/70 bg-white/80 px-2 py-0.5 text-[11px] font-medium text-slate-500">
                          idx {index}
                        </span>
                      ) : (
                        <span />
                      )}
                      <div className="flex flex-wrap justify-end gap-1">
                        {(cell.tags ?? []).map((tag) => (
                          <span
                            key={tag}
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${tone.soft}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <div className="text-2xl font-semibold">{cell.value}</div>
                      {cell.secondary ? (
                        <div className="mt-1 text-xs opacity-70">
                          {cell.secondary}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function KeyValueGrid({
  title,
  description,
  entries,
  emptyLabel,
}: {
  title: string;
  description?: string;
  entries: { key: string; value: string; tone?: Tone }[];
  emptyLabel: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 p-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-700">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>

      {entries.length === 0 ? (
        <div className="mt-4 rounded-[1rem] border border-dashed border-slate-200 bg-white px-4 py-5 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {entries.map((entry) => {
            const tone = resolveTone(entry.tone);
            return (
              <div
                key={entry.key}
                className={`rounded-[1rem] border px-4 py-3 transition-all ${tone.card}`}
              >
                <p className="text-[11px] uppercase tracking-[0.22em] opacity-70">
                  key
                </p>
                <p className="mt-1 font-mono text-lg font-semibold">{entry.key}</p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.22em] opacity-70">
                  value
                </p>
                <p className="mt-1 font-mono text-lg">{entry.value}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function HintList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-200/80 bg-slate-50/80 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
        {title}
      </p>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function AccentBanner({
  tone = "cyan",
  title,
  children,
}: {
  tone?: Tone;
  title: string;
  children: ReactNode;
}) {
  const resolved = resolveTone(tone);

  return (
    <div className={`rounded-[1.35rem] border px-5 py-4 ${resolved.card}`}>
      <p className="text-xs uppercase tracking-[0.22em] opacity-70">{title}</p>
      <div className="mt-2 text-sm leading-7">{children}</div>
    </div>
  );
}
