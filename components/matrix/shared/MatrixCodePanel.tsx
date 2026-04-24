import type { TeachingTraceFrame } from "./types";
import { matrixPanelClassName } from "./ui";

export default function MatrixCodePanel({
  step,
  lines,
  title = "Code Panel",
  caption = "Highlighted lines are responsible for the current state transition.",
  complexity,
}: {
  step: TeachingTraceFrame;
  lines: string[];
  title?: string;
  caption?: string;
  complexity: string[];
}) {
  return (
    <div className={`${matrixPanelClassName} p-5`}>
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-[#6487a2]" />
        <div>
          <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
          <p className="text-sm text-stone-500">{caption}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 text-xs">
        {complexity.map((item) => (
          <span
            key={item}
            className="rounded-full border border-[#eadcc8] bg-[#fffaf5] px-3 py-1 text-stone-700"
          >
            {item}
          </span>
        ))}
        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-amber-700">
          Active lines: {step.codeLines.join(", ")}
        </span>
      </div>

      <div className="mt-5 rounded-[1.25rem] border border-[#273447] bg-[#16202d] p-4 font-mono text-[12px] leading-6 text-[#dfe8f3]">
        {lines.map((line, index) => {
          const lineNumber = index + 1;
          const active = step.codeLines.includes(lineNumber);

          return (
            <div
              key={lineNumber}
              className={`flex gap-4 rounded-lg px-3 py-0.5 transition-all ${
                active
                  ? "border border-[#d8a55a]/40 bg-[#d8a55a]/12 text-white shadow-[0_0_16px_rgba(216,165,90,0.18)]"
                  : "border border-transparent"
              }`}
            >
              <span className="w-5 shrink-0 text-right text-[#8da0b3]">
                {lineNumber}
              </span>
              <span className="whitespace-pre">{line || " "}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-[1.15rem] border border-[#eadcc8] bg-[#fffaf5] px-4 py-3 text-sm leading-7 text-stone-700">
        <span className="font-semibold text-stone-900">Expert lens:</span>{" "}
        {step.expertNote}
      </div>
    </div>
  );
}
