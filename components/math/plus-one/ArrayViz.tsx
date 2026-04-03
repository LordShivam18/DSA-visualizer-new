// components/math/plus-one/ArrayViz.tsx
"use client";

import React from "react";
import { PlusOneStep } from "./generateTrace";

export default function ArrayViz({
  trace,
  cursor,
}: {
  trace: PlusOneStep[];
  cursor: number;
}) {
  const step = trace[cursor];
  if (!step) return null;
  const activeIndex = step.i;

  return (
    <div className="flex gap-3 items-center mt-4">
      {step.digits.map((digit, idx) => {
        const isActive = idx === activeIndex;
        const glow = isActive
          ? "shadow-[0_0_20px_#00eaff]"
          : "shadow-[0_0_6px_rgba(255,255,255,0.15)]";

        return (
          <div
            key={idx}
            className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-bold border
              border-slate-700 bg-[#0a0f1d] transition-all ${glow} ${
              isActive ? "text-cyan-300 border-cyan-400" : "text-slate-300"
            }`}
          >
            {digit}
          </div>
        );
      })}
    </div>
  );
}
