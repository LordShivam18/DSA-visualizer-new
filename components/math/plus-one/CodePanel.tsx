// components/math/plus-one/CodePanel.tsx
"use client";

import React from "react";
import { PlusOneStep } from "./generateTrace";

const codeLines = [
  "for (int i = n - 1; i >= 0; i--) {",
  "    if (digits[i] == 9) {",
  "        digits[i] = 0;",
  "    } else {",
  "        digits[i]++;",
  "        return digits;",
  "    }",
  "}",
  "digits.insert(digits.begin(), 1);",
  "return digits;",
];

export default function CodePanel({
  trace,
  cursor,
}: {
  trace: PlusOneStep[];
  cursor: number;
}) {
  if (!trace[cursor]) return null;
  const action = trace[cursor].action;

  function highlight(line: string) {
    if (action.includes("digit is 9")) return line.includes("if (digits[i] == 9)");
    if (action.includes("set digit to 0")) return line.includes("digits[i] = 0");
    if (action.includes("increment")) return line.includes("digits[i]++");
    if (action.includes("prepend")) return line.includes("insert");
    return false;
  }

  return (
    <pre className="text-sm bg-[#0b0f19] p-4 rounded-xl border border-slate-700 overflow-x-auto">
      {codeLines.map((line, idx) => (
        <div
          key={idx}
          className={`whitespace-pre ${
            highlight(line) ? "text-cyan-300 bg-cyan-500/10" : "text-slate-400"
          }`}
        >
          {line}
        </div>
      ))}
    </pre>
  );
}
