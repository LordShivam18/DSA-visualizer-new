import type { AccentTone } from "./types";

const chipToneMap: Record<AccentTone, string> = {
  slate: "border-slate-700/80 bg-slate-950/70 text-slate-300",
  cyan: "border-cyan-400/35 bg-cyan-500/10 text-cyan-100 shadow-[0_0_20px_rgba(34,211,238,0.14)]",
  emerald:
    "border-emerald-400/35 bg-emerald-500/10 text-emerald-100 shadow-[0_0_20px_rgba(52,211,153,0.14)]",
  yellow:
    "border-yellow-400/35 bg-yellow-500/10 text-yellow-100 shadow-[0_0_20px_rgba(250,204,21,0.14)]",
  purple:
    "border-violet-400/35 bg-violet-500/10 text-violet-100 shadow-[0_0_20px_rgba(167,139,250,0.14)]",
  rose: "border-rose-400/35 bg-rose-500/10 text-rose-100 shadow-[0_0_20px_rgba(251,113,133,0.14)]",
};

const cardToneMap: Record<AccentTone, string> = {
  slate: "border-slate-800/80 bg-slate-950/65 text-slate-200",
  cyan: "border-cyan-400/55 bg-cyan-500/14 text-cyan-50 shadow-[0_0_28px_rgba(34,211,238,0.16)]",
  emerald:
    "border-emerald-400/55 bg-emerald-500/14 text-emerald-50 shadow-[0_0_28px_rgba(52,211,153,0.16)]",
  yellow:
    "border-yellow-400/55 bg-yellow-500/14 text-yellow-50 shadow-[0_0_28px_rgba(250,204,21,0.16)]",
  purple:
    "border-violet-400/55 bg-violet-500/14 text-violet-50 shadow-[0_0_28px_rgba(167,139,250,0.16)]",
  rose: "border-rose-400/55 bg-rose-500/14 text-rose-50 shadow-[0_0_28px_rgba(251,113,133,0.16)]",
};

const barToneMap: Record<AccentTone, string> = {
  slate: "from-slate-600 via-slate-500 to-slate-400",
  cyan: "from-cyan-500 via-sky-300 to-cyan-200",
  emerald: "from-emerald-500 via-lime-300 to-emerald-200",
  yellow: "from-yellow-500 via-amber-300 to-yellow-200",
  purple: "from-violet-500 via-fuchsia-300 to-violet-200",
  rose: "from-rose-500 via-orange-300 to-rose-200",
};

export function chipTone(tone: AccentTone = "slate") {
  return chipToneMap[tone];
}

export function cardTone(tone: AccentTone = "slate") {
  return cardToneMap[tone];
}

export function barTone(tone: AccentTone = "emerald") {
  return barToneMap[tone];
}

export function difficultyTone(difficulty: "easy" | "medium" | "hard") {
  if (difficulty === "easy") {
    return "border-emerald-400/30 bg-emerald-500/10 text-emerald-200";
  }

  if (difficulty === "medium") {
    return "border-yellow-400/30 bg-yellow-500/10 text-yellow-200";
  }

  return "border-rose-400/30 bg-rose-500/10 text-rose-200";
}
