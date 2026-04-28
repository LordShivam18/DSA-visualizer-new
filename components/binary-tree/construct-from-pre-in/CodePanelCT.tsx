// components/binary-tree/construct-from-pre-in/CodePanelCT.tsx
"use client";
import React from "react";
import type { ConstructTraceStep } from "./generateTrace";

type Props = {
  trace: ConstructTraceStep[];
  cursor: number;
  mode?: "beginner" | "expert";
};

const SAMPLE_CODE = [
  "// 1. Build map from inorder values to indices",
  "indexMap = {}",
  "for i, val in enumerate(inorder):",
  "  indexMap[val] = i",
  "",
  "// 2. Recursive helper",
  "def build(preL, preR, inL, inR):",
  "  if preL > preR: return None",
  "  rootVal = preorder[preL]",
  "  rootIn = indexMap[rootVal]",
  "  leftSize = rootIn - inL",
  "  root.left = build(preL+1, preL+leftSize, inL, rootIn-1)",
  "  root.right = build(preL+leftSize+1, preR, rootIn+1, inR)",
  "  return root",
];

export default function CodePanelCT({ trace, cursor }: Props) {
  const step = trace[cursor] ?? null;
  let activeLine = 6;
  if (step?.type === "empty-range") activeLine = 7;
  if (step?.type === "pick-root") activeLine = 8;
  if (step?.type === "recurse-left") activeLine = 10;
  if (step?.type === "recurse-right") activeLine = 11;
  if (step?.type === "backtrack") activeLine = 12;

  return (
    <div className="bg-[#041022] border border-slate-800 rounded-2xl p-3 text-sm">
      <pre className="font-mono text-xs leading-6">
        {SAMPLE_CODE.map((line, i) => (
          <div key={i} className={`${activeLine === i ? "bg-gradient-to-r from-violet-700/60 to-cyan-700/30 px-2 rounded" : ""}`}>
            <code className={`${activeLine === i ? "text-white font-semibold" : "text-slate-300"}`}>{line}</code>
          </div>
        ))}
      </pre>
    </div>
  );
}
