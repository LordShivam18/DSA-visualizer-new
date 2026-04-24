import type { IntegerToRomanTraceStep } from "./generateTrace";

const BOARD = [
  { value: 1000, symbol: "M" },
  { value: 900, symbol: "CM" },
  { value: 500, symbol: "D" },
  { value: 400, symbol: "CD" },
  { value: 100, symbol: "C" },
  { value: 90, symbol: "XC" },
  { value: 50, symbol: "L" },
  { value: 40, symbol: "XL" },
  { value: 10, symbol: "X" },
  { value: 9, symbol: "IX" },
  { value: 5, symbol: "V" },
  { value: 4, symbol: "IV" },
  { value: 1, symbol: "I" },
];

export default function DenominationBoard({
  step,
}: {
  step: IntegerToRomanTraceStep;
}) {
  const activeIndex = step.pointers.denominationIndex;

  return (
    <div className="rounded-[1.25rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
          Denomination Board
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Cyan marks the denomination being tested. Green marks denominations
          that fit into the current remainder.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {BOARD.map((entry, index) => {
          let tone =
            "border-slate-700/80 bg-slate-950/70 text-slate-100 shadow-[0_0_18px_rgba(15,23,42,0.4)]";

          if (step.state.remaining >= entry.value) {
            tone =
              "border-emerald-400/40 bg-emerald-500/10 text-emerald-50 shadow-[0_0_24px_rgba(52,211,153,0.18)]";
          }
          if (activeIndex === index) {
            tone =
              "border-cyan-400/65 bg-cyan-500/12 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.22)]";
          }

          return (
            <div
              key={`${entry.symbol}-${entry.value}`}
              className={`rounded-[1rem] border px-4 py-3 transition-all ${tone}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xl font-semibold">{entry.symbol}</span>
                <span className="font-mono text-sm opacity-75">{entry.value}</span>
              </div>
              <p className="mt-2 text-xs uppercase tracking-[0.16em] opacity-75">
                slot {index}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
