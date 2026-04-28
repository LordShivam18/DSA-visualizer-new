"use client";

import { useEffect, useState } from "react";

const demoFrames = [
  {
    read: 0,
    write: 0,
    active: 0,
    prompt: "What should happen next?",
    explanation: "3 matches the target, so we skip it and keep write where it is.",
    feedbackTone: "amber",
    feedbackLabel: "Mistake detection",
    feedbackCopy: "Copying 3 forward would keep a value we are trying to remove.",
    kept: [],
  },
  {
    read: 1,
    write: 0,
    active: 1,
    prompt: "Predict the next step.",
    explanation: "2 is safe to keep, so we copy it into the front of the array.",
    feedbackTone: "emerald",
    feedbackLabel: "Prediction mode",
    feedbackCopy: "Correct. A kept value should grow the answer prefix immediately.",
    kept: [2],
  },
  {
    read: 2,
    write: 1,
    active: 2,
    prompt: "What should happen next?",
    explanation: "The second 2 is also kept, so the write pointer advances again.",
    feedbackTone: "emerald",
    feedbackLabel: "Reasoning",
    feedbackCopy: "The same rule still holds: non-target values belong in the compacted prefix.",
    kept: [2, 2],
  },
];

function toneClassName(tone: string) {
  if (tone === "amber") {
    return "border-amber-200 bg-amber-50 text-amber-900";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-900";
}

export default function LandingArrayPointerDemo() {
  const [frameIndex, setFrameIndex] = useState(0);
  const frame = demoFrames[frameIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFrameIndex((current) => (current + 1) % demoFrames.length);
    }, 2200);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
      <div className="rounded-[1.6rem] border border-slate-200 bg-white/92 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Live demo
            </p>
            <h3 className="mt-2 text-2xl font-semibold text-slate-950">
              Remove Element
            </h3>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-medium text-slate-600">
            read {frame.read} - write {frame.write}
          </div>
        </div>

        <div className="mt-5 rounded-[1.4rem] border border-slate-200 bg-slate-50/80 p-4">
          <div className="grid grid-cols-4 gap-3">
            {[3, 2, 2, 3].map((value, index) => {
              const isActive = index === frame.active;
              const isKept = frame.kept.includes(value) && index <= frame.active;

              return (
                <div
                  key={`${value}-${index}`}
                  className={`rounded-[1.2rem] border px-3 py-4 text-center transition-all duration-500 ${
                    isActive
                      ? "border-cyan-300 bg-cyan-50 shadow-[0_12px_30px_rgba(34,211,238,0.16)]"
                      : isKept
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {index}
                  </div>
                  <div className="mt-2 text-2xl font-semibold text-slate-950">
                    {value}
                  </div>
                  <div className="mt-3 flex justify-center gap-1">
                    {index === frame.read ? (
                      <span className="rounded-full bg-cyan-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                        read
                      </span>
                    ) : null}
                    {index === frame.write ? (
                      <span className="rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                        write
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-4 rounded-[1.2rem] border border-cyan-200 bg-cyan-50/80 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
            {frame.prompt}
          </p>
          <p className="mt-2 text-sm leading-7 text-slate-800">{frame.explanation}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="rounded-[1.4rem] border border-slate-200 bg-white/88 p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Watch how the algorithm thinks.
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-700">
            Every move is framed as a question, a reason, and a visible state
            change instead of a hidden line of code.
          </p>
        </div>

        <div
          className={`rounded-[1.4rem] border p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${toneClassName(
            frame.feedbackTone
          )}`}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-75">
            {frame.feedbackLabel}
          </p>
          <p className="mt-3 text-sm leading-7">{frame.feedbackCopy}</p>
        </div>
      </div>
    </div>
  );
}
