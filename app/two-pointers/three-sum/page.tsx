"use client";

import { useMemo, useState } from "react";
import ModeToggle from "@/components/two-sum/ModeToggle";
import ValueNode from "@/components/three-sum/ValueNode";
import PointerTag from "@/components/three-sum/PointerTag";
import SumBar from "@/components/three-sum/SumBar";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";

const NUMS = [-4, -1, -1, 0, 1, 2];

type Mode = "beginner" | "expert";
type Phase = "init" | "scanning" | "done";

type Triplet = {
  values: [number, number, number];
  indices: [number, number, number];
};

type LastAction =
  | { kind: "start"; i: number }
  | { kind: "compare"; i: number; left: number; right: number; sum: number }
  | { kind: "move-left"; i: number; left: number; right: number; sum: number }
  | { kind: "move-right"; i: number; left: number; right: number; sum: number }
  | {
      kind: "found";
      i: number;
      left: number;
      right: number;
      sum: number;
      triplet: [number, number, number];
    }
  | { kind: "advance-i"; i: number }
  | { kind: "done" }
  | null;

export default function ThreeSumPage() {
  const [nums] = useState<number[]>(() => [...NUMS]);
  const n = nums.length;

  const [mode, setMode] = useState<Mode>("beginner");
  const [phase, setPhase] = useState<Phase>("init");

  const [i, setI] = useState<number>(-1);
  const [left, setLeft] = useState<number>(-1);
  const [right, setRight] = useState<number>(-1);

  const [innerStep, setInnerStep] = useState<"compare" | "decide">("compare");
  const [triplets, setTriplets] = useState<Triplet[]>([]);
  const [lastAction, setLastAction] = useState<LastAction>(null);

  const currentSum =
    phase === "scanning" &&
    i >= 0 &&
    left >= 0 &&
    right >= 0 &&
    left < n &&
    right < n
      ? nums[i] + nums[left] + nums[right]
      : null;

  const solutionIndexSet = useMemo(() => {
    const set = new Set<number>();
    triplets.forEach((t) => {
      t.indices.forEach((idx) => set.add(idx));
    });
    return set;
  }, [triplets]);

  function step() {
    if (phase === "done") return;

    // First step: initialize pointers
    if (phase === "init") {
      const startI = 0;
      setI(startI);
      setLeft(startI + 1);
      setRight(n - 1);
      setPhase("scanning");
      setInnerStep("compare");
      setLastAction({ kind: "start", i: startI });
      return;
    }

    // We are in scanning phase
    if (phase === "scanning") {
      // base guard: no more pivots possible
      if (i >= n - 2) {
        setPhase("done");
        setLastAction({ kind: "done" });
        return;
      }

      // If current window for this i is exhausted, move i
      if (left >= right) {
        let nextI = i + 1;
        while (nextI < n - 2 && nums[nextI] === nums[nextI - 1]) nextI++;

        if (nextI >= n - 2) {
          setPhase("done");
          setLastAction({ kind: "done" });
        } else {
          setI(nextI);
          setLeft(nextI + 1);
          setRight(n - 1);
          setInnerStep("compare");
          setLastAction({ kind: "advance-i", i: nextI });
        }
        return;
      }

      const sum = nums[i] + nums[left] + nums[right];

      if (innerStep === "compare") {
        setLastAction({ kind: "compare", i, left, right, sum });
        setInnerStep("decide");
        return;
      }

      // innerStep === "decide"
      if (sum === 0) {
        const values: [number, number, number] = [
          nums[i],
          nums[left],
          nums[right],
        ];
        const indices: [number, number, number] = [i, left, right];

        setTriplets((prev) => {
          const exists = prev.some(
            (t) =>
              t.values[0] === values[0] &&
              t.values[1] === values[1] &&
              t.values[2] === values[2]
          );
          if (exists) return prev;
          return [...prev, { values, indices }];
        });

        setLastAction({ kind: "found", i, left, right, sum, triplet: values });

        // move L and R inward, skipping duplicates
        let newLeft = left + 1;
        let newRight = right - 1;
        const leftVal = nums[left];
        const rightVal = nums[right];

        while (newLeft < newRight && nums[newLeft] === leftVal) newLeft++;
        while (newLeft < newRight && nums[newRight] === rightVal) newRight--;

        setLeft(newLeft);
        setRight(newRight);
        setInnerStep("compare");
      } else if (sum < 0) {
        const newLeft = left + 1;
        setLeft(newLeft);
        setInnerStep("compare");
        setLastAction({ kind: "move-left", i, left: newLeft, right, sum });
      } else {
        const newRight = right - 1;
        setRight(newRight);
        setInnerStep("compare");
        setLastAction({ kind: "move-right", i, left, right: newRight, sum });
      }
    }
  }

  function reset() {
    setPhase("init");
    setI(-1);
    setLeft(-1);
    setRight(-1);
    setInnerStep("compare");
    setTriplets([]);
    setLastAction(null);
  }

  function explanation(): string {
    if (phase === "init") {
      return mode === "beginner"
        ? "We first sort the array. We will fix a pivot index i, then slide two pointers L and R to search for triplets that sum to 0."
        : "Classic 3Sum: sort nums, then for each pivot i we run a 2-sum on the suffix [i+1, n). We skip duplicate pivots to keep the result unique.";
    }

    if (!lastAction) {
      return "Click Step to start exploring triplets with i, L and R.";
    }

    switch (lastAction.kind) {
      case "start":
        return mode === "beginner"
          ? `We fix our first pivot i at index ${lastAction.i}. L starts just after i and R starts at the end of the array.`
          : "For this pivot i, we run a two-pointer sweep between L and R.";
      case "compare": {
        const { sum } = lastAction;
        if (sum === 0) {
          return mode === "beginner"
            ? "The three numbers add up exactly to 0! Next we will record this triplet and move both pointers inward, skipping duplicates."
            : "Sum is 0 → we found a valid triplet. We add it and shrink the window while skipping identical values.";
        }
        if (sum < 0) {
          return mode === "beginner"
            ? "The sum is less than 0. To increase the sum, we should move L to the right (towards larger numbers)."
            : "sum < 0 → we need a larger value, so we increase L.";
        }
        return mode === "beginner"
          ? "The sum is greater than 0. To decrease the sum, we should move R to the left (towards smaller numbers)."
          : "sum > 0 → we need a smaller value, so we decrease R.";
      }
      case "move-left":
        return mode === "beginner"
          ? "We move L one step to the right to try a larger number while keeping i and R fixed."
          : "Adjusted L++ because sum < 0 for this configuration.";
      case "move-right":
        return mode === "beginner"
          ? "We move R one step to the left to try a smaller number while keeping i and L fixed."
          : "Adjusted R-- because sum > 0 for this configuration.";
      case "found":
        return mode === "beginner"
          ? `We found a triplet [${lastAction.triplet.join(
              ", "
            )}] that sums to 0. We record it and then move both L and R inward, skipping duplicate values.`
          : `Triplet [${lastAction.triplet.join(
              ", "
            )}] is added. The window will shrink while skipping duplicates to avoid repeated triplets.`;
      case "advance-i":
        return mode === "beginner"
          ? `We exhausted all pairs for the previous pivot. Now we move i to the next distinct value and reset L and R.`
          : "Outer loop: advanced i to the next unique pivot value.";
      case "done":
        return mode === "beginner"
          ? "We have tried all valid pivots. All triplets that sum to 0 have been discovered for this array."
          : "No more pivots i are possible (or nums[i] > 0). The algorithm has finished.";
      default:
        return "We are exploring the search space of triplets with two pointers.";
    }
  }

  function activeCodeLine(): number {
    if (!lastAction) return 1;

    switch (lastAction.kind) {
      case "start":
      case "advance-i":
        return 2; // inside for loop
      case "compare":
        return 4; // if (i > 0 && nums[i] == nums[i-1]) continue;
      case "move-left":
        return 11; // left++
      case "move-right":
        return 13; // right--
      case "found":
        return 8; // we found a triplet
      case "done":
        return 16; // return result;
      default:
        return 2;
    }
  }

  const currentA =
    phase === "scanning" && i >= 0 && i < n ? nums[i] : null;
  const currentB =
    phase === "scanning" && left >= 0 && left < n ? nums[left] : null;
  const currentC =
    phase === "scanning" && right >= 0 && right < n ? nums[right] : null;

  return (
    <div className="min-h-screen grid-pattern text-slate-50 flex flex-col items-center py-10 px-4 gap-10">
      <div className="w-full max-w-3xl"><BackButton href="/two-pointers" label="Two Pointers" /></div>
      {/* Title */}
      <header className="flex flex-col items-center gap-3">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          <span className="text-cyan-400">3</span>Sum – Two Pointer View
        </h1>
        <p className="text-sm text-slate-400">
          Fix a pivot i and slide L, R to discover all unique triplets that sum
          to 0.
        </p>
      </header>

      {/* Mode toggle */}
      <ModeToggle mode={mode} onChange={setMode} />

      {/* Info pills */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs mt-2">
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70">
          nums:{" "}
          <span className="font-mono text-cyan-300 ml-1">
            [{nums.join(", ")}]
          </span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70">
          i:{" "}
          <span className="font-mono ml-1">
            {i >= 0 && i < n ? i : phase === "done" ? "done" : "—"}
          </span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70">
          L:{" "}
          <span className="font-mono ml-1">
            {left >= 0 && left < n ? left : phase === "done" ? "—" : "—"}
          </span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70">
          R:{" "}
          <span className="font-mono ml-1">
            {right >= 0 && right < n ? right : phase === "done" ? "—" : "—"}
          </span>
        </div>
        <div className="px-4 py-1 rounded-full border border-slate-700 bg-slate-900/70">
          Triplets found:{" "}
          <span className="font-mono ml-1">{triplets.length}</span>
        </div>
      </div>

      {/* Main visual */}
      <section className="flex flex-col items-center gap-8 mt-4">
        {/* Nodes row */}
        <div className="flex flex-col items-center gap-2">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-1">
            Sorted array
          </div>

          <div className="flex items-center gap-3">
            {nums.map((v, idx) => (
              <ValueNode
                key={idx}
                value={v}
                index={idx}
                isPivot={idx === i}
                isLeft={idx === left}
                isRight={idx === right}
                isInSolution={solutionIndexSet.has(idx)}
              />
            ))}
          </div>

          {/* Pointer row */}
          <div className="flex items-center gap-3 h-6 mt-2">
            {nums.map((_, idx) => (
              <div key={idx} className="w-14 flex justify-center">
                {idx === i && phase !== "done" && i >= 0 && <PointerTag label="i" />}
                {idx === left &&
                  phase === "scanning" &&
                  left >= 0 &&
                  left < n && <PointerTag label="L" />}
                {idx === right &&
                  phase === "scanning" &&
                  right >= 0 &&
                  right < n && <PointerTag label="R" />}
              </div>
            ))}
          </div>
        </div>

        {/* Sum explanation bar */}
        <SumBar a={currentA} b={currentB} c={currentC} sum={currentSum} />

        <p className="text-xs text-slate-500">
          For each pivot i, we slide L and R to test candidate triplets while
          skipping duplicates.
        </p>
      </section>

      {/* Explanation banner */}
      <div className="bg-[#050816] border border-slate-800/80 rounded-2xl px-6 py-4 max-w-3xl text-center text-sm text-slate-200 shadow-[0_0_32px_rgba(15,23,42,0.9)]">
        {explanation()}
      </div>

      {/* Bottom 3-panel explanation */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-6xl mt-2">
        {/* Pointer intuition */}
        <div className="bg-[#050816] border border-slate-800/80 rounded-2xl p-4 text-sm flex flex-col gap-2">
          <h2 className="font-semibold text-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-emerald-400" />
            Pointer intuition
          </h2>
          <div className="mt-1 space-y-1 text-xs text-slate-300">
            <p>
              <span className="text-slate-500">Pivot i:</span>{" "}
              <span className="font-mono text-cyan-300">
                {i >= 0 && i < n ? `${i} (value ${nums[i]})` : "not set"}
              </span>
            </p>
            <p>
              <span className="text-slate-500">Window [L, R]:</span>{" "}
              <span className="font-mono text-cyan-300">
                {left >= 0 && right >= 0
                  ? `[${left}, ${right}]`
                  : phase === "done"
                  ? "finished"
                  : "—"}
              </span>
            </p>
            <p>
              <span className="text-slate-500">Idea:</span>{" "}
              {mode === "beginner"
                ? "For each pivot, we squeeze the window from both sides until all pairs for that pivot are explored."
                : "Invariant: for a fixed i, any solution triplet must have its other two elements inside [L, R]. We shrink this interval monotonically."}
            </p>
          </div>
        </div>

        {/* Microscope: triplets */}
        <div className="bg-[#050816] border border-slate-800/80 rounded-2xl p-4 text-sm flex flex-col gap-2">
          <h2 className="font-semibold text-slate-100 flex items-center gap-2">
            <span className="w-1.5 h-4 rounded-full bg-cyan-400" />
            Microscope: discovered triplets
          </h2>
          <div className="mt-1 text-xs text-slate-300 space-y-2">
            {triplets.length === 0 ? (
              <p className="text-slate-500">No triplets found yet.</p>
            ) : (
              triplets.map((t, idx) => (
                <p key={idx} className="font-mono">
                  {idx + 1}.{" "}
                  <span className="text-emerald-300">
                    [{t.values.join(", ")}]
                  </span>
                </p>
              ))
            )}
            {mode === "beginner" ? (
              <p>
                We only keep triplets that are{" "}
                <span className="text-emerald-300">unique</span> and sum to 0.
              </p>
            ) : (
              <p>
                Uniqueness is enforced by skipping duplicate pivot values and by
                skipping repeated values when moving L and R after a match.
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
              "1  sort(nums.begin(), nums.end());",
              "2  for (int i = 0; i < n; i++) {",
              "3      if (i > 0 && nums[i] == nums[i-1]) continue;",
              "4      int left = i + 1, right = n - 1;",
              "5      while (left < right) {",
              "6          int sum = nums[i] + nums[left] + nums[right];",
              "7          if (sum == 0) {",
              "8              // record triplet and skip duplicates",
              "9              left++; right--;",
              "10         } else if (sum < 0) {",
              "11             left++;",
              "12         } else {",
              "13             right--;",
              "14         }",
              "15     }",
              "16 }",
            ].map((line, idx) => {
              const lineNumber = idx + 1;
              const active = activeCodeLine() === lineNumber;
              return (
                <div
                  key={idx}
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
          disabled={phase === "done"}
          className="px-7 py-2 rounded-xl text-sm font-medium
                     bg-cyan-500 text-slate-950
                     hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-400
                     shadow-[0_0_30px_rgba(34,211,238,0.6)]
                     transition-all"
        >
          {phase === "done" ? "Done" : "Step →"}
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

      <OutputPanel result={phase === "done" ? `Found ${triplets.length} triplet(s) summing to 0` : null}
        success={phase === "done" ? true : null} stepCount={0} complexity="O(n\u00B2)" visible={phase === "done"} />
    </div>
  );
}
