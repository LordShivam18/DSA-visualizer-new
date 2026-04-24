import { cardTone } from "./tone";
import type { AccentTone, LedgerEntry } from "./types";

type Props = {
  label: string;
  entries: LedgerEntry[];
  activeEntryId: string | null;
  accent?: AccentTone;
  emptyLabel: string;
};

export default function FrequencyLedger({
  label,
  entries,
  activeEntryId,
  accent = "emerald",
  emptyLabel,
}: Props) {
  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          {label}
        </p>
        <span className="text-xs text-slate-500">{entries.length} entries</span>
      </div>

      {entries.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`rounded-[1rem] border p-4 transition-all duration-300 ${cardTone(
                activeEntryId === entry.id ? accent : entry.tone ?? "slate"
              )}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                  {entry.key}
                </span>
                {entry.delta ? (
                  <span className="font-mono text-xs text-slate-200">
                    {entry.delta}
                  </span>
                ) : null}
              </div>

              {(entry.need || entry.have) && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                      Need
                    </p>
                    <p className="mt-1 font-mono text-sm text-yellow-100">
                      {entry.need ?? "-"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-800/80 bg-slate-950/60 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                      Have
                    </p>
                    <p className="mt-1 font-mono text-sm text-emerald-100">
                      {entry.have ?? "-"}
                    </p>
                  </div>
                </div>
              )}

              {entry.note ? (
                <p className="mt-3 text-xs leading-5 text-slate-300">{entry.note}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
