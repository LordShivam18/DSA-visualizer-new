// components/math/plus-one/TracePanel.tsx
"use client";

import React from "react";
import { PlusOneStep } from "./generateTrace";

export default function TracePanel({
  trace,
  cursor,
}: {
  trace: PlusOneStep[];
  cursor: number;
}) {
  const s = trace[cursor];
  if (!s) return null;

  return (
    <div className="text-sm text-slate-300 space-y-2">
      <div>Step: <span className="text-cyan-400">{s.step}</span></div>
      <div>Index: {s.i >= 0 ? s.i : "-"}</div>
      <div>Old Digit: {s.oldDigit}</div>
      <div>New Digit: {s.newDigit}</div>
      <div className="text-cyan-300 font-medium">{s.action}</div>
    </div>
  );
}
