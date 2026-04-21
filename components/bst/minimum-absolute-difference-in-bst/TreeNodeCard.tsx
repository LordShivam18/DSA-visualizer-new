type Badge = {
  label: string;
  className: string;
};

type Props = {
  x: number;
  y: number;
  value: number;
  toneClass: string;
  badges?: Badge[];
  caption?: string | null;
  dimmed?: boolean;
};

export default function TreeNodeCard({
  x,
  y,
  value,
  toneClass,
  badges = [],
  caption = null,
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
        <div className="absolute -top-9 flex max-w-[170px] flex-wrap items-center justify-center gap-1">
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

        {caption ? (
          <div className="rounded-full border border-slate-700/80 bg-slate-950/80 px-2.5 py-0.5 text-[11px] uppercase tracking-[0.16em] text-slate-300">
            {caption}
          </div>
        ) : null}
      </div>
    </div>
  );
}
