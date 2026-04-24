import type { TeachingTraceFrame } from "./types";
import { darkPanelClassName } from "./darkUi";

export default function DarkCodePanel({
  step,
  lines,
  title = "Code Panel",
  caption = "Highlighted lines show the exact part of the solution responsible for this state change.",
  complexity,
}: {
  step: TeachingTraceFrame;
  lines: string[];
  title?: string;
  caption?: string;
  complexity: string[];
}) {
  return (
    <div className={`${darkPanelClassName} p-5`}>
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-violet-400 shadow-[0_0_18px_rgba(167,139,250,0.42)]" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
          <p className="text-sm text-slate-400">{caption}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        {complexity.map((item) => (
          <span
            key={item}
            className="rounded-full border border-slate-700/80 bg-slate-900/80 px-3 py-1 text-slate-300"
          >
            {item}
          </span>
        ))}
        <span className="rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-amber-100">
          Active lines: {step.codeLines.join(", ")}
        </span>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-slate-800/80 bg-slate-950 p-4 font-mono text-[12px] leading-6 text-slate-300">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const active = step.codeLines.includes(lineNumber);

          return (
            <div
              key={lineNumber}
              className={`flex gap-4 rounded-lg px-3 py-0.5 transition-all ${
                active
                  ? "border border-amber-300/30 bg-amber-400/10 text-slate-50 shadow-[0_0_18px_rgba(245,158,11,0.18)]"
                  : "border border-transparent"
              }`}
            >
              <span className="w-5 shrink-0 text-right text-slate-500">
                {lineNumber}
              </span>
              <span className="whitespace-pre">{line || " "}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 px-4 py-3 text-sm leading-7 text-slate-300">
        <span className="font-semibold text-slate-50">Expert lens:</span>{" "}
        {step.expertNote}
      </div>
    </div>
  );
}
