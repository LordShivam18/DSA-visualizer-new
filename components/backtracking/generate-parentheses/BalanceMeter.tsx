type Props = {
  openUsed: number;
  closeUsed: number;
  n: number;
};

export default function BalanceMeter({ openUsed, closeUsed, n }: Props) {
  const balance = openUsed - closeUsed;
  const maxBalance = Math.max(n, 1);
  const balanceWidth = Math.round((Math.max(balance, 0) / maxBalance) * 100);

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
        Balance Meter
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800/80 bg-[#050916] px-3 py-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Opens
          </p>
          <p className="mt-1 font-mono text-lg text-cyan-200">{openUsed}</p>
        </div>
        <div className="rounded-xl border border-slate-800/80 bg-[#050916] px-3 py-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Closes
          </p>
          <p className="mt-1 font-mono text-lg text-violet-200">{closeUsed}</p>
        </div>
        <div className="rounded-xl border border-slate-800/80 bg-[#050916] px-3 py-3">
          <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
            Balance
          </p>
          <p className="mt-1 font-mono text-lg text-emerald-200">{balance}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
          <span>unmatched opens</span>
          <span>{balance}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full border border-slate-800 bg-[#050916]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-violet-300 to-emerald-300 shadow-[0_0_22px_rgba(34,211,238,0.18)] transition-all duration-300"
            style={{ width: `${balanceWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}
