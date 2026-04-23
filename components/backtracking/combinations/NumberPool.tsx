type Props = {
  n: number;
  path: number[];
  start: number | null;
  candidate: number | null;
};

export default function NumberPool({ n, path, start, candidate }: Props) {
  const chosenSet = new Set(path);

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
        Number Pool
      </p>

      {n === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          Enter a positive n to build the source range.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-4 gap-3 md:grid-cols-5 lg:grid-cols-6">
          {Array.from({ length: n }, (_, index) => index + 1).map((value) => {
            const isChosen = chosenSet.has(value);
            const isCandidate = candidate === value;
            const isAvailable = start !== null && value >= start && !isChosen;

            return (
              <div
                key={value}
                className={`flex h-16 items-center justify-center rounded-2xl border text-xl font-semibold transition-all duration-300 ${
                  isCandidate
                    ? "border-yellow-400/65 bg-yellow-500/12 text-yellow-50 shadow-[0_0_22px_rgba(250,204,21,0.16)]"
                    : isChosen
                    ? "border-emerald-400/55 bg-emerald-500/12 text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.16)]"
                    : isAvailable
                    ? "border-violet-400/45 bg-violet-500/10 text-violet-100"
                    : "border-slate-800/80 bg-slate-950/70 text-slate-500"
                }`}
              >
                {value}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
