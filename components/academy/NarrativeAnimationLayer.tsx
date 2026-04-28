"use client";

import { useEffect, useState } from "react";

import { lightPanelClassName } from "../array-string/shared/ui";

type NarrativeBeat = {
  id: string;
  label: string;
  detail: string;
};

function describeAnimation(animation: {
  type?: string;
  targets?: string[];
} | null) {
  if (!animation?.type) {
    return "Watch the state update settle before you advance.";
  }

  const targetCount = animation.targets?.length ?? 0;
  const targetLabel =
    targetCount === 0
      ? "the active state"
      : `${targetCount} visual target${targetCount === 1 ? "" : "s"}`;

  return `The trace now animates a ${animation.type} transition across ${targetLabel}.`;
}

export default function NarrativeAnimationLayer({
  stepKey,
  focus,
  explanation,
  animation,
}: {
  stepKey: string;
  focus: string;
  explanation: string;
  animation: {
    type?: string;
    targets?: string[];
  } | null;
}) {
  const [phase, setPhase] = useState(0);
  const beats: NarrativeBeat[] = [
    {
      id: "focus",
      label: "Focus",
      detail: focus,
    },
    {
      id: "explain",
      label: "Explain",
      detail: explanation,
    },
    {
      id: "animate",
      label: "Animate",
      detail: describeAnimation(animation),
    },
  ];

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setPhase(1), 420),
      window.setTimeout(() => setPhase(2), 1120),
    ];

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [stepKey]);

  return (
    <section className={`${lightPanelClassName} p-5`}>
      <div className="flex items-center gap-3">
        <span className="h-4 w-1.5 rounded-full bg-violet-400" />
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
            Narrative Flow
          </p>
          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            Focus, explain, then animate
          </h2>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {beats.map((beat, index) => {
          const state =
            index < phase ? "complete" : index === phase ? "active" : "upcoming";
          const toneClassName =
            state === "active"
              ? "border-violet-200 bg-violet-50 shadow-[0_14px_32px_rgba(139,92,246,0.12)]"
              : state === "complete"
              ? "border-emerald-200 bg-emerald-50"
              : "border-slate-200 bg-slate-50/70";

          return (
            <div
              key={beat.id}
              className={`rounded-[1.1rem] border px-4 py-4 transition-all duration-500 ${toneClassName}`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  {beat.label}
                </p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${
                    state === "active"
                      ? "bg-violet-100 text-violet-700"
                      : state === "complete"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-white text-slate-500"
                  }`}
                >
                  {state}
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-700">{beat.detail}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
