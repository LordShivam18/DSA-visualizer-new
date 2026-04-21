import { formatDirection, formatSlotArray, type ZigzagDirection } from "./generateTrace";

type Props = {
  slots: Array<number | null>;
  writeIndex: number | null;
  direction: ZigzagDirection;
};

export default function ZigzagSlots({ slots, writeIndex, direction }: Props) {
  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <h3 className="text-sm font-semibold text-slate-100">
          Zigzag Output Slots
        </h3>
        <span className="rounded-full border border-yellow-400/30 bg-yellow-500/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-yellow-100">
          {formatDirection(direction)}
        </span>
      </div>

      <p className="mt-2 text-xs leading-6 text-slate-400">
        The queue pops normally, but each value is written into the slot dictated by this level&apos;s direction.
      </p>

      {slots.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          Waiting for the next level to start.
        </div>
      ) : (
        <>
          <div className="mt-4 flex flex-wrap gap-2">
            {slots.map((value, index) => {
              const active = writeIndex === index;
              const filled = value !== null;

              return (
                <div
                  key={`zigzag-slot-${index}`}
                  className={[
                    "flex h-16 w-16 flex-col items-center justify-center rounded-xl border transition-all duration-300",
                    active
                      ? "border-yellow-400/70 bg-yellow-500/14 text-yellow-50 shadow-[0_0_24px_rgba(250,204,21,0.22)]"
                      : filled
                      ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-50"
                      : "border-dashed border-slate-700/80 bg-slate-950/50 text-slate-500",
                  ].join(" ")}
                >
                  <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    {index}
                  </span>
                  <span className="font-mono text-lg font-semibold">
                    {value ?? "-"}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 rounded-xl border border-slate-800/80 bg-slate-950/80 px-3 py-2 font-mono text-sm text-cyan-200">
            {formatSlotArray(slots)}
          </div>
        </>
      )}
    </div>
  );
}
