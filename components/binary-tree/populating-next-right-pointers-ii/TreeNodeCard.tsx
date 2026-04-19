import type { ConnectTreeNode } from "./generateTrace";

type BadgeTone = "cyan" | "green" | "purple" | "yellow";

type NodeBadge = {
  label: string;
  tone: BadgeTone;
};

type Props = {
  node: ConnectTreeNode;
  badges: NodeBadge[];
  connected: boolean;
  nextLabel: string;
};

const badgeClasses: Record<BadgeTone, string> = {
  cyan: "border-cyan-400/70 bg-cyan-500/12 text-cyan-100",
  green: "border-emerald-400/70 bg-emerald-500/12 text-emerald-100",
  purple: "border-violet-400/70 bg-violet-500/12 text-violet-100",
  yellow: "border-amber-400/70 bg-amber-500/12 text-amber-100",
};

function getNodeClasses(badges: NodeBadge[], connected: boolean) {
  if (badges.some((badge) => badge.tone === "cyan")) {
    return "border-cyan-400/80 bg-cyan-500/14 text-cyan-50 shadow-[0_0_30px_rgba(34,211,238,0.28)]";
  }

  if (badges.some((badge) => badge.tone === "yellow")) {
    return "border-amber-400/80 bg-amber-500/14 text-amber-50 shadow-[0_0_30px_rgba(251,191,36,0.22)]";
  }

  if (badges.some((badge) => badge.tone === "green")) {
    return "border-emerald-400/80 bg-emerald-500/14 text-emerald-50 shadow-[0_0_30px_rgba(52,211,153,0.22)]";
  }

  if (badges.some((badge) => badge.tone === "purple")) {
    return "border-violet-400/80 bg-violet-500/14 text-violet-50 shadow-[0_0_30px_rgba(167,139,250,0.22)]";
  }

  if (connected) {
    return "border-rose-400/60 bg-rose-500/10 text-slate-50 shadow-[0_0_26px_rgba(251,113,133,0.18)]";
  }

  return "border-slate-700/80 bg-slate-950/80 text-slate-100 shadow-[0_0_22px_rgba(15,23,42,0.45)]";
}

export default function TreeNodeCard({
  node,
  badges,
  connected,
  nextLabel,
}: Props) {
  return (
    <div className="relative flex flex-col items-center gap-2">
      <div className="absolute -top-9 flex flex-wrap items-center justify-center gap-1">
        {badges.map((badge) => (
          <span
            key={`${node.id}-${badge.label}`}
            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${badgeClasses[badge.tone]}`}
          >
            {badge.label}
          </span>
        ))}
      </div>

      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full border text-lg font-semibold transition-all duration-500 ${getNodeClasses(
          badges,
          connected
        )}`}
      >
        {node.value}
      </div>

      <div className="rounded-full border border-slate-800/80 bg-slate-950/80 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.16em] text-slate-400">
        {nextLabel}
      </div>
    </div>
  );
}
