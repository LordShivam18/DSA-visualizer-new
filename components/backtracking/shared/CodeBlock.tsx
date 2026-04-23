type Props = {
  codeLines: string[];
  activeLines: number[];
};

export default function CodeBlock({ codeLines, activeLines }: Props) {
  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-[#050916] p-4 font-mono text-[12px] leading-6 text-slate-300">
      {codeLines.map((line, index) => {
        const lineNumber = index + 1;
        const active = activeLines.includes(lineNumber);

        return (
          <div
            key={lineNumber}
            className={[
              "flex gap-4 rounded-lg px-3 py-0.5 transition-all duration-300",
              active
                ? "border border-amber-400/30 bg-amber-500/10 text-slate-50 shadow-[0_0_18px_rgba(251,191,36,0.16)]"
                : "border border-transparent",
            ].join(" ")}
          >
            <span className="w-5 shrink-0 text-right text-slate-500">
              {lineNumber}
            </span>
            <span className="whitespace-pre">{line || " "}</span>
          </div>
        );
      })}
    </div>
  );
}
