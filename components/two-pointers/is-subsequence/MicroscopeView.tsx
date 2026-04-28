"use client";

interface MicroscopeViewProps {
  matchedPrefix: string;
  remaining: string;
  mode: "beginner" | "expert";
}

export default function MicroscopeView({
  matchedPrefix,
  remaining,
  mode,
}: MicroscopeViewProps) {
  return (
    <div className="bg-[#050816] border border-slate-800/80 rounded-2xl p-4 text-sm flex flex-col gap-2">
      <h2 className="font-semibold text-slate-100 flex items-center gap-2">
        <span className="w-1.5 h-4 rounded-full bg-cyan-400" />
        Microscope: inside s
      </h2>
      <div className="mt-1 text-xs text-slate-300 space-y-2 font-mono">
        <p>
          Matched prefix:{" "}
          {matchedPrefix.length === 0 ? (
            <span className="text-slate-500">&quot;&quot;</span>
          ) : (
            <span className="text-emerald-300">&quot;{matchedPrefix}&quot;</span>
          )}
        </p>
        <p>
          Remaining to match:{" "}
          {remaining.length === 0 ? (
            <span className="text-slate-500">&quot;&quot;</span>
          ) : (
            <span className="text-cyan-300">&quot;{remaining}&quot;</span>
          )}
        </p>
      </div>
      <p className="mt-1 text-[11px] text-slate-400">
        {mode === "beginner"
          ? "Think of s as split into two parts: the already matched prefix and the part we are still hunting for in t."
          : "Formally, i is the length of the matched prefix of s. We keep extending it whenever we find a matching character in t."}
      </p>
    </div>
  );
}
