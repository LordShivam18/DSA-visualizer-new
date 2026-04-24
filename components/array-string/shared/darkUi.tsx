import type { ReactNode } from "react";

import type { MetricCard, PointerChip, Tone, VisualRow } from "./types";

export const darkPanelClassName =
  "rounded-[1.6rem] border border-slate-800/80 bg-[#050916]/90 shadow-[0_0_40px_rgba(2,6,23,0.65)] backdrop-blur-xl";

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
      "border-cyan-400/45 bg-cyan-500/10 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.18)]",
    soft: "border-cyan-400/25 bg-cyan-500/10 text-cyan-100",
    text: "text-cyan-200",
  },
  red: {
    card:
      "border-rose-400/45 bg-rose-500/10 text-rose-50 shadow-[0_0_24px_rgba(244,63,94,0.18)]",
    soft: "border-rose-400/25 bg-rose-500/10 text-rose-100",
    text: "text-rose-200",
  },
  green: {
    card:
      "border-emerald-400/45 bg-emerald-500/10 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.18)]",
    soft: "border-emerald-400/25 bg-emerald-500/10 text-emerald-100",
    text: "text-emerald-200",
  },
  purple: {
    card:
      "border-violet-400/45 bg-violet-500/10 text-violet-50 shadow-[0_0_24px_rgba(167,139,250,0.18)]",
    soft: "border-violet-400/25 bg-violet-500/10 text-violet-100",
    text: "text-violet-200",
  },
  yellow: {
    card:
      "border-amber-400/45 bg-amber-500/10 text-amber-50 shadow-[0_0_24px_rgba(245,158,11,0.18)]",
    soft: "border-amber-400/25 bg-amber-500/10 text-amber-100",
    text: "text-amber-200",
  },
  slate: {
    card:
      "border-slate-700/80 bg-slate-950/65 text-slate-100 shadow-[0_0_18px_rgba(15,23,42,0.45)]",
    soft: "border-slate-700/80 bg-slate-900/80 text-slate-300",
    text: "text-slate-200",
  },
};

export function getDarkToneClasses(tone?: Tone) {
  return toneMap[tone ?? "slate"];
}

export function DarkDifficultyBadge({
  difficulty,
}: {
  difficulty: "Easy" | "Medium" | "Hard";
}) {
  const classes =
    difficulty === "Easy"
      ? "badge-easy"
      : difficulty === "Medium"
      ? "badge-medium"
      : "badge-hard";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${classes}`}
    >
      {difficulty}
    </span>
  );
}

export function DarkMetricGrid({
  items,
  columns = "md:grid-cols-3",
}: {
  items: MetricCard[];
  columns?: string;
}) {
  return (
    <div className={`grid gap-3 ${columns}`}>
      {items.map((item) => {
        const tone = getDarkToneClasses(item.tone);
        return (
          <div
            key={item.label}
            className={`rounded-[1.1rem] border px-4 py-3 transition-all ${tone.card}`}
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

export function DarkPointerGrid({ items }: { items: PointerChip[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-[1.1rem] border border-dashed border-slate-700/80 bg-slate-950/60 px-4 py-5 text-sm text-slate-500">
        No active pointers for this step.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const tone = getDarkToneClasses(item.tone);
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

export function DarkArrayRowsView({
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
          className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
                {row.label}
              </h3>
              {row.description ? (
                <p className="mt-1 text-sm text-slate-500">{row.description}</p>
              ) : null}
            </div>
            <span className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-xs text-slate-400">
              {row.cells.length} slot{row.cells.length === 1 ? "" : "s"}
            </span>
          </div>

          {row.cells.length === 0 ? (
            <div className="rounded-[1rem] border border-dashed border-slate-700/80 bg-slate-950/80 px-4 py-5 text-sm text-slate-500">
              {row.emptyLabel ?? "No values to show yet."}
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              {row.cells.map((cell, index) => {
                const tone = getDarkToneClasses(cell.tone);

                return (
                  <div
                    key={`${row.label}-${index}-${cell.value}`}
                    className={`min-w-[84px] flex-1 rounded-[1rem] border px-3 py-3 transition-all duration-300 ${
                      cell.ghost ? "opacity-55" : ""
                    } ${tone.card}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      {showIndex ? (
                        <span className="rounded-full border border-white/8 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-slate-400">
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
                      <div className="whitespace-pre-wrap break-all font-mono text-2xl font-semibold">
                        {cell.value}
                      </div>
                      {cell.secondary ? (
                        <div className="mt-1 whitespace-pre-wrap text-xs opacity-70">
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

export function DarkKeyValueGrid({
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
    <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        ) : null}
      </div>

      {entries.length === 0 ? (
        <div className="mt-4 rounded-[1rem] border border-dashed border-slate-700/80 bg-slate-950/80 px-4 py-5 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {entries.map((entry) => {
            const tone = getDarkToneClasses(entry.tone);
            return (
              <div
                key={entry.key}
                className={`rounded-[1rem] border px-4 py-3 transition-all ${tone.card}`}
              >
                <p className="text-[11px] uppercase tracking-[0.22em] opacity-70">
                  key
                </p>
                <p className="mt-1 break-all font-mono text-lg font-semibold">
                  {entry.key}
                </p>
                <p className="mt-3 text-[11px] uppercase tracking-[0.22em] opacity-70">
                  value
                </p>
                <p className="mt-1 whitespace-pre-wrap break-all font-mono text-lg">
                  {entry.value}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function DarkHintList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
        {title}
      </p>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-[1rem] border border-slate-700/80 bg-slate-950/85 px-4 py-3 text-sm leading-6 text-slate-300"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function DarkAccentBanner({
  tone = "cyan",
  title,
  children,
}: {
  tone?: Tone;
  title: string;
  children: ReactNode;
}) {
  const resolved = getDarkToneClasses(tone);

  return (
    <div className={`rounded-[1.3rem] border px-5 py-4 ${resolved.card}`}>
      <p className="text-xs uppercase tracking-[0.22em] opacity-75">{title}</p>
      <div className="mt-2 text-sm leading-7">{children}</div>
    </div>
  );
}
