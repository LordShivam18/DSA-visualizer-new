type Props = {
  x: number;
  y: number;
  label: string;
  toneClass: string;
  badges: string[];
};

export default function VariableNode({
  x,
  y,
  label,
  toneClass,
  badges,
}: Props) {
  return (
    <div
      className="absolute"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      <div
        className={`relative flex h-24 w-24 flex-col items-center justify-center rounded-full border text-center transition-all duration-300 ${toneClass}`}
      >
        <span className="font-mono text-2xl font-semibold">{label}</span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.22em] text-slate-400">
          variable
        </span>
        <div className="absolute -bottom-2 flex flex-wrap justify-center gap-1">
          {badges.slice(0, 2).map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-white/10 bg-slate-950/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-100"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
