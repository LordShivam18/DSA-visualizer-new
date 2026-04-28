// components/binary-tree/construct-from-pre-in/InorderBar.tsx
"use client";
import React from "react";
import { computeBarsLayout } from "./layoutEngine";
import type { ConstructTraceStep } from "./generateTrace";

type Props = {
  ino: number[];
  cursor: number;
  trace: ConstructTraceStep[];
  containerWidth?: number;
};

export default function InorderBar({ ino, cursor, trace, containerWidth = 940 }: Props) {
  const bars = computeBarsLayout(containerWidth, ino.length, { leftPadding: 40 });
  const step = trace[cursor] ?? null;
  const splitIndex = step?.rootInIndex ?? null; // we treat rootInIndex as split marker

  return (
    <div className="w-full mt-2" style={{ width: containerWidth }}>
      <div className="flex gap-3 px-4 py-2">
        {ino.map((v, i) => {
          const isMarked = splitIndex === i;
          return (
            <div
              key={i}
              className={`rounded-md px-4 py-2 font-mono text-sm bg-slate-900/60 border ${isMarked ? "border-violet-400 shadow-[0_0_16px_rgba(167,139,250,0.08)]" : "border-slate-800"}`}
              style={{ minWidth: bars.cellWidth - 10, textAlign: "center" }}
            >
              {v}
            </div>
          );
        })}
      </div>
      <div className="text-xs text-slate-500 px-4 mt-1">Inorder (split marker)</div>
    </div>
  );
}
