import type { MergeKToken } from "./generateTrace";

type Props = {
  title: string;
  tokens: MergeKToken[];
  accent: "cyan" | "violet" | "yellow" | "emerald";
  pointerLabels?: Record<string, string[]>;
  emptyLabel: string;
};

const accentStyles = {
  cyan: {
    border: "border-cyan-400/35",
    bg: "bg-cyan-500/10",
    text: "text-cyan-100",
    glow: "shadow-[0_0_24px_rgba(34,211,238,0.12)]",
  },
  violet: {
    border: "border-violet-400/35",
    bg: "bg-violet-500/10",
    text: "text-violet-100",
    glow: "shadow-[0_0_24px_rgba(167,139,250,0.12)]",
  },
  yellow: {
    border: "border-yellow-400/35",
    bg: "bg-yellow-500/10",
    text: "text-yellow-100",
    glow: "shadow-[0_0_24px_rgba(250,204,21,0.12)]",
  },
  emerald: {
    border: "border-emerald-400/35",
    bg: "bg-emerald-500/10",
    text: "text-emerald-100",
    glow: "shadow-[0_0_24px_rgba(52,211,153,0.12)]",
  },
} as const;

export default function KListLane({
  title,
  tokens,
  accent,
  pointerLabels = {},
  emptyLabel,
}: Props) {
  const style = accentStyles[accent];

  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{title}</p>

      {tokens.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-4 text-sm text-slate-500">
          {emptyLabel}
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {tokens.map((token, index) => {
            const labels = pointerLabels[token.id] ?? [];

            return (
              <div key={token.id} className="flex items-center gap-3">
                <div
                  className={`min-w-[82px] rounded-[1.1rem] border px-3 py-3 text-center transition-all duration-300 ${style.border} ${style.bg} ${style.text} ${style.glow}`}
                >
                  <div className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                    src {token.sourceList + 1}
                  </div>
                  <div className="mt-2 text-2xl font-semibold">{token.value}</div>
                  <div className="mt-2 flex min-h-5 flex-wrap justify-center gap-1">
                    {labels.map((label) => (
                      <span
                        key={`${token.id}-${label}`}
                        className="rounded-full border border-slate-700/60 bg-slate-950/75 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-100"
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {index < tokens.length - 1 ? (
                  <svg width="28" height="16" viewBox="0 0 28 16" fill="none">
                    <path
                      d="M2 8H26M26 8L20 3M26 8L20 13"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={style.text}
                    />
                  </svg>
                ) : null}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
