type Props = {
  path: string[];
  result: number | null;
};

export default function WordPathStrip({ path, result }: Props) {
  return (
    <div className="rounded-[1.2rem] border border-slate-800/80 bg-slate-950/55 p-4">
      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
        Shortest Transformation Chain
      </p>
      {result === null || path.length === 0 ? (
        <div className="mt-4 rounded-xl border border-dashed border-slate-700/80 px-3 py-5 text-sm text-slate-500">
          The winning chain appears when BFS reaches the end word.
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {path.map((word, index) => (
            <div key={`${word}-${index}`} className="flex items-center gap-2">
              <span
                className={`rounded-full border px-3 py-1.5 font-mono text-sm ${
                  index === path.length - 1
                    ? "border-emerald-400/45 bg-emerald-500/10 text-emerald-100"
                    : "border-cyan-400/35 bg-cyan-500/10 text-cyan-100"
                }`}
              >
                {word}
              </span>
              {index < path.length - 1 ? (
                <span className="text-slate-500">-&gt;</span>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
