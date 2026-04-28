"use client";

type Role =
  | "default"
  | "left"
  | "right"
  | "both"
  | "between"
  | "discarded"
  | "solution";

interface ArrayCellProps {
  value: number;
  role: Role;
}

export default function ArrayCell({ value, role }: ArrayCellProps) {
  const base =
    "w-12 h-16 md:w-14 md:h-18 flex items-center justify-center rounded-2xl font-semibold text-lg transition-all duration-300 border";

  let classes = "";
  switch (role) {
    case "left":
      classes =
        "border-emerald-400/80 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.7)] text-emerald-100 scale-110 -translate-y-1";
      break;
    case "right":
      classes =
        "border-pink-400/80 bg-pink-500/10 shadow-[0_0_20px_rgba(236,72,153,0.7)] text-pink-100 scale-110 -translate-y-1";
      break;
    case "both":
      classes =
        "border-cyan-400/80 bg-cyan-500/10 shadow-[0_0_24px_rgba(34,211,238,0.9)] text-cyan-100 scale-115 -translate-y-1";
      break;
    case "between":
      classes =
        "border-slate-600 bg-slate-900/80 text-slate-100 scale-100 -translate-y-0.5";
      break;
    case "discarded":
      classes =
        "border-slate-800 bg-slate-900/40 text-slate-500 opacity-40 scale-90 translate-y-1";
      break;
    case "solution":
      classes =
        "border-amber-400/80 bg-amber-500/15 shadow-[0_0_26px_rgba(251,191,36,0.9)] text-amber-50 scale-115 -translate-y-1";
      break;
    default:
      classes =
        "border-slate-700 bg-slate-900/70 text-slate-100 opacity-90 scale-95 translate-y-0.5";
  }

  return (
    <div className={`${base} ${classes}`}>
      {value}
    </div>
  );
}
