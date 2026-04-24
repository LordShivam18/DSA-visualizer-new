import { cardTone, chipTone } from "./tone";
import type { AccentTone, VisualToken } from "./types";

type Props = {
  label: string;
  items: VisualToken[];
  activeIndex: number | null;
  fallback: string;
  accent?: AccentTone;
};

export default function TokenLane({
  label,
  items,
  activeIndex,
  fallback,
  accent = "cyan",
}: Props) {
  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          {label}
        </p>
        <span className={`rounded-full border px-3 py-1 text-xs ${chipTone(accent)}`}>
          {items.length} item{items.length === 1 ? "" : "s"}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          {fallback}
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-3">
          {items.map((item, index) => {
            const tone = item.tone ?? "slate";
            const isActive = activeIndex === index;

            return (
              <div
                key={item.id}
                className={[
                  "min-w-[84px] rounded-[1rem] border px-3 py-3 transition-all duration-300",
                  cardTone(isActive ? accent : tone),
                  item.muted ? "opacity-55" : "",
                  isActive ? "translate-y-[-2px] scale-[1.02]" : "",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-xl font-semibold">{item.label}</span>
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
                          tone
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
      )}
    </div>
  );
}
