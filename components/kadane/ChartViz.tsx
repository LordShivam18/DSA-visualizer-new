// components/kadane/ChartViz.tsx
"use client";

import React from "react";
import { TraceStep } from "./generateTrace";

export default function ChartViz({
  trace,
  cursor,
}: {
  trace: TraceStep[];
  cursor: number;
}) {
  const step = trace[cursor];
  if (!step) return null;

  // Build runningSum chart data
  const data = trace.map((t) => t.currentSum);

  return (
    <div className="p-4 bg-[#050b1a] rounded-2xl border border-slate-800">
      <h3 className="font-semibold mb-2">Running Sum</h3>

      <div className="flex gap-1 items-end h-40">
        {data.map((v, i) => {
          const isActive = i === cursor;
          return (
            <div
              key={i}
              className={`w-2 rounded-sm ${
                isActive ? "bg-cyan-400" : "bg-slate-600/40"
              }`}
              style={{ height: `${Math.abs(v) * 3}px` }}
            />
          );
        })}
      </div>
    </div>
  );
}
