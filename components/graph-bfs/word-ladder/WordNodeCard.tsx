type Props = {
  x: number;
  y: number;
  label: string;
  caption: string;
  toneClass: string;
  badges: string[];
};

export default function WordNodeCard({
  x,
  y,
  label,
  caption,
  toneClass,
  badges,
}: Props) {
  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-[1.1rem] border px-4 py-3 text-center transition-all duration-300 ${toneClass}`}
      style={{ left: x, top: y, minWidth: 96 }}
    >
      <div className="flex justify-center gap-1">
        {badges.map((badge) => (
          <span
            key={`${label}-${badge}`}
            className="rounded-full border border-white/10 bg-black/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em]"
          >
            {badge}
          </span>
        ))}
      </div>
      <p className="mt-2 font-mono text-sm font-semibold">{label}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-slate-400">
        {caption}
      </p>
    </div>
  );
}
