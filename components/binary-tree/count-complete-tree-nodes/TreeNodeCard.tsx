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
  countLabel?: number | null;
  dimmed?: boolean;
};

export default function TreeNodeCard({
  x,
  y,
  value,
  toneClass,
  badges,
  countLabel = null,
  dimmed = false,
}: Props) {
  return (
    <div
      className={[
        "absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500",
        dimmed ? "opacity-45" : "opacity-100",
      ].join(" ")}
      style={{ left: x, top: y }}
    >
      <div className="relative flex flex-col items-center gap-2">
        <div className="absolute -top-9 flex max-w-[140px] flex-wrap items-center justify-center gap-1">
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

        {countLabel !== null ? (
          <div className="rounded-full border border-emerald-400/35 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.18)]">
            cnt {countLabel}
          </div>
        ) : null}
      </div>
    </div>
  );
}
