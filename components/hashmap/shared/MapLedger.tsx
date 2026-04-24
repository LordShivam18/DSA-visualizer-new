import { cardTone, chipTone } from "./tone";
import type { AccentTone, VisualEntry } from "./types";

type Props = {
  label: string;
  entries: VisualEntry[];
  activeEntryId: string | null;
  focusKey: string | null;
  focusValue: string | null;
  accent?: AccentTone;
  emptyLabel: string;
};

export default function MapLedger({
  label,
  entries,
  activeEntryId,
  focusKey,
  focusValue,
  accent = "cyan",
  emptyLabel,
}: Props) {
  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          {label}
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          {focusKey ? (
            <span className={`rounded-full border px-3 py-1 ${chipTone("yellow")}`}>
              key = {focusKey}
            </span>
          ) : null}
          {focusValue ? (
            <span className={`rounded-full border px-3 py-1 ${chipTone("purple")}`}>
              value = {focusValue}
            </span>
          ) : null}
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {entries.map((entry) => {
            const tone = entry.tone ?? "slate";
            const isActive = activeEntryId === entry.id;

            return (
              <div
                key={entry.id}
                className={[
                  "rounded-[1rem] border p-4 transition-all duration-300",
                  cardTone(isActive ? accent : tone),
                  isActive ? "translate-y-[-2px] scale-[1.01]" : "",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {entry.key}
                  </span>
                  <span className={`rounded-full border px-2.5 py-1 text-[10px] ${chipTone(tone)}`}>
                    bucket
                  </span>
                </div>
                <p className="mt-3 break-words font-mono text-lg text-slate-50">
                  {entry.value}
                </p>
                {entry.note ? (
                  <p className="mt-2 text-xs leading-5 text-slate-300">
                    {entry.note}
                  </p>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
