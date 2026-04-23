type StackFrame = {
  title: string;
  subtitle: string;
  active?: boolean;
  success?: boolean;
  danger?: boolean;
};

type Props = {
  title: string;
  frames: StackFrame[];
  emptyLabel: string;
};

export default function RecursionStack({ title, frames, emptyLabel }: Props) {
  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
        {title}
      </p>

      {frames.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="mt-4 space-y-2">
          {frames.map((frame, index) => {
            const toneClass = frame.active
              ? "border-cyan-400/45 bg-cyan-500/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]"
              : frame.success
              ? "border-emerald-400/45 bg-emerald-500/10 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]"
              : frame.danger
              ? "border-rose-400/45 bg-rose-500/10 text-rose-100 shadow-[0_0_18px_rgba(251,113,133,0.12)]"
              : "border-slate-800/80 bg-slate-950/70 text-slate-300";

            return (
              <div
                key={`${frame.title}-${index}`}
                className={`rounded-xl border px-3 py-3 ${toneClass}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold">{frame.title}</span>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em]">
                    depth {index}
                  </span>
                </div>
                <p className="mt-2 text-xs text-current/80">{frame.subtitle}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
