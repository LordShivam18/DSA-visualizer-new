type Props = {
  title: string;
  items: string[];
  activeItem?: string | null;
  emptyLabel: string;
  tone?: "emerald" | "violet" | "cyan";
};

const toneMap: Record<NonNullable<Props["tone"]>, string> = {
  emerald: "border-emerald-400/35 bg-emerald-500/10 text-emerald-100",
  violet: "border-violet-400/35 bg-violet-500/10 text-violet-100",
  cyan: "border-cyan-400/35 bg-cyan-500/10 text-cyan-100",
};

export default function ResultCloud({
  title,
  items,
  activeItem,
  emptyLabel,
  tone = "emerald",
}: Props) {
  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
        {title}
      </p>

      {items.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {items.map((item) => {
            const isActive = activeItem === item;
            return (
              <span
                key={item}
                className={`rounded-full border px-3 py-1.5 font-mono text-xs transition-all duration-300 ${
                  isActive
                    ? "border-yellow-400/45 bg-yellow-500/10 text-yellow-100 shadow-[0_0_20px_rgba(250,204,21,0.14)]"
                    : toneMap[tone]
                }`}
              >
                {item}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
