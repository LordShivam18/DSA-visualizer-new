"use client";
import React from "react";
import { ModeCT } from "./ModeToggleCT";

export default function StatsPanelCT({
  idx,
  total,
  stackDepth,
  currentAction,
  mode,
}: {
  idx: number;
  total: number;
  stackDepth: number;
  currentAction: unknown;
  mode: ModeCT;
}) {
  return (
    <div className="bg-[#040512] border border-slate-800 rounded-xl p-3">
      <h4 className="text-slate-200 font-semibold">Run stats</h4>
      <div className="mt-2 text-xs text-slate-300 font-mono space-y-2">
        <div>
          Step: <span className="text-cyan-300">{idx}</span> / <span className="text-slate-400">{total - 1}</span>
        </div>
        <div>
          Call stack depth: <span className="text-emerald-300">{stackDepth}</span>
        </div>
        <div>
          Current action:
          <div className="mt-1 p-2 rounded-md bg-slate-900/40 border border-slate-800 text-xs">
            {currentAction ? JSON.stringify(currentAction) : "—"}
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-400">
        {mode === "beginner" ? (
          <>
            We build a map from inorder values → index first. Then for each preorder root we locate its inorder index, compute left subtree size, recurse left, then right.
          </>
        ) : (
          <>Expert tip: preIndex advances in preorder; tree partitions are defined by inorder indices. The map lookup makes each partition O(1).</>
        )}
      </div>
    </div>
  );
}
