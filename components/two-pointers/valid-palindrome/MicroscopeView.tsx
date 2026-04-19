"use client";

import { ValidPalindromeTraceStep } from "./generateTrace";

interface MicroscopeViewProps {
  step: ValidPalindromeTraceStep;
  mode: "beginner" | "expert";
}

function formatIndex(index: number | null) {
  return index === null ? "none" : index.toString();
}

function formatChar(value: string | null) {
  return value === null ? "n/a" : `'${value}'`;
}

export default function MicroscopeView({
  step,
  mode,
}: MicroscopeViewProps) {
  const pair = step.comparedPair;
  const pairStatus =
    pair.matches === null
      ? "Waiting for the first comparison"
      : pair.matches
      ? "Symmetric pair matched"
      : "Asymmetry detected";

  return (
    <div className="glass-card h-full p-5">
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-cyan-400" />
        <div>
          <h2 className="text-lg font-semibold text-slate-50">Microscope View</h2>
          <p className="text-sm text-slate-400">
            Zoom in on the pair the algorithm is reasoning about right now.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Left</p>
          <p className="mt-2 text-2xl font-semibold text-cyan-200">
            {formatIndex(step.leftIndex)}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            char ={" "}
            <span className="font-mono text-slate-200">
              {formatChar(pair.leftChar)}
            </span>
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Pair</p>
          <p className="mt-2 text-base font-semibold text-slate-100">
            {pairStatus}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Iteration{" "}
            <span className="font-mono text-slate-200">{step.iteration}</span>
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-slate-800/80 bg-slate-950/55 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Right</p>
          <p className="mt-2 text-2xl font-semibold text-amber-200">
            {formatIndex(step.rightIndex)}
          </p>
          <p className="mt-1 text-sm text-slate-400">
            char ={" "}
            <span className="font-mono text-slate-200">
              {formatChar(pair.rightChar)}
            </span>
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-[1.15rem] border border-slate-800/80 bg-gradient-to-br from-slate-950/70 via-[#06111d] to-slate-950/65 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          {mode === "beginner" ? "Learning Lens" : "Invariant"}
        </p>
        <p className="mt-2 text-sm leading-7 text-slate-200">
          {mode === "beginner"
            ? "A palindrome stays valid only if the outside characters agree first. Once they match, the middle substring becomes the next smaller version of the same problem."
            : "Maintain the invariant that every matched pair outside the current [left, right] window is already symmetric. The algorithm only needs to validate the remaining window."}
        </p>
      </div>
    </div>
  );
}
