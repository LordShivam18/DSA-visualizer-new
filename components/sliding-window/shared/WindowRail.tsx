import { chipTone } from "./tone";
import type { AccentTone, RailItem, WindowSpan } from "./types";

type Props = {
  label: string;
  items: RailItem[];
  activeSpan?: WindowSpan;
  bestSpan?: WindowSpan;
  leftPointer: number | null;
  rightPointer: number | null;
  accent?: AccentTone;
  emptyLabel: string;
};

function percentage(index: number, count: number) {
  return `${(index / count) * 100}%`;
}

function spanStyle(span: WindowSpan | undefined, count: number) {
  if (!span || span.start === null || span.end === null || count === 0) {
    return undefined;
  }

  const safeStart = Math.max(0, Math.min(span.start, count - 1));
  const safeEnd = Math.max(safeStart, Math.min(span.end, count - 1));
  return {
    left: percentage(safeStart, count),
    width: `${((safeEnd - safeStart + 1) / count) * 100}%`,
  };
}

function pointerStyle(index: number | null, count: number) {
  if (index === null || count === 0) {
    return undefined;
  }

  const safeIndex = Math.max(0, Math.min(index, count - 1));
  return {
    left: `calc(${((safeIndex + 0.5) / count) * 100}% - 22px)`,
  };
}

export default function WindowRail({
  label,
  items,
  activeSpan,
  bestSpan,
  leftPointer,
  rightPointer,
  accent = "emerald",
  emptyLabel,
}: Props) {
  if (items.length === 0) {
    return (
      <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          {emptyLabel}
        </div>
      </div>
    );
  }

  const count = items.length;
  const minWidth = Math.max(100, count * 72);
  const activeStyle = spanStyle(activeSpan, count);
  const bestStyle = spanStyle(bestSpan, count);
  const leftStyle = pointerStyle(leftPointer, count);
  const rightStyle = pointerStyle(rightPointer, count);

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{label}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          {activeSpan?.label ? (
            <span className={`rounded-full border px-3 py-1 ${chipTone(accent)}`}>
              {activeSpan.label}
            </span>
          ) : null}
          {bestSpan?.label ? (
            <span className={`rounded-full border px-3 py-1 ${chipTone("yellow")}`}>
              {bestSpan.label}
            </span>
          ) : null}
        </div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="relative" style={{ minWidth }}>
          <div className="window-rail-shell relative rounded-[1.2rem] border border-slate-800/80 bg-[#060b16] px-3 pt-12 pb-4">
            {bestStyle ? (
              <div
                className="window-best-band absolute top-[2.35rem] bottom-3 rounded-[1rem] border border-yellow-400/35 bg-[linear-gradient(90deg,rgba(250,204,21,0.12),rgba(251,191,36,0.24),rgba(250,204,21,0.12))] shadow-[0_0_26px_rgba(250,204,21,0.14)] transition-all duration-300"
                style={bestStyle}
              />
            ) : null}

            {activeStyle ? (
              <div
                className={`window-active-band window-band-${accent} absolute top-[2.15rem] bottom-2 rounded-[1rem] border transition-all duration-300`}
                style={activeStyle}
              />
            ) : null}

            {leftStyle ? (
              <div className="absolute top-1 z-20 transition-all duration-300" style={leftStyle}>
                <div className="pointer-beacon flex w-11 flex-col items-center gap-1">
                  <span className="rounded-full border border-cyan-400/45 bg-cyan-500/16 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
                    L
                  </span>
                  <span className="h-7 w-[2px] rounded-full bg-cyan-400/60" />
                </div>
              </div>
            ) : null}

            {rightStyle ? (
              <div className="absolute top-1 z-20 transition-all duration-300" style={rightStyle}>
                <div className="pointer-beacon pointer-beacon-delay flex w-11 flex-col items-center gap-1">
                  <span className="rounded-full border border-emerald-400/45 bg-emerald-500/16 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-100">
                    R
                  </span>
                  <span className="h-7 w-[2px] rounded-full bg-emerald-400/60" />
                </div>
              </div>
            ) : null}

            <div
              className="relative z-10 grid gap-2"
              style={{
                gridTemplateColumns: `repeat(${count}, minmax(64px, 1fr))`,
              }}
            >
              {items.map((item, index) => {
                const active =
                  activeSpan &&
                  activeSpan.start !== null &&
                  activeSpan.end !== null &&
                  index >= activeSpan.start &&
                  index <= activeSpan.end;
                const inBest =
                  bestSpan &&
                  bestSpan.start !== null &&
                  bestSpan.end !== null &&
                  index >= bestSpan.start &&
                  index <= bestSpan.end;

                let toneClass =
                  "border-slate-800/80 bg-slate-950/85 text-slate-200 shadow-[0_0_18px_rgba(15,23,42,0.42)]";

                if (item.tone === "cyan") {
                  toneClass =
                    "border-cyan-400/55 bg-cyan-500/14 text-cyan-50 shadow-[0_0_24px_rgba(34,211,238,0.18)]";
                } else if (item.tone === "emerald") {
                  toneClass =
                    "border-emerald-400/55 bg-emerald-500/14 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.18)]";
                } else if (item.tone === "yellow") {
                  toneClass =
                    "border-yellow-400/55 bg-yellow-500/14 text-yellow-50 shadow-[0_0_24px_rgba(250,204,21,0.18)]";
                } else if (item.tone === "purple") {
                  toneClass =
                    "border-violet-400/55 bg-violet-500/14 text-violet-50 shadow-[0_0_24px_rgba(167,139,250,0.18)]";
                } else if (item.tone === "rose") {
                  toneClass =
                    "border-rose-400/55 bg-rose-500/14 text-rose-50 shadow-[0_0_24px_rgba(251,113,133,0.18)]";
                }

                if (inBest && item.tone === undefined) {
                  toneClass =
                    "border-yellow-400/45 bg-yellow-500/12 text-yellow-50 shadow-[0_0_22px_rgba(250,204,21,0.16)]";
                }

                if (active && item.tone === undefined) {
                  toneClass =
                    "border-emerald-400/55 bg-emerald-500/14 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.18)]";
                }

                return (
                  <div
                    key={item.id}
                    className={[
                      "window-token relative rounded-[0.95rem] border px-3 py-3 transition-all duration-300",
                      toneClass,
                      item.muted ? "opacity-55" : "",
                      active ? "translate-y-[-3px]" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="break-words text-lg font-semibold">
                        {item.label}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                        {index}
                      </span>
                    </div>
                    {item.sublabel ? (
                      <p className="mt-2 text-xs text-slate-300">{item.sublabel}</p>
                    ) : null}
                    {item.tags && item.tags.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => (
                          <span
                            key={`${item.id}-${tag}`}
                            className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] ${chipTone(
                              item.tone ?? (active ? accent : "slate")
                            )}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
