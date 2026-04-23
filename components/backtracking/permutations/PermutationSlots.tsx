type Props = {
  nums: number[];
  path: number[];
  used: boolean[];
  candidateIndex: number | null;
};

export default function PermutationSlots({
  nums,
  path,
  used,
  candidateIndex,
}: Props) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-[1.2rem] border border-slate-800/80 bg-[#050916] p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          Permutation Slots
        </p>
        <div className="mt-4 flex min-h-[112px] flex-wrap gap-3 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/70 p-4">
          {Array.from({ length: Math.max(nums.length, 1) }, (_, index) => {
            const value = path[index];
            const isFilled = value !== undefined;
            return (
              <div
                key={`perm-slot-${index}`}
                className={`flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl font-semibold transition-all duration-300 ${
                  isFilled
                    ? "border-emerald-400/55 bg-emerald-500/12 text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.16)]"
                    : "border-slate-800/80 bg-slate-950 text-slate-600"
                }`}
              >
                {isFilled ? value : "_"}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          Number Pool
        </p>
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {nums.map((value, index) => {
            const isCandidate = candidateIndex === index;
            const isUsed = used[index];

            return (
              <div
                key={`${value}-${index}`}
                className={`rounded-2xl border px-3 py-4 text-center transition-all duration-300 ${
                  isCandidate
                    ? "border-yellow-400/65 bg-yellow-500/12 text-yellow-50 shadow-[0_0_22px_rgba(250,204,21,0.16)]"
                    : isUsed
                    ? "border-emerald-400/55 bg-emerald-500/12 text-emerald-50 shadow-[0_0_22px_rgba(52,211,153,0.16)]"
                    : "border-violet-400/45 bg-violet-500/10 text-violet-100"
                }`}
              >
                <div className="text-xl font-semibold">{value}</div>
                <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-current/70">
                  {isUsed ? "used" : "free"}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
