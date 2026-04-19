"use client";

export type CharState =
  | "idle"
  | "left"
  | "right"
  | "match"
  | "mismatch"
  | "center";

interface CharNodeProps {
  ch: string;
  index: number;
  state: CharState;
  muted?: boolean;
}

const stateStyles: Record<CharState, string> = {
  idle:
    "border-slate-700/80 bg-slate-900/80 text-slate-100 shadow-[inset_0_1px_0_rgba(148,163,184,0.08)]",
  left:
    "border-cyan-400/80 bg-cyan-500/12 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.24)]",
  right:
    "border-amber-400/80 bg-amber-500/12 text-amber-100 shadow-[0_0_24px_rgba(251,191,36,0.2)]",
  match:
    "border-emerald-400/80 bg-emerald-500/14 text-emerald-100 shadow-[0_0_24px_rgba(52,211,153,0.24)]",
  mismatch:
    "border-rose-400/80 bg-rose-500/14 text-rose-100 shadow-[0_0_28px_rgba(251,113,133,0.26)]",
  center:
    "border-sky-300/80 bg-sky-400/12 text-sky-100 shadow-[0_0_22px_rgba(125,211,252,0.22)]",
};

export default function CharNode({
  ch,
  index,
  state,
  muted = false,
}: CharNodeProps) {
  return (
    <div
      className={[
        "relative flex h-16 w-12 shrink-0 items-center justify-center rounded-[1.15rem]",
        "border text-lg font-semibold uppercase tracking-[0.12em] transition-all duration-500",
        "font-mono backdrop-blur-sm",
        stateStyles[state],
        muted ? "scale-[0.98] opacity-55" : "scale-100 opacity-100",
      ].join(" ")}
    >
      <span className="absolute -top-2 rounded-full border border-slate-700/80 bg-[#09101f] px-2 py-0.5 text-[10px] text-slate-400">
        {index}
      </span>
      <span>{ch}</span>
    </div>
  );
}
