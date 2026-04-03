"use client";

import { useState } from "react";

// Correct Mode Toggle Import
import ModeToggleCW, { ModeCW } 
  from "@/components/two-pointers/container-most-water/ModeToggleCW";

// Correct component imports
import WaterChart 
  from "@/components/two-pointers/container-most-water/WaterChart";
import StatsPanel 
  from "@/components/two-pointers/container-most-water/StatsPanel";
import CodePanel 
  from "@/components/two-pointers/container-most-water/CodePanel";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";

const HEIGHTS = [1, 8, 6, 2, 5, 4, 8, 3, 7];

type Status = "ready" | "running" | "done";

type ActionKind =
  | "compare"
  | "update-best"
  | "move-left"
  | "move-right"
  | "done";

export interface LastAction {
  kind: ActionKind;
  left: number;
  right: number;
  area: number;
  maxArea: number;
}

export default function ContainerMostWaterPage() {
  const [mode, setMode] = useState<ModeCW>("beginner");
  const [status, setStatus] = useState<Status>("ready");

  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(HEIGHTS.length - 1);

  const [maxArea, setMaxArea] = useState(0);
  const [bestLeft, setBestLeft] = useState<number | null>(null);
  const [bestRight, setBestRight] = useState<number | null>(null);

  const [lastAction, setLastAction] = useState<LastAction | null>(null);

  const currentWidth = Math.max(right - left, 0);
  const currentHeight =
    left < right ? Math.min(HEIGHTS[left], HEIGHTS[right]) : 0;
  const currentArea = currentWidth * currentHeight;

  function reset() {
    setLeft(0);
    setRight(HEIGHTS.length - 1);
    setMaxArea(0);
    setBestLeft(null);
    setBestRight(null);
    setLastAction(null);
    setStatus("ready");
  }

  function step() {
    if (status === "done") return;

    if (status === "ready") {
      setStatus("running");
    }

    if (left >= right) {
      setStatus("done");
      setLastAction({
        kind: "done",
        left,
        right,
        area: currentArea,
        maxArea,
      });
      return;
    }

    const width = right - left;
    const height = Math.min(HEIGHTS[left], HEIGHTS[right]);
    const area = width * height;

    let newMax = maxArea;
    let newBestL = bestLeft;
    let newBestR = bestRight;

    if (area > maxArea) {
      newMax = area;
      newBestL = left;
      newBestR = right;
      setLastAction({
        kind: "update-best",
        left,
        right,
        area,
        maxArea: newMax,
      });
    } else {
      setLastAction({
        kind: "compare",
        left,
        right,
        area,
        maxArea: newMax,
      });
    }

    // Move pointer from the smaller height side
    if (HEIGHTS[left] <= HEIGHTS[right]) {
      const nextLeft = left + 1;
      setLeft(nextLeft);
      setLastAction({
        kind: "move-left",
        left: nextLeft,
        right,
        area,
        maxArea: newMax,
      });
    } else {
      const nextRight = right - 1;
      setRight(nextRight);
      setLastAction({
        kind: "move-right",
        left,
        right: nextRight,
        area,
        maxArea: newMax,
      });
    }

    setMaxArea(newMax);
    setBestLeft(newBestL);
    setBestRight(newBestR);

    // If we just crossed pointers, mark done on next click
    if (left + 1 >= right - 1) {
      // next step will end
    }
  }

  function statusLabel() {
    if (status === "ready") return "Ready";
    if (status === "running") return "Scanning…";
    return "Done";
  }

  function explanation(): string {
    if (status === "ready") {
      return mode === "beginner"
        ? "We place a pointer at each end of the array. At every step, we compute the area between them and then move the pointer on the shorter line inward."
        : "Two-pointer technique: pointers start at extremes and move inward from the limiting side, because moving the taller line cannot increase the height of the container.";
    }

    if (!lastAction) {
      return "Click Step to start moving the two pointers and filling the water container.";
    }

    const { kind, area, maxArea: best, left: L, right: R } = lastAction;

    const hL = HEIGHTS[L] ?? "-";
    const hR = HEIGHTS[R] ?? "-";

    if (kind === "update-best") {
      return mode === "beginner"
        ? `We computed area = min(${hL}, ${hR}) × (${R} - ${L}) = ${area}. This beats our previous best, so we update max area → ${best}.`
        : `New maximum found: area = ${area}. Update best and keep shrinking the window from the limiting side.`;
    }

    if (kind === "move-left") {
      return mode === "beginner"
        ? `Left height ${hL} is ≤ right height ${hR}, so the left side is limiting the water height. We slide the left pointer one step to the right to search for a taller boundary.`
        : `Since height[L] ≤ height[R], moving R inward can only reduce width without increasing height. We move L++ to possibly increase the limiting height.`;
    }

    if (kind === "move-right") {
      return mode === "beginner"
        ? `Right height ${hR} is < left height ${hL}, so the right side is limiting the water height. We slide the right pointer one step to the left.`
        : `height[R] < height[L], so we move R--. This preserves the invariant that we discard only the limiting side.`;
    }

    if (kind === "compare") {
      return `We compute the current container area and then decide which pointer to move based on the smaller height.`;
    }

    if (kind === "done") {
      return mode === "beginner"
        ? `Pointers have met. We've tried every meaningful pair while always moving away from the smaller side. The recorded max area ${maxArea} is the answer.`
        : `Loop finished when L ≥ R. By always discarding the limiting side, we've explored all candidates that can beat the current best area.`;
    }

    return "We keep shrinking the window from the shorter side, updating the best area when we find a larger container.";
  }

  function activeCodeLine(): number {
    if (!lastAction) return 1;

    switch (lastAction.kind) {
      case "update-best":
        return 6;
      case "move-left":
        return 9;
      case "move-right":
        return 11;
      case "done":
        return 13;
      case "compare":
      default:
        return 4;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-slate-950 text-slate-50 flex flex-col items-center py-10 px-4 gap-10">
      <div className="w-full max-w-3xl"><BackButton href="/two-pointers" label="Two Pointers" /></div>
      {/* Hero header */}
      <header className="flex flex-col items-center gap-3 text-center">
        <p className="text-xs tracking-[0.3em] uppercase text-slate-500">
          Two Pointers · Visual Series
        </p>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Container With <span className="text-cyan-400">Most Water</span>
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Neon visualization of the classic two-pointer pattern: watch the
          container stretch, shrink, and fill with water as pointers move.
        </p>
      </header>

      {/* Mode + status pills */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <ModeToggleCW mode={mode} onChange={setMode} />
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70 text-xs flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
          Status: <span className="font-medium ml-1">{statusLabel()}</span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70 text-xs font-mono">
          heights = [1, 8, 6, 2, 5, 4, 8, 3, 7]
        </div>
      </div>

      {/* Main chart */}
      <section className="w-full max-w-6xl flex flex-col gap-6 items-center">
        <WaterChart
          heights={HEIGHTS}
          left={left}
          right={right}
          bestLeft={bestLeft}
          bestRight={bestRight}
          maxArea={maxArea}
          currentArea={currentArea}
          lastAction={lastAction}
        />

        {/* Explanation banner */}
        <div className="bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-900/90 border border-slate-800/80 rounded-2xl px-6 py-4 max-w-4xl text-center text-sm text-slate-200 shadow-[0_0_40px_rgba(15,23,42,0.9)]">
          {explanation()}
        </div>
      </section>

      {/* Bottom grid: stats + code */}
      <section className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-4">
        <StatsPanel
          heights={HEIGHTS}
          left={left}
          right={right}
          maxArea={maxArea}
          currentArea={currentArea}
          mode={mode}
        />
        <CodePanel activeLine={activeCodeLine()} />
      </section>

      {/* Controls */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={step}
          disabled={status === "done"}
          className="px-7 py-2 rounded-xl text-sm font-medium
                     bg-cyan-500 text-slate-950
                     hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-400
                     shadow-[0_0_35px_rgba(34,211,238,0.8)]
                     transition-all"
        >
          {status === "done" ? "Completed" : "Step →"}
        </button>
        <button
          onClick={reset}
          className="px-7 py-2 rounded-xl text-sm font-medium
                     bg-slate-950 border border-slate-700/80
                     hover:bg-slate-900 transition-all"
        >
          Reset
        </button>
      </div>

      <OutputPanel result={status === "done" ? `Maximum water area: ${maxArea}` : null}
        success={status === "done" ? true : null} stepCount={0} complexity="O(n)" visible={status === "done"} />
    </div>
  );
}
