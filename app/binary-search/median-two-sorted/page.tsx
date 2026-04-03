"use client";

import { useState } from "react";
import ModeToggleM2, { ModeM2 } from "@/components/binary-search/median-two-sorted/ModeToggleM2";
import ArrayBar from "@/components/binary-search/median-two-sorted/ArrayBar";
import PartitionView from "@/components/binary-search/median-two-sorted/PartitionView";
import StatsPanelM2 from "@/components/binary-search/median-two-sorted/StatsPanelM2";
import CodePanelM2 from "@/components/binary-search/median-two-sorted/CodePanelM2";
import StoryTabs from "@/components/binary-search/median-two-sorted/StoryTabs";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";

const NUMS1 = [1, 3, 8];
const NUMS2 = [7, 9, 10, 11];
// NUMS1 is shorter on purpose

type Status = "ready" | "processing" | "done";

type Relation = "balanced" | "move-left" | "move-right" | "none";

type LastAction =
  | {
      kind: "iteration";
      relation: Relation;
      i: number;
      j: number;
      low: number;
      high: number;
      median?: number;
    }
  | null;

type Stage =
  | "intro"
  | "search"
  | "adjust-left"
  | "adjust-right"
  | "balanced"
  | "done";

const m = NUMS1.length;
const n = NUMS2.length;
const HALF = Math.floor((m + n + 1) / 2);

export default function MedianTwoSortedPage() {
  const [status, setStatus] = useState<Status>("ready");
  const [mode, setMode] = useState<ModeM2>("beginner");

  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(m);

  const [i, setI] = useState<number | null>(null);
  const [j, setJ] = useState<number | null>(null);
  const [median, setMedian] = useState<number | null>(null);
  const [lastAction, setLastAction] = useState<LastAction>(null);

  function reset() {
    setStatus("ready");
    setMode((prev) => prev); // keep mode
    setLow(0);
    setHigh(m);
    setI(null);
    setJ(null);
    setMedian(null);
    setLastAction(null);
  }

  function step() {
    if (status === "done") return;

    setStatus("processing");

    const currentLow = low;
    const currentHigh = high;

    const cutI = Math.floor((currentLow + currentHigh) / 2);
    const cutJ = HALF - cutI;

    const leftA =
      cutI > 0 ? NUMS1[cutI - 1] : Number.NEGATIVE_INFINITY;
    const rightA =
      cutI < m ? NUMS1[cutI] : Number.POSITIVE_INFINITY;

    const leftB =
      cutJ > 0 ? NUMS2[cutJ - 1] : Number.NEGATIVE_INFINITY;
    const rightB =
      cutJ < n ? NUMS2[cutJ] : Number.POSITIVE_INFINITY;

    setI(cutI);
    setJ(cutJ);

    let relation: Relation = "none";
    let newLow = currentLow;
    let newHigh = currentHigh;
    let newMedian: number | undefined = undefined;

    if (leftA <= rightB && leftB <= rightA) {
      relation = "balanced";

      const total = m + n;
      if (total % 2 === 1) {
        newMedian = Math.max(leftA, leftB);
      } else {
        newMedian =
          (Math.max(leftA, leftB) + Math.min(rightA, rightB)) / 2;
      }

      setMedian(newMedian);
      setStatus("done");
    } else if (leftA > rightB) {
      // i is too far right, move left
      relation = "move-left";
      newHigh = cutI - 1;
      setHigh(newHigh);
    } else {
      // leftB > rightA -> i too small, move right
      relation = "move-right";
      newLow = cutI + 1;
      setLow(newLow);
    }

    setLastAction({
      kind: "iteration",
      relation,
      i: cutI,
      j: cutJ,
      low: newLow,
      high: newHigh,
      median: newMedian,
    });
  }

  function activeCodeLine(): number {
    if (!lastAction || status === "ready") {
      return 5; // while (low <= high)
    }

    if (lastAction.relation === "balanced") {
      // inside return block
      return (m + n) % 2 === 1 ? 14 : 16;
    }

    if (lastAction.relation === "move-left") {
      return 18;
    }

    if (lastAction.relation === "move-right") {
      return 20;
    }

    return 6; // picking i, j
  }

  function explanation(): string {
    if (status === "ready") {
      return mode === "beginner"
        ? "We’ll treat the two sorted arrays as if they can be sliced by two vertical cuts i and j. Our goal is to place the cuts so that the left side holds exactly half of the elements."
        : "We run a binary search over i in the smaller array A. For each i we derive j so that i + j = (m + n + 1) / 2. A valid partition satisfies leftA ≤ rightB and leftB ≤ rightA; from there the median is determined in O(1).";
    }

    if (!lastAction) {
      return "Click Step again to move the partition and continue the search.";
    }

    const { relation, i, j } = lastAction;

    if (relation === "balanced") {
      return mode === "beginner"
        ? `With i = ${i} and j = ${j}, everything on the left side is ≤ everything on the right. We can now read the median from the border values.`
        : `The conditions leftA ≤ rightB and leftB ≤ rightA both hold. The partition is correct, so the median is max(leftA, leftB) for odd length, or the average with min(rightA, rightB) for even length.`;
    }

    if (relation === "move-left") {
      return mode === "beginner"
        ? `At this step, a value from A’s left side is too big for B’s right side. That means i is too far to the right, so we move it left.`
        : `We detected leftA > rightB. To restore order, we must decrease i, shrinking A’s contribution to the left partition. This halves the remaining search space.`;
    }

    if (relation === "move-right") {
      return mode === "beginner"
        ? `Now a value from B’s left side is too big for A’s right side. That means we need more from A on the left side, so we move i to the right.`
        : `We detected leftB > rightA. To make the left side smaller, we increase i so that more elements from A move to the left partition and fewer from B stay there.`;
    }

    return "We are trying a new pair of cuts (i, j) and checking whether the left and right sides are ordered correctly.";
  }

  function stage(): Stage {
    if (status === "ready") return "intro";
    if (!lastAction) return "search";

    if (status === "done" && lastAction.relation === "balanced") {
      return "done";
    }

    switch (lastAction.relation) {
      case "balanced":
        return "balanced";
      case "move-left":
        return "adjust-left";
      case "move-right":
        return "adjust-right";
      default:
        return "search";
    }
  }

  const currentRelation: Relation =
    lastAction?.relation ?? (status === "ready" ? "none" : "none");

  return (
    <div className="min-h-screen grid-pattern text-slate-50 flex flex-col items-center py-10 px-4 gap-8">
      <div className="w-full max-w-3xl"><BackButton href="/topics" label="Topics" /></div>
      {/* Title */}
      <header className="flex flex-col items-center gap-3 text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-sky-300 via-emerald-300 to-amber-300 bg-clip-text text-transparent">
            Median of Two Sorted Arrays
          </span>
        </h1>
        <p className="text-sm text-slate-400">
          A flagship visualization of the classic hard problem. Follow the
          moving partitions across two arrays and see how the median emerges
          from a single clean binary search.
        </p>
      </header>

      {/* Mode toggle */}
      <ModeToggleM2 mode={mode} onChange={setMode} />

      {/* Info row */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs mt-2">
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70 font-mono">
          A = <span className="text-sky-300">[{NUMS1.join(", ")}]</span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70 font-mono">
          B = <span className="text-rose-300">[{NUMS2.join(", ")}]</span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70 font-mono">
          total length = <span className="text-slate-100">{m + n}</span>
        </div>
        <div
          className={`px-4 py-1 rounded-full border text-xs ${
            status === "done"
              ? "border-emerald-500/60 text-emerald-300 bg-emerald-500/5"
              : status === "processing"
              ? "border-sky-500/60 text-sky-300 bg-sky-500/5"
              : "border-slate-600 text-slate-300 bg-slate-900/60"
          }`}
        >
          Status:{" "}
          {status === "ready"
            ? "Ready"
            : status === "processing"
            ? "Searching"
            : "Done"}
        </div>
      </div>

      {/* Main area */}
      <section className="w-full max-w-6xl flex flex-col lg:flex-row gap-6 mt-3">
        {/* Left: arrays + partition board */}
        <div className="flex-1 flex flex-col gap-4">
          <ArrayBar
            nums1={NUMS1}
            nums2={NUMS2}
            i={i}
            j={j}
            status={status}
          />

          <PartitionView
            nums1={NUMS1}
            nums2={NUMS2}
            i={i}
            j={j}
            relation={currentRelation}
          />

          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl px-5 py-4 text-sm text-slate-200">
            {explanation()}
          </div>
        </div>

        {/* Right: panels */}
        <div className="flex-1 flex flex-col gap-4">
          <StatsPanelM2
            nums1={NUMS1}
            nums2={NUMS2}
            i={i}
            j={j}
            status={status}
            median={median}
            relation={currentRelation}
            mode={mode}
          />
          <CodePanelM2 activeLine={activeCodeLine()} mode={mode} />
          <StoryTabs mode={mode} stage={stage()} />
        </div>
      </section>

      {/* Controls */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={step}
          disabled={status === "done"}
          className="px-7 py-2 rounded-xl text-sm font-medium
                     bg-slate-100 text-slate-900
                     hover:bg-white
                     disabled:bg-slate-700 disabled:text-slate-300
                     shadow-sm transition-all"
        >
          {status === "done" ? "Completed ✅" : "Step →"}
        </button>
        <button
          onClick={reset}
          className="px-7 py-2 rounded-xl text-sm font-medium
                     bg-slate-900 border border-slate-600
                     hover:bg-slate-800 hover:border-slate-400
                     transition-all"
        >
          Reset
        </button>
      </div>

      <OutputPanel result={median !== null ? `Median = ${median}` : null}
        success={status === "done" ? true : null} stepCount={0} complexity="O(log min(m,n))" visible={status === "done"} />
    </div>
  );
}
