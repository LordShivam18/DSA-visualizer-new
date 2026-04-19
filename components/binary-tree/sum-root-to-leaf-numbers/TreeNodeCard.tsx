type Badge = {
  label: string;
  className: string;
};

type Props = {
  x: number;
  y: number;
  value: number;
  toneClass: string;
  badges: Badge[];
};

export default function TreeNodeCard({
  x,
  y,
  value,
  toneClass,
  badges,
}: Props) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
      style={{ left: x, top: y }}
    >
      <div className="relative flex flex-col items-center gap-2">
        <div className="absolute -top-9 flex flex-wrap items-center justify-center gap-1">
          {badges.map((badge) => (
            <span
              key={`${value}-${badge.label}`}
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${badge.className}`}
            >
              {badge.label}
            </span>
          ))}
        </div>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-full border text-lg font-semibold transition-all duration-500 ${toneClass}`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
