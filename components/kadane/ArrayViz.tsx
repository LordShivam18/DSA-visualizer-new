// components/kadane/ArrayViz.tsx
"use client";

import React from "react";
import { TraceStep } from "./generateTrace";

export default function ArrayViz({
  trace,
  cursor,
  width = 940,
  height = 220,
}: {
  trace: TraceStep[];
  cursor: number;
  width?: number;
  height?: number;
}) {
  const step = trace[cursor];
  if (!step) return null;
  const nums = step.nums || [];

  const active = step.activeRange;
  const best = step.bestRange;

  const maxVal = Math.max(...nums.map((n) => Math.abs(n)));

  return (
    <div style={{ width }} className="relative overflow-hidden">
      <div className="grid grid-cols-9 gap-4 px-2 py-6">
        {nums.map((v, idx) => {
          const isActive =
            active && idx >= active[0] && idx <= active[1];

          const isBest =
            best && idx >= best[0] && idx <= best[1];

          const h = (Math.abs(v) / maxVal) * 140 + 12;

          const color = isBest
            ? "bg-teal-400/90"
            : isActive
            ? "bg-cyan-400/80"
            : "bg-slate-700/20";

          const glow = isBest
            ? "shadow-[0_0_18px_rgba(0,255,180,0.35)]"
            : isActive
            ? "shadow-[0_0_12px_rgba(56,189,248,0.25)]"
            : "";

          return (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`relative rounded-md border border-cyan-500/20 ${glow}`}
                style={{
                  width: 48,
                  height: h,
                  background: "linear-gradient(to top, #0f172a, #1e293b)",
                  borderColor: isActive ? "#22d3ee" : "#334155",
                }}
              >
                <div className={`absolute bottom-0 w-full ${color} rounded-md`} style={{ height: h }} />
              </div>

              <div className="text-xs mt-2 text-slate-300">{v}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
