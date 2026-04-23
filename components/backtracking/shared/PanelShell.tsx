import type { ReactNode } from "react";

type Accent = "cyan" | "violet" | "emerald" | "amber" | "rose" | "yellow";

const accentClassMap: Record<Accent, string> = {
  cyan: "bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.6)]",
  violet: "bg-violet-400 shadow-[0_0_18px_rgba(167,139,250,0.6)]",
  emerald: "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.6)]",
  amber: "bg-amber-400 shadow-[0_0_18px_rgba(251,191,36,0.6)]",
  rose: "bg-rose-400 shadow-[0_0_18px_rgba(251,113,133,0.6)]",
  yellow: "bg-yellow-400 shadow-[0_0_18px_rgba(250,204,21,0.6)]",
};

type Props = {
  title: string;
  subtitle: string;
  accent?: Accent;
  children: ReactNode;
};

export default function PanelShell({
  title,
  subtitle,
  accent = "cyan",
  children,
}: Props) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-3">
        <span className={`h-4 w-1.5 rounded-full ${accentClassMap[accent]}`} />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}
