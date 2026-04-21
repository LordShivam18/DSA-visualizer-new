import { formatList, type MergeKToken } from "./generateTrace";

type Props = {
  title: string;
  lists: MergeKToken[][];
  activePairIndex: number | null;
  carryListIndex: number | null;
  roundLabel: string;
};

export default function RoundBracket({
  title,
  lists,
  activePairIndex,
  carryListIndex,
  roundLabel,
}: Props) {
  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{title}</p>
        <span className="rounded-full border border-slate-700/70 bg-slate-950/75 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">
          {roundLabel}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        {lists.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
            No lists in this bracket yet.
          </div>
        ) : (
          lists.map((list, index) => {
            const pairIndex = Math.floor(index / 2);
            const isActive = activePairIndex === pairIndex && carryListIndex === null;
            const isCarry = carryListIndex === index;

            return (
              <div
                key={`${title}-${index}`}
                className={`rounded-xl border px-3 py-3 ${
                  isCarry
                    ? "border-yellow-400/40 bg-yellow-500/10 text-yellow-100"
                    : isActive
                    ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-100"
                    : "border-slate-800/80 bg-slate-950/70 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">List {index + 1}</span>
                  <span className="font-mono text-sm">{formatList(list)}</span>
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  {isCarry ? "carried forward" : `pair ${pairIndex + 1}`}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
