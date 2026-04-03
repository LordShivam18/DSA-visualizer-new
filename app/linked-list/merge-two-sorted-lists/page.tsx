"use client";

import { useState, useCallback } from "react";
import MergeNode from "@/components/linked-list/merge-two-sorted-lists/MergeNode";
import MergeArrow from "@/components/linked-list/merge-two-sorted-lists/MergeArrow";
import MergePointer from "@/components/linked-list/merge-two-sorted-lists/MergePointer";
import InputPanel, { InputField, PresetExample } from "@/components/ui/InputPanel";
import OutputPanel from "@/components/ui/OutputPanel";
import BackButton from "@/components/ui/BackButton";
import { sounds } from "@/components/ui/SoundManager";

const inputFields: InputField[] = [
  { key: "l1", label: "List 1 (sorted, comma-separated)", type: "array", placeholder: "e.g. 1,3,5", defaultValue: "1,3,5" },
  { key: "l2", label: "List 2 (sorted, comma-separated)", type: "array", placeholder: "e.g. 2,4,6", defaultValue: "2,4,6" },
];

const presets: PresetExample[] = [
  { name: "Example 1: [1,3,5] + [2,4,6]", values: { l1: "1,3,5", l2: "2,4,6" } },
  { name: "Example 2: [1,2,4] + [1,3,4]", values: { l1: "1,2,4", l2: "1,3,4" } },
];

export default function MergeTwoSortedLists() {
  const [l1, setL1] = useState([1, 3, 5]);
  const [l2, setL2] = useState([2, 4, 6]);
  const [i1, setI1] = useState(0);
  const [i2, setI2] = useState(0);
  const [result, setResult] = useState<number[]>([]);
  const [explanation, setExplanation] = useState("Click Step to begin merging.");
  const [stepCount, setStepCount] = useState(0);

  const NODE_GAP = 80;
  const p1Pos = i1 * NODE_GAP;
  const p2Pos = i2 * NODE_GAP;
  const isDone = i1 >= l1.length && i2 >= l2.length && result.length > 0;

  const handleRun = useCallback((values: Record<string, string>) => {
    const list1 = values.l1.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
    const list2 = values.l2.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
    if (list1.length === 0 || list2.length === 0) return;
    setL1(list1); setL2(list2);
    setI1(0); setI2(0); setResult([]); setStepCount(0);
    setExplanation("Click Step to begin merging."); sounds.click();
  }, []);

  function step() {
    if (i1 >= l1.length && i2 >= l2.length) return;
    setStepCount((c) => c + 1);
    const x = i1 < l1.length ? l1[i1] : Infinity;
    const y = i2 < l2.length ? l2[i2] : Infinity;

    if (x <= y) {
      setResult((prev) => [...prev, x]);
      setExplanation(`Pick ${x} from List 1.`);
      if (i1 < l1.length) setI1(i1 + 1);
    } else {
      setResult((prev) => [...prev, y]);
      setExplanation(`Pick ${y} from List 2.`);
      if (i2 < l2.length) setI2(i2 + 1);
    }
    sounds.tick();
  }

  function reset() {
    setI1(0); setI2(0); setResult([]); setStepCount(0);
    setExplanation("Click Step to begin merging."); sounds.reset();
  }

  return (
    <div className="min-h-screen grid-pattern text-white px-8 py-12 flex flex-col items-center gap-10">
      <div className="w-full max-w-3xl"><BackButton href="/linked-list" label="Linked List" /></div>

      <h1 className="text-4xl font-bold">
        <span className="text-cyan-400 text-glow-cyan">Merge</span> Two Sorted Lists
      </h1>

      <InputPanel fields={inputFields} presets={presets} onRun={handleRun} accentColor="#22d3ee" />

      <div className="flex gap-10 flex-wrap justify-center">
        {/* List 1 */}
        <div className="glass-card p-6">
          <h2 className="text-lg mb-3 text-cyan-300 font-semibold">List 1</h2>
          <div className="relative h-10 w-full mb-2"><MergePointer type="p1" position={p1Pos} /></div>
          <div className="flex items-center gap-2">
            {l1.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <MergeNode value={v} />{i < l1.length - 1 && <MergeArrow />}
              </div>
            ))}
          </div>
        </div>

        {/* List 2 */}
        <div className="glass-card p-6">
          <h2 className="text-lg mb-3 text-violet-300 font-semibold">List 2</h2>
          <div className="relative h-10 w-full mb-2"><MergePointer type="p2" position={p2Pos} /></div>
          <div className="flex items-center gap-2">
            {l2.map((v, i) => (
              <div key={i} className="flex items-center gap-2">
                <MergeNode value={v} />{i < l2.length - 1 && <MergeArrow />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card px-6 py-3 text-center max-w-xl text-sm">{explanation}</div>

      {result.length > 0 && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-emerald-300 mr-2 uppercase tracking-wider">Merged</span>
          {result.map((v, i) => <MergeNode key={i} value={v} />)}
        </div>
      )}

      <div className="flex gap-6">
        <button onClick={step} disabled={isDone} className="btn-neon btn-neon-cyan px-8 py-3">
          {isDone ? "Done ✅" : "Step →"}
        </button>
        <button onClick={reset} className="btn-neon btn-ghost px-8 py-3">Reset</button>
      </div>

      <OutputPanel result={isDone ? `Merged: [${result.join(", ")}]` : null} success={isDone ? true : null} stepCount={stepCount} complexity="O(m+n)" visible={isDone} />
    </div>
  );
}
