import type { Project } from "./generateTrace";

type Props = {
  project: Project;
  tone: "locked" | "heap" | "selected" | "current" | "idle";
  label: string;
};

const toneStyles = {
  locked:
    "border-rose-400/30 bg-rose-500/10 text-rose-100 shadow-[0_0_18px_rgba(251,113,133,0.12)]",
  heap: "border-violet-400/35 bg-violet-500/10 text-violet-100 shadow-[0_0_18px_rgba(167,139,250,0.12)]",
  selected:
    "border-emerald-400/35 bg-emerald-500/10 text-emerald-100 shadow-[0_0_18px_rgba(52,211,153,0.12)]",
  current:
    "border-cyan-400/35 bg-cyan-500/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]",
  idle: "border-slate-800/80 bg-slate-950/70 text-slate-200",
} as const;

export default function ProjectCard({ project, tone, label }: Props) {
  return (
    <div
      className={`rounded-[1rem] border px-3 py-3 transition-all duration-300 ${toneStyles[tone]}`}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
          Project {project.id}
        </span>
        <span className="rounded-full border border-slate-700/60 bg-slate-950/50 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-slate-300">
          {label}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
            Capital
          </p>
          <p className="mt-1 text-lg font-semibold">{project.capital}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
            Profit
          </p>
          <p className="mt-1 text-lg font-semibold">{project.profit}</p>
        </div>
      </div>
    </div>
  );
}
