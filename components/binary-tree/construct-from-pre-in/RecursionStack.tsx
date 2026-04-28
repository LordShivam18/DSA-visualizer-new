// components/binary-tree/construct-from-pre-in/RecursionStack.tsx
"use client";
import React, { useEffect, useRef } from "react";
import type { ConstructTraceStep } from "./generateTrace";

type Props = { trace: ConstructTraceStep[]; cursor: number };

export default function RecursionStack({ trace, cursor }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Build stack snapshot from trace up to current cursor (simple heuristic)
  const stack = [];
  for (let i = 0; i <= cursor; i++) {
    const s = trace[i];
    if (!s) continue;
    if (s.type === "pick-root") stack.push(`build( root=${s.nodeId ?? s.preIndex}, depth=${stack.length + 1})`);
    if (s.type === "backtrack") stack.push(`return from ${s.nodeId}`);
    if (s.type === "empty-range") stack.push(`return empty: ${JSON.stringify(s.inRange)}`);
  }

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [cursor]);

  return (
    <div ref={containerRef} className="h-64 overflow-auto">
      <div className="space-y-2">
        {stack.map((s, i) => (
          <div key={i} className="bg-[#071022] border border-slate-800 rounded-md px-3 py-2 text-xs font-mono text-slate-200">
            {s}
          </div>
        ))}
      </div>
      <div className="text-xs text-slate-500 mt-2">Recursion stack (top at bottom)</div>
    </div>
  );
}
