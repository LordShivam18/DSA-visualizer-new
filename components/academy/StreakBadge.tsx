"use client";

type StreakBadgeTone = "default" | "subtle" | "celebration";

const toneClassName: Record<StreakBadgeTone, string> = {
  default: "border-amber-200 bg-amber-50 text-amber-800",
  subtle: "border-amber-100 bg-white/80 text-amber-700",
  celebration:
    "border-amber-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 text-amber-900",
};

export default function StreakBadge({
  days,
  tone = "default",
  compact = false,
}: {
  days: number;
  tone?: StreakBadgeTone;
  compact?: boolean;
}) {
  const label = `${days} day streak`;

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-semibold shadow-[0_12px_28px_rgba(245,158,11,0.08)] ${toneClassName[tone]} ${
        compact ? "text-xs" : "text-sm"
      }`}
    >
      <span aria-hidden="true">🔥</span>
      <span>{label}</span>
    </div>
  );
}
