"use client";

import { useState } from "react";

import ModeToggleBS, { ModeBS } 
  from "@/components/binary-search/search-insert-position/ModeToggleBS";

import BarView 
  from "@/components/binary-search/search-insert-position/BarView";

import StatsPanelBS 
  from "@/components/binary-search/search-insert-position/StatsPanelBS";

import CodePanelBS 
  from "@/components/binary-search/search-insert-position/CodePanelBS";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";


const NUMS = [1, 3, 5, 6];
const TARGET = 2; // classic example from LeetCode
type Status = "ready" | "running" | "done";

type LastAction =
  | {
      kind: "compare";
      mid: number;
      value: number;
      relation: "lt" | "gt";
    }
  | {
      kind: "done-found";
      index: number;
    }
  | {
      kind: "done-insert";
      index: number;
    }
  | null;

export default function SearchInsertPositionPage() {
  const [status, setStatus] = useState<Status>("ready");
  const [mode, setMode] = useState<ModeBS>("beginner");

  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(NUMS.length - 1);
  const [mid, setMid] = useState<number | null>(null);
  const [insertPos, setInsertPos] = useState<number | null>(null);
  const [lastAction, setLastAction] = useState<LastAction>(null);

  function reset() {
    setStatus("ready");
    setLeft(0);
    setRight(NUMS.length - 1);
    setMid(null);
    setInsertPos(null);
    setLastAction(null);
  }

  function step() {
    if (status === "done") return;

    if (status === "ready") {
      setStatus("running");
    }

    // if search range is empty -> we are done: insert at left
    if (left > right) {
      setStatus("done");
      setMid(null);
      setInsertPos(left);
      setLastAction({
        kind: "done-insert",
        index: left,
      });
      return;
    }

    const m = Math.floor((left + right) / 2);
    const value = NUMS[m];

    setMid(m);

    if (value === TARGET) {
      setStatus("done");
      setLeft(m);
      setRight(m);
      setInsertPos(m);
      setLastAction({
        kind: "done-found",
        index: m,
      });
      return;
    }

    if (value < TARGET) {
      const newLeft = m + 1;
      setLeft(newLeft);
      setLastAction({
        kind: "compare",
        mid: m,
        value,
        relation: "lt",
      });
    } else {
      const newRight = m - 1;
      setRight(newRight);
      setLastAction({
        kind: "compare",
        mid: m,
        value,
        relation: "gt",
      });
    }
  }

  function activeCodeLine(): number {
    if (status === "ready") return 2; // int l = 0, r = ...
    if (!lastAction) return 3; // while (l <= r)

    switch (lastAction.kind) {
      case "compare":
        return lastAction.relation === "lt" ? 6 : 7;
      case "done-found":
        return 5;
      case "done-insert":
        return 9;
      default:
        return 3;
    }
  }

  function explanation(): string {
    if (status === "ready") {
      return mode === "beginner"
        ? "We run classic binary search on a sorted array. At every step we look at the middle element and either return its index or shrink the search space."
        : "We maintain an invariant: the answer always lies in [l, r + 1). While l <= r, we choose mid, compare nums[mid] with target, and shrink the range accordingly. When the loop ends, l is the correct insert position.";
    }

    if (!lastAction) {
      return "Click Step to start the binary search.";
    }

    if (lastAction.kind === "compare") {
      const { mid, value, relation } = lastAction;

      if (mode === "beginner") {
        if (relation === "lt") {
          return `We look at mid index ${mid}, where nums[mid] = ${value}. Since nums[mid] < target (${TARGET}), anything on the left of mid is too small, so we move the left pointer just after mid.`;
        }
        return `We look at mid index ${mid}, where nums[mid] = ${value}. Since nums[mid] > target (${TARGET}), anything on the right of mid is too large, so we move the right pointer just before mid.`;
      } else {
        if (relation === "lt") {
          return `At mid = ${mid}, nums[mid] = ${value} < target (${TARGET}). We keep the invariant that the answer is in [mid + 1, r + 1) and set l = mid + 1.`;
        }
        return `At mid = ${mid}, nums[mid] = ${value} > target (${TARGET}). We keep the invariant that the answer is in [l, mid) and set r = mid - 1.`;
      }
    }

    if (lastAction.kind === "done-found") {
      if (mode === "beginner") {
        return `We hit nums[mid] == target at index ${lastAction.index}. Binary search stops and returns ${lastAction.index}.`;
      } else {
        return `Loop terminated because we found nums[mid] == target. The returned index ${lastAction.index} is the unique position where target appears.`;
      }
    }

    if (lastAction.kind === "done-insert") {
      if (mode === "beginner") {
        return `The search range became empty. The correct insert position is index ${lastAction.index}: putting ${TARGET} there keeps the array sorted.`;
      } else {
        return `When the loop exits with l = ${lastAction.index} and l > r, our invariant says the answer is l. Inserting ${TARGET} at index ${lastAction.index} preserves sorted order.`;
      }
    }

    return "We are shrinking the search range until we either find the target or determine where it should be inserted.";
  }

  return (
    <div className="min-h-screen grid-pattern text-slate-50 flex flex-col items-center py-10 px-4 gap-8">
      <div className="w-full max-w-3xl"><BackButton href="/topics" label="Topics" /></div>
      <header className="flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          <span className="text-cyan-400 drop-shadow-[0_0_18px_rgba(34,211,238,0.9)]">
            Search Insert Position
          </span>
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Neon binary search visual. Watch <span className="text-cyan-300">L</span>,{" "}
          <span className="text-violet-300">M</span>, and{" "}
          <span className="text-emerald-300">R</span> move as the search space
          shrinks down to the correct index.
        </p>
      </header>

      {/* Mode toggle */}
      <ModeToggleBS mode={mode} onChange={setMode} />

      {/* Info pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs mt-1">
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70 font-mono">
          nums ={" "}
          <span className="text-cyan-300">
            [{NUMS.join(", ")}]
          </span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70 font-mono">
          target = <span className="text-emerald-300">{TARGET}</span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70 font-mono">
          L = <span className="text-cyan-300">{left}</span>, R ={" "}
          <span className="text-emerald-300">{right}</span>
          {mid !== null && (
            <>
              , mid ={" "}
              <span className="text-violet-300">
                {mid}
              </span>
            </>
          )}
        </div>
        <div
          className={`px-4 py-1 rounded-full border text-xs ${
            status === "done"
              ? "border-emerald-500/60 text-emerald-400 bg-emerald-500/10"
              : status === "running"
              ? "border-cyan-500/60 text-cyan-300 bg-cyan-500/10"
              : "border-slate-600 text-slate-300 bg-slate-900/60"
          }`}
        >
          Status:{" "}
          {status === "ready"
            ? "Ready"
            : status === "running"
            ? "Running"
            : "Done"}
        </div>
      </div>

      {/* Main visual: array bars + panels */}
      <section className="w-full max-w-5xl flex flex-col gap-6 mt-2">
        <BarView
          nums={NUMS}
          left={left}
          right={right}
          mid={mid}
          target={TARGET}
          insertPos={insertPos}
          status={status}
        />

        {/* Explanation banner */}
        <div className="bg-[#050816] border border-slate-800/80 rounded-2xl px-6 py-4 text-sm text-slate-200 shadow-[0_0_40px_rgba(15,23,42,0.95)]">
          {explanation()}
        </div>

        {/* Bottom two panels: stats + code */}
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1.15fr)] gap-4">
          <StatsPanelBS
            nums={NUMS}
            left={left}
            right={right}
            mid={mid}
            target={TARGET}
            insertPos={insertPos}
            status={status}
            mode={mode}
          />
          <CodePanelBS activeLine={activeCodeLine()} mode={mode} />
        </div>
      </section>

      {/* Controls */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={step}
          disabled={status === "done"}
          className="px-7 py-2 rounded-xl text-sm font-medium
                     bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400
                     text-slate-950
                     hover:shadow-[0_0_32px_rgba(56,189,248,0.9)]
                     disabled:from-slate-700 disabled:via-slate-700 disabled:to-slate-700
                     disabled:text-slate-300
                     transition-all duration-200"
        >
          {status === "done" ? "Completed ✅" : "Step →"}
        </button>
        <button
          onClick={reset}
          className="px-7 py-2 rounded-xl text-sm font-medium
                     bg-slate-900/90 border border-slate-700
                     hover:bg-slate-800 hover:border-cyan-500
                     hover:shadow-[0_0_20px_rgba(129,140,248,0.7)]
                     transition-all duration-200"
        >
          Reset
        </button>
      </div>

      <OutputPanel result={insertPos !== null ? `Insert position: index ${insertPos}` : null}
        success={status === "done" ? true : null} stepCount={0} complexity="O(log n)" visible={status === "done"} />
    </div>
  );
}
