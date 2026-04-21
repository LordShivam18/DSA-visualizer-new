type Badge = {
  label: string;
  className: string;
};

type Props = {
  x: number;
  y: number;
  value: number;
  toneClass: string;
  rangeLabel: string;
  badges: Badge[];
};

export default function BSTNodeCard({
  x,
  y,
  value,
  toneClass,
  rangeLabel,
  badges,
}: Props) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
    >
      <div
        className={`min-w-[96px] rounded-[1.25rem] border px-3 py-3 text-center transition-all duration-300 ${toneClass}`}
      >
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
          {rangeLabel}
        </div>
        <div className="mt-1 text-2xl font-semibold">{value}</div>
        <div className="mt-2 flex min-h-5 flex-wrap justify-center gap-1">
          {badges.map((badge) => (
            <span
              key={badge.label}
              className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${badge.className}`}
            >
              {badge.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
