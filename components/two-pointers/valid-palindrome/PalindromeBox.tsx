"use client";

import CharNode, { CharState } from "./CharNode";
import PointerNode from "./PointerNode";
import { ValidPalindromeTraceStep } from "./generateTrace";

interface PalindromeBoxProps {
  step: ValidPalindromeTraceStep;
}

function getCharState(step: ValidPalindromeTraceStep, index: number): CharState {
  const isLeft = step.leftIndex === index;
  const isRight = step.rightIndex === index;
  const isMismatch = step.mismatchIndices.includes(index);
  const isMatched = step.matchedIndices.includes(index);

  if (isMismatch) {
    return "mismatch";
  }

  if (isLeft && isRight) {
    return step.phase === "done" ? "center" : "left";
  }

  if (isLeft) {
    return "left";
  }

  if (isRight) {
    return "right";
  }

  if (isMatched) {
    return "match";
  }

  return "idle";
}

export default function PalindromeBox({ step }: PalindromeBoxProps) {
  const chars = step.cleaned.split("");

  return (
    <section className="glass-card relative w-full max-w-5xl overflow-hidden p-6">
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
      <div className="absolute -top-20 left-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="absolute -bottom-20 right-6 h-44 w-44 rounded-full bg-amber-400/10 blur-3xl" />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
            Normalized Buffer
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-50">
            Cleaned string ready for two pointers
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            The algorithm compares only lowercase letters and digits, so the
            visualization shows the exact string the code is scanning.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Length:{" "}
            <span className="font-mono text-slate-50">{step.cleaned.length}</span>
          </span>
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Matched:{" "}
            <span className="font-mono text-emerald-300">
              {step.matchedIndices.length}
            </span>
          </span>
          <span className="rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-slate-300">
            Status:{" "}
            <span className="font-medium text-cyan-200">{step.statusLabel}</span>
          </span>
        </div>
      </div>

      <div className="relative mt-8 overflow-x-auto pb-1">
        {chars.length === 0 ? (
          <div className="rounded-[1.5rem] border border-dashed border-slate-700/80 bg-slate-950/50 px-6 py-10 text-center text-sm text-slate-400">
            No characters survive normalization, so the scan finishes
            immediately with a palindrome result.
          </div>
        ) : (
          <div className="inline-flex min-w-full flex-col items-center gap-3">
            <div className="grid auto-cols-[3rem] grid-flow-col gap-3">
              {chars.map((_, index) => (
                <div key={`top-${index}`} className="flex h-14 w-12 justify-center">
                  {step.leftIndex === index ? (
                    <PointerNode label="L" accent="left" dock="top" />
                  ) : null}
                </div>
              ))}
            </div>

            <div className="grid auto-cols-[3rem] grid-flow-col gap-3">
              {chars.map((char, index) => {
                const left = step.leftIndex;
                const right = step.rightIndex;
                const hasWindow =
                  left !== null &&
                  right !== null &&
                  left <= right &&
                  index >= left &&
                  index <= right;

                return (
                  <CharNode
                    key={`char-${index}`}
                    ch={char}
                    index={index}
                    state={getCharState(step, index)}
                    muted={step.phase !== "done" && !hasWindow && !step.matchedIndices.includes(index)}
                  />
                );
              })}
            </div>

            <div className="grid auto-cols-[3rem] grid-flow-col gap-3">
              {chars.map((_, index) => (
                <div
                  key={`bottom-${index}`}
                  className="flex h-14 w-12 items-end justify-center"
                >
                  {step.rightIndex === index ? (
                    <PointerNode label="R" accent="right" dock="bottom" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="relative mt-6 rounded-[1.25rem] border border-slate-800/80 bg-slate-950/50 px-4 py-3 text-sm text-slate-300">
        <span className="text-slate-500">cleaned = </span>
        <span className="font-mono text-cyan-200">
          {step.cleaned.length === 0 ? "\"\"" : `"${step.cleaned}"`}
        </span>
      </div>
    </section>
  );
}
