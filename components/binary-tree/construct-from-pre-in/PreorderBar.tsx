// components/binary-tree/construct-from-pre-in/PreorderBar.tsx
"use client";
import React from "react";
import { computeBarsLayout } from "./layoutEngine";
import type { ConstructTraceStep } from "./generateTrace";

type Props = {
  pre: number[];
  cursor: number;
  trace: ConstructTraceStep[];
  containerWidth?: number;
};

export default function PreorderBar({ pre, cursor, trace, containerWidth = 940 }: Props) {
  const bars = computeBarsLayout(containerWidth, pre.length, { leftPadding: 40 });
  // find current preIndex from trace[cursor]
  const step = trace[cursor] ?? null;
  const activePre = step?.preIndex ?? null;

  return (
    <div className="w-full" style={{ width: containerWidth }}>
      <div className="flex gap-3 px-4 py-2">
        {pre.map((v, i) => {
          const isActive = activePre === i;
          return (
            <div
              key={i}
              className={`rounded-md px-4 py-2 font-mono text-sm bg-slate-900/60 border ${isActive ? "border-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.08)]" : "border-slate-800"}`}
              style={{ minWidth: bars.cellWidth - 10, textAlign: "center" }}
            >
              {v}
            </div>
          );
        })}
      </div>
      <div className="text-xs text-slate-500 px-4 mt-1">Preorder (preIndex cursor)</div>
    </div>
  );
}
