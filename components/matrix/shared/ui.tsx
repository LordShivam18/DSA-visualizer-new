import type { ReactNode } from "react";

import type {
  LegendItem,
  MatrixBoardView,
  MetricCard,
  PointerChip,
  Tone,
} from "./types";

export const matrixPanelClassName =
  "rounded-[1.75rem] border border-[#eadcc8]/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,248,241,0.9))] shadow-[0_24px_80px_rgba(120,94,56,0.12)] backdrop-blur-xl";

const toneMap: Record<
  Tone,
  {
    card: string;
    soft: string;
    text: string;
  }
> = {
  sky: {
    card:
      "border-sky-200 bg-sky-50/90 text-sky-900 shadow-[0_12px_30px_rgba(14,165,233,0.12)]",
    soft: "border-sky-200 bg-sky-50 text-sky-700",
    text: "text-sky-700",
  },
  amber: {
    card:
      "border-amber-200 bg-amber-50/90 text-amber-900 shadow-[0_12px_30px_rgba(245,158,11,0.12)]",
    soft: "border-amber-200 bg-amber-50 text-amber-700",
    text: "text-amber-700",
  },
  emerald: {
    card:
      "border-emerald-200 bg-emerald-50/90 text-emerald-900 shadow-[0_12px_30px_rgba(16,185,129,0.12)]",
    soft: "border-emerald-200 bg-emerald-50 text-emerald-700",
    text: "text-emerald-700",
  },
  rose: {
    card:
      "border-rose-200 bg-rose-50/90 text-rose-900 shadow-[0_12px_30px_rgba(244,63,94,0.12)]",
    soft: "border-rose-200 bg-rose-50 text-rose-700",
    text: "text-rose-700",
  },
  indigo: {
    card:
      "border-indigo-200 bg-indigo-50/90 text-indigo-900 shadow-[0_12px_30px_rgba(99,102,241,0.12)]",
    soft: "border-indigo-200 bg-indigo-50 text-indigo-700",
    text: "text-indigo-700",
  },
  slate: {
    card:
      "border-stone-200 bg-stone-50/90 text-stone-800 shadow-[0_12px_26px_rgba(120,94,56,0.08)]",
    soft: "border-stone-200 bg-stone-50 text-stone-700",
    text: "text-stone-700",
  },
};

function resolveTone(tone?: Tone) {
  return toneMap[tone ?? "slate"];
}

export function MatrixDifficultyBadge({
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
      className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${classes}`}
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
            className={`rounded-[1.1rem] border px-4 py-3 transition-all ${tone.card}`}
          >
            <p className="text-[11px] uppercase tracking-[0.24em] opacity-70">
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
      <div className="rounded-[1.1rem] border border-dashed border-stone-200 bg-stone-50 px-4 py-5 text-sm text-stone-500">
        No active markers in this step.
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
            className={`rounded-full border px-3 py-1.5 text-sm font-medium ${tone.card}`}
          >
            <span className="opacity-75">{item.label}:</span>{" "}
            <span className="font-mono">{item.value}</span>
          </div>
        );
      })}
    </div>
  );
}

export function AccentPanel({
  title,
  tone = "slate",
  children,
}: {
  title: string;
  tone?: Tone;
  children: ReactNode;
}) {
  const resolved = resolveTone(tone);

  return (
    <div className={`rounded-[1.25rem] border px-5 py-4 ${resolved.card}`}>
      <p className="text-xs uppercase tracking-[0.24em] opacity-70">{title}</p>
      <div className="mt-2 text-sm leading-7">{children}</div>
    </div>
  );
}

export function NoteList({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-[1.25rem] border border-[#e8dccb] bg-[#fffaf5] p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
        {title}
      </p>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-[1rem] border border-[#efe4d7] bg-white px-4 py-3 text-sm leading-6 text-stone-600"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LegendRow({ items }: { items: LegendItem[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => {
        const tone = resolveTone(item.tone);
        return (
          <span
            key={item.label}
            className={`rounded-full border px-3 py-1 text-xs font-medium ${tone.soft}`}
          >
            {item.label}
          </span>
        );
      })}
    </div>
  );
}

export function MatrixBoard({
  title,
  subtitle,
  board,
  legend,
  footer,
}: {
  title: string;
  subtitle: string;
  board: MatrixBoardView;
  legend?: LegendItem[];
  footer?: ReactNode;
}) {
  const rowCount = board.rows.length;
  const colCount = board.rows[0]?.cells.length ?? 0;
  const compact = board.compact ?? false;
  const thickEvery = board.thickEvery ?? 0;

  return (
    <div className={`${matrixPanelClassName} p-5`}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="h-5 w-1.5 rounded-full bg-gradient-to-b from-[#d8a55a] via-[#8eb8cf] to-[#77b49b]" />
            <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-stone-600">{subtitle}</p>
        </div>
        <div className="rounded-full border border-[#eadcc8] bg-white/80 px-4 py-2 text-xs uppercase tracking-[0.22em] text-stone-500">
          {rowCount} x {colCount} board
        </div>
      </div>

      {legend && legend.length > 0 ? (
        <div className="mt-4">
          <LegendRow items={legend} />
        </div>
      ) : null}

      <div className="mt-5 overflow-x-auto">
        <div className="inline-flex min-w-full flex-col gap-2">
          {board.colLabels ? (
            <div
              className="grid gap-2"
              style={{
                gridTemplateColumns: `auto repeat(${colCount}, minmax(${compact ? 44 : 64}px, 1fr))`,
              }}
            >
              <div />
              {board.colLabels.map((label) => (
                <div
                  key={label}
                  className="text-center text-[11px] uppercase tracking-[0.24em] text-stone-500"
                >
                  {label}
                </div>
              ))}
            </div>
          ) : null}

          {board.rows.map((row, rowIndex) => (
            <div
              key={`row-${rowIndex}`}
              className="grid gap-2"
              style={{
                gridTemplateColumns: `auto repeat(${row.cells.length}, minmax(${compact ? 44 : 64}px, 1fr))`,
              }}
            >
              <div className="flex items-center justify-center text-[11px] uppercase tracking-[0.24em] text-stone-500">
                {row.label ?? `r${rowIndex}`}
              </div>
              {row.cells.map((cell, colIndex) => {
                const tone = resolveTone(cell.tone);
                const thickTop =
                  thickEvery > 0 && rowIndex > 0 && rowIndex % thickEvery === 0;
                const thickLeft =
                  thickEvery > 0 && colIndex > 0 && colIndex % thickEvery === 0;

                return (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    className={`relative flex flex-col justify-center rounded-[1rem] border bg-white px-2 py-2 text-center transition-all ${
                      cell.muted ? "opacity-55" : ""
                    } ${cell.pulse ? "scale-[1.01]" : ""} ${tone.card}`}
                    style={{
                      minHeight: compact ? 68 : 88,
                      borderTopWidth: thickTop ? 3 : 1,
                      borderLeftWidth: thickLeft ? 3 : 1,
                    }}
                  >
                    {cell.badge ? (
                      <span className="absolute right-2 top-2 rounded-full border border-white/70 bg-white/85 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-stone-500">
                        {cell.badge}
                      </span>
                    ) : null}
                    <div className={`${compact ? "text-lg" : "text-2xl"} font-semibold`}>
                      {cell.value}
                    </div>
                    {cell.secondary ? (
                      <div className="mt-1 text-[11px] leading-4 opacity-70">
                        {cell.secondary}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {footer ? <div className="mt-5">{footer}</div> : null}
    </div>
  );
}
