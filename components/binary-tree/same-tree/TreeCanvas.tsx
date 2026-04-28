// components/binary-tree/same-tree/TreeCanvas.tsx
"use client";

import React from "react";
import { TraceStep } from "./generateTrace";

type Props = {
  trace: TraceStep[];
  cursor: number;
  width?: number;
  height?: number;
};

/**
 * Minimal canvas: we render two small node crowds (leftTree, rightTree)
 * and color nodes according to current step:
 *  - comparing: glowing cyan
 *  - equal: glowing green
 *  - mismatch: glowing red
 *
 * Node positions are fixed for clarity (no spring).
 */

export default function TreeCanvas({ trace, cursor, width = 940, height = 420 }: Props) {
  const step = trace[cursor];
  // visible nodes snapshot at this step
  const left = step?.leftNodes ?? [];
  const right = step?.rightNodes ?? [];

  // helper to render nodes horizontally spaced
  const renderNodesRow = (nodes: number[], side: "left" | "right") => {
    const leftPadding = side === "left" ? 80 : 460;
    return nodes.map((v, i) => {
      const x = leftPadding + (i * 64);
      // decide style: highlight if this node is active / compared
      const isActive =
        step?.comparePair && (step.comparePair.leftVal === v || step.comparePair.rightVal === v);
      const result = step?.result;
      const matchColor =
        isActive && result === "equal" ? "glow-green" : isActive && result === "diff" ? "glow-red" : "glow-cyan";

      return (
        <div
          key={`${side}-${i}-${v}`}
          style={{
            position: "absolute",
            left: x - 20,
            top: side === "left" ? height - 110 : height - 110,
            width: 40,
            height: 40,
            transform: "translateZ(0)",
          }}
        >
          <div
            className={`w-10 h-10 rounded-full border-2 border-cyan-300 flex items-center justify-center text-xs font-mono ${matchColor}`}
            style={{
              background: "rgba(6,14,20,0.25)",
              boxShadow: isActive
                ? "0 8px 28px rgba(56,189,248,0.14), 0 0 24px rgba(56,189,248,0.08)"
                : "none",
              transition: "box-shadow 220ms ease, transform 180ms ease, opacity 220ms",
            }}
          >
            <span className="text-cyan-100">{v}</span>
          </div>
        </div>
      );
    });
  };

  // edges: for same-tree we don't draw full tree edges — keep minimal and clean.
  return (
    <div style={{ width, height }} className="relative rounded-lg overflow-visible">
      {/* left row */}
      <div className="absolute left-0 top-8 px-4 text-slate-400 text-sm">Tree A</div>
      <div className="absolute left-420 top-8 px-4 text-slate-400 text-sm">Tree B</div>

      {/* nodes */}
      {renderNodesRow(left, "left")}
      {renderNodesRow(right, "right")}
    </div>
  );
}
