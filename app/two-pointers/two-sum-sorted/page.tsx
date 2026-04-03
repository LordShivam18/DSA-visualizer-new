"use client";

import { useState, useCallback } from "react";
import ModeToggle from "../../../components/two-sum/ModeToggle";
import ArrayCell from "@/components/two-sum/ArrayBox";
import InputPanel, { InputField, PresetExample } from "@/components/ui/InputPanel";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";
import { sounds } from "@/components/ui/SoundManager";

const inputFields: InputField[] = [
  { key: "nums", label: "Sorted array (comma-separated)", type: "array", placeholder: "e.g. 1,2,3,4,6,8,11", defaultValue: "1,2,3,4,6,8,11" },
  { key: "target", label: "Target sum", type: "number", placeholder: "e.g. 10", defaultValue: "10" },
];

const presets: PresetExample[] = [
  { name: "Example 1: target=10", values: { nums: "1,2,3,4,6,8,11", target: "10" } },
  { name: "Example 2: target=9", values: { nums: "2,7,11,15", target: "9" } },
];

const NUMS = [1, 2, 3, 4, 6, 8, 11];
const TARGET = 10;

type Status = "ready" | "searching" | "found" | "not-found";
type Mode = "beginner" | "expert";

type LastAction =
  | { kind: "start" }
  | { kind: "compare"; left: number; right: number; sum: number }
  | { kind: "move-left"; from: number; to: number; sum: number }
  | { kind: "move-right"; from: number; to: number; sum: number }
  | { kind: "done-found"; left: number; right: number; sum: number }
  | { kind: "done-not-found" }
  | null;

export default function TwoSumSortedVisualizer() {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(NUMS.length - 1);
  const [status, setStatus] = useState<Status>("ready");
  const [mode, setMode] = useState<Mode>("beginner");
  const [lastAction, setLastAction] = useState<LastAction>(null);

  const sum = left < right ? NUMS[left] + NUMS[right] : NaN;

  function step() {
    if (status === "found" || status === "not-found") return;

    if (status === "ready") {
      setStatus("searching");
      setLastAction({ kind: "start" });
      return;
    }

    // End condition before accessing
    if (left >= right) {
      setStatus("not-found");
      setLastAction({ kind: "done-not-found" });
      return;
    }

    const currentSum = NUMS[left] + NUMS[right];

    // Found pair
    if (currentSum === TARGET) {
      setStatus("found");
      setLastAction({ kind: "done-found", left, right, sum: currentSum });
      return;
    }

    // Move left pointer
    if (currentSum < TARGET) {
      if (left + 1 >= right) {
        setStatus("not-found");
        setLastAction({ kind: "done-not-found" });
        return;
      }
      setLastAction({ kind: "move-left", from: left, to: left + 1, sum: currentSum });
      setLeft((prev) => prev + 1);
      return;
    }

    // Move right pointer
    if (currentSum > TARGET) {
      if (right - 1 <= left) {
        setStatus("not-found");
        setLastAction({ kind: "done-not-found" });
        return;
      }
      setLastAction({ kind: "move-right", from: right, to: right - 1, sum: currentSum });
      setRight((prev) => prev - 1);
      return;
    }
  }

  function reset() {
    setLeft(0);
    setRight(NUMS.length - 1);
    setStatus("ready");
    setMode("beginner");
    setLastAction(null);
  }

  function statusLabel() {
    if (status === "ready") return "Ready";
    if (status === "searching") return "Searching…";
    if (status === "found") return "Pair found ✅";
    return "No pair ❌";
  }

  function explanation() {
    if (status === "ready") {
      return "Click Step to place two pointers at the ends of the sorted array. We will move them inward, comparing their sum with the target.";
    }

    if (lastAction?.kind === "start") {
      return "We start with left at the beginning and right at the end. At each step we compare nums[left] + nums[right] with the target.";
    }

    if (lastAction?.kind === "move-left") {
      return mode === "beginner"
        ? `The current sum (${lastAction.sum}) is LESS than the target ${TARGET}. To increase the sum, we move the LEFT pointer one step to the right.`
        : `sum < target ⇒ we need a larger value ⇒ increment left (since the array is sorted ascending).`;
    }

    if (lastAction?.kind === "move-right") {
      return mode === "beginner"
        ? `The current sum (${lastAction.sum}) is GREATER than the target ${TARGET}. To decrease the sum, we move the RIGHT pointer one step to the left.`
        : `sum > target ⇒ we need a smaller value ⇒ decrement right (largest element is too big).`;
    }

    if (lastAction?.kind === "done-found") {
      const l = lastAction.left;
      const r = lastAction.right;
      return mode === "beginner"
        ? `We found nums[${l}] + nums[${r}] = ${NUMS[l]} + ${NUMS[r]} = ${lastAction.sum}, which equals the target ${TARGET}. This is our answer.`
        : `Condition sum == target satisfied at indices (${l}, ${r}). We can return this pair.`;
    }

    if (lastAction?.kind === "done-not-found") {
      return "Left pointer has met or crossed the right pointer and we never saw sum == target. No such pair exists in this array.";
    }

    if (lastAction?.kind === "compare") {
      return `We compare nums[left] + nums[right] = ${lastAction.sum} with the target ${TARGET} and decide how to move the pointers.`;
    }

    return "We keep moving the pointers inward, shrinking the search window until we either find a matching pair or the pointers cross.";
  }

  function activeCodeLine(): number {
    if (status === "ready") return 1;
    if (!lastAction) return 2;

    switch (lastAction.kind) {
      case "start":
      case "compare":
        return 3;
      case "move-left":
        return 5;
      case "move-right":
        return 6;
      case "done-found":
        return 4;
      case "done-not-found":
        return 8;
      default:
        return 2;
    }
  }

  const hasValidPointers = left < right;
  const currentSum = hasValidPointers ? NUMS[left] + NUMS[right] : NaN;

  const outputResult = status === "found"
    ? `✅ Found pair: nums[${left}] + nums[${right}] = ${NUMS[left]} + ${NUMS[right]} = ${TARGET}`
    : status === "not-found"
    ? `❌ No pair found that sums to ${TARGET}`
    : null;

  return (
    <div className="min-h-screen grid-pattern text-slate-50 flex flex-col items-center py-10 px-4 gap-10">
      <div className="w-full max-w-3xl"><BackButton href="/two-pointers" label="Two Pointers" /></div>

      <InputPanel fields={inputFields} presets={presets} onRun={() => {}} accentColor="#22d3ee" />

      {/* Title */}
      <header className="flex flex-col items-center gap-3">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          Two Sum II —{" "}
          <span className="text-cyan-400">Sorted Array</span>
        </h1>
        <p className="text-sm text-slate-400">
          Visual + pointer-level explanation using the two-pointer technique
        </p>
      </header>

      {/* Mode toggle */}
      <ModeToggle mode={mode} onChange={setMode} />

      {/* Info pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs mt-3">
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70">
          Array:{" "}
          <span className="font-mono text-cyan-300 ml-1">
            [{NUMS.join(", ")}]
          </span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70">
          Target:{" "}
          <span className="font-mono text-emerald-300 ml-1">{TARGET}</span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70">
          Left index:{" "}
          <span className="font-mono ml-1">
            {left}
          </span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70">
          Right index:{" "}
          <span className="font-mono ml-1">
            {right}
          </span>
        </div>
        <div
          className={`px-4 py-1 rounded-full border text-xs ${
            status === "found"
              ? "border-emerald-500/60 text-emerald-400 bg-emerald-500/10"
              : status === "not-found"
              ? "border-red-500/60 text-red-400 bg-red-500/10"
              : "border-slate-600 text-slate-300 bg-slate-900/60"
          }`}
        >
          Status: {statusLabel()}
        </div>
      </div>

      {/* Main visual */}
      <section className="flex flex-col items-center gap-6 mt-4">
        {/* Array row */}
        <div className="flex items-center gap-4 px-4">
          {NUMS.map((value, index) => {
            let role: Parameters<typeof ArrayCell>[0]["role"] = "default";

            const inWindow = index >= left && index <= right;

            if (status === "found" && left < right) {
              if (index === left || index === right) role = "solution";
              else role = "discarded";
            } else if (!inWindow) {
              role = "discarded";
            } else if (index === left && index === right) {
              role = "both";
            } else if (index === left) {
              role = "left";
            } else if (index === right) {
              role = "right";
            } else if (index > left && index < right) {
              role = "between";
            }

            return <ArrayCell key={index} value={value} role={role} />;
          })}
        </div>

        {/* Sum panel */}
        <div className="mt-2">
          <div className="bg-[#050816] border border-slate-800/80 rounded-2xl px-6 py-3 text-sm text-slate-200 shadow-[0_0_26px_rgba(15,23,42,0.9)]">
            {hasValidPointers ? (
              <span>
                Currently checking:{" "}
                <span className="font-mono text-cyan-300">
                  nums[{left}] = {NUMS[left]}
                </span>{" "}
                and{" "}
                <span className="font-mono text-pink-300">
                  nums[{right}] = {NUMS[right]}
                </span>
                . Their sum is{" "}
                <span className="font-mono text-emerald-300">
                  {currentSum}
                </span>
                , compared to target{" "}
                <span className="font-mono text-amber-300">{TARGET}</span>.
              </span>
            ) : (
              <span>Pointers have met or crossed — no further pairs to check.</span>
            )}
          </div>
        </div>
      </section>

      {/* Explanation banner */}
      <div className="bg-[#050816] border border-slate-800/80 rounded-2xl px-6 py-4 max-w-3xl text-center text-sm text-slate-200 shadow-[0_0_32px_rgba(15,23,42,0.9)]">
        {explanation()}
      </div>

      {/* 3-panel explanation */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl mt-2">
        {/* Pointer intuition */}
        <div className="bg-[#050816] border border-slate-800/80 rounded-2xl p-4 text-sm flex flex-col gap-2">
          <h2 className="font-semibold text-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-emerald-400" />
            Pointer intuition
          </h2>
          <div className="mt-1 space-y-1 text-xs text-slate-300">
            <p>
              <span className="text-slate-500">Window:</span>{" "}
              <span className="font-mono text-cyan-300">
                [{left}, {right}]
              </span>
            </p>
            <p>
              <span className="text-slate-500">Current sum:</span>{" "}
              <span className="font-mono text-emerald-300">
                {hasValidPointers ? currentSum : "—"}
              </span>
            </p>
            <p>
              {mode === "beginner"
                ? "We shrink the window from the side that moves us closer to the target."
                : "Invariant: all unchecked pairs are within [left, right]. We discard impossible regions greedily."}
            </p>
          </div>
        </div>

        {/* Microscope */}
        <div className="bg-[#050816] border border-slate-800/80 rounded-2xl p-4 text-sm flex flex-col gap-2">
          <h2 className="font-semibold text-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-cyan-400" />
            Microscope: inside this window
          </h2>
          <div className="mt-1 text-xs text-slate-300 space-y-1">
            <p className="text-slate-400">Inside [left, right]:</p>
            <p className="font-mono">
              {NUMS.slice(left, right + 1).length > 0 ? (
                NUMS.slice(left, right + 1).join(", ")
              ) : (
                <span className="text-slate-500">[ empty ]</span>
              )}
            </p>
            {mode === "beginner" ? (
              <p>
                Left points to the smaller end; right points to the larger end.
                We only move one pointer at a time, never both.
              </p>
            ) : (
              <p>
                If sum &lt; target, any pair using nums[left] with an index
                &lt; right is too small, so we can safely discard nums[left].
                Similarly, sum &gt; target lets us discard nums[right].
              </p>
            )}
          </div>
        </div>

        {/* Code mapping */}
        <div className="bg-[#050816] border border-slate-800/80 rounded-2xl p-4 text-sm flex flex-col gap-2 font-mono">
          <h2 className="font-semibold text-slate-100 flex items-center gap-2 font-sans">
            <span className="w-1.5 h-4 rounded-full bg-indigo-400" />
            What this step is in code
          </h2>
          <pre className="mt-1 text-[11px] leading-relaxed text-slate-300">
            {[
              "1  int l = 0, r = n - 1;",
              "2  while (l < r) {",
              "3      int sum = nums[l] + nums[r];",
              "4      if (sum == target) return {l, r};",
              "5      else if (sum < target) l++;",
              "6      else r--;",
              "7  }",
              "8  return {-1, -1};",
            ].map((line, i) => {
              const lineNumber = i + 1;
              const active = activeCodeLine() === lineNumber;
              return (
                <div
                  key={i}
                  className={
                    active
                      ? "bg-cyan-500/10 border-l-2 border-cyan-400 px-2 -mx-2"
                      : ""
                  }
                >
                  {line}
                </div>
              );
            })}
          </pre>
        </div>
      </section>

      {/* Controls */}
      <div className="flex gap-4 mt-4">
        <button
          onClick={step}
          disabled={status === "found" || status === "not-found"}
          className="px-7 py-2 rounded-xl text-sm font-medium
                     bg-cyan-500 text-slate-950
                     hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-400
                     shadow-[0_0_30px_rgba(34,211,238,0.6)]
                     transition-all"
        >
          {status === "found" || status === "not-found" ? "Done" : "Step →"}
        </button>
        <button
          onClick={reset}
          className="px-7 py-2 rounded-xl text-sm font-medium
                     bg-slate-900 border border-slate-700
                     hover:bg-slate-800 transition-all"
        >
          Reset
        </button>
      </div>

      <OutputPanel result={outputResult} success={status === "found" ? true : status === "not-found" ? false : null}
        stepCount={0} complexity="O(n)" visible={status === "found" || status === "not-found"} />
    </div>
  );
}
