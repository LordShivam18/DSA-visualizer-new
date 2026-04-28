// components/kadane/CodePanel.tsx
"use client";

import React from "react";
import { TraceStep } from "./generateTrace";

export default function CodePanel({
  trace,
  cursor,
}: {
  trace: TraceStep[];
  cursor: number;
}) {
  const activeLine = trace[cursor]?.activeRange ? 2 : 1;

  return (
    <pre className="text-sm bg-[#0a0f1f] p-4 rounded-xl border border-slate-700 whitespace-pre-wrap">
      {[
        "// Kadane's Algorithm",
        "for (let i = 0; i < n; i++) {",
        "    currentSum = max(nums[i], currentSum + nums[i]);",
        "    bestSum = max(bestSum, currentSum);",
        "}",
      ].map((line, index) => (
        <div
          key={line}
          className={index === activeLine ? "rounded bg-cyan-500/15 px-2 text-cyan-100" : ""}
        >
          {line}
        </div>
      ))}
    </pre>
  );
}
