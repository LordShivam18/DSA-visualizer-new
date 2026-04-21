type Badge = {
  label: string;
  className: string;
};

type Props = {
  x: number;
  y: number;
  title: string;
  valueLabel: string;
  toneClass: string;
  badges: Badge[];
};

export default function QuadTreeNodeCard({
  x,
  y,
  title,
  valueLabel,
  toneClass,
  badges,
}: Props) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
    >
      <div
        className={`min-w-[122px] rounded-[1.25rem] border px-3 py-3 text-center transition-all duration-300 ${toneClass}`}
      >
        <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
          {title}
        </div>
        <div className="mt-2 text-sm font-semibold">{valueLabel}</div>
        <div className="mt-2 flex min-h-5 flex-wrap justify-center gap-1">
          {badges.map((badge) => (
            <span
              key={`${title}-${badge.label}`}
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
